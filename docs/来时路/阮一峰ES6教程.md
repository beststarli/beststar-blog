---
title: 阮一峰ES6教程
description: 对阮一峰ES6教程进行整理，补全整个JavaScript知识体系。
sidebar_position: 18
date: 2026-07-24
---

# [阮一峰ES6教程](https://wangdoc.com/es6/)
## let和const命令
### let命令
#### 暂时性死区
只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。ES6 明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。

ES6 规定暂时性死区和let、const语句不出现变量提升，主要是为了减少运行时错误，防止在变量声明前就使用这个变量，从而导致意料之外的行为。这样的错误在 ES5 是很常见的，现在有了这种规定，避免此类错误就很容易了。

总之，暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。

### 块级作用域
#### 为什么需要块级作用域
- 第一种场景，内层变量可能会覆盖外层变量。
- 第二种场景，用来计数的循环变量泄露为全局变量。
#### ES6 的块级作用域
块级作用域的出现，实际上使得获得广泛应用的匿名立即执行函数表达式（匿名 IIFE）不再必要了。
```js
// IIFE 写法
(function () {
  var tmp = ...;
  ...
}());

// 块级作用域写法
{
  let tmp = ...;
  ...
}
```

### const命令
#### 本质
const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。因此，将一个对象声明为常量必须非常小心。
```js
const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123

// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only
```
如果真的想将对象冻结，应该使用Object.freeze方法。
```js
const foo = Object.freeze({});

// 常规模式时，下面一行不起作用；
// 严格模式时，该行会报错
foo.prop = 123;
```
除了将对象本身冻结，对象的属性也应该冻结。下面是一个将对象彻底冻结的函数。
```js
var constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach( (key, i) => {
    if ( typeof obj[key] === 'object' ) {
      constantize( obj[key] );
    }
  });
};
```

### 顶层对象的属性
顶层对象，在浏览器环境指的是window对象，在 Node 指的是global对象。ES5 之中，顶层对象的属性与全局变量是等价的。ES6 为了改变这一点，一方面规定，为了保持兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。也就是说，从 ES6 开始，全局变量将逐步与顶层对象的属性脱钩。
```js
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined
```

### globalThis对象
JavaScript 语言存在一个顶层对象，它提供全局环境（即全局作用域），所有代码都是在这个环境中运行。但是，顶层对象在各种实现里面是不统一的。
- 浏览器里面，顶层对象是window，但 Node 和 Web Worker 没有window。
- 浏览器和 Web Worker 里面，self也指向顶层对象，但是 Node 没有self。
- Node 里面，顶层对象是global，但其他环境都不支持。

同一段代码为了能够在各种环境，都能取到顶层对象，现在一般是使用this关键字，但是有局限性。
- 全局环境中，this会返回顶层对象。但是，Node.js 模块中this返回的是当前模块，ES6 模块中this返回的是undefined。
- 函数里面的this，如果函数不是作为对象的方法运行，而是单纯作为函数运行，this会指向顶层对象。但是，严格模式下，这时this会返回undefined。
- 不管是严格模式，还是普通模式，new Function('return this')()，总是会返回全局对象。但是，如果浏览器用了 CSP（Content Security Policy，内容安全策略），那么eval、new Function这些方法都可能无法使用。

很难找到一种方法，可以在所有情况下，都取到顶层对象。下面是两种勉强可以使用的方法。
```js
// 方法一
(typeof window !== 'undefined'
   ? window
   : (typeof process === 'object' &&
      typeof require === 'function' &&
      typeof global === 'object')
     ? global
     : this);

// 方法二
var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
```

ES2020 在语言标准的层面，引入globalThis作为顶层对象。也就是说，任何环境下，globalThis都是存在的，都可以从它拿到顶层对象，指向全局环境下的this。

## 变量的解构赋值
解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错。
### 用途
#### 交换变量的值
```js
[x, y] = [y, x];
```

#### 从函数返回多个值
```js
// 返回一个数组

function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象

function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();
```

#### 函数参数的定义
解构赋值可以方便地将一组参数与变量名对应起来。
```js
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});
```

#### 提取 JSON 数据
解构赋值对提取 JSON 对象中的数据，尤其有用。
```js
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]
```

#### 函数参数的默认值
```js
function move({x = 0, y = 0} = {}) {
  return [x, y];
}
move({x: 3, y: 8}) // [3, 8]  
```

#### 遍历 Map 结构
任何部署了 Iterator 接口的对象，都可以用for...of循环遍历。Map 结构原生支持 Iterator 接口，配合变量的解构赋值，获取键名和键值就非常方便。
```js
const map = new Map();
map.set('first', 'hello');
for (let [key, value] of map) {
  console.log(key + " is " + value);
}
// first is hello

// 获取键名
for (let [key] of map) {
  // ...
}

// 获取键值
for (let [,value] of map) {
  // ...
}
```

#### 输入模块的指定方法
加载模块时，往往需要指定输入哪些方法。解构赋值使得输入语句非常清晰。
```js
const { SourceMapConsumer, SourceNode } = require("source-map");
```

## 字符串的新增方法
### String.fromCodePoint()
ES6 提供了String.fromCodePoint()方法，可以识别大于0xFFFF的字符，弥补了String.fromCharCode()方法的不足。在作用上，正好与下面的codePointAt()方法相反。
```js
String.fromCodePoint(0x20BB7)
// "𠮷"
String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y'
// true
```
如果String.fromCodePoint方法有多个参数，则它们会被合并成一个字符串返回。

注意，fromCodePoint方法定义在String对象上，而codePointAt方法定义在字符串的实例对象上。

### String.raw() 
ES6 还为原生的 String 对象，提供了一个raw()方法。该方法返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串，往往用于模板字符串的处理方法。

### 实例方法：codePointAt()
ES6 提供了codePointAt()方法，能够正确处理 4 个字节储存的字符，返回一个字符的码点。codePointAt()方法的参数，是字符在字符串中的位置（从 0 开始）。

### 实例方法：includes(), startsWith(), endsWith()
传统上，JavaScript 只有indexOf方法，可以用来确定一个字符串是否包含在另一个字符串中。ES6 又提供了三种新方法。
- includes()：返回布尔值，表示是否找到了参数字符串。
- startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
- endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。

这三个方法都支持第二个参数，表示开始搜索的位置。

### 实例方法：repeat() 
repeat方法返回一个新字符串，表示将原字符串重复n次。参数如果是小数，会被取整。但是，如果参数是 0 到-1 之间的小数，则等同于 0，这是因为会先进行取整运算。参数NaN等同于 0。如果repeat的参数是字符串，则会先转换成数字。

### 实例方法：padStart()，padEnd()
padStart()用于头部补全，padEnd()用于尾部补全。
```js
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'

'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'
```
如果原字符串的长度，等于或大于最大长度，则字符串补全不生效，返回原字符串。如果用来补全的字符串与原字符串，两者的长度之和超过了最大长度，则会截去超出位数的补全字符串。如果省略第二个参数，默认使用空格补全长度。
```js
'xxx'.padStart(2, 'ab') // 'xxx'
'xxx'.padEnd(2, 'ab') // 'xxx'

'abc'.padStart(10, '0123456789')
// '0123456abc'

'x'.padStart(4) // '   x'
'x'.padEnd(4) // 'x   '
```

### 实例方法：trimStart()，trimEnd()
trimStart()消除字符串头部的空格，trimEnd()消除尾部的空格。它们返回的都是新字符串，不会修改原始字符串。除了空格键，这两个方法对字符串头部（或尾部）的 tab 键、换行符等不可见的空白符号也有效。

### 实例方法：matchAll()
matchAll()方法返回一个正则表达式在当前字符串的所有匹。

### 实例方法：replaceAll()
replaceAll()方法，可以一次性替换所有匹配。它的用法与replace()相同，返回一个新字符串，不会改变原字符串。

### 实例方法：at()
at()方法接受一个整数作为参数，返回参数指定位置的字符，支持负索引（即倒数的位置）。如果参数位置超出了字符串范围，at()返回undefined。

## 数值的扩展
### Number.isFinite()与Number.isNaN()
- Number.isFinite()用来检查一个数值是否为有限的（finite），即不是Infinity。如果参数类型不是数值，Number.isFinite一律返回false。
- Number.isNaN()用来检查一个值是否为NaN。如果参数类型不是NaN，Number.isNaN一律返回false。

它们与传统的全局方法isFinite()和isNaN()的区别在于，传统方法先调用Number()将非数值的值转为数值，再进行判断，而这两个新方法只对数值有效，Number.isFinite()对于非数值一律返回false, Number.isNaN()只有对于NaN才返回true，非NaN一律返回false。

### Number.parseInt()与Number.parseFloat()
ES6 将全局方法parseInt()和parseFloat()，移植到Number对象上面，行为完全保持不变。这样做的目的，是逐步减少全局性方法，使得语言逐步模块化。
```js
// ES5的写法
parseInt('12.34') // 12
parseFloat('123.45#') // 123.45

// ES6的写法
Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45

Number.parseInt === parseInt // true
Number.parseFloat === parseFloat // true
```

### Number.isInteger()
Number.isInteger()用来判断一个数值是否为整数。如果参数不是数值，Number.isInteger返回false。如果对数据精度的要求较高，不建议使用Number.isInteger()判断一个数值是否为整数。

### Number.EPSILON
ES6 在Number对象上面，新增一个极小的常量Number.EPSILON。根据规格，它表示 1 与大于 1 的最小浮点数之间的差。Number.EPSILON实际上是 JavaScript 能够表示的最小精度。误差如果小于这个值，就可以认为已经没有意义了，即不存在误差了。因此，Number.EPSILON的实质是一个可以接受的最小误差范围。

### Math对象的扩展
#### Math.trunc()
Math.trunc方法用于去除一个数的小数部分，返回整数部分。对于非数值，Math.trunc内部使用Number方法将其先转为数值。对于空值和无法截取整数的值，返回NaN。

#### Math.sign()
Math.sign方法用来判断一个数到底是正数、负数、还是零。对于非数值，会先将其转换为数值。它会返回五种值。
- 参数为正数，返回+1；
- 参数为负数，返回-1；
- 参数为 0，返回0；
- 参数为-0，返回-0;
- 其他值，返回NaN。

如果参数是非数值，会自动转为数值。对于那些无法转为数值的值，会返回NaN。如果参数是非数值，会自动转为数值。对于那些无法转为数值的值，会返回NaN。

#### Math.cbrt() 
Math.cbrt()方法用于计算一个数的立方根。

#### Math.hypot()
Math.hypot方法返回所有参数的平方和的平方根。如果参数不是数值，Math.hypot方法会将其转为数值。只要有一个参数无法转为数值，就会返回 NaN。
```js
Math.hypot(3, 4);        // 5
Math.hypot(3, 4, 5);     // 7.0710678118654755
Math.hypot();            // 0
Math.hypot(NaN);         // NaN
Math.hypot(3, 4, 'foo'); // NaN
Math.hypot(3, 4, '5');   // 7.0710678118654755
Math.hypot(-3);          // 3
```

### BigInt数据类型
JavaScript 所有数字都保存成 64 位浮点数，这给数值的表示带来了两大限制。一是数值的精度只能到 53 个二进制位（相当于 16 个十进制位），大于这个范围的整数，JavaScript 是无法精确表示，这使得 JavaScript 不适合进行科学和金融方面的精确计算。二是大于或等于2的1024次方的数值，JavaScript 无法表示，会返回Infinity。

ES2020 引入了一种新的数据类型 BigInt（大整数），来解决这个问题，这是 ECMAScript 的第八种数据类型。BigInt 只用来表示整数，没有位数的限制，任何位数的整数都可以精确表示。

为了与 Number 类型区别，BigInt 类型的数据必须添加后缀n。BigInt 同样可以使用各种进制表示，都要加上后缀n。
```js
1234 // 普通整数
1234n // BigInt

// BigInt 的运算
1n + 2n // 3n

0b1101n // 二进制
0o777n // 八进制
0xFFn // 十六进制
```
BigInt 与普通整数是两种值，它们之间并不相等。

#### BigInt函数
JavaScript 原生提供BigInt函数，可以用它生成 BigInt 类型的数值。转换规则基本与Number()一致，将其他类型的值转为 BigInt。
```js
BigInt(123) // 123n
BigInt('123') // 123n
BigInt(false) // 0n
BigInt(true) // 1n
```
BigInt()函数必须有参数，而且参数必须可以正常转为数值，下面的用法都会报错。
```js
new BigInt() // TypeError
BigInt(undefined) //TypeError
BigInt(null) // TypeError
BigInt('123n') // SyntaxError
BigInt('abc') // SyntaxError
```
参数如果是小数，也会报错。
```js
BigInt(1.5) // RangeError
BigInt('1.5') // SyntaxError
```
BigInt 继承了 Object 对象的两个实例方法。还继承了 Number 对象的一个实例方法。
- BigInt.prototype.toString()
- BigInt.prototype.valueOf()
- BigInt.prototype.toLocaleString()
此外，还提供了两个静态方法。
- BigInt.asIntN(width, BigInt)：将 BigInt 转换为指定的位数。
- BigInt.asUintN(width, BigInt)：将 BigInt 转换为指定的位数。

如果BigInt.asIntN()和BigInt.asUintN()指定的位数，小于数值本身的位数，那么头部的位将被舍弃。

对于二进制数组，BigInt 新增了两个类型BigUint64Array和BigInt64Array，这两种数据类型返回的都是64位 BigInt。DataView对象的实例方法DataView.prototype.getBigInt64()和DataView.prototype.getBigUint64()，返回的也是 BigInt。

#### 转换规则
可以使用Boolean()、Number()和String()这三个方法，将 BigInt 可以转为布尔值、数值和字符串类型。取反运算符（!）也可以将 BigInt 转为布尔值。
```js
Boolean(0n) // false
Boolean(1n) // true
Number(1n)  // 1
String(1n)  // "1"
!0n // true
!1n // false
```

## 函数的扩展
### 函数参数的默认值
ES6 允许为函数的参数设置默认值，即直接写在参数定义的后面。

### rest参数
ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象了。rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。
```js
// arguments变量的写法
function sortNumbers() {
  return Array.from(arguments).sort();
}

// rest参数的写法
const sortNumbers = (...numbers) => numbers.sort();
```
arguments对象不是数组，而是一个类似数组的对象。所以为了使用数组的方法，必须使用Array.from先将其转为数组。rest 参数就不存在这个问题，它就是一个真正的数组，数组特有的方法都可以使用。

### 箭头函数
箭头函数有几个使用注意点。
- 箭头函数没有自己的this对象（详见下文）。
- 不可以当作构造函数，也就是说，不可以对箭头函数使用new命令，否则会抛出一个错误。
- 不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
- 不可以使用yield命令，因此箭头函数不能用作 Generator 函数。

对于普通函数来说，内部的this指向函数运行时所在的对象，但是这一点对箭头函数不成立。它没有自己的this对象，内部的this就是定义时上层作用域中的this。也就是说，箭头函数内部的this指向是固定的，相比之下，普通函数的this指向是可变的。

除了this，以下三个变量在箭头函数之中也是不存在的，指向外层函数的对应变量：arguments、super、new.target。
```js
function foo() {
  setTimeout(() => {
    console.log('args:', arguments);
  }, 100);
}

foo(2, 4, 6, 8)
// args: [2, 4, 6, 8]
```

## 数组的扩展
### 扩展运算符
#### 扩展运算符的应用
##### 复制数组
数组是复合的数据类型，直接复制的话，只是复制了指向底层数据结构的指针，而不是克隆一个全新的数组。扩展运算符提供了复制数组的简便写法。
```js
const a1 = [1, 2];
// 写法一
const a2 = [...a1];
// 写法二
const [...a2] = a1;
```

##### 合并数组
扩展运算符提供了数组合并的新写法。
```js
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// ES5 的合并数组
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6 的合并数组
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]
```
不过，这两种方法都是浅拷贝，使用的时候需要注意。

##### 与解构赋值结合
扩展运算符可以与解构赋值结合起来，用于生成数组。如果将扩展运算符用于数组赋值，只能放在参数的最后一位，否则会报错。
```js
// ES5
a = list[0], rest = list.slice(1)

// ES6
[a, ...rest] = list
```

##### 字符串
扩展运算符还可以将字符串转为真正的数组。
```js
[...'hello']
// [ "h", "e", "l", "l", "o" ]
```

##### 实现了 Iterator 接口的对象
任何定义了遍历器（Iterator）接口的对象，都可以用扩展运算符转为真正的数组。对于那些没有部署 Iterator 接口的类似数组的对象，扩展运算符就无法将其转为真正的数组。

##### Map 和 Set 结构，Generator 函数
扩展运算符内部调用的是数据结构的 Iterator 接口，因此只要具有 Iterator 接口的对象，都可以使用扩展运算符，比如 Map 结构。Generator 函数运行后，返回一个遍历器对象，因此也可以使用扩展运算符。如果对没有 Iterator 接口的对象，使用扩展运算符，将会报错。
```js
let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);
let arr = [...map.keys()]; // [1, 2, 3]

const go = function*(){
  yield 1;
  yield 2;
  yield 3;
};
[...go()] // [1, 2, 3]

const obj = {a: 1, b: 2};
let arr = [...obj]; // TypeError: Cannot spread non-iterable object
```

### Array.from()
Array.from()方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。

