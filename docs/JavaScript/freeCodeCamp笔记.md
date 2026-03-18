---
title: freeCodeCamp笔记
description: freeCodeCamp网站JavaScript认证学习笔记。
sidebar_position: 2
tags: [JavaScript,Web]
date: 2026-03-06
---

# freeCodeCamp笔记
记录在freeCodeCamp笔记网站学习JavaScript中个人需注意的知识点，方便翻看学习，并非网站全部内容。

## 变量与字符串
### JavaScript入门讲座
#### 数据类型
##### Symbol
`Symbol`是 JavaScript 中一种特殊类型的值，始终唯一且不可更改。 它通常用于为属性创建独特的标签或标识符：
```js
Symbol('description');
```
```js
const crypticKey1= Symbol("saltNpepper");
const crypticKey2= Symbol("saltNpepper");
console.log(crypticKey1 === crypticKey2); // 输出结果为 false
```

##### BigInt
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
##### ASCII
虽然 JavaScript 字串在内部使用 Unicode（UTF-16），但 ASCII 值匹配前 128 个 Unicode 字符，这就是基于 ASCII 的示例在 JavaScript 中有效的原因。

ASCII 标准包含 128 个字符，包括：
- 大写和小写英文字母（A-Z、a-z）。
- 数字（0-9）。
- 常见标点符号和特殊字符（!、@、# 等）。
- 控制字符（如换行符和制表符）。

##### charCodeAt()
可以使用`charCodeAt()`方法访问字符的数字代码。该方法返回指定索引处字符的 UTF-16 代码单元。对于前 128 个字符，该值与 ASCII 代码匹配。
```js
let letter = "A";
console.log(letter.charCodeAt(0));  // 65

let symbol = "!";
console.log(symbol.charCodeAt(0));  // 33
```

###### fromCharCode()
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
`slice()`方法允许你提取字符串的一部分，并返回一个新的字符串，而不修改原始字符串。 它需要两个参数：开始索引和选填的结束索引。
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
`replace()`方法允许你在字串中查找指定的值（例如单词或字符）并将其替换为另一个值。该方法返回一个带有替换的新字串，并且保持原字串不变，因为 JavaScript 字串是不可变的。
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
`repeat()`方法是`JavaScript`中的一个内置函数，可让你重复指定次数的字符串。 这是基本语法：
```js
string.repeat(count);
```
`string`是要重复的字符串，`count`是你希望字符串重复的次数。`count`参数必须是非负数。如果传递的是负数，JavaScript将抛出`RangeError`错误。`count`必须是一个有限的数字。 如果你尝试无限次重复一个字符串，或使用`Infinity`作为计数，也将得到`RangeError`。在 JavaScript 中，`Infinity`是一个表示无限量的特殊值。 它用来表示比任何有限数都大的数。如果计数不是整数（例如小数，如`2.5`），`repeat()`方法将四舍五入为最接近的整数。如果你传递`0`作为计数，`repeat()`方法将返回空字符串。
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
数组的浅拷贝是一个新数组，具有与原数组相同的项。如果数组只包含像数字或字串这样的原语值，则新数组是完全独立的。但如果数组内部包含其他数组，原数组和拷贝都会引用相同的内部数组。这意味着如果你更改共享内部数组中的某些内容，你将在两个数组中看到该更改。

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
`Object.hasOwn()`是检查对象是否拥有自身（非继承）属性的现代推荐方法。可以将其视为 `hasOwnProperty()`的升级版，更加安全。语法是`Object.hasOwn(object, propertyName)`——你将对象作为第一个参数，属性名作为第二个参数传入。
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
`Object()`构造函数的另一个使用场景是当你处理一个未知类型的值并且需要确保它是一个对象时。
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
#### JSON.parse() 和 JSON.stringify() 
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
`JSON.stringify()`方法的另一个可选参数是`spacer`参数。它允许你控制字符串化结果的间距：
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
`JSON.parse()`将 JSON 字串转换回 JavaScript 对象。当你从网络服务器或`localStorage`获取 JSON 数据并且需要在你的应用中操作这些数据时，这非常有用。
```js
const jsonString = '{"name":"John","age":30,"isAdmin":true}';
const userObject = JSON.parse(jsonString);
console.log(userObject);

// Result:
// { name: 'John', age: 30, isAdmin: true }
```