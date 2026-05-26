---
title: JavaScript八股
description: JavaScript八股
sidebar_position: 5
date: 2026-05-18
---

# JavaScript八股
## JavaScript路线图
![路线图](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/js.png)

## 数据类型
### JavaScript数据类型
一共有八种，分别是`Undefined`、`Null`、`Boolean`、`Number`、`String`、`Object`、`Symbol`、`BigInt`。

这些数据可以分为两类：
- 原始数据类型：`Undefined`、`Null`、`Boolean`、`Number`、`String`，直接存储在栈中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储。
- 引用数据类型：对象、数组、函数，存储在堆中，占据的空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

数据结构与操作系统内存中，栈与堆的区别：
- 栈中数据的存取为先进后出，栈区内存由编译器自动分配释放，存放函数的参数值、局部变量的值等，栈区内存较小。
- 堆是一个优先队列，按优先级来进行排序，优先级可以按照大小来规定。堆区内存一般由程序员分配释放，如果不释放可能由垃圾回收机制回收，堆区内存较大。

### 数据类型检测方式
#### `typeof`
可以检测出基本数据类型，数组、对象、null都会被判断为object。
```js
console.log(typeof [])   // object
console.log(typeof {})   // object
console.log(typeof null) // object
console.log(typeof undefined) // undefined
console.log(typeof 123)  // number
console.log(typeof 'abc')  // string
```

#### `instanceof`
可以正确判断出对象的引用类型，但不能判断基本类型，内部运行机制就是判断在其原型链中能否找到该类型的原型对象。语法：
```js
// object instanceof constructor
console.log([] instanceof Array) // true    
```

#### `constructor`
如果创建一个对象来改变它的原型，那么这个对象的constructor属性就不再指向它的构造函数了。
```js
function func(){}
func.prototype = new Array()
var newFunc = new func()
console.log(newFunc.constructor === func)   // false
console.log(newFunc.constructor === Array)   // true
```

#### `Object.prototype.toString.call()`
使用Object对象的原型方法toString来判断数据类型：
```js
var a = Object.prototype.toString

console.log(a.call([]))   // [object Array]
console.log(a.call({}))   // [object Object]
console.log(a.call(null)) // [object Null]
console.log(a.call(undefined)) // [object Undefined]
console.log(a.call(123))  // [object Number]
console.log(a.call('abc'))  // [object String]
```
同样是检测对象obj调用toString方法，为什么obj.toString()和Object.prototype.toString.call(obj)的结果不一样：

这是因为toString是Object的原型方法，而Array、function等类型作为Object的实例都重写了toString方法。不同的对象类型调用toString方法时，根据原型链，调用的是对应的重写之后的toString方法（function类型返回内容为函数体的字符串，Array类型返回元素组成的字符串等），而不调用Object上原型toString方法（返回对象的具体类型），所以采用obj.toString()不能得到其对象类型，只能将obj转换为字符串类型；因此，在想要得到对象的具体类型时，应该调用Object原型上的toString方法。

### 判断数组的方式
- `Object.prototype.toString.call()`：
```js
Object.prototype.toString.call(obj).slice(8, -1) === 'Array'
```
- 原型链判断：
```js
obj.__proto__ === Array.prototype
```
- ES6的Array.isArray()方法：
```js
Array.isArray(obj)
```
- `instanceof`：
```js
obj instanceof Array
```
- `Array.prototype.isPrototypeOf()`：
```js
Array.prototype.isPrototypeOf(obj)
```

### null和undefined的区别
二者都是基本数据类型，在声明了变量但没有定义时会返回`undefined`，`null`主要用于赋值给可能有返回对象的变量作为初始化。

`undefined`不是JavaScript的保留字，可以作为变量名使用，尽管这样的做法很危险。
```js
console.log(typeof null) // object
console.log(typeof undefined) // undefined
console.log(null == undefined) // true
console.log(null === undefined) // false
```

### typeof null为什么是object
在JavaScript第一个版本中，所有值都存储在32位的单元中，每个单元包含一个小的类型标签（1-3 bits）和当前要存储值的真实数据。类型标签存储在每个单元的低位中，共有五种数据类型：
```txt
000：object     - 当前存储的数据指向一个对象。
  1：int        - 当前存储的数据是一个31位的有符号整数。
010：double     - 当前存储的数据指向一个双精度的浮点数。
100：string     - 当前存储的数据指向一个字符串。
110：boolean    - 当前存储的数据是一个布尔值。
```
如果最低位是1，则类型标签标志位的长度只有一位；如果最低位是0，则类型标签标志位的长度占三位，为存储其他四种数据类型提供了额外两个bit的长度。

有两种特殊数据类型：
- `undefined`：值为(-2)<sup>30</sup>，一个超出整数范围的数字。
- `null`：值为机器码NULL指针（null指针的值全是0），也就是说null类型标签也是000，和object类型标签一样，所以typeof null的结果是object。

### instanceof的实现原理
instanceof运算符用于判断构造函数的prototype属性是否出现在对象的原型链中的任何位置：
```js
function myInstanceof(left, rigth) {
    // 获取对象的原型
    let proto = Object.getPrototypeOf(left);
    // 获取构造函数的prototype对象
    let prototype = rigth.prototype;

    // 判断构造函数的prototype对象是否在对象的原型链上
    while (true) {
        if (!proto) {
            return false
        }
        if (proto === prototype) {
            return true
        }
        // 如果没有找到，就继续从其原型上找，
        // Object.getPrototypeOf(proto)方法用来获取其原型
        proto = Object.getPrototypeOf(proto);
    }
}
```
详情见[instanceof()实现原理手撕](/docs/情景与手撕题/instanceof()实现原理手撕)。

### 0.1 + 0.2 !== 0.3
0.1的二进制是0.00011001100....，0.2的二进制是0.0011001100....，它们都是无限循环的二进制小数，一般我们认为数字包括整数和小数，但是在JavaScript中只有Number一种数字类型，它的实现遵循IEEE 754标准，使用64位固定长度表示，也就是double双精度浮点数。在二进制科学表示法中，双精度浮点数的小数部分最多只能保留52位，再加上前面的1，其实就保留53位有效数字，剩余要舍去，遵从“0舍1入”的原则。

根据这个原则，0.1和0.2的二进制相加再转换为十进制就是`0.30000000000000004`，所以0.1 + 0.2 !== 0.3。

![双精度](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/doubleNum.png)
双精度是的分为三个部分：
- 蓝色部分：用来存储符号为（sign），用于区分正负数，0为正数，占用1位。
- 绿色部分：用来存储指数（exponent），用来表示小数点的位置，占用11位。
- 红色部分：用来存储尾数（fraction），也叫有效数字（significand），用来表示数字的精度，占用52位。

指数位为负数，如何保存？IEEE 754标准规定，对于指数部分每次都加上一个偏移量保存，这样即使指数是负数，那么加上这个偏移量也就是正数了。由于JavaScript的数字是双精度数，以双精度为例它的指数部分为11位，能表示的范围就是0～2047，IEEE固定双精度的偏移量为1023。
- 当指数不全为0也不全为1时（规格化的数值），IEEE规定阶码计算公式为e - bias，此时e最小值为1，则1-1023=-1022，e最大值为2046，则2046-1023=1023，这种情况下取值范围是-1022～1023。
- 当指数位全部是0的时候（非规格化的数值），IEEE规定阶码计算公式为1 - bias，此时阶码为1-1023=-1022。
- 当指数位全部是1的时候（特殊值），IEEE规定这个浮点数可用来表示3个特殊值，分别是正无穷，负无穷，NaN。具体的是，小数位不为0时表示NaN；小数位为0时，符号位为0表示正无穷，符号位为1表示负无穷。

如何实现0.1 + 0.2 === 0.3呢？直接的解决方法就是设置一个误差范围，通常称为“精度机器”。对JavaScript来说，这个值通常为2<sub>-52</sub>，在ES6中提供了Number.EPSILON属性，只要判断0.1 + 0.2 - 0.3是否小于Number.EPSILON，如果小于就可以认为它们相等了。
```js
function numberEpsilon(arg1, arg2) {
    return Math.abs(arg1 - arg2) < Number.EPSILON
}

console.log(numberEpsilon(0.1 + 0.2, 0.3)) // true
```

### 获取安全的undefined值
上面提到undefined不是JavaScript的保留字，这样会影响undefined的正常判断。表达式void _没有返回值，因此返回的结果是undefined。void并不改变表达式的结果，只是让表达式不返回值。因此可以用`void 0`来获取安全的undefined值。

### isNaN()和Number.isNaN()的区别
- `isNaN()`：会先将参数转换为数字类型，任何不能被转换为数值的值都会返回true，因此非数字类型的值也可能被判断为NaN。
- `Number.isNaN()`：会首先判断传入参数是否为数字，如果是数字再继续判断是否为NaN，不会进行数据类型的转换，因此只有真正的NaN才会返回true。

### Object.is()和===的区别
- `Object.is()`：在比较两个值时，NaN被认为是相等的，+0和-0被认为是不相等的。
- `===`：在比较两个值时，NaN被认为是不相等的，+0和-0被认为是相等的。

### 包装类型
在JavaScript中，基本类型没有属性和方法，但为了便于操作基本类型的值，在调用基本类型的属性或方法时JavaScript会在后台隐式将基本类型的值转换为对象，比如：
```js
const a = 'abc'
a.length // 3
a.toUpperCase() // 'ABC'
```
也可以使用Object函数显式将基本类型转换为包装类型：
```js
var a = 'abc'
Object(a) // String {"abc"}
```
也可以使用valueOf()方法将包装类型转换为基本类型：
```js
var a = 'abc'
var b = Object(a)
var c = b.valueOf()
console.log(a === c) // true
```

### 隐式类型转换
ToPrimitive方法是JavaScript中每个值隐含的自带的方法，用来将值转换为基本类型（无论是基本类型还是对象类型）。如果为基本类型则直接返回值本身；如果是对象，看起来是：
```js
/**
 * @obj 需要转换的对象
 * @type 期望的结果类型
 */
ToPrimitive(obj, type)
```
type的值为number或string，如果对象为Date对象，则type默认为string；其他情况下，type默认为number：
- number：
    - 调用obj的valueOf方法，如果为原始值则返回，否则继续下一步。
    - 调用obj的toString方法，如果为原始值则返回，否则抛出TypeError异常。
- string：
    - 调用obj的toString方法，如果为原始值则返回，否则继续下一步。
    - 调用obj的valueOf方法，如果为原始值则返回，否则抛出TypeError异常。

对于Date以外的对象，转换为基本类型的大概规则可以概括为一个函数：
```js
var objToNumber = value => Number(value.valueOf().toString())
objToNumber([]) === 0
objToNumber({}) === NaN
```
JavaScript中的隐式类型转换主要发生在`+、-、*、/、==、!=`等运算符之间，这些运算符只能操作基本类型数值，所以在进行这些运算的前一步就是将两边的值用ToPrimitive转换为基本类型，在进行操作。

