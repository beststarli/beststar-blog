export interface AlbumPhoto {
    /** COS 图片 URL */
    src: string
    /** 图片标题（可选） */
    title?: string
    /** 拍摄日期（可选），如 2026-07 */
    date?: string
    /** 图片原始宽度（可选，用于占位防止 CLS） */
    width?: number
    /** 图片原始高度（可选，用于占位防止 CLS） */
    height?: number
}
