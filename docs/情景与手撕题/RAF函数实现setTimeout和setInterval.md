---
title: RAF函数实现setTimeout和setInterval
description: 利用requestAnimationFrame实现setTimeout和setInterval
sidebar_position: 73
tags: [JavaScript,RAF,场景题,手撕题]
date: 2026-07-29
---

## requestAnimationFrame
requestAnimationFrame，简称 rAF，是浏览器专门给动画用的定时器。它会在浏览器下一次重绘前调用你的函数，通常接近 60fps，也就是大约每 16.7ms 一次。

基本用法：
```js
function animate(time) {
  console.log(time); // 当前动画时间戳，单位 ms

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```
注意到，requestAnimationFrame 只执行一次。如果想持续动画，需要在回调里再次调用它。

## 实现setTimeout()
核心逻辑是，每一帧检查一次当前时间，如果经过的时间超过delay，就执行回调
```js
function rafTimeout(callback, delay) {
  const start = performance.now()
  function loop(now) {
    if (now - start >= delay) {
      callback()
      return
    }
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}

// 使用示例
rafTimeout(() => {
  console.log('1秒后执行')
}, 1000)
```
这个实现比 setTimeout 好在：
1. 页面隐藏时自动暂停（节省性能）
2. 更准确（不累积延迟）
3. 和动画帧同步（更适合 UI 更新）

## 实现setInterval()
核心逻辑是：每一帧检查一次距离上次执行是否超过 interval，超过就执行一次。
```js
function rafTimeout(callback, interval) {
  let start = performance.now()
  let rafId
  let stopped = false
  function loop(now) {
    if (stopped) {
      return
    }
    if (now - start >= interval) {
      callback()
      start = now
    }
    rafId = requestAnimationFrame(loop)
  }
  rafId = requestAnimationFrame(loop)
  return () => {
    stopped = true
    cancelAnimationFrame(rafId)
  }
}

// 使用示例
const cancel = rafTimeout(() => {
  console.log("执行了");
}, 1000);

// 取消
cancel();
```