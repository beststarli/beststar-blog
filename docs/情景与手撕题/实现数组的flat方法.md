---
title: 实现数组的flat方法
description: 实现数组的flat方法。
sidebar_position: 33
tags: [JavaScript,数据处理,手撕题]
date: 2026-07-06
---

实现数组的flat方法。
## 代码实现
```js
function _flat(arr, depth) {
  if (!Array.isArray(arr) || depth < 1) {
    return arr
  }
  return arr.reduce((prev, cur) => {
    if (Array.isArray(cur)) {
      return prev.concat(_flat(cur, depth - 1))
    } else {
      return prev.concat(cur)
    }
  }, [])
}
```