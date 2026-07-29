---
title: 实现Promise.allSettled()
description: 实现Promise.allSettled()方法
sidebar_position: 70
tags: [JavaScript,Promise,场景题,手撕题]
date: 2026-07-29
---


Promise.allSettled()本身返回一个新的Promise对象，这个Promise对象resolve的值是一个数组，数组中包含了所有Promise对象的状态和结果，顺序与传入的Promise对象顺序一致。Promise.allSettled()方法接收一个可迭代对象作为参数，这个参数本身可以遍历，用map方法遍历对每个元素用Promise.resolve()包装成Promise对象，这个对象的状态可能是fulfilled也可能是rejected，然后对每个Promise对象都调用then方法，传入两个回调函数，一个处理fulfilled状态，一个处理rejected状态，最终返回一个新的Promise对象。
## 代码实现
```js
function promiseAllSettled(iterable) {
  const lists = Array.from(iterable)
  return Promise.all(
    lists.map(promise => {
      return Promise.resolve(promise).then(
        value => {
          return {
            status: 'fulfilled',
            value
          }
        },
        reason => {
          return {
            status: 'rejected',
            reason
          }
        }
      )
    })
  )
}
```