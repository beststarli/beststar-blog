---
title: 实现Promise.finally()
description: 实现Promise.finally()方法
sidebar_position: 63
tags: [JavaScript,Promise,场景题,手撕题]
date: 2026-07-27
---

finally本质上是then方法的特例。
```js
promise
.finally(() => {
  // 语句
});

// 等同于
promise
.then(
  result => {
    // 语句
    return result;
  },
  error => {
    // 语句
    throw error;
  }
);
```
上面代码中，如果不使用finally方法，同样的语句需要为成功和失败两种情况各写一次。有了finally方法，则只需要写一次。事实上finally()也就是对两种情况的包装。

## 代码实现
```js
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).thern(() => { throw reason})
  )
}
```