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

### 可访问性修饰符
#### private
严格地说，private定义的私有成员，并不是真正意义的私有成员。一方面，编译成 JavaScript 后，private关键字就被剥离了，这时外部访问该成员就不会报错。另一方面，由于前一个原因，TypeScript 对于访问private成员没有严格禁止，使用方括号写法（[]）或者in运算符，实例对象就能访问该成员。
```ts
class A {
  private x = 1;
}

const a = new A();
a['x'] // 1

if ('x' in a) { // 正确
  // ...
}
```
由于private存在这些问题，加上它是 ES2022 标准发布前出台的，而 ES2022 引入了自己的私有成员写法#propName。因此建议不使用private，改用 ES2022 的写法，获得真正意义的私有成员。
```ts
class A {
  #x = 1;
}

const a = new A();
a['x'] // 报错
```

构造方法也可以是私有的，这就直接防止了使用new命令生成实例对象，只能在类的内部创建实例对象。这时一般会有一个静态方法，充当工厂函数，强制所有实例都通过该方法生成。下面示例使用私有构造方法，实现了单例模式。
```ts
class Singleton {
  private static instance?: Singleton;

  private constructor() {}

  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}

const s = Singleton.getInstance();
```

#### protected
protected修饰符表示该成员是保护成员，只能在类的内部使用该成员，实例无法使用该成员，但是子类内部可以使用。
```ts
class A {
  protected x = 1;
}

class B extends A {
  getX() {
    return this.x;
  }
}

const a = new A();
const b = new B();

a.x // 报错
b.getX() // 1
```
子类不仅可以拿到父类的保护成员，还可以定义同名成员。
```ts
class A {
  protected x = 1;
}

class B extends A {
  x = 2;
}
```

### 顶层属性的处理方法
类的顶层属性在 TypeScript 里面，有两种写法。
```ts
class User {
  // 写法一
  age = 25;

  // 写法二
  constructor(private currentYear: number) {}
}
```

ES2022 标准里面的处理方法是，先进行顶层属性的初始化，再运行构造方法。这在某些情况下，会使得同一段代码在 TypeScript 和 JavaScript 下运行结果不一致。这种不一致一般发生在两种情况：
- 第一种情况是，顶层属性的初始化依赖于其他实例属性。
```ts
class User {
  age = this.currentYear - 1998;

  constructor(private currentYear: number) {
    // 输出结果将不一致
    console.log('Current age:', this.age);
  }
}

const user = new User(2023);
```
- 第二种情况与类的继承有关，子类声明的顶层属性在父类完成初始化。
```ts
interface Animal {
  animalStuff: any;
}

interface Dog extends Animal {
  dogStuff: any;
}

class AnimalHouse {
  resident: Animal;

  constructor(animal:Animal) {
    this.resident = animal;
  }
}

class DogHouse extends AnimalHouse {
  resident: Dog;

  constructor(dog:Dog) {
    super(dog);
  }
}

const dog = {
  animalStuff: 'animal',
  dogStuff: 'dog'
};

const dogHouse = new DogHouse(dog);
console.log(dogHouse.resident) // 输出结果将不一致
```
如果希望避免这种不一致，让代码在不同设置下的行为都一样，那么可以将所有顶层属性的初始化，都放到构造方法里面。
```ts
class User  {
  age: number;

  constructor(private currentYear: number) {
    this.age = this.currentYear - 1998;
    console.log('Current age:', this.age);
  }
}

const user = new User(2023);
```
对于类的继承，还有另一种解决方法，就是使用declare命令，去声明子类顶层属性的类型，告诉 TypeScript 这些属性的初始化由父类实现。
```ts
class DogHouse extends AnimalHouse {
  declare resident: Dog;

  constructor(dog:Dog) {
    super(dog);
  }
}
```

### 静态成员
静态成员是只能通过类本身使用的成员，不能通过实例对象使用。
```ts
class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}

MyClass.x // 0
MyClass.printX() // 0
```
static关键字前面可以使用 public、private、protected 修饰符。
```ts
class MyClass {
  private static x = 0;
}

MyClass.x // 报错
```
public和protected的静态成员可以被继承。
```ts
class A {
  public static x = 1;
  protected static y = 1;
}

class B extends A {
  static getY() {
    return B.y;
  }
}

B.x // 1
B.getY() // 1
```

### 泛型类
类也可以写成泛型，使用类型参数。
```ts
class Box<Type> {
  contents: Type;

  constructor(value:Type) {
    this.contents = value;
  }
}

const b:Box<string> = new Box('hello!');
```
注意，静态成员不能使用泛型的类型参数。
```ts
class Box<Type> {
  static defaultContents: Type; // 报错
}
```

### 抽象类与抽象成员
TypeScript 允许在类的定义前面，加上关键字abstract，表示该类不能被实例化，只能当作其他类的模板。这种类就叫做“抽象类”（abstract class）。
```ts
abstract class A {
  id = 1;
}

const a = new A(); // 报错
```
抽象类只能当作基类使用，用来在它的基础上定义子类。
```ts
abstract class A {
  id = 1;
}

class B extends A {
  amount = 100;
}

const b = new B();

b.id // 1
b.amount // 100
```
抽象类的子类也可以是抽象类，也就是说，抽象类可以继承其他抽象类。
```ts
abstract class A {
  foo:number;
}

abstract class B extends A {
  bar:string;
}
```
抽象类的内部可以有已经实现好的属性和方法，也可以有还未实现的属性和方法。后者就叫做“抽象成员”（abstract member），即属性名和方法名有abstract关键字，表示该方法需要子类实现。如果子类没有实现抽象成员，就会报错。
```ts
abstract class A {
  abstract foo:string;
  bar:string = '';
}

class B extends A {
  foo = 'b';
}
```

