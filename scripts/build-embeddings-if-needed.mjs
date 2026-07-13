#!/usr/bin/env node

/**
 * 包装脚本：仅在当日首次 Vercel 构建时执行 build-embeddings.mjs
 *
 * 每次成功生成后，在 .vercel/cache/ 中写入当天的日期标记。
 * Vercel 的构建缓存机制会跨部署持久化该目录，因此：
 *  - 当天第 1 次部署 → 正常执行 embedding 生成
 *  - 当天第 2+ 次部署 → 看到日期标记，跳过（节省 API 费用）
 *
 * 用法：node scripts/build-embeddings-if-needed.mjs
 *
 * 若要强制重新生成，可手动删除 .vercel/cache/embedding-date.txt
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const __dirname = resolve(fileURLToPath(import.meta.url), '..')
const ROOT = resolve(__dirname, '..')

const CACHE_FILE = resolve(ROOT, '.vercel', 'cache', 'embedding-date.txt')
const EMBEDDINGS_OUT = join(ROOT, 'public', 'embeddings.json')
const TODAY = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

// ── 检查当天是否已在 Vercel 构建中生成过 ──

if (existsSync(CACHE_FILE)) {
  const lastRun = readFileSync(CACHE_FILE, 'utf-8').trim()
  if (lastRun === TODAY) {
    console.log(`[embeddings] ⏭️ 今天 (${TODAY}) 已生成过 embeddings，跳过（节省 API 费用）`)

    // 确保 public/embeddings.json 存在（避免下游构建报错）
    if (!existsSync(EMBEDDINGS_OUT)) {
      writeFileSync(EMBEDDINGS_OUT, '[]', 'utf-8')
      console.log('[embeddings]   ⚠️ 回退：创建空的 public/embeddings.json')
    }
    process.exit(0)
  }
}

// ── 执行实际的 build-embeddings.mjs ──

const child = spawn('node', [join(__dirname, 'build-embeddings.mjs')], {
  stdio: 'inherit',
  cwd: ROOT,
})

child.on('exit', (code) => {
  if (code === 0) {
    // 生成成功 → 写入当天日期标记
    mkdirSync(dirname(CACHE_FILE), { recursive: true })
    writeFileSync(CACHE_FILE, TODAY, 'utf-8')
    console.log(`[embeddings] 📝 已标记 ${TODAY} 当天不再重复生成`)
  }
  process.exit(code ?? 1)
})
