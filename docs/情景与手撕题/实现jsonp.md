---
title: 实现jsonp
description: 实现jsonp。
sidebar_position: 57
tags: [JavaScript,场景题,手撕题]
date: 2026-07-07
---

jsonp（JSONP - JSON with Padding）是一种跨域数据交互协议。由于浏览器的同源策略限制，JavaScript 无法直接访问不同域名下的数据。JSONP 通过动态创建 `<script>` 标签来实现跨域请求，利用了 `<script>` 标签不受同源策略限制的特点。

实现思路是：创建一个全局函数，该函数接收服务器返回的数据作为参数；然后动态创建一个 `<script>` 标签，将其 `src` 属性设置为要请求的 URL，并在 URL 中传递回调函数名；当服务器响应时，会将数据包装在回调函数中返回，从而实现跨域数据交互。
## 代码实现
```js
// 动态的加载js文件
function addScript(src) {
  const script = document.createElement('script')
  script.src = src
  script.type = 'text/javascript'
  document.body.appendChild(script)
}

addScript('http://localhost:3000/jsonp?callback=handleData')
// 设置一个全局的callback函数，接收服务器返回的数据
function handleRes(res) {
  console.log(res)
}
// 接口返回的数据格式
handleRes({a: 1, b: 2})
```
