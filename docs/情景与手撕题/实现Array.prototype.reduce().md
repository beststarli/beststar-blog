---
title: 实现Array.prototype.reduce()
description: 实现数组的reduce()方法。
sidebar_position: 82
tags: [JavaScript,数组,原型,this,场景题,手撕题]
date: 2026-07-31
---

在 Array.prototype 上实现 myReduce，语义与原生 reduce 一致。注意：空数组且无初始值须抛出 TypeError；稀疏数组须跳过空槽。
## 代码实现
```js
Array.prototype.myReduce = function(callback, initialValue) {
  const length = this.length
  let start = 0
  let accumulator = initialValue
  if (arguments.length === 2) {
    accumulator = initialValue
  } else {
    while (start < length && !(start in this)) {
      start++
    }
    if (start >= length) {
      throw new TypeError('Reduce of empty array with no initial value')
    }
    accumulator = this[start]
    start++
  }
  for (let i = start; i < length; i++) {
    if (i in this) {
      accumulator = callback(accumulator, this[i], i, this)
    }
  }
  return accumulator
}
```
使用示例：
```js
function runMyReduceDemo(scenario) {
  if (scenario === 'sumWithInitial') {
    return [1, 2, 3, 4].myReduce((acc, n) => acc + n, 0);
  }
  if (scenario === 'productNoInitial') {
    return [2, 3, 4].myReduce((acc, n) => acc * n);
  }
  if (scenario === 'stringConcat') {
    return ['a', 'b', 'c'].myReduce((acc, ch) => acc + ch, '');
  }
  if (scenario === 'emptyThrows') {
    try {
      [].myReduce(() => 0);
      return 'no-throw';
    } catch (error) {
      return error instanceof TypeError ? 'TypeError' : 'other';
    }
  }
}
```
输出结果：
```txt
sumWithInitial: 10
productNoInitial: 24
stringConcat: 'abc'
emptyThrows: 'TypeError'
```