---
title: 实现Promise.any()
description: 实现Promise.any()方法
sidebar_position: 71
tags: [JavaScript,Promise,场景题,手撕题]
date: 2026-07-29
---


Promise.any()本身返回一个新的Promise对象，这个Promise对象resolve的值是第一个fulfilled状态的Promise对象的值，如果所有的Promise对象都变为rejected状态，则返回一个AggregateError对象。Promise.any()方法接收一个可迭代对象作为参数，这个参数本身可以遍历，用forEach循环遍历对其中每个元素使用Promise.resolve()方法将其转为Promise对象，然后对每个Promise对象都调用then方法，传入resolve和reject两个回调函数，当其中一个Promise对象的状态变为fulfilled时，就会触发resolve回调函数，从而将错误原因退出错误收集数组，当需要处理的任务数量归零，抛出聚合错误。
## 代码实现
```js
function promiseAny(iterable) {
  const lists = Array.from(iterable)
  if (lists.length === 0) {
    return Promise.reject(new AggregateError([], 'Send an empty array to Promise.any()'))
  }
  const errors = []
  return new Promise((resolve, reject) => {
    let pending = lists.length
    lists.forEach(promise => {
      Promise.resolve(promise).then(
        resolve,
        reason => {
          errors.push(reason)
          pending--
          if (pending === 0) {
            reject(new AggregateError(errors, 'All promises were rejected'))
          }
        }
      )
    })
  })
}
```