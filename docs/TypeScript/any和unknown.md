---
title: any和unknown
description: 在TypeScript中，unknown和any都表示“未知”类型的变量，但它们的应用场景和行为存在重要区别。
sidebar_position: 4
date: 2026-01-30
---

# any和unknown
在TypeScript中，unknown和any都表示“未知”类型的变量，但它们的应用场景和行为存在重要区别。

unknown是TypeScript 3.0引入的新类型，旨在为动态数据提供更高的类型安全，而any则是最早出现的通配类型，允许任意类型的值赋予变量。

## 基本概念
### any
any是TypeScript中的一个顶级类型，表示可以赋值任何类型的值。将变量声明为any后，它将不受类型检查的限制，赋值、调用、访问属性时都不会触发类型错误。因此，any被认为是“不安全”的类型，尽管它提供了极大的灵活性，但滥用any会削弱TypeScript的类型检查优势。

```ts
let someValue: any

someValue = 42
someValue = "Hello"
someValue = true

// 不会报错
// 编译时不会有类型检查
console.log(someValue.toUpperCase()); 
```

### unknown

