---
slug: double-token-refresh
title: 双token无感刷新的实现
date: 2025-12-26
authors: [beststar]
tags: [技术]
keywords: [双token,技术原理]
image: https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/doubleToken/fengmian.png
---

前几天的一个深夜躺在床上玩手机玩到了一点半，在困意的逼迫下才终于按下息屏键准备入睡，突然一个念头闪过，想到现在做的系统其实还没有真正引入用户的概念，当然也就没做用户登录功能，之前经常听劳达和橙子哥提起双token无感刷新，感觉有点意思，我想在这个系统里实现一下，结果带着这个想法睡着了。

{/* truncate */}
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
![v0](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/doubleToken/v0.png)

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

![注册页1](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/doubleToken/zhuce1.png)

![重置页1](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/doubleToken/chongzhi1.png)

可以看到有些文本的间距看着不太舒服，简单调整了一下margin和gap属性，v0不习惯给按钮添加cursor-pointer，为了交互感我比较喜欢按钮悬浮的手势变化就自己再添加了一下。

对于注册页来说，这个验证系统的用户只需要拥有邮箱和密码即可，因此删去了用户名输入组件。“服务条款”与“隐私政策”链接按钮目前没有做功能实现。
![注册页2](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/doubleToken/zhuce2.png)

对于密码重置页来说，这个Demo系统暂时先不考虑实现真正的密码重置功能，简单调整一下布局样式作为后续功能扩展预留。
![重置页2](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/doubleToken/chongzhi2.png)

仔细审查v0提供的注册页和密码重置页的前端代码，发现在**返回登录**这个按钮路由跳转的逻辑上它还是使用了Next.js中的Link组件来实现的，由于我一开始就没有考虑要使用和引入Next.js，所以也就没有对Next.js进行配置，导致发生了以下报错：
![Link报错](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/doubleToken/baocuo.png)

Grok给出的报错原因如下：
![Grok](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/doubleToken/grok.png)
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
前端页面搞得差不多了，轮到我以前写得最少的部分——后端。说实话一开始有点懵，虽然前端代码里把登录请求写到 `/api/auth/login` 了，但后端那边还是空的，连个服务器都没跑起来。摆在我面前的选择有两个：是在这个前端项目里直接开个 `server/` 目录把后端塞进去，还是另开一个仓库单独搞。

想了想还是放在一起算了。一个是环境变量能共用，`.env` 文件写一次两边都能读到；另一个是 Vite 配置里的 proxy 代理规则直接指向本地的 Express 端口，联调的时候一个终端跑前端 `npm run dev`，另一个跑后端 `npm run dev:server`，两行命令搞定省事。而且说到底就是个技术验证的Demo，放在一个仓库里别人clone下来就能看到全貌。

技术选型这块倒是没怎么纠结：
- **后端框架**：Express，轻量灵活适合我这种后端写得不多的选手上手。
- **运行环境**：用 `tsx` 直接跑 TypeScript 文件。
- **数据库**：PostgreSQL，配合 `pg` 模块的参数化查询能防 SQL 注入。
- **缓存**：Redis，后面用来做 Token 黑名单，提升校验效率。
- **密码加密**：bcryptjs，业界标准方案没什么好犹豫的。
- **JWT 令牌**：jsonwebtoken，生成和校验 JWT 的库，功能完善。

在准备动手写后端代码之前，有个问题绕不开——**两个 Token 到底存在前端的什么地方？**

我知道 Access Token 存 `sessionStorage`，浏览器标签页一关就没了，能降低 XSS 攻击泄露的风险。Refresh Token 按理说放 httpOnly Cookie 更安全，但问题是——放 httpOnly Cookie 里，前端 JavaScript 就读不到它了，那我刷新 Token 的时候怎么把它发给后端？虽然有方案可以让后端直接在 Cookie 里读取 Refresh Token，但为了保持整个刷新流程开发起来透明可控，Demo 阶段我还是选了 `localStorage` 来存 Refresh Token，调试的时候打开控制台就能看到 Token 的状态，方便排查问题。

还有个跨域的问题。前端跑在 Vite 的 5173 端口，后端是 Express 的 3001 端口，虽然在后端配个 CORS 也能解决，但每次请求都写 `http://localhost:3001/api/auth/xxx` 也太麻烦了。好在 Vite 的 proxy 配置帮我省了这事——所有以 `/api` 开头的请求自动转发到后端：

```ts
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
}
```

前端代码里直接写 `fetch('/api/auth/login')` 就行，Vite 开发服务器自动帮我把请求转到 Express 那边去了，代码里看不到任何后端地址。