基本类型的值在不同操作符下隐式转换规则：
1. `+`：如果其中一个操作数是字符串，则将另一个操作数转换为字符串进行连接；否则将两个操作数都转换为数字进行加法运算。
2. `-、*、/`：将两个操作数都转换为数字进行运算。NaN也是数字类型，所以如果其中一个操作数无法转换为数字，则结果为NaN。
3. `==`：操作符两边的值都尽量转成number
4. `<`和`>`：如果两边都是字符串，则进行字典序比较；否则将两边都转换为数字进行比较。
5. 对象会被ToPrimitive转换为基本类型再转换：
```js
var a = {}
console.log(a > 2) // false
// 等价于：
a.valueOf()     // ToPrimitive默认type为number，所以先调用valueOf方法，结果仍是对象
a.toString()    // "[object Object]"，转换为字符串
Number(a.toString()) // NaN，无法转换为数字，所以结果为NaN
console.log(NaN > 2) // false
```
```js
var a = {name: 'Jack'}
var b = {age: 18}
console.log(a + b) // "[object Object][object Object]"
// 等价于：
a.valueOf()     // ToPrimitive默认type为number，所以先调用valueOf方法，结果仍是对象
a.toString()    // "{name: 'Jack'}"，转换为字符串
b.valueOf()     // ToPrimitive默认type为number，所以先调用valueOf方法，结果仍是对象
b.toString()    // "{age: 18}"，转换为字符串
console.log(a + b) // "{name: 'Jack'}{age: 18}"
```

### `+`字符串拼接
如果某个操作数是字符串，另一个操作数不是字符串，则会将另一个操作数转换为字符串进行拼接；如果两个操作数都是字符串，则直接进行拼接；如果两个操作数都不是字符串，则将它们都转换为数字进行加法运算。

### Object.assign()与展开运算符
二者都是浅拷贝

- 展开运算符`...`：使用时，数组或对象的每个值都会被拷贝到一个新的数组或对象中，它不复制继承的属性或类的属性，但是会复制ES6的Symbols属性。
```js
let outObj = {
    inObj: {
        a: 1,
        b: 2
    }
}
let newObj = {...outObj}
newObj.inObj.a = 2
console.log(outObj) // {inObj: {a: 2, b: 2}}   
```
- Object.assign()：接收的第一个参数作为目标对象，后面的所有参数作为源对象，然后把所有的源对象合并到目标对象中，它会修改一个对象，因此会触发ES6 setter。
```js
let outObj = {
    inObj: {
        a: 1,
        b: 2
    }
}
let newObj = Object.assign({}, outObj)
newObj.inObj.a = 2
console.log(outObj) // {inObj: {a: 1, b: 2}}   
```

### 如何判断一个对象为空对象
- 使用JSON自带的.stringify方法：
```js
if (JSON.stringify(obj) === '{}') {
    console.log('obj是一个空对象')
}
```
- 使用ES6新增的Object.keys()方法：
```js
if (Object.keys(obj).length === 0) {
    console.log('obj是一个空对象')
}
```

## ES6
### let、const、var的区别

| 区别 | var | let | const |
|------|-----|-----|-------|
| 是否有块级作用域 | × | ✓ | ✓ |
| 是否存在变量提升 | ✓ | × | × |
| 是否添加全局属性 | ✓ | × | × |
| 能否重复声明变量 | ✓ | × | × |
| 是否存在暂时性死区 | × | ✓ | ✓ |
| 是否必须设置初始值 | × | × | ✓ |
| 能否改变指针指向 | ✓ | ✓ | × |

### new一个箭头函数
箭头函数是ES6新增的函数表达式，它没有prototype，也没有自己的this指向，更不可以使用arguments参数，所以不能new一个箭头函数。

new操作符的实现步骤：
1. 创建一个新对象。
2. 将构造函数的作用域赋给新对象，也就是将对象的__proto__属性指向构造函数的prototype属性。
3. 指向构造函数中的代码，构造函数中的this指向该对象，也就是为这个对象添加属性和方法
4. 返回新的对象。

以上2、3步，箭头函数无法执行，所以不能new一个箭头函数。

### 箭头函数与普通函数的区别
- 箭头函数更简洁。
- 箭头函数没有自己的this：它只会在自己的作用域的上一层继承this，所以箭头函数中this的指向在定义时就已经确定了。
- 箭头函数的this指向无法改变：在下面的案例中，对象obj的func2是使用箭头函数定义的，这个函数中的this就永远指向它定义时所处的全局执行环境中的this，即便这个函数是作为对象obj的方法调用，this依旧指向window对象。需要注意，定义对象的大括号`{}`是无法形成单独的执行环境的，它依旧是处于全局执行环境中。
```js
var id = 'GLOBAL'
var obj = {
    id: 'OBJ',
    func1: function() {
        console.log(this.id) // OBJ
    },
    func2: () => {
        console.log(this.id) // GLOBAL
    }
}
obj.func1()     // 'OBJ'
obj.func2()     // 'GLOBAL'
new obj.func1() // undefined
new obj.func2() // Uncaught TypeError: obj.func2 is not a constructor
```
- `call()`、`apply()`、`bind()`等方法不能改变箭头函数中this的指向。
- 箭头函数不能作为构造函数使用
- 箭头函数没有自己的arguments对象：在箭头函数中访问arguments实际上获得的是它外层函数的arguments值。
- 箭头函数没有prototype。
- 箭头函数不能作为Generator函数使用，不能使用yeild关键字。

### 扩展运算符
#### 对象扩展运算符
对象的扩展运算符用于取出参数对象中的所有可遍历属性，拷贝到当前对象中。**扩展运算符对对象实例的拷贝属于浅拷贝**。
```js
let bar = {x: 1, y: 2}
let baz = {...bar}  // { x: 1, y: 2 }
// 等价于
let bar = {x: 1, y: 2}
let baz = Object.assign({}, bar)  // { x: 1, y: 2 }
```
`Object.assign(target, source)`方法用于对象的合并，将源对象`source`的所有可枚举熟悉，复制到目标对象`target`。`Object.assign()`方法的第一个参数是目标对象，第二个参数是源对象。如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。

如果用户自定义的属性放在扩展运算符后面，则扩展运算符内部的同名属性会被覆盖掉：
```js
let bar = {x: 1, y: 2}
let baz = {...bar, ...{x: 3, y: 4}}  // { x: 3, y: 4 }
```
利用上述特性可以方便的修改对象的部分属性，在Redux中的reducer函数规定必须是一个**纯函数**，reducer中的state对象要求不能直接修改，可以通过扩展运算符把修改路径的对象都复制一遍，然后产生一个新的对象来返回。

#### 数组扩展运算符
数组的扩展运算符可以讲一个数组转为用逗号分隔的参数序列，且每次只展开一层数组：
```js
console.log(...[1, 2, 3]) // 1 2 3
console.log(...[1, [2, 3, 4], 5]) // 1 [2, 3, 4] 5
```
数组的扩展运算符应用：
- 将数组转换为参数序列：
```js
function add(x, y) {
    return x + y
}

const number = [1, 2]
add(...number) // 3
```
- 复制数组：
```js
const arr1 = [1, 2, 3]
const arr2 = [...arr1]
console.log(arr2) // [1, 2, 3]
```
- 合并数组：
```js
const arr1 = ['two', 'three']
const arr2 = ['one', ...arr1, 'four', 'five']
console.log(arr2) // ['one', 'two', 'three', 'four', 'five']
```
- 扩展运算符与结构赋值结合：
```js
const [first, ...rest] = [1, 2, 3, 4, 5]
console.log(first) // 1
console.log(rest)  // [2, 3, 4, 5]
```
如果将扩展运算符用于解构赋值，只能放在参数的最后一位，否则会报错：
```js
const [...rest, last] = [1, 2, 3, 4, 5] // SyntaxError: Rest element must be last element
const [first, ...rest, last] = [1, 2, 3, 4, 5] // SyntaxError: Rest element must be last element
```
- 将字符串转为数组：
```js
console.log([...'hello']) // ['h', 'e', 'l', 'l', 'o']
```
- 任何Iterator接口的对象都可以用扩展运算符专为真正的数组：
    - 比较常见的是将某些数据结构转为数组，用于替换ES5的Array.prototype.slice.call(arguments)写法：
    ```js
    // arguments对象
    function foo() {
        const args = [...arguments]
    }
    ```
    - 使用Math函数获取数组中特定的值：
    ```js
    const numbers = [9, 4, 7, 1]
    Math.min(...numbers) // 1
    Math.max(...numbers) // 9
    ```

### Proxy的功能
在Vue 3中通过Proxy来替代原先的Object.defineProperty()来实现数据响应式。

Proxy用来自定义对象中的操作，target表示需要添加代理的对象，handler用来自定义对象中的操作：
```js
let p = new Proxy(target, handler)
```

通过Proxy实现数组响应式：
```js
let OnWatch = (obj, setBind, getLogger) => {
    let handler = {
        get(target, property, receiver) {
            getLogger(target, property)
            return Reflect.get(target, property, receiver)
        },
        set(target, property, value, receiver) {
            setBind(value)
        }
    }
    return new Proxy(obj, handler)
}

let obj = {a: 1}
let p = onWatch(
    obj,
    (v, property) => {
        console.log(`属性${property}被修改了，新的值为${v}`)
    },
    (target, property) => {
        console.log(`属性${property}被访问了，当前值为${target[property]}`)
    }
)

p.a = 2 // 属性a被修改了，新的值为2
console.log(p.a) // 属性a被访问了，当前值为2
```
这是一个简单的响应式实现，如果要实现Vue中的响应式，需要在get中收集依赖，在set中派发更新，之所以Vue 3使用Proxy替换原本的API原因在于Proxy无需一层层递归为每个属性添加代理，一次即可完成以上操作，性能更好，并且原本的实现有一些数据更新不能监听到，但是Proxy可以完美监听到任何方式的数据改变，唯一缺陷是浏览器的兼容性不好。

## ES7
![ES7](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/ES7.png)

## JavaScript基础
### map和Object的区别
| 对比维度         | Map                                                                 | Object |
|------------------|---------------------------------------------------------------------|--------|
| **意外的键**     | Map 默认情况不包含任何键，只包含显式插入的键。                     | Object 有一个原型，原型链上的键名有可能和自己在对象上设置的键名产生冲突。 |
| **键的类型**     | Map 的键可以是任意值，包括函数、对象或任意基本类型。               | Object 的键必须是 `String` 或是 `Symbol`。 |
| **键的顺序**     | Map 中的 key 是有序的。因此，当迭代的时候，Map 对象以插入的顺序返回键值。 | Object 的键是无序的。 |
| **Size**         | Map 的键值对个数可以轻易地通过 `size` 属性获取。                   | Object 的键值对个数只能手动计算。 |
| **迭代**         | Map 是 iterable 的，所以可以直接被迭代。                           | 迭代 Object 需要以某种方式获取它的键然后才能迭代。 |
| **性能**         | 在频繁增删键值对的场景下表现更好。                                 | 在频繁添加和删除键值对的场景下未作出优化。 |

### WeakMap
WeakMap对象也是一组键值对的集合，其中的键是弱引用的，键必须是对象，原始数据类型不能作为键，值可以是任意类型。

WeakMap相对于Map没有clear()方法，可以通过创建一个空的WeakMap替换原对象来实现清除。

WeakMap的设计目的在于，有时想在某个对象上存放些数据，但是会形成对于这个对象的引用。一旦不再需要这两个对象就必须手动删除这个引用，否则垃圾回收机制就不会释放对象占用的内存。而WeakMap的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。

