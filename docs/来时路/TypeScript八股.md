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
1. declare module NAME语法里面的模块名NAME，跟 import 和 export 的模块名规则是一样的，且必须跟当前文件加载该模块的语句写法（上例`import { A } from './a'`）保持一致。
2. 不能创建新的顶层类型。也就是说，只能对`a.ts`模块中已经存在的类型进行扩展，不允许增加新的顶层类型，比如新定义一个接口B。
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
如果要为 JavaScript 引擎的原生对象添加属性和方法，可以使用`declare global {}`语法。
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
类型声明文件里面只有类型代码，没有具体的代码实现。它的文件名一般为[模块名].d.ts的形式，其中的d表示 declaration（声明）。

类型声明文件也可以包括在项目的 tsconfig.json 文件里面，这样的话，编译器打包项目时，会自动将类型声明文件加入编译，而不必在每个脚本里面加载类型声明文件。比如，moment 模块的类型声明文件是moment.d.ts，使用 moment 模块的项目可以将其加入项目的 tsconfig.json 文件。
```ts
{
  "compilerOptions": {},
  "files": [
    "src/index.ts",
    "typings/moment.d.ts"
  ]
}
```

### 类型声明文件的来源
TypeScript 编译器会自动根据编译目标target的值，加载对应的内置声明文件，所以不需要特别的配置。但是，可以使用编译选项lib，指定加载哪些内置声明文件。
```ts
{
  "compilerOptions": {
    "lib": ["dom", "es2021"]
  }
}
```

### declare关键字
类型声明文件里面，变量的类型描述必须使用declare命令，否则会报错，因为变量声明语句是值相关代码。
```ts
declare let foo:string;
```
interface 类型有没有declare都可以，因为 interface 是完全的类型代码。
```ts
interface Foo {} // 正确
declare interface Foo {} // 正确
```

### 模块发布
当前模块如果包含自己的类型声明文件，可以在 package.json 文件里面添加一个types字段或typings字段，指明类型声明文件的位置。
```ts
{
  "name": "awesome",
  "author": "Vandelay Industries",
  "version": "1.0.0",
  "main": "./lib/main.js",
  "types": "./lib/main.d.ts"
}
```

注意，如果类型声明文件名为index.d.ts，且在项目的根目录中，那就不需要在package.json里面注明了。

### 三斜杠命令
如果类型声明文件的内容非常多，可以拆分成多个文件，然后入口文件使用三斜杠命令，加载其他拆分后的文件。举例来说，入口文件是main.d.ts，里面的接口定义在interfaces.d.ts，函数定义在functions.d.ts。那么，main.d.ts里面可以用三斜杠命令，加载后面两个文件。
```ts
/// <reference path="./interfaces.d.ts" />
/// <reference path="./functions.d.ts" />
```
三斜杠命令（///）是一个 TypeScript 编译器命令，用来指定编译器行为。它只能用在文件的头部，如果用在其他地方，会被当作普通的注释。另外，若一个文件中使用了三斜线命令，那么在三斜线命令之前只允许使用单行注释、多行注释和其他三斜线命令，否则三斜杠命令也会被当作普通的注释。

除了拆分类型声明文件，三斜杠命令也可以用于普通脚本加载类型声明文件。

三斜杠命令主要包含三个参数，代表三种不同的命令：
- path
- types
- lib

#### `/// <reference path="" />`
`/// <reference path="" />`是最常见的三斜杠命令，告诉编译器在编译时需要包括的文件，常用来声明当前脚本依赖的类型文件。
```ts
/// <reference path="./lib.ts" />

let count = add(1, 2);
```
上面示例表示，当前脚本依赖于./lib.ts，里面是add()的定义。编译当前脚本时，还会同时编译./lib.ts。编译产物会有两个 JS 文件，一个当前脚本，另一个就是./lib.js。

编译器会在预处理阶段，找出所有三斜杠引用的文件，将其添加到编译列表中，然后一起编译。path参数指定了所引入文件的路径。如果该路径是一个相对路径，则基于当前脚本的路径进行计算。使用该命令时，有以下两个注意事项：
- path参数必须指向一个存在的文件，若文件不存在会报错。
- path参数不允许指向当前文件。

默认情况下，每个三斜杠命令引入的脚本，都会编译成单独的 JS 文件。如果希望编译后只产出一个合并文件，可以使用编译选项outFile。但是，outFile编译选项不支持合并 CommonJS 模块和 ES 模块，只有当编译参数module的值设为 None、System 或 AMD 时，才能编译成一个文件。

如果打开了编译参数noResolve，则忽略三斜杠指令。将其当作一般的注释，原样保留在编译产物中。

#### `/// <reference types="" />`
types 参数用来告诉编译器当前脚本依赖某个 DefinitelyTyped 类型库，通常安装在node_modules/@types目录。types 参数的值是类型库的名称，也就是安装到node_modules/@types目录中的子目录的名字。
```ts
/// <reference types="node" />
```
上面示例中，这个三斜杠命令表示编译时添加 Node.js 的类型库，实际添加的脚本是node_modules目录里面的@types/node/index.d.ts。

可以看到，这个命令的作用类似于import命令。注意，这个命令只在你自己手写类型声明文件（.d.ts文件）时，才有必要用到，也就是说，只应该用在.d.ts文件中，普通的.ts脚本文件不需要写这个命令。如果是普通的.ts脚本，可以使用tsconfig.json文件的types属性指定依赖的类型库。

#### `/// <reference lib="" />`
`/// <reference lib="..." />`命令允许脚本文件显式包含内置 lib 库，等同于在tsconfig.json文件里面使用lib属性指定 lib 库。

安装 TypeScript 软件包时，会同时安装一些内置的类型声明文件，即内置的 lib 库。这些库文件位于 TypeScript 安装目录的lib文件夹中，它们描述了 JavaScript 语言和引擎的标准 API。库文件并不是固定的，会随着 TypeScript 版本的升级而更新。库文件统一使用“lib.[description].d.ts”的命名方式，而`/// <reference lib="" />`里面的lib属性的值就是库文件名的description部分，比如lib="es2015"就表示加载库文件lib.es2015.d.ts。
```ts
/// <reference lib="es2017.string" />
```
上面示例中，es2017.string对应的库文件就是lib.es2017.string.d.ts。

