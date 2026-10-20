/**
 * 读取 docusaurus.config.ts 中的向量化开关 ENABLE_EMBEDDINGS。
 *
 * 这里用正则解析源码而不是 import 配置：prebuild 阶段执行时
 * 直接加载 docusaurus.config.ts 会连带加载 React 组件等依赖，既慢又易出错。
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = resolve(fileURLToPath(import.meta.url), '..')
const CONFIG_PATH = resolve(__dirname, '..', 'docusaurus.config.ts')

/**
 * @returns {boolean} 开关为 true 或未找到声明时返回 true（保持原有默认行为）
 */
export function isEmbeddingsEnabled() {
  if (!existsSync(CONFIG_PATH)) {
    console.warn('[embeddings] 未找到 docusaurus.config.ts，默认按开启处理')
    return true
  }

  const source = readFileSync(CONFIG_PATH, 'utf-8')
  const match = source.match(
    /^(?:export\s+)?const\s+ENABLE_EMBEDDINGS\s*(?::\s*boolean)?\s*=\s*(true|false)\b/m,
  )

  if (!match) {
    console.warn('[embeddings] 未在 docusaurus.config.ts 中找到 ENABLE_EMBEDDINGS，默认按开启处理')
    return true
  }

  return match[1] === 'true'
}