### JavaScript内置对象
全局的对象，或称标准内置对象，不是“全局对象”，是指全局作用域中的对象，全局作用域中的其他对象可以由用户脚本创建或由宿主程序提供。

标准内置对象的分类：
- 值属性：这些全局属性返回一个简单值，没有自己的属性和方法。例如：`Infinity`、`NaN`、`undefined`。
- 函数属性：全局函数可以直接调用，不需要在调用时指定所属对象，执行结束后会将结果直接返回给调用者。例如：`eval()`、`isFinite()`、`isNaN()`、`parseFloat()`、`parseInt()`。
- 基本对象：基本对象是定义或使用其他对象的基础。基本对象包括一般对象、函数对象和错误对象。例如：`Object`、`Function`、`Boolean`、`Symbol`、`Error`。
- 数字和日期对象：用来表示数字、日期和执行数学计算的对象。例如：`Number`、`Math`、`Date`。
- 字符串：用来表示和操作字符串的对象。例如：`String`、`RegExp`。
- 可索引的集合对象：这些对象表示按照索引值来排序的数据集合，包括数组和类型数组，以及类数组结构的对象。例如：`Array`、`Int8Array`、`Uint8Array`、`Uint8ClampedArray`、`Int16Array`、`Uint16Array`、`Int32Array`、`Uint32Array`、`Float32Array`、`Float64Array`。
- 使用键的集合对象：这些集合对象在存储数据时会使用到键，支持按照插入顺序来迭代元素。例如：`Map`、`Set`、`WeakMap`、`WeakSet`。
- 矢量集合：SIMD矢量集合中的数据会被组织为一个数据序列。例如`SIMD`。
- 结构化数据：这些对象用来表示和操作结构化的缓冲区数据，或使用JSON编码的数据。例如：`ArrayBuffer`、`SharedArrayBuffer`、`DataView`、`JSON`。
- 控制抽象对象：这些对象用来表示和操作控制抽象，例如：`Promise`、`Generator`、`GeneratorFunction`、`AsyncFunction`。
- 反射：这些对象提供了反射功能，例如：`Reflect`、`Proxy`。
- 国际化：这些对象用来支持国际化，例如：`Intl`。
- WebAssembly：这些对象用来支持WebAssembly，例如：`WebAssembly`。
- 其他：例如`arguments`。

JavaScript中的内置对象指的是在程序执行前存在全局作用域中的JavaScript定义的一些全局值属性、函数和用来实例化其他对象的构造函数对象。一般经常用到的如全局变量NaN、undefined，全局函数如parseInt()、parseFloat()用来实例化对象的构造函数如Data、Object等，还有提供数学计算的单体内置对象如Math对象。

### 类数组对象
一个拥有length属性和若干索引属性的对象就可以被称为类数组对象，类数组对象和数组类似，但是不能调用数组的方法。常见的类数组对象有arguments和DOM方法的返回结果，还有一个函数也可以被看作是类数组对象，因为它含有length属性，代表可接收的参数个数。

常见的类数组转换为数组的方法有：
- 通过call调用数组的slice方法来实现转换：
```js
Array.prototype.slice.call(arrayLike)
```
- 通过call调用数组的splice方法来实现转换：
```js
Array.prototype.splice.call(arrayLike, 0)
```
- 通过apply调用数组的concat方法来实现转换：
```js
Array.prototype.concat.apply([], arrayLike)
```
- 通过Array.from()方法来实现转换：
```js
Array.from(arrayLike)
```

### 数组的原生方法
#### 静态方法
- `Array.from()`：将类数组对象或可迭代对象转换为数组。
- `Array.fromAsync()`：将类数组对象或可迭代对象转换为数组，并返回一个Promise对象。
- `Array.isArray()`：判断一个值是否为数组。
- `Array.of()`：将一组值转换为数组。
#### 实例方法
##### 修改原数组
- `push()`：向数组末尾添加一个或多个元素，并返回新的长度。
- `pop()`：删除数组末尾的元素，并返回被删除的元素。
- `shift()`：删除数组开头的元素，并返回被删除的元素。
- `unshift()`：向数组开头添加一个或多个元素，并返回新的长度。
- `splice(start, deleteCount, item1, item2, ...)`：从数组中添加或删除元素，并返回被删除的元素。
- `sort(compareFunction)`：对数组元素进行排序，并返回排序后的数组。
- `reverse()`：反转数组元素的顺序，并返回反转后的数组。
- `fill(value, start, end)`：用一个固定值填充数组中从start到end位置的元素，并返回被填充的数组。
- `copyWithin(target, start, end)`：从数组的start位置复制元素到target位置，并返回被修改的数组。
##### 不修改原数组
- `concat()`：合并两个或多个数组，并返回一个新数组。
- `slice(start, end)`：返回数组中从start到end位置的元素，并返回一个新数组。
- `toReversed()`：反转后返回一个新数组，原数组不变。
- `toSorted(compareFunction)`：排序后返回一个新数组，原数组不变。
- `toSpliced(start, deleteCount, item1, item2, ...)`：从数组中添加或删除元素，并返回被删除的元素，原数组不变。
- `with(index, value)`：返回一个新数组，替换指定index位置的元素为value，原数组不变。
- `falt(depth)`：将嵌套的数组展开为一维数组，并返回一个新数组。
- `flatMap(callback)`：对数组中的每个元素执行一个函数，并将结果展开为一个新数组返回。
##### 迭代/高阶方法
- `forEach(callback)`：对数组中的每个元素执行一个函数。
- `map(callback)`：对数组中的每个元素执行一个函数，并返回一个新数组。
- `filter(callback)`：对数组中的每个元素执行一个函数，并返回一个新数组，包含所有通过测试的元素。
- `reduce(callback, initialValue)`：对数组中的每个元素执行一个函数，并返回一个单一的值。
- `reduceRight(callback, initialValue)`：对数组中的每个元素执行一个函数，从右到左，并返回一个单一的值。
- `some(callback)`：对数组中的每个元素执行一个函数，并返回一个布尔值，表示是否至少有一个元素通过测试。
- `every(callback)`：对数组中的每个元素执行一个函数，并返回一个布尔值，表示是否所有元素都通过测试。
- `find(callback)`：对数组中的每个元素执行一个函数，并返回第一个通过测试的元素的值。
- `findIndex(callback)`：对数组中的每个元素执行一个函数，并返回第一个通过测试的元素的索引。
- `findLast(callback)`：对数组中的每个元素执行一个函数，并返回最后一个通过测试的元素的值。
- `findLastIndex(callback)`：对数组中的每个元素执行一个函数，并返回最后一个通过测试的元素的索引。
##### 搜索与检查
- `indexOf(searchElement, fromIndex)`：返回数组中第一个匹配元素的索引，如果没有找到则返回-1。
- `lastIndexOf(searchElement, fromIndex)`：返回数组中最后一个匹配元素的索引，如果没有找到则返回-1。
- `includes(searchElement, fromIndex)`：判断数组是否包含一个指定的元素，并返回一个布尔值。
- `at(index)`：返回数组中指定位置的元素，支持负数索引。
##### 转换/字符串
- `join(separator)`：将数组中的所有元素转换为一个字符串，并返回这个字符串。
- `toString()`：将数组中的所有元素转换为一个字符串，并返回这个字符串。
- `toLocaleString()`：将数组中的所有元素转换为一个字符串，并返回这个字符串，使用本地化的格式。
##### 迭代器方法
- `keys()`：返回索引迭代器。
- `values()`：返回值迭代器。
- `entries()`：返回键值对迭代器。
- `[Symbol.iterator]()`：默认是`values()`方法。

### 为什么函数的arguments参数是类数组而不是数组，如何遍历数组
arguments是一个对象，它的属性是从0开始依次递增的数字，还有callee和length等属性，与数组类似；但是它没有数组常见的方法属性，如forEach、reduce等，所以叫类数组。

要遍历数组有三种方法：
- 将数组的方法应用到类数组上，这时候就可以使用call和apply方法了：
```js
function foo() {
    Array.prototype.forEach.call(arguments, a => console.log(a))
}
```
- 使用Array.from方法将类数组转换为数组：
```js
function foo() {
    const arrArgs = Array.from(arguments)
    arrArgs.forEach(a => console.log(a))
}
```
- 使用展开运算符将类数组转换为数组：
```js
function foo() {
    const arrArgs = [...arguments]
    arrArgs.forEach(a => console.log(a))
}
```

### 类数组对象转化为数组
一个拥有length属性和若干索引属性的对象就可以被称为类数组对象，类数组对象和数组类似，但是不能调用数组的方法，常见的类数组对象有arguments和DOM方法的返回结果，函数参数也可以被看作是类数组对象，因为它含有length属性值，代表可接收的参数个数。
- 通过call调用数组的slice方法来实现转换：
```js
Array.prototype.slice.call(arrayLike)
```
- 通过call调用数组的splice方法来实现转换：
```js
Array.prototype.splice.call(arrayLike, 0)
```
- 通过call调用数组的concat方法来实现转换：
```js
Array.prototype.concat.apply([], arrayLike)
```
- 通过Array.from()方法来实现转换：
```js
Array.from(arrayLike)
```

### 对AJAX的理解
AJAX是Asynchronous JavaScript and XML的缩写，指的是通过JavaScript的异步通信，从服务器获取XML文档从中提取数据，再更新当前网页的对应部分，而不再刷新整个网页。

创建AJAX请求的步骤：
- 创建一个XMLHttpRequest对象。
- 在这个对象上使用open()方法来指定Http请求，open()方法所需要的参数是请求的方法、请求的地址、是否异步和用户的认证信息。
- 在发起请求前，可以为这个对象添加一些信息和监听函数。可以通过setRequestHeader()方法来为请求添加头信息。还可以为这个对象添加一个状态监听函数。一个XMLHttpRequest对象一共有5个状态，当它的状态变化会触发onreadystatechange事件，可以通过设置监听函数来处理请求成功后的结果。当对象的readyState变为4的时候，代表服务器返回的数据接收完成，这个时候可以通过判断请求的状态码来确定请求是否成功，如果是2xx或者304则代表返回正常，这个时候可以通过response中的数据对页面进行更新了。
- 当对象的属性和监听函数设置完成后，最后调用sent方法来像服务器发起请求，可以传入参数作为发送的数据体。
```js
const SERVER_URL = '/server'
let xhr = new XMLHttpRequest()
// 创建Http请求
xhr.open('GET', url, true)
// 设置状态监听函数
xhr.onreadystatechange = function() {
    if (this.readyState !== 4) {
        return
    }
    // 当请求成功时
    if (this.status === 200) {
        handle(this.response)
    } else {
        console.error(this.statusText)
    }
}
// 设置请求失败时的监听函数
xhr.onerror = function() {
    console.error(this.statusText)
}
// 设置请求头信息
xhr.responseType = 'json'
xhr.setRequestHeader('Accept', 'application/json')
// 发送Http请求
xhr.send(null)
```
使用Promise封装AJAX：
```js
// Promise封装实现
function getJSON(url) {
    // 创建一个Promise对象
    let promise = new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest()
        // 新建一个Http请求
        xhr.open('GET', url, true)
        // 设置状态监听函数
        xhr.onreadystatechange = function() {
            if (this.readyState !== 4) {
                return 
            }
            // 当请求成功或失败时，改变Promise的状态
            if (this.status === 200) {
                resolve(this.response)
            } else {
                reject(new Error(this.statusText))
            }
        }
        // 设置错误监听函数
        xhr.onerror = function() {
            reject(new Error(this.statusText))
        }
        // 设置响应的数据类型
        xhr.responseType = 'json'
        // 设置请求头信息
        xhr.setRequestHeader('Accept', 'application/json')
        // 发送Http请求
        xhr.send(null)
    })
    return promise
}
```

