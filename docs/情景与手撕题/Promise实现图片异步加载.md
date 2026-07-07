---
title: Promise实现图片异步加载
description: Promise实现图片异步加载。
sidebar_position: 49
tags: [JavaScript,场景题,异步编程,手撕题]
date: 2026-07-07
---

## 代码实现
```js
let imageAsync = (url) => {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.src = url
    img.onload = () => {
      console.log('图片加载成功')
      resolve(img)
    }
    img.onerror = (err) => {
      console.log('图片加载失败')
      reject(err)
    }
  })
}

imageAsync(testUrl).then(() => {
  console.log('图片加载成功')
}).catch((err) => {
  console.log(err)
})
```
