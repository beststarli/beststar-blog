---
title: instanceof()实现原理手撕
description: JavaScript中instanceof运算符的实现原理手撕。
sidebar_position: 3
tags: [JavaScript,原型链,手撕题]
date: 2026-05-18
---

## 写法一
```js
function myInstanceof(left, right) {
    // 获取对象的原型
    let proto = Object.getPrototypeOf(left);
    // 获取构造函数的prototype属性
    let prototype = right.prototype;

    // 判断构造函数的prototype属性是否在对象的原型链上
    while (true) {
        if (!proto) {
            return false
        }
        if (proto === prototype) {
            return true
        }
        // 如果没有找到，就继续从其原型上找
        // Object.getPrototypeOf()方法用来获取指定对象的原型
        proto = Object.getPrototypeOf(proto)
    }
}

console.log(myInstanceof([], Array)) // true
```

## 写法二
```js
function myInstanceof(left, right) {
    left = left.__proto__
    let prototype = right.prototype

    while (true) {
        if (!left) {
            return false
        }
        if (left === prototype) {
            return true
        }
        left = left.__proto__
    }
}

console.log(myInstanceof([], Array)) // true
```