### 变量提升
变量提升的表现是，无论函数中何处位置声明的变量都被提升到了函数的顶部，可以在变量声明前访问到而不报错。

造成变量声明提升的本质原因是JavaScript引擎在代码执行前有一个解析的过程，创建了执行上下文，初始化了一些代码执行时需要用到的对象，当访问一个变量时，会到当前执行上下文中的作用域链中查找，而作用域链的首端指向的是当前执行上下文的变量对象，这个变量对象是执行上下文的一个属性，包含了函数的形参、所有的函数和声明变量，这个对象是在代码解析的时候创建的。

JavaScript拿到一个变量或函数会有解析和执行两步操作：
- 解析阶段：JavaScript会检查语法，并对函数进行预编译。解析的时候会先创建一个全局执行上下文环境，先把代码中即将执行的变量、函数声明都拿出来，变量先赋值undefined，函数先声明好可使用。在一个函数执行之前，也会创建一个函数执行上下文环境，跟全局执行上下文类似，不过函数执行上下文会多处this、arguments等属性：
    - 全局上下文：变量定义，函数声明。
    - 函数上下文：变量定义，函数声明，this，arguments。
- 执行阶段：JavaScript按照代码顺序依次执行。

变量提升有两个原因，即提升性能和容错性更好：
- 提升性能：在JavaScript代码执行之前，会进行语法检查和预编译，并且这一操作只进行一次，如果没有这一步，那么每次执行代码前都必须重新解析一遍该变量或函数，这是没必要的，因为变量或函数的代码不会改变，解析一遍就够了。在解析的过程中还会为函数生成预编译代码，在预编译时会统计声明了哪些变量、创建了哪些函数，并对函数的代码进行压缩，去除注释、不必要的空白等，这样做的好处是每次执行函数时都可以直接为该函数分配栈空间，不需要再解析一遍去获取代码中声明了哪些变量、创建了哪些函数，并且因为代码压缩的原因，代码执行也更快了。
- 容错性更好：尤其是用到var的时候。

### 尾调用
尾调用指的是函数的最后一步调用另一个函数，代码执行是基于执行栈的，所以当在一个函数里调用另一个函数时，会保留当前的执行上下文，然后再新建另外一个执行上下文加入栈中。使用尾调用时因为是函数的最后一步，所以这时可以不必再保留当前的执行上下文，从而节省内存，这就是尾调用优化。但是ES6的尾调用优化只在严格模式下开启，正常模式是无效的。

### ES6模块与CommonJS模块
- CommonJS是对模块的浅拷贝，ES6 Module是对模块的引用，即ES6 Module只存只读，不能更改其值，也就是指针指向不改变。
- import的接口是read-only，不能修改其变量值，即不能修改其变量的指针指向，但可以改变变量内部指针指向，可以对CommonJS对重新赋值改变指针指向，但是对ES6 Module赋值会编译报错。
- CommonJS和ES6 Module都可以对引入的对象进行赋值，即对对象内部属性进行修改。

### 常见的DOM操作
#### 获取DOM节点
- getElementById()：通过元素的id属性值获取一个元素节点。
- getElementsByTagName()：通过元素的标签名获取一个元素节点列表。
- getElementsByClassName()：通过元素的class属性值获取一个元素节点列表。
- querySelectorAll()：通过CSS选择器获取一个元素节点列表。
```js
// 按照id查询
var imooc = document.getElementById('imooc')    // 查询到id为imooc的元素
// 按照标签名查询
var pList = document.getElementsByTagName('p')     // 查询到所有的p元素，返回一个HTMLCollection对象
console.log(pList.length) // 3
console.log(pList[0]) // <p>...</p>
// 按照类名查询
var moocList = document.getElementsByClassName('mooc')     // 查询到所有class为mooc的元素，返回一个HTMLCollection对象
// 按照CSS选择器查询
var pList = document.querySelectorAll('.mooc')  // 查询到类名为mooc的集合
```

#### 创建DOM节点
```html
<html>
    <head>
        <title>DEMO</title>
    </head>
    <body>
        <div id="container">
            <h1 id="title">这是一个标题</h1>
        </div>
    </body>
</html>
```
```js
// 首先获取父节点
var container = document.getElementById('container')
// 创建一个新的元素节点
var targetSpan = document.createElement('span')
// 设置span节点的内容
targetSpan.innerHTML = '这是一个span元素'
// 把新创建的元素塞进父节点中
container.appendChild(targetSpan)
```

#### 删除DOM节点
```html
<html>
    <head>
        <title>DEMO</title>
    </head>
    <body>
        <div id="container">
            <h1 id="title">这是一个标题</h1>
        </div>
    </body>
</html>
```
```js
// 获取目标元素的父元素
var container = document.getElementById('container')
// 获取目标元素
var targetNode = document.getElementById('title')
// 删除目标元素
container.removeChild(targetNode)
```
或者通过子节点数组来完成删除：
```js
// 获取目标元素的父元素
var container = document.getElementById('container')
// 获取目标元素
var targetNode = container.childNodes[i]
// 删除目标元素
container.removeChild(targetNode)
```

#### 修改DOM节点
```html
<html>
    <head>
        <title>DEMO</title>
    </head>
    <body>
        <div id="container">
            <h1 id="title">这是一个标题</h1>
            <p id="content">这是一个内容</p>
        </div>
    </body>
</html>
```
##### 交换位置
```js
// 获取父元素
var container = document.getElementById('container')
// 获取两个需要被交换的元素
var title = docunment.getElementById('title')
var content = document.getElementById('content')
// 交换两个元素，把content置于title前面
container.insertBefore(content, title)
```

### use Strict
use Strict是ECMAScript 5引入的严格模式，这种运行模式使得JavaScript在更严格的条件下运行，目的是：
- 消除JavaScript语法的一些不合理、不严谨之处，减少一些怪异行为。
- 消除代码运行的不安全之处，保证代码运行的安全。
- 提高编译器效率，增加运行速度。
- 为未来新版本的JavaScript做好铺垫。

与正常模式的区别在于：
- 禁止使用with语句。
- 禁止this关键字指向全局对象。
- 对象不能有重名的属性。

### 判断对象是否属于某个类
- 使用instanceof()运算符来判断函数的prototype属性是否出现在对象的原型链中的任何位置。
- 通过对象的constructor属性来判断对象是否属于某个类，对象的constructor属性指向创建该对象的函数，但是这种方式不安全，因为constructor属性可以被改写。
- 如果需要判断的是某个内置的引用类型的话，可以使用Object.prototype.toString()方法来打印对象的`[[Class]]`属性来进行判断。

### for of和for in的区别
for of是ES6新增的遍历方式，允许遍历一个含有iterator接口的数据结构（数组、对象等）并返回各项的值，与for in的区别如下：
- for of遍历获取的是对象的键值，for in获取的是对象的键名。
- for in会遍历对象的整个原型链，性能非常差，而for of只会遍历对象本身的属性。
- 对于数组的遍历，for in会返回数组中所有可枚举的属性，包括原型链上的属性和数组的length属性，而for of只会返回数组中的元素值。

总结：for in循环主要为遍历对象而生，不适合遍历数组；for of循环可以用来遍历数组、类数组对象，字符串、Set、Map以及Generator对象等可迭代对象，不适合遍历对象。

#### 使用for of遍历对象
for of允许遍历一个含有iterator接口的数据结构（数组、对象等）并返回各项的值，普通的对象用for of遍历是会报错的。
- 如果遍历的对象是类数组对象，用Array.from()转成数组即可：
```js   
var obj = {
    0: 'one',
    1: 'two',
    length: 2
}
obj = Array.from(obj)
for (var k of obj) {
    console.log(k)
}
```
- 如果遍历的对象不是类数组对象，就给对象添加一个[Symbol.iterator]属性，并指向一个迭代器即可：
```js
// 方法一
var obj = {
    a: 1,
    b: 2,
    c: 3
}

obj[Symbol.iterator] = function*() {
    var keys = Object.keys(this)
    var count = 0
    return {
        next() {
            if (count < keys.length) {
                return {
                    value: obj[keys[count++]],
                    done: false
                }
            } else {
                return {
                    value: undefined,
                    done: true
                }
            }
        }
    }
}

for (var k of obj) {
    console.log(k) 
}

// 方法二
var obj = {
    a: 1,
    b: 2,
    c: 3
}

obj[Symbol.iterator] = function*() {
    var keys = Object.keys(obj)
    for (var k of keys) {
        yield [k, obj[k]]
    }
}

for (var [k, v] of obj) {
    console.log(k, v)
}
```

### AJAX、fetch、axios
#### AJAX
AJAX即Asynchronus JavaScript and XML的缩写，是指一种创建交互式网页应用的网页开发技术，它是一种在无需重新加载整个网页的情况下，能够更新部分网页的技术。通过在后台与服务器进行少量数据交换，AJAX可以是网页实现异步更新。这意味着可以在不更新加载整个网页的情况下，对网页的某部分进行更新。传统的不使用AJAX的网页如果需要更新内容，必须重载整个网页页面。其缺点如下：
- 本身是针对MVC编程，不符合前端MVVC的开发模式。
- 基于原生XHR开发，XHR本身的架构不清晰。
- 不符合关注分离的原则，数据请求和数据处理耦合在一起。
- 配置和调用方式非常混乱， 而且基于事件的异步模型不友好。

#### fetch
fetch号称是AJAX的替代品，是在ES6出现的，使用了ES6的Promise对象。fetch是基于Promise设计的，fetch代码结构比AJAX简单的多，fetch不是AJAX的进一步封装，而是原生JavaScript，没有使用XMLHttpRequest对象。

fetch的优点：
- 语法简洁，更加语义化
- 基于标准Promise实现，支持async/await语法
- 更加底层，提供的API丰富（request，response，headers等对象）
- 脱离了XHR，是ES规范里新的实现方式。

fetch的缺点：
- fetch只对网络请求报错，对400和500等HTTP错误状态码不报错，服务器返回400或500等错误状态码时并不会reject，只有网络错误这些导致请求不能完成时才会reject，所以需要手动检查response.ok属性来判断请求是否成功。
- fetch默认不会带cookie，需要添加配置项：`fetch(url, {credentials: 'include'})`
- fetch不支持abort，不支持超时控制，使用setTimeout及Promise.reject的实现的超时控制并不能阻止请求过程继续在后台运行，造成了流量的浪费。
- fetch没有办法原生监测请求的进度，而XHR可以。

#### axios
axios是一个基于Promise的HTTP客户端，特点如下：
- 浏览器端发起XMLHttpRequest请求，Node端发起http请求。
- 支持Promise API。
- 监听请求和响应。
- 对请求和响应数据进行转换。
- 取消请求。
- 自动转换JSON数据。
- 客户端支持防止CSRF/XSRF攻击。

### addEventListener()方法的参数和使用
EventTarget.addEventListener()方法将指定的监听器注册到EventTarget上，当该对象触发指定的事件时，指定的回调函数就会被执行。事件目标可以是一个文档上的元素Element、Document和Window或者任何其他支持事件的对象。

