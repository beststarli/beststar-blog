---
title: 如何弥补defineProperty()数组响应式不足的缺陷
description: Object.defineProperty()本身无法完全弥补数组响应式的缺陷，Vue 2正是因为defineProperty()在数组上的局限性，才采取了额外手段来弥补。
sidebar_position: 3
tags: [Vue2]
date: 2026-04-20
---

## Object.defineProperty()语法
`Object.defineProperty()`方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。应当直接在`Object`构造器对象上调用此方法，而不是在任意一个`Object`类型的实例上调用。

```ts
Object.defineProperty(obj, prop, descriptor)
```

参数说明：
- `obj`：要定义属性的对象。
- `prop`：要定义或修改的属性的名称或`Symbol`。
- `descriptor`：要定义或修改的属性描述符。

使用示例：
```js
let person = {};
let name = 'yuanwill';

Object.defineProperty(person, 'name', {
    get() {
        return name === 'yuanwill' ? 'zhangsan' : 'lisi'
    },
    set(newVal) {
        name = newVal
    }
});


console.log(person.name); // zhangsan
person.name = 'haha';
console.log(person.name); // lisi
```
- 读取`person`的`name`属性时，访问了`get`方法，第一次`name`是`yuanwill`，所以返回了`zhangsan`
- 修改`person`的`name`属性时，访问了`set`方法，修改了`name`变量的值
- 第二次读取`person`的`name`属性，同理，返回了`lisi`

## defineProperty()在数组上的核心缺陷
```ts
const arr = [1, 2, 3]
Object.defineProperty(arr, '0', {
  get() { /* ... */ },
  set(newVal) { /* 能触发 */ }
})

// 以下操作都无法触发响应式：
arr[1] = 99          // 直接通过索引赋值
arr.length = 1       // 修改长度
arr.push(4)          // 数组原型方法
```

主要缺陷总结：
| 操作                        | 是否能被 `defineProperty` 拦截 | 原因 |
|-----------------------------|--------------------------------|------|
| `arr[index] = val`          | 不能（新索引）                 | 没有提前 `defineProperty` 该索引 |
| `arr.length = n`            | 不能                           | `length` 是特殊的内部属性 |
| `push/pop/shift/...`        | 不能                           | 直接操作底层内存，不走 setter |
| `splice/sort/reverse`       | 不能                           | 同上 |

## Vue2如何弥补defineProperty()数组响应式不足的缺陷
Vue2采用了“方法劫持+特殊处理”的方式，`defineProperty()`主要用于对象，数组则额外处理：

### 1.重写数组的7个变异方法
Vue在初始化数组响应式时，会把数组的原型指向一个经过劫持的原型对象：
```js
const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args)   // 执行原方法
    const ob = this.__ob__                      // 数组的 Observer 实例
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)     // 新增元素也要变成响应式
    ob.dep.notify()                             // 手动通知更新
    return result
  })
})
```
当调用`arr.push()`、`arr.splice()`等方法时，会自动触发视图更新。

### 2.对数组每一项使用defineProperty()
```js
// 在 observeArray 中
observeArray(items: any[]) {
  for (let i = 0, l = items.length; i < l; i++) {
    observe(items[i])   // 递归对每个元素做 defineProperty
  }
}
```

### 3.新增索引和length的处理——$set/Vue.set
当你写`arr[0] = 99`（新索引）时，`defineProperty()`无法捕获，Vue提供了：
```js
// Vue.set / this.$set
Vue.set(array, index, value)
// 内部实际调用：
array.splice(index, 1, value)   // 借用 splice 触发变异方法
```

## 总结
| 场景               | 解决方法                          | 是否依赖 `defineProperty()` |
|--------------------|-----------------------------------|---------------------------|
| 对象新增/删除属性  | `Vue.set()` / `delete` + `defineProperty()` | 是                        |
| 数组已有索引修改   | `defineProperty()` + 手动触发       | 是                        |
| 数组变异方法       | 方法劫持（重写原型）              | 否                        |
| 新增索引 / 修改 `length` | `Vue.set()` 或 `splice()`            | 否                        |

