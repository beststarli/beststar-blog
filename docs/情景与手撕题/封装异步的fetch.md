---
title: 封装异步的fetch
description: 封装异步的fetch，使用async await方式来使用。
sidebar_position: 51
tags: [JavaScript,场景题,手撕题]
date: 2026-07-07
---

封装异步的fetch，使用async await方式来使用
## 代码实现
```js
(async () => {
  class HttpRequestUtil {
    async get(url) {
      const res = await fetch(url)
      const data = await res.json()
      return data
    }
    async post(url, data) {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      return result
    }
    async put(url, data) {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      return result
    }
    async delete(url, data) {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      return result
    }
    const httpRequestUtil = new HttpRequestUtil()
    const res = await httpRequestUtil.get('https://jsonplaceholder.typicode.com/posts/1')
    console.log(res)
  }
})()
```