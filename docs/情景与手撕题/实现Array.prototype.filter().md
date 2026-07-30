---
title: 实现Array.prototype.filter()
description: 实现Array.prototype.filter()方法。
sidebar_position: 79
tags: [JavaScript,数组,原型,this,场景题,手撕题]
date: 2026-07-30
---


注意之所以callback.call(thisArg, this[i], i, this)这样使用call绑定this，是将withThisArg案例的回调函数中this指向myFilter的第二参数，即thisArg对象。所以是将this绑定到thisArg上，而不是绑定到数组自身上。

因为filter会过滤掉不满足条件的元素，所以采用push方法来填充数组，而不是下标索引赋值的方式，注意与map方法做区分。
## 代码实现
```js
Array.prototype.myFilter = function(callback, thisArg) {
  const length = this.length
  const newArr = []
  for (let i = 0; i < length; i++) {
    if (i in this) {
      if (callback.call(thisArg, this[i], i, this)) {
        newArr.push(this[i])
      }
    }
  }
  return newArr
}
```
使用示例：
```js
function runMyFilterDemo(scenario) {
  if (scenario === 'evens') {
    return [1, 2, 3, 4, 5, 6].myFilter((n) => n % 2 === 0);
  }
  if (scenario === 'withThisArg') {
    return [5, 10, 15, 20].myFilter(function (value) {
      return value >= this.threshold;
    }, { threshold: 12 });
  }
  if (scenario === 'sparse') {
    const holes = [1, , 9, , 4];
    return holes.myFilter((n) => n > 3);
  }
}
```
输出结果：
```txt
'evens': [2, 4, 6],
'withThisArg': [15, 20],
'sparse': [9, 4]
```