实际应用中，常见的类似数组的对象是 DOM 操作返回的 NodeList 集合，以及函数内部的arguments对象。Array.from()都可以将它们转为真正的数组。
```js
// NodeList 对象
let ps = document.querySelectorAll('p');
Array.from(ps).filter(p => {
  return p.textContent.length > 100;
});

// arguments 对象
function foo() {
  var args = Array.from(arguments);
  // ...
}
```
只要是部署了 Iterator 接口的数据结构，Array.from()都能将其转为数组。

Array.from()还可以接受一个函数作为第二个参数，作用类似于数组的map()方法，用来对每个元素进行处理，将处理后的值放入返回的数组。
```js
Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);

Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]
```
Array.from()可以将各种值转为真正的数组，并且还提供map功能。这实际上意味着，只要有一个原始的数据结构，你就可以先对它的值进行处理，然后转成规范的数组结构，进而就可以使用数量众多的数组方法。

### Array.of()
Array.of()方法用于将一组值，转换为数组。如果没有参数，就返回一个空数组。
```js
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1
Array.of() // []
```
这个方法的主要目的，是弥补数组构造函数Array()的不足。因为参数个数的不同，会导致Array()的行为有差异。
```js
Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]
```
Array.of()基本上可以用来替代Array()或new Array()，并且不存在由于参数不同而导致的重载。
```js
Array.of() // []
Array.of(undefined) // [undefined]
Array.of(1) // [1]
Array.of(1, 2) // [1, 2]
```

### 实例方法：copyWithin()
数组实例的copyWithin()方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。
```js
Array.prototype.copyWithin(target, start = 0, end = this.length)
```
它接受三个参数。
- target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
- start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。
- end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算。

这三个参数都应该是数值，如果不是，会自动转为数值。

```js
[1, 2, 3, 4, 5].copyWithin(0, 3)  // [4, 5, 3, 4, 5]

// 将3号位复制到0号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4) // [4, 2, 3, 4, 5]
```

### 实例方法：find()，findIndex()，findLast()，findLastIndex()
find()方法，用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后返回该成员。如果没有符合条件的成员，则返回undefined。
```js
[1, 4, -5, 10].find((n) => n < 0) // -5

[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;
}) // 10
```
find()方法的回调函数可以接受三个参数，依次为当前的值、当前的位置和原数组。

findIndex()方法的用法与find()方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。
```js
[1, 5, 10, 15].findIndex(function(value, index, arr) {
  return value > 9;
}) // 2
```
find()和findIndex()这两个方法都可以接受第二个参数，用来绑定回调函数的this对象。
```js
function f(v){
  return v > this.age;
}
let person = {name: 'John', age: 20};
[10, 12, 26, 15].find(f, person);    // 26
```
另外，这两个方法都可以发现NaN，弥补了数组的indexOf()方法的不足。
```js
[NaN].indexOf(NaN)  // -1

[NaN].find(y => Object.is(NaN, y)) // NaN
[NaN].findIndex(y => Object.is(NaN, y)) // 0
```

ES2022 新增了两个方法findLast()和findLastIndex()，从数组的最后一个成员开始，依次向前检查，其他都保持不变。

### 实例方法：fill()
fill方法使用给定值，填充一个数组。fill方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。
```js
['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']
```

注意，如果填充的类型为对象，那么被赋值的是同一个内存地址的对象，而不是深拷贝对象。
```js
let arr = new Array(3).fill({name: "Mike"});
arr[0].name = "Ben";
arr
// [{name: "Ben"}, {name: "Ben"}, {name: "Ben"}]

let arr = new Array(3).fill([]);
arr[0].push(5);
arr
// [[5], [5], [5]]
```

### 实例方法：entries()，keys() 和 values()
ES6 提供三个新的方法——entries()，keys()和values()——用于遍历数组。它们都返回一个遍历器对象，可以用for...of循环进行遍历，唯一的区别是keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历。
```js
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"
```

### 实例方法：includes()
Array.prototype.includes方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的includes方法类似。该方法的第二个参数表示搜索的起始位置，默认为0。如果第二个参数为负数，则表示倒数的位置，如果这时它大于数组长度，则会重置为从0开始。
```js
[1, 2, 3].includes(2)     // true
[1, 2, 3].includes(4)     // false
[1, 2, NaN].includes(NaN) // true

[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true
```

### 实例方法：flat()，flatMap() 
数组的成员有时还是数组，Array.prototype.flat()用于将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数据没有影响。
- flat()默认只会“拉平”一层，如果想要“拉平”多层的嵌套数组，可以将flat()方法的参数写成一个整数，表示想要拉平的层数，默认为1。
- 如果不管有多少层嵌套，都要转成一维数组，可以用Infinity关键字作为参数。
- 如果原数组有空位，flat()方法会跳过空位。
```js
[1, 2, [3, 4]].flat() // [1, 2, 3, 4]

[1, 2, [3, [4, 5]]].flat(2) // [1, 2, 3, 4, 5]

[1, [2, [3]]].flat(Infinity)  // [1, 2, 3]

[1, 2, , 4, 5].flat() // [1, 2, 4, 5]
```
flatMap()方法对原数组的每个成员执行一个函数（相当于执行Array.prototype.map()），然后对返回值组成的数组执行flat()方法。该方法返回一个新数组，不改变原数组。flatMap()只能展开一层数组。
```js
// 相当于 [[2, 4], [3, 6], [4, 8]].flat()
[2, 3, 4].flatMap((x) => [x, x * 2])
// [2, 4, 3, 6, 4, 8]
```
flatMap()方法的参数是一个遍历函数，该函数可以接受三个参数，分别是当前数组成员、当前数组成员的位置（从零开始）、原数组。
```js
arr.flatMap(function callback(currentValue[, index[, array]]) {
  // ...
}[, thisArg])
```
flatMap()方法还可以有第二个参数，用来绑定遍历函数里面的this。

### 实例方法：at()
at()方法，接受一个整数作为参数，返回对应位置的成员，并支持负索引。这个方法不仅可用于数组，也可用于字符串和类型数组（TypedArray）。如果参数位置超出了数组范围，at()返回undefined。
```js
const arr = [5, 12, 8, 130, 44];
arr.at(2) // 8
arr.at(-2) // 130
arr.at(5) // undefined
```

### 实例方法：toReversed()，toSorted()，toSpliced()，with()
很多数组的传统方法会改变原数组，比如push()、pop()、shift()、unshift()等等。数组只要调用了这些方法，它的值就变了。ES2023引入了四个新方法，对数组进行操作时，不改变原数组，而返回一个原数组的拷贝。
- Array.prototype.toReversed() -> Array
- Array.prototype.toSorted(compareFn) -> Array
- Array.prototype.toSpliced(start, deleteCount, ...items) -> Array
- Array.prototype.with(index, value) -> Array

它们分别对应数组的原有方法。
- toReversed()对应reverse()，用来颠倒数组成员的位置。
- toSorted()对应sort()，用来对数组成员排序。
- toSpliced()对应splice()，用来在指定位置，删除指定数量的成员，并插入新成员。
- with(index, value)对应splice(index, 1, value)，用来将指定位置的成员替换为新的值。

上面是这四个新方法对应的原有方法，含义和用法完全一样，唯一不同的是不会改变原数组，而是返回原数组操作后的拷贝。
```js
const sequence = [1, 2, 3];
sequence.toReversed() // [3, 2, 1]
sequence // [1, 2, 3]

const outOfOrder = [3, 1, 2];
outOfOrder.toSorted() // [1, 2, 3]
outOfOrder // [3, 1, 2]

const array = [1, 2, 3, 4];
array.toSpliced(1, 2, 5, 6, 7) // [1, 5, 6, 7, 4]
array // [1, 2, 3, 4]

const correctionNeeded = [1, 1, 3];
correctionNeeded.with(1, 2) // [1, 2, 3]
correctionNeeded // [1, 1, 3]
```


### 实例方法：group()，groupToMap()
group()的参数是一个分组函数，原数组的每个成员都会依次执行这个函数，确定自己是哪一个组。group()的分组函数可以接受三个参数，依次是数组的当前成员、该成员的位置序号、原数组（上例是num、index和array）。分组函数的返回值应该是字符串（或者可以自动转为字符串），以作为分组后的组名。group()的返回值是一个对象，该对象的键名就是每一组的组名，即分组函数返回的每一个字符串（上例是even和odd）；该对象的键值是一个数组，包括所有产生当前键名的原数组成员。group()还可以接受一个对象，作为第二个参数。该对象会绑定分组函数（第一个参数）里面的this，不过如果分组函数是一个箭头函数，该对象无效，因为箭头函数内部的this是固化的。
```js
const array = [1, 2, 3, 4, 5];

array.group((num, index, array) => {
  return num % 2 === 0 ? 'even': 'odd';
});
// { odd: [1, 3, 5], even: [2, 4] }
```
groupToMap()的作用和用法与group()完全一致，唯一的区别是返回值是一个 Map 结构，而不是对象。Map 结构的键名可以是各种值，所以不管分组函数返回什么值，都会直接作为组名（Map 结构的键名），不会强制转为字符串。这对于分组函数返回值是对象的情况，尤其有用。
```js
const array = [1, 2, 3, 4, 5];

const odd  = { odd: true };
const even = { even: true };
array.groupToMap((num, index, array) => {
  return num % 2 === 0 ? even: odd;
});
//  Map { {odd: true}: [1, 3, 5], {even: true}: [2, 4] }
```
总之，按照字符串分组就使用group()，按照对象分组就使用groupToMap()。

## 对象的扩展
### 属性的简洁表示法
ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法。这样的书写更加简洁。
```js
const foo = 'bar';
const baz = {foo};
baz // {foo: "bar"}

// 等同于
const baz = {foo: foo};
```
CommonJS 模块输出一组变量，就非常合适使用简洁写法。
```js
let ms = {};

function getItem (key) {
  return key in ms ? ms[key] : null;
}

function setItem (key, value) {
  ms[key] = value;
}

function clear () {
  ms = {};
}

module.exports = { getItem, setItem, clear };
// 等同于
module.exports = {
  getItem: getItem,
  setItem: setItem,
  clear: clear
};
```
属性的赋值器（setter）和取值器（getter），事实上也是采用这种写法。
```js
const cart = {
  _wheels: 4,

  get wheels () {
    return this._wheels;
  },

  set wheels (value) {
    if (value < this._wheels) {
      throw new Error('数值太小了！');
    }
    this._wheels = value;
  }
}
```

### 属性名表达式
ES6 允许字面量定义对象时，用表达式作为对象的属性名，即把表达式放在方括号内。
```js
let propKey = 'foo';

let obj = {
  [propKey]: true,
  ['a' + 'bc']: 123
};
```
注意，属性名表达式与简洁表示法，不能同时使用，会报错。
```js
// 报错
const foo = 'bar';
const bar = 'abc';
const baz = { [foo] };

// 正确
const foo = 'bar';
const baz = { [foo]: 'abc'};
```

### 方法的 name 属性
函数的name属性，返回函数名。对象方法也是函数，因此也有name属性。
```js
const person = {
  sayName() {
    console.log('hello!');
  },
};

person.sayName.name   // "sayName"
```

如果对象的方法使用了取值函数（getter）和存值函数（setter），则name属性不是在该方法上面，而是该方法的属性的描述对象的get和set属性上面，返回值是方法名前加上get和set。
```js
const obj = {
  get foo() {},
  set foo(x) {}
};

obj.foo.name
// TypeError: Cannot read property 'name' of undefined

const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');

descriptor.get.name // "get foo"
descriptor.set.name // "set foo"
```

### 属性的可枚举性和遍历
#### 可枚举性
对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象。描述对象的enumerable属性，称为“可枚举性”，如果该属性为false，就表示某些操作会忽略当前属性。
```js
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//  {
//    value: 123,
//    writable: true,
//    enumerable: true,
//    configurable: true
//  }
```
目前，有四个操作会忽略enumerable为false的属性。
- for...in循环：只遍历对象自身的和继承的可枚举的属性。
- Object.keys()：返回对象自身的所有可枚举的属性的键名。
- JSON.stringify()：只串行化对象自身的可枚举的属性。
- Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。

这四个操作之中，前三个是 ES5 就有的，最后一个Object.assign()是 ES6 新增的。其中，只有for...in会返回继承的属性，其他三个方法都会忽略继承的属性，只处理对象自身的属性。实际上，引入“可枚举”（enumerable）这个概念的最初目的，就是让某些属性可以规避掉for...in操作，不然所有内部属性和方法都会被遍历到。比如，对象原型的toString方法，以及数组的length属性，就通过“可枚举性”，从而避免被for...in遍历到。

另外，ES6 规定，所有 Class 的原型的方法都是不可枚举的。总的来说，操作中引入继承的属性会让问题复杂化，大多数时候，我们只关心对象自身的属性。所以，尽量不要用for...in循环，而用Object.keys()代替。

#### 属性的遍历
ES6 一共有 5 种方法可以遍历对象的属性。
1. for...in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。
2. Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。
3. Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。
4. Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名。
5. Reflect.ownKeys返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。
- 首先遍历所有数值键，按照数值升序排列。
- 其次遍历所有字符串键，按照加入时间升序排列。
- 最后遍历所有 Symbol 键，按照加入时间升序排列。

### super 关键字
this关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字super，指向当前对象的原型对象。
```js
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};

Object.setPrototypeOf(obj, proto);
obj.find() // "hello"
```
super关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错。

### 对象的扩展运算符
#### 解构赋值
对象的解构赋值用于从一个对象取值，相当于将目标对象自身的所有可遍历的（enumerable）、但尚未被读取的属性，分配到指定的对象上面。所有的键和它们的值，都会拷贝到新对象上面。
```js
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x // 1
y // 2
z // { a: 3, b: 4 }
```
由于解构赋值要求等号右边是一个对象，所以如果等号右边是undefined或null，就会报错，因为它们无法转为对象。解构赋值必须是最后一个参数，否则会报错。
```js
let { ...z } = null; // 运行时错误
let { ...z } = undefined; // 运行时错误
let { ...x, y, z } = someObject; // 句法错误
let { x, ...y, ...z } = someObject; // 句法错误
```
注意，解构赋值的拷贝是浅拷贝，即如果一个键的值是复合类型的值（数组、对象、函数）、那么解构赋值拷贝的是这个值的引用，而不是这个值的副本。
```js
let obj = { a: { b: 1 } };
let { ...x } = obj;
obj.a.b = 2;
x.a.b // 2
```
另外，扩展运算符的解构赋值，不能复制继承自原型对象的属性。
```js
let o1 = { a: 1 };
let o2 = { b: 2 };
o2.__proto__ = o1;
let { ...o3 } = o2;
o3 // { b: 2 }
o3.a // undefined
```
解构赋值的一个用处，是扩展某个函数的参数，引入其他操作。
```js
function baseFunction({ a, b }) {
  // ...
}
function wrapperFunction({ x, y, ...restConfig }) {
  // 使用 x 和 y 参数进行操作
  // 其余参数传给原始函数
  return baseFunction(restConfig);
}
```

#### 扩展运算符
对象的扩展运算符等同于使用Object.assign()方法。
```js
let aClone = { ...a };
// 等同于
let aClone = Object.assign({}, a);
```
扩展运算符可以用于合并两个对象。
```js
let ab = { ...a, ...b };
// 等同于
let ab = Object.assign({}, a, b);
```
扩展运算符的参数对象之中，如果有取值函数get，这个函数是会执行的。
```js
let a = {
  get x() {
    throw new Error('not throw yet');
  }
}

let aWithXGetter = { ...a }; // 报错
```

## 对象的新增方法
### Object.is()
Object.is()用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。
```js
Object.is('foo', 'foo')
// true
Object.is({}, {})
// false
```
不同之处只有两个：一是+0不等于-0，二是NaN等于自身。

### Object.assign()
Object.assign()方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。Object.assign()方法的第一个参数是目标对象，后面的参数都是源对象。如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。
```js
const target = { a: 1, b: 1 };

const source1 = { b: 2, c: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
```

### Object.getOwnPropertyDescriptors()
Object.getOwnPropertyDescriptors()方法，返回指定对象所有自身属性（非继承属性）的描述对象。
```js
const obj = {
  foo: 123,
  get bar() { return 'abc' }
};

Object.getOwnPropertyDescriptors(obj)
// { foo:
//    { value: 123,
//      writable: true,
//      enumerable: true,
//      configurable: true },
//   bar:
//    { get: [Function: get bar],
//      set: undefined,
//      enumerable: true,
//      configurable: true } }
```
这个方法的实现其实就是遍历对象的key并调用getOwnPropertyDescriptor()
```js
function getOwnPropertyDescriptors(obj) {
  const result = {};
  for (let key of Reflect.ownKeys(obj)) {
    result[key] = Object.getOwnPropertyDescriptor(obj, key);
  }
  return result;
}
```

### Object.fromEntries()
Object.fromEntries()方法是Object.entries()的逆操作，用于将一个键值对数组转为对象。
```js
Object.fromEntries([
  ['foo', 'bar'],
  ['baz', 42]
])
// { foo: "bar", baz: 42 }
```
该方法的主要目的，是将键值对的数据结构还原为对象，因此特别适合将 Map 结构转为对象。

### Object.hasOwn()
JavaScript 对象的属性分成两种：自身的属性和继承的属性。对象实例有一个hasOwnProperty()方法，可以判断某个属性是否为原生属性。ES2022 在Object对象上面新增了一个静态方法Object.hasOwn()，也可以判断是否为自身的属性。Object.hasOwn()可以接受两个参数，第一个是所要判断的对象，第二个是属性名。Object.hasOwn()的一个好处是，对于不继承Object.prototype的对象不会报错，而hasOwnProperty()是会报错的。
```js
const obj = Object.create(null);

obj.hasOwnProperty('foo') // 报错
Object.hasOwn(obj, 'foo') // false
```

