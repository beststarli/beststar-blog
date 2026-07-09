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

## Object类型与object类型
### Object类型
大写的Object类型代表 JavaScript 语言里面的广义对象。所有可以转成对象的值，都是Object类型，这囊括了几乎所有的值。事实上，除了undefined和null这两个值不能转为对象，其他任何值都可以赋值给Object类型。
```ts
let obj:Object;
 
obj = true;
obj = 'hi';
obj = 1;
obj = { foo: 123 };
obj = [1, 2];
obj = (a:number) => a + 1;
obj = undefined; // 报错
obj = null; // 报错
```

另外，空对象{}是Object类型的简写形式，所以使用Object时常常用空对象代替。
```ts
let obj:{};
 
obj = true;
obj = 'hi';
obj = 1;
obj = { foo: 123 };
obj = [1, 2];
obj = (a:number) => a + 1;
```

### object类型
小写的object类型代表 JavaScript 里面的狭义对象，即可以用字面量表示的对象，只包含对象、数组和函数，不包括原始类型的值。大多数时候，我们使用对象类型，只希望包含真正的对象，不希望包含原始类型。所以，建议总是使用小写类型object，不使用大写类型Object。
```ts
let obj:object;
 
obj = { foo: 123 };
obj = [1, 2];
obj = (a:number) => a + 1;
obj = true; // 报错
obj = 'hi'; // 报错
obj = 1; // 报错
```

## 值类型
TypeScript 规定，单个值也是一种类型，称为“值类型”。
```ts
let x:'hello';

x = 'hello'; // 正确
x = 'world'; // 报错
```
TypeScript 推断类型时，遇到const命令声明的变量，如果代码里面没有注明类型，就会推断该变量是值类型。这样推断是合理的，因为const命令声明的变量，一旦声明就不能改变，相当于常量。值类型就意味着不能赋为其他值。
```ts
// x 的类型是 "https"
const x = 'https';

// y 的类型是 string
const y:string = 'https';
```
注意，const命令声明的变量，如果赋值为对象，并不会推断为值类型。这是因为const变量赋值为对象时，属性值是可以改变的。
```ts
// x 的类型是 { foo: number }
const x = { foo: 1 };
```
值类型可能会出现一些很奇怪的报错。由于5是number的子类型，number是5的父类型，父类型不能赋值给子类型，所以报错了：
```ts
const x:5 = 4 + 1; // 报错
```
反过来是可以的，子类型可以赋值给父类型。
```ts
let x:5 = 5;
let y:number = 4 + 1;

x = y; // 报错
y = x; // 正确
```

只包含单个值的值类型，用处不大。实际开发中，往往将多个值结合，作为联合类型使用。

## 联合类型
联合类型（union types）指的是多个类型组成的一个新类型，使用符号|表示。

“类型缩小”是 TypeScript 处理联合类型的标准方法，凡是遇到可能为多种类型的场合，都需要先缩小类型，再进行处理。实际上，联合类型本身可以看成是一种“类型放大”（type widening），处理时就需要“类型缩小”（type narrowing）。

## 交叉类型
交叉类型（intersection types）指的是多个类型组成的一个新类型，使用符号&表示。交叉类型A&B表示，任何一个类型必须同时属于A和B，才属于交叉类型A&B，即交叉类型同时满足A和B的特征：
```ts
let x:number&string;
```
变量x同时是数值和字符串，这当然是不可能的，所以 TypeScript 会认为x的类型实际是never。

## type命令
type命令用来定义一个类型的别名。别名不允许重名。
```ts
type Age = number;
let age:Age = 55;

type Color = 'red';
type Color = 'blue'; // 报错
```
别名的作用域是块级作用域。这意味着，代码块内部定义的别名，影响不到外部。
```ts
type Color = 'red';
if (Math.random() < 0.5) {
  type Color = 'blue';
}
```
别名支持使用表达式，也可以在定义一个别名时，使用另一个别名，即别名允许嵌套。
```ts
type World = "world";
type Greeting = `hello ${World}`;
```


## typeof运算符
JavaScript 里面，typeof运算符只可能返回八种结果，而且都是字符串。
```js
typeof undefined; // "undefined"
typeof true; // "boolean"
typeof 1337; // "number"
typeof "foo"; // "string"
typeof {}; // "object"
typeof parseInt; // "function"
typeof Symbol(); // "symbol"
typeof 127n // "bigint"
```

TypeScript 将typeof运算符移植到了类型运算，它的操作数依然是一个值，但是返回的不是字符串，而是该值的 TypeScript 类型：
```ts
const a = { x: 0 };
type T0 = typeof a;   // { x: number }
type T1 = typeof a.x; // number
```

