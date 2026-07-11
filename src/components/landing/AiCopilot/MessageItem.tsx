import { cn } from '@site/src/lib/utils'
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
            {message.content}
            {isStreaming && <span className={styles.cursor} />}

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
