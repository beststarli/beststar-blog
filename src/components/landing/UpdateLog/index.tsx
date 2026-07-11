import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useUpdateData } from './useUpdateData'
import UpdateButton from './UpdateButton'
import UpdatePanel from './UpdatePanel'

interface Props {
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

export default function UpdateLog({ isOpen: controlledOpen, onOpenChange }: Props) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [show, setShow] = useState(false)

    const isOpen = controlledOpen ?? internalOpen
    const setIsOpen = (val: boolean) => {
        setInternalOpen(val)
        onOpenChange?.(val)
    }

    const updates = useUpdateData()

    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.55)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    if (updates.length === 0) return null

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="update-log-root"
                    initial={{ opacity: 0, x: 80, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 80, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                    className="fixed right-4 bottom-24 z-40 lg:bottom-auto lg:top-20"
                >
                    {isOpen ? (
                        <UpdatePanel updates={updates} onClose={() => setIsOpen(false)} />
                    ) : (
                        <UpdateButton onClick={() => setIsOpen(true)} />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
