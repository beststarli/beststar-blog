import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// ── 类型 ──

interface EmbeddingItem {
    text: string
    source: string
    vector: number[]
}

// ── 余弦相似度 ──

function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, na = 0, nb = 0
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i]
        na += a[i] * a[i]
        nb += b[i] * b[i]
    }
    return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

// ── 主处理函数 ──

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 只接受 POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { question } = req.body || {}
    if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Missing question' })
    }

    const deepseekKey = process.env.DEEPSEEK_API_KEY
    if (!deepseekKey) {
        return res.status(500).json({ error: 'DEEPSEEK_API_KEY not configured' })
    }

    const embedApiKey = process.env.OPENAI_API_KEY
    if (!embedApiKey) {
        return res.status(500).json({ error: 'OPENAI_API_KEY not configured' })
    }
    const embedBaseUrl = process.env.EMBEDDING_BASE_URL || 'https://api.openai.com/v1'
    const embedModel = process.env.EMBEDDING_MODEL || 'text-embedding-3-small'

    try {
        // ① 加载 embeddings
        const embPath = join(process.cwd(), 'public', 'embeddings.json')
        if (!existsSync(embPath)) {
            return res.status(500).json({ error: 'embeddings.json not found. Run build first.' })
        }
        const embeddings: EmbeddingItem[] = JSON.parse(readFileSync(embPath, 'utf-8'))

        // ② 将用户问题转成向量（兼容 OpenAI 和 MiniMax 格式）
        const isMiniMax = embedBaseUrl.includes('minimax')
        const qBody = isMiniMax
            ? { model: embedModel, texts: [question], type: 'query' }
            : { model: embedModel, input: [question] }

        const qRes = await fetch(`${embedBaseUrl}/embeddings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${embedApiKey}`,
            },
            body: JSON.stringify(qBody),
        })

        if (!qRes.ok) {
            const err = await qRes.text()
            return res.status(500).json({ error: `Embedding API error: ${err}` })
        }

        const qData = await qRes.json()

        let qVector: number[]
        if (isMiniMax) {
            if (!qData.vectors || !qData.vectors[0]) {
                return res.status(500).json({ error: `MiniMax API error: ${JSON.stringify(qData.base_resp)}` })
            }
            qVector = qData.vectors[0]
        } else {
            qVector = qData.data[0].embedding
        }

        // ③ 余弦相似度搜索，取 top 3
        const scored = embeddings.map(item => ({
            ...item,
            score: cosineSimilarity(qVector, item.vector),
        }))
        scored.sort((a, b) => b.score - a.score)
        const top = scored.slice(0, 3).filter(item => item.score > 0.3)

        // ④ 拼 prompt
        const context = top.map(item => item.text).join('\n\n---\n\n')
        const systemPrompt = `你是一个技术博客助手，请根据以下资料回答问题。
如果资料不足以回答，请如实说"我不清楚"，不要编造。

参考资料：
${context || '（暂无相关参考资料）'}

回答要求：
- 用中文回答
- 简洁有条理
- 如引用资料中的内容，请标注来源`

        // ⑤ 调 DeepSeek Chat API（SSE 流式返回）
        const chatRes = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${deepseekKey}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: question },
                ],
                stream: true,
            }),
        })

        if (!chatRes.ok) {
            const err = await chatRes.text()
            return res.status(500).json({ error: `Chat API error: ${err}` })
        }

        // ⑥ 将 SSE 流透传给前端
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        // 先发送来源信息
        const sources = top.map(item => ({
            text: item.text.slice(0, 100),
            source: item.source,
        }))
        res.write(`data: ${JSON.stringify({ type: 'sources', data: sources })}\n\n`)

        // 透传 LLM 返回的 SSE
        const reader = chatRes.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue
                const payload = line.slice(6).trim()
                if (payload === '[DONE]') continue
                try {
                    const parsed = JSON.parse(payload)
                    const content = parsed.choices?.[0]?.delta?.content || ''
                    if (content) {
                        res.write(`data: ${JSON.stringify({ type: 'text', data: content })}\n\n`)
                    }
                } catch {
                    // 跳过解析失败的行
                }
            }
        }

        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
        res.end()
    } catch (err) {
        console.error('[chat] 错误:', err)
        try {
            res.write(`data: ${JSON.stringify({ type: 'error', data: '服务器内部错误' })}\n\n`)
            res.end()
        } catch { /* ignore */ }
    }
}