几个注意点：
- 抽象成员只能存在于抽象类，不能存在于普通类。
- 抽象成员不能有具体实现的代码。也就是说，已经实现好的成员前面不能加abstract关键字。
- 抽象成员前也不能有private修饰符，否则无法在子类中实现该成员。
- 一个子类最多只能继承一个抽象类。

### this问题
有些场合需要给出this类型，但是 JavaScript 函数通常不带有this参数，这时 TypeScript 允许函数增加一个名为this的参数，放在参数列表的第一位，用来描述函数内部的this关键字的类型。
```ts
// 编译前
function fn(
  this: SomeType,
  x: number
) {
  /* ... */
}

// 编译后
function fn(x) {
  /* ... */
}
```
this参数的类型可以声明为各种对象。
```ts
function foo(
  this: { name: string }
) {
  this.name = 'Jack';
  this.name = 0; // 报错
}

foo.call({ name: 123 }); // 报错
```
在类的内部，this本身也可以当作类型使用，表示当前类的实例对象。
```ts
class Box {
  contents:string = '';

  set(value:string):this {
    this.contents = value;
    return this;
  }
}
```
this类型不允许应用于静态成员。原因是this类型表示实例对象，但是静态成员拿不到实例对象。
```ts
class A {
  static a:this; // 报错
}
```

## 泛型
类型参数的名字，可以随便取，但是必须为合法的标识符。习惯上，类型参数的第一个字符往往采用大写字母。一般会使用T（type 的第一个字母）作为类型参数的名字。如果有多个类型参数，则使用 T 后面的 U、V 等字母命名，各个参数之间使用逗号（“,”）分隔。
```ts
function map<T, U>(
  arr:T[],
  f:(arg:T) => U
):U[] {
  return arr.map(f);
}

// 用法实例
map<string, number>(
  ['1', '2', '3'],
  (n) => parseInt(n)
); // 返回 [1, 2, 3]
```

### 泛型的写法
泛型主要用在四个场合：函数、接口、类和别名。
#### 函数的写法
function关键字定义的泛型函数，类型参数放在尖括号中，写在函数名后面。
```ts
function id<T>(arg:T):T {
  return arg;
}
```
对于变量形式定义的函数，泛型有下面两种写法。
```ts
// 写法一
let myId:<T>(arg:T) => T = id;

// 写法二
let myId:{ <T>(arg:T): T } = id;
```

#### 接口的写法
interface 也可以采用泛型的写法。
```ts
interface Box<Type> {
  contents: Type;
}

let box:Box<string>;
```
泛型接口还有第二种写法。
```ts
interface Fn {
  <Type>(arg:Type): Type;
}

function id<Type>(arg:Type): Type {
  return arg;
}

let myId:Fn = id;
```
第二种写法还有一个差异之处。那就是它的类型参数定义在某个方法之中，其他属性和方法不能使用该类型参数。前面的第一种写法，类型参数定义在整个接口，接口内部的所有属性和方法都可以使用该类型参数。

#### 类的写法
泛型类的类型参数写在类名后面。
```ts
class Pair<K, V> {
  key: K;
  value: V;
}
```
泛型也可以用在类表达式。
```ts
const Container = class<T> {
  constructor(private readonly data:T) {}
};

const a = new Container<boolean>(true);
const b = new Container<number>(0);
```
JavaScript 的类本质上是一个构造函数，因此也可以把泛型类写成构造函数。
```ts
type MyClass<T> = new (...args: any[]) => T;

// 或者
interface MyClass<T> {
  new(...args: any[]): T;
}

// 用法实例
function createInstance<T>(
  AnyClass: MyClass<T>,
  ...args: any[]
):T {
  return new AnyClass(...args);
}
```
泛型类描述的是类的实例，不包括静态属性和静态方法，因为这两者定义在类的本身。因此，它们不能引用类型参数。
```ts
class C<T> {
  static data: T;  // 报错
  constructor(public value:T) {}
}
```

#### 类型别名的写法
type 命令定义的类型别名，也可以使用泛型。
```ts
type Nullable<T> = T | undefined | null;
```

### 类型参数的默认值
一旦类型参数有默认值，就表示它是可选参数。如果有多个类型参数，可选参数必须在必选参数之后。
```ts
<T = boolean, U> // 错误
<T, U = boolean> // 正确
```

### 类型参数的约束条件
类型参数可以同时设置约束条件和默认值，前提是默认值必须满足约束条件。
```ts
type Fn<A extends string, B extends string = 'world'>
  =  [A, B];

type Result = Fn<'hello'> // ["hello", "world"]
```

### 使用注意点
1. 尽量少用泛型：泛型虽然灵活，但是会加大代码的复杂性，使其变得难读难写。一般来说，只要使用了泛型，类型声明通常都不太易读，容易写得很复杂。因此，可以不用泛型就不要用。
2. 类型参数越少越好。
3. 类型参数需要出现两次。
4. 泛型可以嵌套。

## Enum类型
Enum 结构的特别之处在于，它既是一种类型，也是一个值。绝大多数 TypeScript 语法都是类型语法，编译后会全部去除，但是 Enum 结构是一个值，编译后会变成 JavaScript 对象，留在代码中。
```ts
// 编译前
enum Color {
  Red,     // 0
  Green,   // 1
  Blue     // 2
}

// 编译后
let Color = {
  Red: 0,
  Green: 1,
  Blue: 2
};
```
由于 TypeScript 的定位是 JavaScript 语言的类型增强，所以官方建议谨慎使用 Enum 结构，因为它不仅仅是类型，还会为编译后的代码加入一个对象。Enum 结构比较适合的场景是，成员的值不重要，名字更重要，从而增加代码的可读性和可维护性。

