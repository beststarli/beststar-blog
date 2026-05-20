---
title: new操作符的实现
description: 实现JavaScript中的new操作符。
sidebar_position: 7
tags: [JavaScript,手撕题]
date: 2026-05-20
---

## new操作符的执行过程
1. 创建一个新对象。
2. 设置原型，将对象的原型设置为函数的prototype对象。
3. 让函数的this指向这个对象，执行构造函数的代码，为这个新对象添加属性。
4. 判断函数的返回值类型，如果是值类型，返回创建的对象；如果是引用类型，返回这个引用类型的对象。

## 代码实现
```js
function objectFactory() {
    let newObject = null
    let constructor = Array.prototype.shift.call(arguments)
    let result = null

    // 判断参数是否是一个函数
    if (typeof constructor !== 'funciton') {
        console.error('type error')
        return
    }

    // 新建一个空对象，对象的原型为构造函数的prototype对象
    newObject = Object.create(constructor.prototype)
    // 将this指向新建对象，并执行函数
    result = constructor.apply(newObject, arguments)
    // 判断返回对象类型
    let flag = result && (typeof result === 'object' || typeof result === 'function')
    // 判断返回结果
    return flag ? result : newObject
}

// 使用方法
objectFactory(构造函数， 初始化参数)
```