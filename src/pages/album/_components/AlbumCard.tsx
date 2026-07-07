import type { AlbumPhoto } from '../_types'
import { cn } from '@site/src/lib/utils'
import { useInView } from 'framer-motion'
import React, { useRef, useState } from 'react'
import styles from '../styles.module.css'

interface Props {
    photo: AlbumPhoto
    index: number
    onClick: () => void
}

export default function AlbumCard({ photo, index, onClick }: Props) {
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '200px' })

    return (
        <div
            ref={ref}
            className={cn(styles.card, 'group')}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
        >
            {/* 占位骨架 */}
            <div
                className={cn(styles.skeleton, loaded && styles.skeletonHidden)}
                style={{
                    paddingBottom: photo.width && photo.height
                        ? `${(photo.height / photo.width) * 100}%`
                        : '75%',
                }}
            />

            {/* 图片 */}
            {isInView && !error && (
                <img
                    src={photo.src}
                    alt={photo.title || `Photo ${index + 1}`}
                    loading="lazy"
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    className={cn(styles.image, loaded && styles.imageLoaded)}
                />
            )}

            {/* 加载失败占位 */}
            {error && (
                <div className={styles.errorFallback}>
                    <span>⚠️</span>
                    <span className="text-xs">加载失败</span>
                </div>
            )}

            {/* 悬停遮罩 */}
            <div className={styles.overlay}>
                {photo.title && <span className={styles.cardTitle}>{photo.title}</span>}
                {photo.date && <span className={styles.cardDate}>{photo.date}</span>}
            </div>
        </div>
    )
}
