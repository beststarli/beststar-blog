---
title: 手写Object.create()
description: 将传入的对象作为原型
sidebar_position: 17
tags: [JavaScript,原型链,手撕题]
date: 2026-07-01
---

将传入的对象作为原型

## 代码实现
```js
function create(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}
```