## Symbol
ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。它属于 JavaScript 语言的原生数据类型之一，其他数据类型是：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、大整数（BigInt）、对象（Object）。

Symbol 值通过Symbol()函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。

Symbol()函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述。这主要是为了在控制台显示，或者转为字符串时，比较容易区分。
```js
let s1 = Symbol('foo');
let s2 = Symbol('bar');

s1 // Symbol(foo)
s2 // Symbol(bar)

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"
```

如果 Symbol 的参数是一个对象，就会调用该对象的toString()方法，将其转为字符串，然后才生成一个 Symbol 值。

## Set和Map数据结构
### Set
#### Set 实例的属性和方法
Set 结构的实例有以下属性。
- Set.prototype.constructor：构造函数，默认就是Set函数。
- Set.prototype.size：返回Set实例的成员总数。

Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。下面先介绍四个操作方法。
- Set.prototype.add(value)：添加某个值，返回 Set 结构本身。
- Set.prototype.delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
- Set.prototype.has(value)：返回一个布尔值，表示该值是否为Set的成员。
- Set.prototype.clear()：清除所有成员，没有返回值。

#### 遍历操作
Set 结构的实例有四个遍历方法，可以用于遍历成员。
- Set.prototype.keys()：返回键名的遍历器
- Set.prototype.values()：返回键值的遍历器
- Set.prototype.entries()：返回键值对的遍历器
- Set.prototype.forEach()：使用回调函数遍历每个成员

由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法和values方法的行为完全一致。entries方法返回的遍历器，同时包括键名和键值，所以每次输出一个数组，它的两个成员完全相等。

### WeakSet
WeakSet 的成员只能是对象和 Symbol 值，而不能是其他类型的值。WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

这是因为垃圾回收机制根据对象的可达性（reachability）来判断回收，如果对象还能被访问到，垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。WeakSet 里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。

由于上面这个特点，WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。


WeakSet 结构有以下三个方法。
- WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员，返回 WeakSet 结构本身。
- WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员，清除成功返回true，如果在 WeakSet 中找不到该成员或该成员不是对象，返回false。
- WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。

WeakSet 没有size属性，没有办法遍历它的成员。WeakSet 不能遍历，是因为成员都是弱引用，随时可能消失，遍历机制无法保证成员的存在，很可能刚刚遍历结束，成员就取不到了。WeakSet 的一个用处，是储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。

### Map
#### 实例的属性和操作方法
- size属性返回 Map 结构的成员总数。
- set方法设置键名key对应的键值为value，然后返回整个 Map 结构。如果key已经有值，则键值会被更新，否则就新生成该键。
- get方法读取key对应的键值，如果找不到key，返回undefined。
- has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。
- delete()方法删除某个键，返回true。如果删除失败，返回false。
- clear()方法清除所有成员，没有返回值。


Map 结构原生提供三个遍历器生成函数和一个遍历方法。Map 的遍历顺序就是插入顺序。
- Map.prototype.keys()：返回键名的遍历器。
- Map.prototype.values()：返回键值的遍历器。
- Map.prototype.entries()：返回所有成员的遍历器。
- Map.prototype.forEach()：遍历 Map 的所有成员。

### WeakMap
WeakMap只接受对象（null除外）和 Symbol 值作为键名，不接受其他类型的值作为键名。WeakMap的键名所指向的对象，不计入垃圾回收机制。

WeakMap的设计目的在于，有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。一旦不再需要这两个对象，我们就必须手动删除这个引用，否则垃圾回收机制就不会释放占用的内存。WeakMap 就是为了解决这个问题而诞生的，它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。

基本上，如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 WeakMap。一个典型应用场景是，在网页的 DOM 元素上添加数据，就可以使用WeakMap结构。当该 DOM 元素被清除，其所对应的WeakMap记录就会自动被移除。

总之，WeakMap的专用场合就是，它的键所对应的对象，可能会在将来消失。WeakMap结构有助于防止内存泄漏。注意，WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。

WeakMap 与 Map 在 API 上的区别主要是两个，一是没有遍历操作（即没有keys()、values()和entries()方法），也没有size属性。因为没有办法列出所有键名，某个键名是否存在完全不可预测，跟垃圾回收机制是否运行相关。这一刻可以取到键名，下一刻垃圾回收机制突然运行了，这个键名就没了，为了防止出现不确定性，就统一规定不能取到键名。二是无法清空，即不支持clear方法。因此，WeakMap只有四个方法可用：get()、set()、has()、delete()。

WeakMap 应用的典型场合就是 DOM 节点作为键名。WeakMap 的另一个用处是部署私有属性。

### WeakRef
WeakRef 对象，用于直接创建对象的弱引用。WeakRef 实例对象有一个deref()方法，如果原始对象存在，该方法返回原始对象；如果原始对象已经被垃圾回收机制清除，该方法返回undefined。
```js
let target = {};
let wr = new WeakRef(target);

let obj = wr.deref();
if (obj) { // target 未被垃圾回收机制清除
  // ...
}
```
弱引用对象的一大用处，就是作为缓存，未被清除时可以从缓存取值，一旦清除缓存就自动失效。标准规定，一旦使用WeakRef()创建了原始对象的弱引用，那么在本轮事件循环（event loop），原始对象肯定不会被清除，只会在后面的事件循环才会被清除。

## Proxy
ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。
```js
var proxy = new Proxy(target, handler);
```
Proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。

Proxy 支持的拦截操作一共13种。
- get(target, propKey, receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']。
- set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
- has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值。
- deleteProperty(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值。
- ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
- getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
- defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
- preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
- getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
- isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
- setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
- construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。

## Reflect
Reflect对象与Proxy对象一样，也是 ES6 为了操作对象而提供的新 API。Reflect对象的设计目的有这样几个。
1. 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。也就是说，从Reflect对象上可以拿到语言内部的方法。
2. 修改某些Object方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。
3. 让Object操作都变成函数行为。某些Object操作是命令式，比如name in obj和delete obj[name]，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。
4. Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。

### 静态方法
Reflect对象一共有 13 个静态方法。
- Reflect.apply(target, thisArg, args)
- Reflect.construct(target, args)
- Reflect.get(target, name, receiver)
- Reflect.set(target, name, value, receiver)
- Reflect.defineProperty(target, name, desc)
- Reflect.deleteProperty(target, name)
- Reflect.has(target, name)
- Reflect.ownKeys(target)
- Reflect.isExtensible(target)
- Reflect.preventExtensions(target)
- Reflect.getOwnPropertyDescriptor(target, name)
- Reflect.getPrototypeOf(target)
- Reflect.setPrototypeOf(target, prototype)

上面这些方法的作用，大部分与Object对象的同名方法的作用都是相同的，而且它与Proxy对象的方法是一一对应的。下面是对它们的解释。

## Promise对象
所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

Promise对象有以下两个特点。
1. 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。
2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

Promise也有一些缺点。
- 首先，无法取消Promise，一旦新建它就会立即执行，无法中途取消。
- 其次，如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。
- 第三，当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

### 基本用法
ES6 规定，Promise对象是一个构造函数，用来生成Promise实例。Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。
```js
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；reject函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数。
```js
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```
then方法可以接受两个回调函数作为参数。第一个回调函数是Promise对象的状态变为resolved时调用，第二个回调函数是Promise对象的状态变为rejected时调用。这两个函数都是可选的，不一定要提供。它们都接受Promise对象传出的值作为参数。

注意，调用resolve或reject并不会终结 Promise 的参数函数的执行。
```js
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```
一般来说，调用resolve或reject以后，Promise 的使命就完成了，后继操作应该放到then方法里面，而不应该直接写在resolve或reject的后面。所以，最好在它们前面加上return语句，这样就不会有意外。
```js
new Promise((resolve, reject) => {
  return resolve(1);
  // 后面的语句不会执行
  console.log(2);
})
```

### Promise.prototype.then()
Promise 实例具有then方法，也就是说，then方法是定义在原型对象Promise.prototype上的。它的作用是为 Promise 实例添加状态改变时的回调函数。前面说过，then方法的第一个参数是resolved状态的回调函数，第二个参数是rejected状态的回调函数，它们都是可选的。

then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即then方法后面再调用另一个then方法。
```js
getJSON("/posts.json").then(function(json) {
  return json.post;
}).then(function(post) {
  // ...
});
```
上面的代码使用then方法，依次指定了两个回调函数。第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数。

采用链式的then，可以指定一组按照次序调用的回调函数。这时，前一个回调函数，有可能返回的还是一个Promise对象（即有异步操作），这时后一个回调函数，就会等待该Promise对象的状态发生变化，才会被调用。
```js
getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function (comments) {
  console.log("resolved: ", comments);
}, function (err){
  console.log("rejected: ", err);
});
```
上面代码中，第一个then方法指定的回调函数，返回的是另一个Promise对象。这时，第二个then方法指定的回调函数，就会等待这个新的Promise对象状态发生变化。如果变为resolved，就调用第一个回调函数，如果状态变为rejected，就调用第二个回调函数。

### Promise.prototype.catch()
Promise.prototype.catch()方法是.then(null, rejection)或.then(undefined, rejection)的别名，用于指定发生错误时的回调函数。
```js
getJSON('/posts.json').then(function(posts) {
  // ...
}).catch(function(error) {
  // 处理 getJSON 和 前一个回调函数运行时发生的错误
  console.log('发生错误！', error);
});
```
上面代码中，getJSON()方法返回一个 Promise 对象，如果该对象状态变为resolved，则会调用then()方法指定的回调函数；如果异步操作抛出错误，状态就会变为rejected，就会调用catch()方法指定的回调函数，处理这个错误。另外，then()方法指定的回调函数，如果运行中抛出错误，也会被catch()方法捕获。
```js
p.then((val) => console.log('fulfilled:', val))
  .catch((err) => console.log('rejected', err));

// 等同于
p.then((val) => console.log('fulfilled:', val))
  .then(null, (err) => console.log("rejected:", err));
```
reject()方法的作用，等同于抛出错误。如果 Promise 状态已经变成resolved，再抛出错误是无效的。因为 Promise 的状态一旦改变，就永久保持该状态，不会再变了。

Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch语句捕获。
```js
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前面三个Promise产生的错误
});
```

一般来说，不要在then()方法里面定义 Reject 状态的回调函数（即then的第二个参数），总是使用catch方法。跟传统的try/catch代码块不同的是，如果没有使用catch()方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。

一般总是建议，Promise 对象后面要跟catch()方法，这样可以处理 Promise 内部发生的错误。catch()方法返回的还是一个 Promise 对象，因此后面还可以接着调用then()方法。
```js
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing()
.catch(function(error) {
  console.log('oh no', error);
})
.then(function() {
  console.log('carry on');
});
// oh no [ReferenceError: x is not defined]
// carry on
```

### Promise.prototype.finally()
finally()方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。不管promise最后的状态，在执行完then或catch指定的回调函数以后，都会执行finally方法指定的回调函数。
```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```
finally方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是fulfilled还是rejected。这表明，finally方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果。

finally本质上是then方法的特例。
```js
promise
.finally(() => {
  // 语句
});

// 等同于
promise
.then(
  result => {
    // 语句
    return result;
  },
  error => {
    // 语句
    throw error;
  }
);
```

### Promise.all()
Promise.all()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。
```js
const p = Promise.all([p1, p2, p3]);
```
Promise.all()方法接受一个数组作为参数，p1、p2、p3都是 Promise 实例，如果不是，就会先调用下面讲到的Promise.resolve方法，将参数转为 Promise 实例，再进一步处理。另外，Promise.all()方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。

p的状态由p1、p2、p3决定，分成两种情况。
- 只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。
- 只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。

如果作为参数的 Promise 实例，自己定义了catch方法，那么它一旦被rejected，并不会触发Promise.all()的catch方法。
```js
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
.catch(e => e);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// ["hello", Error: 报错了]
```
上面代码中，p1会resolved，p2首先会rejected，但是p2有自己的catch方法，该方法返回的是一个新的 Promise 实例，p2指向的实际上是这个实例。该实例执行完catch方法后，也会变成resolved，导致Promise.all()方法参数里面的两个实例都会resolved，因此会调用then方法指定的回调函数，而不会调用catch方法指定的回调函数。

### Promise.race()
Promise.race()方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。
```js
const p = Promise.race([p1, p2, p3]);
```
只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。

Promise.race()方法的参数与Promise.all()方法一样，如果不是 Promise 实例，就会先调用下面讲到的Promise.resolve()方法，将参数转为 Promise 实例，再进一步处理。
```js
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);

p
.then(console.log)
.catch(console.error);
```
这个例子是如果指定时间内没有获得结果，就将 Promise 的状态变为reject，否则变为resolve。

### Promise.allSettled()
有时候，我们希望等到一组异步操作都结束了，不管每一个操作是成功还是失败，再进行下一步操作。但是，现有的 Promise 方法很难实现这个要求。Promise.all()方法只适合所有异步操作都成功的情况，如果有一个操作失败，就无法满足要求。

为了解决这个问题，ES2020 引入了Promise.allSettled()方法，用来确定一组异步操作是否都结束了（不管成功或失败）。所以，它的名字叫做”Settled“，包含了”fulfilled“和”rejected“两种情况。

Promise.allSettled()方法接受一个数组作为参数，数组的每个成员都是一个 Promise 对象，并返回一个新的 Promise 对象。只有等到参数数组的所有 Promise 对象都发生状态变更（不管是fulfilled还是rejected），返回的 Promise 对象才会发生状态变更。

该方法返回的新的 Promise 实例，一旦发生状态变更，状态总是fulfilled，不会变成rejected。状态变成fulfilled后，它的回调函数会接收到一个数组作为参数，该数组的每个成员对应前面数组的每个 Promise 对象。
```js
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function (results) {
  console.log(results);
});
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```
上面代码中，Promise.allSettled()的返回值allSettledPromise，状态只可能变成fulfilled。它的回调函数接收到的参数是数组results。该数组的每个成员都是一个对象，对应传入Promise.allSettled()的数组里面的两个 Promise 对象。results的每个成员是一个对象，对象的格式是固定的，对应异步操作的结果。
```js
// 异步操作成功时
{status: 'fulfilled', value: value}

// 异步操作失败时
{status: 'rejected', reason: reason}
```
成员对象的status属性的值只可能是字符串fulfilled或字符串rejected，用来区分异步操作是成功还是失败。如果是成功（fulfilled），对象会有value属性，如果是失败（rejected），会有reason属性，对应两种状态时前面异步操作的返回值。

### Promise.any()
ES2021 引入了Promise.any()方法。该方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例返回。只要参数实例有一个变成fulfilled状态，包装实例就会变成fulfilled状态；如果所有参数实例都变成rejected状态，包装实例就会变成rejected状态。
```js
Promise.any([
  fetch('https://v8.dev/').then(() => 'home'),
  fetch('https://v8.dev/blog').then(() => 'blog'),
  fetch('https://v8.dev/docs').then(() => 'docs')
]).then((first) => {  // 只要有一个 fetch() 请求成功
  console.log(first);
}).catch((error) => { // 所有三个 fetch() 全部请求失败
  console.log(error);
});
```

Promise.any()抛出的错误是一个 AggregateError 实例，这个 AggregateError 实例对象的errors属性是一个数组，包含了所有成员的错误。

### Promise.resolve()
有时需要将现有对象转为 Promise 对象，Promise.resolve()方法就起到这个作用。Promise.resolve()等价于下面的写法。
```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```
Promise.resolve()方法的参数分成四种情况。
- 参数是一个 Promise 实例：如果参数是 Promise 实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例。
- 参数是一个thenable对象：thenable对象指的是具有then方法的对象，Promise.resolve()方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then()方法。
- 参数不是具有then()方法的对象，或根本就不是对象：如果参数是一个原始值，或者是一个不具有then()方法的对象，则Promise.resolve()方法返回一个新的 Promise 对象，状态为resolved。
- 不带有任何参数：Promise.resolve()方法允许调用时不带参数，直接返回一个resolved状态的 Promise 对象。所以，如果希望得到一个 Promise 对象，比较方便的方法就是直接调用Promise.resolve()方法。

需要注意的是，立即resolve()的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时。

### Promise.reject() 
Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected。
```js
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
});
// 出错了
```
Promise.reject()方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。

### Promise.try()
实际开发中，经常遇到一种情况：不知道或者不想区分，函数f是同步函数还是异步操作，但是想用 Promise 来处理它。因为这样就可以不管f是否包含异步操作，都用then方法指定下一步流程，用catch方法处理f抛出的错误。一般就会采用下面的写法。
```js
Promise.resolve().then(f)
```
上面的写法有一个缺点，就是如果f是同步函数，那么它会在本轮事件循环的末尾执行。函数f是同步的，但是用 Promise 包装了以后，就变成异步执行了。

那么有没有一种方法，让同步函数同步执行，异步函数异步执行，并且让它们具有统一的 API 呢？回答是可以的，并且还有两种写法。第一种写法是用async函数来写。
```js
const f = () => console.log('now');
(async () => f())();
console.log('next');
// now
// next
```
上面代码中，第二行是一个立即执行的匿名函数，会立即执行里面的async函数，因此如果f是同步的，就会得到同步的结果；如果f是异步的，就可以用then指定下一步，就像下面的写法。
```js
(async () => f())()
.then(...)
```
需要注意的是，async () => f()会吃掉f()抛出的错误。所以，如果想捕获错误，要使用promise.catch方法。
```js
(async () => f())()
.then(...)
.catch(...)
```

第二种写法是使用new Promise()。
```js
const f = () => console.log('now');
(
  () => new Promise(
    resolve => resolve(f())
  )
)();
console.log('next');
// now
// next
```
上面代码也是使用立即执行的匿名函数，执行new Promise()。这种情况下，同步函数也是同步执行的。

ES2025 提供了Promise.try()方法替代上面的写法。
```js
const f = () => console.log('now');
Promise.try(f);
console.log('next');
// now
// next
```
由于Promise.try为所有操作提供了统一的处理机制，所以如果想用then方法管理流程，最好都用Promise.try包装一下。这样有许多好处，其中一点就是可以更好地管理异常。事实上，Promise.try就是模拟try代码块，就像promise.catch模拟的是catch代码块。

## async函数
async 函数是什么？一句话，它就是 Generator 函数的语法糖。async函数就是将 Generator 函数的星号（*）替换成async，将yield替换成await，仅此而已。async函数对 Generator 函数的改进，体现在以下四点。
- 内置执行器。
- 更好的语义。
- 更广的适用性。
- 返回值是 Promise。

async函数返回一个 Promise 对象，可以使用then方法添加回调函数。当函数执行的时候，一旦遇到await就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。async 函数有多种使用形式。
```js
// 函数声明
async function foo() {}

