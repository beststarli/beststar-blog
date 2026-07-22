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

## 简化写法
这个写法来自[阮一峰JavaScript教程](https://wangdoc.com/javascript/oop/new#new-%E5%91%BD%E4%BB%A4%E7%9A%84%E5%8E%9F%E7%90%86)。
```js
function _new(/* 构造函数 */ constructor, /* 构造函数参数 */ params) {
  // 将 arguments 对象转为数组
  var args = [].slice.call(arguments);
  // 取出构造函数
  var constructor = args.shift();
  // 创建一个空对象，继承构造函数的 prototype 属性
  var context = Object.create(constructor.prototype);
  // 执行构造函数
  var result = constructor.apply(context, args);
  // 如果返回结果是对象，就直接返回，否则返回 context 对象
  return (typeof result === 'object' && result != null) ? result : context;
}

// 实例
var actor = _new(Person, '张三', 28);
```