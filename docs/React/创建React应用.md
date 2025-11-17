---
title: 创建React应用
description: 如何创建和初始化一个React应用
sidebar_position: 4
tags: [React应用, 初始化]
date: 2025-11-11
---

# 创建一个React应用

## 全栈框架
全栈框架支持客户端渲染（CSR）、单页应用（SPA）和静态站点生成（SSG），这些应用可以部署到CDN或静态托管服务（无需服务器）。此外，这些框架可根据实际需求针对特定路由单独启用服务端渲染。也就是说可以从纯客户端开始构建，后续需求变更无需重构整个应用，即可在特定路由启动服务端功能。

### Next.js
Next.js由Vercel维护。
Next.js的App Router打包器让我们可以在同一个React树中混合使用构建时、仅服务器端和交互式组件。App Router还集成了使用Suspense的数据获取，可以直接在React树中为用户界面的不同部分指定加载状态。服务器组件和Suspense是React的特性，而不是Next.js的特性。
```bash
npx create-next-app@latest
```

### React Router
React Router是React最流行的路由库，可以与Vite结合创建一个全栈React框架。
```bash
npx create-react-router@latest
```

### Expo
Expo可以创建支持真正原生UI的通用Android、iOS和Web应用。它为React Native提供了一个SDK，让原生部分更易于使用。
```bash
npx create-expo-app@latest
```

## 从零构建
### 构建工具Vite
通过Vite直接初始化一个React应用脚手架，实际上这是我构建React应用最常用的做法，如果后续需要支持服务器端渲染（SSR）、静态站点生成（SSG）或React服务器组件（RSC），将需要我们自行实现。Vite采用约定式设计，开箱即提供合理的默认配置。拥有丰富的插件生态系统，能够支持快速热更新、JSX、Babel/SWC等常见功能。它也是React官方在React Router中推荐的框架之一。
```bash
npm create vite@latest your-app -- --template react
```
### 应用程序模式
Vite初始化的React应用脚手架是从客户端单页应用程序（SPA）开始，但不包括路由、数据获取或样式等常见功能的进一步解决方案。
#### 路由

#### 数据获取

#### 代码拆分

#### 优化渲染
通常Vite仅支持SPA，还需要实现其他渲染模式如SSR、SSG、RSC，渲染策略需要与路由集成，以便使用框架构建的应用程序可以在每个路由级别选择渲染策略，这使得我们不需要重构整个应用程序就可以使用不同的渲染策略。

使用合适的渲染策略针对合适的路由可以减少加载第一个内容字节的时间 (首字节时间)，第一个内容元素渲染的时间 (首次内容绘制)，以及应用程序最大可见内容渲染的时间 (最大内容绘制)。