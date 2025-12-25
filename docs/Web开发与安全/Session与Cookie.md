---
title: Session与Cookie
description: Session认证是一种常见的Web应用程序认证机制，用于在用户登录后维护其身份状态。Cookie是一种在客户端（浏览器）保存数据的机制。
sidebar_position: 4
tags: [Web]
date: 2025-12-25
---

# Session与Cookie

## 身份认证

### 什么是身份认证
身份认证（Authentication）又称“身份验证”、“鉴权”，是指通过一定的手段，完成对用户身份的确认。

日常生活中的身份认证随处可见，例如：高铁的验票乘车，手机的密码或指纹解锁，支付宝或微信的支付密码等。

在 Web 开发中，也涉及到用户身份的认证，例如：各大网站的手机验证码登录、邮箱密码登录、二维码登录等。

### 为什么需要身份认证
身份认证的目的，是为了确认当前所声称为某种身份的用户，确实是所声称的用户。例如：找快递员取快递要怎么证明这份快递是自己的。

在互联网项目开发中，如何对用户的身份进行认证，是一个值得深入探讨的问题。例如，如何才能保证网站不会错误的将“马云的存款数额”显示到“马化腾的账户”上。

### 不同开发模式下的身份认证
对于服务端渲染和前后端分离这两种开发模式来说，分别有着不同的身份认证方案：
- 服务端渲染推荐使用Session认证机制。
- 前后端分离推荐使用[JWT认证机制](/docs/Web开发与安全/JWT身份认证)。

## Session认证机制

### 概念
Session是Web应用程序中的一种会话管理机制，用于存储和维护用户的会话状态。

会话是指在用户与服务器之间的一系列请求和响应之间的交互过程。当用户访问Web应用时，服务器会创建一个唯一的会话ID，并将其存储在用户的浏览器中的Cookie中。在接下来的请求中，浏览器会将会话ID作为参数发送给服务器，以便服务器可以识别用户并将其请求与之前的请求相关联。

### 为什么会有Session
了解HTTP协议的**无状态性**是进一步学习Session认证机制的必要前提。

HTTP协议的无状态性，指的是客户端的每次HTTP请求都是独立的，连续多个请求之间没有直接的关系，服务器不会主动保留每次HTTP请求的状态。由于HTTP协议是无状态的，当用户在网站中进行多次请求，服务器并不能判断这些请求是不是来自同一用户，所以出现了一种技术称为**会话跟踪技术**。会话跟踪技术能解决这个问题，与无状态的通信相比，会话是一种有状态的通信，这种通信至少需要一方来维护当前的状态信息和历史信息，而Session就是其中一种会话跟踪技术，下面提到的Cookie也是。

### 原理
Session的原理是基于服务器端的存储和管理，因此相对来说比较安全。在用户访问Web应用程序时，服务器会为每个用户创建一个唯一的Session ID，服务器会将Session ID和对应的会话状态存储在内存或者数据库中，同时也返回一份Session ID给浏览器，让浏览器存储在Cookie中，并在一定时间内保持有效。当用户进行后续的请求时，服务器会根据Session ID来识别用户，并获取和维护用户的会话状态。最后，当用户关闭浏览器或者超过一定时间没有活动时，服务器会自动销毁对应的Session。

![Session原理](/img/docs/web/Session.png)

Session的优点是安全性相对较高，存储容量可以存储任意数据类型，并且可以设置失效时间。但是它也存在一些缺点：
- 存储在服务器端，需要占用服务器资源（比如内存资源）。
- 失效时间短，一般只有数分钟或数小时。
- 难以跨域共享，不同域名的服务器无法共享Session。

### Express实现Session认证
在Express项目中，只需要安装express-session中间件，即可在项目中使用Session认证：

<details>
<summary>📝点击展开查看完整代码</summary>

