---
title: Omit实用类型
description: Omit是TypeScript提供的一个高级类型工具，用于从一个类型中排除指定的键，从而构造一个新的类型。
sidebar_position: 2
tags: [TypeScript]
date: 2025-12-26
---

# Omit实用类型

## 基本概念
Omit是TypeScript提供的一个高级类型工具，用于从一个类型中排除指定的键，从而构造一个新的类型。它在处理对象类型时非常有用，可以帮助创建不包含某些特定属性的类型。

它的主要使用场景有以下几个方面：
- **去除不需要的属性**：当建立一个类型但不需要其中的一些属性时，可以使用Omit去除这些属性。
- **创建子类型**：从一个大型类型中派生出较小的子类型，只包含某些特定的属性。

## 使用方式
建立一个类型`Person`，同时可以使用`Omit`创建一个新的类型，该类型不包含`Person`的`location`属性。
```ts
type Person = {
    name: string
    age: string
    location: string
}

type PersonWithoutLocation = Omit<Person, 'location'>

// PersonWithoutLocation equal to QuantumPerson
type QuantumPerson = {
    name: string
    age: string
}
```

还可以一次排除多个属性，只需在使用Omit时将属性名用联合类型`|`连接即可：
```ts
type PersonWithoutLocation = Omit<Person, 'age' | 'location'>
```

## Omit的实现
### Omit的定义
Omit内部定义如下：
```ts
// lib.es5.d.ts
/**
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```
`T`是一个泛型，代表一个对象类型。`K`是一个泛型，代表要从`T`中剔除的键。`K`必须是`keyof any`的子集，也就是说，`K`可以是任何类型的键。

`Pick<T, Exclude<keyof T, K>>`从类型`T`中挑选出`Exclude<keyof T, K>`中的键。

### keyof
`keyof`诞生于TypeScript2.1版本，它的作用是：帮助我们获取某种类型的所有键，返回的是一个联合类型。下面是一个常见示例：
```ts
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key] // Inferred type is T[K]
}

function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    obj[key] = value
}
```

### Exclude
```ts
/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T
```
`Exclude<Type, ExcludedUnion>`，`Exclude`简单理解就是数学集合中找出Type的“差集”，就是将类型A与B对比，返回A中独有的类型。示例：
![Exclude](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/typescript/Exclude.png)

### Extends
```ts
type A = 'a' | 'b' | 'c'
type B = 'a'

type C = Exclude<A, B> // 'b' | 'c'

// A extends B ? never : A 等价于 ('a' | 'b' | 'c') extends B ? never : ('a' | 'b' | 'c') 等价于如下
type D = ('a' extends B ? never : 'a') | ('b' extends B ? never : 'b') | ('c' extends B ? never : 'c') // 'b' | 'c'
```
`T extends U ? never : T`这里的`extends`与`class`的`extends`不是一回事，这里指的是条件类型。

这里不做过多的扩展，重点通过一个概念**分布式条件类型**来理解上面Exclude的写法。

### Pick
```ts
// 通过keyof操作符+索引类型T[P]实现
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
    [P in K]: T[P]
}
```

## 推导Omit
通过上面的前置知识，现在可以很好的理解`type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>`了，下面进行一步步推导：
```ts
type Person = {
    name: string
    age: string
    location: string
}

type PersonWithoutLocation = Omit<Person, 'location'>

// 推导
type PersonWithoutLocation = Pick<Person, Exclude<'name' | 'age' | 'location', 'location'>>

// 推导
type PersonWithoutLocation = Pick<Person, (('name' extends 'location' ? never : 'name') | ('age' extends 'location' ? never : 'age') | ('location' extends 'location' ? never : 'location'))>

// 推导
type PersonWithoutLocation = Pick<Person, ('name' | 'age' | never)>

// 推导
type PersonWithoutLocation = Pick<Person, ('name' | 'age')>

// 推导
type PersonWithoutLocation = {
    [p in 'name' | 'age']: Person[p]
}

// 推导
type PersonWithoutLocation = {
    name: string
    age: string
}
```

