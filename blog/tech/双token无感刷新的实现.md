---
slug: double-token-refresh
title: 双token无感刷新的实现
date: 2025-12-26
authors: [beststar]
tags: [技术]
keywords: [双token, 技术原理]
image: /img/tech/doubleToken/fengmian.png
---

前几天的一个深夜躺在床上玩手机玩到了一点半，在困意的逼迫下才终于按下息屏键准备入睡，突然一个念头闪过，想到现在做的系统其实还没有真正引入用户的概念，当然也就没做用户登录功能，之前经常听劳达和橙子哥提起双token无感刷新，感觉有点意思，我想在这个系统里实现一下，结果带着这个想法睡着了。

<!-- truncate -->
## 写在最前
经过探索-构思-实现-修改-优化，本项目**双token无感刷新验证Demo**采用**前后端分离架构**，所使用的技术栈如下：
- **前端**：React、React Router、Vite、TypeScript、Tailwind CSS。
- **后端**：Node.js、Express、Redis。
- **数据库**：PostgreSQL。
- **认证方式**：JWT双Token机制（Access Token + Refresh Token）。

## 路线探索
昨天上午恶补了一下双token无感刷新的相关知识，了解到具体实现要用到[JWT令牌](/docs/Web开发与安全/JWT身份认证)做身份认证，于是学习了一下并整理到了博客的文档里。整体评估下来感觉这事似乎不难做，我打算先写一个[技术实现验证Demo](https://github.com/beststarli/double-token-demo)了解一下整体流程，后续再把这套技术整体迁移到系统里。真要说有难度的地方就是我自己写后端真的不多，尤其是要自己从头搭建后端架构这种工作，还有一点就是连接数据库的相关逻辑代码已经好久没写过了。不过总归要学总归要做，这种事自己着手做一次就明白了，那就动手实现吧，依旧保持在干中学😎。

下午来到工位开始着手实现整个Demo，因为双token需要用到jwt令牌做身份验证，所以还是按照前后端分离的思路来设计Demo系统（具体原因可以参考[文档中这一部分](/docs/Web开发与安全/Session与Cookie#不同开发模式下的身份认证)），既然业务需求清晰，那就先从前端入手把登录页搭建起来吧。

## 前端搭建
### 界面组件
前端界面的搭建流程还是老样子，我习惯先给[v0](https://v0.app/)写一串十分详细的需求和提示词让它帮忙生成一下界面样式，然后拿它生成的第一个version的界面代码迁移到自己的项目里再根据需要进行修改。

之所以只使用第一个version是因为在过去使用v0的过程中发现它有很强的幻觉，最多给它提需求让它优化出第二个version，再往下无论我把提示词和需求描述的多么准确详细，v0都无法生成出相较于version 1和version 2更让我满意的版本。
![v0](/img/tech/doubleToken/v0.png)

v0的审美我很认可，但是逻辑性还是不太行，不过我还是会让它预留好组件关联的触发空函数，函数内部的处理代码后续由我自己来完成。这次在需求描述中还顺带着让它把后端的处理逻辑也预留好空函数方便我后面填入处理代码，有一说一v0生成的界面我真的很喜欢。

把v0生成的界面的代码在我自己先前搭的[React项目脚手架](https://react-scaffold-orcin.vercel.app/)里迁移一下，登录界面搭建的整体工作实际上就大致完成了。不过在迁移代码的时候问题就出现了，我自己搭建的脚手架是用Vite初始化建立的传统SPA应用，而v0默认使用了Next.js，为了模拟登录后界面的路由跳转效果，它使用的是Next.js的文件即路由特性直接通过文件相对路径的方式建立了对登录后界面组件dashboard的跳转，同样后端交互接口也以Next.js的方式进行的实现。

```tsx
try {
    // 调用后端登录接口
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
        // 登录成功，保存tokens
        // Access Token 保存在内存或短期存储
        sessionStorage.setItem('accessToken', data.accessToken)
        // Refresh Token 可以保存在httpOnly cookie中（后端设置）
        // 或者安全存储在localStorage（仅作为demo演示）
        localStorage.setItem('refreshToken', data.refreshToken)

        setMessage({ type: 'success', text: '登录成功！正在跳转...' })

        // 模拟跳转到受保护页面
        setTimeout(() => {
            window.location.href = '/dashboard'
        }, 1500)
    }
    else {
        setMessage({ type: 'error', text: data.message || '登录失败，请检查您的凭据' })
    }
}
catch (error) {
    setMessage({ type: 'error', text: '网络错误，请稍后重试' })
}
finally {
    setLoading(false)
}
```

这不是我所期望的，因为v0使用的Next.js实现方案属于服务端渲染SSR，在先前关于Demo设计上为何因为使用jwt令牌而选择前后端分离设计的方式已做了说明，此外它并没有提供后端Express架构的空函数预留，所以这里我只迁移了v0提供的前端界面代码，提供的路由及后端部分全部舍弃，仍需自己来完成。

### 添加路由
虽然目前并没有真正实现后端的登录逻辑，登录按钮触发并不能完成登录认证并进行页面跳转，但是在登录页中**忘记密码**和**立即注册**是无需接入后端服务就应当能触发界面跳转的，所以我又让v0以与登录页相同的风格生成了一下**注册页**和**密码重置页**的界面。

![注册页1](/img/tech/doubleToken/zhuce1.png)

![重置页1](/img/tech/doubleToken/chongzhi1.png)

可以看到有些文本的间距看着不太舒服，简单调整了一下margin和gap属性，v0不习惯给按钮添加cursor-pointer，为了交互感我比较喜欢按钮悬浮的手势变化就自己再添加了一下。

对于注册页来说，这个验证系统的用户只需要拥有邮箱和密码即可，因此删去了用户名输入组件。“服务条款”与“隐私政策”链接按钮目前没有做功能实现。
![注册页2](/img/tech/doubleToken/zhuce2.png)

对于密码重置页来说，这个Demo系统暂时先不考虑实现真正的密码重置功能，简单调整一下布局样式作为后续功能扩展预留。
![重置页2](/img/tech/doubleToken/chongzhi2.png)

仔细审查v0提供的注册页和密码重置页的前端代码，发现在**返回登录**这个按钮路由跳转的逻辑上它还是使用了Next.js中的Link组件来实现的，由于我一开始就没有考虑要使用和引入Next.js，所以也就没有对Next.js进行配置，导致发生了以下报错：
![Link报错](/img/tech/doubleToken/baocuo.png)

Grok给出的报错原因如下：
![Grok](/img/tech/doubleToken/grok.png)
本质上还是我想在SPA方式下实现，但v0提供了SSR方案导致的。既然需要舍弃Next.js的文件即路由方案，那么就需要用别的技术栈来实现路由，于是理所应当地引入了React Router。
```tsx
App.tsx

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import './App.css'
import Login from "@/components/page/loginPage"
import Register from "@/components/page/registerPage"
import Dashboard from "@/components/page/dashboardPage"
import ForgotPassword from "@/components/page/forgetPage"

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</Router>
	)
}

export default App
```
各组件内`Link`组件的引入方式需替换为:
```tsx
import { Link } from "react-router-dom"
```
具体按钮绑定的路由跳转逻辑不在此详细展示了，详情欢迎查看本Demo源码。这样登录页、注册页、密码重置页三个页面之间就可以丝滑跳转了。







## 二次思考

## 后端搭建

## 连接PostgreSQL数据库

## 引入Redis

## 参考
