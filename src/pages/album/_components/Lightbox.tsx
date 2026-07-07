import { Icon } from '@iconify/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useCallback } from 'react'
import type { AlbumPhoto } from '../_types'

interface Props {
    photos: AlbumPhoto[]
    currentIndex: number
    onClose: () => void
    onPrev: () => void
    onNext: () => void
}

export default function Lightbox({ photos, currentIndex, onClose, onPrev, onNext }: Props) {
    const current = photos[currentIndex]

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape': onClose(); break
                case 'ArrowLeft': onPrev(); break
                case 'ArrowRight': onNext(); break
            }
        },
        [onClose, onPrev, onNext],
    )

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [handleKeyDown])

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 backdrop-blur-sm"
                onClick={onClose}
            >
                {/* 关闭按钮 */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                    aria-label="关闭"
                >
                    <Icon icon="ri:close-line" className="text-2xl" />
                </button>

                {/* 左箭头 */}
                {photos.length > 1 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onPrev() }}
                        className="absolute left-4 z-10 flex size-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                        aria-label="上一张"
                    >
                        <Icon icon="ri:arrow-left-s-line" className="text-3xl" />
                    </button>
                )}

                {/* 右箭头 */}
                {photos.length > 1 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onNext() }}
                        className="absolute right-4 z-10 flex size-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                        aria-label="下一张"
                    >
                        <Icon icon="ri:arrow-right-s-line" className="text-3xl" />
                    </button>
                )}

                {/* 图片 */}
                <motion.div
                    key={currentIndex}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 260 }}
                    className="flex max-h-[90vh] max-w-[90vw] items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={current.src}
                        alt={current.title || `Photo ${currentIndex + 1}`}
                        className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
                    />

                    {/* 底部信息 */}
                    {(current.title || current.date) && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-black/50 px-4 py-2 text-center text-white backdrop-blur-sm">
                            {current.title && <p className="text-sm font-medium">{current.title}</p>}
                            {current.date && <p className="text-xs text-white/70">{current.date}</p>}
                        </div>
                    )}
                </motion.div>

                {/* 计数器 */}
                {photos.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs text-white/80">
                        {currentIndex + 1}
                        {' / '}
                        {photos.length}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}