## 类型运算符
### keyof运算符
keyof 是一个单目运算符，接受一个对象类型作为参数，返回该对象的所有键名组成的联合类型。
```ts
type MyObj = {
  foo: number,
  bar: string,
};
type Keys = keyof MyObj; // 'foo'|'bar'

interface T {
  0: boolean;
  a: string;
  b(): void;
}
type KeyT = keyof T; // 0 | 'a' | 'b'
```
由于 JavaScript 对象的键名只有三种类型，所以对于任意对象的键名的联合类型就是string|number|symbol。
```ts
// string | number | symbol
type KeyT = keyof any;
```
对于没有自定义键名的类型使用 keyof 运算符，返回never类型，表示不可能有这样类型的键名。
```ts
type KeyT = keyof object;  // never
```
由于 keyof 返回的类型是string|number|symbol，如果有些场合只需要其中的一种类型，那么可以采用交叉类型的写法。
```ts
type Capital<T extends string> = Capitalize<T>;

type MyKeys<Obj extends object> = Capital<keyof Obj>; // 报错
type MyKeys<Obj extends object> = Capital<string & keyof Obj>;  // 正确
```
如果对象属性名采用索引形式，keyof 会返回属性名的索引类型。
```ts
// 示例一
interface T {
  [prop: number]: number;
}

// number
type KeyT = keyof T;

// 示例二
interface T {
  [prop: string]: number;
}

// string|number
type KeyT = keyof T;
```
如果 keyof 运算符用于数组或元组类型，得到的结果可能出人意料。keyof 会返回数组的所有键名，包括数字键名和继承的键名。
```ts
type Result = keyof ['a', 'b', 'c'];
// 返回 number | "0" | "1" | "2"
// | "length" | "pop" | "push" | ···
```
对于联合类型，keyof 返回成员共有的键名。
```ts
type A = { a: string; z: boolean };
type B = { b: string; z: boolean };

// 返回 'z'
type KeyT = keyof (A | B);
```
对于交叉类型，keyof 返回所有键名。
```ts
type A = { a: string; x: boolean };
type B = { b: string; y: number };

// 返回 'a' | 'x' | 'b' | 'y'
type KeyT = keyof (A & B);

// 相当于
keyof (A & B) ≡ keyof A | keyof B
```
keyof 取出的是键名组成的联合类型，如果想取出键值组成的联合类型，可以像下面这样写。
```ts
type MyObj = {
  foo: number,
  bar: string,
};

type Keys = keyof MyObj;

type Values = MyObj[Keys]; // number|string
```

#### keyof运算符的用途
keyof 运算符往往用于精确表达对象的属性类型。
```ts
function prop<Obj, K extends keyof Obj>(
  obj:Obj, key:K
):Obj[K] {
  return obj[key];
}
```
keyof 的另一个用途是用于属性映射，即将一个类型的所有属性逐一映射成其他值。
```ts
type NewProps<Obj> = {
  [Prop in keyof Obj]: boolean;
};

// 用法
type MyObj = { foo: number; };

// 等于 { foo: boolean; }
type NewObj = NewProps<MyObj>;
```
下面的例子是去掉 readonly 修饰符。[Prop in keyof Obj]是Obj类型的所有属性名，-readonly表示去除这些属性的只读特性。对应地，还有+readonly的写法，表示添加只读属性设置。
```ts
type Mutable<Obj> = {
  -readonly [Prop in keyof Obj]: Obj[Prop];
};

// 用法
type MyObj = {
  readonly foo: number;
}

// 等于 { foo: number; }
type NewObj = Mutable<MyObj>;
```
下面的例子是让可选属性变成必有的属性。[Prop in keyof Obj]后面的-?表示去除可选属性设置。对应地，还有+?的写法，表示添加可选属性设置。
```ts
type Concrete<Obj> = {
  [Prop in keyof Obj]-?: Obj[Prop];
};

// 用法
type MyObj = {
  foo?: number;
}

// 等于 { foo: number; }
type NewObj = Concrete<MyObj>;
```

### in运算符
in运算符用来确定对象是否包含某个属性名。in运算符的左侧是一个字符串，表示属性名，右侧是一个对象。它的返回值是一个布尔值。
```ts
const obj = { a: 123 };

if ('a' in obj)
  console.log('found a');
```
TypeScript 语言的类型运算中，in运算符有不同的用法，用来取出（遍历）联合类型的每一个成员类型。[Prop in U]表示依次取出联合类型U的每一个成员。
```ts
type U = 'a'|'b'|'c';

type Foo = {
  [Prop in U]: number;
};
// 等同于
type Foo = {
  a: number,
  b: number,
  c: number
};
```

### 方括号运算符
方括号运算符（[]）用于取出对象的键值类型，比如T[K]会返回对象T的属性K的类型。
```ts
type Person = {
  age: number;
  name: string;
  alive: boolean;
};

// Age 的类型是 number
type Age = Person['age'];
```
方括号的参数如果是联合类型，那么返回的也是联合类型。
```ts
type Person = {
  age: number;
  name: string;
  alive: boolean;
};

// number|string
type T = Person['age'|'name'];

// number|string|boolean
type A = Person[keyof Person];
```
如果访问不存在的属性，会报错。
```ts
type T = Person['notExisted']; // 报错
```
方括号运算符的参数也可以是属性名的索引类型。
```ts
type Obj = {
  [key:string]: number,
};

// number
type T = Obj[string];
```
这个语法对于数组也适用，可以使用number作为方括号的参数。
```ts
// MyArray 的类型是 { [key:number]: string }
const MyArray = ['a','b','c'];

// 等同于 (typeof MyArray)[number]
// 返回 string
type Person = typeof MyArray[number];
```
方括号里面不能有值的运算。
```ts
// 示例一
const key = 'age';
type Age = Person[key]; // 报错

// 示例二
type Age = Person['a' + 'g' + 'e']; // 报错
```

### `extends ? :`条件运算符
条件运算符`extends ? :`可以根据当前类型是否符合某种条件，返回不同的类型。
```ts
T extends U ? X : Y
```
上面式子中的extends用来判断，类型T是否可以赋值给类型U，即T是否为U的子类型，这里的T和U可以是任意类型。下面是另一个例子。
```ts
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}

// number
type T1 = Dog extends Animal ? number : string;

// string
type T2 = RegExp extends Animal ? number : string;
```