由于 Enum 结构编译后是一个对象，所以不能有与它同名的变量（包括对象、函数、类等）。
```ts
enum Color {
  Red,
  Green,
  Blue
}

const Color = 'red'; // 报错
```

### Enum成员的值
Enum 成员默认不必赋值，系统会从零开始逐一递增，按照顺序为每个成员赋值，但是，也可以为 Enum 成员显式赋值。
```ts
enum Color {
  Red,
  Green,
  Blue
}

// 等同于
enum Color {
  Red = 0,
  Green = 1,
  Blue = 2
}
```
成员的值可以是任意数值，但不能是大整数（Bigint）。
```ts
enum Color {
  Red = 90,
  Green = 0.5,
  Blue = 7n // 报错
}
```
成员的值甚至可以相同。如果只设定第一个成员的值，后面成员的值就会从这个值开始递增。
```ts
enum Color {
  Red = 0,
  Green = 0,
  Blue = 0
}

// 或者
enum Color {
  Red = 7,
  Green,  // 8
  Blue   // 9
}

// 或者
enum Color {
  Red, // 0
  Green = 7,
  Blue // 8
}
```

Enum 成员值都是只读的，不能重新赋值。
```ts
enum Color {
  Red,
  Green,
  Blue
}

Color.Red = 4; // 报错
```

### 同名Enum的合并
多个同名的 Enum 结构会自动合并。
```ts
enum Foo {
  A,
}

enum Foo {
  B = 1,
}

enum Foo {
  C = 2,
}

// 等同于
enum Foo {
  A,
  B = 1,
  C = 2
}
```
Enum 结构合并时，只允许其中一个的首成员省略初始值，否则报错。
```ts
enum Foo {
  A,
}

enum Foo {
  B, // 报错
}
```
同名 Enum 合并时，不能有同名成员，否则报错。
```ts
enum Foo {
  A,
  B
}

enum Foo {
  B = 1, // 报错
  C
}
```
同名 Enum 合并的另一个限制是，所有定义必须同为 const 枚举或者非 const 枚举，不允许混合使用。
```ts
// 正确
enum E {
  A,
}
enum E {
  B = 1,
}

// 正确
const enum E {
  A,
}
const enum E {
  B = 1,
}

// 报错
enum E {
  A,
}
const enum E {
  B = 1,
}
```
同名 Enum 的合并，最大用处就是补充外部定义的 Enum 结构。

### 字符串Enum
注意，字符串枚举的所有成员值，都必须显式设置。如果没有设置，成员值默认为数值，且位置必须在字符串成员之前。
```ts
enum Foo {
  A, // 0
  B = 'hello',
  C // 报错
}
```
Enum 成员可以是字符串和数值混合赋值。除了数值和字符串，Enum 成员不允许使用其他值（比如 Symbol 值）。
```ts
enum Enum {
  One = 'One',
  Two = 'Two',
  Three = 3,
  Four = 4,
}
```
变量类型如果是字符串 Enum，就不能再赋值为字符串，这跟数值 Enum 不一样。
```ts
enum MyEnum {
  One = 'One',
  Two = 'Two',
}

let s = MyEnum.One;
s = 'One'; // 报错
```
由于这个原因，如果函数的参数类型是字符串 Enum，传参时就不能直接传入字符串，而要传入 Enum 成员。
```ts
enum MyEnum {
  One = 'One',
  Two = 'Two',
}

function f(arg:MyEnum) {
  return 'arg is ' + arg;
}

f('One') // 报错
```
字符串 Enum 可以使用联合类型（union）代替。函数参数where属于联合类型，效果跟指定为字符串 Enum 是一样的。
```ts
function move(
  where:'Up'|'Down'|'Left'|'Right'
) {
  // ...
 }
```
字符串 Enum 的成员值，不能使用表达式赋值。
```ts
enum MyEnum {
  A = 'one',
  B = ['T', 'w', 'o'].join('') // 报错
}
```

### keyof运算符
keyof 运算符可以取出 Enum 结构的所有成员名，作为联合类型返回。这里的typeof是必需的，否则keyof MyEnum相当于keyof string。
```ts
enum MyEnum {
  A = 'a',
  B = 'b'
}

// 'A'|'B'
type Foo = keyof typeof MyEnum;
```
如果要返回 Enum 所有的成员值，可以使用in运算符。
```ts
enum MyEnum {
  A = 'a',
  B = 'b'
}

// { a: any, b: any }
type Foo = { [key in MyEnum]: any };
```

### 反向映射
数值 Enum 存在反向映射，即可以通过成员值获得成员名。这种情况只发生在数值 Enum，对于字符串 Enum，不存在反向映射。
```ts
enum Weekdays {
  Monday = 1,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
}

console.log(Weekdays[3]) // Wednesday

// 编译后
var Weekdays;
(function (Weekdays) {
    Weekdays[Weekdays["Monday"] = 1] = "Monday";
    Weekdays[Weekdays["Tuesday"] = 2] = "Tuesday";
    Weekdays[Weekdays["Wednesday"] = 3] = "Wednesday";
    Weekdays[Weekdays["Thursday"] = 4] = "Thursday";
    Weekdays[Weekdays["Friday"] = 5] = "Friday";
    Weekdays[Weekdays["Saturday"] = 6] = "Saturday";
    Weekdays[Weekdays["Sunday"] = 7] = "Sunday";
})(Weekdays || (Weekdays = {}));
```
```ts
enum MyEnum {
  A = 'a',
  B = 'b'
}

// 编译后
var MyEnum;
(function (MyEnum) {
    MyEnum["A"] = "a";
    MyEnum["B"] = "b";
})(MyEnum || (MyEnum = {}));
```