typeof命令的参数不能是类型。
```ts
type Age = number;
type MyAge = typeof Age; // 报错
```

## 数组
### 类型推断
数组变量arr的初始值是空数组，然后随着新成员的加入，TypeScript 会自动修改推断的数组类型：
```ts
const arr = [];
arr // 推断为 any[]
arr.push(123);
arr // 推断类型为 number[]
arr.push('abc');
arr // 推断类型为 (string|number)[]
```
但是，类型推断的自动更新只发生初始值为空数组的情况。如果初始值不是空数组，类型推断就不会更新。
```ts
// 推断类型为 number[]
const arr = [123];
arr.push('abc'); // 报错
```

### 只读数组
TypeScript 允许声明只读数组，方法是在数组类型前面加上readonly关键字。TypeScript 将readonly number[]与number[]视为两种不一样的类型，后者是前者的子类型。这是因为只读数组没有pop()、push()之类会改变原数组的方法，所以number[]的方法数量要多于readonly number[]，这意味着number[]其实是readonly number[]的子类型。子类型继承了父类型的所有特征，并加上了自己的特征，所以子类型number[]可以用于所有使用父类型的场合，反过来不行：
```ts
let a1:number[] = [0, 1];
let a2:readonly number[] = a1; // 正确

a1 = a2; // 报错
```
readonly关键字不能与数组的泛型写法一起使用。
```ts
// 报错
const arr:readonly Array<number> = [0, 1];
```
实际上，TypeScript 提供了两个专门的泛型，用来生成只读数组的类型。
```ts
const a1:ReadonlyArray<number> = [0, 1];
const a2:Readonly<number[]> = [0, 1];
```

只读数组还有一种声明方法，就是使用“const 断言”。
```ts
const arr = [0, 1] as const;
arr[0] = [2]; // 报错 
```

## 元祖
元组（tuple）是 TypeScript 特有的数据类型，JavaScript 没有单独区分这种类型。它表示成员类型可以自由设置的数组，即数组的各个成员的类型可以不同。
```ts
const s:[string, string, boolean] = ['a', 'b', true];
```

由于需要声明每个成员的类型，所以大多数情况下，元组的成员数量是有限的，从类型声明就可以明确知道，元组包含多少个成员，越界的成员会报错。
```ts
let x:[string, string] = ['a', 'b'];
x[2] = 'c'; // 报错
```

## symbol类型
Symbol 值通过Symbol()函数生成。在 TypeScript 里面，Symbol 的类型使用symbol表示。变量x和y的类型都是symbol，且都用Symbol()生成，但是它们是不相等的：
```ts
let x:symbol = Symbol();
let y:symbol = Symbol();
x === y // false
```

### unique symbol
symbol类型包含所有的 Symbol 值，但是无法表示某一个具体的 Symbol 值。比如，5是一个具体的数值，就用5这个字面量来表示，这也是它的值类型。但是，Symbol 值不存在字面量，必须通过变量来引用，所以写不出只包含单个 Symbol 值的那种值类型。为了解决这个问题，TypeScript 设计了symbol的一个子类型unique symbol，它表示单个的、某个具体的 Symbol 值。因为unique symbol表示单个值，所以这个类型的变量是不能修改值的，只能用const命令声明，不能用let声明：
```ts
// 正确
const x:unique symbol = Symbol();
// 报错
let y:unique symbol = Symbol();
```
const命令为变量赋值 Symbol 值时，变量类型默认就是unique symbol，所以类型可以省略不写：
```ts
const x:unique symbol = Symbol();
// 等同于
const x = Symbol();
```
每个声明为unique symbol类型的变量，它们的值都是不一样的，其实属于两个值类型：
```ts
const a:unique symbol = Symbol();
const b:unique symbol = Symbol();
a === b // 报错
```

### 类型声明
let命令声明的变量，推断类型为 symbol。const命令声明的变量，推断类型为 unique symbol。const命令声明的变量，如果赋值为另一个 symbol 类型的变量，则推断类型为 symbol。let命令声明的变量，如果赋值为另一个 unique symbol 类型的变量，则推断类型还是 symbol。
```ts
// 类型为 symbol
let x = Symbol();
// 类型为 unique symbol
const y = Symbol();
// 类型为 symbol
const z = x;
// 类型为 symbol
let u = y;
```

## 函数
如果一个变量要套用另一个函数类型，有一个小技巧，就是使用typeof运算符：
```ts
function add(
  x:number,
  y:number
) {
  return x + y;
}

const myAdd:typeof add = function (x, y) {
  return x + y;
}
```

### Function类型
TypeScript 提供 Function 类型表示函数，任何函数都属于这个类型。Function 类型的函数可以接受任意数量的参数，每个参数的类型都是any，返回值的类型也是any，代表没有任何约束，所以不建议使用这个类型，给出函数详细的类型声明会更好：
```ts
function doSomething(f:Function) {
  return f(1, 2, 3);
}
```

