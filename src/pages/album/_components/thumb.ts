/**
 * COS 图片处理：通过 URL 拼接参数，实时输出缩略图。
 *
 * 原理：Tencent COS 的 CI（Cloud Infinite）服务支持在 URL 后追加
 * 参数动态裁剪图片，不改变原图，不额外产生存储费用。
 *
 * 使用方式：
 *   thumbUrl(originalSrc, 400)
 *   → https://bucket.cos.region.myqcloud.com/photo.jpg?imageMogr2/thumbnail/400x/format/webp
 */

const COS_REGEX = /\.cos\.\w+\.myqcloud\.com\//

/**
 * 生成 COS 缩略图 URL
 * @param src   原始图片 URL
 * @param width 缩略图宽度（px），默认 400
 */
export function thumbUrl(src: string, width = 400): string {
    if (!COS_REGEX.test(src)) return src
    // 去掉已有参数，避免重复叠加
    const base = src.split('?')[0]
    return `${base}?imageMogr2/thumbnail/${width}x/format/webp`
}
