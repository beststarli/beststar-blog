---
title: SEO
description: SEO是Search Engine Optimizatio（搜索引擎优化）的首字母缩写，利用搜索引擎的规则对网站进行内部及外部的调整优化，提高网页或网站在搜索引擎中关键词的自然排名, 以求得获得更多的展现量和吸引免费的点击流量，从而达到互联网营销及品牌建设的目标。
sidebar_position: 9
tags: [Web]
date: 2026-01-28
---

# SEO 
## 概念
SEO 是 Search Engine Optimization 的缩写，即搜索引擎优化。它是一种通过调整网站的内容、结构、外部链接等方面的优化手段，来提高网站在搜索引擎中的自然排名，以求得获得更多的流量，从而达到互联网营销及品牌建设的目标。

## 优化手段
### TDK
TDK即Title（标题）、Description（描述）和Keywords（关键词），它们是网页的三个重要元素，TDK是一个网站SEO的核心。因为滥用等原因，目前各大主流搜索引擎基本都已经降低甚至移除了 keywords 对排名的影响。
#### Title
```html
<!-- 错误示例 -->
<title>首页 | 公司官网</title>

<!-- 正确示例 -->
<title>智能家居解决方案_智能门锁_全屋智能系统-XX科技</title>
```
- 长度控制在50-65字符（中文约18-25字）
- 主关键词前置，层级用英文短横线分隔
- 移动端优先显示核心信息

#### Description
```html
<meta name="description" content="XX科技提供专业智能家居解决方案，涵盖智能门锁、全屋智能控制系统等产品，已服务1000+家庭用户，免费获取智能家居设计方案。">
```
- 长度控制在150字符内
- 包含主关键词和行动号召语
- 避免重复Title内容

#### Keywords
```html
<meta name="keywords" content="智能家居,智能门锁,全屋智能,智能家居系统">
```
- 关键词不超过5个，用英文逗号分隔
- 避免堆砌无关关键词（如"优惠,促销"等营销词）
- 栏目页采用"栏目名+核心长尾词"组合

## Meta标签
Meta 标签是网页 head 区的辅助性标签，它的作用是经过配置一些参数用以描述页面属性，目前几乎所有搜索引擎都使用网上机器人自动查找 Meta 值来给网页分类。Meta 标签的 name 属性有以下配置项：
- Keywords：逗号分隔的关键词列表
- description：很重要，搜索引擎会把这个描述显示在搜索结果中
- format-detection：格式检测，比如禁止识别电话，邮箱等
- Robots：用来告诉搜索机器人哪些页面需要索引，哪些页面不需要索引
- theme-color：网站主题色

## HTML语义化标签
### 标题及结构层级规范
```html
<h1>智能家居解决方案</h1>
<h2>核心产品</h2>
<h3>智能门锁系列</h3>
<h3>环境控制系统</h3>
<h2>成功案例</h2>
```
- 每个页面H1标签谨慎滥用
- 层级关系严格递进（H1→H2→H3）
- 避免跳过层级（如H1直接接H3）
- 还可用`<section>`、`<article>`等语义标签的嵌套，提升内容结构化

### 图片优化
```html
<!-- 基础优化 -->
<img src="smart-lock.jpg" alt="XX智能门锁V3-Pro版" loading="lazy" width="800" height="600">

<!-- 高级优化（WebP格式+响应式） -->
<picture>
    <source srcset="smart-lock.webp" type="image/webp">
    <img src="smart-lock.jpg" alt="支持指纹识别的智能门锁">
</picture>
```
- 必须添加alt属性（描述图片功能而非外观）
- 使用WebP等新型图像格式
- 添加width/height属性防止布局偏移（CLS优化）

### 其他标签
- **强调标签**：`strong`、`em`，一方面是强调（加粗/斜体），增加了权重；另一方面增强视觉效果
- **段落标签**：页面中段落文字可使用`p`标签替代
- **列表标签**：`ul`、`ol`、`li`，搜索引擎能够通过这些标签更好地理解信息的层次结构和关联性，从而更准确地评估网页的内容和价值
- **布局标签**：`header`、`nav`、`article`、`section`、`aside`、`footer`，根据页面的区域模块划分选择对应的布局标签

## Open Graph协议
Open Graph 协议可以让任何一个网页集成到社交图谱中。例如，你的网页集成了Open Graph 协议，按照协议加入了网页的标题，描述以及图片信息等，那么在 facebook 中分享这个网页的时候，facebook 就会按照你定义的内容来展示这个网页。

