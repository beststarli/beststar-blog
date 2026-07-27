---
title: 使用Promise封装AJAX请求
description: 使用Promise封装AJAX请求
sidebar_position: 25
tags: [JavaScript,HTTP,Promise,手撕题]
date: 2026-07-06
---


## 代码实现
### 写法一
```js
// Promise封装实现
function getJSON(url) {
  // 创建一个promise对象
  let promise = new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest()
    // 创建HTTP请求
    xhr.open('GET', url, true)
    // 设置状态的监听函数
    xhr.onreadystatechange = function() {
      if (this.readyState !== 4) {
        return 
      }
      // 当请求成功或失败时，改变Promise的状态
      if (this.statue === 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }
    // 设置错误监听函数
    xhr.onerror = function() {
      reject(new Error(this.statusText))
    }
    // 设置响应的数据类型
    xhr.responseType = 'json'
    // 设置请求头信息
    xhr.setRequestHeader('Accept', 'application/json')
    // 发送HTTP请求
    xhr.send()
  })
  return promise
}
```

### 写法二
该写法出自[阮一峰ES6教程](https://wangdoc.com/es6/promise#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95)
```js
const gerJSON = function(url) {
  const promise = new Promise(function(resolve, reject) {
    const handler = function() {
      if (this.readyState !== 4) {
        return
      }
      if (this.status === 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }

    const client = new XMLHttpRequest()
    client.open('GET', url)
    client.onreadystatechange = handler
    client.setRequestHeader('Accept', 'application/json')
    client.send()
  })
  return promise
}

getJSON('/posts.json').then(function(json) {
  console.log('Contents: ' + json)
}, function(error) {
  console.log('出错了', error)
})
```