addEventListener()的工作原理是将实现EventListener的函数或对象添加到调用它的EventTarget上的指定事件类型的事件监听器列表上。使用语法：
```js
target.addEventListener(type, listener, options)
target.addEventListener(type, listener, useCapture)
target.addEventListener(type, listener, useCapture, wantsUntrusted)
```
- type：表示监听事件类型的字符串
- listener：当监听的事件类型触发时，会接收一个事件通知对象（实现了Event接口的对象）。listener必须是一个实现可EventListener接口的对象，或者是一个函数。
- option：可选，一个指定有关listener属性的可选参数对象。可用的选项：
    - capture：Boolean，表示listener会在该类型的事件捕获阶段传播到该EventTarget触发。
    - once：Boolean，表示listener在添加之后最多只调用一次。如果是true，listener会在其被调用之后自动移除。
    - passive：Boolean，设置为true时，表示listener永远不会调用preventDefault()。如果listener仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。
    - signal：AbortSignal，该AbortSignal的abort()方法被调用时，监听器会被移除。
- useCapture：可选，在DOM树中，注册了listener的元素，是否要先于它下面的EventTarget调用该listener。当useCapture为true时，沿着DOM树向上冒泡的事件不会触发listener。当一个元素嵌套了另一个元素，并且两个元素都对同一事件注册了一个处理函数时，所发生的事件冒泡和事件捕获时两种不同的事件传播方式。事件传播模式决定了元素从哪个顺序接收事件。如果没有指定，useCapture默认为false。
- wantsUntrusted：如果为true，则事件处理程序会接收网页自定义的事件。此参数只适用于Gecko（chrome的默认值为true，其他常规网页的默认值为false），主要用于附和组件的代码和浏览器本身。

## 原型与原型链
### 对原型与原型链的理解
在JavaScript中使用构造函数新建对象时，每个构造函数内部都带有一个prototype属性，这个属性值是一个对象，这个对象包含了该构造函数所有的实例共享的属性和方法。当这个构造函数新建一个对象后，这个对象内部将包含一个指针，这个指针指向构造函数的prototype属性对应的值，在ES5中称为对象的原型。一般来说不应能获取到这个值，但是浏览器中都实现了proto属性来访问这个属性，ES5中新增了Object.getPrototypeOf()方法来获取对象的原型。

当访问一个对象的属性时，如果这个对象内部不存在这个属性，那么它就会去它的原型对象里找这个属性，这个原型对象又会有自己的原型，于是就这样一直找下去，也就是原型链。原型链的尽头一般都是Object.prototype，所以新建的对象能够使用toString()等方法。

特点：JavaScript对象是通过引用来传递的，创建的每个新对象实体中并没有一份属于自己的原型副本。当修改原型时，与之相关的对象也会集成这一改变。
![原型链](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/prototype.png)

### 原型修改与重写
```js
function Person(name) {
    this.name = name
}
// 修改原型
Person.prototype.getName = function() {}
var p = new Person('hello')
console.log(p.__proto__ === Person.prototype) // true
console.log(p.__proto__ === p.constructror.prototype) // true
// 重写原型
Person.prototype = {
    getName: function() {}
}
var p = new Person('hello')
console.log(p.__proto__ === Person.prototype) // true
console.log(p.__proto__ === p.constructror.prototype) // false
```
可以看到修改原型的时候p的构造函数不是指向Person了，因为直接给Person的原型对象直接用对象赋值时，它的构造函数指向了跟构造函数Obejct，所以这时候p.constructor === Object，而不是p.constructor === Person了。要想成立就要用constructor指回来：
```js
Person.prototype = {
    getName: function() {}
}
var p = new Person('hello')
p.constructor = Person
console.log(p.__proto__ === Person.prototype) // true
console.log(p.__proto__ === p.constructor.prototype) // true
```

### 原型链指向
```js
p.__proto__    // Person.prototype
Person.prototype.__proto__    // Object.prototype
p.__proto__.__proto__    // Object.prototype
p.__proto__.constructor.prototype.__proto__    // Object.prototype
Person.prototype.constructor.prototype.__proto__    // Object.prototype
p1.__proto__.constructor    // Person
Person.prototype.constructor    // Person
```

### 原型链的终点
由于Object是构造函数，原型链终点是`Object.prototype.__proto__`，而`Object.prototype.__proto__ === null`为true，所以原型链的终点是null。原型链上的所有原型都是对象，所有的对象最终都是由Object构造的，而Object.prototype的下一级是`Object.prototype.__proto__`，它的值为null，所以原型链的终点是null。

### 获取对象非原型链上的属性
使用hasOwnProperty()方法来判断属性是否属于原型链的属性：
```js
function iterate(obj) {
    var res = []
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            res.push(key + ': ' + obj[key])
        }
    }
    return res
}
```

## 执行上下文/作用域链/闭包
### 对闭包的理解
闭包是指有权访问另一个函数作用域中变量的函数，创建闭包的最常见的方式就是在一个函数内创建另一个函数，创建的函数可以访问到当前函数的局部变量。

闭包的两种常见用途：
- 使我们在函数外部能够访问函数内部的变量，通过使用闭包，可以在外部调用闭包函数，从而在外部访问到函数内部的变量，可以使用这种方法来创建私有变量。
- 使已经运行结束的函数上下文中的变量对象继续留在内存中，因为闭包保留了这个变量对象的引用，所以这个变量对象不会回收。

比如函数A内部有一个函数B，函数B可以访问到函数A中的变量，那么函数B就是闭包。
```js
function A() {
    let a = 1
    window.B = function() {
        console.log(a)
    }
}
A()
B()
```
在JavaScript中闭包存在的意义就是让我们可以间接访问函数内部的变量，经典面试题：循环中使用闭包解决var定义函数的问题，比如下方这段函数：
```js
for (var i = 1; i <= 5; i++) {
    setTimeout(function timer() {
        console.log(i)
    }, 1000 * i) 
}
```
首先因为setTimeout是个异步函数，所以先把循环全部执行完，这时i为6，所以会输出一堆6，解决方法有三种：
1. 使用闭包：
```js
for (var i = 1; i <= 5; i++) {
    ;(function(j) {
        setTimeout(function timer() {
            console.log(j)
        }, j * 1000)
    })(i)
}
```
上述代码首先使用了立即执行函数将i传入函数内部，这个时候值被固定在了参数j上不会改变，当下次执行timer这个闭包时，就可以使用外部函数的变量j，从而达到目的。
2. 使用setTimeout的第三个参数，这个参数会被当成timer函数的参数传入。
```js
for (var i = 1; i <= 5; i++) {
    setTimeout(
        function timer(j) {
            console.log(j)
        },
        i * 1000,
        i
    )
}
```
3. 使用let定义i来解决问题：
```js
for (let i = 1; i <= 5; i++) {
    setTimeout(function timer() {
        console.log(i)
    }, i * 1000) 
}
```

### 对作用域、作用域链的理解
#### 全局作用域
- 最外层函数和最外层函数外层定义的变量拥有全局作用域
- 所有未定义直接赋值的变量自动声明为全局作用域
- 所有window对象的属性拥有全局作用域
- 全局作用域有很大的弊端，过多的全局作用域变量会污染全局命名空间，容易引起命名冲突
#### 函数作用域
- 函数作用域声明在函数内部的变量，一般只有固定的代码片段能访问到
- 作用域是分层的，内层作用域可以访问外层作用域，反之不行
#### 作用链域
在当前作用域中查找所需的变量，但是该作用域没有这个变量，那这个变量就是自由变量。如果在自己作用域找不到该变量就去父级作用域查找，依次向上级作用域查找，直到访问到window对象才终止，这一层层的关系就是作用域链。

作用域的作用是：保证对执行环境有权访问的所有变量和函数的有序访问，通过作用域链，可以访问到外层环境的变量和函数。

作用域链本质上是一个指向变量对象的指针列表。变量对象是一个包含了执行环境中所有变量和函数的对象。作用域链的前端始终都是当前执行上下文的变量对象。全局执行上下文的变量对象（也就是全局对象）始终是作用域链的最后一个对象。

当查找一个变量时，如果当前执行环境中没有找到，可以沿着作用域链向后查找。

### 对执行上下文的理解
#### 执行上下文类型
- 全局执行上下文：任何不在函数内部的都是全局执行上下文，它首先会创建一个全局的window对象，并且设置this的值等于这个全局对象，一个程序中只会有一个全局执行上下文。
- 函数执行上下文：当一个函数被调用时，就会为该函数创建一个新的执行上下文，函数的上下文可以有任意多个。
- eval函数执行上下文：执行在eval函数中的代码会有属于他自己的执行上下文，不过eval函数不常使用。
#### 执行上下文栈
- JavaScript引擎使用执行上下文栈来管理执行上下文
- JavaScript执行代码时，首先遇到全局代码会创建一个全局执行上下文并压入执行栈中，每当遇到一个函数调用，就会为该函数创建一个新的执行上下文并压入栈顶，引擎会执行位于执行上下文栈顶的函数，当函数执行完成之后，执行上下文从栈中弹出，继续执行下一个上下文，当所有的代码都执行完毕后，从栈中弹出全局执行上下文。
```js
let a = 'Hello World'
function first() {
    console.log('Inside first function')
    second()
    console.log('Again inside first function')
}

function second() {
    console.log('Inside second function')
}

first()
// 先出栈second()，再出栈first()
```
#### 创建执行上下文
创建执行上下文有两个阶段：创建阶段和执行阶段。
##### 创建阶段
- this绑定：
    - 全局执行上下文：this指向全局对象window。
    - 函数执行上下文：this的值取决于函数的调用方式，如果它被一个引用对象调用，那么this会被设置成那个对象，默认指向全局对象window或undefined。
- 创建词法环境组件：
    - 词法环境是一种有标识符——变量映射的数据结构，标识符是指变量或函数名，变量是对实际对象或原始数据的引用。
    - 词法环境的内部有两个组件：
        - 环境记录器：用来储存变量和函数声明的实际位置。
        - 外部环境引用：可以访问父级作用域。
- 创建变量环境组件：变量环境也是一个词法环境，其环境记录器持有变量声明语句在执行上下文中创建的绑定关系。
##### 执行阶段
此阶段会变成对变量的分配，最后执行完代码。

执行上下文指：在一个函数执行之前，也会创建一个函数执行上下文环境，跟全局执行上下文类似，不过函数执行上下文会多出this、arguments和函数的参数。
- 全局上下文：变量定义，函数声明。
- 函数上下文：变量定义，函数声明，this，arguments。

## this/call/apply/bind
### 对this对象的理解
this是执行上下文中的一个属性，它指向最后一次调用这个方法的对象，实际开发中this的指向可以通过四种调用模式来判断：
- 函数调用：当一个函数不是一个对象的属性时，直接作为函数来调用时this指向全局对象。
- 方法调用：函数作为对象的方法来调用时，this指向这个对象。
- 构造器调用：函数用new调用时，函数执行前会新创建一个对象，this指向这个新创建的对象。
- apply/call/bind调用：这三种方法都可以显示指定调用函数的this指向：
    - apply接收两个参数：一个是this绑定的对象，另一个是参数数组。
    - call方法接收的参数：一个是this绑定的对象，后面是参数列表。也就是说在使用call()方法时，传递给函数的参数必须逐个列举出来。
    - bind方法：通过传入一个对象，返回一个this绑定了传入对象的新函数。这个函数的this指向除了使用new时会改变，其他情况都不会改变。

