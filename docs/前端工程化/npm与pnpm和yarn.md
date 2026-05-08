---
title: npm与pnpm和yarn
description: npm、yarn、pnpm都是JavaScript/Node.js生态里用来管理依赖包（安装、更新、删除node_modules里的库）的工具，也叫包管理器。
sidebar_position: 3
tags: [前端工程化]
date: 2026-02-09
---

## npm
### npm 2
在npm 2中，所有的依赖包都会被安装在项目根目录下的`node_modules`文件夹中，当展开依赖包的文件夹时，可以看到依赖包内部也存在着一个`node_modules`文件夹，这个文件夹中存放着该依赖包所依赖的其他包，每个其他的包也会有自己的`node_modules`文件夹，以此类推，形成了一个**高度嵌套的依赖树**。

这一时期采用简单的递归依赖方法，`node_modules`是嵌套的，这样做的问题在于多个包之间难免会有公共的依赖，这样嵌套的话，同样的依赖会复制很多次，会占据比较大的磁盘空间。容易造成**重复依赖嵌套地狱**，**空间资源浪费**，**安装速度过慢**。最致命的是 windows 的文件路径最长是 260 多个字符，有超出路径长度限制的风险。

### npm 3
npm 3开始采取**扁平化**的依赖结构，这样的依赖结构可以很好的解决重复依赖的嵌套地狱问题，但是却出现扁平化依赖算法耗时长这样新的问题。

npm 的扁平化依赖算法通过将所有依赖尽可能放在顶层 node_modules 目录下，减少了路径深度和重复依赖，从而避免“依赖地狱”。然而，由于需要解析大量依赖、解决版本冲突、处理网络请求和磁盘 I/O 操作，这个过程可能会耗时较长。

### npm 5
为了解决上面出现的扁平化依赖算法耗时长问题，npm 引入`package-lock.json`机制，`package-lock.json` 的作用是锁定项目的依赖结构，保证依赖的稳定性和一致性。它记录了项目中所有安装的依赖包的确切版本和依赖关系树。当安装依赖时，npm 会优先使用 `package-lock.json` 中的信息来安装依赖，这样可以避免重复解析依赖树，从而大大提高安装速度。

在 `package-lock.json` 机制出现之前，可以通过 `npm-shrinkwrap` 实现锁定依赖结构，但是 `npm-shrinkwrap` 默认关闭，需要主动执行来启用。

## yarn
yarn通过**铺平**来解决依赖重复很多次，嵌套路径过长的问题。所有的依赖不再一层层嵌套了，而是全部在同一层。不过还是有些依赖包内部仍存在嵌套的`node_modules`，这是因为一个包是可能有多个版本的，提升只能提升一个，所以后面再遇到相同包的不同版本，依然还是用嵌套的方式。npm 3的做法与yarn这样类似。

yarn出现的时间是npm 3时期，yarn所解决的问题基本就是npm 5所解决的问题，包括使用`yarn.lock`等机制来锁定版本依赖，实现并发网络请求，最大化网络资源利用率，其次还有利用缓存机制，实现了离线模式安装。

后期很多npm都是在学习yarn的机制，以上yarn的功能npm也已基本实现，目前来说使用npm和yarn的差别已经不大了，具体看个人需求。

不过扁平化也引入了新的问题，最主要就是[幽灵依赖](/docs/前端工程化/幽灵依赖)。还有一个问题，就是上面提到的依赖包有多个版本的时候，只会提升一个，其余版本的包还是复制了很多次，依然有浪费磁盘空间的问题。pnpm就是来解决这个问题的。

## pnpm
由于同样的依赖会复制多次且路径过长在windows下存在风险，因此npm 3和yarn要做`node_modules`扁平化，如果不复制而是采用软硬链接呢？

pnpm 内部使用基于内容寻址的文件系统来存储磁盘上所有的文件，这样可以做到不会出现重复安装，在项目中需要使用到依赖的时候，pnpm 只会安装一次，之后再次使用都会直接**硬链接**指向该依赖，极大节省磁盘空间，并且加快安装速度。不复制文件，只在全局仓库保存一份 npm 包的内容，包是从全局 store 硬链接到虚拟 store 的，这里的虚拟 store 就是 `node_modules/.pnpm`。这样做也不会有幽灵依赖的问题。

所有的依赖都在`.pnpm`文件夹中铺平了，都是从全局 store 硬链接过来的，然后包和包之间的依赖关系是通过软链接组织的。也就是说，所有的依赖都是从全局 store 硬连接到了 `node_modules/.pnpm` 下，然后之间通过软链接来相互依赖。
![pnpm](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/construction/pnpm.jpg)

:::info **硬链接**
硬链接是多个文件名指向同一个文件的实际内容，而软链接（符号链接）是一个独立的文件，指向另一个文件或目录的路径。硬链接和软链接的区别在于，硬链接直接指向文件的物理位置，而软链接则是一个指向另一个文件路径的引用。
:::

yarn有独特的PnP安装方式，可以直接去掉`node_modules`，将依赖包内容写在磁盘，节省了node文件I/O的开销，这样也能提升安装速度，但是yarn PnP和pnpm机制是不同的，且总体来说安装速度pnpm是要快于yarn PnP的。

最后就是 pnpm 是默认支持 monorepo 多项目管理的，在日渐复杂的前端多项目开发中尤其适用，也就说我们不再需要 lerna 来管理多包项目，可以使用 pnpm + Turborepo 作为我们的项目管理环境。

另外，pnpm还可以管理Node.js的版本，来直接替代nvm：
```bash
# 安装 LTS 版本
pnpm env use --global lts
# 安装指定版本
pnpm env use --global 22
```

## 总结
- npm 2 是通过嵌套的方式管理 node_modules 的，会有同样的依赖复制多次的问题。
- npm 3+ 和 yarn 是通过铺平的扁平化的方式来管理 node_modules，解决了嵌套方式的部分问题，但是引入了幽灵依赖的问题，并且同名的包只会提升一个版本的，其余的版本依然会复制多次。
- pnpm 则是用了另一种方式，不再是复制了，而是都从全局 store 硬连接到 node_modules/.pnpm，然后之间通过软链接来组织依赖关系。这样不但节省磁盘空间，也没有幽灵依赖问题，安装速度还快，从机制上来说完胜 npm 和 yarn。pnpm 就是凭借这个对 npm 和 yarn 降维打击的。

## 参考
- [**npm Docs**](https://docs.npmjs.com/)
- [**Safe, stable, reproducible projects**](https://yarnpkg.com/)
- [**pnpm: Save time. Save disk space. Supercharge your monorepos.**](https://pnpm.io/)
- [**pnpm 是凭什么对 npm 和 yarn 降维打击的**](https://juejin.cn/post/7127295203177676837?searchId=20260508110408072D5B6B92D1F510F1EE)
- [**pnpm、npm、yarn 包管理工具『优劣对比』及『环境迁移』**](https://juejin.cn/post/7286362110211489855?searchId=2026050814305761F50004BD68035BFAB6#heading-10)