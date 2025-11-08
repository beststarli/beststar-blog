import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'
import { themes } from 'prism-react-renderer'
import social from './data/social'
import type { GiscusConfig } from './src/components/Comment'

const config: Config = {

  title: '嘉星的博客',
  url: 'https://www.beststarli.cn/',
  baseUrl: '/',
  favicon: 'img/beststar.jpg',
  organizationName: 'beststarli',
  projectName: 'beststar-blog',
  // 自定义字段
  customFields: {
    bio: '让行动超越思考',
    description: '欢迎访问我的博客，这是一个基于 Docusaurus 构建的个人博客，主要分享技术文章、项目经验和生活碎碎念。',
  },

  // 启用 Docusaurus v4 新特性
  future: {
    v4: true,
  },

  // 主题配置
  themeConfig: {
    // 社交媒体分享时显示的默认图片
    image: 'img/beststar.jpg',
    // 网站的 meta 标签，用于 SEO 优化
    metadata: [
      {
        name: 'author',
        content: '嘉星',
      },
      {
        name: 'keywords',
        content: '博客, 技术, 生活, 编程, 项目',
      },
    ],
    // 主题模式配置
    // colorMode: {
    //   defaultMode: 'light',
    //   disableSwitch: false,
    //   respectPrefersColorScheme: true,
    // },
    // 文档页面配置
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    // 导航栏配置
    navbar: {
      title: 'BestStar Blog',
      logo: {
        alt: '嘉星',
        src: 'img/beststar.jpg',
        srcDark: 'img/beststar.jpg',
      },
      hideOnScroll: true,
      // 导航栏菜单项
      items: [
        { label: '文档', position: 'right', to: '/docs/intro' },
        { label: '博客', position: 'right', to: 'blog' },
        { label: '项目', position: 'right', to: 'project' },
        { label: '关于', position: 'right', to: 'about' },
        {
          label: '更多',
          position: 'right',
          items: [
            { label: '博客归档', to: 'blog/archive' },
            { label: '友情链接', to: 'friends' },
          ],
        },
      ],
    },
    // 页脚配置
    footer: {
      style: 'dark',
      // 页脚链接分组
      links: [
        {
          title: '学习',
          items: [
            { label: '文档', to: '/docs/intro' },
            { label: '博客', to: 'blog' },
            { label: '项目', to: 'project' },
            { label: '归档', to: 'blog/archive' },
          ],
        },
        {
          title: '社交媒体',
          items: [
            { label: '关于我', to: '/about' },
            { label: 'GitHub', href: social.github.href },
            { label: '稀土掘金', href: social.juejin.href },
            { label: '小红书', href: social.xiaohongshu.href },
          ],
        },
        {
          title: '更多',
          items: [
            { label: '友情链接', position: 'right', to: 'friends' },
            {
              html: `
                <a href="https://docusaurus.io" target="_blank" rel="noreferrer noopener">
                  <img src="/img/buildwith.png" alt="Built with Docusaurus" width="120" height="50"/>
                </a>
                `,
            },
            {
              html: `
                <a href="http://geomodeling.njnu.edu.cn/" target="_blank" rel="noreferrer noopener">
                  <img src="/img/opengms.png" alt="Built with Docusaurus" width="120" height="37"/>
                </a>
                `,
            },
          ],
        },
      ],
      // 版权信息
      copyright: `Copyright © ${new Date().getFullYear()} BestStar's Blog. Built with Docusaurus.`,
    },
    // 代码高亮配置
    prism: {
      theme: themes.oneLight,
      darkTheme: themes.oneDark,
      // 额外支持的编程语言
      additionalLanguages: [
        'bash',
        'json',
        'java',
        'python',
        'php',
        'graphql',
        'rust',
        'toml',
        'protobuf',
        'diff',
      ],
      defaultLanguage: 'javascript',

      // 魔法注释：用于在代码块中高亮特定行
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        {
          className: 'code-block-error-line',
          line: 'This will error',
        },
      ],
    },
    // 目录配置
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    // 图片缩放配置
    zoom: {
      selector: '.markdown :not(em) > img',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(50, 50, 50)',
      },
    },
    // Giscus 评论系统配置
    giscus: {
      repo: 'beststarli/beststar-blog',
      repoId: 'R_kgDOQMrJ0Q',
      category: 'General',
      categoryId: 'DIC_kwDOQMrJ0c4CxdDw',
      theme: 'light',
      darkTheme: 'dark_dimmed',
    } satisfies Partial<GiscusConfig>,
    // Mermaid 图表配置
    mermaid: {
      theme: { light: 'neutral', dark: 'dark' },
    },
  } satisfies Preset.ThemeConfig,

  // Markdown 配置
  markdown: {
    mermaid: true,
  },

  // 主题配置
  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        indexPages: true,
        hashed: true,
        language: ['en', 'zh'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  // 预设配置：使用 Docusaurus 经典主题预设
  presets: [
    [
      'classic',
      {
        // 文档配置关闭，使用自定义插件
        docs: false,
        blog: false,

        // 主题配置
        theme: {
          customCss: ['./src/css/custom.css', './src/css/tweet-theme.css'],
        },

        // 网站地图配置
        sitemap: {
          priority: 0.5,
        },
      } satisfies Preset.Options,
    ],
  ],

  // 插件配置
  plugins: [

    // 图片缩放插件
    'docusaurus-plugin-image-zoom',

    // 自定义文档插件
    [
      './src/plugin/plugin-content-docs',
      {
        path: 'docs',
        sidebarPath: './sidebars.ts',
        editUrl: 'https://github.com/beststarli/blog/edit/main/',
      },
    ],

    // 自定义博客插件
    [
      './src/plugin/plugin-content-blog',
      {
        path: 'blog',

        // 编辑链接生成函数
        editUrl: ({ locale, blogDirPath, blogPath }) =>
          `https://github.com/beststarli/blog/edit/main/${blogDirPath}/${blogPath}`,

        editLocalizedFiles: false,
        blogDescription: '记录技术成长和生活感悟',
        blogSidebarCount: 10,
        blogSidebarTitle: '最近文章',
        postsPerPage: 12,
        showReadingTime: true,

        // 阅读时间计算函数（按每分钟 300 字计算）
        readingTime: ({ content, frontMatter, defaultReadingTime, locale }) =>
          defaultReadingTime({ content, locale, options: { wordsPerMinute: 300 } }),

        // RSS Feed 配置
        feedOptions: {
          type: 'all',
          title: '嘉星的博客',
          description: '记录技术成长和生活感悟',
        },
      },
    ],
    // Tailwind CSS 插件
    async function tailwindcssPlugin() {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require('tailwindcss'))
          postcssOptions.plugins.push(require('autoprefixer'))
          return postcssOptions
        },
      }
    },
  ],

  // HTML head 标签配置
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: '我的个人博客',
      },
    },
  ],

  // 外部样式表配置
  stylesheets: [
    'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Normal.min.css',
    'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Medium.min.css',
    'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Semibold.min.css',
  ],

  // 国际化配置
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
  },

  // 断链处理：遇到断链时显示警告而不是报错
  onBrokenLinks: 'warn',
}

export default config
