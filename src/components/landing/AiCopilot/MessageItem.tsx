import { cn } from '@site/src/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './styles.module.css'

interface Source {
    text: string
    source: string
}

interface Message {
    role: 'user' | 'assistant'
    content: string
    sources?: Source[]
}

interface Props {
    message: Message
    isStreaming?: boolean
}

export default function MessageItem({ message, isStreaming }: Props) {
    const isUser = message.role === 'user'

    return (
        <div className={cn(styles.message, isUser ? styles.userMessage : styles.assistantMessage)}>
            {isUser
                ? message.content
                : (
                    <div className={styles.markdown}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ className, children }) {
                                    const isBlock = /language-(\w+)/.test(className || '')
                                    if (isBlock) {
                                        return (
                                            <pre className={styles.codeBlock}>
                                                <code className={className}>{children}</code>
                                            </pre>
                                        )
                                    }
                                    return <code className={styles.inlineCode}>{children}</code>
                                },
                                pre({ children }) {
                                    return <>{children}</>
                                },
                                a({ href, children }) {
                                    return (
                                        <a href={href} target="_blank" rel="noreferrer" className={styles.link}>
                                            {children}
                                        </a>
                                    )
                                },
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                        {isStreaming && <span className={styles.cursor} />}
                    </div>
                )}

            {message.sources && message.sources.length > 0 && (
                <div className={styles.messageSources}>
                    {message.sources.map((s, i) => (
                        <span key={i} className={styles.messageSource} title={s.text}>
                            📎 {s.source}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}
