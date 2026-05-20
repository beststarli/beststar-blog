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

