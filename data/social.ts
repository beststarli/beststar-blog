export type Social = {
  github?: string
  x?: string
  juejin?: string
  qq?: string
  wx?: string
  qqmusic?: string
  cloudmusic?: string
  zhihu?: string
  email?: string
  discord?: string
  xiaohongshu?: string
}

type SocialValue = {
  href?: string
  title: string
  icon: string
  color: string
}

const social: Social = {
  github: 'https://github.com/beststarli',
  juejin: 'https://juejin.cn/user/4452381363012896',
  xiaohongshu: 'https://www.xiaohongshu.com/user/profile/64cb7f88000000000b0073dc',
  cloudmusic: 'https://music.163.com/#/user/home?id=267331472',
  email: 'mailto:beststarli@foxmail.com',
  // x: 'https://twitter.com/yourusername',
  // wx: 'https://img.yourdomain.com/wechat.png',
  // qq: '',
  // zhihu: 'https://www.zhihu.com/people/yourusername',
  // discord: 'https://discord.gg/YOUR_INVITE',
}

const socialSet: Record<keyof Social | 'rss', SocialValue> = {
  github: {
    href: social.github,
    title: 'GitHub',
    icon: 'ri:github-line',
    color: '#010409',
  },
  juejin: {
    href: social.juejin,
    title: '稀土掘金',
    icon: 'simple-icons:juejin',
    color: '#1E81FF',
  },
  xiaohongshu: {
    href: social.xiaohongshu,
    title: '小红书',
    icon: 'simple-icons:xiaohongshu',
    color: '#FF2442',
  },
  x: {
    href: social.x,
    title: 'X',
    icon: 'ri:twitter-x-line',
    color: '#000',
  },
  wx: {
    href: social.wx,
    title: '微信',
    icon: 'ri:wechat-2-line',
    color: '#07c160',
  },
  zhihu: {
    href: social.zhihu,
    title: '知乎',
    icon: 'ri:zhihu-line',
    color: '#1772F6',
  },
  discord: {
    href: social.discord,
    title: 'Discord',
    icon: 'ri:discord-line',
    color: '#5A65F6',
  },
  qq: {
    href: social.qq,
    title: 'QQ',
    icon: 'ri:qq-line',
    color: '#1296db',
  },

  qqmusic: {
    href: social.qqmusic,
    title: 'QQ音乐',
    icon: 'ri:music-2-fill',
    color: '#0FBE73',
  },
  cloudmusic: {
    href: social.cloudmusic,
    title: '网易云音乐',
    icon: 'ri:netease-cloud-music-line',
    color: '#C20C0C',
  },
  email: {
    href: social.email,
    title: '邮箱',
    icon: 'ri:mail-line',
    color: '#F8D810',
  },
  rss: {
    href: '/blog/rss.xml',
    title: 'RSS',
    icon: 'ri:rss-line',
    color: '#FFA501',
  },
}

export default socialSet