### void类型
void 类型允许返回undefined或null：
```ts
function f():void {
  return undefined; // 正确
}

function f():void {
  return null; // 正确
}
```

如果变量、对象方法、函数参数是一个返回值为 void 类型的函数，那么并不代表不能赋值为有返回值的函数。恰恰相反，该变量、对象方法和函数参数可以接受返回任意值的函数，这时并不会报错：
```ts
type voidFunc = () => void;
const f:voidFunc = () => {
  return 123;
};
```
这是因为，这时 TypeScript 认为，这里的 void 类型只是表示该函数的返回值没有利用价值，或者说不应该使用该函数的返回值。只要不用到这里的返回值，就不会报错。如果后面使用了这个函数的返回值，就违反了约定，则会报错：
```ts
type voidFunc = () => void;
const f:voidFunc = () => {
  return 123;
};
f() * 2 // 报错
```

### never类型
never类型表示肯定不会出现的值。它用在函数的返回值，就表示某个函数肯定不会返回值，即函数不会正常执行结束。它主要有以下两种情况：
- 抛出错误的函数。
```ts
function fail(msg:string):never {
  throw new Error(msg);
}
```
- 无限执行的函数。
```ts
const sing = function():never {
  while (true) {
    console.log('sing');
  }
};
```

## 对象类型
### 属性名的索引类型
对象可以同时有多种类型的属性名索引，比如同时有数值索引和字符串索引。但是，数值索引不能与字符串索引发生冲突，必须服从后者，这是因为在 JavaScript 语言内部，所有的数值属性名都会自动转为字符串属性名。
```ts
type MyType = {
  [x: number]: boolean; // 报错
  [x: string]: string;
}
```

同样地，可以既声明属性名索引，也声明具体的单个属性名。如果单个属性名不符合属性名索引的范围，两者发生冲突，就会报错。
```ts
type MyType = {
  foo: boolean; // 报错
  [x: string]: string;
}
```

### 严格字面量检查
如果对象使用字面量表示，会触发 TypeScript 的严格字面量检查（strict object literal checking）。如果字面量的结构跟类型定义的不一样（比如多出了未定义的属性），就会报错：
```ts
const point:{
  x:number;
  y:number;
} = {
  x: 1,
  y: 1,
  z: 1 // 报错
};
```
如果等号右边不是字面量，而是一个变量，根据结构类型原则，是不会报错的。
```ts
const myPoint = {
  x: 1,
  y: 1,
  z: 1
};

const point:{
  x:number;
  y:number;
} = myPoint; // 正确
```

## interface接口
### interface的继承
#### interface继承interface
多重接口继承，实际上相当于多个父接口的合并。如果子接口与父接口存在同名属性，那么子接口的属性会覆盖父接口的属性。注意，子接口与父接口的同名属性必须是类型兼容的，不能有冲突，否则会报错。
```ts
interface Foo {
  id: string;
}
interface Bar extends Foo {
  id: number; // 报错
}
```
多重继承时，如果多个父接口存在同名属性，那么这些同名属性不能有类型冲突，否则会报错。
```ts
interface Foo {
  id: string;
}

interface Bar {
  id: number;
}

// 报错
interface Baz extends Foo, Bar {
  type: string;
}
```

#### interface继承type
如果type命令定义的类型不是对象，interface就无法继承。

### 接口合并
同名接口合并时，如果同名方法有不同的类型声明，那么会发生函数重载。而且，后面的定义比前面的定义具有更高的优先级。
```ts
interface Cloner {
  clone(animal: Animal): Animal;
}

interface Cloner {
  clone(animal: Sheep): Sheep;
}

interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
}

// 等同于
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
  clone(animal: Sheep): Sheep;
  clone(animal: Animal): Animal;
}
```
这个规则有一个例外。同名方法之中，如果有一个参数是字面量类型，字面量类型有更高的优先级。
```ts
interface A {
  f(x:'foo'): boolean;
}

interface A {
  f(x:any): void;
}

// 等同于
interface A {
  f(x:'foo'): boolean;
  f(x:any): void;
}
```

如果两个 interface 组成的联合类型存在同名属性，那么该属性的类型也是联合类型。
```ts
interface Circle {
  area: bigint;
}

interface Rectangle {
  area: number;
}

declare const s: Circle | Rectangle;

s.area;   // bigint | number
```