如果对泛型使用 extends 条件运算，有一个地方需要注意。当泛型的类型参数是一个联合类型时，那么条件运算符会展开这个类型参数，即`T<A|B> = T<A> | T<B>`，所以 extends 对类型参数的每个部分是分别计算的。
```ts
type Cond<T> = T extends U ? X : Y;

type MyType = Cond<A|B>;
// 等同于 Cond<A> | Cond<B>
// 等同于 (A extends U ? X : Y) | (B extends U ? X : Y)
```
如果不希望联合类型被条件运算符展开，可以把extends两侧的操作数都放在方括号里面。
```ts
// 示例一
type ToArray<Type> =
  Type extends any ? Type[] : never;

// 返回结果 string[]|number[]
type T = ToArray<string|number>;

// 示例二
type ToArray<Type> =
  [Type] extends [any] ? Type[] : never;

// 返回结果 (string | number)[]
type T = ToArray<string|number>;
```

条件运算符还可以嵌套使用。
```ts
type LiteralTypeName<T> =
  T extends undefined ? "undefined" :
  T extends null ? "null" :
  T extends boolean ? "boolean" :
  T extends number ? "number" :
  T extends bigint ? "bigint" :
  T extends string ? "string" :
  never;
```

### infer关键字
infer关键字用来定义泛型里面推断出来的类型参数，而不是外部传入的类型参数。它通常跟条件运算符一起使用，用在extends关键字后面的父类型之中。
```ts
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```
上面示例中，infer Item表示Item这个参数是 TypeScript 自己推断出来的，不用显式传入，而`Flatten<Type>`则表示Type这个类型参数是外部传入的。`Type extends Array<infer Item>`则表示，如果参数Type是一个数组，那么就将该数组的成员类型推断为Item，即Item是从Type推断出来的。一旦使用infer Item定义了Item，后面的代码就可以直接调用Item了。下面是上例的泛型`Flatten<Type>`的用法。
```ts
// string
type Str = Flatten<string[]>;

// number
type Num = Flatten<number>;
```
如果不用infer定义类型参数，那么就要传入两个类型参数。
```ts
type Flatten<Type, Item> = Type extends Array<Item> ? Item : Type;
```

### is运算符
函数返回布尔值的时候，可以使用is运算符，限定返回值与参数之间的关系。is运算符用来描述返回值属于true还是false。
```ts
function isFish(
  pet: Fish|Bird
):pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```
is运算符总是用于描述函数的返回值类型，写法采用parameterName is Type的形式，即左侧为当前函数的参数名，右侧为某一种类型。它返回一个布尔值，表示左侧参数是否属于右侧的类型。
```ts
type A = { a: string };
type B = { b: string };

function isTypeA(x: A|B): x is A {
  if ('a' in x) return true;
  return false;
}
```

is运算符可以用于类型保护。
```ts
function isCat(a:any): a is Cat {
  return a.name === 'kitty';
}

let x:Cat|Dog;

if (isCat(x)) {
  x.meow(); // 正确，因为 x 肯定是 Cat 类型
}
```
is运算符还有一种特殊用法，就是用在类（class）的内部，描述类的方法的返回值。
```ts
class Teacher {
  isStudent():this is Student {
    return false;
  }
}

class Student {
  isStudent():this is Student {
    return true;
  }
}
```

### 模版字符串
模板字符串可以引用的类型一共7种，分别是 string、number、bigint、boolean、null、undefined、Enum。引用这7种以外的类型会报错。
```ts
type Num = 123;
type Obj = { n : 123 };

type T1 = `${Num} received`; // 正确
type T2 = `${Obj} received`; // 报错
```
模板字符串里面引用的类型，如果是一个联合类型，那么它返回的也是一个联合类型，即模板字符串可以展开联合类型。
```ts
type T = 'A'|'B';

// "A_id"|"B_id"
type U = `${T}_id`;
```
如果模板字符串引用两个联合类型，它会交叉展开这两个类型。
```ts
type T = 'A'|'B';

type U = '1'|'2';

// 'A1'|'A2'|'B1'|'B2'
type V = `${T}${U}`;
```

### satisfies运算符
satisfies运算符用来检测某个值是否符合指定类型。有时候，不方便将某个值指定为某种类型，但是希望这个值符合类型条件，这时候就可以用satisfies运算符对其进行检测。举例来说，有一个对象的属性名拼写错误。
```ts
type Colors = "red" | "green" | "blue";
type RGB = [number, number, number];

const palette: Record<Colors, string|RGB> = {
  red: [255, 0, 0],
  green: "#00ff00",
  bleu: [0, 0, 255] // 报错
};
```
这样的写法，虽然可以发现属性名的拼写错误，但是带来了新的问题。
```ts
const greenComponent = palette.green.substring(1, 6); // 报错
```
上面示例中，palette.green属性调用substring()方法会报错，原因是这个方法只有字符串才有，而palette.green的类型是string|RGB，除了字符串，还可能是元组RGB，而元组并不存在substring()方法，所以报错了。如果要避免报错，要么精确给出变量palette每个属性的类型，要么对palette.green的值进行类型缩小。两种做法都比较麻烦，也不是很有必要。这时就可以使用satisfies运算符，对palette进行类型检测，但是不改变 TypeScript 对palette的类型推断。
```ts
type Colors = "red" | "green" | "blue";
type RGB = [number, number, number];

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  bleu: [0, 0, 255] // 报错
} satisfies Record<Colors, string|RGB>;

const greenComponent = palette.green.substring(1); // 不报错
```
satisfies也可以检测属性值。
```ts
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0] // 报错
} satisfies Record<Colors, string|RGB>;
```


