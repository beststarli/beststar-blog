---
title: JavaScript基本数据结构
description: 实现JavaScript基本数据结构。
sidebar_position: 4
tags: [JavaScript,数据结构,手撕题]
date: 2026-05-19
---

## 集合Set
```js
class Set {
    constructor () {
        this.items = {}
    }

    has(val) {
        return this.items.hasOwnProperty(val)
    }

    add(val) {
        if (!this.has(val)) {
            this.items[val] = val
        }
    }

    remove(val) {
        if (this.has(val)) {
            delete this.items[val]
        }
    }

    clear() {
        this.items = {}
    }

    size() {
        return Object.keys(this.items).length
    }

    values() {
        let arr = []
        Object.keys(this.items).forEach((item) => {
            arr.push(this.items[item])
        })
        return arr
    }
}
```

## 字典类
哈希表就是JavaScript的对象，字典存储的是键值对。
```js
function Dictionary() {
    // 字典属性
    this.items = {}

    // 字典操作方法
    // 1.在字典中添加键值对
    Dictionary.prototype.set = function (key, value) {
        this.items[key] = value
    }

    // 2.判断字典中是否有某个key
    Dictionary.prototype.has = funciton (key) {
        return this.items.hasOwnProperty(key)
    }

    // 3.从字典中移除元素
    Dictionary.prototype.remove = function (key) {
        if (!this.has(key)) {
            return false
        }

        delete this.items[key]
        return true
    }

    // 4.根据key获取value
    Dictionary.prototype.get = function (key) {
        return this.has(key) ? this.items[key] : undefined
    }

    // 5.获取所有keys
    Dictionary.prototype.keys = function () {
        return Object.keys(this.items)
    }

    // 6.size方法
    Dictionary.prototype.keys = function () {
        return this.key().length
    }

    // 7.clear方法
    Dictionary。prototype.clear = function () {
        this.items = {}
    }
}
```

## 栈
```js
function Stack() {
    this._size = 0
    this._storage = {}
}

Stack.prototype.push = function (data) {
    var size = ++this._size
    this._storage[size] = data
}

Stack.prototype.pop = function () {
    var size = this._size
    
    if (size) {
        deletedData = this._storage[size]
        delete this._storage[size]
        this._size--

        return deletedData
    }
}
```

## 队列
```js
function Queue() {
    this._oldestIndex = 1
    this._newestIndex = 1
    this._storage = {}
}

Queue.prototype.size = function () {
    return this._newestIndex - this._oldestIndex
}

Queue.prototype.enqueue = function (data) {
    this._storage[this._newestIndex] = data
    this._newestIndex++
}

Queue.prototype.dequeue = function () {
    var oldestIndex = this._oldestIndex
    var newestIndex = this._newestIndex
    var deletedData

    if (oldestIndex !== newestIndex) {
        deletedData = this._storage[oldestIndex]
        delete this._storage[oldestIndex]
        this._oldestIndex++

        return deletedData
    }
}
```