这个协议其实很简单，主要是通过在 html 中加入一些元数据（meta）标签来实现，property 属性以 og 开头，后面跟着具体属性，content 里面是属性的值：
```html
<html prefix="og: http://ogp.me/ns#">
    <head>
        <title>The Rock (1996)</title>
        <meta property="og:title" content="The Rock" />
        <meta property="og:type" content="video.movie" />
        <meta property="og:url" content="http://www.imdb.com/title/tt0117500/" />
        <meta property="og:image" content="http://ia.media-imdb.com/images/rock.jpg" />
        ...
    </head>
    ...
</html>
```

## sitemap站点地图
sitemap 文件是另一个辅助搜索引擎访问网站的工具（协议），有了它并不代表页面一定被收录，但它可以让搜索引擎更快的、更有目的的访问你的网站，从而更有利于搜索引擎的收录工作。

sitemap 文档中罗列了你想让搜索引擎访问到的站内的所有页面对应的链接，里面会包含页面链接(url)以及页面的上次更新时间(lastmod)、更新频率(changefreq)、权重(priority)等信息，其中 url 是必须的，后三者可选。文档一般为 xml 格式，当然也可以是 txt 格式或 html 格式，这里以 xml 格式为例。

首先，sitemap 文档和 robots 一样，文件格式为 UTF-8，并且所有在文件内的数据必须经过转译。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
      <loc>http://www.xxx.com/</loc>
      <lastmod>2019-12-17</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.5</priority>
   </url>
   <url>
      <loc>http://www.xxx.com/detail/xxx</loc>
      <lastmod>2019-12-17</lastmod>
   </url>
</urlset>
```
- 文档开头，声明 xml 版本和字符编码格式
- 以`<urlset>`标签作为顶级标签，并指定 xml 命名空间
- 每一个页面的 url 用一个`<url>`父级标签包裹
- 包含一个**必选**的`<loc>`子标签包裹页面链接
- 剩下的`<lastmod>`|`<changefreq>`|`<priority>`三个子标签作为可选项

## robots文件
蜘蛛在访问一个网站时，会首先会检查该网站的根域下是否有一个叫做 robots.txt 的纯文本文件，这个文件用于指定 spider 在您网站上的抓取范围。

robots.txt 文件由键值对组成：其中 User-agent 用于描述搜索引擎蜘蛛的名字；Disallow 用于描述不希望被访问到的一个 URL，一个目录或者整个网站，具体的用法如下：
```txt
*网站目录下所有文件均能被所有搜索引擎蜘蛛访问*
User-agent: *
Disallow:

*禁止所有搜索引擎蜘蛛访问网站的任何部分*
User-agent: *
Disallow: /

*禁止所有的搜索引擎蜘蛛访问网站的几个目录*
User-agent: *
Disallow: /haha/

*只允许某个搜索引擎蜘蛛访问*
User-agent: Googlebot
Disallow: 
```
该文件中还可以配置 Sitemap 属性，用于提供网站 sitemap 的 URL 地址，帮助搜索引擎爬虫更有效地发现和索引这些页面：
```txt
User-Agent: *
Disallow: /private/