// 函数表达式
const foo = async function () {};

// 对象的方法
let obj = { async foo() {} };
obj.foo().then(...)

// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}

const storage = new Storage();
storage.getAvatar('jake').then(…);

// 箭头函数
const foo = async () => {};
```

async函数内部return语句返回的值，会成为then方法回调函数的参数。
```js
async function f() {
  return 'hello world';
}

f().then(v => console.log(v))
// "hello world"
```
async函数内部抛出错误，会导致返回的 Promise 对象变为reject状态。抛出的错误对象会被catch方法回调函数接收到。
```js
async function f() {
  throw new Error('出错了');
}

f().then(
  v => console.log('resolve', v),
  e => console.log('reject', e)
)
//reject Error: 出错了
```

### async命令
正常情况下，await命令后面是一个 Promise 对象，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值。
```js
async function f() {
  // 等同于
  // return 123;
  return await 123;
}

f().then(v => console.log(v))
// 123
```
另一种情况是，await命令后面是一个thenable对象（即定义了then方法的对象），那么await会将其等同于 Promise 对象。
```js
class Sleep {
  constructor(timeout) {
    this.timeout = timeout;
  }
  then(resolve, reject) {
    const startTime = Date.now();
    setTimeout(
      () => resolve(Date.now() - startTime),
      this.timeout
    );
  }
}

(async () => {
  const sleepTime = await new Sleep(1000);
  console.log(sleepTime);
})();
// 1000
```

await命令后面的 Promise 对象如果变为reject状态，则reject的参数会被catch方法的回调函数接收到。
```js
async function f() {
  await Promise.reject('出错了');
}

f()
.then(v => console.log(v))
.catch(e => console.log(e))
// 出错了
```

任何一个await语句后面的 Promise 对象变为reject状态，那么整个async函数都会中断执行。
```js
async function f() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world'); // 不会执行
}
```

有时，我们希望即使前一个异步操作失败，也不要中断后面的异步操作。这时可以将第一个await放在try...catch结构里面，这样不管这个异步操作是否成功，第二个await都会执行。
```js
async function f() {
  try {
    await Promise.reject('出错了');
  } catch(e) {
  }
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// hello world
```
另一种方法是await后面的 Promise 对象再跟一个catch方法，处理前面可能出现的错误。
```js
async function f() {
  await Promise.reject('出错了')
    .catch(e => console.log(e));
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// 出错了
// hello world
```

如果await后面的异步操作出错，那么等同于async函数返回的 Promise 对象被reject。防止出错的方法，也是将其放在try...catch代码块之中。
```js
async function f() {
  try {
    await new Promise(function (resolve, reject) {
      throw new Error('出错了');
    });
  } catch(e) {
  }
  return await('hello world');
}
```

## Class的基本语法
ES6 的类，完全可以看作构造函数的另一种写法。类的数据类型就是函数，类本身就指向构造函数。
```js
class Point {
  // ...
}

typeof Point // "function"
Point === Point.prototype.constructor // true
```
使用的时候，也是直接对类使用new命令，跟构造函数的用法完全一致。构造函数的prototype属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的prototype属性上面。因此，在类的实例上面调用方法，其实就是调用原型上的方法。
```js
class Point {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}

// 等同于

Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};

const point = new Point();
point.constructor === Point.prototype.constructor // true
```
由于类的方法都定义在prototype对象上面，所以类的新方法可以添加在prototype对象上面。Object.assign()方法可以很方便地一次向类添加多个方法。
```js
class Point {
  constructor(){
    // ...
  }
}

Object.assign(Point.prototype, {
  toString(){},
  toValue(){}
});
```
类的内部所有定义的方法，都是不可枚举的（non-enumerable）。
```js
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```

### constructor方法
constructor()方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor()方法，如果没有显式定义，一个空的constructor()方法会被默认添加。
```js
class Point {
}

// 等同于
class Point {
  constructor() {}
}
```

constructor()方法默认返回实例对象（即this），完全可以指定返回另外一个对象。
```js
class Foo {
  constructor() {
    return Object.create(null);
  }
}

new Foo() instanceof Foo
// false
```
上面代码中，constructor()函数返回一个全新的对象，结果导致实例对象不是Foo类的实例。

### 类的实例
类的属性和方法，除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上
```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

var point = new Point(2, 3);

point.toString() // (2, 3)

point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true
```
与 ES5 一样，类的所有实例共享一个原型对象。这也意味着，可以通过实例的__proto__属性为“类”添加方法。

`__proto__` 并不是语言本身的特性，这是各大厂商具体实现时添加的私有属性，虽然目前很多现代浏览器的 JS 引擎中都提供了这个私有属性，但依旧不建议在生产中使用该属性，避免对环境产生依赖。生产环境中，我们可以使用 Object.getPrototypeOf() 方法来获取实例对象的原型，然后再来为原型添加方法/属性。
```js
var p1 = new Point(2,3);
var p2 = new Point(3,2);

p1.__proto__.printName = function () { return 'Oops' };

p1.printName() // "Oops"
p2.printName() // "Oops"

var p3 = new Point(4,2);
p3.printName() // "Oops"
```
由于这么做是直接在类的原型上添加方法属性，那么所有这个类new出的实例都共享这个方法。

### 实例属性的新写法
实例属性现在除了可以定义在constructor()方法里面的this上面，也可以定义在类内部的最顶层。
```js
// 原来的写法
class IncreasingCounter {
  constructor() {
    this._count = 0;
  }
  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}

// 现有的写法
class IncreasingCounter {
  _count = 0;
  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}
```
上面代码中，实例属性_count与取值函数value()和increment()方法，处于同一个层级。这时，不需要在实例属性前面加上this。

注意，新写法定义的属性是实例对象自身的属性，而不是定义在实例对象的原型上面。这种新写法的好处是，所有实例对象自身的属性都定义在类的头部，看上去比较整齐，一眼就能看出这个类有哪些实例属性。

### getter和setter方法
与 ES5 一样，在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
```js
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop
// 'getter'
```
存值函数和取值函数是设置在属性的 Descriptor 对象上的。
```js
class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }

  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }
}

var descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype, "html"
);

"get" in descriptor  // true
"set" in descriptor  // true
```

### 属性表达式
类的属性名，可以采用表达式。
```js
let methodName = 'getArea';

class Square {
  constructor(length) {
    // ...
  }

  [methodName]() {
    // ...
  }
}
```

### Class表达式
与函数一样，类也可以使用表达式的形式定义。
```js
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
```
上面代码使用表达式定义了一个类。需要注意的是，这个类的名字是Me，但是Me只在 Class 的内部可用，指代当前类。在 Class 外部，这个类只能用MyClass引用。
```js
let inst = new MyClass();
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined
```
采用 Class 表达式，可以写出立即执行的 Class。
```js
let person = new class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('张三');

person.sayName(); // "张三"
```

### 静态方法
类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
```js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function
```

注意，如果静态方法包含this关键字，这个this指的是类，而不是实例。
```js
class Foo {
  static bar() {
    this.baz();
  }
  static baz() {
    console.log('hello');
  }
  baz() {
    console.log('world');
  }
}

Foo.bar() // hello
```
父类的静态方法，可以被子类继承。
```js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
}

Bar.classMethod() // 'hello'
```

静态方法也是可以从super对象上调用的。
```js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
  static classMethod() {
    return super.classMethod() + ', too';
  }
}

Bar.classMethod() // "hello, too"
```

### 静态属性
静态属性指的是 Class 本身的属性，即Class.propName，而不是定义在实例对象（this）上的属性。
```js
class Foo {
}

Foo.prop = 1;
Foo.prop // 1
```
目前，只有这种写法可行，因为 ES6 明确规定，Class 内部只有静态方法，没有静态属性。现在有一个提案提供了类的静态属性，写法是在实例属性的前面，加上static关键字。
```js
class MyClass {
  static myStaticProp = 42;

  constructor() {
    console.log(MyClass.myStaticProp); // 42
  }
}
```
目前ES2022已经支持了类的静态属性的写法，使用static关键字定义静态属性。

### 私有方法和私有属性
#### 早期解决方案
私有方法和私有属性，是只能在类的内部访问的方法和属性，外部不能访问。这是常见需求，有利于代码的封装，但早期的 ES6 不提供，只能通过变通方法模拟实现。一种做法是在命名上加以区别。
```js
class Widget {

  // 公有方法
  foo (baz) {
    this._bar(baz);
  }

  // 私有方法
  _bar(baz) {
    return this.snaf = baz;
  }

  // ...
}
```
上面代码中，_bar()方法前面的下划线，表示这是一个只限于内部使用的私有方法。但是，这种命名是不保险的，在类的外部，还是可以调用到这个方法。

另一种方法就是索性将私有方法移出类，因为类内部的所有方法都是对外可见的。
```js
class Widget {
  foo (baz) {
    bar.call(this, baz);
  }

  // ...
}

function bar(baz) {
  return this.snaf = baz;
}
```
上面代码中，foo是公开方法，内部调用了bar.call(this, baz)。这使得bar()实际上成为了当前类的私有方法。

还有一种方法是利用Symbol值的唯一性，将私有方法的名字命名为一个Symbol值。
```js
const bar = Symbol('bar');
const snaf = Symbol('snaf');

export default class myClass{

  // 公有方法
  foo(baz) {
    this[bar](baz);
  }

  // 私有方法
  [bar](baz) {
    return this[snaf] = baz;
  }

  // ...
};
```
上面代码中，bar和snaf都是Symbol值，一般情况下无法获取到它们，因此达到了私有方法和私有属性的效果。但是也不是绝对不行，Reflect.ownKeys()依然可以拿到它们。

#### 私有属性的正式写法
ES2022正式为class添加了私有属性，方法是在属性名之前使用#表示。
```js
class IncreasingCounter {
  #count = 0;
  get value() {
    console.log('Getting the current value!');
    return this.#count;
  }
  increment() {
    this.#count++;
  }
}
```
上面代码中，#count就是私有属性，只能在类的内部使用（this.#count）。如果在类的外部使用，就会报错。

另外，不管在类的内部或外部，读取一个不存在的私有属性，也都会报错。这跟公开属性的行为完全不同，如果读取一个不存在的公开属性，不会报错，只会返回undefined。
```js
class IncreasingCounter {
  #count = 0;
  get value() {
    console.log('Getting the current value!');
    return this.#myCount; // 报错
  }
  increment() {
    this.#count++;
  }
}

const counter = new IncreasingCounter();
counter.#myCount // 报错
```

注意，私有属性的属性名必须包括#，如果不带#，会被当作另一个属性。
```js
class Point {
  #x;

  constructor(x = 0) {
    this.#x = +x;
  }

  get x() {
    return this.#x;
  }

  set x(value) {
    this.#x = +value;
  }
}
```
上面代码中，#x就是私有属性，在Point类之外是读取不到这个属性的。由于井号#是属性名的一部分，使用时必须带有#一起使用，所以#x和x是两个不同的属性。

这种写法不仅可以写私有属性，还可以用来写私有方法。另外，私有属性也可以设置 getter 和 setter 方法。
```js
class Counter {
  #xValue = 0;

  constructor() {
    console.log(this.#x);
  }

  get #x() { return this.#xValue; }
  set #x(value) {
    this.#xValue = value;
  }
}
```

私有属性不限于从this引用，只要是在类的内部，实例也可以引用私有属性。
```js
class Foo {
  #privateValue = 42;
  static getPrivateValue(foo) {
    return foo.#privateValue;
  }
}

Foo.getPrivateValue(new Foo()); // 42
```

私有属性和私有方法前面，也可以加上static关键字，表示这是一个静态的私有属性或私有方法。
```js
class FakeMath {
  static PI = 22 / 7;
  static #totallyRandomNumber = 4;

  static #computeRandomNumber() {
    return FakeMath.#totallyRandomNumber;
  }

  static random() {
    console.log('I heard you like random numbers…')
    return FakeMath.#computeRandomNumber();
  }
}

FakeMath.PI // 3.142857142857143
FakeMath.random()
// I heard you like random numbers…
// 4
FakeMath.#totallyRandomNumber // 报错
FakeMath.#computeRandomNumber() // 报错
```

#### in运算符
前面说过，直接访问某个类不存在的私有属性会报错，但是访问不存在的公开属性不会报错。这个特性可以用来判断，某个对象是否为类的实例。
```js
class C {
  #brand;

  static isC(obj) {
    try {
      obj.#brand;
      return true;
    } catch {
      return false;
    }
  }
}
```
上面示例中，类C的静态方法isC()就用来判断，某个对象是否为C的实例。它采用的方法就是，访问该对象的私有属性#brand。如果不报错，就会返回true；如果报错，就说明该对象不是当前类的实例，从而catch部分返回false。

因此，try...catch结构可以用来判断某个私有属性是否存在。但是，这样的写法很麻烦，代码可读性很差，ES2022 改进了in运算符，使它也可以用来判断私有属性。
```js
class C {
  #brand;

  static isC(obj) {
    if (#brand in obj) {
      // 私有属性 #brand 存在
      return true;
    } else {
      // 私有属性 #brand 不存在
      return false;
    }
  }
}
```
上面示例中，in运算符判断某个对象是否有私有属性#brand。它不会报错，而是返回一个布尔值。

这种用法的in，也可以跟this一起配合使用。注意，判断私有属性时，in只能用在类的内部。另外，判断所针对的私有属性，一定要先声明，否则会报错。
```js
class A {
  #foo = 0;
  m() {
    console.log(#foo in this); // true
  }
}

class B {
  m() {
    console.log(#foo in this); // 报错
  }
}
```

### 静态块
静态属性的一个问题是，如果它有初始化逻辑，这个逻辑要么写在类的外部，要么写在constructor()方法里面。
```js
class C {
  static x = 234;
  static y;
  static z;
}

try {
  const obj = doSomethingWith(C.x);
  C.y = obj.y
  C.z = obj.z;
} catch {
  C.y = ...;
  C.z = ...;
}
```
上面示例中，静态属性y和z的值依赖于静态属性x的运算结果，这段初始化逻辑写在类的外部（上例的try...catch代码块）。另一种方法是写到类的constructor()方法里面。这两种方法都不是很理想，前者是将类的内部逻辑写到了外部，后者则是每次新建实例都会运行一次。

为了解决这个问题，ES2022 引入了静态块（static block），允许在类的内部设置一个代码块，在类生成时运行且只运行一次，主要作用是对静态属性进行初始化。以后，新建类的实例时，这个块就不运行了。
```js
class C {
  static x = ...;
  static y;
  static z;

  static {
    try {
      const obj = doSomethingWith(this.x);
      this.y = obj.y;
      this.z = obj.z;
    }
    catch {
      this.y = ...;
      this.z = ...;
    }
  }
}
```
上面代码中，类的内部有一个 static 代码块，这就是静态块。它的好处是将静态属性y和z的初始化逻辑，写入了类的内部，而且只运行一次。每个类允许有多个静态块，每个静态块中只能访问之前声明的静态属性。另外，静态块的内部不能有return语句。静态块内部可以使用类名或this，指代当前类。
```js
class C {
  static x = 1;
  static {
    this.x; // 1
    // 或者
    C.x; // 1
  }
}
```
除了静态属性的初始化，静态块还有一个作用，就是将私有属性与类的外部代码分享。
```js
let getX;

export class C {
  #x = 1;
  static {
    getX = obj => obj.#x;
  }
}

console.log(getX(new C())); // 1
```

## Class的继承
Class 可以通过extends关键字实现继承，让子类继承父类的属性和方法。extends 的写法比 ES5 的原型链继承，要清晰和方便很多。
```js
class Point { /* ... */ }

class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}
```
super在这里表示父类的构造函数，用来新建一个父类的实例对象。ES6 规定，子类必须在constructor()方法中调用super()，否则就会报错。这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，添加子类自己的实例属性和方法。如果不调用super()方法，子类就得不到自己的this对象。

为什么子类的构造函数，一定要调用super()？原因就在于 ES6 的继承机制，与 ES5 完全不同。ES5 的继承机制，是先创造一个独立的子类的实例对象，然后再将父类的方法添加到这个对象上面，即“实例在前，继承在后”。ES6 的继承机制，则是先将父类的属性和方法，加到一个空的对象上面，然后再将该对象作为子类的实例，即“继承在前，实例在后”。这就是为什么 ES6 的继承必须先调用super()方法，因为这一步会生成一个继承父类的this对象，没有这一步就无法继承父类。

注意，这意味着新建子类实例时，父类的构造函数必定会先运行一次。
```js
class Foo {
  constructor() {
    console.log(1);
  }
}

class Bar extends Foo {
  constructor() {
    super();
    console.log(2);
  }
}

const bar = new Bar();
// 1
// 2
```
另一个需要注意的地方是，在子类的构造函数中，只有调用super()之后，才可以使用this关键字，否则会报错。这是因为子类实例的构建，必须先完成父类的继承，只有super()方法才能让子类实例继承父类。
```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    this.color = color; // ReferenceError
    super(x, y);
    this.color = color; // 正确
  }
}
```
如果子类没有定义constructor()方法，这个方法会默认添加，并且里面会调用super()。也就是说，不管有没有显式定义，任何一个子类都有constructor()方法。
```js
class ColorPoint extends Point {
}

