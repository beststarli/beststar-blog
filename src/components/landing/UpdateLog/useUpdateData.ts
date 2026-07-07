import type { BlogPost } from '@docusaurus/plugin-content-blog'
import { usePluginData } from '@docusaurus/useGlobalData'
import React from 'react'
import type { UpdateItem } from './types'

const MAX_COUNT = 8

export function useUpdateData(): UpdateItem[] {
    const blogData = usePluginData('docusaurus-plugin-content-blog') as
        | { posts: BlogPost[] }
        | undefined

    const docData = usePluginData('docusaurus-plugin-content-docs') as
        | { versions: Array<{ docs: any[] }> }
        | undefined

    return React.useMemo(() => {
        const items: UpdateItem[] = []

        blogData?.posts?.forEach((p) => {
            const lastUpdated = p.metadata.lastUpdatedAt as number | undefined
            const createdDate = p.metadata.frontMatter?.date as string | undefined
            // 有 lastUpdatedAt 就用它作为时间戳和显示日期
            const ts = lastUpdated ?? (createdDate ? new Date(createdDate).getTime() : undefined)
            if (ts) {
                items.push({
                    type: 'blog',
                    title: p.metadata.title,
                    permalink: p.metadata.permalink,
                    date: lastUpdated
                        ? new Date(lastUpdated).toISOString().slice(0, 10)
                        : createdDate!,
                    timestamp: ts,
                })
            }
        })

        docData?.versions?.[0]?.docs?.forEach((d) => {
            const lastUpdated = d.lastUpdatedAt as number | undefined
            const createdDate = d.frontMatter?.date as string | undefined
            const ts = lastUpdated ?? (createdDate ? new Date(createdDate).getTime() : undefined)
            if (ts) {
                items.push({
                    type: 'doc',
                    title: d.title || d.id,
                    permalink: d.permalink,
                    date: lastUpdated
                        ? new Date(lastUpdated).toISOString().slice(0, 10)
                        : createdDate!,
                    timestamp: ts,
                })
            }
        })

        items.sort((a, b) => b.timestamp - a.timestamp)
        return items.slice(0, MAX_COUNT)
    }, [blogData, docData])
}
