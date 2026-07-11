import Link from '@docusaurus/Link'
import { Icon } from '@iconify/react'
import { cn } from '@site/src/lib/utils'
import { motion } from 'framer-motion'
import type { UpdateItem } from './types'

interface Props {
    updates: UpdateItem[]
    onClose: () => void
}

function formatShortDate(dateStr: string): string {
    const d = new Date(dateStr)
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const itemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: 0.05 + i * 0.03, type: 'spring', damping: 24, stiffness: 280 },
    }),
}

function UpdateItemRow({ item, index }: { item: UpdateItem; index: number }) {
    return (
        <motion.div custom={index} variants={itemVariants} initial="hidden" animate="visible">
            <Link
                href={item.permalink}
                className={cn(
                    'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm no-underline transition-all',
                    'hover:bg-[var(--ifm-hover-overlay)]',
                )}
            >
                <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg text-xs"
                    style={{
                        background: `color-mix(in srgb, var(--ifm-color-primary) 10%, transparent)`,
                        color: 'var(--ifm-color-primary)',
                    }}
                >
                    <Icon icon={item.type === 'blog' ? 'ri:quill-pen-line' : 'ri:book-2-line'} />
                </span>
                <span
                    className={cn(
                        'flex-1 truncate leading-tight transition-colors',
                        'text-[var(--ifm-color-emphasis-700)] group-hover:text-[var(--ifm-color-emphasis-900)]',
                    )}
                >
                    {item.title}
                </span>
                <span className="shrink-0 text-xs font-medium text-[var(--ifm-color-emphasis-500)]">
                    {formatShortDate(item.date)}
                </span>
            </Link>
        </motion.div>
    )
}

export default function UpdatePanel({ updates, onClose }: Props) {
    return (
        <>
            {/* Mobile backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            />

            {/* Desktop card */}
            <motion.div
                key="panel-desktop"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                    'hidden flex-col overflow-hidden rounded-2xl border border-solid lg:flex',
                    'w-[360px] max-h-[calc(100vh-8rem)]',
                    'border-[var(--ifm-color-emphasis-200)] bg-[var(--ifm-card-background-color)]',
                    'shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
                )}
            >
                <PanelHeader onClose={onClose} />
                <PanelBody updates={updates} />
            </motion.div>

            {/* Mobile bottom sheet */}
            <motion.div
                key="panel-mobile"
                initial={{ y: '100%', opacity: 0.5 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0.5 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className={cn(
                    'fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border border-solid bg-white shadow-xl lg:hidden',
                    'border-gray-200 dark:border-gray-700 dark:bg-gray-800',
                )}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-2.5 pb-1">
                    <div className="h-1 w-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                </div>
                <PanelHeader onClose={onClose} />
                <PanelBody updates={updates} />
            </motion.div>
        </>
    )
}

function PanelHeader({ onClose }: { onClose: () => void }) {
    return (
        <div className="flex shrink-0 items-center justify-between border-b border-solid border-[var(--ifm-color-emphasis-200)] px-4 py-3">
            <div className="flex items-center gap-2 text-[0.9rem] font-semibold text-[var(--ifm-color-emphasis-800)]">
                <span
                    className="flex size-7 items-center justify-center rounded-lg text-sm"
                    style={{
                        background: `color-mix(in srgb, var(--ifm-color-primary) 12%, transparent)`,
                        color: 'var(--ifm-color-primary)',
                    }}
                >
                    <Icon icon="ri:history-line" />
                </span>
                <span>最近更新</span>
            </div>
            <button
                onClick={onClose}
                className={cn(
                    'flex size-7 cursor-pointer items-center justify-center rounded-[0.375rem] border-none bg-transparent text-base transition-colors',
                    'text-[var(--ifm-color-emphasis-500)] hover:bg-[var(--ifm-hover-overlay)]',
                )}
                aria-label="收起"
            >
                <Icon icon="ri:close-line" />
            </button>
        </div>
    )
}

function PanelBody({ updates }: { updates: UpdateItem[] }) {
    return (
        <div className="max-h-[min(360px,calc(100vh-12rem))] overflow-y-auto p-3 flex-1 min-h-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {updates.map((item, i) => (
                <UpdateItemRow key={`${item.type}-${item.permalink}`} item={item} index={i} />
            ))}
        </div>
    )
}