### call()和apply()的区别
他们的作用相同，区别在于传入参数的方式不同：
- apply接收两个参数，第一个参数指定了函数体内this对象的指向，第二个参数为一个带下标的集合，这个集合可以为数组也可以类数组，apply方法把这个集合中的元素作为参数传递给被调用的函数。
- call传入的参数数量不固定，与apply相同的是，第一个参数也是代表函数体内的this指向，从第二个参数开始，往后每个参数被依次传入函数。

### 实现call/apply/bind方法
#### call函数的实现步骤：
1. 判断调用对象是否为函数，即使是定义在函数的原型上，但是可能出现使用call等方式调用的情况。
2. 判断传入上下文对象是否存在，如果不存在则设置为全局对象window。
3. 处理传入的参数，截取第一个参数后的所有参数。
4. 将函数作为上下文对象的一个属性。
5. 使用上下文对象来调用这个方法并返回结果。
6. 删除刚新增的属性
7. 返回结果。
```js
Function.prototype.myCall = function(context) {
    // 判断调用对象
    if (typeof this !== 'function') {
        console.error('type error')
    }
    // 获取参数
    let args = [...arguments].slice(1)
    result = null
    // 判断context是否传入，如果未传入则设置为window
    context = context || window
    // 将调用函数设为对象的方法
    context.fn = this
    // 调用函数
    result = context.fn(...args)
    // 将属性删除
    delete context.fn
    return result
}
```

#### apply函数的实现步骤
1. 判断调用对象是否为函数，即使是定义在函数的原型上，但是可能出现使用call等方式调用的情况。
2. 判断传入上下文对象是否存在，如果不存在则设置为全局对象window。
3. 将函数作为上下文对象的一个属性。
4. 判断参数值是否传入。
5. 使用上下文对象来调用这个方法并返回结果。
6. 删除刚才新增的属性。
7. 返回结果。
```js
Function.prototype.myApply = function(context) {
    // 判断调用对象是否为函数
    if (typeof this !== 'function') {
        console.error('type error')
    }
    let result = null
    // 判断context是否存在，如果未传入则为window
    context = context || window
    // 将函数设为对象的方法
    context.fn = this
    // 调用方法
    if (arguments[1]) {
        result = context.fn(...arguments[1])
    } else {
        result = context.fn()
    }
    // 将属性删除
    delete context.fn
    return result
}
```

#### bind函数的实现步骤
1. 判断调用对象是否为函数，即使是定义在函数的原型上，但是可能出现使用call等方式调用的情况。
2. 保存当前函数的引用，获取其余传入参数值。
3. 创建一个函数返回。
4. 函数内部使用apply来绑定函数调用，需要判断函数作为构造函数的情况，这个时候需要传入当前函数的this给apply调用，其余情况都传入指定的上下文对象。
```js
Function.prototype.myBind = function(context) {
    // 判断调用对象是否为函数
    if (typeof this !== 'function') {
        console.error('type error')
    }
    // 获取参数
    var args = [...arguments].slice(1)
    var fn = this
    return function Fn() {
        // 根据调用方式，传入不同绑定值
        return fn.apply(
            this instanceof Fn ? this : context,
            args.concat(...arguments)
        )
    }
}
```

## 异步编程
### 异步编程的实现方式
#### 回调函数
使用回调函数的方式有一个缺点就是多个回调函数嵌套的时候会造成回调函数地狱，上下两层的回调函数间代码的耦合度太高，不利于代码的可维护性。
#### Promise
使用Promise的方式可以将嵌套的回调函数作为链式调用，但是使用这种方法有时会造成多个.then()方法的链式调用，会造成代码的语义不够明确。
#### generator
它可以在函数的执行过程中，将函数的执行权转移出去，在函数外部还可以将执行权转移回来。当遇到异步函数执行的时候，将函数的执行权转移出去，当异步函数执行完毕时再将执行权给转移回来。因此在generator内部对于异步操作的方式，可以以同步的顺序来书写。使用这种方式需要考虑的问题是何时将函数的控制权转移回来，因此需要有一个自动执行generator的机制，比如说co模块等方式来实现generator的自动执行。
#### async函数
async函数是generator和promise实现的一个自动执行的语法糖，它内部自带执行器，当函数内部执行到一个await语句时，如果语句返回一个promise对象，那么函数将会等待promise对象的状态变为resolve后再继续向下执行。因此可以将异步逻辑转化为同步的顺序来书写，并且这个函数可以自动执行。

### setTimeout、Promise、async/await的区别
#### setTimeout
```js
console.log('script start') // 1.打印script start
setTimeout(function() {
    console.log('setTimeout') // 4.打印setTimeout
})  // 2.调用setTimeout函数，并定义其完成后执行的回调函数
console.log('script end') // 3.打印script end
// 输出顺序：script start -> script end -> setTimeout
```

#### Promise
Promise本身是同步的立即执行函数，当在executor中执行resolve或者reject的时候，此时是异步操作，会先执行then/catch等，当主栈完成后，才会去调用resolve/reject中存放的方法执行，打印p的时候，是打印的返回结果，一个Promise实例。
```js
console.log('script start') // 1.打印script start
let promise1 = new Promise(function(resolve) {
    console.log('promise1') // 2.打印promise1
    resolve()
    console.log('promise1 end') // 3.打印promise1 end
}).then(function() {
    console.log('promise2') // 5.打印promise2
}) 
setTimeout(function() {
    console.log('setTimeout') // 6.打印setTimeout
})
console.log('script end') // 4.打印script end
// 输出顺序：script start -> promise1 -> promise1 end -> script end -> promise2 -> setTimeout
```
当JavaScript主线程执行到Promise对象时：
- promise1.then()的回调就是一个task
- promise1是resolve或rejected：那这个task就会放入当前事件循环回合的microtask queue中。
- promise1是pending：这个task就会放入事件循环的未来某个（可能下一个）回合的microtask queue中。
- setTimeout的回调也是一个task，它会被放入marcotask queue中即使是0ms的情况。

#### async/await
async函数返回一个Promise对象，当函数执行的时候，一旦遇到await就会先返回，等到触发的异步操作完成再执行函数题内后面的语句。可以理解为是让出了线程，跳出了async函数体。
```js
async function async1() {
    console.log('async1 start') 
    await async2() 
    console.log('async1 end') 
}
async function async2() {
    console.log('async2') 
}
console.log('script start') 
async1() 
console.log('script end') 
// 输出顺序：script start -> async1 start -> async2 -> script end -> async1 end
```
例如：
```js
async function func1() {
    return 1
}
console.log(func1()) // 1.打印Promise { 1 }
```
func1的运行结果其实就是一个Promise对象，因此也可以使用then来处理后续逻辑。
```js
func1().then(res => {
    console.log(res)  // 30
})
```
await的含义为等待，也就是async函数需要等待await后的函数执行完成并且有了返回结果（Promise对象）之后，才能继续执行下面的代码。await通过返回一个Promise对象来实现同步的效果。

### 对Promise的理解
Promise是异步编程的一种解决方案，它是一个对象，可以获取异步操作的消息，Promise大大改善了异步编程的困境，避免了回调地狱，比传统的解决方案回调函数和事件更合理和更强大。

所谓Promise简单来说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上来说Promise是一个对象，从它可以获取异步操作的消息。Promise提供统一的API，各种异步操作都可以用同样的方法进行处理。

Promise的实例有三个状态，当把一件事情交给Promise时就是Pending，任务完成就变成了Resolved，任务失败就变成了Rejected：
- Pending（进行中）
- Resolved（已完成）
- Rejected（已拒绝）

Promise有两个过程，一旦从进行状态变成为其他状态就永远不能更改状态了：
- pending -> fulfilled：Resolved（已完成）
- pending -> rejected：Rejected（已拒绝）

Promise的特点：
- 无法取消Promise，一旦新建就会立即执行，无法中途取消。
- 如果不设置回调函数，Promise内部抛出的错误不会反映到外部。
- 当处于pending状态时，无法得知目前进展到哪个阶段（刚刚开始还是即将完成）。

总结：Promise对象是异步编程的一种解决方案，最早由社区提出。Promise是一个构造函数，接收一个函数作为参数，返回一个Promise实例。一个Promise实例有三种状态：pending、resolved、rejected。实例的状态只能由pending转变为resolved或者rejected状态，并且状态一经改变就无法再被改变了。

状态的改变是通过resolve和reject函数来实现的，可以在异步操作结束后调用这两个函数改变Promise实例的状态，它的原型上定义了一个then方法，使用这个then方法可以为两个状态的改变注册回调函数，这个回调函数属于微任务，会在本轮事件循环的末尾执行。

在构造Promise的时候，构造函数内部的代码是立即执行的。

### Promise的基本用法
#### 创建Promise对象
Promise对象代表一个异步操作，有三种状态：pending、resolved、rejected。Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject：
```js
const promise = new Promise(function(resolve, reject) {
    // 一些异步操作
    if (/* 异步操作成功 */) {
        resolve(value) // 将Promise对象的状态改为resolved，并将异步操作的结果传递给then方法的回调函数
    } else {
        reject(error) // 将Promise对象的状态改为rejected，并将异步操作的错误传递给catch方法的回调函数
    }
})
```
一般情况下都会使用new Promise()来创建promise对象，但是也可以使用Promise.resolve(value)和Promise.reject(error)来创建一个已经处于resolved或者rejected状态的Promise对象：
- Promise.resolve(value)：返回值也是一个Promise对象，可以对返回值进行.then()方法的调用：
```js
Promise.resolve(11).then(function(value) {
    console.log(value) // 11
})
```
resolve(11)代码中，会让promise对象进入resolved状态，并且把11作为参数传递给then方法指定的onFulfilled函数。
- Promise.reject(error)：
```js
Promise.reject(new Error('出错了'))
////// 等价于
new Promise(function(resolve, reject) {
    reject(new Error('出错了'))
})
```

下面是使用resolve方法和reject方法：
```js
function testPromise(ready) {
    return new Promise(function(resolve, reject) {
        if (ready) {
            resolve('成功了')
        } else {
            reject('失败了')
        }
    })
}
// 方法调用
testPromise(true).then(function(message) {
    console.log(message)
}, function(error) {
    console.log(error)
})
```
向testPromise方法传递一个参数，返回一个Promise对象，如果为true的话那么调用Promise对象的resolve()方法，并且把其中的参数传递给后面的.then()第一个方法内，因此打印“成功了”；如果为false会调用Promise对象中的reject()方法，则会进入.then()方法的第二个函数，因此打印“失败了”。

#### Promise方法
Promise有五个常用方法：then()、catch()、all()、race()、finally()。
##### then()方法
当Promise执行的内容符合成功条件时，调用resolve()，失败就调用reject()。Promise创建完了该如何调用呢？
```js
promise.then(function(value) {
    // success
}, function(error) {
    // failure
})
```
then()方法可以接受两个回调函数作为参数。第一个回调函数是Promise对象的状态变为resolved时调用，第二个回调函数是Promise对象的状态变为rejected时调用。其中第二个参数可以省略。

