---
title: 手写bind函数
description: 手写实现函数的bind方法
sidebar_position: 23
tags: [JavaScript,函数,手撕题]
date: 2026-07-06
---

apply函数的实现步骤：
1. 判断调用对象是否为函数，即使我们是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
2. 保存当前函数的引用，获取其余传入参数值。
3. 创建一个函数返回。
4. 函数内部使用apply来绑定函数调用，需要判断函数作为构造函数的情况，这个时候需要传入当前函数的this给apply调用，其余情况都传入指定的上下文对象。

## 代码实现
```js
// bind函数实现
Function.prototype.myBind = function(context) {
  // 判断调用对象是否为函数 
  if (typeof this !== 'function') {
    throw new TypeError('type error')
  }
  // 获取参数
  let args = [...arguments].slice(1)
  let fn = this
  return function Fn() {
    // 根据调用方式传入不同的绑定值
    return fn.apply(this instanceof Fn ? this : context, args.concat(...arguments))
  }
}
```