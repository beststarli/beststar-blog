---
title: 实现prototype继承
description: 所谓的原型链继承就是让新实例的原型等于父类的实例。
sidebar_position: 52
tags: [JavaScript,场景题,原型链,手撕题]
date: 2026-07-07
---

所谓的原型链继承就是让新实例的原型等于父类的实例。
## 代码实现
```js
// 父方法
function SupperFunction(flag1) {
  this.flag1 = flag1
}

// 子方法
function SubFunction(flag2) {
  this.flag2 = flag2
}

// 父实例
var superInstance = new SupperFunction(true)
// 子实例继承父实例
SubFunction.prototype = superInstance

// 子实例
var subInstance = new SubFunction(false)
// 子调用自己和父的属性
subInstance.flag1 // true
subInstance.flag2 // false
```