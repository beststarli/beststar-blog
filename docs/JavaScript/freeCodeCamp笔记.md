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

