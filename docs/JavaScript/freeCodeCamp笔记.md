---
title: freeCodeCamp笔记
description: freeCodeCamp网站JavaScript认证学习笔记。
sidebar_position: 2
tags: [JavaScript,Web]
date: 2026-03-06
---

# freeCodeCamp笔记
记录在[freeCodeCamp](https://www.freecodecamp.org/chinese/learn/javascript-v9/)笔记网站学习JavaScript中个人需注意的知识点，方便翻看学习，按需记录并非网站全部内容。

## 变量与字符串
### JavaScript入门讲座
#### 数据类型
`Symbol`是 JavaScript 中一种特殊类型的值，始终唯一且不可更改。 它通常用于为属性创建独特的标签或标识符：
```js
Symbol('description');
```
```js
const crypticKey1= Symbol("saltNpepper");
const crypticKey2= Symbol("saltNpepper");
console.log(crypticKey1 === crypticKey2); // 输出结果为 false
```

`BigInt`用于超过`Number`类型限制的超大数字：
```js
const veryBigNumber = 1234567890123456789012345678901234567890n;
```
在这个示例中，我们通过在一个非常大的数值末尾添加`n`来创建一个`BigInt`。

### 处理数据类型
#### JavaScript动态类型
JavaScript 是一种动态类型语言，这意味着在声明变量时无需指定其数据类型。相反，类型是根据程序运行时分配给变量的值确定的。这允许我们在整个程序中更改变量的类型。
```js
let example = "Hello";
example = 42;
```

#### typeof操作符
```js
let exampleVariable = null;
console.log(typeof exampleVariable); // 输出结果为 "object"
```
在本例中，我们有一个名为`exampleVariable`的变量，并为其赋值`null`。 但是，当我们对其使用 `typeof`操作符时，会返回字符串`object`。

这被普遍认为是 JavaScript 中的一个错误，可以追溯到 JavaScript 诞生之初。 造成这种行为的原因在于 JavaScript 最初的设计方式。

### 处理字符串
#### 模版字面量
模板字面量的一大特点是支持多行字符串。 对于常规字符串，我们需要使用转义字符`\n`来创建新行。 使用模板字面量时，只需跨行写入字符串，格式就会得到保留：
```js
let poem = `Roses are red,
Violets are blue,
JavaScript is fun,
And so are you.`;

console.log(poem);
// 输出结果为： 
// "Roses are red,
// Violets are blue,
// JavaScript is fun,
// And so are you."
```

#### 查找子字符串位置
要确定子串在字符串中的位置，可以使用`indexOf()`方法。 JavaScript 中的`indexOf()`方法允许搜索字符串中的子字符串。

如果找到子字符串，`indexOf()`将返回该子字符串首次出现的索引（或位置）。 如果未找到子字符串，`indexOf()`将返回`-1`，表示搜索不成功。

`indexOf()`方法需要两个参数：第一个参数是要在较大字符串中查找的子字符串，第二个参数是搜索的起始位置选项。 如果不提供起始位置，搜索将从字符串的起始位置开始。

```js
let sentence = "JavaScript is awesome!";
let position = sentence.indexOf("awesome!");
console.log(position); // 14

let sentence = "JavaScript is awesome!";
let position = sentence.indexOf("fantastic");
console.log(position); // -1

let sentence = "JavaScript is awesome, and JavaScript is powerful!";
let position = sentence.indexOf("JavaScript", 10);
console.log(position); // 27
```

`indexOf()`方法区分大小写。

#### prompt()方法
`prompt()`方法是 JavaScript 与用户交互的重要组成部分。 这是通过弹出式小对话框获取用户输入信息的最简单方法之一。它打开一个对话框，要求用户输入一些内容，然后以字符串形式返回用户输入的文本。

`prompt()`方法需要两个参数：第一个参数是将出现在对话框中的信息，通常是提示用户输入信息。 第二个是默认值，是可选的，将作为填充输入字段的初始值。

```js
prompt(message, default);
```

`prompt()`方法将停止脚本的执行，直到用户与对话框进行交互。

虽然`prompt()`对于快速测试或小型应用程序很有用，但在现代复杂的网络应用程序中，由于其破坏性和在不同浏览器中的不一致行为，通常会避免使用它。

### 处理字符串字符方法
#### ASCII、charCodeAt()和fromCharCode()
虽然 JavaScript 字串在内部使用 Unicode（UTF-16），但 ASCII 值匹配前 128 个 Unicode 字符，这就是基于 ASCII 的示例在 JavaScript 中有效的原因。

ASCII 标准包含 128 个字符，包括：
- 大写和小写英文字母（A-Z、a-z）。
- 数字（0-9）。
- 常见标点符号和特殊字符（!、@、# 等）。
- 控制字符（如换行符和制表符）。

可以使用`charCodeAt()`方法访问字符的数字代码。该方法返回指定索引处字符的 UTF-16 代码单元。对于前 128 个字符，该值与 ASCII 代码匹配。
```js
let letter = "A";
console.log(letter.charCodeAt(0));  // 65

let symbol = "!";
console.log(symbol.charCodeAt(0));  // 33
```

`charCodeAt()`帮助我们获取字符的数字代码，`fromCharCode()`方法则允许我们执行相反的操作：将 UTF-16 代码单元（对于基本字符与 ASCII 匹配）转换为对应的字符。
```js
let char = String.fromCharCode(65);
console.log(char);  //  A

let char = String.fromCharCode(97);
console.log(char);  // a
```

当我们需要基于字符的数字代码值操作或比较字符时，这些方法特别有用。例如，我们可以使用`charCodeAt()`通过比较字符的 ASCII 值来检查该字符是大写、小写还是数字。而`fromCharCode()`可用于根据 ASCII 码动态生成字符。

### 处理字符串搜索与切片方法
#### 检测包含子字符串
`includes()`方法用于检查字符串是否包含特定子字符串。 如果在字符串中找到子字符串，该方法返回`true`，否则返回`false`。它不提供子字符串在字符串中的位置或出现次数的信息。
```js
string.includes(searchString);
```
就语法而言，searchValue 是要在字符串中查找的子字符串。示例：
```js
let phrase = "JavaScript is awesome!";
let result = phrase.includes("awesome");

console.log(result);  // true
```
`includes()`方法区分大小写。 这意味着要求字符完全匹配，包括大小写。
```js
let phrase = "JavaScript is awesome!";
let result = phrase.includes("Awesome");

console.log(result);  // false
```
可以通过为`includes()`方法提供第二个参数来查找从字符串中特定索引开始的子字符串：
```js
let text = "Hello, JavaScript world!";
let result = text.includes("JavaScript", 7);

console.log(result);  // true
```

#### 提取子字符串
`slice()`方法允许提取字符串的一部分，并返回一个新的字符串，而不修改原始字符串。 它需要两个参数：开始索引和选填的结束索引。
```js
string.slice(startIndex, endIndex);
```
`startIndex`是提取开始的位置。`endIndex`是提取结束的位置。如果未提供，`slice()`会提取到字串的末尾。
```js
let message = "Hello, world!";
let greeting = message.slice(0, 5);

console.log(greeting);  // Hello
///////////////////////////////////
let message = "Hello, world!";
let world = message.slice(7);

console.log(world);  // world!
////////////////////////////////////
let message = "JavaScript is fun!";
let lastWord = message.slice(-4);

console.log(lastWord);  // fun!
////////////////////////////////////
let message = "I love JavaScript!";
let language = message.slice(7, 17);

console.log(language);  // JavaScript
```

### 处理字符串格式化方法
#### 转换字符串大小写
`toUpperCase()`方法将整个字符串转换为大写字母。原始字符串保持不变，因为`toUpperCase()`返回的是一个新字符串，而不是修改原始字符串。反过来，`toLowerCase()`方法会将字符串中的所有字符转换为小写。

#### 字符串格式化方法
`trim()`方法是删除字符串首尾空白的最常用方法。trimStart()`删除字符串开头（或起始）的空白。`trimEnd()`删除字符串末尾的空白。

### 处理字符串修改方法
#### 用另一个字符串部分地替换字符串
`replace()`方法允许在字串中查找指定的值（例如单词或字符）并将其替换为另一个值。该方法返回一个带有替换的新字串，并且保持原字串不变，因为 JavaScript 字串是不可变的。
```js
string.replace(searchValue, newValue);
```
`searchValue`是要在字符串中搜索的值。 它可以是字符串，也可以是正则表达式（regex），后者描述文本的模式。`newValue`是用于替换`searchValue`的值。 

`replace()`方法区分大小写，这意味着它只会查找与 searchValue 完全匹配的内容。
```js
let sentence = "I enjoy working with JavaScript.";
console.log(sentence);  // "I enjoy working with JavaScript."
let updatedSentence = sentence.replace("javascript", "coding");
console.log(updatedSentence);  // "I enjoy working with JavaScript."
```

默认情况下，`replace()`方法仅替换第一个与`searchValue`匹配的内容。 如果该值在字符串中出现多次，则只替换第一个
```js
let phrase = "Hello, world! Welcome to the world of coding.";
console.log(phrase);  // "Hello, world! Welcome to the world of coding."
let updatedPhrase = phrase.replace("world", "universe");
console.log(updatedPhrase);  // "Hello, universe! Welcome to the world of coding."
```

#### 多次重复字符串
`repeat()`方法是`JavaScript`中的一个内置函数，可重复指定次数的字符串。 这是基本语法：
```js
string.repeat(count);
```
`string`是要重复的字符串，`count`是希望字符串重复的次数。`count`参数必须是非负数。如果传递的是负数，JavaScript将抛出`RangeError`错误。`count`必须是一个有限的数字。 如果尝试无限次重复一个字符串，或使用`Infinity`作为计数，也将得到`RangeError`。在 JavaScript 中，`Infinity`是一个表示无限量的特殊值。 它用来表示比任何有限数都大的数。如果计数不是整数（例如小数，如`2.5`），`repeat()`方法将四舍五入为最接近的整数。如果传递`0`作为计数，`repeat()`方法将返回空字符串。
```js
let word = "Test";
console.log(word.repeat(-1));  // Throws RangeError: Invalid count value

let word = "Test";
console.log(word.repeat(Infinity));  // Throws RangeError: Invalid count value

let word = "Test";
console.log(word.repeat(2.5));  // "TestTest"

let word = "Test";
console.log(word.repeat(0));  // ""
```

## 布尔值与数字
### 处理数字与算数运算符
#### Number类型
JavaScript 的`Number`类型包含各种数值，从简单的整数和浮点数到特殊值，如`Infinity`和`NaN`，或“非数字”。用`Infinity`表示超出最大限制的数字。如果尝试对不是数字的值执行数学运算，将得到`NaN`，表示“非数字”。`NaN`的类型也是 Number:
```js
const notANumber = 'hello world' / 2;
console.log(typeof notANumber); // number
```

#### 数字与字符串计算
**类型强制**是指将一种数据类型的值转换成另一种数据类型。

对于`null`和`undefined`，进行数学运算时，JavaScript 将`null`视为`0`、`undefined`视为`NaN`：
```js
const result1 = null + 5;
console.log(result1); // 5
console.log(typeof result1); // number

const result2 = undefined + 5;
console.log(result2); // NaN
console.log(typeof result2); // number
```

### 运算符行为
#### 自增和自减运算符
自增和自减运算符分别用`++`和`--`表示。前缀形式`++x`是先增加变量的值，然后返回新值。 后缀形式`x++`是先返回变量的当前值，然后增加该值。 同样，前缀形式`--x`先减少变量的值，然后返回新值。 后缀形式`x--`先返回当前值，然后减少它。
```js
let x = 5;
console.log(++x); // 6
console.log(x); // 6

let y = 5;
console.log(y++); // 5
console.log(y); // 6

let x = 5;
console.log(--x); // 4
console.log(x); // 4

let y = 5;
console.log(y--); // 5
console.log(y); // 4
```
如果需要立即获得更新值，请使用前缀。如果想先得到当前值，然后再考虑自增，那么就使用后缀.

### 一元运算符和位运算符
#### 一元运算符如何工作
一元加号运算符将操作数转换为数字。 如果操作数已经是数字，则保持不变。也有一元负号运算符。 它会对操作数的值取负。 它的工作原理与一元加号类似，只是符号会翻转。
```js
const str = '42';

const strToNum = +str;
console.log(strToNum); // 42
console.log(typeof str); // string
console.log(typeof strToNum); // number

const strToNegativeNum = -str;
console.log(strToNegativeNum); // -42
console.log(typeof str); // string
console.log(typeof strToNegativeNum); // number
```
按位非运算符是一种不太常用的一元运算符。 它由一个波浪号`~`表示，会对一个数的二进制表示进行取反操作。 
```js
const num = 5; // The binary for 5 is 00000101

console.log(~num); // -6
```
`void`关键字是一个一元运算符，用于评估表达式并返回`undefined`结果。
```js
const result = void (2 + 2);

console.log(result); // undefined
```
`void`也常用于超链接，防止点击后页面跳转：
```js
<a href="javascript:void(0);">Click Me</a>
```

### Math方法
`Math.trunc()`会去除数字的小数部分，只返回整数部分，不进行四舍五入:
```js
console.log(Math.trunc(2.9)); // 2
console.log(Math.trunc(9.1)); // 9
```
如果需要获取一个数字的平方根或立方根，可以分别使用`Math.sqrt()`和`Math.cbrt()`方法：
```js
console.log(Math.sqrt(81)); // 9
console.log(Math.cbrt(27)); // 3
```
`Math.abs()`返回一个数字的绝对值，将负数变为正数。`Math.pow()`接收两个数字，第二个数字是第一个数字的指数。
```js
console.log(Math.abs(-5)); // 5

console.log(Math.pow(2, 3)); // 8
console.log(Math.pow(8, 2)); // 64
```

### 数学运算与常用数学方法
#### isNaN如何工作
`NaN`代表“Not a Number”。它是一个特殊值，表现为无法表示或未定义的数值结果。`NaN`是全局对象的一个属性，同时在 JavaScript 中也被视为一种数字类型,`NaN`通常是应返回数字但无法产生有意义数值的运算结果。`NaN`的一个奇特属性是它不等于任何东西，包括它自己：
```js
let result = 0 / 0;
console.log(result); // NaN

console.log(NaN === NaN); // false
```
`isNaN()`函数属性用于确定数值是否为`NaN`。`isNaN()`首先尝试将参数转换为数字。如果无法转换，则返回`true`。下面是`isNaN()`的行为方式：
```js
console.log(isNaN(NaN));       // true
console.log(isNaN(undefined)); // true
console.log(isNaN({}));        // true

console.log(isNaN(true));      // false
console.log(isNaN(null));      // false
console.log(isNaN(37));        // false

console.log(isNaN("37"));      // false: "37" is converted to 37
console.log(isNaN("37.37"));   // false: "37.37" is converted to 37.37
console.log(isNaN(""));        // false: empty string is converted to 0
console.log(isNaN(" "));       // false: string with a space is converted to 0

console.log(isNaN("blabla"));  // true: "blabla" is not a number
```
`Number.isNaN()`方法在测试前不会尝试将参数转换为数字。只有当值仅为`NaN`时，它才会返回`true`：
```js
console.log(Number.isNaN(NaN));        // true
console.log(Number.isNaN(Number.NaN)); // true
console.log(Number.isNaN(0 / 0));      // true

console.log(Number.isNaN("NaN"));      // false
console.log(Number.isNaN(undefined));  // false
console.log(Number.isNaN({}));         // false
console.log(Number.isNaN("blabla"));   // false
```

#### parseFloat() 和 parseInt() 方法
`parseFloat()`方法解析字符串参数并返回浮点数。 它的设计目的是从字符串开头提取数字，即使字符串后面包含非数字字符。`parseFloat()`从字符串的开头开始解析，直到遇到不属于浮点数的字符为止。如果在字符串开头找不到有效的数字，则返回`NaN`。
```js
console.log(parseFloat("3.14"));     // 3.14
console.log(parseFloat("3.14 abc")); // 3.14
console.log(parseFloat("3.14.5"));   // 3.14
console.log(parseFloat("abc 3.14")); // NaN
```
`parseInt()`会解析一个字符串参数并返回一个整数。 与`parseFloat()`类似，它从字符串的开头开始，在第一个非数字字符处停止。`parseInt()`在遇到第一个非数字时停止解析。 对于浮点数，它只返回整数部分。 如果在字符串开头找不到有效整数，则返回`NaN`。
```js
console.log(parseInt("42"));       // 42
console.log(parseInt("42px"));     // 42
console.log(parseInt("3.14"));     // 3
console.log(parseInt("abc123"));   // NaN
```
它们会忽略前导空白,可以处理字符串开头的加号和减号,不能直接处理所有数字格式，如科学记数法。
```js
console.log(parseFloat("  3.14"));  // 3.14
console.log(parseInt("  42"));      // 42

console.log(parseFloat("+3.14"));  // 3.14
console.log(parseInt("-42"));      // -42
```
#### toFixed()方法
`.toFixed()`方法是在一个数字上调用的，它包含一个可选参数，即小数点后的位数。 它返回数字的字符串形式，并带有指定的小数位数。`.toFixed()`返回的是字符串，而不是数字。这是因为该方法主要用于格式化数字以便显示，而不是进一步计算。`.toFixed()`方法会将数字四舍五入到能用指定的小数位数表示的最接近的数值。如果调用`.toFixed()`而不带参数，默认为`0`位小数：
```js
console.log((3.14159).toFixed(3));  // "3.142"
console.log((3.14449).toFixed(3));  // "3.144"
console.log((3.14550).toFixed(3));  // "3.146"

let num = 3.14159;
console.log(num.toFixed()); // "3"
```

### 比较与条件语句
#### null与undefined
在使用相等运算符`==`比较`null`和`undefined`时，JavaScript 会执行类型强制。 这意味着在进行比较之前，它会尝试将操作数转换为相同的类型。 在这种情况下，`null`和`undefined`被认为是相等的。但是，在使用严格相等运算符`===`时，该运算符同时检查值和类型而不执行类型强制，`null`和`undefined`是不相等的：
```js
console.log(null == undefined); // true
console.log(null === undefined); // false
console.log(null == 0);  // false
console.log(null == ''); // false
console.log(undefined == 0); // false
console.log(undefined == ''); // false
console.log(null > 0);  // false
console.log(null == 0); // false
console.log(null >= 0); // true
console.log(undefined > 0);  // false
console.log(undefined < 0);  // false
console.log(undefined == 0); // false
```

## 函数
默认情况下，函数的返回值为`undefined`。对于箭头函数，如果函数体只有一个表达式，则可以省略大括号和`return`关键字。

## 数组
### 学习数组
#### 访问和更新数组中的元素
尝试访问数组中不存在的索引，JavaScript 会返回`undefined`。

#### 从数组的开头和结尾添加和删除元素
`push()`方法用于在数组末尾添加一个或多个元素。`push()`方法的返回值是数组的新长度。
```js
const fruits = ["apple", "banana"];
const newLength = fruits.push("orange");
console.log(newLength); // 3
console.log(fruits); // ["apple", "banana", "orange"]
```
`pop()`方法从数组中删除最后一个元素并返回该元素。 它还会修改原始数组。
```js
let fruits = ["apple", "banana", "orange"];
let lastFruit = fruits.pop();
console.log(fruits); // ["apple", "banana"]
console.log(lastFruit); // "orange"
```
`unshift()`方法将一个或多个元素添加到数组的开头，并返回其新长度。 其工作原理与`push()`类似，但修改的是数组的起始位置而不是结束位置。
```js
let numbers = [2, 3];
let newLength = numbers.unshift(1);
console.log(numbers); // [1, 2, 3]
console.log(newLength); // 3
```
`shift()`方法从数组中移除第一个元素并返回该元素。 它与`pop()`类似，但它作用于数组的开头而不是结尾。
```js
let colors = ["red", "green", "blue"];
let firstColor = colors.shift();
console.log(colors); // ["green", "blue"]
console.log(firstColor); // "red"
```
需要注意的是，`push()`和`unshift()`可以一次添加多个元素，而`pop()`和`shift()`每次只能删除一个元素。

#### 数组解构
数组解构允许跳过不需要的元素，只需用逗号隔开即可。
```js
let colors = ["red", "green", "blue", "yellow"];
let [firstColor, , thirdColor] = colors;

console.log(firstColor); // "red"
console.log(thirdColor); // "blue"
```
数组解构的另一个强大功能是使用默认值。 如果数组中的元素少于要赋值的变量，则可以提供默认值：
```js
let numbers = [1, 2];
let [a, b, c = 3] = numbers;

console.log(a); // 1
console.log(b); // 2
console.log(c); // 3
```
#### 使用字符串和数组方法反转字符串
`reverse()`方法是一个数组方法，用于在原处反转数组。 这意味着它会修改原始数组，而不是创建一个新数组。 
```js
let charArray = ["h", "e", "l", "l", "o"];
charArray.reverse();
console.log(charArray); // ["o", "l", "l", "e", "h"]
```
`join()`方法通过连接数组中的所有元素来创建并返回一个新字符串，这些元素之间用指定的分隔符字符串分隔。 如果要在不使用任何分隔符的情况下连接字符，可以使用空字符串作为参数。
```js
let reversedArray = ["o", "l", "l", "e", "h"];
let reversedString = reversedArray.join("");
console.log(reversedString); // "olleh"
```

### 常见数组方法
#### 使用 indexOf 方法获取数组中元素的索引
`indexOf()`方法可用于查找某个特定元素在数组中首次出现的索引。如果找不到该元素，则返回`-1`。`element`表示要在数组中搜索的值，`fromIndex`参数则是搜索应从哪个位置开始。`fromIndex`参数是可选的。如果没有提供`fromIndex`，则从数组的开头开始搜索。基本语法：
```js
array.indexOf(element, fromIndex)
```

#### 从数组中间添加和删除元素
`splice()`方法允许从数组的任何位置（包括中间位置）添加或删除元素。 `splice()`方法的返回值将是从数组中移除项的数组。如果没有删除任何内容，则返回空数组。需要注意的是，该方法将会改变原始数组，在原处对其进行修改，而不是创建一个新数组。`startIndex`指定开始修改数组的索引，而`itemsToRemove`是一个可选参数，表示要删除多少个元素。 如果省略 `itemsToRemove`，`splice()`将删除从`startIndex`开始到数组末尾的所有元素。 随后的参数（`item1`、`item2`等）是要添加到数组中的元素，从起始索引开始。这是基本语法：
```js
array.splice(startIndex, itemsToRemove, item1, item2)
```

#### 数组的浅拷贝
数组的浅拷贝是一个新数组，具有与原数组相同的项。如果数组只包含像数字或字串这样的原语值，则新数组是完全独立的。但如果数组内部包含其他数组，原数组和拷贝都会引用相同的内部数组。这意味着如果更改共享内部数组中的某些内容，将在两个数组中看到该更改。

`concat()`方法通过合并两个或多个数组来创建一个新数组。当与单个数组一起使用时，它可以有效地创建一个浅拷贝。
```js
const originalArray = [1, 2, 3];
const copyArray = [].concat(originalArray);

console.log(copyArray); // [1, 2, 3]
console.log(copyArray === originalArray); // false
```
另一种创建浅拷贝的方法是`slice()`方法。 在不带参数的情况下，`slice()`返回整个数组的浅拷贝。 
```js
const originalArray = [1, 2, 3];
const copyArray = originalArray.slice();

console.log(copyArray); // [1, 2, 3]
console.log(copyArray === originalArray); // false
```
ES6中引入的展开运算符`...`提供了另一种创建数组浅拷贝的简洁方法。 
```js
const originalArray = [1, 2, 3];
const copyArray = [...originalArray];

console.log(copyArray); // [1, 2, 3]
console.log(copyArray === originalArray); // false
```

## 对象
### 对象及其属性
#### 从对象中移除属性
使用`delete`会从对象中删除所选的属性。
```js
const person = {
  name: "Alice",
  age: 30,
  job: "Engineer"
};

delete person.job;

console.log(person.job); // undefined
```
另一种删除属性的方法是使用带有剩余参数的解构赋值。这种方法实际上并不会删除属性，而是创建一个不包含指定属性的新对象：
```js
const person = {
  name: "Bob",
  age: 25,
  job: "Designer",
  city: "New York"
};

const { job, city, ...remainingProperties } = person;

// { name: "Bob", age: 25 }
console.log(remainingProperties);
```

#### 查看对象是否具有某属性
`hasOwnProperty()`方法方法返回一个布尔值，指示对象是否拥有指定的属性作为其自身属性。
```js
const person = {
  name: "Alice",
  age: 30
};

console.log(person.hasOwnProperty("name")); // true
console.log(person.hasOwnProperty("job")); // false
```
`Object.hasOwn()`是检查对象是否拥有自身（非继承）属性的现代推荐方法。可以将其视为 `hasOwnProperty()`的升级版，更加安全。语法是`Object.hasOwn(object, propertyName)`——将对象作为第一个参数，属性名作为第二个参数传入。
```js
const person = {
  name: "Alice",
  age: 30
};

console.log(Object.hasOwn(person, "name")); // true
console.log(Object.hasOwn(person, "job")); // false
```
`Object.hasOwn()`只检查属性是否存在——它不关心属性的值。这意味着即使值是`0`、`false`、`null`或`undefined`，它仍然返回`true`：
```js
const user = {
  username: "coder123",
  score: 0,
  isActive: false,
  nickname: null
};

// Object.hasOwn() correctly reports these all exist
console.log(Object.hasOwn(user, "score"));    // true  (value is 0, but property exists)
console.log(Object.hasOwn(user, "isActive")); // true  (value is false, but property exists)
console.log(Object.hasOwn(user, "nickname")); // true  (value is null, but property exists)
console.log(Object.hasOwn(user, "email"));   // false (property was never added)

// Danger! Using if() directly gives wrong results for falsy values
if (user.score) {
  console.log("Has score"); // This will NOT print even though score exists!
}

// Safe! Object.hasOwn() gives correct result
if (Object.hasOwn(user, "score")) {
  console.log("Has score:", user.score); // Has score: 0
}
```
另一种查看对象中属性是否存在的方法是使用`in`操作符。与`hasOwnProperty()`类似，如果属性存在于对象上，`in`操作符将返回`true`。
```js
const person = {
  name: "Bob",
  age: 25
};
console.log("name" in person);  // true
```
第三种方法涉及查看属性是否为`undefined`。这种方法可能有用，但它有一些限制。以下是一个示例：
```js
const car = {
  brand: "Toyota",
  model: "Corolla",
  year: 2020
};

console.log(car.brand !== undefined); // true
console.log(car.color !== undefined); // false
```

#### 原语数据类型和非原语数据类型
原语数据类型是 JavaScript 中最简单的数据形式。它们包括`number`、`bigint`、`string`、`boolean`、`null`、`undefined`和`symbol`。这些类型被称为“原语”，因为它们表现单一值且不是对象。

当使用原语数据类型时，直接处理它们的值。例如，当用原语值创建一个变量时，该值会直接保存在变量中。原语值是不可变的，这意味着一旦它们被创建，它们的值就不能被更改。然而，可以为变量赋值一个新值。
```js
let num1 = 5;
let num2 = num1;
num1 = 10;

console.log(num2); // 5
```
非原生类型的数据类型则更复杂。在 JavaScript 中，这些是对象，包括普通对象、数组和函数。与原语不同，非原生类型可以作为属性或元素包含多值。当创建一个非原生类型值的变量时，存储在变量中的实际上是对象存储的内存位置的引用，而不是对象本身。
```js
const originalPerson = { name: "John", age: 30 };
const copiedPerson = originalPerson;

originalPerson.age = 31;

console.log(copiedPerson.age); // 31
```

#### 函数和对象方法的区别
函数是可重用的代码块，用于执行特定的任务。对象方法是关联到对象的函数。它们被定义为对象的属性，并且可以访问和操作对象的数据。

函数和方法之间的区别在于它们的调用方式。函数通过其名称调用，而方法通过所属对象上的点符号调用。另一个重要的区别是它们运行的上下文。普通函数有自己的作用域，但它们没有对任何特定对象的内置引用。方法则绑定到它们的对象，并且可以使用`this`关键字访问该对象的属性和其他方法。一个关键点是，方法有助于将代码组织成逻辑对象，而函数用于更通用的、可重用的代码。

#### Object() 构造函数
`Object()`构造函数可以带或不带`new`关键字使用。当作为函数调用且不带`new`时，其行为取决于传入值的类型。
```js
const num = 42;
const numObj = Object(num); // Creates an object wrapper for the number

console.log(numObj); // Number { constructor: { name: "Number" } }
console.log(typeof numObj); // "object"
```
如果我们尝试将`null`或`undefined`传递给`Object()`构造函数,结果将是一个空对象。:
```js
const newObj = new Object(undefined);
console.log(newObj); // {}
```
`Object()`构造函数的另一个使用场景是当处理一个未知类型的值并且需要确保它是一个对象时。
```js
function toObject(value) {
    if (value === null || value === undefined) {
        return {};
    }

    if (typeof value === "object") {
        return value;
    }

    return Object(value);
}

console.log(toObject(null)); // {}
console.log(toObject(true)); // Boolean { constructor: { name: "Boolean" } }
console.log(toObject([1, 2, 3])); // [1, 2, 3]
```

### JSON
#### JSON.parse()和JSON.stringify() 
`JSON.stringify()`用于将 JavaScript 对象转换为 JSON 字串。`JSON.stringify()`方法还接受一个名为`replacer`的可选参数，该参数可以是一个函数或数组。当我们使用`JSON.stringify()`方法时，我们可以为第二个参数传入一个数组，并指定我们想要序列化的属性。结果将是一个只包含`firstName`和`country`属性的序列化对象字串。
```js
const developerObj = {
  firstName: "Jessica",
  isAwesome: true,
  isMusician: true,
  country: "USA",
};

// result: {"firstName":"Jessica","country":"USA"}
console.log(JSON.stringify(developerObj, ["firstName", "country"]));
```
`JSON.stringify()`方法的另一个可选参数是`spacer`参数。它允许控制字符串化结果的间距：
```js
const developerObj = {
  firstName: "Jessica",
  isAwesome: true,
  isMusician: true,
  country: "USA",
};

console.log(JSON.stringify(developerObj, null, 2));

/* result
{
  "firstName": "Jessica",
  "isAwesome": true,
  "isMusician": true,
  "country": "USA"
}
*/
```
`JSON.parse()`将 JSON 字串转换回 JavaScript 对象。当从网络服务器或`localStorage`获取 JSON 数据并且需要在应用中操作这些数据时，这非常有用。
```js
const jsonString = '{"name":"John","age":30,"isAdmin":true}';
const userObject = JSON.parse(jsonString);
console.log(userObject);

// Result:
// { name: 'John', age: 30, isAdmin: true }
```

## 循环
### 学习循环
`for...in`循环：当需要循环遍历一个对象的属性时，这种类型的循环是最合适的。此循环将迭代对象的所有可枚举属性，包括继承的属性和非数字属性。
```js
const fruit = {
  name: 'apple',
  color: 'red',
  price: 0.99
};

for (const prop in fruit) {
  console.log(fruit[prop]);
}
```

## JavaScript基础复习
### 代码质量与执行
#### 闭包
本质上，闭包是一个函数，即使在外部函数已经返回之后，仍然可以访问其外部封闭词法作用域中的变量。
```js
function outerFunction(x) {
    let y = 10;
    function innerFunction(){
        console.log(x + y);
    }
    return innerFunction;
}

let closure = outerFunction(5);
console.log(closure()); // 15
```
在这个例子中，`outerFunction`接受一个参数`x`并定义一个局部变量`y`。然后它定义了一个使用`x`和`y`的`innerFunction`。最后它返回 `innerFunction`。当我们调用`outerFunction(5)`时，它返回`innerFunction`，我们将其赋值给变量`closure`。当我们稍后调用`closure()`时，它仍然可以访问来自`outerFunction`的`x`和`y`，即使`outerFunction`已经执行完毕。这就是闭包的本质。内部函数维护对其外部词法环境的引用，即使外部函数已完成，也能保持对该环境中变量的访问。

闭包对于创建私有变量和函数特别有用。
```js
function createCounter() {
    let count = 0;
    return function () {
        count++;
        return count;
    };
}

let counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```
在这种分支中，`createCounter`返回一个函数，该函数递增并返回一个`count`变量。`count`变量不能从`createCounter`外部直接访问，但返回的函数（我们的闭包）可以访问它。每次我们调用`counter()`，它都会递增并返回`count`。

闭包还可以从它们的外部作用域捕捉多个变量。
```js
function multiply(x) {
    return function (y) {
        return x * y;
    };
}

let double = multiply(2);
console.log(double(5)); // 10
```
这里内部函数捕捉了来自`multiply`的`x`参数。当我们通过调用`multiply(2)`创建`double`时，它返回一个函数，该函数总是将其参数乘以`2`。

闭包捕捉变量是通过引用而不是通过值。这意味着如果被捕捉变量的值发生变化，闭包将看到新的值。
```js
function createIncrementer() {
    let count = 0;
    return function () {
        count++;
        console.log(count);
    };
}

let increment = createIncrementer();
increment(); // 1
increment(); // 2
```
每次我们调用`increment`时，它都在使用相同的`count`变量，而不是它初始值的拷贝。

### var关键字与提升
#### var关键字
当使用`var`声明一个变量时，它会变成函数作用域或全局作用域。这意味着如果在函数内部使用`var`声明一个变量，它只能在该函数内访问。然而，如果在任何函数外部声明它，它会变成一个全局变量，可以在整个脚本中访问。

`var`的一个问题是它允许多次重新声明同一个变量而不会抛出错误。这可能导致意外覆盖并使调试更加困难。
```js
var num = 5;
console.log(num); // 5

// This is allowed and doesn't throw an error
var num = 10;
console.log(num); // 10
```

`var`最大的问题是它缺乏块级作用域。在`if`语句或`for`循环等块内用`var`声明的变量仍然可以在该块外访问。
```js
if (true) {
  var num = 5;
}
console.log(num); // 5
```

#### 提升
让我们从变量提升开始，当使用`var`关键字声明一个变量时，JavaScript 会将声明提升到其作用域的顶部。然而，关键的是要注意，只有声明被提升，初始化不会被提升。这意味着可以在声明变量之前在代码中使用它，但它的值将是`undefined`，直到实际为它赋值。
```js
console.log(x); // undefined
var x = 5;
console.log(x); // 5
```

函数提升的工作方式有些不同。当使用`function`声明语法声明一个函数时，函数名和函数体都会被提升。这意味着可以在代码中声明函数之前调用它。
```js
sayHello(); // "Hello, World!"

function sayHello(){
  console.log("Hello, World!");
}
```

需要注意的是，ES6 中引入的 let 和 const 声明的提升行为不同。
```js
console.log(y); // Throws a ReferenceError
let y = 10;
```
这些声明会被提升，但它们不会被初始化，并且不能在代码中实际声明之前访问它们。这通常被称为暂时性死区。

## 高阶函数与回调函数
### 学习高阶函数与回调函数
#### 回调函数与forEach
回调函数是作为参数传递给另一个函数的函数，以便外部函数可以在特定点调用它。

`forEach`中的回调函数实际上可以接受最多三个参数：当前元素、当前元素的索引以及调用`forEach`的数组。
```js
let numbers = [1, 2, 3, 4, 5];
numbers.forEach((number, index, array) => {
    console.log(`Element ${number} is at index ${index} in array ${array}`);
});
```

#### 高阶函数
本质上，高阶函数是一个函数，它要么接受一个或多个函数作为参数，要么返回一个函数，或者两者兼有。这意味着函数可以像其他任何值一样被对待——它们可以被赋值给变量，作为参数传递给其他函数，并且可以从函数中返回。

高阶函数也可以返回函数。这对于基于更通用的函数创建特化函数特别有用。这个概念通常被称为函数工厂。
```js
function multiplyBy(factor) {
    return function(number) {
      return number * factor;
    }
}

let double = multiplyBy(2);
let triple = multiplyBy(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

JavaScript 中许多内置数组方法，如`map()`、`filter()`和`reduce()`，都是高阶函数。这些方法将函数作为参数，并以各种方式将其应用到数组的元素上。

#### Reduce方法
`reduce`方法是 JavaScript 中的一个函数，允许处理一个数组并将其压缩为单个值。这个单个值可以是数字、字串、对象，甚至是另一个数组。`reduce`的核心工作原理是按顺序将一个函数应用到数组中的每个元素，将每次计算的结果传递给下一个。这个函数通常被称为`reducer`函数。

`reducer`函数接受两个主要参数：累加器和当前值。累加器是保存操作运行结果的地方，当前值是正在处理的数组元素。
```js
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  0
);

console.log(sum); // 15
```
`reducer`函数接受累加器（从`0`开始，由传递给`reduce`的第二个参数指定）并将每个数字添加到它上面。每次添加的结果成为下一次迭代的新建累加器。如果不提供初始值，`reduce`将使用数组的第一个元素作为初始累加器，并从第二个元素开始进程。

#### 方法链
方法链是一种连续调用多个方法的技术。可以在 JavaScript 中的多种类型的值上使用方法链，包括字串、数组和对象。尽管字串是原语值，但当使用字串方法时，JavaScript 会临时将它们包装在一个`String`对象中。
```js
const result = "  Hello, World!  "
  .trim()
  .toLowerCase()
  .replace("world", "JavaScript");

console.log(result); // "hello, JavaScript!"
```

#### 排序方法
`sort`方法用于排列数组的元素，并返回已排序数组的引用。不会进行拷贝，因为元素是在原地排序的。`sort`方法将元素转换为字串，然后比较它们的 UTF-16 码元序列值。UTF-16 代码单元是表现字串中字符的数值。
```js
const numbers = [414, 200, 5, 10, 3];

numbers.sort((a, b) => a - b);

console.log(numbers); // [3, 5, 10, 200, 414]
```
参数`a`和`b`是被比较的两个元素。如果`a`应该排在`b`之前，比较函数应返回负值；如果`a`应该排在`b`之后，比较函数应返回正值；如果`a`和`b`相等，比较函数应返回零。

#### every()和some()方法
`every()`方法测试数组中的所有元素是否通过由提供的函数实现的测试。简单来说，它检查数组中的每一项是否满足指定的条件。如果提供的函数对数组中的所有元素都返回`true`，则`every()`方法返回`true`。如果有任何元素未通过测试，该方法会立即返回`false`并停止检查剩余元素。
```js
const numbers = [2, 4, 6, 8, 10];
const hasAllEvenNumbers = numbers.every((num) => num % 2 === 0);

console.log(hasAllEvenNumbers); // true
```

`some()`检查是否至少有一个元素通过测试。`some()`方法一旦找到通过测试的元素就返回`true`。如果没有元素通过测试，则返回`false`。
```js
const numbers = [1, 3, 5, 7, 8, 9];
const hasSomeEvenNumbers = numbers.some((num) => num % 2 === 0);

console.log(hasSomeEvenNumbers); // true
```

这两种方法一旦能够确定结果就会停止执行。对于`every()`，这意味着一旦找到`false`结果就会停止。对于`some()`，一旦找到`true`结果就会停止。

## DOM操作与事件
### DOM、点击事件与API
#### API与Web API
API 代表应用编程接口。API 建立了一套规则和协议，使软件应用能够相互通信并高效交换数据。可以将它们视为允许开发者基于已实现的更简单的创建块来创建更复杂功能性的构造。

API 有多种类型。Web API 专门为网页应用设计。客户端 JavaScript 开发有不同类型的 Web API。它们不是 JavaScript 本身的一部分。

这些类型的 API 通常分为两大类：浏览器 API 和第三方 API。

#### 什么是DOM，如何访问元素
DOM 代表文档对象模型。它是一个编程接口，允许我们与超文本标记语言文档进行交互。

HTML 文档是 DOM 层次结构中的根节点。它有一个子节点，即`html`元素。由于所有其他节点都从它派生，因此它是 HTML 文档的根元素。要在 JavaScript 中访问这些元素，可以使用`getElementById()`和`querySelector()`方法。这些方法是 Web API，因为它们提供了使用 JavaScript 访问 DOM 的标准化方式。

使用`getElementById()`，可以获取一个表现具有指定`id`的超文本标记语言元素的对象。`id`在每个超文本标记语言文档中必须是唯一的，因此此方法只会返回一个`Element`对象。
```js
const container = document.getElementById("container");
```

`querySelector()`比`getElementById()`更广泛。使用`querySelector()`，可以获取 HTML 文档中第一个匹配作为参数传入的 CSS 选择器的元素。如果想使用`querySelector()`通过类名选择一个元素，需要在类名前加上点号`.`。

#### querySelectorAll()方法
`querySelectorAll()`方法可以获取匹配特定 CSS 选择器的所有 DOM 元素的列表。
```js
document.querySelectorAll(selectors);
```
在`document`对象上调用它，并传入包含 CSS 选择器的字串作为参数。该参数必须是有效的 CSS 选择器字串。否则，将抛出`SyntaxError`异常。`querySelectorAll()`返回一个`NodeList`对象，该对象是匹配指定 CSS 选择器的节点集合。该列表将包含每个匹配 CSS 选择器的`Element`对象。如果未找到匹配项，列表将为空。这些元素将按照它们在 HTML 文档中出现的顺序排列。

#### 使用innerHTML和createElement()创建新节点
`innerHTML`是`Element`对象的一个属性，可以用它来设置它们的超文本标记语言结构。通过`innerHTML`，可以用字串设置现有元素的超文本标记语言结构，从而创建所有必要的节点。

如果字串将由用户输入，不应该使用`innerHTML`，因为用户可能会将恶意内容插入到网站中。因此，通常建议使用`textContent`来插入纯文本。

另一种创建新节点的方法是使用`createElement()`方法。通过这个新方法可以通过指定它的标签名称来创建一个新元素。如果文档是`HTMLDocument`，则 `createElement()`方法返回一个新建的`HTMLElement`对象。否则，它返回一个`Element`对象。

一旦准备好这个新元素，可以使用`appendChild()`方法将它作为另一个现有元素的子元素添加到 DOM 中，或者可以使用其他方法将它插入到特定位置。

#### innerText、textContent和innerHTML的区别
`innerText`表现 HTML 元素及其子元素的可见文本内容。此属性不包括隐藏文本或 HTML 标签，仅包含渲染的文本。由于`innerText`会考虑可见性，获取其值会触发一个称为 "reflow" 的进程，该进程会重新计算网站上某些元素的位置。此进程可能计算量很大，因此如果可能，应该避免触发它。

`textContent`返回一个元素的纯文本内容，包括其所有子孙中的文本。`innerText`和`textContent`之间最重要的区别是，`textContent`始终返回一个超文本标记语言元素及其子元素的完整文本内容，无论其是可见还是隐藏。`textContent`也将包含像`script`和`style`这样的元素的内容。如果尝试替换节点上的`textContent`的值，它将删除所有子节点，并用包含新字串的单个文本节点替换它们.

#### appendChild()和removeChild()
`appendChild()`方法用于将节点添加到指定父节点的子节点列表末尾。
```js
parentNode.appendChild(newNode);
```
要从 DOM 中移除节点，可以使用`removeChild()`方法。
```js
parentNode.removeChild(childNode);
```
 
#### Navigator、Window和Document
`Navigator`接口提供有关浏览器环境的信息，例如用户代理字串、平台和浏览器版本。用户代理字串是一个标识所使用浏览器和操作系统的文本字串。
```js
console.log(navigator.userAgent);
// "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36"

console.log(navigator.language);
// "zh-CN"
```

`Window`接口表现包含 DOM 文档的浏览器窗口。它提供用于与浏览器窗口交互的方法和属性，例如调整窗口大小、打开新窗口以及导航到不同的 URL。大多数情况下不需要直接与`Window`接口交互，因为它会自动在 JavaScript 代码的全局作用域中可用。
```js
console.log(window.innerWidth);

console.log(location);
```

`Document`接口表现浏览器窗口中显示的 DOM 文档。它提供用于操作 DOM 的方法和属性，例如选择元素、新建元素以及修改元素内容.

#### 使用setAttribute()添加属性
```js
setAttribute(attribute, value);
```

#### 事件对象
`Event`对象是一个负载，当用户以某种方式与网页交互时触发。所有`Event`对象都将具有`type`属性。该属性显示触发负载的事件类型，例如 "keydown" 或 "click"。

`Event`对象将始终具有`target`属性。`target`属性是对触发该事件的对象的引用。最常见的是某种`HTMLElement`对象，或者是`Document`或 `Window`对象。但它也可以是更具体的东西，比如`AudioContext`。

事件也有方法，这些方法是作为属性暴露在对象上的函数。一个常用的方法是`preventDefault()`，调用它可以阻止事件的默认行为。`stopPropagation()`方法阻止事件向上冒泡或传播到父元素。

#### addEventListener()
`addEventListener()`方法用于监听事件。它接受两个参数：想监听的事件和事件发生时将被调用的函数。
```js
element.addEventListener("event", listener);
```
元素是要监视事件的超文本标记语言元素，event 指定要监听的事件类型，例如`"click"`。监听器是一个对象，当事件发生时它将接收通知。大多数情况下，这将是定义的用于处理该事件的函数。

#### removeEventListener()
`removeEventListener()`方法用于移除之前通过`addEventListener()`方法为元素添加的事件监听器。`removeEventListener()`方法接受两个参数：想要移除的事件和之前添加的监听器函数。
```js
element.removeEventListener("event", listener);
```
`removeEventListener()`方法还可以传入一个额外的可选第三个参数。该参数可以是`options`或`useCapture`。`options`参数是一个对象，用于指定事件监听器的选项，例如事件监听器是否应该是被动的或只执行一次。`useCapture`参数是一个布尔值，用于指定事件是否应在事件传播阶段被捕捉。

#### 内联事件处理器
内联事件处理器是超文本标记语言元素上的特殊属性，用于在事件发生时执行 JavaScript 代码。

内联事件处理器只能用于为一个元素添加一个事件监听器。如果想为同一个元素添加多个事件监听器，需要使用`addEventListener()`。另一个原因是内联事件处理器将超文本标记语言和 JavaScript 代码混合在一起，这会使代码更难读取和维护。最好通过使用`addEventListener()`将事件监听器添加到元素，从而将超文本标记语言代码和 JavaScript 代码分开。

内联事件处理器不推荐在现代 JavaScript 中使用。因此，在处理 JavaScript 中的事件时，最好坚持使用`addEventListener()`方法。

#### 使用Element.style和Element.classList操作样式
`Element.style`属性是一个只读属性，表现元素的内联样式。可以使用此属性来获取或设置元素的样式。`style`属性可用于设置许多 CSS 属性，例如 `color`、`background-color`、`font-size`、`font-weight`等。

操作样式的另一种方法是使用`Element.classList`属性。`classList`属性是一个只读属性，可用于为元素添加、移除或切换类。让我们来看几个示例。

#### DOMContentLoaded事件
当 HTML 文档中的所有内容都已装载并解析时，会触发`DOMContentLoaded`事件。如果有外部样式表或图像，`DOMContentLoaded`事件不会等待它们装载。它只会等待 HTML 装载完成。与`load`事件不同，后者等待所有内容装载完成，包括外部样式表、图像等。

#### setTimeout和setInterval 
setTimeout()和setInterval()都接受两个参数：一个函数和一个延迟。

由于`setInterval()`会在指定的间隔内持续执行提供的函数，可能想要停止它。为此必须使用`clearInterval()`方法。`clearInterval()`需要想停止的`setInterval()`的 ID。这可以是为该间隔赋值的变量。停止间隔的一种方法是在`setTimeout()`内部，因为这将在一定时间后停止间隔:
```js
const intervalID = setInterval(() => {
 console.log("This will stop after 5 seconds");
}, 1000);

setTimeout(() => {
 clearInterval(intervalID);
}, 5000);
```
也可以使用`clearTimeout()`方法停止超时：
```js
let timeoutID = setTimeout(() => {
 console.log("This will not run");
}, 5000);

clearTimeout(timeoutID);
```

#### requestAnimationFrame()
`requestAnimationFrame()`是一种方法，允许在下一次屏幕重绘之前调度动画的下一步，从而实现流畅且视觉上吸引人的体验。下一次屏幕重绘是指浏览器刷新网页视觉显示的时刻。这通常每秒发生多次，在大多数显示器上大约为 60 次（或每秒 60 帧）。要使用`requestAnimationFrame()`方法，只需调用它并传入一个回调函数：
```js
requestAnimationFrame(callback);
```
调用`requestAnimationFrame()`必须首先发生在处理动画的函数内，例如`animate()`，以及一个用于更新动画的函数，传统上称为`update()`：
```js
function animate() {
  // Update the animation...
  // for example, move an element, change a style, and more.
  update();
  // Request the next frame
  requestAnimationFrame(animate);
}
```
`update()`函数是魔法发生的地方。在其中，可以更改任何想要动画化的内容。例如，更新样式或更改元素的位置：
```js
function update() {
  element.style.transform = `translateX(${position}px)`;
  position += 2;
}
```
最终启动动画的是调用`requestAnimationFrame()`并传入`animate`函数，这次是在`animate`函数外部：
```js
requestAnimationFrame(animate);
```

#### Web Animations与CSS动画属性
`Web Animations`API（WAAPI）允许直接在 JavaScript 中创建和控件动画。使用 WAAPI，可以更动态地处理动画，使操作更加简便。WAAPI 的核心是`Animation`构造函数，它提供了多个实例方法和属性，允许动态地为元素制作动画。`Animation`构造函数中的一个重要方法是`animate()`。它允许通过指定关键帧和持续时间、方向、缓动和迭代等选项来创建动画。以下是`animate()`方法的基本语法：
```js
element.animate(keyframes, options);
```
`Animation`构造的实例方法和实例属性包括：
```js
play()
pause()
reverse()
finish()
cancel()

playbackRate
currentTime
startTime
effect
timeline
playState
finished
onfinish
oncancel
```

使用 CSS 动画，可以通过`animation-name`、`animation-duration`和`animation-timing-function`等属性以声明式方式定义动画。也可以使用 WAAPI 的`animate()`方法实现相同的效果。区别在于可以更直接和动态地使用`animate()`方法控件创建的动画，但使用 CSS 动画时，需要通过定义自定义样式并在 JavaScript 文件中触发它们来完成更多操作。

CSS 动画非常适合简单且声明式的自动运行动画。这些包括悬停效果、过渡或触发后不需要太多交互的动画。如果动画需要响应用户的点击、滚动等交互，或者希望用户能够动态暂停、倒放或改变速度，WAAPI 是更好的选择。 

#### Canvas
`Canvas` API 是一个强大的工具，允许直接在 JavaScript 文件中操作图形。一切都始于 HTML 中的`canvas`元素。该元素作为一个绘图表面，可以使用`Canvas` API 的实例方法和属性来操作它。

`Canvas` API 提供了创建惊人视觉效果所需的一切，包括形状、文本、动画，甚至复杂的游戏。它具有诸如`HTMLCanvasElement`、`CanvasRenderingContext2D`、`CanvasGradient`、`CanvasPattern`、`TextMetrics` 等接口，这些接口提供了可以在 JavaScript 文件中使用的创建图形的方法和属性。

#### 打开和关闭对话框元素
当想确保用户专注于模态的特定操作或消息时，可以使用`showModal()`方法打开模态对话框。这将为页面上的其他项添加一个背景并禁用它们。这对于显示形式、确认和需要用户操作的关键信息的模态非常理想。

模态框在初始`Render`时是关闭的。可以通过使用`showModal()`方法自动打开模态框。最好将控件交给用户。为此可以为按钮添加点击事件监听器并使用 `showModal()`方法：
```js
const dialog = document.getElementById("modal");
const openButton = document.getElementById("open-modal-btn");

openButton.addEventListener("click", () => {
  dialog.showModal();
});
```
如果需要显示一个对话框，同时仍允许与对话框外的内容交互，那么可以使用`show()`方法：
```js
const dialog = document.getElementById("modal");
const openButton = document.getElementById("open-modal-btn");

openButton.addEventListener("click", () => {
  dialog.show();
});
```
要关闭模态窗口，可以在`dialog`元素内为模态窗口添加一个按钮，并使用`close()`方法：
```js
const dialog = document.getElementById("modal");
const openButton = document.getElementById("open-modal-btn");
const closeButton = document.getElementById("close-modal-btn");

openButton.addEventListener("click", () => {
  dialog.show();
});

closeButton.addEventListener("click", () => {
  dialog.close();
});
```

### 事件对象与事件委托
#### change事件
`change`事件是一种特殊事件，当用户修改某些输入元素的值时触发。更具体地说：
- 当复选框被选中或取消选中时。
- 当单选按钮被选中时。
- 当用户从类似日期选择器或下拉菜单的控件中进行选择时。
- 当输入失去焦点（用户切换到下一个字段的标签（页），或点击表单外部）且用户已更改值时。
- 当用户通过输入一些文本后按回车键等方式确认该值时。
用户在输入时不会触发`change`事件。只有当他们聚焦到另一个元素后，才会触发`change`事件。`change`事件仍然会生成一个`Event`对象，但与大多数其他事件不同，它不会生成自定义实现——只能访问基于`Event`对象的属性和方法。这与`input`事件不同，后者会生成一个专用的`InputEvent`对象。`change`事件在某些方面也有所不同。例如，当用户在字段中输入内容时，会触发`input`事件。

#### 事件冒泡和事件委托
事件冒泡，或传播，指的是当事件被触发时，事件如何“冒泡”到父对象。事件委托可以被视为相反的过程。它是将一个捕捉到的事件，委托给另一个元素的进程。

## 无障碍
### aria-expanded、aria-live与常见ARIA状态
#### 使动态和交互式内容可访问
在实际应用中，内容很少是静态的，页面通常通过 JavaScript 动态更新。当发生这种情况时，确保这些更改也反映在`HTML`中非常重要。这使得屏幕阅读器能够准确地向用户传达更新后的状态。否则，依赖辅助工具的人可能永远不会知道内容发生了变化，或者可能会收到过时或误导性的信息。

#### aria-expanded属性
`aria-expanded`属性用于无障碍目的，以指示控件是展开还是折叠。它与可折叠的小部件一起使用，如菜单、手风琴和其他控制内容可见性的信息披露小部件。如果控件是展开的，`aria-expanded`属性设置为`true`，如果是折叠的，则设置为`false`。`aria-expanded`提供的信息使使用屏幕阅读器的人能够理解控件的当前状态（是展开还是折叠）。`aria-expanded`属性应用于切换可折叠小部件可见性的交互元素。例如，如果按钮切换可展开菜单，则 `aria-expanded`属性放置在该按钮上。`aria-expanded`的值应随着用户与元素交互时使用 JavaScript 动态更新。

属性`aria-controls`和`aria-owns`可以与`aria-expanded`结合使用，以建立控件元素与其控件元素之间的程序连接。当与`aria-expanded`一起使用时，`aria-controls`属性用于指定被控元素。例如，按钮可能会展开或折叠作为菜单的列表。`aria-controls`的值将是被控元素的`id`。

对于像这样的可展开控件，最好让展开的内容在 DOM 中紧跟控制它的元素之后。这可以防止屏幕阅读器用户必须查找展开的内容，并使键盘用户更容易导航展开内容中的任何交互控件。如果无法将展开的内容立即放置在控件元素之后，`aria-owns`属性允许在无障碍树中将其虚拟地移动到控件之后。这使得辅助技术如屏幕阅读器能够假装展开的内容直接放置在 DOM 中控件之后。

使用`aria-owns`属性存在缺点。它会为屏幕阅读器用户造成不必要的冗长，因为大多数屏幕阅读器在首次展开时会自动朗读展开元素的全部内容。它也不会改变标签（页）顺序，可能会迫使键盘用户在到达展开内容之前，必须通过页面上的所有其他交互控件，除非使用 JavaScript 管理标签（页）顺序。

理想情况下，可展开内容应放置在控件元素之后，且只有在无法实现该情况的最坏情况下才应使用`aria-owns`属性。如果必须使用，需要使用各种屏幕阅读器和浏览器进行彻底测试，以确保实现对所有人都是可访问的。

当使用`aria-controls`或`aria-owns`时，`aria-expanded`的值必须在控件展开和折叠时持续更新。

#### aria-live属性
`aria-live`属性在页面上创建一个实时区域，可用于在动态内容发生变化时通知屏幕阅读器用户。实时区域的常见用途包括在执行操作后显示的消息（例如错误信息或确认消息）、定期更新的内容（例如跑马灯、走马灯或倒计时器），或通用的状态消息（例如关于进程的更新）。

由于屏幕阅读器的阅读焦点一次只能位于一个位置，如果焦点在页面的其他部分，屏幕阅读器用户将不会注意到内容的变化。实时区域允许屏幕阅读器用户自动接收页面上实时发生的变化通知。没有实时区域，屏幕阅读器用户可能会错过视觉用户可见的重要内容更新，因为视觉用户能够扫描整个页面。

根据信息的优先级，此属性有三种可能的值:
- 如果将`aria-live`设置为值`assertive`，这意味着更新非常重要。它具有最高的优先级，因此应该立即通知用户。这意味着屏幕阅读器将中止它当前正在进行的任何公告，以宣布实时区域中的内容更改。此类中止可能会极其干扰，因此`assertive`值应仅用于时间敏感或关键通知。
- 下一个优先级的值是`polite`。该值表示更新不是紧急的，因此屏幕读取器可以等待当前的任何公告完成或用户停止类型指派后再宣布更新。大多数实时区域将使用`polite`值。
- `aria-live`的最低优先级值是`off`，这意味着除非内容位于当前具有键盘焦点的元素中，否则更新不会被宣布。实际上，这个值几乎从未被使用，因为使用场景非常狭窄，并且在屏幕阅读器中几乎没有一致地实现（如果有的话）。如果需要实时区域，计划为除需要`assertive`的关键消息外的所有内容使用 `polite`。

如果更新的信息包含在具有`alert`、`log`、`marquee`、`status`或`timer` ARIA 角色的元素中，则不需要 aria-live 属性，因为这些角色已经具有默认的 aria-live 值。但可以通过在元素上显式设置 aria-live 来更改默认值。

选择合适的`aria-live`值取决于更新信息的优先级。如果更新很紧急，应该立即使用`assertive`通知用户。但应该仅在更新确实紧急时使用此方法，因为突然的中止可能会使用户迷失方向并影响用户体验。如果更新可以等到当前任务完成后再进行，应该使用`polite`。

#### 自定义控件元素上常用的 ARIA 状态
`aria-selected`状态用于指示元素已被选中。可以在自定义控件中使用此状态，例如标签（页）接口、列表框或网格。标签（页）用于在有限空间内显示多个内容窗格。`aria-selected`状态用于指示当前选中的标签（页）。

`aria-disabled`状态用于向使用辅助技术（例如屏幕阅读器）的人指示某个元素已被禁用。需要注意的是，`aria-disabled`并不会真正禁用该元素。由开发者负责使其看起来并表现得像一个禁用的元素。此属性也常用于本地的超文本标记语言元素，替代 `disabled`属性。选择哪一个取决于按钮所使用的上下文。

`aria-haspopup`状态用于指示交互式元素在激活时将触发弹出元素。只有当弹出元素具有以下角色之一时才能使用`aria-haspopup`属性：`menu`、`listbox`、`tree`、`grid` 或 `dialog`。`aria-haspopup` 的值必须是这些角色之一或 `true`，后者默认为 `menu` 角色。

`aria-required`属性用于指示在提交表单之前需要填写某个字段。如果标签已经包含单词`required`，那么应该省略`aria-required`属性。这确保屏幕阅读器只会读取一次单词`required`。在大多数情况下可能会使用带有`required`属性的本地`label`和`form`元素。但如果需要创建自定义表单控件，则在必要时添加`aria-required`属性非常重要。此外，`aria-required`属性也可以用于本地的表单输入，例如`input`、`textarea`和`select`元素。通常这比本地的`required`属性更受欢迎，因为`required`属性可能存在潜在的可用性和无障碍问题，特别是浏览器提供的默认误差处理。最终需要进行测试以确定哪种属性最适合。

`aria-checked`属性用于指示元素是否处于选中状态。它最常用于创建自定义复选框、单选按钮、开关和列表框时。本地的复选框元素具有内置的`checked`状态，该状态会传达给辅助技术。但如果正在创建自定义复选框控件，则需要使用`aria-checked`属性来指示其状态。当用户与自定义复选框控件交互时需要使用`aria-checked`状态来反映复选框的新状态。当复选框被选中时，`aria-checked`属性设置为`true`。当复选框未被选中时，设置为`false`。

本地的元素通常具有更好的支持和内置无障碍特色。但是，如果必须创建自定义控件，使用 ARIA 属性对于有效地向辅助技术传达这些控件的状态是必不可少的。

#### aria-controls属性
`aria-controls`属性用于创建一个程序化关系，连接控制页面上另一个元素存在的元素与它所控制的元素。此关系可以帮助屏幕阅读器用户更好地理解控件的工作方式。常见用法包括一组控制不同内容区域可见性的标签（页），或一个切换菜单可见性的按钮。

## 调试
### Debug技巧
四种常见的错误信息类型是`SyntaxError`、`ReferenceError`、`TypeError`和`RangeError`。
- 当代码中写错东西时，比如缺少一个括号或方括弧，就会发生`SyntaxError`。可以把它想象成句子中的语法错误。
- `ReferenceError`有多种类型，由不同方式触发。第一种`ReferenceError`类型是未定义的变量。另一个`ReferenceError`的例子是尝试在用`let`或`const`声明的变量被定义之前访问该变量。
- 第三种常见的误差是`TypeError`。当尝试对错误的类型执行操作时，会发生这些误差。
- 最后一个常见误差是`RangeError`。当代码尝试使用超出 JavaScript 可处理范围的值时，会发生`RangeError`。

### 调试器语句
当 JavaScript 执行代码并遇到`debugger`语句时，它会立即在该行暂停执行。然而这只有在浏览器开发者工具打开时才会发生。否则，`debugger`语句会被忽略，代码将照常运行。

当使用`debugger`语句时，现代浏览器会在指定行暂停代码执行。它们还允许通过点击播放按钮恢复执行，但页面本身不会自动重新加载，除非手动触发。

### 高级调试技术
监视表达式允许在代码运行时监控变量或表达式的值，即使它们不在当前作用域内。要添加监视表达式，请导航到开发者工具的 Sources 标签（页），在右侧查找监视窗格，然后点击加号`+`图标进行添加。

`console.table()`在控制台中以表格形式显示表格数据。它接受一个必需的参数，该参数必须是数组或对象，以及一个选择性参数，用于指定要显示的属性或列。

`console.dir()`允许显示指定 JavaScript 对象属性的交互式列表。它输出一个可展开以查看所有嵌套属性的分层列表。

## 基础正则表达式
### 正则表达式
#### 正则表达式与常见方法
正则表达式，或称 regex，是一种特殊的语法，用于创建一个 "pattern"，可以用它来查看 string、提取文本等。在 JavaScript 中通过在两个斜线（/）之间创建模式来定义正则表达式。基本的正则表达式：
```js
const regex = /freeCodeCamp/;
```

`test()`方法存在于`RegExp`对象上，`RegExp`对象是表现正则表达式（例如我们刚刚定义的那个）的对象。`test()`方法接受一个字串，该字串用于对正则表达式进行匹配测试。
```js
const regex = /freeCodeCamp/;
const test = regex.test("e");
console.log(test); // false
```

`match()`方法接受一个正则表达式，虽然也可以传入一个字串，它将被构造成一个正则表达式。`match()`返回该字串的匹配数组。不匹配时，返回 `null`而不是数组。
```js
const regex = /freeCodeCamp/;
const match = "freeCodeCamp".match(regex);
console.log(match);

// [
//   'freeCodeCamp',
//   index: 0,
//   input: 'freeCodeCamp',
//   groups: undefined
// ]
```
`groups`属性会显示任何捕捉的组。`index`属性告诉在字串中的第几个字符找到了匹配。在我们的分支中，它是在字串的开头找到的。`input`属性告诉`match()`方法被调用时的字串。

`replace()`方法，它接受两个参数：用于匹配的正则表达式（或者字串，如果不需要正则表达式的所有特色），以及用于替换匹配项的字串（或者对每个匹配项运行的函数）。

#### 常见正则表达式修饰符
`i`标记使正则表达式忽略分支。标记放在正则表达式的结束斜线后面：
```js
const regex = /freeCodeCamp/i;
```
```js
const regex = /freeCodeCamp/i;

console.log(regex.test("freeCodeCamp")); // true
console.log(regex.test("freeCodeCamp is great")); // true
console.log(regex.test("I love freeCodeCamp")); // true
console.log(regex.test("freecodecamp")); // true
console.log(regex.test("FREECODECAMP")); // true
console.log(regex.test("free")); // false
console.log(regex.test("code")); // false
console.log(regex.test("camp")); // false
```

`g`标记，或全局修饰符，允许正则表达式匹配一个模式多次。当需要从单个字串中获取多个匹配时，全局标记非常有用。但如果用相同的正则表达式测试多个字串，最好关闭`g`标记。一个正则表达式可以使用多个标记（根据需要的数量）来实现想要的行为：
```js
const regex = /freeCodeCamp/gi;
```
```js
const regex = /freeCodeCamp/gi;

console.log(regex.test("freeCodeCamp")); // true
console.log(regex.test("freeCodeCamp is great")); // false
console.log(regex.test("I love freeCodeCamp")); // true
console.log(regex.test("freecodecamp")); // false
console.log(regex.test("FREECODECAMP")); // true
console.log(regex.test("free")); // false
console.log(regex.test("code")); // false
console.log(regex.test("camp")); // false
```
全局修饰符使正则表达式具有状态。这意味着它会跟踪之前匹配过模式的位置。所以当它匹配第一个`freeCodeCamp`字串时，它会记住在索引`0`处找到了匹配。

当一个正则表达式是全局的时候，它会获得一个名为 lastIndex 的新建属性。
```js
const regex = /freeCodeCamp/gi;

console.log(regex.lastIndex); // 0
console.log(regex.test("freeCodeCamp")); // true
console.log(regex.lastIndex); // 12
console.log(regex.test("freeCodeCamp is great")); // false
console.log(regex.lastIndex); // 0
console.log(regex.test("I love freeCodeCamp")); // true
console.log(regex.lastIndex); // 19
console.log(regex.test("freecodecamp")); // false
console.log(regex.lastIndex); // 0
console.log(regex.test("FREECODECAMP")); // true
console.log(regex.lastIndex); // 12
console.log(regex.test("free")); // false
console.log(regex.lastIndex); // 0
console.log(regex.test("code")); // false
console.log(regex.lastIndex); // 0
console.log(regex.test("camp")); // false
```

入符号`^`锚点，位于正则表达式的开头，表示“匹配字串的开始”：
```js
const start = /^freecodecamp/i;
```
美元符号`$`锚点，位于正则表达式的末尾，表示“匹配字串的结尾”：
```js
const end = /freecodecamp$/i;
```
```js
const start = /^freecodecamp/i;
const end = /freecodecamp$/i;
console.log(start.test("freecodecamp")); // true
console.log(end.test("freecodecamp")); // true
console.log(start.test("freecodecamp is great")); // true
console.log(end.test("freecodecamp is great")); // false
console.log(start.test("i love freecodecamp")); // false
console.log(end.test("i love freecodecamp")); // true
console.log(start.test("have met freecodecamp's founder")); // false
console.log(end.test("have met freecodecamp's founder")); // false
```

可以使用`m`标记，或多行修饰符，使正则表达式处理多行。

`d`标记扩展了你在匹配对象中获得的信息。匹配对象获得了一个新的`indices`属性！该属性是一个包含两个数字的数组，第一个数字是匹配在原始字串中开始的位置索引，第二个数字是匹配结束后的位置索引。该数组还有一个额外的`groups`属性，专门用于命名捕捉组。

unicode 修饰符，或`u`标记。它扩展了正则表达式的功能性，使其能够匹配特殊的 unicode 字符。

`v`标记，它进一步扩展了 unicode 匹配的功能性。

粘性修饰符，或者说是`y`标记。粘性修饰符的行为与全局修饰符非常相似，但有一些例外。最大的问题是，全局的正则表达式将从`lastIndex`开始并在字串的剩余部分查找另一个匹配，但粘性正则表达式如果在之前的`lastIndex`处没有立即匹配，则会返回`null`并将`lastIndex`重置为`0`。

单行修饰符，或称为`s`标记。请记住，多行修饰符允许起始和结束锚点匹配行的开始和结束，而不是整个字串。单行修饰符允许通配符字符，在正则表达式中由句点`.`表现，匹配换行符——有效地将字串视为单行文本。

#### 字符串匹配和替换
默认情况下，`match()`和`replace()`只针对第一个模式出现进行操作。
```js
const regex = /freecodecamp/;
const str = "freecodecamp is the best we love freecodecamp";
const matched = str.match(regex);
const replaced = str.replace(regex, "freeCodeCamp");
console.log(matched);
console.log(replaced);

// [
//   'freecodecamp',
//   index: 0,
//   input: 'freecodecamp is the best we love freecodecamp',
//   groups: undefined
// ]
// freeCodeCamp is the best we love freecodecamp
```
`match()`只返回了第一个匹配，`replace()`也只替换了第一个匹配。可以通过在正则表达式上使用全局的修饰符来避免这个问题。当在`match()`中使用全局修饰符时，会失去匹配数组中关于捕捉组和字串索引的额外信息。
```js
const regex = /freecodecamp/g;
const str = "freecodecamp is the best we love freecodecamp";
const matched = str.match(regex);
const replaced = str.replace(regex, "freeCodeCamp");
console.log(matched);
console.log(replaced);

// [ 'freecodecamp', 'freecodecamp' ]
// freeCodeCamp is the best we love freeCodeCamp
```
2019 年的 ECMAScript 更新为我们带来了两个新方法：`matchAll()`和`replaceAll()`。像它们的单数对应方法一样，这些方法接受一个字串或正则表达式，而`replaceAll()`还接受第二个参数作为替换用的字串。但与之前的方法不同，如果你给`replaceAll()`和`matchAll()`传入没有全局修饰符的正则表达式，它们会抛出误差。
```js
const pattern = "freecodecamp";
const str = "freecodecamp is the best we love freecodecamp";
const matched = str.matchAll(pattern);
const replaced = str.replaceAll(pattern, "freeCodeCamp");
console.log(matched);
console.log(replaced);

// {}
// freeCodeCamp is the best we love freeCodeCamp
```
那个空对象是什么？`matchAll()`返回一种称为`Iterator`的特殊类型对象，freeCodeCamp 控制台无法处理它。`Iterator`有一个`next()`方法，我们可以调用它来获取下一个值。`next()`给我们一个包含两个值的对象：`done`，当迭代器中还有更多元素时为`false`，以及`value`，它是我们刚刚迭代过的值。

`matchAll()`迭代器是惰性的。它不会一次找到你所有的匹配项。只有当你通过调用`next()`告诉它时，它才会找到一个匹配项。只要找到匹配，它就不是`done`。一旦找不到匹配并返回`undefined`，它就是`done`。

#### 字符类
通配符由句点或点号`.`表现，匹配除换行符之外的任意单个字符。要允许通配符类匹配换行符，请记住需要使用`s`标记。
```js
const regex = /a./;
```

如果想匹配一个数字字符可能需要写出每个可能的数字，用或操作符`|`分隔它们：
```js
const regex = /0|1|2|3|4|5|6|7|8|9/;
```
存在一个字符类用于这个精确的模式，并提供了编写相同内容的简写语法。在这个分支中，字符类写作一个斜线（\）后跟一个 d 字符，此正则表达式将匹配与我们之前的表达式完全相同的模式：字串中任意位置的单个数字字符。：
```js
const regex = /\d/;
```
现在考虑一个正则表达式，它还需要匹配任何字母字符 a 到 z。可以写出每个单独的字符并用或操作符分隔。或者可以使用另一个字符类`\w`类，即一个斜线后跟一个`w`，表现为任何单词字符，单词字符被定义为从 a 到 z 的任何字母，或从 0 到 9 的数字，或下划线（_）字符：
```js
const regex = /\w/;
```
空白字符类`\s`，由一个反斜线后跟一个`s`表现。这个字符类将匹配任何空白字符，包括换行符、空格、标签（页）和特殊的 unicode 空白字符。

这些特殊字符类可以被取反。要取反其中一个字符类，不要在斜线后使用小写字母，而是使用对应的大写字母。例如这个正则表达式不匹配数字字符。相反，它匹配任何不是数字字符的单个字符：
```js
const regex = /\D/;
```
对`\w`类取反将匹配任何不是`a`到`z`、`0`到`9`或下划线的字符，对`\s`字符类取反将匹配任何不是空白的字符。

可以使用方括弧来构造你自己的字符类，此正则表达式将匹配列表中为`a`、`b`、`c`、`d`或`f`的单个字符：
```js
const regex = /[abcdf]/;
```

当有连续的字符时可以使用连字符创建一个范围。使用范围，我们可以将我们的正则表达式转换为更短的语法，同时匹配完全相同的模式:
```js
const regex = /[a-d]/;
```

正则表达式默认是区分分支的。这意味着我们的字符类只会匹配`a`、`b`、`c`和`d`的小写变体。可以使用`i`标记来实现这一点，但也可以通过包含大写变体将其直接内置到你的字符类中：
```js
const regex = /[a-zA-Z]/;
```
也可以在自己的字符类中混合数字和数字。例如如果想要`\w`类的行为但不包含下划线，可以构造：
```js
const regex = /[a-zA-Z0-9]/;
```
如果想让自己的字符类匹配字面连字符，需要将连字符放在类的开头或结尾：
```js
const regex = /[-a-zA-Z0-9]/;
```

#### Lookahead和Lookbehind断言
前瞻和后顾断言允许你根据周围模式的存在或缺失来匹配特定的模式。这些断言有四种变体。

正向前瞻断言是当一个模式后面跟着另一个模式时，该断言将匹配该模式。要构造一个正向前瞻，需要从想要匹配的`pattern`开始。然后，使用括号将想用作条件的`pattern`包裹起来。在开括号后，使用`?=`来定义该`pattern`为正向前瞻。此模式仅当`free`后面跟着`code`时才会匹配该单词：
```js
const regex = /free(?=code)/i;
```
```js
const regex = /free(?=code)/i;
console.log(regex.test("freeCodeCamp")); // true
console.log(regex.test("free code camp")); // false
console.log(
  regex.test("I need someone for free to write code for me")
); // false
```

如果想匹配`free`出现时后面不跟着`code`呢？可以将正向前瞻转换为负向前瞻以反转行为。为此，将`?=`改为`?!`：
```js
const regex = /free(?!code)/i;
```
```js
const regex = /free(?!code)/i;
console.log(regex.test("freeCodeCamp")); // false
console.log(regex.test("free code camp")); // true
console.log(
  regex.test("I need someone for free to write code for me")
); // true
```
回顾断言的功能类似于前瞻断言，不同之处在于它们不是基于后续的模式进行条件式匹配，而是基于前述的模式进行条件式匹配。让我们来看一个正向回顾。正向后行断言用`?<=`表示，而不是`?=`。让我们的正则表达式匹配前面带有`free`的`code`：
```js
const regex = /(?<=free)code/i;
```
```js
const regex = /(?<=free)code/i;
console.log(regex.test("freeCodeCamp")); // true
console.log(regex.test("free code camp")); // false
console.log(
  regex.test("I need someone for free to write code for me")
); // false
```

要匹配未被`free`之前的`code`，我们可以使用负向回顾。负向回顾是通过将`?<=`替换为`?<!`来定义的：
```js
const regex = /(?<!free)code/i;
```

#### 正则表达式量词
量词由包含一个或两个数字的括弧状的花括弧定义。让我们在我们的模式中使用一个量词：
```js
// 两者等价
const regex = /^\d{4}$/;

const regex = /^\d\d\d\d$/;
```
七位数的标识符相当长。这些标识符的最大位数应为 6 位，最小位数应为 4 位。为实现此目的可以在逗号后为量词添加第二个数字。不能单独使用此语法来设置最大值——必须始终设置最小值。：
```js
const regex = /^\d{4,6}$/;
console.log(regex.test("123")); // false
console.log(regex.test("1234")); // true
console.log(regex.test("12345")); // true
console.log(regex.test("123456")); // true
console.log(regex.test("1234567")); // false
```
实际上有一个针对单个可选字符的特殊简写量词——问号`?`。让我们用问号替换我们的量词：
```js
const regex = /^[a-zA-Z]?\d{4,6}$/;
console.log(regex.test("123")); // false
console.log(regex.test("a1234")); // true
console.log(regex.test("12345")); // true
console.log(regex.test("az12345")); // false
console.log(regex.test("X123456")); // true
console.log(regex.test("1234567")); // false
```
有另一种简写表示“匹配前一个字符零次或多次”——星号`*`符号。让我们用它替换模式中的量词，并进行测试：
```js
const regex = /^[a-zA-Z]*\d{4,6}$/;
console.log(regex.test("123")); // false
console.log(regex.test("a1234")); // true
console.log(regex.test("12345")); // true
console.log(regex.test("az12345")); // true
console.log(regex.test("X123456")); // true
console.log(regex.test("1234567")); // false
```
同样，我们可以使用一个最小值为 1 且没有定义最大值的量词，或者我们可以使用另一个特殊语法——加法`+`符号：
```js
const regex = /^[a-zA-Z]+\d{4,6}$/;
console.log(regex.test("123")); // false
console.log(regex.test("a1234")); // true
console.log(regex.test("12345")); // false
console.log(regex.test("az12345")); // true
console.log(regex.test("X123456")); // true
console.log(regex.test("1234567")); // false
```

#### 捕捉组和反向引用
捕捉组允许你“捕捉”匹配字串的一部分，以便你根据需要使用。捕捉组由包含要捕捉的模式的括号定义，且没有像前瞻这样的前导字符。
```js
const regex = /free(code)camp/i;
console.log(regex.test("freecodecamp")); // true
```
在 JavaScript 中，命名反向引用以斜线开头，后跟字母`k`。然后你添加名称，同样用小于号`<`和大于号`>`括起来。
```js
const regex = /free(?<code>co+de)camp.*free\k<code>camp/i;
console.log(regex.test("freecooooodecamp is freecooooodecamp")); // true
```

## 表单验证
### 理解表单验证
#### 验证形式
某些超文本标记语言元素，例如`textarea`和`input`元素，暴露了一个约束验证 API。该 API 允许你断言用户为该元素提供的值通过你编写的任何超文本标记语言级别的验证，例如最小长度或模式匹配。

`checkValidity()`方法是约束验证 API 的一部分。`checkValidity()`方法在元素匹配所有基于其属性的超文本标记语言验证时返回`true`，否则返回`false`。

`reportValidity()`方法会立即报告无效状态，而不是等待我们提交表单。但它仍然使用默认消息。这是因为`reportValidity()`方法只是告诉浏览器输入无效。浏览器仍然选择如何显示无效的原因。这就是`setCustomValidity()`方法的作用所在，此方法接受一个自定义错误信息，该信息会显示给用户。

如果想进一步了解不同类型的有效性状态以及某个特定验证失败的原因，可以这样记录`validity`属性：
```js
const input = document.querySelector("input");

input.addEventListener("input", (e) => {
  console.log(e.target.validity);
})
```
`validity`属性是`ValidityState`对象的一个实例。以下是该对象在浏览器中的示例：
```js
ValidityState {
  badInput: false,
  customError: false,
  patternMismatch: true,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: true,
  valueMissing: false,
  valid: true
}
```

#### preventDefault()方法的目的
每个在 DOM 中触发的事件都有某种默认行为。复选框上的`click`事件默认切换该复选框的状态。按下聚焦按钮上的空格键会激活该按钮。调用这些事件对象上的`preventDefault()`方法可以阻止该行为发生。

当对`input`元素的`keydown`事件调用`preventDefault()`时，会阻止显示在输入字段中的字符。

#### 提交事件与表单
表单可以通过三种方式提交：
- 当用户点击表单中`type`属性设置为`submit`的按钮时。
- 当用户在表单中任何可编辑的输入字段上按下`Enter`键时。
- 通过 JavaScript 调用表单元素的`requestSubmit()`或`submit()`方法。

需要查看的第一个属性是`action`属性。`action`属性应包含一个 URL 或当前域的相对路径。该值决定了表单尝试发送数据的位置。如果没有设置`action`属性，表单将把数据发送到当前页面的 URL。

第二个用于控制提交行为的属性是`method`属性。该属性接受标准的超文本传输协议方法，例如`GET`或`POST`，并在向`action` URL发起请求时使用该方法。当未设置方法时，表单将默认使用`GET`请求。`GET`请求用于从指定资源检索数据而不对其进行任何更改，参数通常以查询字串的形式追加到 URL 中。表单中的数据将作为`name=value`点对进行 URL 编码，并作为查询参数追加到`action` URL。

也许不想将数据作为 URL 编码的表单负载发送？`form`元素接受一个`enctype`属性，该属性表现用于数据的编码类型。此属性仅接受三个值：`application/x-www-form-urlencoded`（这是默认值，将数据作为 URL 编码的表单体发送）、`text/plain`（以纯文本形式发送数据，使用换行符分隔的`name=value`点对），或`multipart/form-data`，专门用于处理带有文件上传的表单。

## 日期
### 了解日期
#### Date对象
Date对象时间使用的是 24 小时制格式，`GMT+0800`是时区偏移量，`中国标准时间`是时区名称。可以通过提供年、月、日、小时、分钟、秒和毫秒值作为参数，将特定的日期和时间传递给`Date`对象。
```js
const now = new Date();
console.log(now);
// Fri Mar 27 2026 15:52:15 GMT+0800 (中国标准时间)

const specificDate = new Date("July 4, 1776 12:00:00");
console.log(specificDate);
// Thu Jul 04 1776 12:00:00 GMT+0805 (中国标准时间)
```
要获取当前日期和时间可以使用`Date.now()`方法，它返回自`January 1, 1970, 00:00:00 UTC`以来的毫秒数。这被称为 Unix 纪元时间。

如果你需要根据当前日期获取一个月中的某一天，可以使用`getDate`方法。要获取月份可以使用`getMonth`方法，月份是从零开始的。如果需要获取完整的年份可以使用`getFullYear`方法：
```js
const now = new Date();
const date = now.getDate();
const month = now.getMonth();
const year = now.getFullYear();
console.log(date);  // 27
console.log(month); // 2 (3月)
console.log(year);  // 2026
```
`Date`对象上还有许多其他方法，包括`getHours`、`getMinutes`、`getSeconds`等。

#### 日期格式的不同方式
要以扩展的 ISO 格式（ISO 8601）格式化日期可以使用`toISOString()`方法，ISO 8601 是一个用于表现日期和时间的国际标准。格式为 `YYYY-MM-DDTHH:mm:ss.sssZ`。
```js
const date = new Date();
console.log(date.toISOString());  // "2026-03-27T07:59:03.510Z"
```
另一种格式化日期的方法是使用 toLocaleDateString() 方法。此方法允许你根据用户的局部格式化日期。`toLocaleDateString()`方法接受两个可选的参数：`locales`和`options`。`locales`参数是一个表现要使用的区域设置的字串。如果不传入`locales`参数，则使用默认区域设置。第二个可选的参数是`options`参数。该参数是一个对象，允许你指定日期字串的形式。
```js
const date = new Date();
console.log(date.toLocaleDateString()); // "2026/3/27"
console.log(date.toLocaleDateString("fr-FR")); // "27/03/2026"

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
console.log(date.toLocaleDateString("en-GB", options)); // "Friday, 27 March 2026"
```

## 音频与视频事件
### 了解音频与视频事件
#### 音频构造函数
`Audio`构造函数，像其他构造函数一样，是一个使用`new`关键字调用的特殊函数。它返回一个`HTMLAudioElement`，你可以用它为用户播放音频，或将其追加到 DOM 中，让用户自行控制。当调用构造函数时，可以可选地传入一个 URL 作为（唯一）参数。该 URL 应指向想播放的音频文件的源。或者如果需要动态更改源，可以将 URL 赋值给返回的音频元素的`src`属性。

返回的音频元素提供了多种用于控制音频的控件。你最有可能使用`play()`方法，它开始音频播放。还有`pause()`方法，它暂停音频播放但保留当前轨道位置，允许`play()`从该点继续播放。可能会期望有一个`stop()`方法，用于暂停音频播放并将轨道重置到开头。但实际上，你应该调用`pause()`并直接设置`currentTime`属性。

`canPlayType()`方法可用于确定浏览器是否可能能够播放你特定的音频形式。

#### 视频与音频的不同形式
MIME 类型，全称为多用途互联网邮件扩展，是一种以编程方式标准化指示文件类型的方法。几乎每种文件格式都有一个 MIME 类型。例如，超文本标记语言 有类型`text/html`。一个 JSON 对象有类型`application/json`。甚至一个 Windows`.exe`安装程序也有 MIME 类型：`application/vnd.microsoft.portable-executable`。MIME 类型可以告诉应用程序，例如你的浏览器，如何处理特定的文件。在音频和视频的情况下，MIME 类型表示它是一种可以嵌入网页的多媒体格式。

MP3 文件的 MIME 类型是`audio/mpeg`。然而，MP4 可以具有 MIME 类型`audio/mp4`或`video/mp4`，具体取决于它是视频文件还是仅音频。还有许多其他文件格式，例如波形格式 WAV、多用途的 OGG、用于 Windows 媒体播放器的 WMV、开源的 MKV，以及更多。

有时无法知道用户的计算机会支持（或不支持）哪种格式。幸运的是`video`和`audio`元素都支持`source`元素。使用`source`元素，可以指定一个文件类型和`source`，并且可以通过使用多个`source`元素包含多种不同的类型。 当这样做时，浏览器将根据用户当前的环境确定最佳格式。

#### Codec
codec 是 “encoder/decoder” 的缩写，是一种可以在模拟和数字的音频与视频之间转换的算法或软件。编解码器可以作为 MIME 类型的一部分指定。定义编解码器的基本语法是在媒体类型后添加分号，然后是`codecs=`和编解码器。

使用 Vorbis 编解码器的 OGG 音频文件的 MIME 类型可能是`audio/ogg; codecs=vorbis`。或者，如果一个文件支持多种编解码器，你可以将它们指定为逗号分隔，但必须用引号括起来：`video/webm; codecs="vp8, vorbis"`。但是某些文件类型的编解码器语法要复杂得多。例如，MP4 可能有一个`codecs="avc1.4d002a"`的编解码器，表示它是用 H.264 编码的。

可以将它们包含在`source`元素的`type`属性中。这允许为相同的格式指定不同的编解码器，从而在确定为该用户环境使用哪种格式时，给浏览器提供更细粒度的选项。但也可以将它们用作传递给全局`MediaSource.isTypeSupported()`方法的 MIME 类型的一部分。该方法接受一个 MIME 类型，如果环境可能支持它，则返回`true`。或者更确切地说，如果无法为该文件类型实例化缓冲区，则返回`false`。

#### HTMLMediaElement API
`HTMLMediaElement` API 是一个强大的工具，用于控件页面上音频和视频元素的行为。它扩展了基础的`HTMLElement`接口，因此你可以访问基础属性以及这些有用的方法。

`addTextTrack()`方法。此方法允许为媒体元素指定一个文本轨道，这对于为视频添加字幕尤其有帮助。或者`fastSeek()`方法，它允许将播放位置移动到媒体中的特定时间。

当媒体播放结束时，会触发`ended`事件。当由于数据缓冲区而自动暂停播放时，会触发`waiting`事件。当媒体可以部分播放或完全播放时，会触发`canplay`和`canplaythrough`事件。

#### 使用媒体流从局部设备捕捉视频和音频
有时可能想捕捉音频或视频，而不是播放音频和视频。Media Capture and Streams API，或称 MediaStream API，允许这样做。为了使用该 API，需要创建`MediaStream`对象。可以使用构造函数来完成，但它不会绑定到用户的硬件。相反，全局的`navigator`对象的`mediaDevices`属性有一个供使用的`getUserMedia()`方法。此方法接受一个单一的`constraints`对象，该对象定义了你想接收的媒体类型。该对象具有`audio`和`video`属性，分别对应音频和视频流。如果你不想接收该类型的流，这些属性可以是`false`，如果想接收，则为 `true`，或者是定义了额外约束的对象。

例如可以要求特定分辨率的视频输出：
```js
window.navigator.mediaDevices.getUserMedia({
  audio: true,
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 3840
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 2160
    }
  }
});
```
此约束对象指定视频流的最小和最大分辨率。`ideal`属性指定最希望拥有的分辨率——流将提供最接近理想分辨率的分辨率。

一旦创建了`MediaStream`（假设用户批准了自动`request`访问他们的`hardware`），就可以根据需要使用该`stream`数据。请注意，`getUserMedia()`返回一个 Promise，这意味着你要么需要一个回调函数来使用该流，要么使用异步的 async/await 语法。这是一个基本示例，将用户的摄像头视频流渲染到页面上。该 API 不提供对`screen capture`的访问。
```js
const video = document.querySelector("video");
const stream =
  await window.navigator.mediaDevices.getUserMedia({ video: true });
video.srcObject = stream;
await video.play();
```

#### 其他音视频API
屏幕捕捉 API允许你记录用户的屏幕。通过调用`mediaDevices`对象的`getDisplayMedia()`方法并使用返回的媒体流即可访问此 API。

MediaStream Recording API 与 MediaStreams API 协同工作，允许录制 MediaStream（甚至直接录制`HTMLMediaElement`）。然后它会触发带有 Blob 负载的`dataavailable`事件，你可以将其写入局部的文件存储。

所有这些技术的基础是 Media Source Extensions API。Media Source Extensions API 允许你通过`srcObject`属性将用户的摄像头视频直接传递给视频元素。

驱动网页上所有可听内容的 Web Audio API。该 API 包含重要的对象，如`AudioBuffer`（专门表现包含音频数据的缓冲区）或`AudioContext`。

## 映射与集合
### 了解映射与集合
#### Set与WeakSet
`Set`是一个用于管理数据集合的内置对象。它允许你保存任何类型的唯一值，无论是原语还是对象引用。`Set`确保其中的每个值只出现一次，使其在从数组中消除副本或处理不同值的集合时非常有用。

`WeakSet`是一种具有较少特色的特殊`Set`类型，允许你保存弱引用的对象和符号。与`Set`不同，`WeakSet`不支持数字或字串等原语。与普通的`Set`不同，`WeakSet`只保存对象，并且对这些对象的引用是“弱引用”，这意味着如果没有其他引用指向这些对象，`WeakSet`不会阻止它们被垃圾回收。简单来说，如果对象在代码中没有被其他地方使用，它会被自动移除以释放内存。

可以用来操作`Set`的其他方法有：
- `delete()`
- `clear()`
- `has()`
- `entries()`
- `forEach()`
- `keys()`
- `values()`
```js
const treeSet = new Set();

// Add items to the treeSet
treeSet.add('Baobab');
treeSet.add('Jackalberry');
treeSet.add('Mopane Tree');
treeSet.add('Breadfruit');

treeSet.delete('Breadfruit');

console.log(treeSet.size); // 3
console.log(treeSet); // Set(3) {'Baobab', 'Jackalberry', 'Mopane Tree'}
console.log(treeSet.has('Breadfruit')); // false
console.log(treeSet.entries()); // SetIterator {'Baobab' => 'Baobab', 'Jackalberry' => 'Jackalberry', 'Mopane Tree' => 'Mopane Tree'}
console.log('Keys: ', treeSet.keys()); // Keys: SetIterator {'Baobab', 'Jackalberry', 'Mopane Tree'}
console.log('Values: ', treeSet.values()); // Values: SetIterator {'Baobab', 'Jackalberry', 'Mopane Tree'}
treeSet.forEach((tree) => console.log(tree));
/*
Baobab
Jackalberry
Mopane Tree
*/
treeSet.clear();
console.log(treeSet); // Set(0) {size: 0}
```
`WeakSet`也有`add()`、`delete()`和`has()`方法，`Set`和`WeakSet`之间的关键区别在于`Set`可以保存任何值，而`WeakSet`只能保存对象。

#### Map与WeakMap
`Map`是一个内置对象，用于保存键值对，类似于对象。然而，它不同于标准的 JavaScript 对象，因为它允许任何类型的键，包括对象和函数。`WeakMap`是一个键值点对的集合，类似于`Map`，但它对键使用弱引用。键必须是对象，而值可以是任何类型。

可以用值初始化`Map`，如果没有用值初始化`Map`，你可以使用`set()`方法为它们添加值:
```js
const myTreesMap = new Map([
 [{ type: 'deciduous' }, 'Maple tree'],
 [['forest', 'grove'], 'Pine tree'],
 [42, 'Oak tree'],
 [true, 'Birch tree'],
 [function() { return 'I am a function key'; }, 'Willow tree'],
]);

const myTreesMap = new Map();
myTreesMap.set({ type: 'deciduous' }, 'Maple tree');
myTreesMap.set([1, 2], 'Pine tree');
myTreesMap.set(42, 'Oak tree');
myTreesMap.set(true, 'Birch tree');
myTreesMap.set(function() { return "I'm a function key"; }, 'Willow tree');

console.log(myTreesMap);
```
可以用来操作`Map`的其他方法有：
- 使用`get(key)`来检索与指定`key`关联的值。
- 使用`has(key)`来查看`Map`中是否存在某个`key`。
- `delete(key)`用于从`Map`中移除一个键值点对。
- `clear()`用于移除所有密钥-值点对。
- 使用`entries()`查看`Map`的条目（它返回一个`MapIterator`中的条目）。
- 使用`forEach()`循环遍历`Map`的条目。
- `size`表示`Map`中的键值点对数量。

`set()`、`get()`、`has()`和`delete()`方法也都可以用于`WeakMap`。

## localStorage和CRUD操作
### 客户端存储与CRUD操作
#### CRUD是什么
CRUD 是一个缩写，代表`Create`、`Read`、`Update`和`Delete`。这四个是持久存储的四种操作。持久存储是指以一种即使断电或设备重启后仍能使用的方式保存数据。
- 创建是指创建新数据的过程。例如，在一个网页应用中，这可能是当用户为博客添加新帖子时。
- 读取是从数据库中检索数据的操作。例如，当你访问博客文章或查看你的网站评测时，你正在执行读取操作以获取并显示存储在数据库中的数据。
- 更新涉及修改数据库中现有的数据。一个例子是编辑博客文章或更新你的评测信息。
- 删除是从数据库中移除数据的操作。例如，当你删除一篇博客文章或账户时，你正在执行删除操作。
CRUD 用于处理数据库、用户界面和 RESTful API。RESTful API 是一套用于创建网络服务的约定，允许客户通过标准的超文本传输协议方法执行 CRUD 操作，从而与数据库或后端系统交互。
 
HTTP 代表超文本传输协议，它是网络上数据通信的基础。存在 HTTP 方法，用于定义可以在网络资源上执行的操作。常见的方法有`GET`、`POST`、`PUT`、`PATCH`、`DELETE`。
- `POST`用于创建一个新资源。
- `GET`用于检索或读取数据。
- `PUT`用于通过完全替换来更新资源。
- `PATCH`用于部分更新资源。
- `DELETE`用于删除资源。

#### localStorage
Web Storage API 为浏览器提供了一种机制，可以在浏览器内直接保存键值点对，允许开发者保存可跨不同页面重载和会话使用的信息。Web Storage API 中的两个主要组件是`localStorage`和`sessionStorage`。

`localStorage`是 Web Storage API 的一部分，允许数据即使在浏览器窗口关闭或页面刷新后仍然保持持久。该数据将一直可用，直到被应用或用户显式移除。`localStorage`的常见使用分支包括存储用户设置，如主题或语言偏好，跨浏览器会话记住表单数据，以及缓存小块信息以提升网页应用的性能。缓存是指将频繁访问的数据存储在称为缓存的临时存储位置中，以便后续对该数据的请求可以更快地响应，而无需重新计算或从较慢的数据源（例如数据库或外部服务器）获取。一些常见的 localStorage 方法包括 setItem、getItem、removeItem 和 clear 方法。

使用`setItem()`方法将密钥-值点对保存到`localStorage`。如果想从`localStorage`中检索给定密钥的值，可以使用`getItem()`方法。要使用其密钥从`localStorage`中删除一项，可以使用`removeItem()`方法。要清除`localStorage`中的所有数据可以使用`clear()`方法。
```js
// Store the user's theme preference
localStorage.setItem('theme', 'dark');

// Retrieve the stored theme preference
const userTheme = localStorage.getItem('theme');
console.log(userTheme); // 'dark'

// Remove the theme preference
localStorage.removeItem('theme');

// Clear all localStorage data
localStorage.clear();
```

`sessionStorage`是 Web Storage API 的另一部分，用于在页面会话期间保存数据，这意味着只要浏览器标签（页）或窗口打开，数据就可用。然而，与`localStorage`不同，`sessionStorage`中的数据在标签（页）或窗口关闭时会被清除。

#### sessionStorage
`sessionStorage`是指当用户关闭运行该网页应用的标签（页）或窗口时，数据即被清除。它非常适合数据只需在单个会话期间保持的情况，例如在导航过程中维护表单数据或在结账过程中存储临时状态信息。与`localStorage`类似，`sessionStorage`使用点对来保存和检索数据。`sessionStorage`使用的方法也与`localStorage`相同，唯一真正的区别在于数据保存的时长。
```js
// Store data in sessionStorage
sessionStorage.setItem('currentUser', 'JohnDoe');

// Retrieve the stored data
const user = sessionStorage.getItem('currentUser');
console.log(user); // 'JohnDoe'

// Remove a specific key from sessionStorage
sessionStorage.removeItem('currentUser');

// Clear all sessionStorage data
sessionStorage.clear();
```
`sessionStorage`在以下场景中特别有用：
- 在多页表单进程中存储临时数据，例如表单条目。
- 存储不需要跨`Session`持久化的临时选择或偏好。
- 在不需要在标签（页）关闭后记住状态的单页应用中维护状态。
`sessionStorage`确保一旦用户离开页面，会话数据就会被清除，这对于你不想在当前会话之外保留信息的场景非常有用。

#### Cookies
Cookies，也称为网页Cookies或浏览器Cookies，是服务器发送到用户网页浏览器的小块数据。这些Cookies存储在用户设备上，并随后续的`request`一起发送回服务器。Cookie对于帮助网页应用维护状态和记住用户信息至关重要，这一点尤其重要，因为超文本传输协议是无状态协议。Cookies可以保存各种信息，例如用户偏好、会话数据或跟踪信息。Cookie总是以名称-值点对的形式保存。这意味着每个cookie都有一个名称（密钥）和一个关联的值。

当用户访问网站时，服务器可以通过在 HTTP 响应中包含`Set-Cookie`头部向用户的浏览器发送一个或多个 cookie。头部是一个提供有关 HTTP 请求或响应的附加信息的键值点对。一旦设置了 cookie，浏览器会保存它们，并在每次对同一域的后续请求中自动将它们包含在 Cookie 头部中。这允许服务器访问保存的 cookie，并将其用于维护用户会话或跟踪偏好等用途。以下是如何在超文本传输协议响应中设置 cookie 的示例：
```json
Set-Cookie: sessionId=abc123; Expires=Wed, 21 Oct 2021 07:28:00 GMT; Secure; HttpOnly
```
浏览器会保存 cookie，并且在以后对同一服务器的请求中，会在 Cookie 头部中包含该 cookie：
```json
Cookie: sessionId=abc123
```
服务器随后可以读取 cookie 并使用保存的会话 ID 来检索有关用户的信息，例如他们是否已登录。

以下是不同类型 cookie 的详细说明:
- 会话 Cookie 仅在用户在网站上的会话期间有效。一旦用户关闭浏览器或标签（页），会话 Cookie 就会被删除。这些 Cookie 通常用于在用户访问期间保持登录状态等任务。
- 持久性 Cookie 有一个过期日期，并且会一直保存在用户设备上，直到达到该日期。持久性 Cookie 通常用于跨会话记住用户偏好或登录信息。
- 安全 Cookie 仅通过 HTTPS 发送，确保它们在传输过程中不会被攻击者拦截。
- HttpOnly Cookie 无法被浏览器中运行的 JavaScript 访问或修改，使其在防范跨站脚本（XSS）攻击方面更为安全。跨站脚本（XSS）攻击发生在攻击者将恶意脚本注入到其他用户查看的网页时。这些脚本随后可以在受害者浏览器的上下文中执行，可能窃取 Cookie、会话数据，或在用户不知情或未同意的情况下执行其他恶意操作。通过将 Cookie 标记为 HttpOnly，可以防止其被 JavaScript 访问，从而降低此类攻击的风险。

可以通过使用`Set-Cookie`头部的服务器响应或通过 JavaScript 使用`document.cookie`来创建 cookies。下面是使用 JavaScript 设置 cookie 的示例，此命令设置一个名为`username`的 cookie，值为`"JohnDoe"`，将在 2021 年底过期。可以通过再次设置新值来更新现有的 cookie。：
```js
document.cookie = "username=JohnDoe; expires=Fri, 31 Dec 2021 23:59:59 GMT; path=/";
```
要删除 cookie，需要将其过期日期设置为过去时间,这将从浏览器中移除`username` cookie。：
```js
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
```

#### Cache API
`Cache` API 用于保存网络请求和响应，使网页应用运行更高效，甚至可以离线工作。它是更广泛的 Service Worker API 的一部分，对于创建能够在不可靠或缓慢网络条件下运行的渐进式网页应用（PWA）至关重要。

网络请求是由网页浏览器或应用向服务器发出的请求，用于通过互联网检索数据或资源。例如，当访问一个网站时，浏览器会向网络服务器发送网络请求，以获取显示页面所需的文件（例如`HTML`、图像或视频）。

`Service Worker`是一种特殊类型的 JavaScript `file`，在网页`application`的后台运行，独立于主浏览器`thread`。它充当网页和`network`之间的中间人，允许开发者拦截`network` request、缓存资源，并处理推送通知或后台同步等功能。

PWA，或渐进式网页应用，是一种使用现代网页技术在网页上提供类似本地应用体验的网页应用类型。PWA 设计为能够在任何设备上可靠运行，无论网络状况如何，都可以通过浏览器访问或像传统应用一样安装到用户设备上。

`Cache` API 是一种存储机制，用于保存`Request`和`Response`对象。当向服务器发出请求时，应用可以储存响应，之后从缓存中检索它，而不是发起新的网络请求。这减少了装载时间，节省了带宽，并提升了整体用户体验。

浏览器提供了一个称为`CacheStorage`的存储区域，开发者可以在其中储存网络请求及其对应响应的键值对。通过`Cache-Control`头部，开发者可以指定缓存资源应保存多长时间，以及是否应重新验证或直接从缓存中提供。通过使用`Cache` API，开发者可以构建离线优先的网页应用，例如允许 PWA 在用户断开网络连接时提供缓存的资源。

#### 与客户端存储关联的负面模式
网站使用 cookie 来跟踪用户与 web 应用的交互，创建他们数字活动的历史记录。这是为了目标广告，但可能引起重大隐私问题。cookie 会随每个对网站的请求一起发送，从而允许网站跟踪用户的行为。虽然这看起来无害，但想象一下数百个网站共享这些信息——这可能会形成用户在线生活和选择的非常详细的画像。

另一个令人担忧的做法是浏览器指纹识别。该技术使用客户端信息来创建用户浏览器的唯一“指纹”。网站能够收集有关用户浏览器版本、已安装插件、屏幕分辨率及其他数据的信息，以唯一识别用户。

#### 使用Cookie来保存由HTTP头部控件的任意数据
实际上可以在 cookie 中保存更复杂的数据结构。一种常见的方法是使用 JSON 来保存对象或数组。下面是一个示例：
```js
const userData = {
  name: "John Doe",
  age: 30,
  role: "admin"
};

document.cookie = "userInfo=" + JSON.stringify(userData) + "; path=/";
```
在此示例中，我们创建了一个包含用户数据的对象，将其转换为 JSON 字串，然后将其存储在 cookie 中。当我们想要检索这些数据时，可以使用`JSON.parse()`将 JSON 字串解析为对象。

通常，cookie 是由服务器通过`HTTP headers`设置的。例如，服务器可能会发送这样的头部，这个头部告诉浏览器设置一个 cookie。：
```js
Set-Cookie: username=John Doe; expires=Thu, 31 Dec 2024 6:00:00 IST; path=/
```

可以使用 JavaScript 直接在浏览器中设置 cookie。这对于存储不需要立即发送到服务器的数据非常有用。cookie 的大小限制约为 4KB，在其中存储过多数据可能会降低网页应用的速度。在 cookie 中存储大量数据会增加网络流量，因为 cookie 会随每个超文本传输协议请求一起发送。

#### IndexDB
`IndexedDB`是一个在浏览器中保存结构化数据的工具。它内置于现代网页浏览器中，允许网页应用高效地保存和获取 JavaScript 对象。与其他存储机制如`localStorage`（仅限于存储字串）不同，`IndexedDB`可以存储 JavaScript 对象、文件以及几乎任何其他类型的数据。这使得需要处理大型且复杂数据结构的网页应用变得更加容易。
```js
let request = indexedDB.open("Sample DB", 1);

request.onerror = function(event) {
  console.log("Error opening database");
};

request.onsuccess = function(event) {
  let db = event.target.result;
  console.log("Database opened successfully");
};
```
在这段代码中，正在打开一个名为`"Sample DB"`、版本为 1 的数据库。我们提供了两个回调函数：一个用于处理误差，另一个用于数据库成功打开时。在成功回调中获得的`db`对象就是我们用来与数据库交互的对象。

IndexedDB 中的对象存储类似于传统数据库中的表格。它们保存想要存储的实际数据。这段代码创建了一个名为`"customers"`的对象存储，其`"id"`作为其密钥路径。密钥路径类似于传统数据库中的主键——用于唯一标识每条记录。：
```js
let request = indexedDB.open("Sample DB", 1);

request.onupgradeneeded = function(event) {
  let db = event.target.result;
  let objectStore = db.createObjectStore("customers", { keyPath: "id" });
};
```
要为对象保存添加数据，为`"customers"`对象存储添加了一个新客户。启动一个事务（这是分组数据库操作的方式），获取对对象存储的引用，然后添加数据。
```js
let transaction = db.transaction(["customers"], "readwrite");
let objectStore = transaction.objectStore("customers");
let request = objectStore.add({ id: 1, name: "John Doe", email: "john@example.com" });

request.onerror = function(event) {
  console.log("Error adding data");
};

request.onsuccess = function(event) {
  console.log("Data added successfully");
};
```
检索数据的方式类似。启动一个事务，获取对象保存，然后使用诸如`get`之类的方法来检索数据：
```js
let transaction = db.transaction(["customers"]);
let objectStore = transaction.objectStore("customers");
let request = objectStore.get(1);

request.onerror = function(event) {
  console.log("Error retrieving data");
};

request.onsuccess = function(event) {
  console.log("Customer:", request.result);
};
```
`IndexedDB`的一个关键特色是它是异步的。这意味着当与`IndexedDB`交互时，操作不会阻塞网页应用的主线程。这确保了即使处理大量数据，网页应用仍保持响应。

#### 缓存和Service Workers
缓存是将文件副本存储在临时存储位置的过程，以便可以更快地访问。当访问一个网站时，浏览器可以将某些文件（例如图像、CSS 和 JavaScript）储存在本地。这意味着下次访问同一网站时，它可以从设备装载这些文件，而不是再次从服务器获取，从而使网站加载更快。

Service Workers是一个在后台运行的`Script`，与网页分离。它可以拦截`network`请求、访问`cache`，并启用网页应用离线工作。它是渐进式网页应用的关键`component`。

PWA 是可以提供类似应用体验的网页应用。它们可以离线工作、发送推送通知，甚至可以安装到移动设备或计算机的主屏幕上。当用户首次访问 PWA 时，service worker 可以缓存重要的文件。用户可以继续离线使用该应用，当他们重新在线时，任何即将发生的更改都可以与服务器同步。

## 类
### 了解类
#### 什么是类
class 就像蓝图，可以在 code 中定义它来创建多个相同类型的 object。例如，如果正在为库存系统建模，需要为每种产品类型创建多个对象。每个单独的产品都会有它自己的属性和动作，但同一类的产品可以从相同的 blueprint 创建。这就是 class 的用途。类可以定义为类表达式或类声明。下面是一个类表达式的样子：
```js
const Dog = class {
  constructor(name) {
    this.name = name;
  }

  bark() {
    console.log(`${this.name} says woof!`);
  }
};
```

#### This关键字
`class`像蓝图，可以用来创建`object`。这些蓝图需要一种通用的方式来引用在代码中被创建、访问或修改的特定对象。这正是`this`关键字的用途。它引用代码应运行的上下文。如果你在方法中使用它，`this`的值将是对关联该方法的对象的引用。通过这种方式，你可以访问类中对象的属性和方法，并在不同对象上重用该方法。
```js
class Dessert {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  showPrice() {
    console.log(`The price of ${this.name} is $${this.price}.`);
  }
}

const brownie = new Dessert("Brownie", 5.99);
brownie.showPrice();
console.log(brownie);
```
当前对象（`brownie`）的名称和价格被替换到字串中。这都要归功于 this 关键字，它提供了一种通用的方式来在类中引用当前对象。这能够在不同对象上重用该方法。

这是在对象方法的上下文中，但`this`密钥在独立函数和箭头函数中也会有值。它在独立函数中的值通常参考全局对象（在非严格模式下）或`undefined`（在严格模式下）。

`this`关键字的值在箭头函数中有些不同。箭头函数继承定义它们的外层作用域中的`this`值。它们不会创建自己的`this`绑定。这意味着`this`的值取决于箭头函数定义的上下文，而不是箭头函数被调用的位置或方式。这使得箭头函数对于回调或保持上下文非常有用。但是，因为这个原因，`this`的值在对象方法中不会指向当前对象。同样适用于在其他函数内定义的箭头函数。它们将从其父作用域继承 this 的值。

#### 类继承
父类是作为其他类蓝图的类。它定义了被其他类继承的属性和方法。子类是继承另一个类的属性和方法的类。子类还可以通过添加新属性和方法来扩展其父类的功能性。一个父类可以有多个子类。使用`extends`关键字来实现继承。该关键字表示一个类是另一个类的子类。
```js
class Vehicle {
  constructor(brand, year) {
    this.brand = brand;
    this.year = year;
  }
}

class Car extends Vehicle {
  honk() {
    console.log("Honk! Honk!");
  }
}

let myCar = new Car("freeCodeCamp Motors", 2019);
console.log(myCar.brand); // "freeCodeCamp Motors"
console.log(myCar.year);  // 2019
myCar.honk(); // "Honk! Honk!"
```
如果确实需要添加额外的属性，需要定义一个构造函数。
```js
class Vehicle {
  constructor(brand, year) {
    this.brand = brand;
    this.year = year;
  }
}

class Car extends Vehicle {
  constructor(brand, year, numDoors) {
    super(brand, year);
    this.numDoors = numDoors;
  }
}
```
在构造函数内，有一个对`super()`的调用，`super()`调用基类的构造函数，所以通过使用`super()`，实际上是在子类中定义基类的属性。这是可以使用的另一种术语——基类是父类，子类是子类。

继承的主要优点是代码重用、模块性、可扩展性和改进的代码结构。通过实现层次结构，可以在子类中重用已经为父类编写的代码，避免重复。继承还通过将层次结构中的复杂系统分解为更简单的组件来促进模块性。此外，能够扩展父类的功能性使得更容易适应不断变化的需求，并在开发进程后期添加新建特色。最后，层级结构可以使代码更易于理解和维护。

#### 类中的静态属性和方法
静态属性和方法属于类本身，而不属于类的各个实例。可以直接通过类名访问它们，而无需创建类的实例。它们在类中定义，以封装相关的功能性。
```js
class MyClass {
  static staticMethod() { ... }
}
```
通过在方法名称前写`static`关键字来定义静态方法。可以直接在类上使用点符号调用静态方法，并传递任何必要的参数。可以在不创建该类的实例的情况下调用该方法。这是静态方法的一个关键特征：
```js
MyClass.staticMethod();
```

静态方法对于实现“工厂”方法也很有帮助。工厂方法是在构造函数之外定义的一个方法，用于根据特定条件创建对象。这是一个带有`Pizza`类的示例。静态方法`createMargherita`是一个工厂方法，可以调用它来创建一个类型和价格已设置好的 Margherita 披萨实例。
```js
class Pizza {
  constructor(type, price) {
    this.type = type;
    this.price = price;
  }

  static createMargherita() {
    return new this("Margherita", 6.99);
  }
}
```
这也引出了关于静态方法的一个非常重要的问题。静态方法中`this`关键字的值是类本身，因为静态方法属于该类。这就是为什么我们可以使用`this`来创建`Pizza`类的新实例。

除了方法，还可以使用`static`关键字定义静态属性。要访问静态属性的值，只需对类本身使用点表示法，因为该属性属于类。
```js
class Pizza {
  static numberOfPizzasSold = 0;

  constructor(type) {
    this.type = type;
    Pizza.numberOfPizzasSold++;
  }
}

let pizza1 = new Pizza("Margherita");
let pizza2 = new Pizza("Neapolitan");

console.log(Pizza.numberOfPizzasSold);
```

## 递归
### 了解递归