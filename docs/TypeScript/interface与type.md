---
title: interface与type
description: 在TypeScript中，interface和type都可以用来描述类型结构，但它们在功能、使用场景和行为上存在一些关键区别。
sidebar_position: 3
date: 2025-12-26
---

# interface与type
在TypeScript中，interface和type都可以用来描述类型结构，但它们在功能、使用场景和行为上存在一些关键区别。

## 定义
### interface
interface定义了一个对象的形状，描述了对象应该具有的属性及其类型。
```ts
interface Person {
    name: string
    age: number
    sex: 0 | 1
}
```

### type
type定义了一个集合，可以包含各种类型的属性和值，以用来描述对象、函数、联合类型、交叉类型等。
```ts
type Person = {
    name: string
    age: number
    sex: 0 | 1
}
```

可以看到，虽然interface和type都可以用来描述对象的结构，但是它们的语法略有不同。interface使用花括号直接定义接口的成员，而type使用等号来定义类型别名。

## 可定义类型范围
### interface
interface只能定义对象类型或函数类型，无法定义基本类型（如string、number）、联合类型、元组等。
```ts
// interface只能定义对象/函数类型（以下正确）
interface User {
    name: string
    age: number
}

interface AddFn {
  (a: number, b: number): number;
}

// interface不能定义基本类型（以下错误）
interface MyString = string     // 报错，interface只能用于声明对象类型或接口类型
```

### type
type可以定义任意类型，包括基本类型别名、联合类型、交叉类型、元组等。
```ts
type Age = number

// type可以定义联合类型
type Status = "active" | "inactive" | "pending"

// type可以定义元组
type Point = [number, number]
```

## 可扩展性
### interface
interface可以被扩展，可以使用extends关键字来实现接口的继承，从而添加更多属性或者方法。
```ts
interface Fruit {
  name: string
}

interface Apple extends Fruit {
    kind: string
}
```

### type
type可以通过联合类型`|`和交叉类型`&`进行组合，但不能直接扩展其他`type`。
```ts
type A = { x: string }
type B = { y: string }
type C = A & B  // C 同时具有 A 和 B 的属性
```

综合来看，interface适合于描述对象的形状，定义类的契约和实现，以及接口之间的继承和扩展。type也具有相似的能力，它适合于定义复杂的类型别名和泛型类型，以及进行条件类型的定义。这两者在许多情况下可以互相替代。

## 兼容性
### interface
interface如果定义了多个同名的接口，它们会被合并成一个单一的接口，而不是报错。当多个同名接口出现时，它们的成员会被合并为一个接口，这种合并会在类型级别上进行，不会在运行时产生影响。
```ts
// 正确，无报错
interface A {
    x: string
}

interface A {
    y: string
    z: string
}
```

### type
type如果对类型别名进行重复定义，TypeScript会报错。这意味着不能重新定义一个已存在的type。
```ts
type A = {
    x: string
}

interface A = {
    y: string
    z: string
}
```

以上面interface的例子来说，无论使用哪个interface A，都会引用同一个合并后的接口定义。这样的合并机制使得TypeScript中的接口能够更加灵活地进行组织和管理。

## 与类的实现
- 类可以通过`implements`实现interface或**非联合类型**的type。
- 类**不能实现联合类型**的type，因为联合类型包含多种可能结构，类无法同时满足。

```ts
interface Shape {
    area(): number
}

// 类实现interface（正确）
class Circle implements Shape {
    radius: number
    area() {
        return Math.PI * this.radius **2    
    }
}

type ShapeType = {
    area(): number  
}

// 类实现非联合type（正确）
class Square implements ShapeType {
    side: number
    area() {
        return this.side** 2
    } 
}

// 联合类型的type
type UnionShape = { area(): number } | { volume(): number }

// 类无法实现联合类型（报错）
// 报错，Cube类型不能赋值给UnionShape类型
class Cube implements UnionShape {  
    side: number
    volume() {
        return this.side **3
    }
}
```

## 映射类型支持
type可以结合in关键字定义映射类型（通过遍历联合类型生成新类型），而interface不支持。
```ts
// 定义一个联合类型
type Keys = "name" | "age"

// type定义映射类型（将Keys中的每个键转为可选属性）
type Optional<T> = {
    [K in keyof T]?: T[K]
}

type User = {
    name: string
    age: number
}

type OptionalUser = Optional<User>  // { name?: string; age?: number }


// interface无法定义映射类型（以下错误）
interface OptionalInterface<T> {
    [K in keyof T]?: T[K]           // 报错：接口成员不能包含“in”表达式
}
```

## 使用建议
### 优先使用interface的场景
- 定义对象、函数的结构（明确 “形状”）。
- 需要通过extends扩展或合并声明（如扩展第三方库类型）。
- 希望代码更符合面向对象的继承语义。

### 优先使用type的场景
- 定义基本类型别名、联合类型、元组、交叉类型。
- 需要定义映射类型。
- 不需要合并声明，且类型逻辑更复杂（如组合多种类型）。

## 总结
interface和type的核心区别对比：
## interface 与 type 的区别对比

| 特性             | interface                              | type                                           |
|------------------|----------------------------------------|------------------------------------------------|
| **基本用途**     | 主要用于定义对象/函数的结构（“形状”）   | 可定义任意类型（对象、基本类型、联合类型等）    |
| **扩展方式**     | 通过`extends`关键字扩展              | 通过交叉类型`&`扩展                          |
| **声明合并**     | 支持同名声明自动合并                   | 不支持，同名声明会报错                         |
| **类型范围**     | 仅限对象类型和函数类型                 | 支持任意类型（包括基本类型、联合、交叉、映射等）|
| **implements**   | 类可以直接`implements`接口           | 类可以`implements`非联合/交叉的类型别名      |
| **映射类型**     | 不支持直接定义映射类型                 | 支持（如`type Mapped = { [K in keyof T]: ... }`） |


在TypeScript中，`interface`和`type`都是用来定义类型的关键字，它们各有优势和适用场景。
- `interface`更侧重于描述“结构契约”，强调扩展性和声明合并（同名接口可自动合并），非常适合定义对象形状、函数签名以及需要被类 `implements` 或第三方库扩展的场景。
- `type`更擅长“类型组合”与灵活性，能够轻松表达联合类型、交叉类型、映射类型、原始类型别名等复杂构造。

在日常开发中，应根据团队规范和具体需求选择：通常用`interface` 来定义复杂的对象类型或需要强扩展性的结构，而在需要进行类型组合、联合、工具类型等场景时更倾向于使用`type`。两者并非互斥，实际项目中经常结合使用，例如用`type`先定义一个联合类型或别名，再用`interface` 来扩展它，从而更好地利用 TypeScript 的类型系统，提升代码质量与开发效率。




## 参考
- [**TypeScript 中的 type 和 interface：你真的了解它们的不同吗？**](https://juejin.cn/post/7340854234894876684?searchId=20260130194952003E6044403FB73C6BFF)
- [**Typescript中type和interface的区别**](https://juejin.cn/post/7555717437410983988?searchId=20260130194952003E6044403FB73C6BFF)