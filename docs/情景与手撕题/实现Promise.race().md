---
title: 实现Promise.race()
description: 实现Promise.race()方法
sidebar_position: 68
tags: [JavaScript,Promise,场景题,手撕题]
date: 2026-07-29
---


Promise.race()本身也返回一个新的Promise对象，所以自实现函数返回的也应是一个新的Promise对象。Promise.race()方法接收一个可迭代对象作为参数，这个参数本身可以遍历，用for循环遍历对其中每个元素使用Promise.resolve()方法将其转为Promise对象，然后对每个Promise对象都调用then方法，传入resolve和reject两个回调函数，当其中一个Promise对象的状态发生改变时，就会触发对应的回调函数，从而改变返回的Promise对象的状态。
## 代码实现
```js
function promiseRace(iterable) {
  const lists = Array.from(iterable)
  return new Promise((resolve, reject) => {
    for (const promise of lists) {
      Promise.resolve(promise).then(resolve, reject)
    }
  })
}
```