// 等同于
class ColorPoint extends Point {
  constructor(...args) {
    super(...args);
  }
}
```

### 私有属性和私有方法的继承
父类所有的属性和方法，都会被子类继承，除了私有的属性和方法。子类无法继承父类的私有属性，或者说，私有属性只能在定义它的 class 里面使用。
```js
class Foo {
  #p = 1;
  #m() {
    console.log('hello');
  }
}

class Bar extends Foo {
  constructor() {
    super();
    console.log(this.#p); // 报错
    this.#m(); // 报错
  }
}
```
如果父类定义了私有属性的读写方法，子类就可以通过这些方法，读写私有属性。
```js
class Foo {
  #p = 1;
  getP() {
    return this.#p;
  }
}

class Bar extends Foo {
  constructor() {
    super();
    console.log(this.getP()); // 1
  }
}
```

### 静态属性与静态方法的继承
父类的静态属性和静态方法，也会被子类继承。
```js
class A {
  static hello() {
    console.log('hello world');
  }
}

class B extends A {
}

B.hello()  // hello world
```
注意，静态属性是通过浅拷贝实现继承的。由于这种拷贝是浅拷贝，如果父类的静态属性的值是一个对象，那么子类的静态属性也会指向这个对象，因为浅拷贝只会拷贝对象的内存地址。
```js
class A { static foo = 100; }
class B extends A {
  constructor() {
    super();
    B.foo--;
  }
}

const b = new B();
B.foo // 99
A.foo // 100

class C { 
  static foo = { n: 100 };
}
class D extends C {
  constructor() {
    super();
    D.foo.n--;
  }
}
const d = new D();
D.foo.n // 99
C.foo.n // 99
```

### Object.getPrototypeOf()
Object.getPrototypeOf()方法可以用来从子类上获取父类。
```js
class Point { /*...*/ }

class ColorPoint extends Point { /*...*/ }

Object.getPrototypeOf(ColorPoint) === Point
// true
```

### super关键字
super这个关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。

第一种情况，super作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次super()函数。
```js
class A {}

class B extends A {
  constructor() {
    super();
  }
}
```
调用super()的作用是形成子类的this对象，把父类的实例属性和方法放到这个this对象上面。子类在调用super()之前，是没有this对象的，任何对this的操作都要放在super()的后面。

注意，这里的super虽然代表了父类的构造函数，但是因为返回的是子类的this（即子类的实例对象），所以super内部的this代表子类的实例，而不是父类的实例，这里的super()相当于A.prototype.constructor.call(this)（在子类的this上运行父类的构造函数）。

不过，由于super()在子类构造方法中执行时，子类的属性和方法还没有绑定到this，所以如果存在同名属性，此时拿到的是父类的属性。
```js
class A {
  name = 'A';
  constructor() {
    console.log('My name is ' + this.name);
  }
}

class B extends A {
  name = 'B';
}

const b = new B(); // My name is A
```

作为函数时，super()只能用在子类的构造函数之中，用在其他地方就会报错。

第二种情况，super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
```js
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();
```
这里需要注意，由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。
```js
class A {
  constructor() {
    this.p = 2;   // this指向A的实例
  }
}

class B extends A {
  get m() {
    return super.p;
  }
}

let b = new B();
b.m // undefined
```
如果属性定义在父类的原型对象上，super就可以取到。
```js
class A {}
A.prototype.x = 2;

class B extends A {
  constructor() {
    super();
    console.log(super.x) // 2
  }
}

let b = new B();
```
ES6 规定，在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例。
```js
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m() // 2
```

由于this指向子类实例，所以如果通过super对某个属性赋值，这时super就是this，赋值的属性会变成子类实例的属性。
```js
class A {
  constructor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    console.log(super.x); // undefined
    console.log(this.x); // 3
  }
}

let b = new B();
```
如果super作为对象，用在静态方法之中，这时super将指向父类，而不是父类的原型对象。
```js
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }

  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }

  myMethod(msg) {
    super.myMethod(msg);
  }
}

Child.myMethod(1); // static 1

var child = new Child();
child.myMethod(2); // instance 2
```

另外，在子类的静态方法中通过super调用父类的方法时，方法内部的this指向当前的子类，而不是子类的实例。
```js
class A {
  constructor() {
    this.x = 1;
  }
  static print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  static m() {
    super.print();
  }
}

B.x = 3;
B.m() // 3
```

由于对象总是继承其他对象的，所以可以在任意一个对象中，使用super关键字。
```js
var obj = {
  toString() {
    return "MyObject: " + super.toString();
  }
};

obj.toString(); // MyObject: [object Object]
```

### 类的 prototype 属性和__proto__属性
大多数浏览器的 ES5 实现之中，每一个对象都有__proto__属性，指向对应的构造函数的prototype属性。Class 作为构造函数的语法糖，同时有prototype属性和__proto__属性，因此同时存在两条继承链。
- 子类的__proto__属性，表示构造函数的继承，总是指向父类。
- 子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性。
```js
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```
这样的结果是因为，类的继承是按照下面的模式实现的。
```js
class A {
}

class B {
}

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);

// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);