then()方法返回的是一个新的Promise实例，不是原来那个Promise实例，因此可以采用链式调用写法，即多个.then()连续调用：
```js
let promise = new Promise((resolve, reject) => {
    ajax('first').success(function(res) {
        resolve(res)
    })
})
promise.then(res => {
    return new Promise((resolve, reject) => {
        ajax('second').success(function(res) {
            resolve(res)
        })
    })
}).then(res => {
    return new Promise((resolve, reject) => {
        ajax('second').success(function(res) {
            resolve(res)
        })
    })
}).then(res => {
    console.log(res)
})
```
当要写的事件没有顺序或者关系时，可以使用all()方法来处理多个Promise对象。

##### catch()方法
Promise对象除了有then()方法之外，还有一个catch()方法，该方法相当于then()方法的第二个参数，指向reject的回调函数。不过catch()方法还有一个作用，就是在执行resolve()回调函数时，如果出现错误，抛出异常不会停止运行，而是进入catch方法中：
```js
promise.then((data) => {
    console.log('resolve', data)
},(err) => {
    console.log('reject', err)
})

promise.then((data) => {
    console.log('resolve', data)
}).catch((err) => {
    console.log('catch', err)
})
```

##### all()方法
all()方法可以完成并行任务，它接收一个数组，数组的每一项都是一个promise对象。当数组中所用的promise状态都达到resolved时，all()方法的状态就会变成resolved，如果有一个状态变成了rejected，那么all()方法的状态就会变成rejected。
```js
let promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1)
    }, 2000)
})
let promise2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(2)
    }, 1000)
})
let promise3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(3)
    }, 3000)
})
Promise.all([promise1, promise2, promise3]).then((res) => {
    console.log(res)
    // 结果为：[1, 2, 3]
})
```
调用all()方法结果成功的时候是回调函数的参数也是一个数组，这个数组按顺序保存着每一个promise对象resolve()执行时的值。

##### race()方法
race()方法和all()方法一样，接受的参数是一个每项都是promise的数值，但是与all()不同的是，当最先执行的事件完成后，就直接返回该promise对象的值，如果第一个promise对象状态变成resolved，那么自身的状态变成了resolved；反之第一个promise变成rejected，那自身状态就变成了rejected。
```js
let promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1)
    }, 2000)
})
let promise2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(2)
    }, 1000)
})
let promise3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(3)
    }, 3000)
})
Promise.race([promise1, promise2, promise3]).then((res) => {
    console.log(res)
    // 结果为：2
}, rej => {
    console.log(rej)
})
```
race()的实际作用是：当要做一件事，超过多长时间就不做了，可以用这个方法来解决：
```js
Promise.race([promise1, timeOutPromise(5000)]).then(res => {})
```

##### finally()方法
finally()方法用于指定不管Promise对象最后状态如何，都会执行的操作。该方法是ES2018引入的：
```js
promise
    .then(result = > {})
    .catch(error => {})
    .finally(() => {
        // 无论Promise对象最后状态如何，都会执行的操作
    })
```
finall()方法的回调函数不接受任何参数，这意味着没有办法知道前面的promise状态到底是fulfilled还是rejected。这表明，finally()方法里面的操作应该是与状态无关的，不依赖于Promise的执行结果。finally()本质上是then()方法的特例：
```js
promise.finally(() => {})
//// 等价于
promise.then(result => {
    // 语句
    return result
}, error => {
    // 语句
    throw error
})
```

### Promise解决了什么问题
在真实情景中，假如使用ajax发出一个A请求后成功拿到数据，需要把数据传给B请求，那么需要这些写：
```js
let fs = require('fs')  
fs.readFile('./a.txt', 'utf8', function(err, data) {
    fs.readFile(data, 'utf8', function(err, data) {
        fs.readFile(data, 'utf8', function(err, data) {
            console.log(data)
        })
    })
})
```
上面的代码有以下缺点：
- 后一个请求需要依赖前一个请求成功后，将数据向下传递，会导致多个ajax请求嵌套的情况，代码不够直观。
- 如果前后两个请求不需要传递参数的情况下，那么后一个请求也需要前一个请求成功后再执行下一步操作，这种情况下也需要如上写法，导致代码不够直观。

Promise解决了以上问题，代码简洁，解决了回调地狱的问题：
```js
let fs = require('fs')
function read(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf8', function(err, data) {
            error && reject(error)
            resolve(data)
        })
    })
}
read('./a.txt').then(data => {
    return read(data)
}).then(data => {
    return read(data)
}).then(data => {
    console.log(data)
})
```

### Promise.all()和Promise.race()的区别和使用场景
#### Promise.all()
Promise.all()可以将多个Promise实例包装成一个新的Promise实例。同时，成功和失败的返回值是不同的，成功的时候返回的是一个结果数组，失败的时候返回的最先被reject的状态的值。Promise.all()传入数组和返回数组的顺序是一一对应的，他们的顺序保持一致。但是执行并不是按照顺序执行的，除非可迭代对象为空。

#### Promise.race()
顾名思义，Promise.race([p1, p2, p3])方法接受一个Promise实例的数组作为参数，返回一个新的Promise实例。只要p1、p2、p3中有一个实例率先改变状态，race方法返回的Promise实例就会跟着改变状态。当要做一件事超过多长时间就不做了，可以用这个方法来解决：
```js
Promise.race([promise1, timeOutPromise(5000)]).then(res => {})
```

### 对async/await的理解
async/await其实是Generator的语法糖，它能实现的效果都能用.then()链来实现，它是为了优化.then()链而开发出来的，async函数返回的是：
```js
async function testAsync() {
    return 'hello world'
}
let result = testAsync()
console.log(result) // Promise { 'hello world' }
```
所以async函数返回的是一个Promise对象，如果在函数中return一个直接量，async会把这个直接量通过Promise.resolve()封装成Promise对象。

async函数返回的是一个Promise对象，所以在最外层不能用await获取其返回值的情况下，当然应该用原来的.then()方法来获取返回值：
```js
async function testAsync() {
    return 'hello world'
}

let result = testAsync()
console.log(result) // Promise { 'hello world' }
result.then(res => {
    console.log(res) // hello world
})
```
如果async函数没有返回值，它会返回Promise.resolve(undefined)。

Promise的特点是无等待，所以在没有await的情况下执行async函数，它会立即执行，返回一个Promise对象，并且不会阻塞后面的语句，这和普通返回Promise对象的函数是一样的。

Promise.resolve(value)可以看作new Promise(resolve => resolve(value))的简写形式，可以用于快速封装字面量对象或其他对象，将其封装成Promise实例。

### await在等什么
一般来说await是在等待一个async函数的返回值。实际上await其实可以等任何表达式的结果：
```js
function getSomething() {
    return 'something'
}
async function testAsync() {
    return Promise.resolve('hello world')
}
async function test() {
    const v1 = await getSomething()
    const v2 = await testAsync()
    console.log(v1, v2)
}
test()
```
await表达式的运算结果取决于它在等什么：
- 如果等的不是一个Promise对象，那await表达式的运算式的计算结果就是它等到的东西。
- 如果等到的是一个Promise对象，await就要开始工作了，它会阻塞后面的代码，等着Promise对象resolve()然后得到resolve()的值作为运算结果。

```js
function testAsync(value) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(value)
        }, 3000)
    })
}
async function testAwait() {
    let result = await testAsync('hello world')
    console.log(result)     // 3秒后打印hello world
    console.log('testAwait end')    // 3秒后打印testAwait end
}
testAwait()
console.log('testAwait start')   // 先打印testAwait start
```
上面的例子说明了为什么await必须用在async函数中，async函数调用不会造成阻塞，它内部所有的阻塞都被封装在一个Promise对象中异步执行，await暂定当前async的执行，所以‘testAwait start’会先打印出来，等到testAsync函数中的setTimeout执行完毕后，才会打印出‘hello world’和‘testAwait end’。

### async/await的优势
单一的Promise链并不能发现async/await的优势，当需要处理由多个Promise组成的.then()链时，async/await的优势就体现出来了，Promise通过.then()链来解决多层回调的问题，现在又由async/await来进一步优化。

假设一个业务分多个步骤完成，每个步骤都是异步的，并且依赖上一个步骤的结果，依然用setTimeout来模拟异步操作：
```js   
/**
 * 传入参数n，表示这个函数执行的时间（毫秒）
 * 执行的结果是n + 200，这个值将用于下一个步骤
 */
function takeLongTime(n) {
    return new Promise(resolve => {
        setTimeout(() => {
            setTimeout(() => resolve(n + 200), n)
        })
    })
}
function step1(n) {
    console.log('step1 with ' + n)
    return takeLongTime(n)
}
function step2(n) {
    console.log('step2 with ' + n)
    return takeLongTime(n)
}
function step3(n) {
    console.log('step3 with ' + n)
    return takeLongTime(n)
}
```
传统的Promise写法：
```js
function doIt() {
    console.log('do it')
    const time1 = 300
    step1(time1)
        .then(time2 => step2(time2))
        .then(time3 => step3(time3))
        .then(result => {
            console.log('result: ' + result)
            console.timeEnd('do it')
        })
}
doIt()
// step1 with 300
// step2 with 500
// step3 with 700
// result: 900
// do it: 1500ms
```
输出结果result是step3的结果，step3的结果是step2的结果加200，step2的结果是step1的结果加200，step1的结果是300，所以最终输出900。上面的代码虽然解决了回调地狱的问题，但是代码的可读性不够好，尤其是当.then()链很长的时候，代码就会变得很难阅读。

如果用async/await来写上面的代码：
```js
async function doIt() {
    console.log('do it')
    const time1 = 300
    const time2 = await step1(time1)
    const time3 = await step2(time2)
    const result = await step3(time3)
    console.log('result: ' + result)
    console.timeEnd('do it')
}
doIt()
```
运行结果相同，但代码要清晰很多，尤其是当.then()链很长的时候，async/await的优势就更明显了。

### async/await对比Promise的优势
- 代码更易读，Promise虽摆脱回调地狱，但.then()的链式调用带来了阅读负担
- Promise的中间值传递非常麻烦，而async/await的写法则十分优雅
- async/await的错误处理友好，可以使用成熟的try/catch，Promise的错误捕获则十分冗余
- 调试友好，Promise调试很麻烦，由于没有代码块，无法在一个返回表达式的箭头函数中设置断点，如果在一个.then()代码块中使用调试器的步进功能，调试器并不会进入后续的.then()代码块中，因为调试器只能跟踪同步代码的每一步。

### 并发与并行的区别
- 并发：宏观概念，分别有任务A和任务B，在一段时间内通过任务间的切换完成了这两个任务，称之为并发。
- 并行：微观概念，假设CPU中存在两个核心，那么可以同时完成任务A和任务B，同时完成多个任务的情况就可以称为并行。

### 回调函数的缺点
回调函数的致命缺点就是容易造成回调地狱，假设多个请求存在依赖性，可能会有如下代码：
```js
ajax(url, () => {
    // 处理逻辑
    ajax(url1, () => {
        // 处理逻辑
        ajax(url2, () => {
            // 处理逻辑
        })
    })
})
```
以上代码看起来不利于阅读和维护，当然也可以把函数分开写：
```js
function firstAjax() {
    ajax(url1, () => {
        // 处理逻辑
        secondAjax()
    })
}
function secondAjax() {
    ajax(url2, () => {
        // 处理逻辑
    })
}
ajax(url, () => {
    // 处理逻辑
    firstAjax()
})
```
这个写法虽然便于阅读，但没有解决回调地狱这个根本问题：
- 嵌套函数存在耦合性，一旦改动整体代码结构就会受到影响。
- 错误处理麻烦，错误需要在每个回调函数中进行处理，无法统一处理错误。
- 不能直接return结果，无法直接返回结果，需要通过回调函数来传递结果，导致代码不够直观。