## 后端搭建
说实话我写后端的经验真的不多，好在 Express 本身的结构很简单，核心入口文件也就几行代码：
```ts
// server/server.ts
import express from 'express'
import authRoutes from './routes/auth.ts'

const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

因为用了 `tsx` 来运行 TypeScript，import 里面写 `.ts` 后缀也没问题。package.json 里加个脚本：

```json
"dev:server": "tsx watch server/server.ts"
```

`tsx watch` 支持热重载，改完后端代码保存就能自动重启，和前端 Vite 的体验差不多。

路由设计上我把所有认证相关的接口都挂在了 `/api/auth` 下面：

- `POST /login` — 用户登录
- `POST /register` — 用户注册
- `POST /refresh` — 刷新 Access Token
- `GET /verify` — 验证 Token 有效性（需登录）
- `POST /logout` — 登出
- `POST /forgot` — 忘记密码（功能预留）

接下来说说最核心的两个 Token 是怎么生成的。双 Token 机制的原理就是生成两个不同有效期的 JWT，用的是两个不同的密钥签名：

```ts
const accessToken = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: '15m' }
)

const refreshToken = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.REFRESH_TOKEN_SECRET,
  { expiresIn: '7d' }
)
```

一开始我有点疑惑两个 Token 能不能用同一个密钥？后来想明白了——如果我用同一个密钥，那攻击者拿到 Refresh Token 之后就能用它随便签发新的 Access Token，那 Refresh Token 存得再安全也没用。分开密钥就是做了一层隔离，就算 Access Token 的密钥泄露了，攻击者也伪造不了 Refresh Token，这样 Refresh Token 的长期有效性才能保证。

对于需要登录保护的接口，我写了一个 `authenticateToken` 中间件：

```ts
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]  // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: '未提供认证token' })
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Access token已过期' })
      }
      return res.status(403).json({ message: 'Token无效' })
    }
    req.user = user
    next()
  })
}
```

这里做了一个区分：Token **过期**返回 401，Token **无效**（比如被篡改）返回 403。前端的逻辑就是——看到 401 就去刷新，看到 403 就直接跳登录页。

### 登录接口
因为在同一个文件里既有数据库连接逻辑又有业务逻辑，代码看起来确实有点长，这里看看关键的部分：
```ts
// 参数化查询，防止 SQL 注入
const userQuery = await client.query(
  'SELECT * FROM users WHERE email = $1', [email]
)
const user = userQuery.rows[0]

if (!user) {
  return res.status(401).json({ message: '邮箱或密码错误' })
}

// bcrypt 比对密码
const isValidPassword = await bcrypt.compare(password, user.password)
if (!isValidPassword) {
  return res.status(401).json({ message: '邮箱或密码错误' })
}
```

不管你输入的是不存在的邮箱还是错误的密码，我都只返回"邮箱或密码错误"这一条信息——这是为了防止枚举攻击，攻击者没法通过错误信息来判断邮箱是否存在。

生成 Token 后还有个重要的操作：**先删除该用户旧的 Refresh Token，再插入新的**。这样做的目的是保证一个用户在任何时候只有一个有效的 Refresh Token，旧的 Token 在重新登录后立即失效。

### 刷新接口
刷新接口是整个双 Token 方案里最核心的部分。当 Access Token 过期后，前端拿 Refresh Token 来换一个新的 Access Token：

```ts
// 先查数据库——Token 是否存在、是否被撤销、是否过期
const tokenQuery = await client.query(
  'SELECT * FROM refresh_tokens WHERE token = $1 AND revoked = false AND expires_at > NOW()',
  [refreshToken]
)

