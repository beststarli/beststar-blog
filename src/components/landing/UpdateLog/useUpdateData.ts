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
            const date = p.metadata.frontMatter?.date as string | undefined
            if (date) {
                items.push({
                    type: 'blog',
                    title: p.metadata.title,
                    permalink: p.metadata.permalink,
                    date,
                    timestamp: new Date(date).getTime(),
                })
            }
        })

        docData?.versions?.[0]?.docs?.forEach((d) => {
            const dateStr = d.frontMatter?.date as string | undefined
            const ts = dateStr
                ? new Date(dateStr).getTime()
                : (d.lastUpdatedAt as number | undefined)
            if (ts) {
                items.push({
                    type: 'doc',
                    title: d.title || d.id,
                    permalink: d.permalink,
                    date: dateStr || new Date(d.lastUpdatedAt!).toISOString().slice(0, 10),
                    timestamp: ts,
                })
            }
        })

        items.sort((a, b) => b.timestamp - a.timestamp)
        return items.slice(0, MAX_COUNT)
    }, [blogData, docData])
}
