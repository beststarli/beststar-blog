import Translate, { translate } from '@docusaurus/Translate'
import { Icon } from '@iconify/react'
import allPhotos from '@site/data/album'
import type { AlbumPhoto } from './_types'
import { cn } from '@site/src/lib/utils'
import MyLayout from '@site/src/theme/MyLayout'
import { useInView } from 'framer-motion'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AlbumCard from './_components/AlbumCard'
import Lightbox from './_components/Lightbox'
import styles from './styles.module.css'

const TITLE = translate({ id: 'theme.album.title', message: '相册' })
const DESCRIPTION = translate({ id: 'theme.album.description', message: '记录生活中的美好瞬间' })

const BATCH_SIZE = 20
const COLUMN_BREAKPOINTS = { default: 4, 1200: 3, 768: 2, 480: 1 }

function useColumnCount(): number {
    const [cols, setCols] = useState(COLUMN_BREAKPOINTS.default)

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth
            const bp = Object.entries(COLUMN_BREAKPOINTS)
                .filter(([k]) => k !== 'default')
                .sort(([a], [b]) => Number(b) - Number(a))
            const match = bp.find(([k]) => w <= Number(k))
            setCols(match ? Number(match[1]) : COLUMN_BREAKPOINTS.default)
        }
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    return cols
}

/** 将图片分配到最短列（Pinterest/小红书式瀑布流） */
function masonryLayout(photos: { height: number; width: number }[], columnCount: number): number[][] {
    const columns: { items: number[]; totalHeight: number }[] = Array.from({ length: columnCount }, () => ({
        items: [],
        totalHeight: 0,
    }))

    photos.forEach((photo, index) => {
        const aspectRatio = photo.width && photo.height ? photo.height / photo.width : 1
        // 找最短列
        const target = columns.reduce((a, b) => (a.totalHeight <= b.totalHeight ? a : b))
        target.items.push(index)
        target.totalHeight += aspectRatio * 200 // 200 为基准宽度
    })

    return columns.map((c) => c.items)
}

function AlbumHeader() {
    return (
        <section className="text-center">
            <h2>{TITLE}</h2>
            <p>{DESCRIPTION}</p>
        </section>
    )
}

function LoadMoreTrigger({ onLoad }: { onLoad: () => void }) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { margin: '400px' })

    useEffect(() => {
        if (isInView) onLoad()
    }, [isInView, onLoad])

    return <div ref={ref} className="h-1" />
}

export default function Album() {
    const [displayCount, setDisplayCount] = useState(BATCH_SIZE)
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const [imageSizes, setImageSizes] = useState<Record<number, { width: number; height: number }>>({})

    const columnCount = useColumnCount()
    const hasMore = displayCount < allPhotos.length

    const visiblePhotos = useMemo(() => allPhotos.slice(0, displayCount), [displayCount])

    // 合并尺寸信息
    const photosWithSize = useMemo(
        () =>
            visiblePhotos.map((p, i) => ({
                ...p,
                width: p.width || imageSizes[i]?.width || 1,
                height: p.height || imageSizes[i]?.height || 1,
            })),
        [visiblePhotos, imageSizes],
    )

    const columns = useMemo(
        () => masonryLayout(photosWithSize, columnCount),
        [photosWithSize, columnCount],
    )

    const loadMore = useCallback(() => {
        if (hasMore) setDisplayCount((prev) => prev + BATCH_SIZE)
    }, [hasMore])

    // 监听真实图片尺寸（回退方案）
    const handleImageLoad = useCallback((index: number, w: number, h: number) => {
        setImageSizes((prev) => {
            if (prev[index]) return prev
            return { ...prev, [index]: { width: w, height: h } }
        })
    }, [])

    const openLightbox = useCallback((index: number) => setLightboxIndex(index), [])
    const closeLightbox = useCallback(() => setLightboxIndex(null), [])

    const goPrev = useCallback(() => {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : allPhotos.length - 1))
    }, [allPhotos.length])

    const goNext = useCallback(() => {
        setLightboxIndex((prev) => (prev !== null && prev < allPhotos.length - 1 ? prev + 1 : 0))
    }, [allPhotos.length])

    if (allPhotos.length === 0) {
        return (
            <MyLayout title={TITLE} description={DESCRIPTION} maxWidth={1280}>
                <main className="margin-vert--lg">
                    <AlbumHeader />
                    <section className="margin-top--lg margin-bottom--xl">
                        <div className="container padding-vert--md text-center">
                            <div className={styles.emptyState}>
                                <span className={styles.emptyIcon}>📸</span>
                                <h3><Translate id="theme.album.empty.title">暂无照片</Translate></h3>
                                <p><Translate id="theme.album.empty.description">请在 data/album.ts 中添加照片 URL</Translate></p>
                            </div>
                        </div>
                    </section>
                </main>
            </MyLayout>
        )
    }

    return (
        <MyLayout title={TITLE} description={DESCRIPTION} maxWidth={1280}>
            <main className="margin-vert--lg">
                <AlbumHeader />

                {/* 统计 */}
                <p className="text-center text-sm text-gray-400 dark:text-gray-500">
                    {allPhotos.length}
                    {' '}
                    <Translate id="theme.album.unit">张照片</Translate>
                </p>

                {/* 瀑布流 */}
                <section className={cn('margin-top--md', styles.wrapper)}>
                    <div className={styles.masonry} style={{ columnCount }}>
                        {columns.map((col, colIndex) => (
                            <div key={colIndex} className={styles.column}>
                                {col.map((photoIndex) => {
                                    const photo = visiblePhotos[photoIndex]
                                    return (
                                        <AlbumCard
                                            key={`${photoIndex}-${photo.src}`}
                                            photo={photo}
                                            index={photoIndex}
                                            onClick={() => openLightbox(photoIndex)}
                                        />
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 加载更多触发器 */}
                {hasMore && <LoadMoreTrigger onLoad={loadMore} />}

                {/* 加载中指示 */}
                {hasMore && (
                    <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-400">
                        <Icon icon="ri:loader-2-line" className="animate-spin text-lg" />
                        <Translate id="theme.album.loading">加载中...</Translate>
                    </div>
                )}

                {/* 全部加载完毕 */}
                {!hasMore && displayCount > BATCH_SIZE && (
                    <p className="py-8 text-center text-xs text-gray-300 dark:text-gray-600">
                        <Translate id="theme.album.end">已经到底啦</Translate>
                    </p>
                )}
            </main>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <Lightbox
                    photos={allPhotos}
                    currentIndex={lightboxIndex}
                    onClose={closeLightbox}
                    onPrev={goPrev}
                    onNext={goNext}
                />
            )}
        </MyLayout>
    )
}