const b = new B();
```
这两条继承链，可以这样理解：作为一个对象，子类（B）的原型（__proto__属性）是父类（A）；作为一个构造函数，子类（B）的原型对象（prototype属性）是父类的原型对象（prototype属性）的实例。
```js
B.prototype = Object.create(A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;
```
下面，讨论两种情况。第一种，子类继承Object类。
```js
class A extends Object {

}

A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true
```
第二种情况，不存在任何继承。
```js
class A {
}

A.__proto__ === Function.prototype // true
A.prototype.__proto__ === Object.prototype // true
```

#### 实例的 __proto__ 属性
子类实例的__proto__属性的__proto__属性，指向父类实例的__proto__属性。也就是说，子类的原型的原型，是父类的原型。
```js
var p1 = new Point(2, 3);
var p2 = new ColorPoint(2, 3, 'red');

p2.__proto__ === p1.__proto__ // false
p2.__proto__.__proto__ === p1.__proto__ // true
```
因此，通过子类实例的__proto__.__proto__属性，可以修改父类实例的行为。
```js
p2.__proto__.__proto__.printName = function () {
  console.log('Ha');
};

p1.printName() // "Ha"
```

### Mixin 模式的实现
Mixin 指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口。它的最简单实现如下。
```js
const a = {
  a: 'a'
};
const b = {
  b: 'b'
};
const c = {...a, ...b}; // {a: 'a', b: 'b'}
```
下面是一个更完备的实现，将多个类的接口“混入”（mix in）另一个类。
```js
function mix(...mixins) {
  class Mix {
    constructor() {
      for (let mixin of mixins) {
        copyProperties(this, new mixin()); // 拷贝实例属性
      }
    }
  }

  for (let mixin of mixins) {
    copyProperties(Mix, mixin); // 拷贝静态属性
    copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if ( key !== 'constructor'
      && key !== 'prototype'
      && key !== 'name'
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
```
上面代码的mix函数，可以将多个对象合成为一个类。使用的时候，只要继承这个类即可。
```js
class DistributedEdit extends mix(Loggable, Serializable) {
  // ...
}
```

## Module的语法
在 ES6 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。前者用于服务器，后者用于浏览器。ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。
```js
// CommonJS模块
let { stat, exists, readfile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
```
上面代码的实质是整体加载fs模块（即加载fs的所有方法），生成一个对象（_fs），然后再从这个对象上面读取 3 个方法。这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。

ES6 模块不是对象，而是通过export命令显式指定输出的代码，再通过import命令输入。
```js
// ES6模块
import { stat, exists, readFile } from 'fs';
```
上面代码的实质是从fs模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。

由于 ES6 模块是编译时加载，使得静态分析成为可能。有了它，就能进一步拓宽 JavaScript 的语法，比如引入宏（macro）和类型检验（type system）这些只能靠静态分析实现的功能。

除了静态加载带来的各种好处，ES6 模块还有以下好处。
- 不再需要UMD模块格式了，将来服务器和浏览器都会支持 ES6 模块格式。目前，通过各种工具库，其实已经做到了这一点。
- 将来浏览器的新 API 就能用模块格式提供，不再必须做成全局变量或者navigator对象的属性。
- 不再需要对象作为命名空间（比如Math对象），未来这些功能可以通过模块提供。

### export命令
export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。
```js
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);
```
这一点与 CommonJS 规范完全不同。CommonJS 模块输出的是值的缓存，不存在动态更新。

export命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，import命令也是如此。这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。

### import命令
import命令具有提升效果，会提升到整个模块的头部，首先执行。

### 模块的整体加载
除了指定加载某个输出值，还可以使用整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面。

注意，模块整体加载所在的那个对象，应该是可以静态分析的，所以不允许运行时改变。下面的写法都是不允许的。

### export default 命令
`export default`命令用于指定模块的默认输出。显然，一个模块只能有一个默认输出，因此`export default`命令只能使用一次。所以，import命令后面才不用加大括号，因为只可能唯一对应`export default`命令。

本质上，export default就是输出一个叫做default的变量或方法，然后系统允许你为它取任意名字。所以，下面的写法是有效的。正是因为export default命令其实只是输出一个叫做default的变量，所以它后面不能跟变量声明语句。同样地，因为export default命令的本质是将后面的值，赋给default变量，所以可以直接将一个值写在export default之后。

### import()函数
import命令会被 JavaScript 引擎静态分析，先于模块内的其他语句执行（import命令叫做“连接” binding 其实更合适）。所以，下面的代码会报错。
```js
// 报错
if (x === 2) {
  import MyModual from './myModual';
}
```
这样的设计，固然有利于编译器提高效率，但也导致无法在运行时加载模块。在语法上，条件加载就不可能实现。如果import命令要取代 Node 的require方法，这就形成了一个障碍。因为require是运行时加载模块，import命令无法取代require的动态加载功能。
```js
const path = './' + fileName;
const myModual = require(path);
```

ES2020提案 引入import()函数，支持动态加载模块。
```js
import(specifier)
```
上面代码中，import函数的参数specifier，指定所要加载的模块的位置。import命令能够接受什么参数，import()函数就能接受什么参数，两者区别主要是后者为动态加载。import()返回一个 Promise 对象。

import()函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。它是运行时执行，也就是说，什么时候运行到这一句，就会加载指定的模块。另外，import()函数与所加载的模块没有静态连接关系，这点也是与import语句不相同。import()类似于 Node.js 的require()方法，区别主要是前者是异步加载，后者是同步加载。

由于import()返回 Promise对象，所以需要使用then()方法指定处理函数。考虑到代码的清晰，更推荐使用await命令。
```js
async function renderWidget() {
  const container = document.getElementById('widget');
  if (container !== null) {
    // 等同于
    // import("./widget").then(widget => {
    //   widget.render(container);
    // });
    const widget = await import('./widget.js');
    widget.render(container);
  }
}

renderWidget();
```

适用场合：
- 按需加载。import()可以在需要的时候，再加载某个模块。
- 条件加载。import()可以放在if代码块，根据不同的情况，加载不同的模块。
- 动态的模块路径。import()允许模块路径动态生成。

## Module的加载实现
### 浏览器加载
#### 传统方法
HTML 网页中，浏览器通过`<script>`标签加载 JavaScript 脚本。默认情况下，浏览器是同步加载 JavaScript 脚本，即渲染引擎遇到`<script>`标签就会停下来，等到执行完脚本，再继续向下渲染。如果是外部脚本，还必须加入脚本下载的时间。

如果脚本体积很大，下载和执行的时间就会很长，因此造成浏览器堵塞，用户会感觉到浏览器“卡死”了，没有任何响应。这显然是很不好的体验，所以浏览器允许脚本异步加载，下面就是两种异步加载的语法。
```js
<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
```
`<script>`标签打开defer或async属性，脚本就会异步加载。渲染引擎遇到这一行命令，就会开始下载外部脚本，但不会等它下载和执行，而是直接执行后面的命令。

defer与async的区别是：defer要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；async一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。一句话，defer是“渲染完再执行”，async是“下载完就执行”。另外，如果有多个defer脚本，会按照它们在页面出现的顺序加载，而多个async脚本是不能保证加载顺序的。

#### 加载规则
浏览器加载 ES6 模块，也使用`<script>`标签，但是要加入type="module"属性。
```js
<script type="module" src="./foo.js"></script>
```
浏览器对于带有type="module"的`<script>`，都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，等同于打开了`<script>`标签的defer属性。

如果网页有多个`<script type="module">`，它们会按照在页面出现的顺序依次执行。

`<script>`标签的async属性也可以打开，这时只要加载完成，渲染引擎就会中断渲染立即执行。执行完成后，再恢复渲染。
```js
<script type="module" src="./foo.js" async></script>
```
一旦使用了async属性，`<script type="module">`就不会按照在页面出现的顺序执行，而是只要该模块加载完成，就执行该模块。

ES6 模块也允许内嵌在网页中，语法行为与加载外部脚本完全一致。
```js
<script type="module">
  import utils from "./utils.js";

  // other code
</script>
```
对于外部的模块脚本，有几点需要注意。
- 代码是在模块作用域之中运行，而不是在全局作用域运行。模块内部的顶层变量，外部不可见。
- 模块脚本自动采用严格模式，不管有没有声明use strict。
- 模块之中，可以使用import命令加载其他模块（.js后缀不可省略，需要提供绝对 URL 或相对 URL），也可以使用export命令输出对外接口。
- 模块之中，顶层的this关键字返回undefined，而不是指向window。也就是说，在模块顶层使用this关键字，是无意义的。
- 同一个模块如果加载多次，将只执行一次。

### ES6 模块与 CommonJS 模块的差异
它们有三个重大差异。
- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。

第二个差异是因为 CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};

// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
```
ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的import有点像 Unix 系统的“符号连接”，原始值变了，import加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。
```js
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```
由于 ES6 输入的模块变量，只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值会报错。

### Node.js 的模块加载方法
JavaScript 现在有两种模块。一种是 ES6 模块，简称 ESM；另一种是 CommonJS 模块，简称 CJS。

CommonJS 模块是 Node.js 专用的，与 ES6 模块不兼容。语法上面，两者最明显的差异是，CommonJS 模块使用require()和module.exports，ES6 模块使用import和export。

它们采用不同的加载方案。从 Node.js v13.2 版本开始，Node.js 已经默认打开了 ES6 模块支持。Node.js 要求 ES6 模块采用.mjs后缀文件名。也就是说，只要脚本文件里面使用import或者export命令，那么就必须采用.mjs后缀名。Node.js 遇到.mjs文件，就认为它是 ES6 模块，默认启用严格模式，不必在每个模块文件顶部指定"use strict"。

如果不希望将后缀名改成.mjs，可以在项目的package.json文件中，指定type字段为module。
```js
{
   "type": "module"
}
```

如果这时还要使用 CommonJS 模块，那么需要将 CommonJS 脚本的后缀名都改成.cjs。如果没有type字段，或者type字段为commonjs，则.js脚本会被解释成 CommonJS 模块。

总结为一句话：.mjs文件总是以 ES6 模块加载，.cjs文件总是以 CommonJS 模块加载，.js文件的加载取决于package.json里面type字段的设置。

注意，ES6 模块与 CommonJS 模块尽量不要混用。require命令不能加载.mjs文件，会报错，只有import命令才可以加载.mjs文件。反过来，.mjs文件里面也不能使用require命令，必须使用import。

#### package.json 的 main 字段
package.json文件有两个字段可以指定模块的入口文件：main和exports。比较简单的模块，可以只使用main字段，指定模块加载的入口文件。
```js
// ./node_modules/es-module-package/package.json
{
  "type": "module",
  "main": "./src/index.js"
}
```
上面代码指定项目的入口脚本为./src/index.js，它的格式为 ES6 模块。如果没有type字段，index.js就会被解释为 CommonJS 模块。

然后，import命令就可以加载这个模块。
```js
// ./my-app.mjs

import { something } from 'es-module-package';
// 实际加载的是 ./node_modules/es-module-package/src/index.js
```
上面代码中，运行该脚本以后，Node.js 就会到./node_modules目录下面，寻找es-module-package模块，然后根据该模块package.json的main字段去执行入口文件。

这时，如果用 CommonJS 模块的require()命令去加载es-module-package模块会报错，因为 CommonJS 模块不能处理export命令。


#### package.json 的 exports 字段 
exports字段的优先级高于main字段。它有多种用法。
##### 子目录别名
package.json文件的exports字段可以指定脚本或子目录的别名。
```js
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./submodule": "./src/submodule.js"
  }
}
```
上面的代码指定src/submodule.js别名为submodule，然后就可以从别名加载这个文件。
```js
import submodule from 'es-module-package/submodule';
// 加载 ./node_modules/es-module-package/src/submodule.js
```
如果没有指定别名，就不能用“模块+脚本名”这种形式加载脚本。
```js
// 报错
import submodule from 'es-module-package/private-module.js';

// 不报错
import submodule from './node_modules/es-module-package/private-module.js';
```

##### main的别名
exports字段的别名如果是.，就代表模块的主入口，优先级高于main字段，并且可以直接简写成exports字段的值。
```js
{
  "exports": {
    ".": "./main.js"
  }
}

// 等同于
{
  "exports": "./main.js"
}
```
由于exports字段只有支持 ES6 的 Node.js 才认识，所以可以搭配main字段，来兼容旧版本的 Node.js。
```js
{
  "main": "./main-legacy.cjs",
  "exports": {
    ".": "./main-modern.cjs"
  }
}
```
上面代码中，老版本的 Node.js （不支持 ES6 模块）的入口文件是main-legacy.cjs，新版本的 Node.js 的入口文件是main-modern.cjs。

##### 条件加载
利用.这个别名，可以为 ES6 模块和 CommonJS 指定不同的入口。
```js
{
  "type": "module",
  "exports": {
    ".": {
      "require": "./main.cjs",
      "default": "./main.js"
    }
  }
}
```
上面代码中，别名.的require条件指定require()命令的入口文件（即 CommonJS 的入口），default条件指定其他情况的入口（即 ES6 的入口）。上面的写法可以简写如下。
```js
{
  "exports": {
    "require": "./main.cjs",
    "default": "./main.js"
  }
}
```
注意，如果同时还有其他别名，就不能采用简写，否则会报错。
```js
{
  // 报错
  "exports": {
    "./feature": "./lib/feature.js",
    "require": "./main.cjs",
    "default": "./main.js"
  }
}
```

#### CommonJS 模块加载 ES6 模块
CommonJS 的require()命令不能加载 ES6 模块，会报错，只能使用import()这个方法加载。
```js
(async () => {
  await import('./my-app.mjs');
})();
```
上面代码可以在 CommonJS 模块中运行。

require()不支持 ES6 模块的一个原因是，它是同步加载，而 ES6 模块内部可以使用顶层await命令，导致无法被同步加载。

#### ES6 模块加载 CommonJS 模块
ES6 模块的import命令可以加载 CommonJS 模块，但是只能整体加载，不能只加载单一的输出项。
```js
// 正确
import packageMain from 'commonjs-package';

// 报错
import { method } from 'commonjs-package';
```
这是因为 ES6 模块需要支持静态代码分析，而 CommonJS 模块的输出接口是module.exports，是一个对象，无法被静态分析，所以只能整体加载。

加载单一的输出项，可以写成下面这样。
```js
import packageMain from 'commonjs-package';
const { method } = packageMain;
```

#### 同时支持两种格式的模块
一个模块同时要支持 CommonJS 和 ES6 两种格式，也很容易。

如果原始模块是 ES6 格式，那么需要给出一个整体输出接口，比如export default obj，使得 CommonJS 可以用import()进行加载。

如果原始模块是 CommonJS 格式，那么可以加一个包装层。
```js
import cjsModule from '../index.js';
export const foo = cjsModule.foo;
```
上面代码先整体输入 CommonJS 模块，然后再根据需要输出具名接口。

你可以把这个文件的后缀名改为`.mjs`，或者将它放在一个子目录，再在这个子目录里面放一个单独的`package.json`文件，指明`{ type: "module" }`。

另一种做法是在package.json文件的exports字段，指明两种格式模块各自的加载入口。
```js
"exports"：{
  "require": "./index.js"，
  "import": "./esm/wrapper.js"
}
```
上面代码指定require()和import，加载该模块会自动切换到不一样的入口文件。

#### Node.js 的内置模块
Node.js 的内置模块可以整体加载，也可以加载指定的输出项。
```js
// 整体加载
import EventEmitter from 'events';
const e = new EventEmitter();

// 加载指定的输出项
import { readFile } from 'fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
```

#### 加载路径
ES6 模块的加载路径必须给出脚本的完整路径，不能省略脚本的后缀名。import命令和package.json文件的main字段如果省略脚本的后缀名，会报错。
```js
// ES6 模块中将报错
import { something } from './index';
```
为了与浏览器的import加载规则相同，Node.js 的.mjs文件支持 URL 路径。
```js
import './foo.mjs?query=1'; // 加载 ./foo 传入参数 ?query=1
```
目前，Node.js 的import命令只支持加载本地模块（file:协议）和data:协议，不支持加载远程模块。另外，脚本路径只支持相对路径，不支持绝对路径（即以/或//开头的路径）。

#### 内部变量
ES6 模块应该是通用的，同一个模块不用修改，就可以用在浏览器环境和服务器环境。为了达到这个目标，Node.js 规定 ES6 模块之中不能使用 CommonJS 模块的特有的一些内部变量。

首先，就是this关键字。ES6 模块之中，顶层的this指向undefined；CommonJS 模块的顶层this指向当前模块，这是两者的一个重大差异。

其次，以下这些顶层变量在 ES6 模块之中都是不存在的。
- arguments
- require
- module
- exports
- __filename
- __dirname

### 循环加载
“循环加载”（circular dependency）指的是，a脚本的执行依赖b脚本，而b脚本的执行又依赖a脚本。
```js
// a.js
var b = require('b');

// b.js
var a = require('a');
```
通常，“循环加载”表示存在强耦合，如果处理不好，还可能导致递归加载，使得程序无法执行，因此应该避免出现。

但是实际上，这是很难避免的，尤其是依赖关系复杂的大项目，很容易出现a依赖b，b依赖c，c又依赖a这样的情况。这意味着，模块加载机制必须考虑“循环加载”的情况。

对于 JavaScript 语言来说，目前最常见的两种模块格式 CommonJS 和 ES6，处理“循环加载”的方法是不一样的，返回的结果也不一样。

#### CommonJS 模块的加载原理
CommonJS 的一个模块，就是一个脚本文件。require命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。
```js
{
  id: '...',
  exports: { ... },
  loaded: true,
  ...
}
```
上面代码就是 Node 内部加载模块后生成的一个对象。该对象的id属性是模块名，exports属性是模块输出的各个接口，loaded属性是一个布尔值，表示该模块的脚本是否执行完毕。其他还有很多属性，这里都省略了。

以后需要用到这个模块的时候，就会到exports属性上面取值。即使再次执行require命令，也不会再次执行该模块，而是到缓存之中取值。也就是说，CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。

#### CommonJS 模块的循环加载
CommonJS 模块的重要特性是加载时执行，即脚本代码在require的时候，就会全部执行。一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。

总之，CommonJS 输入的是被输出值的拷贝，不是引用。另外，由于 CommonJS 模块遇到循环加载时，返回的是当前已经执行的部分的值，而不是代码全部执行后的值，两者可能会有差异。所以，输入变量的时候，必须非常小心。

#### ES6模块的循环加载
ES6 处理“循环加载”与 CommonJS 有本质的不同。ES6 模块是动态引用，如果使用import从一个模块加载变量（即import foo from 'foo'），那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。
```js
// a.mjs
import {bar} from './b';
console.log('a.mjs');
console.log(bar);
export let foo = 'foo';

// b.mjs
import {foo} from './a';
console.log('b.mjs');
console.log(foo);
export let bar = 'bar';
```
上面代码中，a.mjs加载b.mjs，b.mjs又加载a.mjs，构成循环加载。执行a.mjs，结果如下。
```js
$ node --experimental-modules a.mjs
b.mjs
ReferenceError: foo is not defined
```
上面代码中，执行a.mjs以后会报错，foo变量未定义，这是为什么？首先，执行a.mjs以后，引擎发现它加载了b.mjs，因此会优先执行b.mjs，然后再执行a.mjs。接着，执行b.mjs的时候，已知它从a.mjs输入了foo接口，这时不会去执行a.mjs，而是认为这个接口已经存在了，继续往下执行。执行到第三行console.log(foo)的时候，才发现这个接口根本没定义，因此报错。

解决这个问题的方法，就是让b.mjs运行的时候，foo已经有定义了。这可以通过将foo写成函数来解决。
```js
// a.mjs
import {bar} from './b';
console.log('a.mjs');
console.log(bar());
function foo() { return 'foo' }
export {foo};

// b.mjs
import {foo} from './a';
console.log('b.mjs');
console.log(foo());
function bar() { return 'bar' }
export {bar};
```
这时再执行a.mjs就可以得到预期结果。
```js
$ node --experimental-modules a.mjs
b.mjs
foo
a.mjs
bar
```
这是因为函数具有提升作用，在执行`import {bar} from './b'`时，函数foo就已经有定义了，所以`b.mjs`加载的时候不会报错。这也意味着，如果把函数`foo`改写成函数表达式，也会报错。
```js
// a.mjs
import {bar} from './b';
console.log('a.mjs');
console.log(bar());
const foo = () => 'foo';
export {foo};
```
上面代码的第四行，改成了函数表达式，就不具有提升作用，执行就会报错。


## ArrayBuffer
ArrayBuffer对象、TypedArray视图和DataView视图是 JavaScript 操作二进制数据的一个接口。这些对象早就存在，属于独立的规格（2011 年 2 月发布），ES6 将它们纳入了 ECMAScript 规格，并且增加了新的方法。它们都是以数组的语法处理二进制数据，所以统称为二进制数组。

这个接口的原始设计目的，与 WebGL 项目有关。所谓 WebGL，就是指浏览器与显卡之间的通信接口，为了满足 JavaScript 与显卡之间大量的、实时的数据交换，它们之间的数据通信必须是二进制的，而不能是传统的文本格式。文本格式传递一个 32 位整数，两端的 JavaScript 脚本与显卡都要进行格式转化，将非常耗时。这时要是存在一种机制，可以像 C 语言那样，直接操作字节，将 4 个字节的 32 位整数，以二进制形式原封不动地送入显卡，脚本的性能就会大幅提升。

二进制数组就是在这种背景下诞生的。它很像 C 语言的数组，允许开发者以数组下标的形式，直接操作内存，大大增强了 JavaScript 处理二进制数据的能力，使得开发者有可能通过 JavaScript 与操作系统的原生接口进行二进制通信。

二进制数组由三类对象组成。
- ArrayBuffer对象：代表内存之中的一段二进制数据，可以通过“视图”进行操作。“视图”部署了数组接口，这意味着，可以用数组的方法操作内存。
- TypedArray视图：共包括 9 种类型的视图，比如Uint8Array（无符号 8 位整数）数组视图, Int16Array（16 位整数）数组视图, Float32Array（32 位浮点数）数组视图等等。
- DataView视图：可以自定义复合格式的视图，比如第一个字节是 Uint8（无符号 8 位整数）、第二、三个字节是 Int16（16 位整数）、第四个字节开始是 Float32（32 位浮点数）等等，此外还可以自定义字节序。

简单说，ArrayBuffer对象代表原始的二进制数据，TypedArray视图用来读写简单类型的二进制数据，DataView视图用来读写复杂类型的二进制数据。

TypedArray视图支持的数据类型一共有12种。
| 数据类型 | 字节长度 | 含义 | 对应的 C 语言类型 |
|---------|---------|------|-----------------|
| Int8 | 1 | 8 位带符号整数 | signed char |
| Uint8 | 1 | 8 位不带符号整数 | unsigned char |
| Uint8C | 1 | 8 位不带符号整数（自动过滤溢出） | unsigned char |
| Int16 | 2 | 16 位带符号整数 | short |
| Uint16 | 2 | 16 位不带符号整数 | unsigned short |
| Int32 | 4 | 32 位带符号整数 | int |
| Uint32 | 4 | 32 位不带符号整数 | unsigned int |
| BigInt64 | 8 | 64 位带符号整数 | |
| BigUint64 | 8 | 64 位无符号整数 | |
| Float16 | 2 | 16 位浮点数 | |
| Float32 | 4 | 32 位浮点数 | float |
| Float64 | 8 | 64 位浮点数 | double |

注意，二进制数组并不是真正的数组，而是类似数组的对象。

很多浏览器操作的 API，用到了二进制数组操作二进制数据，下面是其中的几个。
- Canvas
- Fetch API
- File API
- WebSockets
- XMLHttpRequest

### ArrayBuffer对象
ArrayBuffer对象代表储存二进制数据的一段内存，它不能直接读写，只能通过视图（TypedArray视图和DataView视图)来读写，视图的作用是以指定格式解读二进制数据。

ArrayBuffer也是一个构造函数，可以分配一段可以存放数据的连续内存区域。
```js
const buf = new ArrayBuffer(32);
```
可以看到，ArrayBuffer构造函数的参数是所需要的内存大小（单位字节）。

为了读写这段内容，需要为它指定视图。DataView视图的创建，需要提供ArrayBuffer对象实例作为参数。
```js
const buf = new ArrayBuffer(32);
const dataView = new DataView(buf);
dataView.getUint8(0) // 0
```
上面代码对一段 32 字节的内存，建立DataView视图，然后以不带符号的 8 位整数格式，从头读取 8 位二进制数据，结果得到 0，因为原始内存的ArrayBuffer对象，默认所有位都是 0。

另一种TypedArray视图，与DataView视图的一个区别是，它不是一个构造函数，而是一组构造函数，代表不同的数据格式。
```js
const buffer = new ArrayBuffer(12);  // 12个byte长度的内存

const x1 = new Int32Array(buffer);   // 一块分割为32个bit
x1[0] = 1;
const x2 = new Uint8Array(buffer);   // 一块分割为8个bit
x2[0]  = 2;

x1[0] // 2
```

上面代码对同一段内存，分别建立两种视图：32 位带符号整数（Int32Array构造函数）和 8 位不带符号整数（Uint8Array构造函数）。由于两个视图对应的是同一段内存，一个视图修改底层内存，会影响到另一个视图。

TypedArray视图的构造函数，除了接受ArrayBuffer实例作为参数，还可以接受普通数组作为参数，直接分配内存生成底层的ArrayBuffer实例，并同时完成对这段内存的赋值。
```js
const typedArray = new Uint8Array([0,1,2]); // 数组中每个数字占据一个uint8的内存空间
typedArray.length // 3

typedArray[0] = 5;
typedArray // [5, 1, 2]
```

#### ArrayBuffer.prototype.byteLength
ArrayBuffer实例的byteLength属性，返回所分配的内存区域的字节长度。
```js
const buffer = new ArrayBuffer(32);
buffer.byteLength   // 32
```
如果要分配的内存区域很大，有可能分配失败（因为没有那么多的连续空余内存），所以有必要检查是否分配成功。

#### ArrayBuffer.prototype.slice()
ArrayBuffer实例有一个slice方法，允许将内存区域的一部分，拷贝生成一个新的ArrayBuffer对象。
```js
const buffer = new ArrayBuffer(8);
const newBuffer = buffer.slice(0, 3);
```
上面代码拷贝buffer对象的前 3 个字节（从 0 开始，到第 3 个字节前面结束），生成一个新的ArrayBuffer对象。slice方法其实包含两步，第一步是先分配一段新内存，第二步是将原来那个ArrayBuffer对象拷贝过去。

slice方法接受两个参数，第一个参数表示拷贝开始的字节序号（含该字节），第二个参数表示拷贝截止的字节序号（不含该字节）。如果省略第二个参数，则默认到原ArrayBuffer对象的结尾。

除了slice方法，ArrayBuffer对象不提供任何直接读写内存的方法，只允许在其上方建立视图，然后通过视图读写。

#### ArrayBuffer.isView() 
ArrayBuffer有一个静态方法isView，返回一个布尔值，表示参数是否为ArrayBuffer的视图实例。这个方法大致相当于判断参数，是否为TypedArray实例或DataView实例。
```js
const buffer = new ArrayBuffer(8);
ArrayBuffer.isView(buffer) // false

const v = new Int32Array(buffer);
ArrayBuffer.isView(v) // true
```

### TypedArray 视图
ArrayBuffer对象作为内存区域，可以存放多种类型的数据。同一段内存，不同数据有不同的解读方式，这就叫做“视图”（view）。ArrayBuffer有两种视图，一种是TypedArray视图，另一种是DataView视图。前者的数组成员都是同一个数据类型，后者的数组成员可以是不同的数据类型。

目前，TypedArray视图一共包括 12 种类型，每一种视图都是一种构造函数。
- Int8Array：8 位有符号整数，长度 1 个字节。
- Uint8Array：8 位无符号整数，长度 1 个字节。
- Uint8ClampedArray：8 位无符号整数，长度 1 个字节，溢出处理不同。
- Int16Array：16 位有符号整数，长度 2 个字节。
- Uint16Array：16 位无符号整数，长度 2 个字节。
- Int32Array：32 位有符号整数，长度 4 个字节。
- Uint32Array：32 位无符号整数，长度 4 个字节。
- BigInt64Array: 64 位有符号整数，长度 8 个字节。
- BigUint64Array：64 位无符号整数，长度 8 个字节。
- Float16Array: 16 位浮点数，长度 2 个字节。
- Float32Array：32 位浮点数，长度 4 个字节。
- Float64Array：64 位浮点数，长度 8 个字节。

这12个构造函数生成的数组，统称为TypedArray视图。它们很像普通数组，都有length属性，都能用方括号运算符（[]）获取单个元素，所有数组的方法，在它们上面都能使用。普通数组与 TypedArray 数组的差异主要在以下方面。
- TypedArray 数组的所有成员，都是同一种类型。
- TypedArray 数组的成员是连续的，不会有空位。
- TypedArray 数组成员的默认值为 0。比如，new Array(10)返回一个普通数组，里面没有任何成员，只是 10 个空位；new Uint8Array(10)返回一个 TypedArray 数组，里面 10 个成员都是 0。
- TypedArray 数组只是一层视图，本身不储存数据，它的数据都储存在底层的ArrayBuffer对象之中，要获取底层对象必须使用buffer属性。

#### 构造函数
TypedArray 数组提供12种构造函数，用来生成相应类型的数组实例。构造函数有多种用法。
##### TypedArray(buffer, byteOffset=0, length?)
同一个ArrayBuffer对象之上，可以根据不同的数据类型，建立多个视图。
```js
// 创建一个8字节的ArrayBuffer
const b = new ArrayBuffer(8);

// 创建一个指向b的Int32视图，开始于字节0，直到缓冲区的末尾
const v1 = new Int32Array(b);

// 创建一个指向b的Uint8视图，开始于字节2，直到缓冲区的末尾
const v2 = new Uint8Array(b, 2);

// 创建一个指向b的Int16视图，开始于字节2，长度为2
const v3 = new Int16Array(b, 2, 2);
```
视图的构造函数可以接受三个参数：
- 第一个参数（必需）：视图对应的底层ArrayBuffer对象。
- 第二个参数（可选）：视图开始的字节序号，默认从 0 开始。
- 第三个参数（可选）：视图包含的数据个数，默认直到本段内存区域结束。

注意，第二个参数byteOffset必须与所要建立的数据类型一致，否则会报错。
```js
const buffer = new ArrayBuffer(8);
const i16 = new Int16Array(buffer, 1);
// Uncaught RangeError: start offset of Int16Array should be a multiple of 2
```
上面代码中，新生成一个 8 个字节的ArrayBuffer对象，然后在这个对象的第一个字节，建立带符号的 16 位整数视图，结果报错。因为，带符号的 16 位整数需要两个字节，所以byteOffset参数必须能够被 2 整除。

如果想从任意字节开始解读ArrayBuffer对象，必须使用DataView视图，因为TypedArray视图只提供 12 种固定的解读格式。

##### TypedArray(length)
视图还可以不通过ArrayBuffer对象，直接分配内存而生成。
```js
const f64a = new Float64Array(8);
f64a[0] = 10;
f64a[1] = 20;
f64a[2] = f64a[0] + f64a[1];
```
上面代码生成一个 8 个成员的Float64Array数组（共 64 字节），然后依次对每个成员赋值。这时，视图构造函数的参数就是成员的个数。可以看到，视图数组的赋值操作与普通数组的操作毫无两样。

##### TypedArray(typedArray)
TypedArray 数组的构造函数，可以接受另一个TypedArray实例作为参数。
```js
const typedArray = new Int8Array(new Uint8Array(4));
```
注意，此时生成的新数组，只是复制了参数数组的值，对应的底层内存是不一样的。新数组会开辟一段新的内存储存数据，不会在原数组的内存之上建立视图。
```js
const x = new Int8Array([1, 1]);
const y = new Int8Array(x);
x[0] // 1
y[0] // 1

x[0] = 2;
y[0] // 1
```

如果想基于同一段内存，构造不同的视图，可以采用下面的写法。
```js
const x = new Int8Array([1, 1]);
const y = new Int8Array(x.buffer);
x[0] // 1
y[0] // 1

x[0] = 2;
y[0] // 2
```

##### TypedArray(arrayLikeObject)
构造函数的参数也可以是一个普通数组，然后直接生成TypedArray实例。
```js
const typedArray = new Uint8Array([1, 2, 3, 4]);
```
注意，这时TypedArray视图会重新开辟内存，不会在原数组的内存上建立视图。

上面代码从一个普通的数组，生成一个 8 位无符号整数的TypedArray实例。

TypedArray 数组也可以转换回普通数组。
```js
const normalArray = [...typedArray];
// or
const normalArray = Array.from(typedArray);
// or
const normalArray = Array.prototype.slice.call(typedArray);
```

#### 数组方法
普通数组的操作方法和属性，对 TypedArray 数组完全适用。
- TypedArray.prototype.copyWithin(target, start[, end = this.length])
- TypedArray.prototype.entries()
- TypedArray.prototype.every(callbackfn, thisArg?)
- TypedArray.prototype.fill(value, start=0, end=this.length)
- TypedArray.prototype.filter(callbackfn, thisArg?)
- TypedArray.prototype.find(predicate, thisArg?)
- TypedArray.prototype.findIndex(predicate, thisArg?)
- TypedArray.prototype.forEach(callbackfn, thisArg?)
- TypedArray.prototype.indexOf(searchElement, fromIndex=0)
- TypedArray.prototype.join(separator)
- TypedArray.prototype.keys()
- TypedArray.prototype.lastIndexOf(searchElement, fromIndex?)
- TypedArray.prototype.map(callbackfn, thisArg?)
- TypedArray.prototype.reduce(callbackfn, initialValue?)
- TypedArray.prototype.reduceRight(callbackfn, initialValue?)
- TypedArray.prototype.reverse()
- TypedArray.prototype.slice(start=0, end=this.length)
- TypedArray.prototype.some(callbackfn, thisArg?)
- TypedArray.prototype.sort(comparefn)
- TypedArray.prototype.toLocaleString(reserved1?, reserved2?)
- TypedArray.prototype.toString()
- TypedArray.prototype.values()

注意，TypedArray 数组没有concat方法。如果想要合并多个 TypedArray 数组，可以用下面这个函数。
```js
function concatenate(resultConstructor, ...arrays) {
  let totalLength = 0;
  for (let arr of arrays) {
    totalLength += arr.length;
  }
  let result = new resultConstructor(totalLength);
  let offset = 0;
  for (let arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

concatenate(Uint8Array, Uint8Array.of(1, 2), Uint8Array.of(3, 4))
// Uint8Array [1, 2, 3, 4]
```
TypedArray 数组与普通数组一样，部署了 Iterator 接口，所以可以被遍历。
```js
let ui8 = Uint8Array.of(0, 1, 2);
for (let byte of ui8) {
  console.log(byte);
}
// 0
// 1
// 2
```

#### BYTES_PER_ELEMENT 属性
每一种视图的构造函数，都有一个BYTES_PER_ELEMENT属性，表示这种数据类型占据的字节数。
```js
Int8Array.BYTES_PER_ELEMENT // 1
Uint8Array.BYTES_PER_ELEMENT // 1
Uint8ClampedArray.BYTES_PER_ELEMENT // 1
Int16Array.BYTES_PER_ELEMENT // 2
Uint16Array.BYTES_PER_ELEMENT // 2
Int32Array.BYTES_PER_ELEMENT // 4
Uint32Array.BYTES_PER_ELEMENT // 4
Float32Array.BYTES_PER_ELEMENT // 4
Float64Array.BYTES_PER_ELEMENT // 8
```
这个属性在TypedArray实例上也能获取，即有TypedArray.prototype.BYTES_PER_ELEMENT。

#### ArrayBuffer 与字符串的互相转换
ArrayBuffer 和字符串的相互转换，使用原生 TextEncoder 和 TextDecoder 方法。为了便于说明用法，下面的代码都按照 TypeScript 的用法，给出了类型签名。
```js
/**
 * Convert ArrayBuffer/TypedArray to String via TextDecoder
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder
 */
function ab2str(
  input: ArrayBuffer | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array,
  outputEncoding: string = 'utf8',
): string {
  const decoder = new TextDecoder(outputEncoding)
  return decoder.decode(input)
}

/**
 * Convert String to ArrayBuffer via TextEncoder
 *
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/TextEncoder
 */
function str2ab(input: string): ArrayBuffer {
  const view = str2Uint8Array(input)
  return view.buffer
}

/** Convert String to Uint8Array */
function str2Uint8Array(input: string): Uint8Array {
  const encoder = new TextEncoder()
  const view = encoder.encode(input)
  return view
}
```
上面代码中，ab2str()的第二个参数outputEncoding给出了输出编码的编码，一般保持默认值（utf-8）。

#### 溢出
不同的视图类型，所能容纳的数值范围是确定的。超出这个范围，就会出现溢出。比如，8 位视图只能容纳一个 8 位的二进制值，如果放入一个 9 位的值，就会溢出。

TypedArray 数组的溢出处理规则，简单来说，就是抛弃溢出的位，然后按照视图类型进行解释。
```js
const uint8 = new Uint8Array(1);

uint8[0] = 256;
uint8[0] // 0

uint8[0] = -1;
uint8[0] // 255
```
上面代码中，uint8是一个 8 位视图，而 256 的二进制形式是一个 9 位的值100000000，这时就会发生溢出。根据规则，只会保留后 8 位，即00000000。uint8视图的解释规则是无符号的 8 位整数，所以00000000就是0。

负数在计算机内部采用“2 的补码”表示，也就是说，将对应的正数值进行否运算，然后加1。比如，-1对应的正值是1，进行否运算以后，得到11111110，再加上1就是补码形式11111111。uint8按照无符号的 8 位整数解释11111111，返回结果就是255。

一个简单转换规则，可以这样表示。
- 正向溢出（overflow）：当输入值大于当前数据类型的最大值，结果等于当前数据类型的最小值加上余值，再减去 1。
- 负向溢出（underflow）：当输入值小于当前数据类型的最小值，结果等于当前数据类型的最大值减去余值的绝对值，再加上 1。

Uint8ClampedArray视图的溢出规则，与上面的规则不同。它规定，凡是发生正向溢出，该值一律等于当前数据类型的最大值，即 255；如果发生负向溢出，该值一律等于当前数据类型的最小值，即 0。
```js
const uint8c = new Uint8ClampedArray(1);

uint8c[0] = 256;
uint8c[0] // 255

uint8c[0] = -1;
uint8c[0] // 0
```

#### TypedArray.prototype.buffer
TypedArray实例的buffer属性，返回整段内存区域对应的ArrayBuffer对象。该属性为只读属性。
```js
const a = new Float32Array(64);
const b = new Uint8Array(a.buffer);
```
上面代码的a视图对象和b视图对象，对应同一个ArrayBuffer对象，即同一段内存。

#### TypedArray.prototype.byteLength与TypedArray.prototype.byteOffset 
byteLength属性返回 TypedArray 数组占据的内存长度，单位为字节。byteOffset属性返回 TypedArray 数组从底层ArrayBuffer对象的哪个字节开始。这两个属性都是只读属性。
```js
const b = new ArrayBuffer(8);

const v1 = new Int32Array(b);
const v2 = new Uint8Array(b, 2);
const v3 = new Int16Array(b, 2, 2);

v1.byteLength // 8
v2.byteLength // 6
v3.byteLength // 4

v1.byteOffset // 0
v2.byteOffset // 2
v3.byteOffset // 2
```

#### TypedArray.prototype.length
length属性表示 TypedArray 数组含有多少个成员。注意将 length 属性和 byteLength 属性区分，前者是成员长度，后者是字节长度。
```js
const a = new Int16Array(8);

a.length // 8
a.byteLength // 16
```

#### TypedArray.prototype.set()
TypedArray 数组的set方法用于复制数组（普通数组或 TypedArray 数组），也就是将一段内容完全复制到另一段内存。
```js
const a = new Uint8Array(8);
const b = new Uint8Array(8);

b.set(a);
```
上面代码复制a数组的内容到b数组，它是整段内存的复制，比一个个拷贝成员的那种复制快得多。

set方法还可以接受第二个参数，表示从b对象的哪一个成员开始复制a对象。
```js
const a = new Uint16Array(8);
const b = new Uint16Array(10);

b.set(a, 2)
```

#### TypedArray.prototype.subarray()
subarray方法是对于 TypedArray 数组的一部分，再建立一个新的视图。subarray方法的第一个参数是起始的成员序号，第二个参数是结束的成员序号（不含该成员），如果省略则包含剩余的全部成员。
```js
const a = new Uint16Array(8);
const b = a.subarray(2,3);

a.byteLength // 16
b.byteLength // 2
```
上面代码的a.subarray(2,3)，意味着 b 只包含a[2]一个成员，字节长度为 2。

#### TypedArray.prototype.slice()
TypeArray 实例的slice方法，可以返回一个指定位置的新的TypedArray实例。slice方法的参数，表示原数组的具体位置，开始生成新数组。负值表示逆向的位置，即-1 为倒数第一个位置，-2 表示倒数第二个位置，以此类推。
```js
let ui8 = Uint8Array.of(0, 1, 2);
ui8.slice(-1)
// Uint8Array [ 2 ]
```
上面代码中，ui8是 8 位无符号整数数组视图的一个实例。它的slice方法可以从当前视图之中，返回一个新的视图实例。

#### TypedArray.of()
TypedArray 数组的所有构造函数，都有一个静态方法of，用于将参数转为一个TypedArray实例。
```js
Float32Array.of(0.151, -8, 3.7)
// Float32Array [ 0.151, -8, 3.7 ]
```
下面三种方法都会生成同样一个 TypedArray 数组。
```js
// 方法一
let tarr = new Uint8Array([1,2,3]);

// 方法二
let tarr = Uint8Array.of(1,2,3);

// 方法三
let tarr = new Uint8Array(3);
tarr[0] = 1;
tarr[1] = 2;
tarr[2] = 3;
```

#### TypedArray.from()
静态方法from接受一个可遍历的数据结构（比如数组）作为参数，返回一个基于这个结构的TypedArray实例。
```js
Uint16Array.from([0, 1, 2])
// Uint16Array [ 0, 1, 2 ]
```
这个方法还可以将一种TypedArray实例，转为另一种。
```js
const ui16 = Uint16Array.from(Uint8Array.of(0, 1, 2));
ui16 instanceof Uint16Array // true
```
from方法还可以接受一个函数，作为第二个参数，用来对每个元素进行遍历，功能类似map方法。
```js
Int8Array.of(127, 126, 125).map(x => 2 * x)
// Int8Array [ -2, -4, -6 ]

Int16Array.from(Int8Array.of(127, 126, 125), x => 2 * x)
// Int16Array [ 254, 252, 250 ]
```
上面的例子中，from方法没有发生溢出，这说明遍历不是针对原来的 8 位整数数组。也就是说，from会将第一个参数指定的 TypedArray 数组，拷贝到另一段内存之中，处理之后再将结果转成指定的数组格式。

### 复合视图
由于视图的构造函数可以指定起始位置和长度，所以在同一段内存之中，可以依次存放不同类型的数据，这叫做“复合视图”。
```js
const buffer = new ArrayBuffer(24);

const idView = new Uint32Array(buffer, 0, 1);
const usernameView = new Uint8Array(buffer, 4, 16);
const amountDueView = new Float32Array(buffer, 20, 1);
```
上面代码将一个 24 字节长度的ArrayBuffer对象，分成三个部分：
- 字节 0 到字节 3：1 个 32 位无符号整数
- 字节 4 到字节 19：16 个 8 位整数
- 字节 20 到字节 23：1 个 32 位浮点数

### DataView 视图
如果一段数据包括多种类型（比如服务器传来的 HTTP 数据），这时除了建立ArrayBuffer对象的复合视图以外，还可以通过DataView视图进行操作。

DataView视图提供更多操作选项，而且支持设定字节序。本来，在设计目的上，ArrayBuffer对象的各种TypedArray视图，是用来向网卡、声卡之类的本机设备传送数据，所以使用本机的字节序就可以了；而DataView视图的设计目的，是用来处理网络设备传来的数据，所以大端字节序或小端字节序是可以自行设定的。

DataView视图本身也是构造函数，接受一个ArrayBuffer对象作为参数，生成视图。
```js
new DataView(ArrayBuffer buffer [, 字节起始位置 [, 长度]]);
```
DataView实例有以下属性，含义与TypedArray实例的同名方法相同。
- DataView.prototype.buffer：返回对应的 ArrayBuffer 对象
- DataView.prototype.byteLength：返回占据的内存字节长度
- DataView.prototype.byteOffset：返回当前视图从对应的 ArrayBuffer 对象的哪个字节开始

DataView实例提供11个方法读取内存。
- getInt8：读取 1 个字节，返回一个 8 位整数。
- getUint8：读取 1 个字节，返回一个无符号的 8 位整数。
- getInt16：读取 2 个字节，返回一个 16 位整数。
- getUint16：读取 2 个字节，返回一个无符号的 16 位整数。
- getInt32：读取 4 个字节，返回一个 32 位整数。
- getUint32：读取 4 个字节，返回一个无符号的 32 位整数。
- getBigInt64：读取 8 个字节，返回一个 64 位整数。
- getBigUint64：读取 8 个字节，返回一个无符号的 64 位整数。
- getFloat16：读取 2 个字节，返回一个 16 位浮点数。
- getFloat32：读取 4 个字节，返回一个 32 位浮点数。
- getFloat64：读取 8 个字节，返回一个 64 位浮点数。

这一系列get方法的参数都是一个字节序号（不能是负数，否则会报错），表示从哪个字节开始读取。
```js
const buffer = new ArrayBuffer(24);
const dv = new DataView(buffer);

// 从第1个字节读取一个8位无符号整数
const v1 = dv.getUint8(0);

// 从第2个字节读取一个16位无符号整数
const v2 = dv.getUint16(1);

// 从第4个字节读取一个16位无符号整数
const v3 = dv.getUint16(3);
```
如果一次读取两个或两个以上字节，就必须明确数据的存储方式，到底是小端字节序还是大端字节序。默认情况下，DataView的get方法使用大端字节序解读数据，如果需要使用小端字节序解读，必须在get方法的第二个参数指定true。
```js
// 小端字节序
const v1 = dv.getUint16(1, true);

// 大端字节序
const v2 = dv.getUint16(3, false);

// 大端字节序
const v3 = dv.getUint16(3);
```

DataView 视图提供11个方法写入内存。
- setInt8：写入 1 个字节的 8 位整数。
- setUint8：写入 1 个字节的 8 位无符号整数。
- setInt16：写入 2 个字节的 16 位整数。
- setUint16：写入 2 个字节的 16 位无符号整数。
- setInt32：写入 4 个字节的 32 位整数。
- setUint32：写入 4 个字节的 32 位无符号整数。
- setBigInt64：写入 8 个字节的 64 位整数。
- setBigUint64：写入 8 个字节的 64 位无符号整数。
- setFloat16：写入 2 个字节的 16 位浮点数。
- setFloat32：写入 4 个字节的 32 位浮点数。
- setFloat64：写入 8 个字节的 64 位浮点数。

这一系列set方法，接受两个参数，第一个参数是字节序号，表示从哪个字节开始写入，第二个参数为写入的数据。对于那些写入两个或两个以上字节的方法，需要指定第三个参数，false或者undefined表示使用大端字节序写入，true表示使用小端字节序写入。
```js
// 在第1个字节，以大端字节序写入值为25的32位整数
dv.setInt32(0, 25, false);

// 在第5个字节，以大端字节序写入值为25的32位整数
dv.setInt32(4, 25);

// 在第9个字节，以小端字节序写入值为2.5的32位浮点数
dv.setFloat32(8, 2.5, true);
```

### 二进制数组的应用
大量的 Web API 用到了ArrayBuffer对象和它的视图对象。

#### AJAX
传统上，服务器通过 AJAX 操作只能返回文本数据，即responseType属性默认为text。XMLHttpRequest第二版XHR2允许服务器返回二进制数据，这时分成两种情况。如果明确知道返回的二进制数据类型，可以把返回类型（responseType）设为arraybuffer；如果不知道，就设为blob。
```js
let xhr = new XMLHttpRequest();
xhr.open('GET', someUrl);
xhr.responseType = 'arraybuffer';

xhr.onload = function () {
  let arrayBuffer = xhr.response;
  // ···
};

xhr.send();
```

#### Canvas
网页Canvas元素输出的二进制像素数据，就是 TypedArray 数组。
```js
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const uint8ClampedArray = imageData.data;
```
需要注意的是，上面代码的uint8ClampedArray虽然是一个 TypedArray 数组，但是它的视图类型是一种针对Canvas元素的专有类型Uint8ClampedArray。这个视图类型的特点，就是专门针对颜色，把每个字节解读为无符号的 8 位整数，即只能取值 0 ～ 255，而且发生运算的时候自动过滤高位溢出。这为图像处理带来了巨大的方便。

举例来说，如果把像素的颜色值设为Uint8Array类型，那么乘以一个 gamma 值的时候，就必须这样计算：
```js
u8[i] = Math.min(255, Math.max(0, u8[i] * gamma));
```

因为Uint8Array类型对于大于 255 的运算结果（比如0xFF+1），会自动变为0x00，所以图像处理必须要像上面这样算。这样做很麻烦，而且影响性能。如果将颜色值设为Uint8ClampedArray类型，计算就简化许多。
```js
pixels[i] *= gamma;
```
Uint8ClampedArray类型确保将小于 0 的值设为 0，将大于 255 的值设为 255。注意，IE 10 不支持该类型。

#### WebSockets
WebSocket可以通过ArrayBuffer，发送或接收二进制数据。
```js
let socket = new WebSocket('ws://127.0.0.1:8081');
socket.binaryType = 'arraybuffer';

// Wait until socket is open
socket.addEventListener('open', function (event) {
  // Send binary data
  const typedArray = new Uint8Array(4);
  socket.send(typedArray.buffer);
});

// Receive binary data
socket.addEventListener('message', function (event) {
  const arrayBuffer = event.data;
  // ···
});
```

#### Fetch API
Fetch API 取回的数据，就是ArrayBuffer对象。
```js
fetch(url)
.then(function(response){
  return response.arrayBuffer()
})
.then(function(arrayBuffer){
  // ...
});
```

#### File API
如果知道一个文件的二进制数据类型，也可以将这个文件读取为ArrayBuffer对象。
```js
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];
const reader = new FileReader();
reader.readAsArrayBuffer(file);
reader.onload = function () {
  const arrayBuffer = reader.result;
  // ···
};
```

#### SharedArrayBuffer
JavaScript 是单线程的，Web worker 引入了多线程：主线程用来与用户互动，Worker 线程用来承担计算任务。每个线程的数据都是隔离的，通过postMessage()通信。下面是一个例子。
```js
// 主线程
const w = new Worker('myworker.js');
w.postMessage('hi');
w.onmessage = function (ev) {
  console.log(ev.data);
}
```
主线程新建了一个 Worker 线程。该线程与主线程之间会有一个通信渠道，主线程通过w.postMessage向 Worker 线程发消息，同时通过message事件监听 Worker 线程的回应。Worker 线程也是通过监听message事件，来获取主线程发来的消息，并作出反应。
```js
// Worker 线程
onmessage = function (ev) {
  console.log(ev.data);
  postMessage('ho');
}
```
线程之间的数据交换可以是各种格式，不仅仅是字符串，也可以是二进制数据。这种交换采用的是复制机制，即一个进程将需要分享的数据复制一份，通过postMessage方法交给另一个进程。如果数据量比较大，这种通信的效率显然比较低。很容易想到，这时可以留出一块内存区域，由主线程与 Worker 线程共享，两方都可以读写，那么就会大大提高效率，协作起来也会比较简单（不像postMessage那么麻烦）。

ES2017 引入SharedArrayBuffer，允许 Worker 线程与主线程共享同一块内存。SharedArrayBuffer的 API 与ArrayBuffer一模一样，唯一的区别是后者无法共享数据。
```js
// 主线程

// 新建 1KB 共享内存
const sharedBuffer = new SharedArrayBuffer(1024);

// 主线程将共享内存的地址发送出去
w.postMessage(sharedBuffer);

// 在共享内存上建立视图，供写入数据
const sharedArray = new Int32Array(sharedBuffer);
```
Worker 线程从事件的data属性上面取到数据。
```js
// Worker 线程
onmessage = function (ev) {
  // 主线程共享的数据，就是 1KB 的共享内存
  const sharedBuffer = ev.data;

  // 在共享内存上建立视图，方便读写
  const sharedArray = new Int32Array(sharedBuffer);

  // ...
};
```
共享内存也可以在 Worker 线程创建，发给主线程。SharedArrayBuffer与ArrayBuffer一样，本身是无法读写的，必须在上面建立视图，然后通过视图读写。
```js
// 分配 10 万个 32 位整数占据的内存空间
const sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 100000);

// 建立 32 位整数视图
const ia = new Int32Array(sab);  // ia.length == 100000

// 新建一个质数生成器
const primes = new PrimeGenerator();

// 将 10 万个质数，写入这段内存空间
for ( let i=0 ; i < ia.length ; i++ )
  ia[i] = primes.next();

// 向 Worker 线程发送这段共享内存
w.postMessage(ia);
```
Worker 线程收到数据后的处理如下。
```js
// Worker 线程
let ia;
onmessage = function (ev) {
  ia = ev.data;
  console.log(ia.length); // 100000
  console.log(ia[37]); // 输出 163，因为这是第38个质数
}
```

### Atomics对象
多线程共享内存，最大的问题就是如何防止两个线程同时修改某个地址，或者说，当一个线程修改共享内存以后，必须有一个机制让其他线程同步。SharedArrayBuffer API 提供Atomics对象，保证所有共享内存的操作都是“原子性”的，并且可以在所有线程内同步。

什么叫“原子性操作”呢？现代编程语言中，一条普通的命令被编译器处理以后，会变成多条机器指令。如果是单线程运行，这是没有问题的；多线程环境并且共享内存时，就会出问题，因为这一组机器指令的运行期间，可能会插入其他线程的指令，从而导致运行结果出错。请看下面的例子。
```js
// 主线程
ia[42] = 314159;  // 原先的值 191
ia[37] = 123456;  // 原先的值 163

// Worker 线程
console.log(ia[37]);
console.log(ia[42]);
// 可能的结果
// 123456
// 191
```
上面代码中，主线程的原始顺序是先对 42 号位置赋值，再对 37 号位置赋值。但是，编译器和 CPU 为了优化，可能会改变这两个操作的执行顺序（因为它们之间互不依赖），先对 37 号位置赋值，再对 42 号位置赋值。而执行到一半的时候，Worker 线程可能就会来读取数据，导致打印出123456和191。

```js
// 主线程
const sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 100000);
const ia = new Int32Array(sab);

for (let i = 0; i < ia.length; i++) {
  ia[i] = primes.next(); // 将质数放入 ia
}

// worker 线程
ia[112]++; // 错误
Atomics.add(ia, 112, 1); // 正确
```
上面代码中，Worker 线程直接改写共享内存ia[112]++是不正确的。因为这行语句会被编译成多条机器指令，这些指令之间无法保证不会插入其他进程的指令。请设想如果两个线程同时ia[112]++，很可能它们得到的结果都是不正确的。

Atomics对象就是为了解决这个问题而提出，它可以保证一个操作所对应的多条机器指令，一定是作为一个整体运行的，中间不会被打断。也就是说，它所涉及的操作都可以看作是原子性的单操作，这可以避免线程竞争，提高多线程共享内存时的操作安全。所以，ia[112]++要改写成Atomics.add(ia, 112, 1)。

Atomics对象提供多种方法。
#### Atomics.store()与Atomics.load()
store()方法用来向共享内存写入数据，load()方法用来从共享内存读出数据。比起直接的读写操作，它们的好处是保证了读写操作的原子性。

此外，它们还用来解决一个问题：多个线程使用共享内存的某个位置作为开关（flag），一旦该位置的值变了，就执行特定操作。这时，必须保证该位置的赋值操作，一定是在它前面的所有可能会改写内存的操作结束后执行；而该位置的取值操作，一定是在它后面所有可能会读取该位置的操作开始之前执行。store()方法和load()方法就能做到这一点，编译器不会为了优化，而打乱机器指令的执行顺序。
```js
Atomics.load(typedArray, index)
Atomics.store(typedArray, index, value)
```
- store()方法接受三个参数：typedArray对象（SharedArrayBuffer 的视图）、位置索引和值，返回typedArray[index]的值。
- load()方法只接受两个参数：typedArray对象（SharedArrayBuffer 的视图）和位置索引，也是返回typedArray[index]的值。

```js
// 主线程 main.js
ia[42] = 314159;  // 原先的值 191
Atomics.store(ia, 37, 123456);  // 原先的值是 163

// Worker 线程 worker.js
while (Atomics.load(ia, 37) == 163);
console.log(ia[37]);  // 123456
console.log(ia[42]);  // 314159
```
上面代码中，主线程的Atomics.store()向 42 号位置的赋值，一定是早于 37 位置的赋值。只要 37 号位置等于 163，Worker 线程就不会终止循环，而对 37 号位置和 42 号位置的取值，一定是在Atomics.load()操作之后。

```js
// 主线程
const worker = new Worker('worker.js');
const length = 10;
const size = Int32Array.BYTES_PER_ELEMENT * length;
// 新建一段共享内存
const sharedBuffer = new SharedArrayBuffer(size);
const sharedArray = new Int32Array(sharedBuffer);
for (let i = 0; i < 10; i++) {
  // 向共享内存写入 10 个整数
  Atomics.store(sharedArray, i, 0);
}
worker.postMessage(sharedBuffer);


// worker.js
self.addEventListener('message', (event) => {
  const sharedArray = new Int32Array(event.data);
  for (let i = 0; i < 10; i++) {
    const arrayValue = Atomics.load(sharedArray, i);
    console.log(`The item at array index ${i} is ${arrayValue}`);
  }
}, false);
```
上面代码中，主线程用Atomics.store()方法写入数据。Worker 线程用Atomics.load()方法读取数据。

#### Atomics.exchange()
Worker 线程如果要写入数据，可以使用上面的Atomics.store()方法，也可以使用Atomics.exchange()方法。它们的区别是，Atomics.store()返回写入的值，而Atomics.exchange()返回被替换的值。
```js
// Worker 线程
self.addEventListener('message', (event) => {
  const sharedArray = new Int32Array(event.data);
  for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) {
      const storedValue = Atomics.store(sharedArray, i, 1);
      console.log(`The item at array index ${i} is now ${storedValue}`);
    } else {
      const exchangedValue = Atomics.exchange(sharedArray, i, 2);
      console.log(`The item at array index ${i} was ${exchangedValue}, now 2`);
    }
  }
}, false);
```
上面代码将共享内存的偶数位置的值改成1，奇数位置的值改成2。

#### Atomics.wait()与Atomics.notify()
使用while循环等待主线程的通知，不是很高效，如果用在主线程，就会造成卡顿，Atomics对象提供了wait()和notify()两个方法用于等待通知。这两个方法相当于锁内存，即在一个线程进行操作时，让其他线程休眠（建立锁），等到操作结束，再唤醒那些休眠的线程（解除锁）。

Atomics.notify()方法以前叫做Atomics.wake()，后来进行了改名。
```js
// Worker 线程
self.addEventListener('message', (event) => {
  const sharedArray = new Int32Array(event.data);
  const arrayIndex = 0;
  const expectedStoredValue = 50;
  Atomics.wait(sharedArray, arrayIndex, expectedStoredValue);
  console.log(Atomics.load(sharedArray, arrayIndex));
}, false);
```
上面代码中，Atomics.wait()方法等同于告诉 Worker 线程，只要满足给定条件（sharedArray的0号位置等于50），就在这一行 Worker 线程进入休眠。

主线程一旦更改了指定位置的值，就可以唤醒 Worker 线程。
```js
// 主线程
const newArrayValue = 100;
Atomics.store(sharedArray, 0, newArrayValue);
const arrayIndex = 0;
const queuePos = 1;
Atomics.notify(sharedArray, arrayIndex, queuePos);
```

Atomics.wait()方法的使用格式如下。
```js
Atomics.wait(sharedArray, index, value, timeout)
```
它的四个参数含义如下。
- sharedArray：共享内存的视图数组。
- index：视图数据的位置（从0开始）。
- value：该位置的预期值。一旦实际值等于预期值，就进入休眠。
- timeout：整数，表示过了这个时间以后，就自动唤醒，单位毫秒。该参数可选，默认值是Infinity，即无限期的休眠，只有通过Atomics.notify()方法才能唤醒。
Atomics.wait()的返回值是一个字符串，共有三种可能的值。如果sharedArray[index]不等于value，就返回字符串not-equal，否则就进入休眠。如果Atomics.notify()方法唤醒，就返回字符串ok；如果因为超时唤醒，就返回字符串timed-out。

Atomics.notify()方法的使用格式如下。
```js
Atomics.notify(sharedArray, index, count)
```
它的三个参数含义如下。
- sharedArray：共享内存的视图数组。
- index：视图数据的位置（从0开始）。
- count：需要唤醒的 Worker 线程的数量，默认为Infinity。

Atomics.notify()方法一旦唤醒休眠的 Worker 线程，就会让它继续往下运行。
```js
// 主线程
console.log(ia[37]);  // 163
Atomics.store(ia, 37, 123456);
Atomics.notify(ia, 37, 1);

// Worker 线程
Atomics.wait(ia, 37, 163);
console.log(ia[37]);  // 123456
```
上面代码中，视图数组ia的第 37 号位置，原来的值是163。Worker 线程使用Atomics.wait()方法，指定只要ia[37]等于163，就进入休眠状态。主线程使用Atomics.store()方法，将123456写入ia[37]，然后使用Atomics.notify()方法唤醒 Worker 线程。

#### 运算方法
共享内存上面的某些运算是不能被打断的，即不能在运算过程中，让其他线程改写内存上面的值。Atomics 对象提供了一些运算方法，防止数据被改写。

##### Atomics.add()
Atomics.add用于将value加到sharedArray[index]，返回sharedArray[index]旧的值。
```js
Atomics.add(sharedArray, index, value)
```

##### Atomics.sub()
Atomics.sub用于将value从sharedArray[index]减去，返回sharedArray[index]旧的值。
```js
Atomics.sub(sharedArray, index, value)
```

##### Atomics.and()
Atomics.and用于将value与sharedArray[index]进行位运算and，放入sharedArray[index]，并返回旧的值。
```js
Atomics.and(sharedArray, index, value)
```

##### Atomics.or()
Atomics.or用于将value与sharedArray[index]进行位运算or，放入sharedArray[index]，并返回旧的值。
```js
Atomics.or(sharedArray, index, value)
```

##### Atomics.xor()
Atomic.xor用于将vaule与sharedArray[index]进行位运算xor，放入sharedArray[index]，并返回旧的值。
```js
Atomics.xor(sharedArray, index, value)
```

#### 其他方法
Atomics对象还有以下方法。
- Atomics.compareExchange(sharedArray, index, oldval, newval)：如果sharedArray[index]等于oldval，就写入newval，返回oldval。
- Atomics.isLockFree(size)：返回一个布尔值，表示Atomics对象是否可以处理某个size的内存锁定。如果返回false，应用程序就需要自己来实现锁定。

Atomics.compareExchange的一个用途是，从 SharedArrayBuffer 读取一个值，然后对该值进行某个操作，操作结束以后，检查一下 SharedArrayBuffer 里面原来那个值是否发生变化（即被其他线程改写过）。如果没有改写过，就将它写回原来的位置，否则读取新的值，再重头进行一次操作。