## 类型断言
### 类型断言的条件
类型断言的使用前提是，值的实际类型与断言的类型必须满足一个条件。
```ts
expr as T
```
expr是实际的值，T是类型断言，它们必须满足下面的条件：expr是T的子类型，或者T是expr的子类型。也就是说，类型断言要求实际的类型与断言的类型兼容，实际类型可以断言为一个更加宽泛的类型（父类型），也可以断言为一个更加精确的类型（子类型），但不能断言为一个完全无关的类型。

但是，如果真的要断言成一个完全无关的类型，也是可以做到的。那就是连续进行两次类型断言，先断言成 unknown 类型或 any 类型，然后再断言为目标类型。因为any类型和unknown类型是所有其他类型的父类型，所以可以作为两种完全无关的类型的中介。
```ts
// 或者写成 <T><unknown>expr
expr as unknown as T
```

### as const断言
如果没有声明变量类型，let 命令声明的变量，会被类型推断为 TypeScript 内置的基本类型之一；const 命令声明的变量，则被推断为值类型常量。
```ts
// 类型推断为基本类型 string
let s1 = 'JavaScript';

// 类型推断为字符串 “JavaScript”
const s2 = 'JavaScript';
```
as const断言只能用于字面量，不能用于变量。as const也不能用于表达式。
```ts
let s1 = 'JavaScript';
let s2 = s1 as const; // 报错
let s = ('Java' + 'Script') as const; // 报错
```
as const也可以写成前置的形式。
```ts
// 后置形式
expr as const

// 前置形式
<const>expr
```

### 断言函数
断言函数与类型保护函数（type guard）是两种不同的函数。它们的区别是，断言函数不返回值，而类型保护函数总是返回一个布尔值。
```ts
// 断言函数
function isString(value:unknown):asserts value is string {
  if (typeof value !== 'number')
    throw new Error('Not a number');
}

// 类型保护函数
function isString(
  value:unknown
):value is string {
  return typeof value === 'string';
}
```

## namespace
namespace 出现在 ES 模块诞生之前，作为 TypeScript 自己的模块格式而发明的。但是，自从有了 ES 模块，官方已经不推荐使用 namespace 了。
### 基本用法
namespace 用来建立一个容器，内部的所有变量和函数，都必须在这个容器里面使用。
```ts
namespace Utils {
  function isString(value:any) {
    return typeof value === 'string';
  }

  // 正确
  isString('yes');
}

Utils.isString('no'); // 报错
```
如果要在命名空间以外使用内部成员，就必须为该成员加上export前缀，表示对外输出该成员。
```ts
namespace Utility {
  export function log(msg:string) {
    console.log(msg);
  }
  export function error(msg:string) {
    console.error(msg);
  }
}

Utility.log('Call me');
Utility.error('maybe!');
```
namespace 内部还可以使用import命令输入外部成员，相当于为外部成员起别名。当外部成员的名字比较长时，别名能够简化代码。
```ts
namespace Utils {
  export function isString(value:any) {
    return typeof value === 'string';
  }
}

namespace App {
  import isString = Utils.isString;

  isString('yes');
  // 等同于
  Utils.isString('yes');
}
```
import命令也可以在 namespace 外部，指定别名。
```ts
namespace Shapes {
  export namespace Polygons {
    export class Triangle {}
    export class Square {}
  }
}

import polygons = Shapes.Polygons;

// 等同于 new Shapes.Polygons.Square()
let sq = new polygons.Square();
```
namespace 可以嵌套。注意，如果要在外部使用Messaging，必须在它前面加上export命令。使用嵌套的命名空间，必须从最外层开始引用。
```ts
namespace Utils {
  export namespace Messaging {
    export function log(msg:string) {
      console.log(msg);
    }
  }
}

Utils.Messaging.log('hello') // "hello"
```
namespace 不仅可以包含实义代码，还可以包括类型代码。
```ts
namespace N {
  export interface MyInterface{}
  export class MyClass{}
}
```
如果 namespace 代码放在一个单独的文件里，那么引入这个文件需要使用三斜杠的语法。
```ts
/// <reference path = "SomeFileName.ts" />
```

### namespace的输出
namespace 本身也可以使用export命令输出，供其他文件使用。其他脚本文件使用import命令，加载这个命名空间。
```ts
// shapes.ts
export namespace Shapes {
  export class Triangle {
    // ...
  }
  export class Square {
    // ...
  }
}

// 写法一
import { Shapes } from './shapes';
let t = new Shapes.Triangle();

// 写法二
import * as shapes from "./shapes";
let t = new shapes.Shapes.Triangle();
```
更好的方法还是建议使用模块，采用模块的输出和输入。
```ts
// shapes.ts
export class Triangle {
  /* ... */
}
export class Square {
  /* ... */
}

// shapeConsumer.ts
import * as shapes from "./shapes";
let t = new shapes.Triangle();
```

### namespace的合并
多个同名的 namespace 会自动合并，这一点跟 interface 一样。这样做的目的是，如果同名的命名空间分布在不同的文件中，TypeScript 最终会将它们合并在一起。这样就比较方便扩展别人的代码。
```ts
namespace Animals {
  export class Cat {}
}
namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }
  export class Dog {}
}

// 等同于
namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }
  export class Cat {}
  export class Dog {}
}
```
合并命名空间时，命名空间中的非export的成员不会被合并，但是它们只能在各自的命名空间中使用。
```ts
namespace N {
  const a = 0;

  export function foo() {
    console.log(a);  // 正确
  }
}

namespace N {
  export function bar() {
    foo(); // 正确
    console.log(a);  // 报错
  }
}
```
命名空间还可以跟同名函数合并，但是要求同名函数必须在命名空间之前声明。这样做是为了确保先创建出一个函数对象，然后同名的命名空间就相当于给这个函数对象添加额外的属性。
```ts
function f() {
  return f.version;
}

namespace f {
  export const version = '1.0';
}

f()   // '1.0'
f.version // '1.0'
```
命名空间也能与同名 class 合并，同样要求class 必须在命名空间之前声明，原因同上。
```ts
class C {
  foo = 1;
}

namespace C {
  export const bar = 2;
}

C.bar // 2
```
命名空间还能与同名 Enum 合并。注意，Enum 成员与命名空间导出成员不允许同名。
```ts
enum E {
  A,
  B,
  C,
}

namespace E {
  export function foo() {
    console.log(E.C);
  }
}

E.foo() // 2


enum E {
  A, // 报错
  B,
}

namespace E {
  export function A() {} // 报错
}
```

