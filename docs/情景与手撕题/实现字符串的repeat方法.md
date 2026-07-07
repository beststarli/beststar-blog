---
title: 实现字符串的repeat方法
description: 输入字符串s，以及其重复的次数，输出重复的结果，例如输入abc，2，输出abcabc。
sidebar_position: 36
tags: [JavaScript,数据处理,手撕题]
date: 2026-07-06
---

输入字符串s，以及其重复的次数，输出重复的结果，例如输入abc，2，输出abcabc。
## 代码实现
### 写法一
```js
function repeat(str, count) {
  return (new Array(count + 1)).join(str)
}
```

### 写法二——递归
```js
function repeat(str, count) {
  return (count > 0) ? str.concat(repeat(str, count - 1)) : ''
}
```