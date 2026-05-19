---
title: 实现对象的map方法
description: 实现JavaScript对象的类似数组的map方法。
sidebar_position: 5
tags: [JavaScript,手撕题]
date: 2026-05-19
---

## reduce实现
```js
var obj = {
    name: 'beststar',
    age: 24,
    address: 'Nanjing'
}

Object.prototype.objMap = function (handleFn, thisVal) {
    return Object.keys(this).reduce((prev, curr, index, arr) => {
        console.log(111, thisVal, curr, this[curr], this)
        prev[curr] = handleFn.call(thisVal, curr, this[curr], this)
        return prev
    }, {})
}

console.log(obj.objMap((item) => item + '---', { sex: 'male' }))
```

## for...in实现
```js
var obj = {
    name: 'beststar',
    age: 24,
    address: 'Nanjing'
}

Object.prototype.objMap = function (handleFn, thisVal) {
    let res = {}
    for (var key in this) {
        res[key] = handleFn.call(thisVal, this[key], key, this)
    }
    return res
}

console.log(obj.objMap((item) => item + '---', { sex: 'male' }))
```