## 装饰器
装饰器（Decorator）是一种语法结构，用来在定义时修改类（class）的行为。在语法上，装饰器有如下几个特征。
- 第一个字符（或者说前缀）是@，后面是一个表达式。
- @后面的表达式，必须是一个函数（或者执行后可以得到一个函数）。
- 这个函数接受所修饰对象的一些相关值作为参数。
- 这个函数要么不返回值，要么返回一个新对象取代所修饰的目标对象。
```ts
@Injectable class A {
  // ...
}
```
装饰器有多种形式，基本上只要在@符号后面添加表达式都是可以的。下面都是合法的装饰器。
```ts
@myFunc
@myFuncFactory(arg1, arg2)

@libraryModule.prop
@someObj.method(123)

@(wrap(dict['prop']))
```
相比使用子类改变父类，装饰器更加简洁优雅，缺点是不那么直观，功能也受到一些限制。所以，装饰器一般只用来为类添加某种特定行为。
```ts
@frozen class Foo {

  @configurable(false)
  @enumerable(true)
  method() {}

  @throttle(500)
  expensiveMethod() {}
}
```

### 装饰器的结构
装饰器函数的类型定义如下：
```ts
type Decorator = (
  value: DecoratedValue,
  context: {
    kind: string;
    name: string | symbol;
    addInitializer?(initializer: () => void): void;
    static?: boolean;
    private?: boolean;
    access: {
      get?(): unknown;
      set?(value: unknown): void;
    };
  }
) => void | ReplacementValue;
```
上面代码中，Decorator是装饰器的类型定义。它是一个函数，使用时会接收到value和context两个参数。
- value：所装饰的对象。
- context：上下文对象，TypeScript 提供一个原生接口ClassMethodDecoratorContext，描述这个对象。

context对象的属性，根据所装饰对象的不同而不同，其中只有两个属性（kind和name）是必有的，其他都是可选的。
1. kind：字符串，表示所装饰对象的类型，可能取以下的值。
  - 'class'
  - 'method'
  - 'getter'
  - 'setter'
  - 'field'
  - 'accessor'

这表示一共有六种类型的装饰器。
2. name：字符串或者 Symbol 值，所装饰对象的名字，比如类名、属性名等。
3. addInitializer()：函数，用来添加类的初始化逻辑。以前，这些逻辑通常放在构造函数里面，对方法进行初始化，现在改成以函数形式传入addInitializer()方法。注意，addInitializer()没有返回值。
4. private：布尔值，表示所装饰的对象是否为类的私有成员。
5. static：布尔值，表示所装饰的对象是否为类的静态成员。
6. access：一个对象，包含了某个值的 get 和 set 方法。

### 类装饰器
类装饰器的类型描述如下。
```ts
type ClassDecorator = (
  value: Function,
  context: {
    kind: 'class';
    name: string | undefined;
    addInitializer(initializer: () => void): void;
  }
) => Function | void;
```
类装饰器接受两个参数：value（当前类本身）和context（上下文对象）。其中，context对象的kind属性固定为字符串class。类装饰器一般用来对类进行操作，可以不返回任何值：
```ts
function Greeter(value, context) {
  if (context.kind === 'class') {
    value.prototype.greet = function () {
      console.log('你好');
    };
  }
}

@Greeter
class User {}

let u = new User();
u.greet(); // "你好"
```
类装饰器可以返回一个函数，替代当前类的构造方法。
```ts
function countInstances(value:any, context:any) {
  let instanceCount = 0;

  const wrapper = function (...args:any[]) {
    instanceCount++;
    const instance = new value(...args);
    instance.count = instanceCount;
    return instance;
  } as unknown as typeof MyClass;

  wrapper.prototype = value.prototype; // A
  return wrapper;
}

@countInstances
class MyClass {}

const inst1 = new MyClass();
inst1 instanceof MyClass // true
inst1.count // 1
```
类装饰器也可以返回一个新的类，替代原来所装饰的类。
```ts
function countInstances(value:any, context:any) {
  let instanceCount = 0;

  return class extends value {
    constructor(...args:any[]) {
      super(...args);
      instanceCount++;
      this.count = instanceCount;
    }
  };
}

@countInstances
class MyClass {}

const inst1 = new MyClass();
inst1 instanceof MyClass // true
inst1.count // 1
```
类装饰器的上下文对象context的addInitializer()方法，用来定义一个类的初始化函数，在类完全定义结束后执行。
```ts
function customElement(name: string) {
  return <Input extends new (...args: any) => any>(
    value: Input,
    context: ClassDecoratorContext
  ) => {
    context.addInitializer(function () {
      customElements.define(name, value);
    });
  };
}

@customElement("hello-world")
class MyComponent extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `<h1>Hello World</h1>`;
  }
}
```

