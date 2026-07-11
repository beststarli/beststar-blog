#!/usr/bin/env node

/**
 * 构建时脚本：扫描 docs/ 下所有 markdown 文件，
 * 切分、向量化、生成 public/embeddings.json
 *
 * 用法：node scripts/build-embeddings.mjs
 * 环境变量：OPENAI_API_KEY（必填）- 用于 embedding
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { resolve, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = resolve(fileURLToPath(import.meta.url), '..')
const ROOT = resolve(__dirname, '..')

// ── 读取 .env ──

const envPath = join(ROOT, '.env')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const k = t.slice(0, i).trim()
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[k]) process.env[k] = v
  }
}

const API_KEY = process.env.OPENAI_API_KEY
if (!API_KEY) {
  console.warn('[embeddings] 未设置 OPENAI_API_KEY，跳过（不影响构建）')
  console.warn('[embeddings] 可在 .env 中添加，或用 SiliconFlow 等兼容服务')
  process.exit(0)
}

const BASE_URL = process.env.EMBEDDING_BASE_URL || 'https://api.openai.com/v1'
const MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small'

// ── 扫描 md 文件 ──

const DOCS_DIR = join(ROOT, 'docs')

async function scanMdFiles(dir) {
  const files = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = join(dir, e.name)
    if (e.isDirectory()) {
      files.push(...(await scanMdFiles(p)))
    }
    else if (extname(e.name) === '.md') {
      files.push(p)
    }
  }
  return files
}

// ── 切分文本 ──

const CHUNK_SIZE = 500
const CHUNK_OVERLAP = 50

function splitIntoChunks(text, source) {
  text = text.replace(/^---[\s\S]*?---\n*/, '').replace(/^#+\s+.*$/gm, '').trim()
  if (!text) return []

  const chunks = []
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean)
  let current = ''

  for (const para of paragraphs) {
    const clean = para.replace(/\n/g, ' ').trim()
    if (!clean) continue
    if (current.length + clean.length < CHUNK_SIZE) {
      current += (current ? '\n' : '') + clean
    }
    else {
      if (current) chunks.push({ text: current, source })
      const overlap = current.slice(-CHUNK_OVERLAP)
      current = (overlap ? overlap + '\n' : '') + clean
    }
  }
  if (current) chunks.push({ text: current, source })
  return chunks
}

// ── 调 Embedding API（兼容 OpenAI 和 MiniMax 格式）──

async function embed(texts, type = 'db') {
  const isMiniMax = BASE_URL.includes('minimax')
  const body = isMiniMax
    ? { model: MODEL, texts, type }
    : { model: MODEL, input: texts }

  const res = await fetch(`${BASE_URL}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Embedding API error: ${res.status} ${err}`)
  }
  const data = await res.json()

  // MiniMax: { vectors: [[...], [...]] }
  // OpenAI:  { data: [{ embedding: [...] }, ...] }
  if (isMiniMax) {
    if (!data.vectors) {
      throw new Error(`MiniMax API error: ${JSON.stringify(data.base_resp)}`)
    }
    return data.vectors.map((vec, i) => ({
      text: texts[i],
      source: '',
      vector: vec,
    }))
  }
  return data.data.map((d, i) => ({
    text: texts[i],
    source: '',
    vector: d.embedding,
  }))
}

// ── 主流程 ──

async function main() {
  console.log('[embeddings] 扫描 docs/ 目录...')
  const files = await scanMdFiles(DOCS_DIR)
  console.log(`[embeddings] 找到 ${files.length} 个 markdown 文件`)

  const allChunks = []
  for (const file of files) {
    const content = readFileSync(file, 'utf-8')
    const source = relative(ROOT, file)
    allChunks.push(...splitIntoChunks(content, source))
  }
  console.log(`[embeddings] 切分后共 ${allChunks.length} 个段落`)

  // API 有 batch 限制
  const BATCH = 50
  const results = []
  for (let i = 0; i < allChunks.length; i += BATCH) {
    const batch = allChunks.slice(i, i + BATCH)
    console.log(`[embeddings] 向量化 ${i + 1}-${Math.min(i + BATCH, allChunks.length)}/${allChunks.length} ...`)
    const embeddings = await embed(batch.map(c => c.text))
    embeddings.forEach((e, j) => { e.source = batch[j].source })
    results.push(...embeddings)
    if (i + BATCH < allChunks.length) await new Promise(r => setTimeout(r, 10000))
  }

  const outPath = join(ROOT, 'public', 'embeddings.json')
  writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8')
  console.log(`[embeddings] ✅ public/embeddings.json 已生成 (${results.length} 条)`)
}

main().catch((err) => {
  console.error('[embeddings] 失败:', err.message)
  process.exit(1)
})
