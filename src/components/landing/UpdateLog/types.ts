export interface UpdateItem {
    type: 'blog' | 'doc'
    title: string
    permalink: string
    date: string
    timestamp: number
}
