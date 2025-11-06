import { Icon } from '@iconify/react'
import Translate from '@docusaurus/Translate'
import OpenSourceSvg from '@site/static/svg/undraw_open_source.svg'
import WebDeveloperSvg from '@site/static/svg/undraw_developer-activity_4zqd.svg'
import IdeasSvg from '@site/static/svg/undraw_ideas_vn7a.svg'

export type FeatureItem = {
  title: string | React.ReactNode
  description: string | React.ReactNode
  header: React.ReactNode
  icon?: React.ReactNode
}

const FEATURES: FeatureItem[] = [
  {
    title: <Translate id="homepage.feature.developer">技术开发</Translate>,
    description: (
      <Translate id="homepage.feature.developer.desc">
        作为一名开发者，致力于学习和分享前沿技术知识
      </Translate>
    ),
    header: <WebDeveloperSvg className="h-auto w-full" height={150} role="img" />,
    icon: <Icon icon="logos:typescript-icon" className="size-4 text-neutral-500" />,
  },
  {
    title: <Translate id="homepage.feature.blogger">博客写作</Translate>,
    description: (
      <Translate id="homepage.feature.blogger.desc">
        热爱用文字记录，写下自己的技术成长和生活感悟
      </Translate>
    ),
    header: <IdeasSvg className="h-auto w-full" height={150} role="img" />,
    icon: <Icon icon="carbon:pen" className="size-4 text-neutral-500" />,
  },
  {
    title: <Translate id="homepage.feature.openSource">开源贡献</Translate>,
    description: (
      <Translate id="homepage.feature.openSource.desc">
        积极参与开源社区，分享自己的项目
      </Translate>
    ),
    header: <OpenSourceSvg className="h-auto w-full" height={150} role="img" />,
    icon: <Icon icon="logos:github-icon" className="size-4 text-neutral-500" />,
  },
]

export default FEATURES
