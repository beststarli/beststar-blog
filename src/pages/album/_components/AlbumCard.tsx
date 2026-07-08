import { cn } from '@site/src/lib/utils'
import { useInView } from 'framer-motion'
import React, { useRef, useState } from 'react'
import type { AlbumPhoto } from '../_types'
import styles from '../styles.module.css'
import { thumbUrl } from './thumb'

interface Props {
    photo: AlbumPhoto
    index: number
    onClick: () => void
}

export default function AlbumCard({ photo, index, onClick }: Props) {
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    // margin: '300px' 表示卡片距离视口边缘 300px 时就开始加载，预加载更平滑
    const isInView = useInView(ref, { once: true, margin: '300px' })

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
                style={{ paddingBottom: '75%' }}
            />

            {/* 图片 — 只用缩略图 URL，省流量 */}
            {isInView && !error && (
                <img
                    src={thumbUrl(photo.src)}
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
        </div>
    )
}
