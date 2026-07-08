---
title: TypeScript八股
description: TypeScript八股
sidebar_position: 13
date: 2026-07-08
---

# [TypeScript八股](https://wangdoc.com/typescript/)
## 动态类型与静态类型
```js
// JavaScript
// 例一
let x = 1;
x = 'hello';

// 例二
let y = { foo: 1 };
delete y.foo;
y.bar = 2;
```
JavaScript 的类型系统是动态的，不具有很强的约束性。这对于提前发现代码错误，非常不利。

```ts
// TypeScript
// 例一
let x = 1;
x = 'hello'; // 报错

// 例二
let y = { foo: 1 };
delete y.foo; // 报错
y.bar = 2; // 报错
```
TypeScript的作用，就是为 JavaScript 引入这种静态类型特征。

### 静态类型的特点
#### 优点
- 有利于代码的静态分析：有了静态类型，不必运行代码，就可以确定变量的类型，从而推断代码有没有错误。
- 有利于发现错误：由于每个值、每个变量、每个运算符都有严格的类型约束，TypeScript 就能轻松发现拼写错误、语义错误和方法调用错误，节省程序员的时间。
- 更好的IDE支持：IDE一般都会利用类型信息，提供语法提示功能和自动补全功能。
- 提供了代码文档：类型信息可以部分替代代码文档，解释应该如何使用这些代码。
- 有助于代码重构。

#### 缺点
- 丧失了动态类型的代码灵活性。
- 增加了编程工作量。
- 更高的学习成本。
- 引入了独立的编译步骤：原生的 JavaScript 代码，可以直接在 JavaScript 引擎运行。添加类型系统以后，就多出了一个单独的编译步骤，检查类型是否正确，并将 TypeScript 代码转成 JavaScript 代码，这样才能运行。
- 兼容性问题。

## 类型声明
TypeScript 规定，变量只有赋值后才能使用，否则就会报错。
```ts
let x:number;
console.log(x) // 报错
```

## TypeScript的编译
JavaScript 的运行环境（浏览器和 Node.js）不认识 TypeScript 代码。所以，TypeScript 项目要想运行，必须先转为 JavaScript 代码，这个代码转换的过程就叫做“编译”（compile）。TypeScript 官方没有做运行环境，只提供编译器。编译时，会将类型声明和类型相关的代码全部删除，只留下能运行的 JavaScript 代码，并且不会改变 JavaScript 的运行结果。因此，TypeScript 的类型检查只是编译时的类型检查，而不是运行时的类型检查。一旦代码编译为 JavaScript，运行时就不再检查类型了。

## 值与类型
“类型”是针对“值”的，可以视为是后者的一个元属性。每一个值在 TypeScript 里面都是有类型的。TypeScript 代码只涉及类型，不涉及值。所有跟“值”相关的处理，都由 JavaScript 完成。它们是可以分离的，TypeScript 的编译过程，实际上就是把“类型代码”全部拿掉，只保留“值代码”。

## tsc编译器
TypeScript 官方提供的编译器叫做 tsc，可以将 TypeScript 脚本编译成 JavaScript 脚本。本机想要编译 TypeScript 代码，必须安装 tsc。tsc 的作用就是把.ts脚本转变成.js脚本。

### 编译错误的处理
如果编译报错，tsc命令就会显示报错信息，但是这种情况下，依然会编译生成 JavaScript 脚本。TypeScript 团队认为，编译器的作用只是给出编译错误，至于怎么处理这些错误，那就是开发者自己的判断了。

### tsconfig.json
TypeScript 允许将tsc的编译参数，写在配置文件tsconfig.json。只要当前目录有这个文件，tsc就会自动读取，所以运行时可以不写参数。

## any类型
变量类型一旦设为any，TypeScript 实际上会关闭这个变量的类型检查。即使有明显的类型错误，只要句法正确，都不会报错。应该尽量避免使用any类型，否则就失去了使用 TypeScript 的意义。

any类型主要适用以下两个场合：
1. 出于特殊原因，需要关闭某些变量的类型检查，就可以把该变量的类型设为any。
2. 为了适配以前老的 JavaScript 项目，让代码快速迁移到 TypeScript，可以把变量类型设为any。有些年代很久的大型 JavaScript 项目，尤其是别人的代码，很难为每一行适配正确的类型，这时你为那些类型复杂的变量加上any，TypeScript 编译时就不会报错。

从集合论的角度看，any类型可以看成是所有其他类型的全集，包含了一切可能的类型。TypeScript 将这种类型称为“顶层类型”（top type），意为涵盖了所有下层。