// 再用 JWT 验证签名完整性
decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
```

这里做了**双重校验**。数据库那一关先拦住已被撤销或过期的 Token，JWT 那一关防止 Token 被篡改。只有两层都过了才算校验通过。最开始写的时候我差点只做了 JWT 验证，后来才意识到——JWT 验证通过只说明 Token 的签名没问题，但如果用户已经登出过，数据库里这个 Token 已经被标记成 `revoked` 了，那它就应该失效。

### 注册接口
注册接口其实比我想象的要简单。校验一下邮箱密码、检查邮箱有没有被注册过、bcrypt 加密密码、写库、生成双 Token 返给前端。注册成功后直接返回 Token，这样用户注册完不用再重新登录，体验上很流畅。

密码加密这块，`bcrypt.hash(password, 10)` 的 10 代表盐值轮数，数值越高加密越慢但也越安全。10 是大多数场景下的推荐值，哈希一次大概几十毫秒，安全性和性能的平衡刚刚好。

### 登出接口
登出这块我想得比较细——不能只是前端清除一下 Token 就完事了。前端把本地 Token 清掉当然是最基本的，但后端也要同步把 Refresh Token 标记为已撤销，这样就算有人拿着之前泄露的 Refresh Token 来刷新，后端也不会给它新 Token。

### 前端的自动刷新——让用户感觉不到
前端的 Dashboard 页面才是真正体现"无感"的地方。当页面加载时，它带着 Access Token 去验证身份，如果后端返回 401，就自动调用刷新接口，拿到新 Token 后再重新验证——整个过程用户完全感知不到：

```tsx
const verifyToken = async (token: string) => {
  const response = await fetch("/api/auth/verify", {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (response.ok) {
    setUser(data.user)
  } else if (response.status === 401) {
    await refreshAccessToken()  // ← 自动刷新，用户无感
  }
}
```

如果连 Refresh Token 也过期了（刷新接口返回错误），那前端就会把本地存储清空，直接跳回登录页让用户重新登录。流程图就是这么个意思：

**请求 API → 401 → 拿 Refresh Token 去刷新 → 拿到新 Token → 重试请求 → 用户无感知**

如果 Refresh Token 也跪了 → 清空本地 Token → 跳转登录页。

## 连接PostgreSQL数据库
后端接口写得差不多了，发现数据库还没连上，`pg`模块的连接池配置本身倒不复杂，从环境变量里读一下连接信息就行：

```ts
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'double_token',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
})
```

`.env` 文件统一管理配置，`.env.example` 作为模板提交到 Git 仓库，这样其他人 clone 下来之后复制一份改成自己的配置就能跑了：

```env
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

DB_HOST=localhost
DB_PORT=5432
DB_NAME=dtoken
DB_USER=postgres
DB_PASSWORD=123456
```

### 建表
数据库连接配好之后，还需要两张表来存储数据。第一张是用户表：

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

`password` 字段存的是 bcrypt 加密后的密文，不是明文密码。要是数据库真被拖库了，攻击者也拿不到原始密码。`email` 加上 `UNIQUE` 约束防止重复注册。

第二张是 Refresh Token 存储表：

```sql
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

`user_id` 外键关联到 `users` 表，`ON DELETE CASCADE` 的意思是如果用户被删除了，他所有的 Refresh Token 记录也会自动清除掉。`revoked` 字段标记 Token 是否被撤销，`expires_at` 用来快速过滤已经过期的 Token。我还给 `token` 和 `user_id` 加了索引，查询性能会好一些——毕竟每次刷新 Token 都要查这个表，索引少不了。

为了验证数据库连接是不是正常，我搞了个 `/api/auth/testdb` 接口，跑一个 `SELECT NOW()` 查询，能返回当前时间就说明连上了。开发的时候用浏览器或者 curl 访问一下这个接口就能确认数据库状态，很方便。

## 引入Redis
做 Token 撤销的时候我想到了一个问题：每次刷新 Token 都得去查 PostgreSQL，看看这个 Token 有没有被撤销。数据库查询在高并发场景下是有性能瓶颈的，而且登出后标记为已撤销这个操作，本质上就是"在一段时间内记住某个 Token 不行了"——这不就是缓存最擅长干的事吗？

Redis 就派上用场了：内存数据库读写极快，而且自带 TTL 过期机制，Token 的有效期一到 Redis 自动清理，不用我手动去维护那些过期数据。

连接配置也很简单：

```ts
import { createClient } from 'redis'

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
})

client.on('error', err => console.error('Redis Client Error', err))

;(async () => {
  await client.connect()
  console.log('Redis 连接成功！')
})()

export default client
```

不过说实话，Redis 在这个 Demo 里目前只是完成了连接配置，黑名单的逻辑还没有真正接到业务代码里。因为现在的 Token 撤销完全靠 PostgreSQL 的 `revoked` 字段，对 Demo 来说够用了。

### 完整流程梳理
最后还是用文字梳理一下双 Token 无感刷新的完整流程：

1. **用户登录** → 后端校验邮箱密码 → 返回 Access Token（15分钟有效）+ Refresh Token（7天有效） → 前端分别存到 sessionStorage 和 localStorage
2. **访问 API** → 请求头带 Access Token → 后端中间件校验 → 有效就放行
3. **Access Token 过期** → 后端返回 401 → 前端拦截到 401 → 自动调用刷新接口
4. **刷新 Token** → 带上 Refresh Token 去后端 → 双重校验（数据库 + JWT） → 返回新的 Access Token
5. **重试请求** → 用新 Token 重新发刚才失败的请求 → 整个过程用户完全没感觉
6. **登出** → 前端清本地 Token → 通知后端撤销 Refresh Token → 该 Token 此后不再可用


---
**结束。**
