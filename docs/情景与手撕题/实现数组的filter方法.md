---
title: 实现数组的filter方法
description: 实现JavaScript数组的filter方法。
sidebar_position: 6
tags: [JavaScript,手撕题]
date: 2026-05-19
---

需要关注两个点：一个是函数的形参，一个是函数的返回值。

函数有两个形参，一个是回调函数，一个是传递给函数的this使用。

## 回调函数的参数
```js
var arr = [1, 2, 3, 4, 5]
var obj = {
    myArr: [12, 23, 3, 4, 45, 324]
}

Array.prototype.myFilter = function myFilter(fn, thisValue) {
    if (typeof fn !== 'function') {
        throw new Error(`${fn}不是一个函数`)
    }
    console.log('回调函数内部：', this, thisValue)
    
    let tempArr = []
    for (let i = 0; i < this.length; i++) {
        // 如果传递进来的是回调函数，就不能改变this的指向，这里都指向window
        let result = fn.call(thisValue, this[i], i, this)
        if (result) {
            tempArr.push(this[i])
        }
    }
    return tempArr
}

let t1 = arr.myFilter(function (item, index, arr) {
    console.log(item, index, arr, this)
    return item % 2 === 0
}, obj)
console.log(t1) // [2, 4]
```

## 不定长参数的函数
```js
var arr = [1, 2, 3, 4, 5]

Array.prototype._filter = function (cb, thisValue) {
    return this.reduce((prev, curr, index, arr) => {
        cb.call(null, curr) && prev.push(curr)
        return prev
    }, [])
}

console.log(arr._filter((item) => item % 2 === 0)) // [2, 4]
```