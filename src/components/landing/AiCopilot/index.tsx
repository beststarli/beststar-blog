import { Icon } from '@iconify/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ChatPanel from './ChatPanel'
import { cn } from '@site/src/lib/utils'

interface Props {
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

interface Source {
    text: string
    source: string
}

interface Message {
    role: 'user' | 'assistant'
    content: string
    sources?: Source[]
}

export default function AiCopilot({ isOpen: controlledOpen, onOpenChange }: Props) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [show, setShow] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])

    const isOpen = controlledOpen ?? internalOpen
    const setIsOpen = (val: boolean) => {
        setInternalOpen(val)
        onOpenChange?.(val)
    }

    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.55)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="ai-copilot"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                    className="fixed bottom-40 right-4 z-50 lg:bottom-auto lg:top-36"
                >
                    {isOpen
                        ? (
                            <motion.div
                                key="panel"
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            >
                                <ChatPanel messages={messages} setMessages={setMessages} onClose={() => setIsOpen(false)} />
                            </motion.div>
                        )
                        : (
                            <motion.button
                                key="fab"
                                onClick={() => setIsOpen(true)}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                className={cn(
                                    'flex size-10 cursor-pointer items-center justify-center rounded-full border border-solid shadow-lg transition-shadow lg:size-12 lg:rounded-2xl lg:shadow-blog',
                                    'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
                                    'hover:border-gray-300 hover:shadow-xl lg:hover:shadow-lg',
                                    'dark:hover:border-gray-600',
                                )}
                                aria-label="打开 AI 助手"
                            >
                                <Icon
                                    icon="ri:sparkling-2-line"
                                    className="text-lg lg:text-xl"
                                    style={{ color: 'var(--ifm-color-primary)' }}
                                />
                            </motion.button>
                        )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
