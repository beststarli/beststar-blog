---
title: 使用Proxy实现观察者模式
description: 观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行。
sidebar_position: 62
tags: [JavaScript,ES6,场景题,手撕题]
date: 2026-07-27
---

观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行。
```js
const person = observable({
  name: '张三',
  age: 20
});

function print() {
  console.log(`${person.name}, ${person.age}`)
}

observe(print);
person.name = '李四';
// 输出
// 李四, 20
```
上面代码中，数据对象person是观察目标，函数print是观察者。一旦数据对象发生变化，print就会自动执行。
## 代码实现
这种写法的思路来源于[阮一峰ES6教程](https://wangdoc.com/es6/reflect#%E5%AE%9E%E4%BE%8B%E4%BD%BF%E7%94%A8-proxy-%E5%AE%9E%E7%8E%B0%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F)

下面，使用 Proxy 写一个观察者模式的最简单实现，即实现observable和observe这两个函数。思路是observable函数返回一个原始对象的 Proxy 代理，拦截赋值操作，触发充当观察者的各个函数。
```js
const queuedObservers = new Set();

const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  queuedObservers.forEach(observer => observer());
  return result;
}
```
