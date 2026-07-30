---
title: 实现Array.prototype.map()
description: 实现Array.prototype.map()方法。
sidebar_position: 78
tags: [JavaScript,数组,原型,this,场景题,手撕题]
date: 2026-07-30
---


注意之所以callback.call(thisArg, this[i], i, this)这样使用call绑定this，是将sparseJoin案例的回调函数中this指向myMap的第二参数，即thisArg对象。所以是将this绑定到thisArg上，而不是绑定到数组自身上。

因为map会保留空位，所以采用下标索引赋值的方式来填充数组，而不是push方法，注意与filter方法做区分。
## 代码实现
```js
Array.prototype.runMyMapDemo = function(callback, thisArg) {
  const length = this.length
  const newArr = Array(length)
  for (let i = 0; i < length; i++) {
    if (i in this) {
      newArr[i] = callback.call(thisArg, this[i], i, this)
    }
  }
  return newArr
}
```
使用示例：
```js
function runMyMapDemo(scenario) {
  if (scenario === 'double') {
    return [1, 2, 3].myMap((n) => n * 2);
  }
  if (scenario === 'withThisArg') {
    return [1, 2, 3].myMap(function (value, index) {
      return value + index + this.offset;
    }, { offset: 10 });
  }
  if (scenario === 'sparseJoin') {
    const holes = [1, , 3];
    return holes.myMap((n) => n * 2).join('|');
  }
}
```
输出结果：
```txt
'double': [2, 4, 6],
'withThisArg': [11, 13, 15],
'sparseJoin': '2||6'
```