### 方法装饰器
方法装饰器用来装饰类的方法（method）。它的类型描述如下：
```ts
type ClassMethodDecorator = (
  value: Function,
  context: {
    kind: 'method';
    name: string | symbol;
    static: boolean;
    private: boolean;
    access: { get: () => unknown };
    addInitializer(initializer: () => void): void;
  }
) => Function | void;
```
根据上面的类型，方法装饰器是一个函数，接受两个参数：value和context。参数value是方法本身，参数context是上下文对象，有以下属性：
- kind：值固定为字符串method，表示当前为方法装饰器。
- name：所装饰的方法名，类型为字符串或 Symbol 值。
- static：布尔值，表示是否为静态方法。该属性为只读属性。
- private：布尔值，表示是否为私有方法。该属性为只读属性。
- access：对象，包含了方法的存取器，但是只有get()方法用来取值，没有set()方法进行赋值。
- addInitializer()：为方法增加初始化函数。

方法装饰器会改写类的原始方法，实质等同于下面的操作：
```ts
function trace(decoratedMethod) {
  // ...
}

class C {
  @trace
  toString() {
    return 'C';
  }
}

// `@trace` 等同于
// C.prototype.toString = trace(C.prototype.toString);
```
如果方法装饰器返回一个新的函数，就会替代所装饰的原始函数。
```ts
function replaceMethod(value:any, context:ClassMethodDecoratorContext) {
  return function (this:Person) {
    return `How are you, ${this.name}?`;
  }
}

class Person {
  name: string;

  constructor(name:string) {
    this.name = name;
  }

  @replaceMethod
  hello() {
    return `Hi ${this.name}!`;
  }
}

const robin = new Person('Robin');

robin.hello() // 'How are you, Robin?'
```
利用方法装饰器，可以将类的方法变成延迟执行。
```ts
function delay(milliseconds: number = 0) {
  return function (value, context) {
    if (context.kind === "method") {
      return function (...args: any[]) {
        setTimeout(() => {
          value.apply(this, args);
        }, milliseconds);
      };
    }
  };
}

class Logger {
  @delay(1000)
  log(msg: string) {
    console.log(`${msg}`);
  }
}

let logger = new Logger();
logger.log("Hello World");
```
上面示例中，方法装饰器@delay(1000)将方法log()的执行推迟了1秒（1000毫秒）。这里真正的方法装饰器，是delay()执行后返回的函数，delay()的作用是接收参数，用来设置推迟执行的时间。这种通过高阶函数返回装饰器的做法，称为“工厂模式”，即可以像工厂那样生产出一个模子的装饰器。

方法装饰器的参数context对象里面，有一个addInitializer()方法。它是一个钩子方法，用来在类的初始化阶段，添加回调函数。这个回调函数就是作为addInitializer()的参数传入的，它会在构造方法执行期间执行，早于属性（field）的初始化。
```ts
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;

    // greet() 绑定 this
    this.greet = this.greet.bind(this);
  }

  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}

const g = new Person('张三').greet;
g() // "Hello, my name is 张三."
```
我们知道，类的方法往往需要在构造方法里面，进行this的绑定。this的绑定必须放在构造方法里面，因为这必须在类的初始化阶段完成。现在，它可以移到方法装饰器的addInitializer()里面。
```ts
function bound(
  originalMethod:any, context:ClassMethodDecoratorContext
) {
  const methodName = context.name;
  if (context.private) {
    throw new Error(`不能绑定私有方法 ${methodName as string}`);
  }
  context.addInitializer(function () {
    this[methodName] = this[methodName].bind(this);
  });
}
```
### 属性装饰器
属性装饰器用来装饰定义在类顶部的属性（field）。它的类型描述如下。注意，装饰器的第一个参数value的类型是undefined，这意味着这个参数实际上没用的，装饰器不能从value获取所装饰属性的值。另外，第二个参数context对象的kind属性的值为字符串field，而不是“property”或“attribute”，这一点是需要注意的。
```ts
type ClassFieldDecorator = (
  value: undefined,
  context: {
    kind: 'field';
    name: string | symbol;
    static: boolean;
    private: boolean;
    access: { get: () => unknown, set: (value: unknown) => void };
    addInitializer(initializer: () => void): void;
  }
) => (initialValue: unknown) => unknown | void;
```
属性装饰器要么不返回值，要么返回一个函数，该函数会自动执行，用来对所装饰属性进行初始化。该函数的参数是所装饰属性的初始值，该函数的返回值是该属性的最终值。
```ts
function logged(value, context) {
  const { kind, name } = context;
  if (kind === 'field') {
    return function (initialValue) {
      console.log(`initializing ${name} with value ${initialValue}`);
      return initialValue;
    };
  }
}

class Color {
  @logged name = 'green';
}

const color = new Color();
// "initializing name with value green"
```

属性装饰器的返回值函数，可以用来更改属性的初始值。
```ts
function twice() {
  return initialValue => initialValue * 2;
}

class C {
  @twice
  field = 3;
}

const inst = new C();
inst.field // 6
```
属性装饰器的上下文对象context的access属性，提供所装饰属性的存取器。
```ts
let acc;

function exposeAccess(
  value, {access}
) {
  acc = access;
}

class Color {
  @exposeAccess
  name = 'green'
}

const green = new Color();
green.name // 'green'

acc.get(green) // 'green'

acc.set(green, 'red');
green.name // 'red'
```

