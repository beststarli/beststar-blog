import Translate, { translate } from '@docusaurus/Translate'
import { Icon } from '@iconify/react'
import allPhotos from '@site/data/album'
import { cn } from '@site/src/lib/utils'
import MyLayout from '@site/src/theme/MyLayout'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AlbumCard from './_components/AlbumCard'
import Lightbox from './_components/Lightbox'
import styles from './styles.module.css'

const TITLE = translate({ id: 'theme.album.title', message: '相册' })
const DESCRIPTION = translate({ id: 'theme.album.description', message: '照片是情绪表达的载体' })

const PAGE_SIZE = 50
const PULL_THRESHOLD = 80 // px，下拉触发翻页的距离
const COLUMN_BREAKPOINTS = { default: 4, 1200: 3, 768: 2, 480: 1 }

function useColumnCount(): number {
    const [cols, setCols] = useState(COLUMN_BREAKPOINTS.default)
    useEffect(() => {
        const update = () => {
            const w = window.innerWidth
            const bp = Object.entries(COLUMN_BREAKPOINTS).filter(([k]) => k !== 'default').sort(([a], [b]) => Number(b) - Number(a))
            const match = bp.find(([k]) => w <= Number(k))
            setCols(match ? Number(match[1]) : COLUMN_BREAKPOINTS.default)
        }
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])
    return cols
}

function masonryLayout(photoCount: number, columnCount: number): number[][] {
    const cols: number[][] = Array.from({ length: columnCount }, () => [])
    for (let i = 0; i < photoCount; i++) cols[i % columnCount].push(i)
    return cols
}

function AlbumHeader() {
    return (
        <section className="text-center">
            <h2>{TITLE}</h2>
            <p>{DESCRIPTION}</p>
        </section>
    )
}

function generatePageNumbers(current: number, total: number): (number | null)[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const pages: (number | null)[] = [1]
    if (current > 3) pages.push(null)
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
    if (current < total - 2) pages.push(null)
    if (total > 1) pages.push(total)
    return pages
}

/* ────────────────────────────────────────────
   左侧竖排分页器（桌面 & 移动端共用）
   ──────────────────────────────────────────── */
function PaginationSidebar({ page, totalPages, onChange }: {
    page: number; totalPages: number; onChange: (p: number) => void
}) {
    return (
        <nav className={styles.paginationSidebar} aria-label="分页">
            <button
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
                className={styles.pageArrow}
                aria-label="上一页"
            >
                <Icon icon="ri:arrow-up-s-line" />
            </button>

            <div className={styles.pageList}>
                {generatePageNumbers(page, totalPages).map((p, i) =>
                    p === null ? (
                        <span key={`e-${i}`} className={styles.pageEllipsis}>···</span>
                    ) : (
                        <button key={p} onClick={() => onChange(p)}
                            className={cn(styles.pageBtn, p === page && styles.pageBtnActive)}
                        >
                            {p}
                        </button>
                    ),
                )}
            </div>

            <button
                disabled={page >= totalPages}
                onClick={() => onChange(page + 1)}
                className={styles.pageArrow}
                aria-label="下一页"
            >
                <Icon icon="ri:arrow-down-s-line" />
            </button>
        </nav>
    )
}

/* ────────────────────────────────────────────
   底部下拉翻页手势（移动端）
   当滚到最底部后继续下拉 → 松开翻到下一页
   ──────────────────────────────────────────── */
