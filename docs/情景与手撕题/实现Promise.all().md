---
title: 实现Promise.all()
description: 实现Promise.all()方法
sidebar_position: 69
tags: [JavaScript,Promise,场景题,手撕题]
date: 2026-07-29
---


Promise.all()本身返回一个新的Promise对象，这个Promise对象resolve的值是一个数组，数组中包含了所有Promise对象resolve的值，顺序与传入的Promise对象顺序一致。Promise.all()方法接收一个可迭代对象作为参数，这个参数本身可以遍历，用for循环遍历对其中每个元素使用Promise.resolve()方法将其转为Promise对象，然后对每个Promise对象都调用then方法，传入resolve和reject两个回调函数，当所有Promise对象的状态都变为fulfilled时，就会触发resolve回调函数，从而改变返回的Promise对象的状态；如果其中有一个Promise对象的状态变为rejected时，就会触发reject回调函数，从而改变返回的Promise对象的状态。

那么实现时我们就可以创建一个结果数组来收集每个Promise对象resolve的值，同时创建一个计数器来记录已经resolve的Promise对象的数量，当计数器等于传入的Promise对象的数量时，就触发resolve回调函数；如果有一个Promise对象reject了，就直接触发reject回调函数。

## 代码实现
```js
function promiseAll(iterable) {
  // TODO：逐项 resolve，计数完成后输出数组；遇错立即 reject
  const lists = Array.from(iterable)
  if (lists.length === 0) {
    return Promise.resolve([])
  }
  return new Promise((resolve, reject) => {
    const output = Array(lists.length)
    let pending = lists.length
    lists.forEach((promise, index) => {
      Promise.resolve(promise).then(
        value => {
          output[index] = value
          pending--
          if (pending === 0) {
             resolve(output)
          }
        },
        reject
      )
    })
  })
}
```