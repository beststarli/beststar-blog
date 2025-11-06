import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'
import { themes } from 'prism-react-renderer'
import social from './data/social'
import type { GiscusConfig } from './src/components/Comment'

const config: Config = {
  title: '嘉星的博客',
  url: 'https://beststar-blog.vercel.app/',
  baseUrl: '/',
  favicon: 'img/beststar.jpg',
  organizationName: 'beststarli',
  projectName: 'blog',
  customFields: {
    bio: '让行动超越思考',
    description: '欢迎访问我的博客，这是一个基于 Docusaurus 构建的个人博客，主要分享技术文章、项目经验和生活碎碎念。',
  },

  future: {
    v4: true,
  },

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
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
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true, // 跟随系统主题
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: 'BestStar Blog',
      logo: {
        alt: '嘉星',
        src: 'img/beststar.jpg',
        srcDark: 'img/beststar.jpg',
      },
      hideOnScroll: true,
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
    footer: {
      style: 'dark',
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
      copyright: `Copyright © ${new Date().getFullYear()} BestStar's Blog. Built with Docusaurus.`,
    },
    prism: {
      theme: themes.oneLight,
      darkTheme: themes.oneDark,
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
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    zoom: {
      selector: '.markdown :not(em) > img',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(50, 50, 50)',
      },
    },
    giscus: {
      repo: 'beststarli/beststar-blog',
      repoId: 'R_kgDOQMrJ0Q',
      category: 'General',
      categoryId: 'DIC_kwDOQMrJ0c4CxdDw',
      theme: 'light',
      darkTheme: 'dark_dimmed',
    } satisfies Partial<GiscusConfig>,
  } satisfies Preset.ThemeConfig,

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css', './src/css/tweet-theme.css'],
        },
        sitemap: {
          priority: 0.5,
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    'docusaurus-plugin-image-zoom',
    [
      './src/plugin/plugin-content-blog',
      {
        path: 'blog',
        editUrl: ({ locale, blogDirPath, blogPath }) =>
          `https://github.com/beststarli/blog/edit/main/${blogDirPath}/${blogPath}`,
        editLocalizedFiles: false,
        blogDescription: '记录技术成长和生活感悟',
        blogSidebarCount: 10,
        blogSidebarTitle: '最近文章',
        postsPerPage: 12,
        showReadingTime: true,
        readingTime: ({ content, frontMatter, defaultReadingTime, locale }) =>
          defaultReadingTime({ content, locale, options: { wordsPerMinute: 300 } }),
        feedOptions: {
          type: 'all',
          title: '嘉星的博客',
          description: '记录技术成长和生活感悟',
        },
      },
    ],
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

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: '我的个人博客',
      },
    },
  ],

  stylesheets: [
    'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Normal.min.css',
    'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Medium.min.css',
    'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Semibold.min.css',
  ],

  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
  },

  onBrokenLinks: 'warn',
}

export default config