function PullToNext({ onNext, hasNext }: { onNext: () => void; hasNext: boolean }) {
    const [pull, setPull] = useState(0)
    const touchStart = useRef(0)
    const pulling = useRef(false)

    if (!hasNext) return null

    const fraction = Math.min(pull / PULL_THRESHOLD, 1)
    const progress = fraction * 100

    return (
        <div
            className={styles.pullZone}
            onTouchStart={(e) => {
                const { scrollTop, scrollHeight, clientHeight } = document.documentElement
                // 只在接近底部时激活
                if (scrollHeight - scrollTop - clientHeight > 60) return
                touchStart.current = e.touches[0].screenY
                pulling.current = false
                setPull(0)
            }}
            onTouchMove={(e) => {
                const { scrollTop, scrollHeight, clientHeight } = document.documentElement
                if (scrollHeight - scrollTop - clientHeight > 60) return
                const dy = e.touches[0].screenY - touchStart.current
                if (dy > 0) {
                    pulling.current = true
                    setPull(Math.min(dy, PULL_THRESHOLD * 1.5))
                }
            }}
            onTouchEnd={() => {
                if (pulling.current && pull >= PULL_THRESHOLD) {
                    onNext()
                }
                setPull(0)
                pulling.current = false
            }}
        >
            <div
                className={styles.pullIndicator}
                style={{
                    height: pull > 0 ? `${Math.min(pull * 0.4, 48)}px` : '0px',
                    opacity: pull > 0 ? Math.min(pull / PULL_THRESHOLD, 1) : 0,
                }}
            >
                <Icon
                    icon="ri:arrow-down-s-line"
                    className={cn(
                        styles.pullIcon,
                        pull >= PULL_THRESHOLD && styles.pullIconReady,
                    )}
                    style={{ transform: `rotate(${progress * 180}deg)` }}
                />
                <span className={styles.pullText}>
                    {pull >= PULL_THRESHOLD ? '松开翻到下一页' : '继续下拉翻页'}
                </span>
            </div>
        </div>
    )
}

/* ────────────────────────────────────────────
   主组件
   ──────────────────────────────────────────── */
export default function Album() {
    const [page, setPage] = useState(1)
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const gridRef = useRef<HTMLDivElement>(null)

    const totalPages = Math.max(1, Math.ceil(allPhotos.length / PAGE_SIZE))
    const columnCount = useColumnCount()
    const pageStart = (page - 1) * PAGE_SIZE

    const visiblePhotos = useMemo(() => allPhotos.slice(pageStart, pageStart + PAGE_SIZE), [pageStart])
    const columns = useMemo(() => masonryLayout(visiblePhotos.length, columnCount), [visiblePhotos.length, columnCount])

    const handlePageChange = useCallback((p: number) => {
        if (p < 1 || p > totalPages) return
        setPage(p)
        setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
    }, [totalPages])

    const handleNextPage = useCallback(() => handlePageChange(page + 1), [handlePageChange, page])

    const openLightbox = useCallback((index: number) => setLightboxIndex(pageStart + index), [pageStart])
    const closeLightbox = useCallback(() => setLightboxIndex(null), [])
    const goPrev = useCallback(() => setLightboxIndex(p => (p !== null && p > 0 ? p - 1 : allPhotos.length - 1)), [allPhotos.length])
    const goNext = useCallback(() => setLightboxIndex(p => (p !== null && p < allPhotos.length - 1 ? p + 1 : 0)), [allPhotos.length])

    if (allPhotos.length === 0) {
        return (
            <MyLayout title={TITLE} description={DESCRIPTION} maxWidth={1280}>
                <main className="margin-vert--lg">
                    <AlbumHeader />
                    <section className="margin-top--lg margin-bottom--xl">
                        <div className="padding-vert--md container text-center">
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

                <p className="text-center text-sm text-gray-400 dark:text-gray-500">
                    {allPhotos.length}
                    {' '}
                    <Translate id="theme.album.unit">张照片</Translate>
                </p>

                <div ref={gridRef} className={styles.layout}>
                    {totalPages > 1 && (
                        <PaginationSidebar
                            page={page}
                            totalPages={totalPages}
                            onChange={handlePageChange}
                        />
                    )}

                    <section className={cn('margin-top--md', styles.wrapper)}>
                        <div className={styles.masonry}>
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
                </div>

                {/* 下拉翻页手势（仅移动端） */}
                <PullToNext onNext={handleNextPage} hasNext={page < totalPages} />
            </main>

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