Sitemap: https://xxxx.com/sitemap.xml
```
在项目中我们只需将`robots.txt`文件上传到网站根目录就行了，注意文件名一定要全小写，然后通过`域名/robots.txt`进行访问。

## 服务端渲染
由于爬虫只能抓取到网页的静态源代码，而无法执行其中的 js 脚本，当网站采用 Vue 构建的单页面应用时，实际上是采用客户端渲染的方式，页面上的大部分 DOM 元素是在客户端通过 JavaScript 动态生成的。

客户端渲染的过程是需要时间的，爬虫不会等你渲染好，因此爬虫能够直接抓取和分析的内容会大幅减少。服务端渲染源代码的 body 里面是有很多标签元素的，这是因为在服务端时已经生成较完整的 html 代码，当网站采用服务端渲染的方式，蜘蛛去爬取网站源代码时，可以获取到更多的内容，有利于 SEO 的优化。

## 内链和外链
在搜索引擎优化领域，有着内链为王、外链为皇的说法，它们都能对提升网站排名有所帮助，尤其是外链的建设。
- **内链**：从自己网站的一个页面指向另外一个页面，通过内链让网站内部形成网状结构，让蜘蛛的广度和深度达到最大化。
- **外链**：在别的网站导入自己网站的链接，通过外链提升网站权重，提高网站流量，同时需要注意外链的质量，低质量的外链反而会影响到本站的排名。

另外，在添加内链外链的过程中，要注意 a 标签中 rel 属性（用于指定当前文档与被链接文档的关系）的使用，下面来看下 nofollow 和 external 两个值的用法。

```html
<a rel="nofollow" href="http://www.baidu.com/">百度</a>
<a rel="external" href="http://www.baidu.com/">百度</a>
```
- `nofollow`：会告诉搜索引擎忽略这个链接，阻止搜索引擎对该页面进行追踪，从而避免权重分散
- `external`：会告诉搜索引擎这是一个外部链接，非本站的链接

## 网站重定向
301 重定向表示本网址永久性转移到另一个地址，302 表示临时重定向。

301 重定向与网址规范化有着类似的作用，它还具有集中域名权重的作用，比如 url1 重定向到 url2，其实是把 url1 的权重转移到了 url2，从而增加 url2 域名的权重。

虽然 canonical 标签可以规范化网址，但是以下四种情况必须配置 301 重定向：
1. 网站替换域名后，旧域名重定向到新域名，弥补流量损失和 SEO
2. 如果删除掉网站中的一些页面，但是这个页面有一定的流量和权重，可以利用 301 重定向到合适的页面避免流量流失
3. 网站改版或因为其他原因导致页面地址发生变化，为避免出现死链接，可以通过 301 重定向来解决

## 结构化数据
结构化数据是 HTML 中标记数据的方式，有助于搜索引擎理解网站内容并引导更高质量的搜索结果，搜索引擎可以知道您的页面包含哪些信息以及如何将其呈现给用户。
比如搜索`南京师范大学`出现的页面，红色框部分就是结构化标记的成果，从框内可以更好的了解该网站的内容，而且占据了大版面也有利于吸引用户注意。
![SEO](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/web/seo.png)
JSON-LD 是结构化数据的一种形式，书写形式可以参考下面的这段代码，更多的 JSON-LD 款式可以参考 JSON-LD
```js
<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "Title of a News Article",
      "image": [
        "https://example.com/photos/1x1/photo.jpg",
        "https://example.com/photos/4x3/photo.jpg",
        "https://example.com/photos/16x9/photo.jpg"
       ],
      "datePublished": "2015-02-05T08:00:00+08:00",
      "dateModified": "2015-02-05T09:20:00+08:00",
      "author": [{
          "@type": "Person",
          "name": "Jane Doe",
          "url": "https://example.com/profile/janedoe123"
        },{
          "@type": "Person",
          "name": "John Doe",
          "url": "https://example.com/profile/johndoe123"
      }]
    }
</script>
```

## 面包屑导航
告诉爬虫当前所处的位置，提供抓取路径的引导，让其更快速的了解网站的整体架构，在抓取网页时也能清楚知道网页的层级及分类索引，有助于提升搜索结果的排名。此外，设定面包屑之后，网站在搜索结果页上也会呈现网址路径，因此可以适时在面包屑的名称中加入关键词，增加用户点击率。

面包屑导航也能优化用户体验，让用户清楚的知道自己所在的位置，更容易筛选自己需要的信息。

## 网站性能
网站打开速度越快，识别效果越好，否则爬虫会认为该网站对用户不友好，降低爬取效率，这时候就要考虑压缩文件体积之类的性能优化了。

## 使用https
Google和其他搜索引擎已经明确表示，他们更喜欢使用HTTPS，因为它提供更高的安全性和更好的用户体验。当您的网站使用HTTPS时，搜索引擎会将其视为更可信和更安全的网站，从而为其排名增加积极因素。

## 站点收录
将创建好的网站地图提交给搜索引擎，以便搜索引擎能够更快更及时地抓取和索引网站。

## 参考
- [**从前端工程师的角度将SEO做到极致🌈**](https://juejin.cn/post/7380688287549800467?searchId=20260414110536AA9CDDBD4F54C595EDB6)
- [**前端开发中常见的 SEO 优化**](https://juejin.cn/post/7491978858430906406?searchId=202601311704263EB09FA44ECC8AAE940B#heading-8)
- [**一个前端知道的 SEO**](https://juejin.cn/post/6844904029923835911?searchId=2026041411053741B7132ADC0EE966D330)
- [**一文带你弄懂 前端SEO优化**](https://juejin.cn/post/7300118821532778511?searchId=20260414110536AA9CDDBD4F54C595EDB6#heading-12)
