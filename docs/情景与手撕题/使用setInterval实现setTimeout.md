---
title: 使用setInterval实现setTimeout
description: 实现使用setInterval实现setTimeout
sidebar_position: 64
tags: [JavaScript,计时器,场景题,手撕题]
date: 2026-07-28
---

使用setInterval实现setTimeout的逻辑很简单，就是让setInterval只跑一个计时段就可以了，可以将计时器id返回出来，方便在外部进行中止。
## 代码实现
```js
function mySetTimeout(fn, delay) {
  // TODO：setInterval + clearInterval
  const timerId = setInterval(() => {
    clearInterval(timerId)
    fn()
  }, delay)
  return timerId
}
```