## 类型映射
映射（mapping）指的是，将一种类型按照映射规则，转换成另一种类型，通常用于对象类型。举例来说，现有一个类型A和另一个类型B。
```ts
type A = {
  foo: number;
  bar: number;
};

type B = {
  foo: string;
  bar: string;
};
```
上面示例中，这两个类型的属性结构是一样的，但是属性的类型不一样。如果属性数量多的话，逐个写起来就很麻烦。使用类型映射，就可以从类型A得到类型B。
```ts
type A = {
  foo: number;
  bar: number;
};

type B = {
  [prop in keyof A]: string;
};
```
下面是复制原始类型的例子。
```ts
type A = {
  foo: number;
  bar: string;
};

type B = {
  [prop in keyof A]: A[prop];
};
```
为了增加代码复用性，可以把常用的映射写成泛型。
```ts
type ToBoolean<Type> = {
  [Property in keyof Type]: boolean;
};
```
通过映射，可以把某个对象的所有属性改成可选属性。
```ts
type A = {
  a: string;
  b: number;
};

type B = {
  [Prop in keyof A]?: A[Prop];
};
```
类型B在类型A的所有属性名后面添加问号，使得这些属性都变成了可选属性。事实上，TypeScript 的内置工具类型`Partial<T>`，就是这样实现的。

TypeScript内置的工具类型`Readonly<T>`可以将所有属性改为只读属性，实现也是通过映射。
```ts
// 将 T 的所有属性改为只读属性
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type T = { a: string; b: number };

type ReadonlyT = Readonly<T>;
// {
//   readonly a: string;
//   readonly b: number;
// }
```

### 映射修饰符
映射会原样复制原始对象的可选属性和只读属性。
```ts
type A = {
  a?: string;
  readonly b: number;
};

type B = {
  [Prop in keyof A]: A[Prop];
};

// 等同于
type B = {
  a?: string;
  readonly b: number;
};
```
如果要删改可选和只读这两个特性，并不是很方便。为了解决这个问题，TypeScript 引入了两个映射修饰符，用来在映射时添加或移除某个属性的?修饰符和readonly修饰符。注意，+?或-?要写在属性名的后面。
- +修饰符：写成+?或+readonly，为映射属性添加?修饰符或readonly修饰符。
- –修饰符：写成-?或-readonly，为映射属性移除?修饰符或readonly修饰符。
```ts
// 添加可选属性
type Optional<Type> = {
  [Prop in keyof Type]+?: Type[Prop];
};

// 移除可选属性
type Concrete<Type> = {
  [Prop in keyof Type]-?: Type[Prop];
};
```
如果同时增删?和readonly这两个修饰符，写成下面这样。
```ts
// 增加
type MyObj<T> = {
  +readonly [P in keyof T]+?: T[P];
};

// 移除
type MyObj<T> = {
  -readonly [P in keyof T]-?: T[P];
}
```
TypeScript 原生的工具类型`Required<T>`专门移除可选属性，就是使用-?修饰符实现的。

注意，–?修饰符移除了可选属性以后，该属性就不能等于undefined了，实际变成必选属性了。但是，这个修饰符不会移除null类型。另外，+?修饰符可以简写成?，+readonly修饰符可以简写成readonly。
```ts
type A<T> = {
  +readonly [P in keyof T]+?: T[P];
};

// 等同于
type A<T> = {
  readonly [P in keyof T]?: T[P];
};
```

### 键名重映射
#### 语法
TypeScript 4.1 引入了键名重映射（key remapping），允许改变键名。
```ts
type A = {
  foo: number;
  bar: number;
};

type B = {
  [p in keyof A as `${p}ID`]: number;
};

// 等同于
type B = {
  fooID: number;
  barID: number;
};
```
可以看到，键名重映射的语法是在键名映射的后面加上as + 新类型子句。这里的“新类型”通常是一个模板字符串，里面可以对原始键名进行各种操作。

看一个例子：
```ts
interface Person {
  name: string;
  age: number;
  location: string;
}

type Getters<T> = {
  [P in keyof T
    as `get${Capitalize<string & P>}`]: () => T[P];
};

type LazyPerson = Getters<Person>;
// 等同于
type LazyPerson = {
  getName: () => string;
  getAge: () => number;
  getLocation: () => string;
}
```
上面示例中，类型LazyPerson是类型Person的映射，并且把键名改掉了。它的修改键名的代码是一个模板字符串`get${Capitalize<string & P>}`，下面是各个部分的解释：
- `get`：为键名添加的前缀。
- `Capitalize<T>`：一个原生的工具泛型，用来将T的首字母变成大写。
- `string & P`：一个交叉类型，其中的P是 keyof 运算符返回的键名联合类型string|number|symbol，但是`Capitalize<T>`只能接受字符串作为类型参数，因此string & P只返回P的字符串属性名。

#### 属性过滤
键名重映射还可以过滤掉某些属性。下面的例子是只保留字符串属性。
```ts
type User = {
  name: string,
  age: number
}

type Filter<T> = {
  [K in keyof T
    as T[K] extends string ? K : never]: string
}

type FilteredUser = Filter<User> // { name: string }
```

#### 联合类型的映射
由于键名重映射可以修改键名类型，所以原始键名的类型不必是string|number|symbol，任意的联合类型都可以用来进行键名重映射。
```ts
type S = {
  kind: 'square',
  x: number,
  y: number,
};

type C = {
  kind: 'circle',
  radius: number,
};

type MyEvents<Events extends { kind: string }> = {
  [E in Events as E['kind']]: (event: E) => void;
}

type Config = MyEvents<S|C>;
// 等同于
type Config = {
  square: (event:S) => void;
  circle: (event:C) => void;
}
```

## 类型工具
### `Awaited<Type>`
`Awaited<Type>`用来取出 Promise 的返回值类型，适合用在描述then()方法和 await 命令的参数类型。
```ts
// string
type A = Awaited<Promise<string>>;
```
它也可以返回多重 Promise 的返回值类型。
```ts
// number
type B = Awaited<Promise<Promise<number>>>;
```
如果它的类型参数不是 Promise 类型，那么就会原样返回。
```ts
// number | boolean
type C = Awaited<boolean | Promise<number>>;
```
#### 实现
`Awaited<Type>`的实现如下。
```ts
type Awaited<T> =
  T extends null | undefined ? T :
  T extends object & {
    then(
      onfulfilled: infer F,
      ...args: infer _
    ): any;
  } ? F extends (
    value: infer V,
    ...args: infer _
  ) => any ? Awaited<V> : never:
  T;
```