### setTimeout、setInterval、requestAnimationFrame的区别
异步编程常见的定时器函数有三种：setTimeout、setInterval、requestAnimationFrame。
#### setTimeout
setTimeout()常被认为是延时多久就应该是多久后执行，其实这个观点是错误的，因为Javascript是单线程执行，如果前面的代码影响了性能，就会导致setTimeout()不会按期执行。可以通过代码来修正setTimeout()，从而使定时器相对准确：
```js
let period = 60 * 1000 * 60 * 24
let startTime = new Date().getTime()
let count = 0
let end = new Date().getTime() + period
let interval = 1000
let currentInterval = interval
function loop() {
    // 代码执行所消耗的时间
    let offset = new Date().getTime() - (startTime + count * interval)
    let diff = end - new Date().getTime()
    let h = Math.floor(diff / (60 * 1000 * 60))
    let hdiff = diff % (60 * 1000 * 60)
    let m = Math.floor(hdiff / (60 * 1000))
    let mdiff = hdiff % (60 * 1000)
    let s = mdiff / 1000
    let sCeil = Math.ceil(s)
    let sFloor = Math.floor(s)
    // 得到下一次循环所消耗的时间
    currentInterval = interval - offset
    console.log('时：' + h，'分：' + m, '秒：' + s, '秒向上取整：' + sCeil, '代码执行时间：' + offset, '下一次循环时间：' + currentInterval)
    setTimeout(loop, currentInterval)
}
setTimeout(loop, currentInterval)
```
#### setInterval
setInterval()的作用与setTimeout()类似，通常来说不建议使用setInterval()，因为它的执行时间不准确，可能会出现多次调用的情况，导致代码执行混乱：
```js
function demo() {
    setInterval(function() {
        console.log(2)
    }, 1000)
    sleep(2000)
}
demo()
```
上面的代码在浏览器环境中，如果定时器执行过程中出现了耗时操作，多个回调函数会在耗时操作结束以后同时执行，这样可能就会带来性能上的问题。

#### requestAnimationFrame
如果有循环定时器的需求，完全可以通过requestAnimationFrame来实现：
```js
function setInterval(callback, interval) {
    let timer
    const now = Date.now()
    let startTime = now()
    let endTime = startTime
    const loop = () => {
        timer = window.requestAnimationFrame(loop)
        endTime = now()
        if (endTime - startTime >= interval) {
            startTime = endTime = now()
            callback(timer)
        }
    }
    timer = window.requestAnimationFrame(loop)
    return timer
}
let a = 0
setInterval(timer => {
    console.log(1)
    a++
    if (a === 3) {
        cancelAnimationFrame(timer)
    }
}, 1000)
```
requestAnimationFrame()自带节流，基本可以保证在16.6毫秒内执行一次，并且该函数的延时效果是精确的，没有其他定时器函数执行时间不准的问题，也可以通过这个函数来实现setTimeout()。

## 面向对象
### 创建对象的方式
在ES6之前，JavaScript没有类的概念，但是可以使用函数来模拟，从而产生出可复用的对象创建方法：
#### 工厂模式
工厂模式主要原理是用函数来封装创建对象的细节，从而通过调用函数来达到复用的目的。比较大的问题是创建出来的对象无法和某个类型联系起来，它只是简单封装了复用代码，没有建立对象和类型间的关系。

#### 构造函数模式
JavaScript中每一个函数都可以作为构造函数，只要一个函数是通过new来调用的，那么就可以把它称为构造函数。执行构造函数首先会创建一个对象，然后将对象的原型指向构造函数的prototype属性，再将执行上下文中的this指向这个对象，最后再执行整个函数，如果返回值不是对象就返回新建的对象。

因为this的值指向了新建的对象，因此可以使用this给对象赋值。构造函数相对于工厂函数的优点是创建出的对象和构造函数有联系，可以通过原型来识别对象的类型。但是构造函数有一个缺点是造成了不必要的函数对象的创建，在JavaScript中函数也是对象，因此如果对象属性中包含函数，那么每次都会新建一个函数对象，浪费内存空间，因为函数是所有的实例都可以通用的。

#### 原型模式
每个函数都有一个prototype属性，这个属性是一个对象，它包含了通过构造函数创建的所有实例都能共享的属性和方法。因此可以使用原型对象来添加公共属性和方法从而实现代码复用。相比构造函数来说，解决了函数对象的复用问题。但是这个模式的问题是无法通过传入参数来初始化值，另一个是存在一个引用类型像Array这样的值，那么所有的实例将共享一个对象，一个实例对引用类型值的改变会影响所有的实例。

#### 构造函数与原型组合模式
这是创建自定义类型的最常见方式，通过构造函数来初始化对象的属性，通过原型对象来实现函数方法的复用。这种组合模式解决了两个模式的缺点，但仍存在的不足是因为使用了两种不同的模式，所以对于代码的封装性不好。

#### 动态原型模式
这个模式将原型方法赋值的创建过程移动到了构造函数内部，通过对属性是否存在的判断可以实现仅在第一次调用函数时对原型对象赋值一次的效果，这样就避免了构造函数与原型组合模式中存在的封装性问题。

#### 寄生构造模式
这个模式和工厂模式的实现基本相同，它主要基于一个已有的类型，在实例化时对实例化的对象进行扩展，这样既不用修改原来的构造函数也达到了扩展对象的目的。它的缺点和工厂函数一样，无法实现对象的识别。

### 对象集成的方式
#### 原型链
这种方式的缺点是在包含有引用类型的数据时，会被所有的实例对象所共享，容易造成修改的混乱。还有就是创建子类型的时候不能向超类型传递参数。

#### 借用构造函数
这种方式通过在子类型的函数中调用超类型的构造函数来实现，这种方法解决了不能向超类型传递参数的缺点，但是它的问题是无法实现函数方法的复用，且超类型原型定义的方法子类型也没有办法访问到。

#### 组合继承
组合继承是将原型链和借用构造函数组合起来使用的一种方式，通过借用构造函数的方式来实现类型的属性继承，通过将子类型的原型设置为超类型的实例来实现方法的继承。这种方式解决了上面两张方式单独使用时的问题，但是由于是以超类型的实例来作为子类型的原型，所以调用了两次超类的构造函数，造成子类型的原型种多了很多不必要的属性。

#### 原型式继承
主要思路就是基于已有的对象来创建新的对象，实现的原理是向函数中传入一个对象，然后返回一个以这个对象为原型的对象。这种继承的思路主要不是为了实现创造一种新的类型，只是对某个对象实现一种简单继承，ES5中定义的Object.create()方法就是原型式继承的实现，缺点是原型链方式相同。

#### 寄生式继承
主要思路是创建一个用于封装继承过程的函数，通过传入一个对象，然后复制一个对象的副本，对对象进行扩展，最后返回这个对象。扩展的过程可以理解为是一种继承。这种方式的优点是对一个简单对象实现继承，前提是这个对象不是自定义类型。缺点是没法实现函数的复用。

#### 寄生式组合继承
组合继承的缺点是使用超类型的实例作为子类型的原型，导致添加了不必要的原型属性，寄生式组合继承方式是使用了超类型的原型副本作为子类型的原型，从而避免创建不必要的属性。

## 垃圾回收与内存泄漏
### 垃圾回收的概念
JavaScript代码运行时，需要分配内存空间来储存变量和值。当变量不再参与运行时，就需要系统收回被占用的内存空间，这就是垃圾回收

### 回收机制
- JavaScript具有自动垃圾回收机制，会定期对那些不再使用的变量、对象所占用的内存进行释放，原理就是找到不再使用的变量然后释放其占用的内存。
- JavaScript中存在两个变量：局部变量和全局变量。全局变量的生命周期会持续到页面卸载，而局部变量声明在函数中，它的生命周期从函数执行开始，直到函数执行结束，在这个过程中，局部变量会在堆或栈中存储它们的值，当函数执行结束后，这些局部变量不再被使用，它们所占用的空间就会被释放。
- 当局部变量被外部函数使用时，其中一种情况就是闭包，在函数执行结束后，函数外部的变量依然指向函数内部的局部变量，此时局部变量依然在被使用，所以不会回收。

### 垃圾回收的方式
浏览器常用的垃圾回收方式有两种：标记清除和引用计数。
#### 标记清除
- 标记清除是浏览器常见的垃圾回收方式，当变量进入执行环境时，就标记这个变量“进入环境”，被标记为“进入环境”的变量时不能被回收的，因为他们正在被使用。当变量离开环境时，就会被标记为“离开环境”，被标记为“离开环境”的变量就会被内存释放。
- 垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记。然后它会去掉环境中的变量以及被环境中的变量引用的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后，垃圾收集器完成内存消除工作，销毁那些带标记的值，并回收他们所占用的内存空间。

#### 引用计数
- 引用计数使用相对较少。引用计数就是跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型赋值给该变量时，则这个值的引用次数就是1。相反如果包含这个值引用的变量又取得了另外一个值，则这个值的引用次数减1。当这个引用次数变为0时，说明这个变量已经没有价值，因此在垃圾回收机制下次再运行时，这个变量所占用的变量就会被释放出来。
- 这个方法会造成循环引用的问题，例如：obj1和obj2通过属性进行相互引用，两个对象的引用次数都是2，当使用循环计数时，由于函数执行完后两个对象都离开作用域，函数执行结束，obj1和obj2还将会继续存在，因此它们的引用次数永远不会是0，这样就会造成内存泄漏。
```js
function func() {
    let obj1 = {}
    let obj2 = {}
    obj1.a = obj2   // obj1引用obj2
    obj2.a = obj1   // obj2引用obj1
}
```
需要手动释放变量占用的内存：
```js
obj1.a = null
obj2.a = null
```

### 减少垃圾回收
虽然浏览器可以进行垃圾自动回收，但是当代码比较复杂时垃圾回收所带来的代价比较大，所以应该尽量减少垃圾回收。
- 对数组进行优化：在清空一个数组时，最简单的方法就是给其赋值为`[]`，但是这同时会创建一个新的空对象，可以将数组的长度设置为0，以此来达到清空数组的目的。
- 对对象进行优化：对象尽量复用，对于不再使用的对象就将其设置为null，尽快被回收。
- 对函数进行优化：在循环中的函数表达式，如果可以复用尽量放在函数的外面。

### 导致内存泄漏的情况
- 意外的全局变量：由于使用未声明的变量，而意外的创建了一个全局变量，而使这个变量一直留在内存中无法被回收。
- 被遗忘的计时器或回调函数：设置了setInterval()定时器，而忘记取消它，如果循环函数有外部变量的引用，那么这个变量会被一直留在内存中而无法被回收。
- 脱离DOM的引用：获取一个DOM元素的引用，而后面这个元素被删除，由于一直保留了对这个元素的引用，所以它也无法被回收。
- 闭包：不合理的使用闭包，从而导致某些变量一直被留在内存中。

