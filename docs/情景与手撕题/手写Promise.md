---
title: 手写Promise
description: 手写实现Promise及常用方法
sidebar_position: 18
tags: [JavaScript,Promise,手撕题]
date: 2026-07-01
---

关于更详细的Promise原理与实现可参考[吃透Promise](/docs/JavaScript/吃透Promise.md)
## 手写Promise
```js
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise(fn) {
  // 保存初始化状态
  let self = this
  
  // 初始化状态
  this.state = PENDING  

  // 用于保存resolve或者reject传入的值
  this.value = null

  // 用于保存resolve的回调函数
  this.resolvedCallbacks = []

  // 用于保存reject的回调函数
  this.rejectedCallbacks = []

  // 状态转变为resolved方法
  function resolve(value) {
    // 判断传入元素是否为Promise对象
    // 如果是，则状态改变必须等待前一个状态改变后再进行改变
    if (value instanceof MyPromise) {
      return value.then(resolve, reject)
    }

    // 保证代码的执行顺序为本轮事件循环的末尾
    setTimeout(() => {
      // 只有状态为pending时才能改变状态
      if (self.state === PENDING) {
        // 修改状态
        self.state = RESOLVED
        // 设置传入的值
        self.value = value
        // 执行回调函数
        self.resolvedCallbacks.forEach(callback => callback(self.value))
      }
    }, 0)
  }

  // 状态转变为rejected方法
  function reject(value) {
    // 保证代码的执行顺序为本轮事件循环的末尾
    setTimeout(() => {
      // 只有状态为pending时才能改变状态
      if (self.state === PENDING) {
        // 修改状态
        self.state = REJECTED
        // 设置传入的值
        self.value = value
        // 执行回调函数
        self.rejectedCallbacks.forEach(callback => callback(self.value))
      }
    }, 0)
  }

  // 将两个方法传入函数执行
  try {
    fn(resolve, reject)
  } catch (error) {
    // 遇到错误时捕获异常，执行reject方法
    reject(error)
  }
}

MyPromise.prototype.then = function(onResolved, onRejected) {
  // 首先判断两个参数是否为函数类型，因为这两个参数为可选参数
  onResolved = typeof Resolved === 'function'
    ? onResolved
    : function(value) { return value }

  onRejected = typeof onRejected === 'function'
    ? onRejected
    : function(error) { throw error }

  // 如果是pending状态，则将回调函数存入数组中
  if (this.state === PENDING) {
    this.resolvedCallbacks.push(onResolved)
    this.rejectedCallbacks.push(onRejected)
  }

  // 如果状态已经改变，则直接执行对应的回调函数
  if (this.state === RESOLVED) {
    onResolved(this.value)
  }
  if (this.state === REJECTED) {
    onRejected(this.value)
  }
}
```

## 手写Promise.then
then方法返回一个新的Promise对象，为了在Promise状态发生变化时（resolve或reject被调用时）再执行then中的函数，使用一个callback数组先把传给then的函数暂存起来，等状态改变时再调用。

如何保证then中的方法在前一个then（可能是异步）执行完后再执行呢？可以将传给then的函数和新Promise的resolve一起push到前一个Promise的callbacks数组中，等前一个Promise状态改变时再执行：
- 承前：当前一个Promise完成后，调用其resolve变更状态，在这个resolve里会依次调用callbacks中的回调函数，这样就执行了then中的函数。
- 启后，上一步中，当then中的方法执行完成后，返回一个结果，如果这个结果是个简单的值，就直接调用新Promise的resolve，让其状态变更，这又会依次调用新Promise的callbacks数组里的方法，循环往复。如果返回的结果是个Promise，则需要等它完成之后再触发新Promise的resolve，所以可以在其结果的then里调用新Promise的resolve。

注意：
- 连续多个then中的回调方法是同步注册的，但注册到了不同的callbacks数组中，因为每次then都返回新的Promise实例
- 注册完成后开始执行构造函数中的异步事件，异步完成之后依次调用callbacks数组中提前注册的回调

```js
then(onFulfilled, onReject) {
  // 保存前一个Promise的this
  const self = this
  return new MyPromise((resolve, reject) => {
    // 封装前一个Promise成功时执行的函数
    let fulfilled = () => {
      try {
        const result = onFulfilled(self.value)  // 承前
        return result instanceof MyPromise
          ? result.then(resolve, reject)  // 启后
          : resolve(result)
      } catch (error) {
        reject(error)
      }
    }

    // 封装前一个Promise失败时执行的函数
    let rejected = () => {
      try {
        const result = onReject(self.reason)
        return result instanceof MyPromise
          ? result.then(resolve, reject)
          : resolve(result)
      } catch (error) {
        reject(error)
      }
    }

    switch(self.state) {
      case PENDING:
        self.resolvedCallbacks.push(fulfilled)
        self.rejectedCallbacks.push(rejected)
        break
      case RESOLVED:
        fulfilled()
        break
      case REJECTED:
        rejected()
        break
    }
  })
}
```

## 手写Promise.all
核心思路：
1. 接收一个Promise对象的数组或具有Iterator接口的对象作为参数
2. 这个方法返回一个新的Promise对象
3. 遍历传入的参数，用Promise.resolve()将每个参数“包一层”，使其成为一个Promise对象
4. 参数所有回调成功才是成功，返回值数组与参数顺序一致
5. 参数数组中有一个失败，则触发失败状态，第一个触发失败的Promise错误信息作为Promise.all的错误信息

一般来说，Promise.all用来处理多个并发请求，也是为了页面数据构造的方便，将一个页面所用到的不同接口的数据一起请求过来，不过，如果其中一个接口失败了，多个请求也就失败了，页面如果高耦合则会出现问题，所以在实际开发中，Promise.all的使用要谨慎。
```js
function promiseAll(promises) {
  return new Promise(function(resolve, reject) {
    if (!Array.isArray(promises)) {
      throw new TypeError('arguments must be an array')
    }
    let resolvedCounter = 0
    const promiseNum = promises.length
    const resolvedResult = new Array(promiseNum)
    for (let i = 0; i < promiseNum; i++) {
      Promise.resolve(promises[i]).then(value => {
        resolvedCounter++
        resolvedResult[i] = value
        if (resolvedCounter === promiseNum) {
          return resolve(resolvedResult)
        }
      }, error => {
        return reject(error)
      })
    }
  })
}

// test
let p1 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(1)
    }, 1000)
})
let p2 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(2)
    }, 2000)
})
let p3 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(3)
    }, 3000)
})
promiseAll([p3, p1, p2]).then(res => {
    console.log(res) // [3, 1, 2]
})
```

## 手写Promise.race
该方法的参数是Promise实例数组，然后其then注册的回调方法是数组中的某一个Promise的状态变为fulfilled的时候就执行。因为Promise的状态只能改变一次，那么我们只需要把Promise.race中产生的Promise对象的resolve方法，注入到数组中的每一个Promise实例中的回调函数中即可。
```js
Promise.race = function(args) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < args.length; i++) {
      args[i].then(resolve, reject)
    }
  })
}
```