```js
// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

// TODO_01：请配置 Session 中间件
// 导入 session 中间件
const session = require('express-session')
// 配置 session 中间件
app.use(session({
  secret: 'itheima',      // secret 属性的值可以是任意字符串
  resave: false,          // 固定写法
  saveUninitialized: true // 固定写法
}))

// 托管静态页面
app.use(express.static('./pages'))
// 解析 POST 提交过来的表单数据
app.use(express.urlencoded({ extended: false }))

// 登录的 API 接口
app.post('/api/login', (req, res) => {
  // 判断用户提交的登录信息是否正确
  if (req.body.username !== 'admin' || req.body.password !== '000000') {
    return res.send({ status: 1, msg: '登录失败' })
  }

  // TODO_02：请将登录成功后的用户信息，保存到 Session 中
  // 注意：只有成功配置了 epxress-session 这个中间件，才能使用 req.session
  req.session.user = req.body // 将用户信息，存储到 Session 中
  req.session.islogin = true  // 将用户的登录状态，存储到 Session 中

  res.send({ status: 0, msg: '登录成功' })
})

// 获取用户姓名的接口
app.get('/api/username', (req, res) => {
  // TODO_03：请从 Session 中获取用户的名称，响应给客户端
  // 判断用户是否登录
  if (!req.session.islogin) {
    return res.send({status: 1, msg: 'fail'})
  }
  // 如果已登录，发送用户姓名
  res.send({
    status: 0,
    msg: 'success',
    username: req.session.user.username
  })
})

// 退出登录的接口
app.post('/api/logout', (req, res) => {
  // TODO_04：清空 Session 信息
  // 调用 req.session.destroy() 函数，即可清空服务器保存的 session 信息。
  req.session.destroy()
  res.send({
    status: 0,
    msg: '退出登录成功！'
  })
})

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(8000, function () {
  console.log('Express server running at http://127.0.0.1:8000')
})
```
</details>

## Cookie

### 概念
Cookie是一种在客户端（浏览器）保存数据的机制，是存储在用户浏览器中的一段不超过4KB的字符串。它由一个名称（Name）、一个值（Value）和其它几个用于控制Cookie有效期、安全性、使用范围的可选属性组成。

不同域名下的Cookie各自独立，每当客户端发起请求时，会自动把当前域名下所有未过期的Cookie一同发送到服务器。

Cookie具有以下特性：
- 自动发送
- 域名独立
- 过期时限
- 4KB 限制

Cookie和Session总是会被拿来比较的。Cookie和Session都是用来跟踪浏览器用户身份的会话技术，或者说一种机制。它们都可以实现在多个页面之间共享用户的状态。

### 原理
浏览器第一次发送请求到服务器，服务器通过响应头的形式向客户端发送一个身份认证的Cookie，客户端会自动将Cookie保存在浏览器中。该Cookie中包含着信息，可以是用户的信息（用户偏好设置、广告偏好）。

浏览器之后再次访问服务器时就会携带服务器创建的 Cookie，**这不需要我们做任何操作，不需要写任何代码，浏览器帮我们实现了在每一次的请求中都携带上Cookie**。服务器端通过Cookie中携带的数据区分不同的用户。

![Cookie原理](/img/docs/web/Cookie.png)

Cookie的优点是可以长时间保存，并且可以在客户端设置，但是它也存在一些缺点：
- 安全性相对较差，容易被不法分子获取
- 存储容量有限，一般只能存储 ASCII 码
- 失效时间可以设置，但是客户端可以随时清除 Cookie

由于Cookie是存储在浏览器中的，而且浏览器也提供了读写Cookie的API，因此Cookie很容易被伪造，不具有安全性。所以不建议服务器将重要的隐私数据通过Cookie的形式发送给浏览器。
 
## 总结
Session是一种服务器端的存储机制，它将用户状态信息存储在服务器上，每个用户都有一个独立的Session。

在用户第一次访问服务器的时候，服务器会为其创建一个Session，并将Session ID放到一个名为JSESSIONID的Cookie中发送给浏览器。

Cookie是一种客户端（浏览器）存储机制，它将用户状态信息存储在客户端浏览器上。我们知道，用户第一次访问服务器的时候，服务器会将一些数据（比如JSESSIONID）写入Cookie并发送给客户端，客户端在后续的请求中会将Cookie发送给服务器。

- **存储容量**方面：Cookie的存储容量较小，一般只能存储ASCII码，而Session可以存储任意数据类型。
- **安全性**方面：Session相对于Cookie更加安全，因为Session存储在服务器，客户端无法直接访问。
- **跨域共享**方面：Cookie可以跨域共享，而Session只能在同一域名下共享。

## 参考
[【Node入门系列】前后端的身份认证 — Session（9）](https://juejin.cn/post/7135002546787057700?searchId=20251224113244D267A304BE546C9742CF)
[一文快速回顾 Session 和 Cookie](https://juejin.cn/post/7208907020798689339?searchId=20251225093431EA5A9C4C6CD47022A5BE)