### getter和setter装饰器
getter 装饰器和 setter 装饰器，是分别针对类的取值器（getter）和存值器（setter）的装饰器。它们的类型描述如下。注意，getter 装饰器的上下文对象context的access属性，只包含get()方法；setter 装饰器的access属性，只包含set()方法。
```ts
type ClassGetterDecorator = (
  value: Function,
  context: {
    kind: 'getter';
    name: string | symbol;
    static: boolean;
    private: boolean;
    access: { get: () => unknown };
    addInitializer(initializer: () => void): void;
  }
) => Function | void;

type ClassSetterDecorator = (
  value: Function,
  context: {
    kind: 'setter';
    name: string | symbol;
    static: boolean;
    private: boolean;
    access: { set: (value: unknown) => void };
    addInitializer(initializer: () => void): void;
  }
) => Function | void;
```
这两个装饰器要么不返回值，要么返回一个函数，取代原来的取值器或存值器。
```ts
class C {
  @lazy
  get value() {
    console.log('正在计算……');
    return '开销大的计算结果';
  }
}

function lazy(
  value:any,
  {kind, name}:any
) {
  if (kind === 'getter') {
    return function (this:any) {
      const result = value.call(this);
      Object.defineProperty(
        this, name,
        {
          value: result,
          writable: false,
        }
      );
      return result;
    };
  }
  return;
}

const inst = new C();
inst.value
// 正在计算……
// '开销大的计算结果'
inst.value
// '开销大的计算结果'
```

### accessor装饰器 
装饰器语法引入了一个新的属性修饰符accessor。accessor修饰符等同于为公开属性x自动生成取值器和存值器，它们作用于私有属性x。（注意，公开的x与私有的x不是同一个属性。）
```ts
class C {
  accessor x = 1;
}

// 等同于
class C {
  #x = 1;

  get x() {
    return this.#x;
  }

  set x(val) {
    this.#x = val;
  }
}
```
accessor也可以与静态属性和私有属性一起使用。
```ts
class C {
  static accessor x = 1;
  accessor #y = 2;
}
```
accessor 装饰器的类型如下。accessor 装饰器的value参数，是一个包含get()方法和set()方法的对象。该装饰器可以不返回值，或者返回一个新的对象，用来取代原来的get()方法和set()方法。此外，装饰器返回的对象还可以包括一个init()方法，用来改变私有属性的初始值。
```ts
type ClassAutoAccessorDecorator = (
  value: {
    get: () => unknown;
    set: (value: unknown) => void;
  },
  context: {
    kind: "accessor";
    name: string | symbol;
    access: { get(): unknown, set(value: unknown): void };
    static: boolean;
    private: boolean;
    addInitializer(initializer: () => void): void;
  }
) => {
  get?: () => unknown;
  set?: (value: unknown) => void;
  init?: (initialValue: unknown) => unknown;
} | void;
```

### 装饰器的执行顺序
装饰器的执行分为两个阶段：
1. 评估（evaluation）：计算@符号后面的表达式的值，得到的应该是函数。
2. 应用（application）：将评估装饰器后得到的函数，应用于所装饰对象。

也就是说，装饰器的执行顺序是，先评估所有装饰器表达式的值，再将其应用于当前类。应用装饰器时，顺序依次为方法装饰器和属性装饰器，然后是类装饰器。

```ts
function d(str:string) {
  console.log(`评估 @d(): ${str}`);
  return (
    value:any, context:any
  ) => console.log(`应用 @d(): ${str}`);
}

function log(str:string) {
  console.log(str);
  return str;
}

@d('类装饰器')
class T {
  @d('静态属性装饰器')
  static staticField = log('静态属性值');

  @d('原型方法')
  [log('计算方法名')]() {}

  @d('实例属性')
  instanceField = log('实例属性值');

  @d('静态方法装饰器')
  static fn(){}
}
```
运行结果如下：
```ts
评估 @d(): 类装饰器
评估 @d(): 静态属性装饰器
评估 @d(): 原型方法
计算方法名
评估 @d(): 实例属性
评估 @d(): 静态方法装饰器
应用 @d(): 静态方法装饰器
应用 @d(): 原型方法
应用 @d(): 静态属性装饰器
应用 @d(): 实例属性
应用 @d(): 类装饰器
静态属性值
```

可以看到，类载入的时候，代码按照以下顺序执行：
1. 装饰器评估：这一步计算装饰器的值，首先是类装饰器，然后是类内部的装饰器，按照它们出现的顺序。

注意，如果属性名或方法名是计算值（本例是“计算方法名”），则它们在对应的装饰器评估之后，也会进行自身的评估。

2. 装饰器应用：实际执行装饰器函数，将它们与对应的方法和属性进行结合。

静态方法装饰器首先应用，然后是原型方法的装饰器和静态属性装饰器，接下来是实例属性装饰器，最后是类装饰器。

注意，“实例属性值”在类初始化的阶段并不执行，直到类实例化时才会执行。

如果一个方法或属性有多个装饰器，则内层的装饰器先执行，外层的装饰器后执行。
```ts
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  @bound
  @log
  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}
```

