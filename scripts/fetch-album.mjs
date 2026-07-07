#!/usr/bin/env node

/**
 * 从腾讯 COS 自动拉取图片列表，生成 data/album.ts
 *
 * 使用方式：
 *   1. 配置环境变量（或复制为 .env 文件）
 *      export COS_SECRET_ID=xxx
 *      export COS_SECRET_KEY=xxx
 *      export COS_BUCKET=xxx
 *      export COS_REGION=ap-guangzhou
 *      export COS_PREFIX=album/   # 可选，指定文件夹路径
 *
 *   2. 运行脚本
 *      node scripts/fetch-album.mjs
 *
 *   3. 脚本会自动读取 COS 指定路径下的图片，生成 data/album.ts
 */

// ── 读取 .env 文件（如果有） ──

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '..', '.env')

if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8')
    for (const line of envContent.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const eqIdx = trimmed.indexOf('=')
        if (eqIdx === -1) continue
        const key = trimmed.slice(0, eqIdx).trim()
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
        if (!process.env[key]) {
            process.env[key] = val
        }
    }
}

// 使用动态 import 让未安装 SDK 时不报错
let COS
try {
    COS = (await import('cos-nodejs-sdk-v5')).default
} catch {
    console.warn('[album] 未安装 cos-nodejs-sdk-v5，跳过拉取（不影响构建）')
    process.exit(0)
}

// ── 读取配置 ──

const CONFIG = {
    secretId: process.env.COS_SECRET_ID || process.env.COS_SECRETID,
    secretKey: process.env.COS_SECRET_KEY || process.env.COS_SECRETKEY,
    bucket: process.env.COS_BUCKET,
    region: process.env.COS_REGION || 'ap-guangzhou',
    prefix: process.env.COS_PREFIX || '',
    // 支持的图片格式
    extensions: new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.heic', '.heif']),
}

// 校验必填字段
const missing = ['secretId', 'secretKey', 'bucket'].filter((k) => !CONFIG[k])
if (missing.length > 0) {
    console.warn(`[album] 缺少环境变量 ${missing.join(', ')}，跳过拉取（不影响构建）`)
    console.warn('如需从 COS 同步图片，请设置 COS_SECRET_ID, COS_SECRET_KEY, COS_BUCKET')
    process.exit(0)
}

// ── 获取图片列表 ──

const cos = new COS({
    SecretId: CONFIG.secretId,
    SecretKey: CONFIG.secretKey,
})

async function listAllObjects(prefix, marker) {
    const params = { Bucket: CONFIG.bucket, Region: CONFIG.region, Prefix: prefix }
    if (marker) params.Marker = marker

    return new Promise((resolve, reject) => {
        cos.getBucket(params, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

console.log(`[album] 正在拉取 cos://${CONFIG.bucket}/${CONFIG.prefix} ...`)

let allObjects = []
let isTruncated = true
let marker

while (isTruncated) {
    const data = await listAllObjects(CONFIG.prefix, marker)
    const contents = data.Contents || []
    allObjects = allObjects.concat(contents)
    isTruncated = data.IsTruncated === 'true' || data.IsTruncated === true
    marker = data.NextMarker || contents[contents.length - 1]?.Key
}

// ── 过滤图片 ──

const imageObjects = allObjects
    .filter((obj) => {
        const ext = obj.Key?.toLowerCase().slice(obj.Key.lastIndexOf('.'))
        return ext && CONFIG.extensions.has(ext)
    })
    // 按最后修改时间降序（最新的在前）
    .sort((a, b) => new Date(b.LastModified || 0).getTime() - new Date(a.LastModified || 0).getTime())

if (imageObjects.length === 0) {
    console.log(`[album] 在 cos://${CONFIG.bucket}/${CONFIG.prefix} 下未找到图片`)
    process.exit(0)
}

console.log(`[album] 找到 ${imageObjects.length} 张图片，正在生成数据文件...`)

// ── 生成 data/album.ts ──

const baseUrl = `https://${CONFIG.bucket}.cos.${CONFIG.region}.myqcloud.com`

const entries = imageObjects.map((obj, i) => {
    const src = `${baseUrl}/${obj.Key}`
    // 用文件名（不含扩展名）作为标题
    const name = obj.Key
        .replace(CONFIG.prefix, '')
        .replace(/\.[^.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
    return `    { src: '${src}', title: '${name}' }`
})

const content = `// ⚠️ 此文件由 scripts/fetch-album.mjs 自动生成，请勿手动修改
// 运行 \`node scripts/fetch-album.mjs\` 重新拉取 COS 图片列表

import type { AlbumPhoto } from '../src/pages/album/_types'

const photos: AlbumPhoto[] = [
${entries.join(',\n')},
]

export default photos
`

const fs = await import('fs/promises')
await fs.writeFile('data/album.ts', content, 'utf-8')

console.log(`[album] ✅ data/album.ts 已生成 (${imageObjects.length} 张图片)`)