## 进阶使用
### 动态类型结合Omit
结合条件类型和Omit可以实现更加动态的类型操作。
```ts
interface User {
    id: number
    name: string
    email: string
    password: string
}

type ConditionalOmit<T, K extends keyof any, U> = T extends U ? Omit<T, K> : T

type AdminUser = User & { admin: true }
type RegularUser = User & { admin?: false }

type UserWithoutPassword<T> = ConditionalOmit<T, "password", { admin?: false }>

const adminUser: UserWithoutPassword<AdminUser> = {
    id: 1,
    name: "moment",
    email: "moment@qq.com",
    password: "moment",
    admin: true,
}

const regularUser: UserWithoutPassword<RegularUser> = {
    id: 2,
    name: "m",
    email: "m@qq.com",
    // password 被省略
}
```
上面的代码中包含了一个条件类型ConditionalOmit:
```ts
type ConditionalOmit<T, K extends keyof any, U> = T extends U ? Omit<T, K> : T
```
它的主要作用是用于根据某些条件有选择性地移除类型中的属性：
- `T`是输入类型。
- `K`是要移除的属性。
- `U`是条件类型。

条件类型`T extends U ? Omit<T, K> : T`的含义是:
- 如果`T`可以赋值给类型`U`，则从`T`中移除属性`K`（通过`Omit<T, K>`实现）。
- 否则，保留类型`T`不变。

最终实现有条件移除`Password`属性的类型`UserWithoutPassword`：
- 如果`T`满足`{ admin?: false }`条件（即普通用户），则移除`T`中的`password`属性。
- 否则（即管理员用户），保留`T`不变。

### 递归Omit
通过递归类型实现嵌套类型的 Omit 操作。
```ts
interface NestedObject {
    id: number
    details: {
        name: string
        email: string
        address: {
            street: string
            city: string
        }
    }
}

type DeepOmitHelper<T, K extends keyof any> = {
    [P in keyof T]: P extends K
    ? never
    : T[P] extends infer TP
    ? TP extends object
    ? DeepOmit<TP, K>
    : TP
    : never
}

type DeepOmit<T, K extends keyof any> = Pick<
    DeepOmitHelper<T, K>,
    {
        [P in keyof DeepOmitHelper<T, K>]: DeepOmitHelper<T, K>[P] extends never
        ? never
        : P
    }[keyof DeepOmitHelper<T, K>]
>

type NestedWithoutEmail = DeepOmit<NestedObject, "email">

const nestedObject: NestedWithoutEmail = {
    id: 1,
    details: {
        name: "moment",
        address: {
            street: "中山大道",
            city: "珠海",
        },
    },
    // email 被省略
}
```
对于上面的代码主要有以下几个方面的解释：

- `DeepOmitHelper`类型：
    - `DeepOmitHelper`是一个辅助类型，用于处理嵌套对象。
    - 对于每个属性`P`，如果`P`是要删除的属性`K`，则将其类型设置为`never`。
    - 如果属性`P`是一个对象，则递归应用`DeepOmit`。
    - 否则，保持属性类型不变。

- `DeepOmit`类型：
    - 使用`Pick`和映射类型来删除被设置为`never`的属性。
    - `Pick<DeepOmitHelper<T, K>, {...}>`从`DeepOmitHelper`中挑选出所有非`never`的属性键，创建一个新的类型。

最终实现`NestedWithoutEmail`类型是从`NestedObject`中递归删除`email`属性后的结果。

### 使用Omit构建REST API响应类型
在构建`REST API`时，常常需要对请求和响应的类型进行严格的控制。
```ts
interface User {
    id: number
    name: string
    email: string
    password: string
    createdAt: Date
    updatedAt: Date
}

// 创建一个请求体类型，省略 id 和时间戳
type CreateUserRequest = Omit<User, "id" | "createdAt" | "updatedAt">

const newUser: CreateUserRequest = {
    name: "moment",
    email: "moment@qq.com",
    password: "moment",
}

// 创建一个响应体类型，省略 password
type UserResponse = Omit<User, "password">

const userResponse: UserResponse = {
    id: 1,
    name: "moment",
    email: "moment@qq.com",
    createdAt: new Date(),
    updatedAt: new Date(),
    // password 被省略
}
```

## 总结
Omit是一个非常强大的工具类型，通过结合条件类型、联合类型、递归类型和映射类型等高级类型特性，可以实现复杂的类型操作。它在很多场景下都非常有用，例如创建请求和响应类型、动态属性过滤、构建嵌套对象类型等。通过灵活运用Omit，可以使TypeScript代码更加灵活和类型安全，提高代码的可维护性和可读性。

## 参考
- [**TypeScript学习之Omit**](https://juejin.cn/post/6993651076096360479?searchId=20251229101059D00FF8BB160E2C4DF9EF)
- [**深入TS高级类型Omit，轻松把没用的东西剔除掉🫣🫣🫣**](https://juejin.cn/post/7384266820466245684?searchId=20251229101059D00FF8BB160E2C4DF9EF)