### `ConstructorParameters<Type>`
`ConstructorParameters<Type>`提取构造方法Type的参数类型，组成一个元组类型返回。
```ts
type T1 = ConstructorParameters<
  new (x: string, y: number) => object
>; // [x: string, y: number]

type T2 = ConstructorParameters<
  new (x?: string) => object
>; // [x?: string | undefined]
```
它可以返回一些内置构造方法的参数类型。
```ts
type T1 = ConstructorParameters<
  ErrorConstructor
>; // [message?: string]

type T2 = ConstructorParameters<
  FunctionConstructor
>; // string[]

type T3 = ConstructorParameters<
  RegExpConstructor
>; // [pattern:string|RegExp, flags?:string]
```
如果参数类型不是构造方法，就会报错。
```ts
type T1 = ConstructorParameters<string>; // 报错
type T2 = ConstructorParameters<Function>; // 报错
```
any类型和never类型是两个特殊值，分别返回unknown[]和never。
```ts
type T1 = ConstructorParameters<any>;  // unknown[]
type T2 = ConstructorParameters<never>; // never
```

#### 实现
`ConstructorParameters<Type>`的实现如下。
```ts
type ConstructorParameters<
  T extends abstract new (...args: any) => any
> = T extends abstract new (...args: infer P) 
  => any ? P : never
```

### `Exclude<UnionType, ExcludedMembers>`
`Exclude<UnionType, ExcludedMembers>`用来从联合类型UnionType里面，删除某些类型ExcludedMembers，组成一个新的类型返回。
```ts
type T1 = Exclude<'a'|'b'|'c', 'a'>; // 'b'|'c'
type T2 = Exclude<'a'|'b'|'c', 'a'|'b'>; // 'c'
type T3 = Exclude<string|(() => void), Function>; // string
type T4 = Exclude<string | string[], any[]>; // string
type T5 = Exclude<(() => void) | null, Function>; // null
type T6 = Exclude<200 | 400, 200 | 201>; // 400
type T7 = Exclude<number, boolean>; // number
```

#### 实现
`Exclude<UnionType, ExcludedMembers>`的实现如下。
```ts
type Exclude<T, U> = T extends U ? never : T;
```

### `Extract<UnionType, Union>`
`Extract<UnionType, Union>`用来从联合类型UnionType之中，提取指定类型Union，组成一个新类型返回。它与`Exclude<T, U>`正好相反。
```ts
type T1 = Extract<'a'|'b'|'c', 'a'>; // 'a'
type T2 = Extract<'a'|'b'|'c', 'a'|'b'>; // 'a'|'b'
type T3 = Extract<'a'|'b'|'c', 'a'|'d'>; // 'a'
type T4 = Extract<string | string[], any[]>; // string[]
type T5 = Extract<(() => void) | null, Function>; // () => void
type T6 = Extract<200 | 400, 200 | 201>; // 200
```
如果参数类型Union不包含在联合类型UnionType之中，则返回never类型。
```ts
type T = Extract<string|number, boolean>; // never
```

#### 实现
```ts
type Extract<T, U> = T extends U ? T : never;
```

### `InstanceType<Type>`
`InstanceType<Type>`提取构造函数的返回值的类型（即实例类型），参数Type是一个构造函数，等同于构造函数的`ReturnType<Type>`。
```ts
type T = InstanceType<
  new () => object
>; // object
```
由于 Class 作为类型，代表实例类型。要获取它的构造方法，必须把它当成值，然后用typeof运算符获取它的构造方法类型。
```ts
class C {
  x = 0;
  y = 0;
}

type T = InstanceType<typeof C>; // C
```
如果类型参数不是构造方法，就会报错。
```ts
type T1 = InstanceType<string>; // 报错
type T2 = InstanceType<Function>; // 报错
```
如果类型参数是any或never两个特殊值，分别返回any和never。
```ts
type T1 = InstanceType<any>; // any
type T2 = InstanceType<never>; // never
```

#### 实现
```ts
type InstanceType<
  T extends abstract new (...args:any) => any
> = T extends abstract new (...args: any) => infer R ? R :
  any;
```

### `NonNullable<Type>`
`NonNullable<Type>`用来从联合类型Type删除null类型和undefined类型，组成一个新类型返回，也就是返回Type的非空类型版本。
```ts
// string|number
type T1 = NonNullable<string|number|undefined>;

// string[]
type T2 = NonNullable<string[]|null|undefined>;

type T3 = NonNullable<boolean>; // boolean
type T4 = NonNullable<number|null>; // number
type T5 = NonNullable<string|undefined>; // string
type T6 = NonNullable<null|undefined>; // never
```

#### 实现
```ts
type NonNullable<T> = T & {}
```
`T & {}`等同于求`T & Object`的交叉类型。由于 TypeScript 的非空值都属于Object的子类型，所以会返回自身；而null和undefined不属于Object，会返回never类型。

### `Omit<Type, Keys>`
`Omit<Type, Keys>`用来从对象类型Type中，删除指定的属性Keys，组成一个新的对象类型返回。
```ts
interface A {
  x: number;
  y: number;
}

type T1 = Omit<A, 'x'>;       // { y: number }
type T2 = Omit<A, 'y'>;       // { x: number }
type T3 = Omit<A, 'x' | 'y'>; // { }
```
指定删除的键名Keys可以是对象类型Type中不存在的属性，但必须兼容string|number|symbol。
```ts
interface A {
  x: number;
  y: number;
}

type T = Omit<A, 'z'>; // { x: number; y: number }
```

#### 实现
```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

### `OmitThisParameter<Type>`
`OmitThisParameter<Type>`从函数类型中移除 this 参数。
```ts
function toHex(this: number) {
  return this.toString(16);
}

type T = OmitThisParameter<typeof toHex>; // () => string
```
如果函数没有 this 参数，则返回原始函数类型。

#### 实现
```ts
type OmitThisParameter<T> =
  unknown extends ThisParameterType<T> ? T :
  T extends (...args: infer A) => infer R ?
  (...args: A) => R : T;
```

### `Parameters<Type>`
`Parameters<Type>`从函数类型Type里面提取参数类型，组成一个元组返回。
```ts
type T1 = Parameters<() => string>; // []

type T2 = Parameters<(s:string) => void>; // [s:string]

type T3 = Parameters<<T>(arg: T) => T>;    // [arg: unknown]

type T4 = Parameters<
  (x:{ a: number; b: string }) => void
>; // [x: { a: number, b: string }]

type T5 = Parameters<
  (a:number, b:number) => number
