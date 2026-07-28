---
title: 实现Promise.allSettled()
description: 实现Promise.allSettled()
sidebar_position: 65
tags: [JavaScript,Promise,场景题,手撕题]
date: 2026-07-28
---

实现 promiseAllSettled(iterable)，语义与原生 Promise.allSettled 一致。

注意：每项结果为`{ status, value? }`或`{ status, reason? }`；下标与输入对齐。

对传入的iterable参数进行包装，得到参数数组，对数组内任务遍历，对每个任务进行Promise.resolve包装，得到一个新的Promise对象。然后对这个新的Promise对象进行then处理，成功时返回一个对象`{ status: 'fulfilled', value }`，失败时返回一个对象`{ status: 'rejected', reason }`。
## 代码实现
```js
function promiseAllSettled(iterable) {
  // TODO：将每个 Promise 映射为 fulfilled/rejected 描述对象
  const list = Array.from(iterable)
  return Promise.all(
    list.map(item => {
      return Promise.resolve(item).then(
        value => ({
          status: 'fulfilled',
          value
        }),
        reason => ({
          status: 'rejected',
          reason
        })
      )
    })
  )
}
```