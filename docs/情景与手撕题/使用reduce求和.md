---
title: 使用reduce求和
description: 使用reduce求和。
sidebar_position: 42
tags: [JavaScript,数据处理,手撕题]
date: 2026-07-07
---

## 示例一
```js
const arr = [1, 2, 3, 4, 5]

arr.reduce((prev, cur) => {
  return prev + cur
}, 0) // 15
```

## 示例二
```js
const arr = [1,2,3,[[4,5],6],7,8,9]

arr.flat(Infinity).reduce((prev, cur) => {
  return prev + cur
}, 0) // 45
```

## 示例三
```js
const arr = [{a:1, b:3}, {a:2, b:3, c:4}, {a:3}]

arr.reduce((prev, cur) => {
  return prev + cur.a
}, 0) // 6
```