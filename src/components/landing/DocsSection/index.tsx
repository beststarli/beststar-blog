import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import { usePluginData } from '@docusaurus/useGlobalData'
import { Icon } from '@iconify/react'
import { cn } from '@site/src/lib/utils'
import { type Variants, motion } from 'framer-motion'
import React from 'react'
import { Section } from '../Section'

interface DocItem {
  id: string
  title: string
  permalink: string
  description?: string
  sidebar?: string
  frontMatter?: any
  lastUpdatedAt?: number
  formattedLastUpdatedAt?: string
}

interface CategoryDocs {
  category: string
  icon: string
  color: string
  docs: DocItem[]
}

const variants: Variants = {
  from: { opacity: 0.01, y: 30 },
  to: i => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 100,
      duration: 0.3,
      delay: i * 0.05,
    },
  }),
}

const formatDate = (doc: DocItem) => {
  // 优先使用 frontMatter.date，否则使用 lastUpdatedAt
  const dateStr = doc.frontMatter?.date
  if (!dateStr) {
    if (doc.lastUpdatedAt) {
      const date = new Date(doc.lastUpdatedAt)
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${month}-${day}`
    }
    return ''
  }

  const date = new Date(dateStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

function CategoryTimeline({ categoryData, index }: { categoryData: CategoryDocs, index: number }) {
  return (
    <motion.div
      initial="from"
      animate="to"
      custom={index}
      variants={variants}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="relative rounded-2xl border border-solid border-gray-200 bg-white p-4 shadow-blog md:p-6 dark:border-gray-700 dark:bg-gray-800"
    >
      {/* 分类标题 */}
      <div className="mb-3 flex items-center gap-3 md:mb-5">
        <div
          className="flex size-12 items-center justify-center rounded-2xl shadow-md"
          style={{
            background: `linear-gradient(135deg, ${categoryData.color}15 0%, ${categoryData.color}30 100%)`,
          }}
        >
          <Icon icon={categoryData.icon} className="text-3xl" />
        </div>
        <div>
          <h3 className="m-0 text-xl font-bold" style={{ color: categoryData.color }}>
            {categoryData.category}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {categoryData.docs.length}
            {' '}
            <Translate id="theme.blog.archive.posts.unit">篇</Translate>
          </span>
        </div>
      </div>

      {/* 时间线列表 */}
      <div className="space-y-2 md:space-y-3">
        {categoryData.docs.map((doc, i) => (
          <motion.div
            key={doc.id}
            custom={i}
            initial="from"
            animate="to"
            variants={variants}
            className="relative rounded-xl border border-solid border-gray-100 bg-gray-50/50 p-2.5 transition-all hover:scale-[1.02] hover:border-gray-200 hover:bg-white hover:shadow-md md:p-3 dark:border-gray-700 dark:bg-gray-900/30 dark:hover:border-gray-600 dark:hover:bg-gray-900/50"
          >
            <Link
              to={doc.permalink || '#'}
              className="group/item block no-underline"
            >
              <div className="flex items-start gap-3">
                {/* 圆点指示器 */}
                <div
                  className="mt-1.5 size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: categoryData.color }}
                />

                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="flex-1 text-base font-medium text-gray-900 transition-colors group-hover/item:text-blue-600 dark:text-gray-100 dark:group-hover/item:text-blue-400">
                      {doc.title || '未命名文档'}
                    </span>
                    <time className="shrink-0 text-xs font-medium text-gray-400 dark:text-gray-500">
                      {formatDate(doc)}
                    </time>
                  </div>

                  {doc.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {doc.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default function DocsSection() {
  const docData = usePluginData('docusaurus-plugin-content-docs') as {
    versions: Array<{ docs: DocItem[] }>
  }

  const allDocs = docData?.versions?.[0]?.docs || []

  // 按分类分组文档
  const docsByCategory = React.useMemo(() => {
    const categoryMap = new Map<string, DocItem[]>()

    // 定义要显示的分类和顺序
    const targetCategories = ['JavaScript', 'TypeScript', 'React', '算法']
    const categoryConfig = {
      JavaScript: {
        icon: 'logos:javascript',
        color: '#F7DF1E',
      },
      TypeScript: {
        icon: 'logos:typescript-icon',
        color: '#3178C6',
      },
      React: {
        icon: 'logos:react',
        color: '#61DAFB',
      },
      算法: {
        icon: 'mdi:chart-tree',
        color: '#10B981',
      },
    }

    allDocs.forEach((doc) => {
      // 跳过没有 permalink 的文档
      if (!doc?.permalink) {
        return
      }

      // 从 permalink 提取分类，例如 /docs/算法/xxx -> 算法
      const pathParts = doc.permalink.split('/').filter(Boolean)

      if (pathParts.length >= 3 && pathParts[0] === 'docs' && pathParts[1]) {
        const category = decodeURIComponent(pathParts[1])

        // 只收集目标分类
        if (targetCategories.includes(category)) {
          if (!categoryMap.has(category)) {
            categoryMap.set(category, [])
          }
          categoryMap.get(category)!.push(doc)
        }
      }
    })

    // 按指定顺序生成分类数组
    const categories: CategoryDocs[] = targetCategories
      .filter(category => categoryMap.has(category))
      .map(category => ({
        category,
        icon: categoryConfig[category].icon,
        color: categoryConfig[category].color,
        docs: categoryMap
          .get(category)!
          .sort((a, b) => {
            // 优先使用 frontMatter.date，否则使用 lastUpdatedAt
            const getTime = (doc: DocItem) => {
              if (doc.frontMatter?.date) {
                return new Date(doc.frontMatter.date).getTime()
              }
              return doc.lastUpdatedAt || 0
            }

            const timeA = getTime(a)
            const timeB = getTime(b)
            return timeB - timeA // 倒序排序，新的在前
          })
          .slice(0, 2), // 每个分类最多显示2篇
      }))

    return categories
  }, [allDocs])

  if (allDocs.length === 0) {
    return <>暂无文档...</>
  }

  return (
    <Section title={<Translate id="homepage.docs.title">近期文档</Translate>} icon="ri:book-2-line" href="/docs/intro">
      <div className="mx-auto w-full">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {docsByCategory.map((categoryData, index) => (
            <CategoryTimeline key={categoryData.category} categoryData={categoryData} index={index} />
          ))}
        </div>
      </div>
    </Section>
  )
}