### 类型推断
对于开发者没有指定类型、TypeScript 必须自己推断类型的那些变量，如果无法推断出类型，TypeScript 就会认为该变量的类型是any。
```ts
function add(x, y) {
  return x + y;
}

add(1, [1, 2, 3]) // 不报错
```

TypeScript 提供了一个编译选项noImplicitAny，打开该选项，只要推断出any类型就会报错。这里有一个特殊情况，即使打开了noImplicitAny，使用let和var命令声明变量，但不赋值也不指定类型，是不会报错的。由于这个原因，建议使用let和var声明变量时，如果不赋值，就一定要显式声明类型，否则可能存在安全隐患。const命令没有这个问题，因为 JavaScript 语言规定const声明变量时，必须同时进行初始化（赋值）。
```ts
var x; // 不报错
let y; // 不报错
const z; // 报错
```

### 类型污染
any会“污染”其他变量，它可以赋值给其他任何类型的变量（因为没有类型检查），导致其他变量出错。
```ts
let x:any = 'hello';
let y:number;

y = x; // 不报错

y * 123 // 不报错
y.toFixed() // 不报错
```

## unknown类型
为了解决any类型“污染”其他变量的问题，TypeScript 3.0 引入了unknown类型。它与any含义相同，表示类型不确定，可能是任意类型，但是它的使用有一些限制，不像any那样自由，可以视为严格版的any。unknown跟any的相似之处，在于所有类型的值都可以分配给unknown类型。unknown类型跟any类型的不同之处在于，它不能直接使用。主要有以下几个限制：
- unknown类型的变量，不能直接赋值给其他类型的变量（除了any类型和unknown类型）：
```ts
let v:unknown = 123;
let v1:boolean = v; // 报错
let v2:number = v; // 报错
```
- 其次，不能直接调用unknown类型变量的方法和属性：
```ts
let v1:unknown = { foo: 123 };
v1.foo  // 报错

let v2:unknown = 'hello';
v2.trim() // 报错

let v3:unknown = (n = 0) => n + 1;
v3() // 报错
```
- 再次，unknown类型变量能够进行的运算是有限的，只能进行比较运算（运算符==、===、!=、!==、||、&&、?）、取反运算（运算符!）、typeof运算符和instanceof运算符这几种，其他运算都会报错：
```ts
let a:unknown = 1;

a + 1 // 报错
a === 1 // 正确
```

那么，怎么才能使用unknown类型变量呢？案是只有经过“类型缩小”，unknown类型变量才可以使用。所谓“类型缩小”，就是缩小unknown变量的类型范围，确保不会出错。只有明确unknown变量的实际类型，才允许使用它，防止像any那样可以随意乱用，“污染”其他变量。类型缩小以后再使用，就不会报错。
```ts
let a:unknown = 1;
if (typeof a === 'number') {
  let r = a + 10; // 正确
}

let s:unknown = 'hello';
if (typeof s === 'string') {
  s.length; // 正确
}
```
总之，unknown可以看作是更安全的any。一般来说，凡是需要设为any类型的地方，通常都应该优先考虑设为unknown类型。在集合论上，unknown也可以视为所有其他类型（除了any）的全集，所以它和any一样，也属于 TypeScript 的顶层类型。any与unknown的具体讲解见[文档](/docs/TypeScript/any和unknown.md)

## never类型
为了保持与集合论的对应关系，以及类型运算的完整性，TypeScript 还引入了“空类型”的概念，即该类型为空，不包含任何值。由于不存在任何属于“空类型”的值，所以该类型被称为never，即不可能有这样的值。

never类型的使用场景，主要是在一些类型运算之中，保证类型运算的完整性，另外，不可能返回值的函数，返回值的类型就可以写成never。如果一个变量可能有多种类型（即联合类型），通常需要使用分支处理每一种类型。这时，处理所有可能的类型之后，剩余的情况就属于never类型。

never类型的一个重要特点是，可以赋值给任意其他类型。
```ts
function f():never {
  throw new Error('Error');
}

let v1:number = f(); // 不报错
let v2:string = f(); // 不报错
let v3:boolean = f(); // 不报错
```

为什么never类型可以赋值给任意其他类型呢？这也跟集合论有关，空集是任何集合的子集。TypeScript 就相应规定，任何类型都包含了never类型。因此，never类型是任何其他类型所共有的，TypeScript 把这种情况称为“底层类型”（bottom type）。总之，TypeScript 有两个“顶层类型”（any和unknown），但是“底层类型”只有never唯一一个。