## 仿Vue使用
在Vue2中，使用了`Object.defineProperty()`来实现数据双向绑定的基础（具体的`observe`，`watcher`，`dep`等等在此不细说了）,主要仿造Vue来看看怎么通过`Object.defineProperty()`来实现一个对象或数组（不谈论对数组方法的拦截AOP）的属性拦截和监听。

### 对象拦截
准备一个对象如下：
```js
let person = {
    name: 'yuanwill',
    age: 26,
    address: {
        home: 'guangzhou',
        now: 'shenzhen'
    }
};
```
我们需要遍历`person`中的`key`，然后对每一个`key`进行转换即可，于是很自然的写出了下面的错误示例：
```js
Object.keys(person).forEach(key => {
    Object.defineProperty(person, key, {
        get() {
            console.log('拦截到正在获取属性：' + key);
            return person[key]; // ①
        },
        set(val) {
            console.log('拦截到正在修改属性：' + key);
            person[key] = val; // ②
        }
    })
})

console.log(person.name)
```
运行代码发现栈溢出了，错误有两处，代码已经标明：
- 在`get`中，直接使用`person[key]`会继续调用`get`，导致死循环
- 在`set`中同理。

所以，需要使用一个方法，来传递`person[key]`的值。
```js
const defineReactive = (obj, key, val) => {
    Object.defineProperty(obj, key, {
        get() {
            console.log('拦截到正在获取属性：' + key);
            return val;
        },
        set(newVal) {
            console.log('拦截到正在修改属性：' + key);
            val = newVal;
        }
    })
}

const observer = obj => {
    // 如果obj不是一个对象，就没必要包装了
    if(typeof obj !== 'object' || !obj) {
        return;
    }
    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })
}
```
实验一下：
```js
observer(person);

person.name = 'haha'; // 拦截到正在修改属性：name
console.log(person.name); // 拦截到正在获取属性：name, haha
```
但还有瑕疵，比如：
```js
person.name = {
    firstName: 'yuan',
    lastName: 'will'
}; // 拦截到正在修改属性：name

person.name.firstName = 'haha'; // 拦截到正在获取属性：name
console.log(person.name); // 拦截到正在获取属性：name
```
可以看到，`person.name.firstName`并没有拦截到正在修改`firstName`属性。原因是我们在`set`的时候，`newVal`可能也是一个`object`，所以也需要进行`observer`。

修改`set`如下：
```js
set(newVal) {
    if(typeof newVal === 'object') {
        observer(newVal);
    }
    console.log('拦截到正在修改属性：' + key);
    val = newVal;
}
```
当然，还有瑕疵，比如访问深层对象：
```js
console.log(person.address.home) // 拦截到正在获取属性：address
```
并没有拦截到访问属性`home`，所以我们还需要判断`val`如果是对象也应该再一次`observer`。优化后的完整代码如下：
```js
const defineReactive = (obj, key, val) => {
    if(typeof val === 'object') {
        observer(val);
    }
    Object.defineProperty(obj, key, {
        get() {
            console.log('拦截到正在获取属性：' + key);
            return val;
        },
        set(newVal) {
            if(typeof newVal === 'object') {
                observer(newVal);
            }
            console.log('拦截到正在修改属性：' + key);
            val = newVal;
        }
    })
}

const observer = obj => {
    // 如果obj不是一个对象，就没必要包装了
    if(typeof obj !== 'object' || !obj) {
        return;
    }
    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })
}
```

### 数组的拦截
总说`Object.defineProperty()`不能拦截数组，这种说法不太准确，看示例：
```js
let list = [1,2,3,4];
observer(list);
console.log(list[0]) // 拦截到正在获取属性：0
list[0] = 2; // 拦截到正在修改属性：0

list[6] = 6; // 无法拦截...
list.push(3); // 无法拦截...
```
可以看到，通过索引去访问或修改已经存在的元素，是可以拦截到的。如果是不存在的元素，或者是通过`push`等方法去修改数组，则无法拦截。

正因为如此，Vue2在实现的时候，通过重写了数组原型上的七个方法（push、pop、shift、unshift、splice、sort、reverse）来解决这个问题。

## 参考
- [**一文彻底弄懂defineProperty和Proxy**](https://juejin.cn/post/7127596136348516359?searchId=2026042016392123CD1403D0093334BF6B)