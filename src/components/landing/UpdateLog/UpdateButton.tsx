import { Icon } from '@iconify/react'
import { cn } from '@site/src/lib/utils'
import { motion } from 'framer-motion'

interface Props {
    onClick: () => void
}

export default function UpdateButton({ onClick }: Props) {
    return (
        <>
            {/* Desktop */}
            <motion.button
                onClick={onClick}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className={cn(
                    'hidden size-12 cursor-pointer items-center justify-center rounded-2xl border border-solid shadow-blog transition-shadow lg:flex',
                    'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
                    'hover:border-gray-300 hover:shadow-lg',
                    'dark:hover:border-gray-600',
                )}
                aria-label="打开更新日志"
            >
                <Icon
                    icon="ri:history-line"
                    className="text-xl"
                    style={{ color: 'var(--ifm-color-primary)' }}
                />
            </motion.button>

            {/* Mobile */}
            <motion.button
                onClick={onClick}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className={cn(
                    'flex size-10 cursor-pointer items-center justify-center rounded-full border border-solid shadow-lg transition-shadow lg:hidden',
                    'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
                    'hover:border-gray-300 hover:shadow-xl',
                    'dark:hover:border-gray-600',
                )}
                style={{
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                }}
                aria-label="打开更新日志"
            >
                <Icon
                    icon="ri:history-line"
                    className="text-lg"
                    style={{ color: 'var(--ifm-color-primary)' }}
                />
            </motion.button>
        </>
    )
}