## 基本类型
JavaScript 语言（注意，不是 TypeScript）将值分成8种类型：
- boolean
- string
- number
- bigint
- symbol
- object
- undefined
- null

注意，上面所有类型的名称都是小写字母，首字母大写的Number、String、Boolean等在 JavaScript 语言中都是内置对象，而不是类型名称。undefined 和 null 既可以作为值，也可以作为类型，取决于在哪里使用它们。

如果没有声明类型的变量，被赋值为undefined或null，在关闭编译设置noImplicitAny和strictNullChecks时，它们的类型会被推断为any。为避免这种情况，则需要打开编译选项strictNullChecks。打开后赋值为undefined的变量会被推断为undefined类型，赋值为null的变量会被推断为null类型。
```ts
// 关闭 noImplicitAny 和 strictNullChecks
let a = undefined;   // any
const b = undefined; // any

let c = null;        // any
const d = null;      // any

// 打开编译设置 strictNullChecks
let a = undefined;   // undefined
const b = undefined; // undefined

let c = null;        // null
const d = null;      // null
```

## 包装对象类型
### 包装对象
avaScript 的8种类型之中，undefined和null其实是两个特殊值，object属于复合类型，剩下的五种属于原始类型（primitive value），代表最基本的、不可再分的值：
- boolean
- string
- number
- bigint
- symbol

上面这五种原始类型的值，都有对应的包装对象（wrapper object）。所谓“包装对象”，指的是这些值在需要时，会自动产生的对象：
```ts
'hello'.charAt(1) // 'e'
```
上面示例中，字符串hello执行了charAt()方法。但是，在 JavaScript 语言中，只有对象才有方法，原始类型的值本身没有方法。这行代码之所以可以运行，就是因为在调用方法时，字符串会自动转为包装对象，charAt()方法其实是定义在包装对象上。这样的设计大大方便了字符串处理，省去了将原始类型的值手动转成对象实例的麻烦。

五种包装对象之中，symbol 类型和 bigint 类型无法直接获取它们的包装对象（即Symbol()和BigInt()不能作为构造函数使用），但是剩下三种可以：
- Boolean()
- String()
- Number()

以上三个构造函数，执行后可以直接获取某个原始类型值的包装对象:
```ts
const s = new String('hello');
typeof s // 'object'
s.charAt(1) // 'e'

const b = new Boolean(true);
typeof b // 'object'
b.valueOf() // true

const n = new Number(123);
typeof n // 'object'
n.toFixed(2) // '123.00'
```

String()只有当作构造函数使用时（即带有new命令调用），才会返回包装对象。如果当作普通函数使用（不带有new命令），返回就是一个普通字符串。其他两个构造函数Number()和Boolean()也是如此。

### 包装对象类型与字面量类型
由于包装对象的存在，导致每一个原始类型的值都有包装对象和字面量两种情况：
```ts
'hello' // 字面量
new String('hello') // 包装对象
```
为了区分这两种情况，TypeScript 对五种原始类型分别提供了大写和小写两种类型：
- Boolean 和 boolean
- String 和 string
- Number 和 number
- BigInt 和 bigint
- Symbol 和 symbol

其中，大写类型同时包含包装对象和字面量两种情况，小写类型只包含字面量，不包含包装对象：
```ts
const s1:String = 'hello'; // 正确
const s2:String = new String('hello'); // 正确

const s3:string = 'hello'; // 正确
const s4:string = new String('hello'); // 报错
```

建议只使用小写类型，不使用大写类型。因为绝大部分使用原始类型的场合，都是使用字面量，不使用包装对象。而且，TypeScript 把很多内置方法的参数，定义成小写类型，使用大写类型会报错：
```ts
const n1:number = 1;
const n2:Number = 1;

Math.abs(n1) // 1
Math.abs(n2) // 报错
```

Symbol()和BigInt()这两个函数不能当作构造函数使用，所以没有办法直接获得 symbol 类型和 bigint 类型的包装对象，除非使用下面的写法。但是，它们没有使用场景，因此Symbol和BigInt这两个类型虽然存在，但是完全没有使用的理由：
```ts
let a = Object(Symbol());
let b = Object(BigInt());
```

目前在 TypeScript 里面，symbol和Symbol两种写法没有差异，bigint和BigInt也是如此，建议始终使用小写的symbol和bigint，不使用大写的Symbol和BigInt。


