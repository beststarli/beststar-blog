import { Icon } from '@iconify/react'
import { cn } from '@site/src/lib/utils'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MessageItem from './MessageItem'
import styles from './styles.module.css'

interface Message {
    role: 'user' | 'assistant'
    content: string
    sources?: { text: string; source: string }[]
}

interface Props {
    messages: Message[]
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
    onClose: () => void
}

export default function ChatPanel({ messages, setMessages, onClose }: Props) {
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // 自动滚动到底部
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // 自动聚焦输入框
    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const sendMessage = useCallback(async () => {
        const question = input.trim()
        if (!question || loading) return

        setInput('')
        setError('')

        // 添加用户消息
        const userMsg: Message = { role: 'user', content: question }
        setMessages(prev => [...prev, userMsg])

        // 添加占位的 AI 消息（流式渲染）
        const assistantMsg: Message = { role: 'assistant', content: '', sources: [] }
        setMessages(prev => [...prev, assistantMsg])
        setLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question }),
            })

            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: '请求失败' }))
                throw new Error(err.error || `HTTP ${res.status}`)
            }

            const reader = res.body.getReader()
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
                    try {
                        const parsed = JSON.parse(line.slice(6))
                        if (parsed.type === 'sources') {
                            setMessages((prev) => {
                                const next = [...prev]
                                const last = { ...next[next.length - 1] }
                                last.sources = parsed.data
                                next[next.length - 1] = last
                                return next
                            })
                        }
                        else if (parsed.type === 'text') {
                            setMessages((prev) => {
                                const next = [...prev]
                                const last = { ...next[next.length - 1] }
                                last.content += parsed.data
                                next[next.length - 1] = last
                                return next
                            })
                        }
                        else if (parsed.type === 'error') {
                            setError(parsed.data)
                        }
                    }
                    catch { /* skip */ }
                }
            }
        }
        catch (err: any) {
            setError(err.message || '网络错误')
            // 移除占位消息
            setMessages(prev => prev.slice(0, -1))
        }
        finally {
            setLoading(false)
        }
    }, [input, loading])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className={styles.panel}>
            {/* 头部 */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Icon icon="ri:sparkling-2-line" style={{ color: 'var(--ifm-color-primary)' }} />
                    <span>AI Copilot</span>
                </div>
                <button onClick={onClose} className={styles.closeBtn} aria-label="关闭">
                    <Icon icon="ri:close-line" />
                </button>
            </div>

            {/* 消息区 */}
            <div className={styles.messages}>
                {messages.length === 0 && (
                    <div className={styles.welcome}>
                        <img src="/img/beststar.jpg" alt="avatar" className={styles.welcomeIcon} />
                        <div className={styles.welcomeTitle}>你好！有什么可以帮你的？</div>
                        <div className={styles.welcomeText}>
                            你可以问我关于博客内容的问题，
                            <br />
                            比如 "什么是 TCP 三次握手？"
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <MessageItem
                        key={i}
                        message={msg}
                        isStreaming={loading && i === messages.length - 1 && msg.role === 'assistant'}
                    />
                ))}

                {error && <div className={styles.errorMsg}>{error}</div>}
                <div ref={messagesEndRef} />
            </div>

            {/* 输入区 */}
            <div className={styles.inputArea}>
                <input
                    ref={inputRef}
                    className={styles.input}
                    placeholder="输入你的问题..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                <button
                    className={styles.sendBtn}
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    aria-label="发送"
                >
                    <Icon icon="ri:send-plane-fill" />
                </button>
            </div>
        </div>
    )
}
