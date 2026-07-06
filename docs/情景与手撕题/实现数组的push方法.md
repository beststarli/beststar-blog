---
title: 实现数组的push方法
description: 实现数组的push方法。
sidebar_position: 34
tags: [JavaScript,数据处理,手撕题]
date: 2026-07-06
---

实现数组的push方法。
## 代码实现
```js
let arr = []
Array.prototype.push = function() {
  for (let i = 0; i < arguments.length; i++) {
    this[this.length] = arguments[i]
  }
  return this.length
}
```