>; // [a:number, b:number]
```
如果参数类型Type不是带有参数的函数形式，会报错。
```ts
// 报错
type T1 = Parameters<string>;
// 报错
type T2 = Parameters<Function>;
```
由于any和never是两个特殊值，会返回unknown[]和never。
```ts
type T1 = Parameters<any>; // unknown[]
type T2 = Parameters<never>; // never
```
`Parameters<Type>`主要用于从外部模块提供的函数类型中，获取参数类型。
```ts
interface SecretName {
  first: string;
  last: string;
}

interface SecretSanta {
  name: SecretName;
  gift: string;
}

export function getGift(
  name: SecretName,
  gift: string
): SecretSanta {
 // ...
}
```
上面示例中，模块只输出了函数getGift()，没有输出参数SecretName和返回值SecretSanta。这时就可以通过`Parameters<T>`和`ReturnType<T>`拿到这两个接口类型。
```ts
type ParaT = Parameters<typeof getGift>[0]; // SecretName
type ReturnT = ReturnType<typeof getGift>; // SecretSanta
```

#### 实现
```ts
type Parameters<T extends (...args: any) => any> = 
  T extends (...args: infer P)
  => any ? P : never
```

### `Partial<Type>`
`Partial<Type>`返回一个新类型，将参数类型Type的所有属性变为可选属性。
```ts
interface A {
  x: number;
  y: number;
}
 
type T = Partial<A>; // { x?: number; y?: number; }
```

#### 实现
```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

### `Pick<Type, Keys>`
`Pick<Type, Keys>`返回一个新的对象类型，第一个参数Type是一个对象类型，第二个参数Keys是Type里面被选定的键名。
```ts
interface A {
  x: number;
  y: number;
}

type T1 = Pick<A, 'x'>; // { x: number }
type T2 = Pick<A, 'y'>; // { y: number }
type T3 = Pick<A, 'x'|'y'>;  // { x: number; y: number }
```
指定的键名Keys必须是对象类型Type里面已经存在的键名，否则会报错。
```ts
interface A {
  x: number;
  y: number;
}

type T = Pick<A, 'z'>; // 报错
```

#### 实现
```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

### `Readonly<Type>`
`Readonly<Type>`返回一个新类型，将参数类型Type的所有属性变为只读属性。
```ts
interface A {
  x: number;
  y?: number;
}

// { readonly x: number; readonly y?: number; }
type T = Readonly<A>;
```

#### 实现
```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```
可以自定义类型工具`Mutable<Type>`，将参数类型的所有属性变成可变属性。
```ts
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
```
-readonly表示去除属性的只读标志。相应地，+readonly就表示增加只读标志，等同于readonly。因此，`Readonly<Type>`的实现也可以写成下面这样。
```ts
type Readonly<T> = {
  +readonly [P in keyof T]: T[P];
};
```
`Readonly<Type>`可以与`Partial<Type>`结合使用，将所有属性变成只读的可选属性。
```ts
interface Person {
  name: string;
  age: number;
}

const worker: Readonly<Partial<Person>>
  = { name: '张三' };

worker.name = '李四'; // 报错
```

### `Record<Keys, Type>`
`Record<Keys, Type>`返回一个对象类型，参数Keys用作键名，参数Type用作键值类型。
```ts
// { a: number }
type T = Record<'a', number>;
```
参数Keys可以是联合类型，这时会依次展开为多个键。
```ts
// { a: number, b: number }
type T = Record<'a'|'b', number>;
```
如果参数Type是联合类型，就表明键值是联合类型。
```ts
// { a: number|string }
type T = Record<'a', number|string>;
```
参数Keys的类型必须兼容string|number|symbol，否则不能用作键名，会报错。

#### 实现
```ts
type Record<K extends string|number|symbol, T>
  = { [P in K]: T; }
```

### `Required<Type>`
`Required<Type>`返回一个新类型，将参数类型Type的所有属性变为必选属性。它与`Partial<Type>`的作用正好相反。
```ts
interface A {
  x?: number;
  y: number;
}

type T = Required<A>; // { x: number; y: number; }
```

#### 实现
```ts
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```
上面代码中，符号-?表示去除可选属性的“问号”，使其变成必选属性。相对应地，符号+?表示增加可选属性的“问号”，等同于?。因此，前面的`Partial<Type>`的定义也可以写成下面这样。
```ts
type Partial<T> = {
  [P in keyof T]+?: T[P];
};
```

### `ReadonlyArray<Type>`
`ReadonlyArray<Type>`用来生成一个只读数组类型，类型参数Type表示数组成员的类型。
```ts
const values: ReadonlyArray<string> 
  = ['a', 'b', 'c'];

values[0] = 'x'; // 报错
values.push('x'); // 报错
values.pop(); // 报错
values.splice(1, 1); // 报错
```

#### 实现
```ts
interface ReadonlyArray<T> {
  readonly length: number;

  readonly [n: number]: T;

  // ...
}
```

### `ReturnType<Type>`
`ReturnType<Type>`提取函数类型Type的返回值类型，作为一个新类型返回。
```ts
ype T1 = ReturnType<() => string>; // string

type T2 = ReturnType<() => {
  a: string; b: number
}>; // { a: string; b: number }

type T3 = ReturnType<(s:string) => void>; // void

type T4 = ReturnType<() => () => any[]>; // () => any[]

type T5 = ReturnType<typeof Math.random>; // number

type T6 = ReturnType<typeof Array.isArray>; // boolean
```
如果参数类型是泛型函数，返回值取决于泛型类型。如果泛型不带有限制条件，就会返回unknown。
```ts
type T1 = ReturnType<<T>() => T>; // unknown

type T2 = ReturnType<
  <T extends U, U extends number[]>() => T
>; // number[]
```
如果类型不是函数，会报错。
```ts
type T1 = ReturnType<boolean>; // 报错
type T2 = ReturnType<Function>; // 报错
```
any和never是两个特殊值，分别返回any和never。
```ts
type T1 = ReturnType<any>; // any
type T2 = ReturnType<never>; // never
```

#### 实现
```ts
type ReturnType<
  T extends (...args: any) => any
> =
  T extends (...args: any) => infer R ? R : any;
```

### `ThisParameterType<Type>`
`ThisParameterType<Type>`提取函数类型中this参数的类型。
```ts
function toHex(this:number) {
  return this.toString(16);
}

