---
title: 实现sleep函数
description: 实现sleep(ms)，返回一个在约ms毫秒后兑现的Promise。
sidebar_position: 80
tags: [JavaScript,Promise,异步,场景题,手撕题]
date: 2026-07-30
---


实现sleep(ms)，返回一个在约ms毫秒后兑现的Promise。
## 代码实现
一行setTimeout解决：
```js
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```
使用示例：
```js
async function exerciseSleep(ms) {
  await sleep(ms);
  return 'settled';
}
```
输出结果：
```txt
0ms settled
5ms settled
15ms settled
```