import { Icon } from '@iconify/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ChatPanel from './ChatPanel'
import styles from './styles.module.css'

interface Props {
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

export default function AiCopilot({ isOpen: controlledOpen, onOpenChange }: Props) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [show, setShow] = useState(false)

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
                    className="fixed bottom-40 right-4 z-10 lg:bottom-auto lg:top-36"
                >
                    {isOpen
                        ? (
                            <motion.div
                                key="panel"
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            >
                                <ChatPanel onClose={() => setIsOpen(false)} />
                            </motion.div>
                        )
                        : (
                            <motion.button
                                key="fab"
                                onClick={() => setIsOpen(true)}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                className={styles.fab}
                                aria-label="打开 AI 助手"
                            >
                                <Icon icon="ri:sparkling-2-line" />
                            </motion.button>
                        )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
