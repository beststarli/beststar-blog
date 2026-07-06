---
title: 实现数组的map方法
description: 实现数组的map方法。
sidebar_position: 35
tags: [JavaScript,数据处理,手撕题]
date: 2026-07-06
---

实现数组的map方法。
## 代码实现
```js
Array.prototype._map = function(fn) {
  if (typeof fn !== 'function') {
    throw Error('fn is not a function')
  }
  const res = []
  for (let i = 0; i < this.length; i++) {
    res.push(fn(this[i], i, this))
  }
}
```