### [interface和type的异同](/docs/TypeScript/interface与type.md)
interface与type两者往往可以换用，区别主要在于：
1. type能够表示非对象类型，而interface只能表示对象类型（包括数组、函数等）。
2. interface可以继承其他类型，type不支持继承。type定义的对象类型如果想要添加属性，只能使用&运算符，重新定义一个类型。继承时type和interface是可以换用的。
```ts
type Animal = {
  name: string
}
type Bear = Animal & {
  honey: boolean
}
```
```ts
type Foo = { x: number; };
interface Bar extends Foo {
  y: number;
}
```
```ts
interface Foo {
  x: number;
}
type Bar = Foo & { y: number; };
```
3. 同名interface会自动合并，同名type则会报错。也就是说，TypeScript 不允许使用type多次定义同一个类型。这表明，interface 是开放的，可以添加属性，type 是封闭的，不能添加属性，只能定义新的 type。
4. interface不能包含属性映射（mapping），type可以。
```ts
interface Point {
  x: number;
  y: number;
}

// 正确
type PointCopy1 = {
  [Key in keyof Point]: Point[Key];
};

// 报错
interface PointCopy2 {
  [Key in keyof Point]: Point[Key];
};
```
5. this关键字只能用于interface。
```ts
// 正确
interface Foo {
  add(num:number): this;
};

// 报错
type Foo = {
  add(num:number): this;
};
```
6. type 可以扩展原始数据类型，interface 不行。
```ts
// 正确
type MyStr = string & {
  type: 'new'
};

// 报错
interface MyStr extends string {
  type: 'new'
}
```
7. interface无法表达某些复杂类型（比如交叉类型和联合类型），但是type可以。
```ts
type A = { /* ... */ };
type B = { /* ... */ };

type AorB = A | B;
type AorBwithName = AorB & {
  name: string
};
```

综上所述，如果有复杂的类型运算，那么没有其他选择只能使用type；一般情况下，interface灵活性比较高，便于扩充类型或自动合并，建议优先使用。

## class类型
### 存取器
存取器（accessor）是特殊的类方法，包括取值器（getter）和存值器（setter）两种方法。它们用于读写某个属性，取值器用来读取属性，存值器用来写入属性。
```ts
class C {
  _name = '';
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
}
```
TypeScript 对存取器有以下规则：
1. 如果某个属性只有get方法，没有set方法，那么该属性自动成为只读属性。
```ts
class C {
  _name = 'foo';

  get name() {
    return this._name;
  }
}

const c = new C();
c.name = 'bar'; // 报错
```
2. TypeScript 5.1 版之前，set方法的参数类型，必须兼容get方法的返回值类型，否则报错。
```ts
// TypeScript 5.1 版之前
class C {
  _name = '';
  get name():string {  // 报错
    return this._name;
  }
  set name(value:number) {
    this._name = String(value);
  }
}
```
3. get方法与set方法的可访问性必须一致，要么都为公开方法，要么都为私有方法。

### 类的interface接口
#### implements关键字
implements关键字后面，不仅可以是接口，也可以是另一个类。这时，后面的类将被当作接口。
```ts
class Car {
  id:number = 1;
  move():void {};
}

class MyCar implements Car {
  id = 2; // 不可省略
  move():void {};   // 不可省略
}
```
上面示例中，implements后面是类Car，这时 TypeScript 就把Car视为一个接口，要求MyCar实现Car里面的每一个属性和方法，否则就会报错。所以，这时不能因为Car类已经实现过一次，而在MyCar类省略属性或方法。

interface 描述的是类的对外接口，也就是实例的公开属性和公开方法，不能定义私有的属性和方法。这是因为 TypeScript 设计者认为，私有属性是类的内部实现，接口作为模板，不应该涉及类的内部代码写法。
```ts
interface Foo {
  private member:{}; // 报错
}
```

#### 类与接口的合并
TypeScript 不允许两个同名的类，但是如果一个类和一个接口同名，那么接口会被合并进类。
```ts
class A {
  x:number = 1;
}

interface A {
  y:number;
}

let a = new A();
a.y = 10;

a.x // 1
a.y // 10
```

### Class类型
作为类型使用时，类名只能表示实例的类型，不能表示类的自身类型。由于类名作为类型使用，实际上代表一个对象，因此可以把类看作为对象类型起名。事实上，TypeScript 有三种方法可以为对象类型起名：type、interface 和 class。
```ts
class Point {
  x:number;
  y:number;

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
}

// 错误
function createPoint(
  PointClass:Point,
  x: number,
  y: number
) {
  return new PointClass(x, y);
}
```

### 结构类型原则
确定两个类的兼容关系时，只检查实例成员，不考虑静态成员和构造方法。
```ts
class Point {
  x: number;
  y: number;
  static t: number;
  constructor(x:number) {}
}

class Position {
  x: number;
  y: number;
  z: number;
  constructor(x:string) {}
}

const point:Point = new Position('');
```