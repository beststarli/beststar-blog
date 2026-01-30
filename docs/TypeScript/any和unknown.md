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
console.log(someValue.toUpperCase())    // 编译时不会有类型检查
```

### unknown
unknown类型是TypeScript 3.0引入的，它也是顶级类型之一，可以接受任何类型的值。但不同于any，unknown提供了严格的类型检查——在对unknown类型的值进行操作前，必须先进行类型判断或类型断言，否则会触发编译错误。unknown为动态类型的数据引入了一层安全机制，是一个“更安全的any”。

```ts
let value: unknown

value = 42
value = "Hello"

// 编译错误：Object is of type 'unknown'
console.log(value.toUpperCase())

// 正确使用方式：类型检查
if (typeof value === "string") {
    console.log(value.toUpperCase())    // 编译通过
}
```

## any与unknown的区别

any:
- 禁用类型检查，允许任何操作。会导致意外错误，如未定义的方法或属性调用等问题。
- 可以赋值给任意类型的变量，包括严格的类型（如string、number等）。
- 兼容所有类型，无论是赋值操作还是接口实现时，any都不会引发冲突。

unknown:
- 强制类型检查，防止未检查的操作。需要明确变量的类型后才能进行操作，有助于避免潜在的运行时错误。
- 不能直接赋值给其他类型的变量，只能赋值给 unknown 或 any 类型。要将 unknown 赋值给具体类型的变量，需要通过类型断言或类型缩小来确保安全。
- 比any更严格，需要类型缩小、类型断言或具体类型匹配，才能与其他类型兼容。

```ts
let unknownValue: unknown = "hello"
let anyValue: any = "hello"

let str1: string = anyValue         // 正确
let str2: string = unknownValue     // 编译错误，需要类型断言
```

```ts
let someUnknown: unknown = "hello"
let someString: string = someUnknown as string  // 必须使用类型断言
```

## 使用场景
### 使用any的场景
尽管any有可能导致类型安全性降低，但在某些场景中，any的灵活性仍然具有不可替代的优势：
- 快速开发：在原型设计或快速开发中，为了省去类型定义的成本，可以使用any。
- 第三方库数据：在未定义具体类型的第三方库中，临时用any标记数据类型。
- 未知输入：在接收极度动态化的数据（如JSON）时可以使用any，然后再进行类型检查和转换。

### 使用unknown的场景
unknown是一种更安全的动态类型，在以下场景中更为适合：
- 动态数据：在处理API或用户输入数据时，可以使用unknown来标记数据，确保在使用前进行类型验证。
- 类型约束：如果一个变量的类型不明确，但需要保证操作的安全性，可以使用unknown。
- 避免滥用any：对于需要灵活性但又希望保持类型安全性的场景，unknown是比any更合适的选择。

### 使用示例：unknown处理API数据
在实际开发中，我们可能会从外部API获取数据，但数据的结构在运行时才会确定。此时可以使用unknown，并在操作数据前进行类型验证。

```ts

async function fetchData(apiUrl: string): Promise<unknown> {
    const response = await fetch(apiUrl)
    return response.json()
}

async function handleData() {
    const data: unknown = await fetchData("<https://api.example.com/data")>
    
    if (typeof data === "object" && data !== null && "name" in data) {
        const name = (data as { name: string }).name
        console.log(`User's name is ${name}`)
    } else {
        console.error("Invalid data format")
    }
}
```
在这段代码中，通过unknown来标记API返回的数据类型，并在使用前进行类型验证，确保了数据使用的安全性。

## 实践建议
- 优先使用unknown：在API调用和不确定的动态数据处理中，优先使用unknown并添加类型检查，以保证类型安全。
- 慎用any：在类型不确定的场景下，可以使用any提高灵活性，但应尽量避免any泛滥，并在使用前确保数据符合预期。
- 使用TypeScript配合调试工具：对于unknown类型的变量，TypeScript能帮助我们识别潜在的类型问题，配合Vue DevTools和React DevTools可以更好地检查应用状态，提升调试效率。
- 为动态内容添加类型注释：在unknown和any中使用类型断言或类型缩小，避免动态数据造成的类型不安全。

## 总结与对比
| 特性          | any                              | unknown                          |
|---------------|----------------------------------|----------------------------------|
| 类型检查      | 无类型检查                       | 严格类型检查                     |
| 可赋值性      | 可赋值给任何类型                 | 仅可赋值给`unknown`或`any`    |
| 兼容性        | 兼容所有类型                     | 需要类型缩小或类型断言           |
| 适用场景      | 快速开发、动态数据处理           | 动态数据、API 响应处理           |
| 类型安全性        |  低                    |  高                    |

- any适合快速开发和处理复杂动态数据，允许灵活操作，但缺乏类型安全。
- unknown是更安全的动态类型，确保在使用前进行类型验证，更适合处理未知数据并保证代码的健壮性。

## 参考
- [**深入解析 TypeScript 的 unknown 和 any：安全性与灵活性的平衡**](https://juejin.cn/post/7436664721888002086?searchId=202601301613131F5549BBD838D8233A74)
- [**跟着阮一峰老师学Typescript 认识any，unknow，never类型！！！**](https://juejin.cn/post/7377595015047381003?searchId=202601301613131F5549BBD838D8233A74)