type T = ThisParameterType<typeof toHex>; // number
```
如果函数没有this参数，则返回unknown。

#### 实现
```ts
type ThisParameterType<T> =
  T extends (
    this: infer U,
    ...args: never
  ) => any ? U : unknown;
```

### `ThisType<Type>`
`ThisType<Type>`不返回类型，只用来跟其他类型组成交叉类型，用来提示 TypeScript 其他类型里面的this的类型。
```ts
interface HelperThisValue {
  logError: (error:string) => void;
}

let helperFunctions:
  { [name: string]: Function } &
  ThisType<HelperThisValue>
= {
  hello: function() {
    this.logError("Error: Something wrong!"); // 正确
    this.update(); // 报错
  }
}
```
这里的ThisType的作用是提示 TypeScript，变量helperFunctions的this应该满足HelperThisValue的条件。所以，this.logError()可以正确调用，而this.update()会报错，因为HelperThisValue里面没有这个方法。

注意，使用这个类型工具时，必须打开noImplicitThis设置。

#### 实现
`ThisType<Type>`的实现就是一个空接口。
```ts
interface ThisType<T> { }
```

### 字符串类型工具
#### `Uppercase<StringType>`
`Uppercase<StringType>`将字符串类型的每个字符转为大写。
```ts
type A = 'hello';

// "HELLO"
type B = Uppercase<A>;
```

#### `Lowercase<StringType>`
`Lowercase<StringType>`将字符串类型的每个字符转为小写。
```ts
type A = 'HELLO';

// "hello"
type B = Lowercase<A>;
```

#### `Capitalize<StringType>`
`Capitalize<StringType>`将字符串的第一个字符转为大写。
```ts
type A = 'hello';

// "Hello"
type B = Capitalize<A>;
```

#### `Uncapitalize<StringType>`
`Uncapitalize<StringType>`将字符串的第一个字符转为小写。
```ts
type A = 'HELLO';

// "hELLO"
type B = Uncapitalize<A>;
```

## 注释指令
### // @ts-nocheck
`// @ts-nocheck`告诉编译器不对当前脚本进行类型检查，可以用于 TypeScript 脚本，也可以用于 JavaScript 脚本。
```ts
// @ts-nocheck

const element = document.getElementById(123);
```
上面示例中，document.getElementById(123)存在类型错误，但是编译器不对该脚本进行类型检查，所以不会报错。

### // @ts-check
如果一个 JavaScript 脚本顶部添加了`// @ts-check`，那么编译器将对该脚本进行类型检查，不论是否启用了checkJs编译选项。
```ts
// @ts-check
let isChecked = true;

console.log(isChceked); // 报错
```
上面示例是一个 JavaScript 脚本，// @ts-check告诉 TypeScript 编译器对其进行类型检查，所以最后一行会报错，提示拼写错误。

### // @ts-ignore
`// @ts-ignore`告诉编译器不对下一行代码进行类型检查，可以用于 TypeScript 脚本，也可以用于 JavaScript 脚本。
```ts
let x:number;

x = 0;

// @ts-ignore
x = false; // 不报错
```
上面示例中，最后一行是类型错误，变量x的类型是number，不能等于布尔值。但是因为前面加上了// @ts-ignore，编译器会跳过这一行的类型检查，所以不会报错。

### // @ts-expect-error
`// @ts-expect-error`主要用在测试用例，当下一行有类型错误时，它会压制 TypeScript 的报错信息（即不显示报错信息），把错误留给代码自己处理。
```ts
function doStuff(abc: string, xyz: string) {
  assert(typeof abc === "string");
  assert(typeof xyz === "string");
  // do some stuff
}

expect(() => {
  // @ts-expect-error
  doStuff(123, 456);
}).toThrow();
```
上面示例是一个测试用例，倒数第二行的doStuff(123, 456)的参数类型与定义不一致，TypeScript 引擎会报错。但是，测试用例本身测试的就是这个错误，已经有专门的处理代码，所以这里可以使用`// @ts-expect-error`，不显示引擎的报错信息。

如果下一行没有类型错误，`// @ts-expect-error`则会显示一行提示。
```ts
// @ts-expect-error
console.log(1 + 1);
// 输出 Unused '@ts-expect-error' directive.
```
上面示例中，第二行是正确代码，这时系统会给出一个提示，表示@ts-expect-error没有用到。

### JSDoc
TypeScript 直接处理 JS 文件时，如果无法推断出类型，会使用 JS 脚本里面的 JSDoc 注释。使用 JSDoc 时，有两个基本要求：
- JSDoc 注释必须以`/**`开始，其中星号（*）的数量必须为两个。若使用其他形式的多行注释，则 JSDoc 会忽略该条注释。
- JSDoc 注释必须与它描述的代码处于相邻的位置，并且注释在上，代码在下。
```ts
/**
 * @param {string} somebody
 */
function sayHello(somebody) {
  console.log('Hello ' + somebody);
}
```
上面示例中，注释里面的@param是一个 JSDoc 声明，表示下面的函数sayHello()的参数somebody类型为string。

#### @typeof
`@typedef`命令创建自定义类型，等同于 TypeScript 里面的类型别名。
```ts
/**
 * @typedef {(number | string)} NumberLike
 */
```
上面示例中，定义了一个名为NumberLike的新类型，它是由number和string构成的联合类型，等同于 TypeScript 的如下语句。
```ts
type NumberLike = string | number;
```

#### @type
`@type`命令定义变量的类型。
```ts
/**
 * @type {string}
 */
let a;
```
上面示例中，@type定义了变量a的类型为string。

在`@type`命令中可以使用由`@typedef`命令创建的类型。
```ts
/**
 * @typedef {(number | string)} NumberLike
 */

/**
 * @type {NumberLike}
 */
let a = 0;
```
在`@type`命令中允许使用 TypeScript 类型及其语法。
```ts
/**@type {true | false} */
let a;

/** @type {number[]} */
let b;

/** @type {Array<number>} */
let c;

/** @type {{ readonly x: number, y?: string }} */
let d;

/** @type {(s: string, b: boolean) => number} */
let e;
```

#### @param
`@param`命令用于定义函数参数的类型。
```ts
/**
 * @param {string}  x
 */
function foo(x) {}
```
如果是可选参数，需要将参数名放在方括号[]里面。
```ts
/**
 * @param {string}  [x]
 */
function foo(x) {}
```
方括号里面，还可以指定参数默认值。
```ts
/**
 * @param {string} [x="bar"]
 */
function foo(x) {}
```