## 装饰器（旧语法）
本章跳过，如有需要请自行查看[教程](https://wangdoc.com/typescript/decorator-legacy)

## declare关键字
declare 关键字用来告诉编译器，某个类型是存在的，可以在当前文件中使用。

它的主要作用，就是让当前文件可以使用其他文件声明的类型。举例来说，自己的脚本使用外部库定义的函数，编译器会因为不知道外部函数的类型定义而报错，这时就可以在自己的脚本里面使用declare关键字，告诉编译器外部函数的类型。这样的话，编译单个脚本就不会因为使用了外部类型而报错。

declare 关键字可以描述以下类型：
- 变量（const、let、var 命令声明）
- type 或者 interface 命令声明的类型
- class
- enum
- 函数（function）
- 模块（module）
- 命名空间（namespace）

declare 关键字的重要特点是，它只是通知编译器某个类型是存在的，不用给出具体实现。比如，只描述函数的类型，不给出函数的实现，如果不使用declare，这是做不到的。

declare 只能用来描述已经存在的变量和数据结构，不能用来声明新的变量和数据结构。另外，所有 declare 语句都不会出现在编译后的文件里面。

### declare variable
注意，declare 关键字只用来给出类型描述，是纯的类型代码，不允许设置变量的初始值，即不能涉及值。
```ts
// 报错
declare let x:number = 1;
```

### declare function
declare 命令给出了sayHello()的类型描述，表示这个函数是由外部文件定义的，注意，这种单独的函数类型声明语句，只能用于declare命令后面。一方面，TypeScript 不支持单独的函数类型声明语句；另一方面，declare 关键字后面也不能带有函数的具体实现。
```ts
// 报错
function sayHello(
  name:string
):void;

let foo = 'bar';

function sayHello(name:string) {
  return '你好，' + name;
}
```

### declare class
declare 后面不能给出 Class 的具体实现或初始值。
```ts
declare class C {
  // 静态成员
  public static s0():string;
  private static s1:string;

  // 属性
  public a:number;
  private b:number;

  // 构造函数
  constructor(arg:number);

  // 方法
  m(x:number, y:number):number;

  // 存取器
  get c():number;
  set c(value:number);

  // 索引签名
  [index:string]:any;
}
```

### declare module和namespace
如果想把变量、函数、类组织在一起，可以将 declare 与 module 或 namespace 一起使用。
```ts
declare namespace AnimalLib {
  class Animal {
    constructor(name:string);
    eat():void;
    sleep():void;
  }

  type Animals = 'Fish' | 'Dog';
}

// 或者
declare module AnimalLib {
  class Animal {
    constructor(name:string);
    eat(): void;
    sleep(): void;
  }

  type Animals = 'Fish' | 'Dog';
}
```

declare module 和 declare namespace 里面，加不加 export 关键字都可以：
```ts
declare namespace Foo {
  export var a: boolean;
}

declare module 'io' {
  export function readFile(filename:string):string;
}
```

declare 关键字的另一个用途，是为外部模块添加属性和方法时，给出新增部分的类型描述：
```ts
import { Foo as Bar } from 'moduleA';

declare module 'moduleA' {
  interface Foo {
    custom: {
      prop1: string;
    }
  }
}
```

一个项目有多个模块，可以在一个模块中，对另一个模块的接口进行类型扩展。
```ts
// a.ts
export interface A {
  x: number;
}

// b.ts
import { A } from './a';

declare module './a' {
  interface A {
    y: number;
  }
}

const a:A = { x: 0, y: 0 };
```

使用这种语法进行模块的类型扩展时，有三点需要注意：
1. declare module NAME语法里面的模块名NAME，跟 import 和 export 的模块名规则是一样的，且必须跟当前文件加载该模块的语句写法（上例import { A } from './a'）保持一致。
2. 不能创建新的顶层类型。也就是说，只能对a.ts模块中已经存在的类型进行扩展，不允许增加新的顶层类型，比如新定义一个接口B。
3. 不能对默认的default接口进行扩展，只能对 export 命令输出的命名接口进行扩充。这是因为在进行类型扩展时，需要依赖输出的接口名。

declare module 描述的模块名可以使用通配符。
```ts
declare module 'my-plugin-*' {
  interface PluginOptions {
    enabled: boolean;
    priority: number;
  }

  function initialize(options: PluginOptions): void;
  export = initialize;
}
```

### declare global
如果要为 JavaScript 引擎的原生对象添加属性和方法，可以使用declare global {}语法。
```ts
export {};

declare global {
  interface String {
    toSmallString(): string;
  }
}

String.prototype.toSmallString = ():string => {
  // 具体实现
  return '';
};
```
上面示例中，为 JavaScript 原生的String对象添加了toSmallString()方法。declare global 给出这个新增方法的类型描述。这个示例第一行的空导出语句export {}，作用是强制编译器将这个脚本当作模块处理。这是因为declare global必须用在模块里面。

下面的示例是为 window 对象（类型接口为Window）添加一个属性myAppConfig。declare global 只能扩充现有对象的类型描述，不能增加新的顶层类型。
```ts
export {};

declare global {
  interface Window {
    myAppConfig:object;
  }
}

const config = window.myAppConfig;
```

### declare enum
declare 关键字给出 enum 类型描述的例子如下，下面的写法都是允许的。
```ts
declare enum E1 {
  A,
  B,
}

declare enum E2 {
  A = 0,
  B = 1,
}

declare const enum E3 {
  A,
  B,
}

declare const enum E4 {
  A = 0,
  B = 1,
}
```

### declare module 用于类型声明文件
可以为每个模块脚本，定义一个.d.ts文件，把该脚本用到的类型定义都放在这个文件里面。但是，更方便的做法是为整个项目，定义一个大的.d.ts文件，在这个文件里面使用declare module定义每个模块脚本的类型。
```ts
declare module "url" {
  export interface Url {
    protocol?: string;
    hostname?: string;
    pathname?: string;
  }

  export function parse(
    urlStr: string,
    parseQueryString?,
    slashesDenoteHost?
  ): Url;
}

declare module "path" {
  export function normalize(p: string): string;
  export function join(...paths: any[]): string;
  export var sep: string;
}
```
上面示例中，url和path都是单独的模块脚本，但是它们的类型都定义在node.d.ts这个文件里面。

另一种情况是，使用declare module命令，为模块名指定加载路径。
```ts
declare module "lodash" {
  export * from "../../dependencies/lodash";
  export default from "../../dependencies/lodash";
}
```

使用时，自己的脚本使用三斜杠命令，加载这个类型声明文件。如果没有这一行命令，自己的脚本使用外部模块时，就需要在脚本里面使用 declare 命令单独给出外部模块的类型。
```ts
/// <reference path="node.d.ts"/>
```

## d.ts类型声明文件