#### @return，@returns 
`@return`和`@returns`命令的作用相同，指定函数返回值的类型。
```ts
/**
 * @return {boolean}
 */
function foo() {
  return true;
}

/**
 * @returns {number}
 */
function bar() {
  return 0;
}
```

#### @extends和类型修饰符
`@extends`命令用于定义继承的基类。
```ts
/**
 * @extends {Base}
 */
class Derived extends Base {
}
```
`@public`、`@protected`、`@private`分别指定类的公开成员、保护成员和私有成员。`@readonly`指定只读成员。
```ts
class Base {
  /**
   * @public
   * @readonly
   */
  x = 0;

  /**
   *  @protected
   */
  y = 0;
}
```

## tsconfig.json
tsconfig.json是 TypeScript 项目的配置文件，放在项目的根目录。反过来说，如果一个目录里面有tsconfig.json，TypeScript 就认为这是项目的根目录。

如果项目源码是 JavaScript，但是想用 TypeScript 处理，那么配置文件的名字是jsconfig.json，它跟tsconfig的写法是一样的。

tsconfig.json文件主要供tsc编译器使用，它的命令行参数--project或-p可以指定tsconfig.json的位置（目录或文件皆可）。
```bash
$ tsc -p ./dir
```

如果不指定配置文件的位置，tsc就会在当前目录下搜索tsconfig.json文件，如果不存在，就到上一级目录搜索，直到找到为止。

tsconfig.json文件的格式，是一个 JSON 对象，最简单的情况可以只放置一个空对象{}。下面是一个示例。
```json
{
  "compilerOptions": {
    "outDir": "./built",
    "allowJs": true,
    "target": "es5"
  },
  "include": ["./src/**/*"]
}
```
上面示例的四个属性的含义：
- include：指定哪些文件需要编译。
- allowJs：指定源目录的 JavaScript 文件是否原样拷贝到编译后的目录。
- outDir：指定编译产物存放的目录。
- target：指定编译产物的 JS 版本。

tsconfig.json文件可以不必手写，使用 tsc 命令的--init参数自动生成。
```bash
$ tsc --init
```
上面命令生成的tsconfig.json文件，里面会有一些默认配置。

也可以使用别人预先写好的 tsconfig.json 文件，npm 的@tsconfig名称空间下面有很多模块，都是写好的tsconfig.json样本，比如 @tsconfig/recommended和@tsconfig/node16。

这些模块需要安装，以@tsconfig/deno为例。
```bash
$ npm install --save-dev @tsconfig/deno
# 或者
$ yarn add --dev @tsconfig/deno
```
安装以后，就可以在tsconfig.json里面引用这个模块，相当于继承它的设置，然后进行扩展。
```ts
{
  "extends": "@tsconfig/deno/tsconfig.json"
}
```
tsconfig.json的一级属性并不多，只有很少几个，但是compilerOptions属性有很多二级属性。详细不在此介绍。

### exclude
exclude属性是一个数组，必须与include属性一起使用，用来从编译列表中去除指定的文件。它也支持使用与include属性相同的通配符。
```json
{
  "include": ["**/*"],
  "exclude": ["**/*.spec.ts"]
}
```

### extends
tsconfig.json可以继承另一个tsconfig.json文件的配置。如果一个项目有多个配置，可以把共同的配置写成tsconfig.base.json，其他的配置文件继承该文件，这样便于维护和修改。

extends属性用来指定所要继承的配置文件。它可以是本地文件。
```json
{
  "extends": "../tsconfig.base.json"
}
```
果extends属性指定的路径不是以./或../开头，那么编译器将在node_modules目录下查找指定的配置文件。

extends属性也可以继承已发布的 npm 模块里面的 tsconfig 文件。
```json
{
  "extends": "@tsconfig/node12/tsconfig.json"
}
```
extends指定的tsconfig.json会先加载，然后加载当前的tsconfig.json。如果两者有重名的属性，后者会覆盖前者。

### files
files属性指定编译的文件列表，如果其中有一个文件不存在，就会报错。它是一个数组，排在前面的文件先编译。
```json
{
  "files": ["a.ts", "b.ts"]
}
```

### include
include属性指定所要编译的文件列表，既支持逐一列出文件，也支持通配符。文件位置相对于当前配置文件而定。
```json
{
  "include": ["src/**/*.ts", "test/**/*.ts"]
}
```
include属性支持三种通配符：
- ?：指代单个字符
- *：指代任意字符，不含路径分隔符
- **：指定任意目录层级。

如果不指定文件后缀名，默认包括.ts、.tsx和.d.ts文件。如果打开了allowJs，那么还包括.js和.jsx。

### references
references属性是一个数组，数组成员为对象，适合一个大项目由许多小项目构成的情况，用来设置需要引用的底层项目。
```json
{
  "references": [
    { "path": "../core" },
    { "path": "../utils" }
  ]
}
```
references数组成员对象的path属性，既可以是含有文件tsconfig.json的目录，也可以直接是该文件。

与此同时，引用的底层项目的tsconfig.json必须启用composite属性。
```json
{
  "compilerOptions": {
    "composite": true
  }
}
```

### compilerOptions
compilerOptions属性用来定制编译行为。这个属性可以省略，这时编译器将使用默认设置。

## tsc命令
tsc 是 TypeScript 官方的命令行编译器，用来检查代码，并将其编译成 JavaScript 代码。

tsc 默认使用当前目录下的配置文件tsconfig.json，但也可以接受独立的命令行参数。命令行参数会覆盖tsconfig.json，比如命令行指定了所要编译的文件，那么 tsc 就会忽略tsconfig.json的files属性。

tsc 的基本用法如下：
```bash
# 使用 tsconfig.json 的配置
$ tsc

# 只编译 index.ts
$ tsc index.ts

# 编译 src 目录的所有 .ts 文件
$ tsc src/*.ts

# 指定编译配置文件
$ tsc --project tsconfig.production.json

# 只生成类型声明文件，不编译出 JS 文件
$ tsc index.js --declaration --emitDeclarationOnly

# 多个 TS 文件编译成单个 JS 文件
$ tsc app.ts util.ts --target esnext --outfile index.js
```