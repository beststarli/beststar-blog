---
title: JavaScript八股
description: JavaScript八股
sidebar_position: 6
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

### 对JSON的理解
JSON 是一种基于文本的轻量级的数据交换格式。它可以被任何的编程语言读取和作为数据格式来传递。

在项目开发中，使用 JSON 作为前后端数据交换的方式。在前端通过将一个符合 JSON 格式的数据结构序列化为JSON字符串，然后将它传递到后端，后端通过 JSON 格式的字符串解析后生成对应的数据结构，以此来实现前后端数据的一个传递。

因为 JSON 的语法是基于 js 的，因此很容易将 JSON 和 js 中的对象弄混，但是应该注意的是 JSON 和 js 中的对象不是一回事，JSON 中对象格式更加严格，比如说在 JSON 中属性值不能为函数，不能出现 NaN 这样的属性值等，因此大多数的 js 对象是不符合 JSON 对象的格式的。

在 js 中提供了两个函数来实现 js 数据结构和 JSON 格式的转换处理：
- JSON.stringify 函数，通过传入一个符合 JSON 格式的数据结构，将其转换为一个 JSON 字符串。如果传入的数据结构不符合 JSON 格式，那么在序列化的时候会对这些值进行对应的特殊处理，使其符合规范。在前端向后端发送数据时，可以调用这个函数将数据对象转化为 JSON 格式的字符串。
- JSON.parse() 函数，这个函数用来将 JSON 格式的字符串转换为一个 js 数据结构，如果传入的字符串不是标准的 JSON 格式的字符串的话，将会抛出错误。当从后端接收到 JSON 格式的字符串时，可以通过这个方法来将其解析为一个 js 数据结构，以此来进行数据的访问。

### JavaScript脚本延迟加载的方式
延迟加载就是等页面加载完成之后再加载 JavaScript 文件。 js 延迟加载有助于提高页面加载速度。

一般有以下几种方式：
- defer 属性： 给 js 脚本添加 defer 属性，这个属性会让脚本的加载与文档的解析同步解析，然后在文档解析完成后再执行这个脚本文件，这样的话就能使页面的渲染不被阻塞。多个设置了 defer 属性的脚本按规范来说最后是顺序执行的，但是在一些浏览器中可能不是这样。
- async 属性： 给 js 脚本添加 async 属性，这个属性会使脚本异步加载，不会阻塞页面的解析过程，但是当脚本加载完成后立即执行 js 脚本，这个时候如果文档没有解析完成的话同样会阻塞。多个 async 属性的脚本的执行顺序是不可预测的，一般不会按照代码的顺序依次执行。
- 动态创建 DOM 方式： 动态创建 DOM 标签的方式，可以对文档的加载事件进行监听，当文档加载完成后再动态的创建 script 标签来引入 js 脚本。
- 使用 setTimeout 延迟方法： 设置一个定时器来延迟加载js脚本文件
- 让 JS 最后加载： 将 js 脚本放在文档的底部，来使 js 脚本尽可能的在最后来加载执行。

### 为什么函数的 arguments 参数是类数组而不是数组？如何遍历类数组?
arguments是一个对象，它的属性是从 0 开始依次递增的数字，还有callee和length等属性，与数组相似；但是它却没有数组常见的方法属性，如forEach, reduce等，所以叫它们类数组。

要遍历类数组，有三个方法：
1. 将数组的方法应用到类数组上，这时候就可以使用call和apply方法，如：
```js
function foo(){ 
  Array.prototype.forEach.call(arguments, a => console.log(a))
}
```
2. 使用Array.from方法将类数组转化成数组：‌
```js
function foo(){ 
  const arrArgs = Array.from(arguments) 
  arrArgs.forEach(a => console.log(a))
}
```
3. 使用展开运算符将类数组转化成数组
```js
function foo(){ 
    const arrArgs = [...arguments] 
    arrArgs.forEach(a => console.log(a)) 
}
```

### DOM 和 BOM
- DOM 指的是文档对象模型，它指的是把文档当做一个对象，这个对象主要定义了处理网页内容的方法和接口。
- BOM 指的是浏览器对象模型，它指的是把浏览器当做一个对象来对待，这个对象主要定义了与浏览器进行交互的法和接口。BOM的核心是 window，而 window 对象具有双重角色，它既是通过 js 访问浏览器窗口的一个接口，又是一个 Global（全局）对象。这意味着在网页中定义的任何对象，变量和函数，都作为全局对象的一个属性或者方法存在。window 对象含有 location 对象、navigator 对象、screen 对象等子对象，并且 DOM 的最根本的对象 document 对象也是 BOM 的 window 对象的子对象。

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
- `flat(depth)`：将嵌套的数组展开为一维数组，并返回一个新数组。
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
- 通过apply调用数组的concat方法来实现转换：
```js
Array.prototype.concat.apply([], arrayLike)
```
- 通过Array.from()方法来实现转换：
```js
Array.from(arrayLike)
```

### escape、encodeURI、encodeURIComponent的区别
- encodeURI 是对整个 URI 进行转义，将 URI 中的非法字符转换为合法字符，所以对于一些在 URI 中有特殊意义的字符不会进行转义。
- encodeURIComponent 是对 URI 的组成部分进行转义，所以一些特殊字符也会得到转义。
- escape 和 encodeURI 的作用相同，不过它们对于 unicode 编码为 0xff 之外字符的时候会有区别，escape 是直接在字符的 unicode 编码前加上 %u，而 encodeURI 首先会将字符转换为 UTF-8 的格式，再在每个字节前加上 %。

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
- 本身是针对MVC编程，不符合前端MVVM的开发模式。
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
![原型链](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/原型链.png)

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

### 对象继承的方式
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
- 引用计数使用相对较少。引用计数就是跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型赋值给该变量时，则这个值的引用次数就是1。相反如果包含这个值引用的变量又取得了另外一个值，则这个值的引用次数减1。当这个引用次数变为0时，说明这个变量已经没有价值，因此在垃圾回收机制下次再运行时，这个变量所占用的内存就会被释放出来。
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

# 阮一峰JS教程
## 变量提升
JavaScript 引擎的工作方式是，先解析代码，获取所有被声明的变量，然后再一行一行地运行。这造成的结果，就是所有的变量的声明语句，都会被提升到代码的头部，这就叫做变量提升（hoisting）。
```js
console.log(a);  // undefined
var a = 1;
```

## 数据类型
JavaScript 的数据类型，共有八种。ES6新增了 Symbol 和 BigInt 数据类型：
- 数值（number）：整数和小数（比如1和3.14）。
- 字符串（string）：文本（比如Hello World）。
- 布尔值（boolean）：表示真伪的两个特殊值，即true（真）和false（假）。
- undefined：表示“未定义”或不存在，即由于目前没有定义，所以此处暂时没有任何值。
- null：表示空值，即此处的值为空。
- 对象（object）：各种值组成的集合。
- Symbol：表示唯一的标识符。
- BigInt：表示大整数。

数值、字符串、布尔值这三种类型，合称为原始类型（primitive type）的值，即它们是最基本的数据类型，不能再细分了。对象则称为合成类型（complex type）的值，因为一个对象往往是多个原始类型的值的合成，可以看作是一个存放各种值的容器。至于undefined和null，一般将它们看成两个特殊值。

对象是最复杂的数据类型，又可以分成三个子类型。
- 狭义的对象（object）
- 数组（array）
- 函数（function）

### 类型判断
JavaScript 有三种方法，可以确定一个值到底是什么类型。
- typeof运算符
- instanceof运算符
- Object.prototype.toString方法

#### typeof运算符
```js
typeof 123 // "number"
typeof '123' // "string"
typeof false // "boolean"

function f() {}
typeof f // "function"

typeof undefined // "undefined"

v
typeof v // "undefined"

typeof window // "object"
typeof {} // "object"
typeof [] // "object"

typeof null // "object"
```

### 布尔值
如果 JavaScript 预期某个位置应该是布尔值，会将该位置上现有的值自动转为布尔值。转换规则是除了下面六个值被转为false，其他值都视为true。
- undefined
- null
- false
- 0
- NaN
- ""或''（空字符串）

空数组（[]）和空对象（{}）对应的布尔值，都是true。
```ts
if ([]) {
  console.log('true');
}
// true

if ({}) {
  console.log('true');
}
// true
```

### NaN
NaN是 JavaScript 的特殊值，表示“非数字”（Not a Number），主要出现在将字符串解析成数字出错的场合。

0除以0也会得到NaN。

需要注意的是，NaN不是独立的数据类型，而是一个特殊数值，它的数据类型依然属于Number，使用typeof运算符可以看得很清楚。
```js
typeof NaN // 'number'
```

#### 运算规则
NaN不等于任何值，包括它本身。
```js
NaN === NaN // false
```
数组的indexOf方法内部使用的是严格相等运算符，所以该方法对NaN不成立。
```js
[NaN].indexOf(NaN) // -1
```
NaN在布尔运算时被当作false。
```js
Boolean(NaN) // false
```
NaN与任何数（包括它自己）的运算，得到的都是NaN。
```js
NaN + 32 // NaN
NaN - 32 // NaN
NaN * 32 // NaN
NaN / 32 // NaN
```
但是，ES6 引入指数运算符（**）后，出现了一个例外。
```js
NaN ** 0 // 1
```

### Infinity
Infinity与NaN比较，总是返回false。
```js
Infinity > NaN // false
-Infinity > NaN // false
Infinity < NaN // false
-Infinity < NaN // false
```
0乘以Infinity，返回NaN；0除以Infinity，返回0；Infinity除以0，返回Infinity。
```js
0 * Infinity // NaN
0 / Infinity // 0
Infinity / 0 // Infinity
```
Infinity加上或乘以Infinity，返回的还是Infinity。Infinity减去或除以Infinity，得到NaN。
```js
Infinity + Infinity // Infinity
Infinity * Infinity // Infinity
Infinity - Infinity // NaN
Infinity / Infinity // NaN
```
Infinity与null计算时，null会转成0，等同于与0的计算。
```js
null * Infinity // NaN
null / Infinity // 0
Infinity / null // Infinity
```
Infinity与undefined计算，返回的都是NaN。
```js
undefined + Infinity // NaN
undefined - Infinity // NaN
undefined * Infinity // NaN
undefined / Infinity // NaN
Infinity / undefined // NaN
```

### parseInt()
#### 基本用法
- parseInt方法用于将字符串转为整数。
- 如果字符串头部有空格，空格会被自动去除。
- 如果parseInt的参数不是字符串，则会先转为字符串再转换。
- 字符串转为整数的时候，是一个个字符依次转换，如果遇到不能转为数字的字符，就不再进行下去，返回已经转好的部分。
```js
parseInt('123') // 123
parseInt('   81') // 81

parseInt(1.23) // 1
// 等同于
parseInt('1.23') // 1

parseInt('8a') // 8
parseInt('12**') // 12
parseInt('12.34') // 12
parseInt('15e2') // 15
parseInt('15px') // 15
```
如果字符串的第一个字符不能转化为数字（后面跟着数字的正负号除外），返回NaN。
```js
parseInt('abc') // NaN
parseInt('.3') // NaN
parseInt('') // NaN
parseInt('+') // NaN
parseInt('+1') // 1
```
如果字符串以0x或0X开头，parseInt会将其按照十六进制数解析。如果字符串以0开头，将其按照10进制解析。
```js
parseInt('0x10') // 16
parseInt('011') // 11
```
对于那些会自动转为科学计数法的数字，parseInt会将科学计数法的表示方法视为字符串，因此导致一些奇怪的结果。
```js
parseInt(1000000000000000000000.5) // 1
// 等同于
parseInt('1e+21') // 1

parseInt(0.0000008) // 8
// 等同于
parseInt('8e-7') // 8
```

#### 进制转换
parseInt方法还可以接受第二个参数（2到36之间），表示被解析的值的进制，返回该值对应的十进制数。默认情况下，parseInt的第二个参数为10，即默认是十进制转十进制。
```js
parseInt('1000') // 1000
// 等同于
parseInt('1000', 10) // 1000

parseInt('1000', 2) // 8
parseInt('1000', 6) // 216
parseInt('1000', 8) // 512
```
如果第二个参数不是数值，会被自动转为一个整数。这个整数只有在2到36之间，才能得到有意义的结果，超出这个范围，则返回NaN。如果第二个参数是0、undefined和null，则直接忽略。
```js
parseInt('10', 37) // NaN
parseInt('10', 1) // NaN
parseInt('10', 0) // 10
parseInt('10', null) // 10
parseInt('10', undefined) // 10
```
如果字符串包含对于指定进制无意义的字符，则从最高位开始，只返回可以转换的数值。如果最高位无法转换，则直接返回NaN。
```js
parseInt('1546', 2) // 1
parseInt('546', 2) // NaN
```
如果parseInt的第一个参数不是字符串，会被先转为字符串。这会导致一些令人意外的结果。
```js
parseInt(0x11, 36) // 43
parseInt(0x11, 2) // 1

// 等同于
parseInt(String(0x11), 36)
parseInt(String(0x11), 2)

// 等同于
parseInt('17', 36)
parseInt('17', 2)
```

### parseFloat()
- parseFloat方法用于将一个字符串转为浮点数。
- 如果字符串符合科学计数法，则会进行相应的转换。
- 如果字符串包含不能转为浮点数的字符，则不再进行往后转换，返回已经转好的部分。
- parseFloat方法会自动过滤字符串前导的空格。如果参数不是字符串，则会先转为字符串再转换。
- 如果字符串的第一个字符不能转化为浮点数，则返回NaN。
```js
parseFloat('3.14') // 3.14
parseFloat('314e-2') // 3.14
parseFloat('0.0314E+2') // 3.14
parseFloat('3.14more non-digit characters') // 3.14
parseFloat('\t\v\r12.34\n ') // 12.34

parseFloat([1.23]) // 1.23
// 等同于
parseFloat(String([1.23])) // 1.23

parseFloat([]) // NaN
parseFloat('FF2') // NaN
parseFloat('') // NaN
```
这些特点使得parseFloat的转换结果不同于Number函数。
```js
parseFloat(true)  // NaN
Number(true) // 1

parseFloat(null) // NaN
Number(null) // 0

parseFloat('') // NaN
Number('') // 0

parseFloat('123.45#') // 123.45
Number('123.45#') // NaN
```

### isNaN()
- isNaN方法可以用来判断一个值是否为NaN。
- isNaN只对数值有效，如果传入其他值，会被先转成数值。
- 传入字符串的时候，字符串会被先转成NaN，所以最后返回true。也就是说，isNaN为true的值，有可能不是NaN，而是一个字符串。
- 出于同样的原因，对于对象和数组，isNaN也返回true。
- 但是，对于空数组和只有一个数值成员的数组，isNaN返回false。
```js
isNaN(NaN) // true
isNaN(123) // false

isNaN('Hello') // true
// 相当于
isNaN(Number('Hello')) // true

isNaN({}) // true
// 等同于
isNaN(Number({})) // true

isNaN(['xzy']) // true
// 等同于
isNaN(Number(['xzy'])) // true

isNaN([]) // false
isNaN([123]) // false
isNaN(['123']) // false
```
因此，使用isNaN之前，最好判断一下数据类型。
```js
function myIsNaN(value) {
  return typeof value === 'number' && isNaN(value);
}
```
判断NaN更可靠的方法是，利用NaN为唯一不等于自身的值的这个特点，进行判断。
```js
function myIsNaN(value) {
  return value !== value;
}
```

### isFinite()
isFinite方法返回一个布尔值，表示某个值是否为正常的数值。除了Infinity、-Infinity、NaN和undefined这几个值会返回false，isFinite对于其他的数值都会返回true。
```js
isFinite(Infinity) // false
isFinite(-Infinity) // false
isFinite(NaN) // false
isFinite(undefined) // false
isFinite(null) // true
isFinite(-1) // true
```

### 对象
对象属性可以动态创建，不必在对象声明时就指定。
```js
var obj = {};
obj.foo = 123;
obj.foo // 123
```

#### 对象的引用
如果不同的变量名指向同一个对象，那么它们都是这个对象的引用，也就是说指向同一个内存地址。修改其中一个变量，会影响到其他所有变量。
```js
var o1 = {};
var o2 = o1;

o1.a = 1;
o2.a // 1

o2.b = 2;
o1.b // 2
```
此时，如果取消某一个变量对于原对象的引用，不会影响到另一个变量。
```js
var o1 = {};
var o2 = o1;

o1 = 1;
o2 // {}
```

#### 属性查看
可以使用Object.keys方法。
```js
var obj = {
  key1: 1,
  key2: 2
};

Object.keys(obj);
// ['key1', 'key2']
```

#### delete命令
delete命令用于删除对象的属性，删除成功后返回true。删除一个不存在的属性，delete不报错，而且返回true。只有一种情况，delete命令会返回false，那就是该属性存在，且不得删除。delete命令只能删除对象本身的属性，无法删除继承的属性。
```js
var obj = { p: 1 };
Object.keys(obj) // ["p"]

delete obj.p // true
obj.p // undefined
Object.keys(obj) // []

var obj = {};
delete obj.p // true

var obj = Object.defineProperty({}, 'p', {
  value: 123,
  configurable: false
});

obj.p // 123
delete obj.p // false

var obj = {};
delete obj.toString // true
obj.toString // function toString() { [native code] }
```

#### in运算符
in运算符用于检查对象是否包含某个属性（注意，检查的是键名，不是键值），如果包含就返回true，否则返回false。它的左边是一个字符串，表示属性名，右边是一个对象。in运算符的一个问题是，它不能识别哪些属性是对象自身的，哪些属性是继承的。就像上面代码中，对象obj本身并没有toString属性，但是in运算符会返回true，因为这个属性是继承的。这时，可以使用对象的hasOwnProperty方法判断一下，是否为对象自身的属性。
```js
var obj = { p: 1 };
'p' in obj // true
'toString' in obj // true

var obj = {};
if ('toString' in obj) {
  console.log(obj.hasOwnProperty('toString')) // false
}
```

#### for in循环
for in用来遍历一个对象的全部属性。有两个注意点：
- 它遍历的是对象所有可遍历（enumerable）的属性，会跳过不可遍历的属性。
- 它不仅遍历对象自身的属性，还遍历继承的属性。

如果继承的属性是可遍历的，那么就会被for...in循环遍历到。但是，一般情况下，都是只想遍历对象自身的属性，所以使用for...in的时候，应该结合使用hasOwnProperty方法，在循环内部判断一下，某个属性是否为对象自身的属性。
```js
var person = { name: '老张' };

for (var key in person) {
  if (person.hasOwnProperty(key)) {
    console.log(key);
  }
}
// name
```

### 函数
#### 函数表达式
除了用function命令声明函数，还可以采用变量赋值的写法。
```js
var print = function(s) {
  console.log(s);
};
```
这种写法将一个匿名函数赋值给变量。这时，这个匿名函数又称函数表达式（Function Expression），因为赋值语句的等号右侧只能放表达式。采用函数表达式声明函数时，function命令后面不带有函数名。如果加上函数名，该函数名只在函数体内部有效，在函数体外部无效。这种写法的用处有两个，一是可以在函数体内部调用自身，二是方便除错。
```js
var print = function x(){
  console.log(typeof x);
};

x
// ReferenceError: x is not defined

print()
// function
```

#### 函数作用域
函数本身也是一个值，也有自己的作用域。它的作用域与变量一样，就是其声明时所在的作用域，与其运行时所在的作用域无关。
```js
var a = 1;
var x = function () {
  console.log(a);
};

function f() {
  var a = 2;
  x();
}

f() // 1
```
```js
var x = function () {
  console.log(a);
};

function y(f) {
  var a = 2;
  f();
}

y(x)
// ReferenceError: a is not defined
```
函数体内部声明的函数，作用域绑定函数体内部。
```js
function foo() {
  var x = 1;
  function bar() {
    console.log(x);
  }
  return bar;
}

var x = 2;
var f = foo();
f() // 1
```

#### arguments对象
由于 JavaScript 允许函数有不定数目的参数，所以需要一种机制，可以在函数体内部读取所有参数。这就是arguments对象的由来。arguments对象包含了函数运行时的所有参数，arguments[0]就是第一个参数，arguments[1]就是第二个参数，以此类推。这个对象只有在函数体内部，才可以使用。
```js
var f = function (one) {
  console.log(arguments[0]);
  console.log(arguments[1]);
  console.log(arguments[2]);
}

f(1, 2, 3)
// 1
// 2
// 3
```
正常模式下，arguments对象可以在运行时修改。
```js
var f = function(a, b) {
  arguments[0] = 3;
  arguments[1] = 2;
  return a + b;
}

f(1, 1) // 5
```
严格模式下，arguments对象与函数参数不具有联动关系。也就是说，修改arguments对象不会影响到实际的函数参数。
```js
var f = function(a, b) {
  'use strict'; // 开启严格模式
  arguments[0] = 3;
  arguments[1] = 2;
  return a + b;
}

f(1, 1) // 2
```

虽然arguments很像数组，但它是一个对象。数组专有的方法（比如slice和forEach），不能在arguments对象上直接使用。如果要让arguments对象使用数组方法，真正的解决方法是将arguments转为真正的数组。
```js
var args = Array.prototype.slice.call(arguments);

// 或者
var args = [];
for (var i = 0; i < arguments.length; i++) {
  args.push(arguments[i]);
}
```

arguments对象带有一个callee属性，返回它所对应的原函数。
```js
var f = function () {
  console.log(arguments.callee === f);
}

f() // true
```

#### 闭包
正常情况下，函数外部无法读取函数内部声明的变量。如果出于种种原因，需要得到函数内的局部变量。正常情况下，这是办不到的，只有通过变通方法才能实现。那就是在函数的内部，再定义一个函数。
```js
function f1() {
  var n = 999;
  function f2() {
　　console.log(n); // 999
  }
}
```
既然f2可以读取f1的局部变量，那么只要把f2作为返回值，就可以在f1外部读取它的内部变量了！闭包就是函数f2，即能够读取其他函数内部变量的函数。由于在 JavaScript 语言中，只有函数内部的子函数才能读取内部变量，因此可以把闭包简单理解成“定义在一个函数内部的函数”。
```js
function f1() {
  var n = 999;
  function f2() {
    console.log(n);
  }
  return f2;
}

var result = f1();
result(); // 999
```
闭包的最大用处有两个，一个是可以读取外层函数内部的变量，另一个就是让这些变量始终保持在内存中，即闭包可以使得它诞生环境一直存在。
```js
function createIncrementor(start) {
  return function () {
    return start++;
  };
}

var inc = createIncrementor(5);

inc() // 5
inc() // 6
inc() // 7
```

闭包的另一个用处，是封装对象的私有属性和私有方法。
```js
function Person(name) {
  var _age;
  function setAge(n) {
    _age = n;
  }
  function getAge() {
    return _age;
  }

  return {
    name: name,
    getAge: getAge,
    setAge: setAge
  };
}

var p1 = Person('张三');
p1.setAge(25);
p1.getAge() // 25
```
注意，外层函数每次运行，都会生成一个新的闭包，而这个闭包又会保留外层函数的内部变量，所以内存消耗很大。因此不能滥用闭包，否则会造成网页的性能问题。

#### 立即调用的函数表达式（IIFE）
function这个关键字既可以当作语句，也可以当作表达式。当作表达式时，函数可以定义后直接加圆括号调用。
```js
var f = function f(){ return 1}();
f // 1
```
为了避免解析的歧义，JavaScript 规定，如果function关键字出现在行首，一律解释成语句。因此，引擎看到行首是function关键字之后，认为这一段都是函数的定义，不应该以圆括号结尾，所以就报错。函数定义后立即调用的解决方法，就是不要让function出现在行首，让引擎将其理解成一个表达式。最简单的处理，就是将其放在一个圆括号里面。
```js
(function(){ /* code */ }());
// 或者
(function(){ /* code */ })();
```
注意，上面两种写法最后的分号都是必须的。通常情况下，只对匿名函数使用这种“立即执行的函数表达式”。它的目的有两个：一是不必为函数命名，避免了污染全局变量；二是 IIFE 内部形成了一个单独的作用域，可以封装一些外部无法读取的私有变量。

### 数组
length属性是可写的。如果人为设置一个小于当前成员个数的值，该数组的成员数量会自动减少到length设置的值。清空数组的一个有效方法，就是将length属性设为0。
```js
var arr = [ 'a', 'b', 'c' ];
arr.length // 3

arr.length = 2;
arr // ["a", "b"]
```

#### 数组的空位
使用delete命令删除一个数组成员，会形成空位，并且不会影响length属性。
```js
var a = [1, 2, 3];
delete a[1];

a[1] // undefined
a.length // 3
```

数组的某个位置是空位，与某个位置是undefined，是不一样的。如果是空位，使用数组的forEach方法、for...in结构、以及Object.keys方法进行遍历，空位都会被跳过。如果某个位置是undefined，遍历的时候就不会被跳过。
```js
var a = [, , ,];
a.forEach(function (x, i) {
  console.log(i + '. ' + x);
})
// 不产生任何输出
for (var i in a) {
  console.log(i);
}
// 不产生任何输出
Object.keys(a)  // []


var a = [undefined, undefined, undefined];
a.forEach(function (x, i) {
  console.log(i + '. ' + x);
});
// 0. undefined
// 1. undefined
// 2. undefined
for (var i in a) {
  console.log(i);
}
// 0
// 1
// 2
Object.keys(a)  // ['0', '1', '2']
```

#### 类数组对象
典型的“类似数组的对象”是函数的arguments对象，以及大多数 DOM 元素集，还有字符串。
```js
// arguments对象
function args() { return arguments }
var arrayLike = args('a', 'b');

arrayLike[0] // 'a'
arrayLike.length // 2
arrayLike instanceof Array // false

// DOM元素集
var elts = document.getElementsByTagName('h3');
elts.length // 3
elts instanceof Array // false

// 字符串
'abc'[1] // 'b'
'abc'.length // 3
'abc' instanceof Array // false
```
数组的slice方法可以将“类似数组的对象”变成真正的数组。
```js
var arr = Array.prototype.slice.call(arrayLike);
```
除了转为真正的数组，“类似数组的对象”还有一个办法可以使用数组的方法，就是通过call()把数组的方法放到对象上面。
```js
function print(value, index) {
  console.log(index + ' : ' + value);
}
Array.prototype.forEach.call(arrayLike, print);
```

## 运算符
### 算术运算符
#### 加法
加法运算符是在运行时决定，到底是执行相加，还是执行连接。也就是说，运算子的不同，导致了不同的语法行为，这种现象称为“重载”（overload）。由于加法运算符存在重载，可能执行两种运算，使用的时候必须很小心。除了加法运算符，其他算术运算符（比如减法、除法和乘法）都不会发生重载。它们的规则是：所有运算子一律转为数值，再进行相应的数学运算。
```js
'3' + 4 + 5 // "345"
3 + 4 + '5' // "75"

1 - '2' // -1
1 * '2' // 2
1 / '2' // 0.5
```

如果运算子是对象，必须先转成原始类型的值，然后再相加。首先，自动调用对象的valueOf方法。一般来说，对象的valueOf方法总是返回对象自身，这时再自动调用对象的toString方法，将其转为字符串。
```js
var obj = { p: 1 };
obj.valueOf().toString() // "[object Object]"
obj + 2 // "[object Object]2"
```
知道了这个规则以后，就可以自己定义valueOf方法或toString方法，得到想要的结果。
```js
var obj = {
  valueOf: function () {
    return 1;
  }
};
// 由于valueOf方法直接返回一个原始类型的值，所以不再调用toString方法。
obj + 2 // 3    

var obj = {
  toString: function () {
    return 'hello';
  }
};
obj + 2 // "hello2"
```

### 比较运算符
#### 非相等：字符串比较
如果两个运算子都是原始类型的值，则是先转成数值再比较。
```js
5 > '4' // true
// 等同于 5 > Number('4')
// 即 5 > 4

true > false // true
// 等同于 Number(true) > Number(false)
// 即 1 > 0

2 > true // true
// 等同于 2 > Number(true)
// 即 2 > 1
```

如果运算子是对象，会转为原始类型的值，再进行比较。对象转换成原始类型的值，算法是先调用valueOf方法；如果返回的还是对象，再接着调用toString方法。
```js
var x = [2];
x > '11' // true
// 等同于 [2].valueOf().toString() > '11'
// 即 '2' > '11'

x.valueOf = function () { return '1' };
x > '11' // false
// 等同于 (function () { return '1' })() > '11'
// 即 '1' > '11'
```
两个对象之间的比较也是如此。
```js
[2] > [1] // true
// 等同于 [2].valueOf().toString() > [1].valueOf().toString()
// 即 '2' > '1'

[2] > [11] // true
// 等同于 [2].valueOf().toString() > [11].valueOf().toString()
// 即 '2' > '11'

({ x: 2 }) >= ({ x: 1 }) // true
// 等同于 ({ x: 2 }).valueOf().toString() >= ({ x: 1 }).valueOf().toString()
// 即 '[object Object]' >= '[object Object]'
```

#### 严格相等运算符
两个复合类型（对象、数组、函数）的数据比较时，不是比较它们的值是否相等，而是比较它们是否指向同一个地址。
```js
{} === {} // false
[] === [] // false
(function () {} === function () {}) // false
```
注意，对于两个对象的比较，严格相等运算符比较的是地址，而大于或小于运算符比较的是值。
```js
var obj1 = {};
var obj2 = {};

obj1 > obj2 // false
obj1 < obj2 // false
obj1 === obj2 // false
```

### 二进制位运算符
二进制位运算符用于直接对二进制位进行计算，一共有7个。
- 二进制或运算符（or）：符号为|，表示若两个二进制位都为0，则结果为0，否则为1。
- 二进制与运算符（and）：符号为&，表示若两个二进制位都为1，则结果为1，否则为0。
- 二进制否运算符（not）：符号为~，表示对一个二进制位取反。
- 异或运算符（xor）：符号为^，表示若两个二进制位不相同，则结果为1，否则为0。
- 左移运算符（left shift）：符号为`<<`，尾部补0。
- 右移运算符（right shift）：符号为`>>` ，头部补0。
- 头部补零的右移运算符（zero filled right shift）：符号为`>>>`。

## 语法专题
### 数据类型转换
#### Number()
原始类型值的转换规则如下。
```js
// 数值：转换后还是原来的值
Number(324) // 324

// 字符串：如果可以被解析为数值，则转换为相应的数值
Number('324') // 324

// 字符串：如果不可以被解析为数值，返回 NaN
Number('324abc') // NaN

// 空字符串转为0
Number('') // 0

// 布尔值：true 转成 1，false 转成 0
Number(true) // 1
Number(false) // 0

// undefined：转成 NaN
Number(undefined) // NaN

// null：转成0
Number(null) // 0
```
Number函数将字符串转为数值，要比parseInt函数严格很多。基本上，只要有一个字符无法转成数值，整个字符串就会被转为NaN。
```js
parseInt('42 cats') // 42
Number('42 cats') // NaN
```
parseInt和Number函数都会自动过滤一个字符串前导和后缀的空格。
```js
parseInt('\t\v\r12.34\n') // 12
Number('\t\v\r12.34\n') // 12.34
```

Number方法的参数是对象时，将返回NaN，除非是包含单个数值的数组。之所以会这样，是因为Number背后的转换规则比较复杂。
1. 调用对象自身的valueOf方法。如果返回原始类型的值，则直接对该值使用Number函数，不再进行后续步骤。
2. 如果valueOf方法返回的还是对象，则改为调用对象自身的toString方法。如果toString方法返回原始类型的值，则对该值使用Number函数，不再进行后续步骤。
3. 如果toString方法返回的是对象，就报错。
```js
var obj = {x: 1};
Number(obj) // NaN

// 等同于
if (typeof obj.valueOf() === 'object') {
  Number(obj.toString());
} else {
  Number(obj.valueOf());
}
```

#### String()
String方法的参数如果是对象，返回一个类型字符串；如果是数组，返回该数组的字符串形式。String方法背后的转换规则，与Number方法基本相同，只是互换了valueOf方法和toString方法的执行顺序。
1. 先调用对象自身的toString方法。如果返回原始类型的值，则对该值使用String函数，不再进行以下步骤。
2. 如果toString方法返回的是对象，再调用原对象的valueOf方法。如果valueOf方法返回原始类型的值，则对该值使用String函数，不再进行以下步骤。
3. 如果valueOf方法返回的是对象，就报错。
```js
String({a: 1})
// "[object Object]"

// 等同于
String({a: 1}.toString())
// "[object Object]"
```

#### Boolean()
Boolean()函数的转换规则相对简单：除了以下五个值的转换结果为false，其他的值全部为true。
- undefined
- null
- 0（包含-0和+0）
- NaN
- ''（空字符串）

所有对象（包括空对象）的转换结果都是true，甚至连false对应的布尔对象new Boolean(false)也是true
```js
Boolean({}) // true
Boolean([]) // true
Boolean(new Boolean(false)) // true
```

## 标准库
### Object对象
#### Object的静态方法
##### Object.keys()与Object.getOwnPropertyNames()
Object.keys()方法返回一个数组，包含对象自身的所有可遍历（enumerable）的属性名。Object.getOwnPropertyNames()方法返回一个数组，包含对象自身的所有属性名（不管是否可遍历）。这两个方法都不会返回继承的属性。接收的参数都是一个对象。
```js
var a = ['Hello', 'World'];

Object.keys(a) // ["0", "1"]
Object.getOwnPropertyNames(a) // ["0", "1", "length"]
```
一般情况下，几乎总是使用Object.keys方法，遍历对象的属性。

##### 对象属性模型的相关方法
- Object.getOwnPropertyDescriptor()：获取某个属性的描述对象。
- Object.defineProperty()：通过描述对象，定义某个属性。
- Object.defineProperties()：通过描述对象，定义多个属性。

##### 控制对象状态的方法
- Object.preventExtensions()：防止对象扩展。
- Object.isExtensible()：判断对象是否可扩展。
- Object.seal()：禁止对象配置。
- Object.isSealed()：判断一个对象是否可配置。
- Object.freeze()：冻结一个对象。
- Object.isFrozen()：判断一个对象是否被冻结。

##### 原型链相关方法
- Object.create()：该方法可以指定原型对象和属性，返回一个新的对象。
- Object.getPrototypeOf()：获取对象的Prototype对象。

#### Object的实例方法
除了静态方法，还有不少方法定义在Object.prototype对象。它们称为实例方法，所有Object的实例对象都继承了这些方法。Object实例对象的方法，主要有以下六个。
- Object.prototype.valueOf()：返回当前对象对应的值。
- Object.prototype.toString()：返回当前对象对应的字符串形式。
- Object.prototype.toLocaleString()：返回当前对象对应的本地字符串形式。
- Object.prototype.hasOwnProperty()：判断某个属性是否为当前对象自身的属性，还是继承自原型对象的属性。
- Object.prototype.isPrototypeOf()：判断当前对象是否为另一个对象的原型。
- Object.prototype.propertyIsEnumerable()：判断某个属性是否可枚举。

##### Object.prototype.valueOf()
valueOf方法的作用是返回一个对象的“值”，默认情况下返回对象本身。
```js
var obj = new Object();
obj.valueOf() === obj // true
```
valueOf方法的主要用途是，JavaScript 自动类型转换时会默认调用这个方法。所以可以通过自定义valueOf方法，来改变对象的默认行为。
```js
var obj = new Object();
obj.valueOf = function () {
  return 2;
};

1 + obj // 3
```

##### Object.prototype.toString()
toString方法的作用是返回一个对象的字符串形式，默认情况下返回类型字符串。字符串[object Object]本身没有太大的用处，但是通过自定义toString方法，可以让对象在自动类型转换时，得到想要的字符串形式。
```js
var o1 = new Object();
o1.toString() // "[object Object]"

var o2 = {a:1};
o2.toString() // "[object Object]"

var obj = new Object();
obj.toString = function () {
  return 'hello';
};
obj + ' ' + 'world' // "hello world"
```
数组、字符串、函数、Date 对象都分别部署了自定义的toString方法，覆盖了Object.prototype.toString方法。
```js
[1, 2, 3].toString() // "1,2,3"

'123'.toString() // "123"

(function () {
  return 123;
}).toString()
// "function () {
//   return 123;
// }"

(new Date()).toString()
// "Tue May 10 2016 09:11:31 GMT+0800 (CST)"
```

##### 应用toString()来判断数据类型
Object.prototype.toString方法返回对象的类型字符串，因此可以用来判断一个值的类型。
```js
var obj = {};
obj.toString() // "[object Object]"
```
上面代码调用空对象的toString方法，结果返回一个字符串[object Object]，其中第二个Object表示该值的构造函数。这是一个十分有用的判断数据类型的方法。

由于实例对象可能会自定义toString方法，覆盖掉Object.prototype.toString方法，所以为了得到类型字符串，最好直接使用Object.prototype.toString方法。通过函数的call方法，可以在任意值上调用这个方法，帮助我们判断这个值的类型。
```js
Object.prototype.toString.call(value)
```
不同数据类型的Object.prototype.toString方法返回值如下。
- 数值：返回[object Number]。
- 字符串：返回[object String]。
- 布尔值：返回[object Boolean]。
- undefined：返回[object Undefined]。
- null：返回[object Null]。
- 数组：返回[object Array]。
- arguments 对象：返回[object Arguments]。
- 函数：返回[object Function]。
- Error 对象：返回[object Error]。
- Date 对象：返回[object Date]。
- RegExp 对象：返回[object RegExp]。
- 其他对象：返回[object Object]。

利用这个特性，可以写出一个比typeof运算符更准确的类型判断函数。
```js
var type = function (o){
  var s = Object.prototype.toString.call(o);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

type({}); // "object"
type([]); // "array"
type(5); // "number"
type(null); // "null"
type(); // "undefined"
type(/abcd/); // "regex"
type(new Date()); // "date"
```
在上面这个type函数的基础上，还可以加上专门判断某种类型数据的方法。
```js
var type = function (o){
  var s = Object.prototype.toString.call(o);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

['Null',
 'Undefined',
 'Object',
 'Array',
 'String',
 'Number',
 'Boolean',
 'Function',
 'RegExp'
].forEach(function (t) {
  type['is' + t] = function (o) {
    return type(o) === t.toLowerCase();
  };
});

type.isObject({}) // true
type.isNumber(NaN) // true
type.isRegExp(/abc/) // true
```

##### Object.hasOwnProperty()
Object.prototype.hasOwnProperty方法接受一个字符串作为参数，返回一个布尔值，表示该实例对象自身是否具有该属性。
```js
var obj = {
  p: 123
};

obj.hasOwnProperty('p') // true
obj.hasOwnProperty('toString') // false
```

### 属性描述对象
JavaScript 提供了一个内部数据结构，用来描述对象的属性，控制它的行为，比如该属性是否可写、可遍历等等。这个内部数据结构称为“属性描述对象”（attributes object）。每个属性都有自己对应的属性描述对象，保存该属性的一些元信息。
```js
{
  value: 123,
  writable: false,
  enumerable: true,
  configurable: false,
  get: undefined,
  set: undefined
}
```
- value是该属性的属性值，默认为undefined。
- writable是一个布尔值，表示属性值（value）是否可改变（即是否可写），默认为true。
- enumerable是一个布尔值，表示该属性是否可遍历，默认为true。如果设为false，会使得某些操作（比如for...in循环、Object.keys()）跳过该属性。
- configurable是一个布尔值，表示属性的可配置性，默认为true。如果设为false，将阻止某些操作改写属性描述对象，比如无法删除该属性，也不得改变各种元属性（value属性除外）。也就是说，configurable属性控制了属性描述对象的可写性。
- get是一个函数，表示该属性的取值函数（getter），默认为undefined。
- set是一个函数，表示该属性的存值函数（setter），默认为undefined。

#### Object.getOwnPropertyDescriptor()
Object.getOwnPropertyDescriptor()方法可以获取属性描述对象。它的第一个参数是目标对象，第二个参数是一个字符串，对应目标对象的某个属性名。注意，Object.getOwnPropertyDescriptor()方法只能用于对象自身的属性，不能用于继承的属性。
```js
var obj = { p: 'a' };

Object.getOwnPropertyDescriptor(obj, 'p')
// Object { value: "a",
//   writable: true,
//   enumerable: true,
//   configurable: true
// }
Object.getOwnPropertyDescriptor(obj, 'toString')
// undefined
```

#### Object.getOwnPropertyNames()
Object.getOwnPropertyNames方法返回一个数组，成员是参数对象自身的全部属性的属性名，不管该属性是否可遍历。这跟Object.keys的行为不同，Object.keys只返回对象自身的可遍历属性的全部属性名。
```js
Object.keys([]) // []
Object.getOwnPropertyNames([]) // [ 'length' ]

Object.keys(Object.prototype) // []
Object.getOwnPropertyNames(Object.prototype)
// ['hasOwnProperty',
//  'valueOf',
//  'constructor',
//  'toLocaleString',
//  'isPrototypeOf',
//  'propertyIsEnumerable',
//  'toString']
```

#### Object.defineProperty()和Object.defineProperties()
Object.defineProperty()方法允许通过属性描述对象，定义或修改一个属性，然后返回修改后的对象。
```js
Object.defineProperty(object, propertyName, attributesObject)
```
Object.defineProperty方法接受三个参数：
- object：属性所在的对象
- propertyName：字符串，表示属性名
- attributesObject：属性描述对象
```js
var obj = Object.defineProperty({}, 'p', {
  value: 123,
  writable: false,
  enumerable: true,
  configurable: false
});

obj.p // 123
obj.p = 246;
obj.p // 123
```
如果属性已经存在，Object.defineProperty()方法相当于更新该属性的属性描述对象。

如果一次性定义或修改多个属性，可以使用Object.defineProperties()方法。
```js
var obj = Object.defineProperties({}, {
  p1: { value: 123, enumerable: true },
  p2: { value: 'abc', enumerable: true },
  p3: { get: function () { return this.p1 + this.p2 },
    enumerable:true,
    configurable:true
  }
});

obj.p1 // 123
obj.p2 // "abc"
obj.p3 // "123abc"
```
一旦定义了取值函数get（或存值函数set），就不能将writable属性设为true，或者同时定义value属性，否则会报错。
```js
var obj = {};

Object.defineProperty(obj, 'p', {
  value: 123,
  get: function() { return 456; }
});
// TypeError: Invalid property.
// A property cannot both have accessors and be writable or have a value

Object.defineProperty(obj, 'p', {
  writable: true,
  get: function() { return 456; }
});
// TypeError: Invalid property descriptor.
// Cannot both specify accessors and a value or writable attribute
```
Object.defineProperty()和Object.defineProperties()参数里面的属性描述对象，writable、configurable、enumerable这三个属性的默认值都为false。


#### Object.prototype.propertyIsEnumerable()
实例对象的propertyIsEnumerable()方法返回一个布尔值，用来判断某个属性是否可遍历。注意，这个方法只能用于判断对象自身的属性，对于继承的属性一律返回false。
```js
var obj = {};
obj.p = 123;

obj.propertyIsEnumerable('p') // true
obj.propertyIsEnumerable('toString') // false
```

#### 元属性
##### value
value属性是目标属性的值。
```js
var obj = {};
obj.p = 123;

Object.getOwnPropertyDescriptor(obj, 'p').value
// 123

Object.defineProperty(obj, 'p', { value: 246 });
obj.p // 246
```
##### writable
writable属性是一个布尔值，决定了目标属性的值（value）是否可以被改变。
```js
var obj = {};

Object.defineProperty(obj, 'a', {
  value: 37,
  writable: false
});

obj.a // 37
obj.a = 25;
obj.a // 37
```
注意，正常模式下，对writable为false的属性赋值不会报错，只会默默失败。但是，严格模式下会报错，即使对a属性重新赋予一个同样的值。
```js
'use strict';
var obj = {};

Object.defineProperty(obj, 'a', {
  value: 37,
  writable: false
});

obj.a = 37;
// Uncaught TypeError: Cannot assign to read only property 'a' of object
```
如果原型对象的某个属性的writable为false，那么子对象将无法自定义这个属性。
```js
var proto = Object.defineProperty({}, 'foo', {
  value: 'a',
  writable: false
});

var obj = Object.create(proto);

obj.foo = 'b';
obj.foo // 'a'
```
但是，有一个规避方法，就是通过覆盖属性描述对象，绕过这个限制。原因是这种情况下，原型链会被完全忽视。
```js
var proto = Object.defineProperty({}, 'foo', {
  value: 'a',
  writable: false
});

var obj = Object.create(proto);
Object.defineProperty(obj, 'foo', {
  value: 'b'
});

obj.foo // "b"
```

##### enumerable
enumerable（可遍历性）返回一个布尔值，表示目标属性是否可遍历。如果一个属性的enumerable为false，下面三个操作不会取到该属性。
- for..in循环
- Object.keys方法
- JSON.stringify方法

因此，enumerable可以用来设置“秘密”属性。
```js
var obj = {};

Object.defineProperty(obj, 'x', {
  value: 123,
  enumerable: false
});

obj.x // 123

for (var key in obj) {
  console.log(key);
}
// undefined

Object.keys(obj)  // []
JSON.stringify(obj) // "{}"
```
注意，for...in循环包括继承的属性，Object.keys方法不包括继承的属性。如果需要获取对象自身的所有属性，不管是否可遍历，可以使用Object.getOwnPropertyNames方法。

另外，JSON.stringify方法会排除enumerable为false的属性，有时可以利用这一点。如果对象的 JSON 格式输出要排除某些属性，就可以把这些属性的enumerable设为false。

##### Configurable
configurable(可配置性）返回一个布尔值，决定了是否可以修改属性描述对象。也就是说，configurable为false时，writable、enumerable和configurable都不能被修改了。
```js
var obj = Object.defineProperty({}, 'p', {
  value: 1,
  writable: false,
  enumerable: false,
  configurable: false
});

Object.defineProperty(obj, 'p', {writable: true})
// TypeError: Cannot redefine property: p

Object.defineProperty(obj, 'p', {enumerable: true})
// TypeError: Cannot redefine property: p

Object.defineProperty(obj, 'p', {configurable: true})
// TypeError: Cannot redefine property: p

Object.defineProperty(obj, 'p', {value: 2})
// TypeError: Cannot redefine property: p
```

writable属性只有在false改为true时会报错，true改为false是允许的。
```js
var obj = Object.defineProperty({}, 'p', {
  writable: true,
  configurable: false
});
Object.defineProperty(obj, 'p', {writable: false})
// 修改成功
```
value属性的情况比较特殊。只要writable和configurable有一个为true，就允许改动value。
```js
var o1 = Object.defineProperty({}, 'p', {
  value: 1,
  writable: true,
  configurable: false
});

Object.defineProperty(o1, 'p', {value: 2})
// 修改成功

var o2 = Object.defineProperty({}, 'p', {
  value: 1,
  writable: false,
  configurable: true
});

Object.defineProperty(o2, 'p', {value: 2})
// 修改成功
```
另外，writable为false时，直接对目标属性赋值，不报错，但不会成功。如果是严格模式，还会报错。
```js
var obj = Object.defineProperty({}, 'p', {
  value: 1,
  writable: false,
  configurable: false
});

obj.p = 2;
obj.p // 1
```

#### 存取器
除了直接定义以外，属性还可以用存取器（accessor）定义。其中，存值函数称为setter，使用属性描述对象的set属性；取值函数称为getter，使用属性描述对象的get属性。一旦对目标属性定义了存取器，那么存取的时候，都将执行对应的函数。利用这个功能，可以实现许多高级特性，比如定制属性的读取和赋值行为。
```js
var obj = Object.defineProperty({}, 'p', {
  get: function () {
    return 'getter';
  },
  set: function (value) {
    console.log('setter: ' + value);
  }
});

obj.p // "getter"
obj.p = 123 // "setter: 123"
```
JavaScript 还提供了存取器的另一种写法。
```js
// 写法二
var obj = {
  get p() {
    return 'getter';
  },
  set p(value) {
    console.log('setter: ' + value);
  }
};
```
上面两种写法，虽然属性p的读取和赋值行为是一样的，但是有一些细微的区别。第一种写法，属性p的configurable和enumerable都为false，从而导致属性p是不可遍历的；第二种写法，属性p的configurable和enumerable都为true，因此属性p是可遍历的。实际开发中，写法二更常用。

注意，取值函数get不能接受参数，存值函数set只能接受一个参数（即属性的值）。存取器往往用于，属性的值依赖对象内部数据的场合。
```js
var obj ={
  $n : 5,
  get next() { return this.$n++ },
  set next(n) {
    if (n >= this.$n) this.$n = n;
    else throw new Error('新的值必须大于当前值');
  }
};

obj.next // 5

obj.next = 10;
obj.next // 10

obj.next = 5;
// Uncaught Error: 新的值必须大于当前值
```

#### 对象的拷贝
有时需要将一个对象的所有属性，拷贝到另一个对象，可以用下面的方法实现。
```js
var extend = function (to, from) {
  for (var property in from) {
    to[property] = from[property];
  }

  return to;
}

extend({}, {
  a: 1
})
// {a: 1}
```
这个方法的问题在于，如果遇到存取器定义的属性，会只拷贝值。
```js
extend({}, {
  get a() { return 1 }
})
// {a: 1}
```
为了解决这个问题，可以通过Object.defineProperty方法来拷贝属性。
```js
var extend = function (to, from) {
  for (var property in from) {
    if (!from.hasOwnProperty(property)) continue;
    Object.defineProperty(
      to,
      property,
      Object.getOwnPropertyDescriptor(from, property)
    );
  }

  return to;
}

extend({}, { get a(){ return 1 } })
// { get a(){ return 1 } })
```

#### 控制对象状态
有时需要冻结对象的读写状态，防止对象被改变。JavaScript 提供了三种冻结方法，最弱的一种是Object.preventExtensions，其次是Object.seal，最强的是Object.freeze。
##### Object.preventExtensions()
Object.preventExtensions方法可以使得一个对象无法再添加新的属性。
```js
var obj = new Object();
Object.preventExtensions(obj);

Object.defineProperty(obj, 'p', {
  value: 'hello'
});
// TypeError: Cannot define property:p, object is not extensible.

obj.p = 1;
obj.p // undefined
```
##### Object.isExtensible()
Object.isExtensible方法用于检查一个对象是否使用了Object.preventExtensions方法。也就是说，检查是否可以为一个对象添加属性。
```js
var obj = new Object();

Object.isExtensible(obj) // true
Object.preventExtensions(obj);
Object.isExtensible(obj) // false
```
##### Object.seal()
Object.seal方法使得一个对象既无法添加新属性，也无法删除旧属性。
```js
var obj = { p: 'hello' };
Object.seal(obj);

delete obj.p;
obj.p // "hello"

obj.x = 'world';
obj.x // undefined
```
Object.seal实质是把属性描述对象的configurable属性设为false，因此属性描述对象不再能改变了。
```js
var obj = {
  p: 'a'
};

// seal方法之前
Object.getOwnPropertyDescriptor(obj, 'p')
// Object {
//   value: "a",
//   writable: true,
//   enumerable: true,
//   configurable: true
// }

Object.seal(obj);

// seal方法之后
Object.getOwnPropertyDescriptor(obj, 'p')
// Object {
//   value: "a",
//   writable: true,
//   enumerable: true,
//   configurable: false
// }

Object.defineProperty(obj, 'p', {
  enumerable: false
})
// TypeError: Cannot redefine property: p
```
##### Object.isSealed()
Object.isSealed方法用于检查一个对象是否使用了Object.seal方法。如果使用了Object.seal方法，这时，Object.isExtensible方法也返回false。
```js
var obj = { p: 'a' };

Object.seal(obj);
Object.isSealed(obj) // true
Object.isExtensible(obj) // false
```
##### Object.freeze()
Object.freeze方法可以使得一个对象无法添加新属性、无法删除旧属性、也无法改变属性的值，使得这个对象实际上变成了常量。这些操作并不报错，只是默默地失败。如果在严格模式下，则会报错。
```js
var obj = {
  p: 'hello'
};

Object.freeze(obj);

obj.p = 'world';
obj.p // "hello"

obj.t = 'hello';
obj.t // undefined

delete obj.p // false
obj.p // "hello"
```

##### Object.isFrozen()
Object.isFrozen方法用于检查一个对象是否使用了Object.freeze方法。使用Object.freeze方法以后，Object.isSealed将会返回true，Object.isExtensible返回false。
```js
var obj = {
  p: 'hello'
};

Object.freeze(obj);
Object.isFrozen(obj) // true
Object.isSealed(obj) // true
Object.isExtensible(obj) // false
```

##### 局限性
上面的三个方法锁定对象的可写性有一个漏洞：可以通过改变原型对象，来为对象增加属性。
```js
var obj = new Object();
Object.preventExtensions(obj);

var proto = Object.getPrototypeOf(obj);
proto.t = 'hello';
obj.t
// hello
```
一种解决方案是，把obj的原型也冻结住。
```js
var obj = new Object();
Object.preventExtensions(obj);

var proto = Object.getPrototypeOf(obj);
Object.preventExtensions(proto);

proto.t = 'hello';
obj.t // undefined
```
另外一个局限是，如果属性值是对象，上面这些方法只能冻结属性指向的对象，而不能冻结对象本身的内容。
```js
var obj = {
  foo: 1,
  bar: ['a', 'b']
};
Object.freeze(obj);

obj.bar.push('c');
obj.bar // ["a", "b", "c"]
```

### Array对象
#### 实例方法
##### join()
join()方法以指定参数作为分隔符，将所有数组成员连接为一个字符串返回。如果不提供参数，默认用逗号分隔。如果数组成员是undefined或null或空位，会被转成空字符串。
```js
var a = [1, 2, 3, 4];

a.join(' ') // '1 2 3 4'
a.join(' | ') // "1 | 2 | 3 | 4"
a.join() // "1,2,3,4"

[undefined, null].join('#')
// '#'

['a',, 'b'].join('-')
// 'a--b'
```
通过call方法，这个方法也可以用于字符串或类似数组的对象。
```js
Array.prototype.join.call('hello', '-')
// "h-e-l-l-o"

var obj = { 0: 'a', 1: 'b', length: 2 };
Array.prototype.join.call(obj, '-')
// 'a-b'
```

##### concat()
concat方法用于多个数组的合并。它将新数组的成员，添加到原数组成员的后部，然后返回一个新数组，原数组不变。除了数组作为参数，concat也接受其他类型的值作为参数，添加到目标数组尾部。
```js
['hello'].concat(['world'])
// ["hello", "world"]

['hello'].concat(['world'], ['!'])
// ["hello", "world", "!"]

[].concat({a: 1}, {b: 2})
// [{ a: 1 }, { b: 2 }]

[2].concat({a: 1})
// [2, {a: 1}]

[1, 2, 3].concat(4, 5, 6)
// [1, 2, 3, 4, 5, 6]
```
如果数组成员包括对象，concat方法返回当前数组的一个浅拷贝。所谓“浅拷贝”，指的是新数组拷贝的是对象的引用。
```js
var obj = { a: 1 };
var oldArray = [obj];

var newArray = oldArray.concat();

obj.a = 2;
newArray[0].a // 2
```

##### slice()
slice()方法用于提取目标数组的一部分，返回一个新数组，原数组不变。slice()方法的一个重要应用，是将类似数组的对象转为真正的数组。
```js
Array.prototype.slice.call({ 0: 'a', 1: 'b', length: 2 })
// ['a', 'b']

Array.prototype.slice.call(document.querySelectorAll("div"));
Array.prototype.slice.call(arguments);
```

##### splice()
splice()方法用于删除原数组的一部分成员，并可以在删除的位置添加新的数组成员，返回值是被删除的元素。注意，该方法会改变原数组。splice的第一个参数是删除的起始位置（从0开始），第二个参数是被删除的元素个数。如果后面还有更多的参数，则表示这些就是要被插入数组的新元素。如果只是单纯地插入元素，splice方法的第二个参数可以设为0。
```js
arr.splice(start, count, addElement1, addElement2, ...);
```
如果只是单纯地插入元素，splice方法的第二个参数可以设为0。
```js
var a = [1, 1, 1];

a.splice(1, 0, 2) // []
a // [1, 2, 1, 1]
```
如果只提供第一个参数，等同于将原数组在指定位置拆分成两个数组。
```js
var a = [1, 2, 3, 4];
a.splice(2) // [3, 4]
a // [1, 2]
```

##### sort()
sort方法对数组成员进行排序，默认是按照字典顺序排序。排序后，原数组将被改变。如果想让sort方法按照自定义方式排序，可以传入一个函数作为参数。sort的参数函数本身接受两个参数，表示进行比较的两个数组成员。如果该函数的返回值大于0，表示第一个成员排在第二个成员后面；其他情况下，都是第一个元素排在第二个元素前面。
```js
[
  { name: "张三", age: 30 },
  { name: "李四", age: 24 },
  { name: "王五", age: 28  }
].sort(function (o1, o2) {
  return o1.age - o2.age;
})
// [
//   { name: "李四", age: 24 },
//   { name: "王五", age: 28  },
//   { name: "张三", age: 30 }
// ]
```

##### map()
map()方法将数组的所有成员依次传入参数函数，然后把每一次的执行结果组成一个新数组返回。map()方法接受一个函数作为参数。该函数调用时，map()方法向它传入三个参数：当前成员、当前位置和数组本身。map()方法还可以接受第二个参数，用来绑定回调函数内部的this变量。
```js
[1, 2, 3].map(function(elem, index, arr) {
  return elem * index;
});
// [0, 2, 6]

var arr = ['a', 'b', 'c'];

[1, 2].map(function (e) {
  return this[e];
}, arr)
// ['b', 'c']
```
如果数组有空位，map()方法的回调函数在这个位置不会执行，会跳过数组的空位。
```js
var f = function (n) { return 'a' };

[1, undefined, 2].map(f) // ["a", "a", "a"]
[1, null, 2].map(f) // ["a", "a", "a"]
[1, , 2].map(f) // ["a", , "a"]
```

##### forEach()
forEach()方法与map()方法很相似，也是对数组的所有成员依次执行参数函数。但是，forEach()方法不返回值，只用来操作数据。这就是说，如果数组遍历的目的是为了得到返回值，那么使用map()方法，否则使用forEach()方法。forEach()的用法与map()方法一致，参数是一个函数，该函数同样接受三个参数：当前值、当前位置、整个数组。
```js
function log(element, index, array) {
  console.log('[' + index + '] = ' + element);
}

[2, 5, 9].forEach(log);
// [0] = 2
// [1] = 5
// [2] = 9
```
forEach()方法也可以接受第二个参数，绑定参数函数的this变量。
```js
var out = [];

[1, 2, 3].forEach(function(elem) {
  this.push(elem * elem);
}, out);

out // [1, 4, 9]
```
注意，forEach()方法无法中断执行，总是会将所有成员遍历完。如果希望符合某种条件时，就中断遍历，要使用for循环。forEach()方法也会跳过数组的空位。

##### filter()
filter()方法用于过滤数组成员，满足条件的成员组成一个新数组返回。它的参数是一个函数，所有数组成员依次执行该函数，返回结果为true的成员组成一个新数组返回。该方法不会改变原数组。filter()方法的参数函数可以接受三个参数：当前成员，当前位置和整个数组。
```js
[1, 2, 3, 4, 5].filter(function (elem, index, arr) {
  return index % 2 === 0;
});
// [1, 3, 5]
```
filter()方法还可以接受第二个参数，用来绑定参数函数内部的this变量。
```js
var obj = { MAX: 3 };
var myFilter = function (item) {
  if (item > this.MAX) return true;
};

var arr = [2, 8, 3, 4, 1, 3, 2, 9];
arr.filter(myFilter, obj) // [8, 4, 9]
```

##### some()和every()
它们接受一个函数作为参数，所有数组成员依次执行该函数。该函数接受三个参数：当前成员、当前位置和整个数组，然后返回一个布尔值。
- some方法是只要一个成员的返回值是true，则整个some方法的返回值就是true，否则返回false。
- every方法是所有成员的返回值都是true，整个every方法才返回true，否则返回false。
- 注意，对于空数组，some方法返回false，every方法返回true，回调函数都不会执行。
```js
var arr = [1, 2, 3, 4, 5];
arr.some(function (elem, index, arr) {
  return elem >= 3;
});
// true
arr.every(function (elem, index, arr) {
  return elem >= 3;
});
// false

function isEven(x) { return x % 2 === 0 }
[].some(isEven) // false
[].every(isEven) // true
```
some和every方法还可以接受第二个参数，用来绑定参数函数内部的this变量。

##### reduce()和reduceRight()
reduce()方法和reduceRight()方法依次处理数组的每个成员，最终累计为一个值。它们的差别是，reduce()是从左到右处理（从第一个成员到最后一个成员），reduceRight()则是从右到左（从最后一个成员到第一个成员），其他完全一样。

reduce()方法和reduceRight()方法的第一个参数都是一个函数。该函数接受以下四个参数。这四个参数之中，只有前两个是必须的，后两个则是可选的。
- 累积变量。第一次执行时，默认为数组的第一个成员；以后每次执行时，都是上一轮的返回值。
- 当前变量。第一次执行时，默认为数组的第二个成员；以后每次执行时，都是下一个成员。
- 当前位置。一个整数，表示第二个参数（当前变量）的位置，默认为1。
- 原数组。
```js
[1, 2, 3, 4, 5].reduce(function (
  a,   // 累积变量，必须
  b,   // 当前变量，必须
  i,   // 当前位置，可选
  arr  // 原数组，可选
) {
  // ... ...
});
```
如果要对累积变量指定初值，可以把它放在reduce()方法和reduceRight()方法的第二个参数。
```js
[1, 2, 3, 4, 5].reduce(function (a, b) {
  return a + b;
}, 10);
// 25
```

##### indexOf()和lastIndexOf()
- indexOf方法返回给定元素在数组中第一次出现的位置，如果没有出现则返回-1。
- lastIndexOf方法返回给定元素在数组中最后一次出现的位置，如果没有出现则返回-1。

注意，这两个方法不能用来搜索NaN的位置，即它们无法确定数组成员是否包含NaN。这是因为这两个方法内部，使用严格相等运算符（===）进行比较，而NaN是唯一一个不等于自身的值。

### 包装对象
对象是 JavaScript 语言最主要的数据类型，三种原始类型的值——数值、字符串、布尔值——在一定条件下，也会自动转为对象，也就是原始类型的“包装对象”（wrapper）。

所谓“包装对象”，指的是与数值、字符串、布尔值分别相对应的Number、String、Boolean三个原生对象。这三个原生对象可以把原始类型的值变成（包装成）对象。

包装对象的设计目的，首先是使得“对象”这种类型可以覆盖 JavaScript 所有的值，整门语言有一个通用的数据模型，其次是使得原始类型的值也有办法调用自己的方法。

```js
var v1 = new Number(123);
var v2 = new String('abc');
var v3 = new Boolean(true);

typeof v1 // "object"
typeof v2 // "object"
typeof v3 // "object"

v1 === 123 // false
v2 === 'abc' // false
v3 === true // false
```

### Boolean对象
注意，false对应的包装对象实例，布尔运算结果也是true。
```js
if (new Boolean(false)) {
  console.log('true');
} // true

if (new Boolean(false).valueOf()) {
  console.log('true');
} // 无输出
```
使用双重的否运算符（!）也可以将任意值转为对应的布尔值。
```js
!!undefined // false
!!null // false
!!0 // false
!!'' // false
!!NaN // false

!!1 // true
!!'false' // true
!![] // true
!!{} // true
!!function(){} // true
!!/foo/ // true
```
最后，对于一些特殊值，Boolean对象前面加不加new，会得到完全相反的结果，必须小心。
```js
if (Boolean(false)) {
  console.log('true');
} // 无输出

if (new Boolean(false)) {
  console.log('true');
} // true

if (Boolean(null)) {
  console.log('true');
} // 无输出

if (new Boolean(null)) {
  console.log('true');
} // true
```

### Number对象
#### 实例对象
##### Number.prototype.toString()   
Number对象部署了自己的toString方法，用来将一个数值转为字符串形式。toString方法可以接受一个参数，表示输出的进制。如果省略这个参数，默认将数值先转为十进制，再输出字符串；否则，就根据参数指定的进制，将一个数字转化成某个进制的字符串。
```js
(10).toString(2) // "1010"
(10).toString(8) // "12"
(10).toString(16) // "a"
```
toString方法只能将十进制的数，转为其他进制的字符串。如果要将其他进制的数，转回十进制，需要使用parseInt方法。

##### Number.prototype.toExponential()
toExponential方法用于将一个数转为科学计数法形式。
```js
(10).toExponential()  // "1e+1"
(10).toExponential(1) // "1.0e+1"
(10).toExponential(2) // "1.00e+1"

(1234).toExponential()  // "1.234e+3"
(1234).toExponential(1) // "1.2e+3"
(1234).toExponential(2) // "1.23e+3"
```
toExponential方法的参数是小数点后有效数字的位数，范围为0到100，超出这个范围，会抛出一个 RangeError 错误。

##### Number.prototype.toPrecision() 
Number.prototype.toPrecision()方法用于将一个数转为指定位数的有效数字。
```js
(12.34).toPrecision(1) // "1e+1"
(12.34).toPrecision(2) // "12"
(12.34).toPrecision(3) // "12.3"
(12.34).toPrecision(4) // "12.34"
(12.34).toPrecision(5) // "12.340"
```
该方法的参数为有效数字的位数，范围是1到100，超出这个范围会抛出 RangeError 错误。

#### 自定义方法
注意，数值的自定义方法，只能定义在它的原型对象Number.prototype上面，数值本身是无法自定义属性的。
```js
var n = 1;
n.x = 1;
n.x // undefined
```

### String对象
String对象是 JavaScript 原生提供的三个包装对象之一，用来生成字符串对象。字符串对象是一个类似数组的对象（很像数组，但不是数组）。
```js
var s1 = 'abc';
var s2 = new String('abc');

typeof s1 // "string"
typeof s2 // "object"

s2.valueOf() // "abc"

new String('abc')   // String {0: "a", 1: "b", 2: "c", length: 3}
(new String('abc'))[1]  // "b"
```

#### 静态方法
##### String.fromCharCode() 
String对象提供的静态方法（即定义在对象本身，而不是定义在对象实例的方法），主要是String.fromCharCode()。该方法的参数是一个或多个数值，代表 Unicode 码点，返回值是这些码点组成的字符串。String.fromCharCode方法的参数为空，就返回空字符串；否则，返回参数对应的 Unicode 字符串。
```js
String.fromCharCode() // ""
String.fromCharCode(97) // "a"
String.fromCharCode(104, 101, 108, 108, 111)
// "hello"
```

#### 实例方法
##### String.prototype.charAt()
charAt方法返回指定位置的字符，参数是从0开始编号的位置。这个方法完全可以用数组下标替代。
```js
var s = new String('abc');

s.charAt(1) // "b"
s.charAt(s.length - 1) // "c"
```
如果参数为负数，或大于等于字符串的长度，charAt返回空字符串。
```js
'abc'.charAt(-1) // ""
'abc'.charAt(3) // ""
```
##### String.prototype.charCodeAt()
charCodeAt()方法返回字符串指定位置的 Unicode 码点（十进制表示），相当于String.fromCharCode()的逆操作。如果没有任何参数，charCodeAt返回首字符的 Unicode 码点。如果参数为负数，或大于等于字符串的长度，charCodeAt返回NaN。
```js
'abc'.charCodeAt(1) // 98
'abc'.charCodeAt() // 97
'abc'.charCodeAt(-1) // NaN
'abc'.charCodeAt(4) // NaN
```
##### String.prototype.substr()
substr方法用于从原字符串取出子字符串并返回，不改变原字符串，跟slice和substring方法的作用相同。substr方法的第一个参数是子字符串的开始位置（从0开始计算），第二个参数是子字符串的长度。如果省略第二个参数，则表示子字符串一直到原字符串的结束。
```js
'JavaScript'.substr(4, 6) // "Script"
'JavaScript'.substr(4) // "Script"
```
如果第一个参数是负数，表示倒数计算的字符位置。如果第二个参数是负数，将被自动转为0，因此会返回空字符串。
```js
'JavaScript'.substr(-6) // "Script"
'JavaScript'.substr(4, -1) // ""
```
##### String.prototype.trim()
trim方法用于去除字符串两端的空格，返回一个新字符串，不改变原字符串。该方法去除的不仅是空格，还包括制表符（\t、\v）、换行符（\n）和回车符（\r）。
```js
'  hello world  '.trim()    // "hello world"
'\r\nabc \t'.trim() // 'abc'
```

##### String.prototype.match()
match方法用于确定原字符串是否匹配某个子字符串，返回一个数组，成员为匹配的第一个字符串。如果没有找到匹配，则返回null。
```js
'cat, bat, sat, fat'.match('at') // ["at"]
'cat, bat, sat, fat'.match('xt') // null
```
返回的数组还有index属性和input属性，分别表示匹配字符串开始的位置和原始字符串。
```js
var matches = 'cat, bat, sat, fat'.match('at');
matches.index // 1
matches.input // "cat, bat, sat, fat"
```

##### String.prototype.search()与String.prototype.replace()
search方法的用法基本等同于match，但是返回值为匹配的第一个位置。如果没有找到匹配，则返回-1。
```js
'cat, bat, sat, fat'.search('at') // 1
```
replace方法用于替换匹配的子字符串，一般情况下只替换第一个匹配（除非使用带有g修饰符的正则表达式）。
```js
'aaa'.replace('a', 'b') // "baa"
```

### Math对象
#### 静态属性
Math对象的静态属性，提供以下一些数学常数。
- Math.E：常数e。
- Math.LN2：2 的自然对数。
- Math.LN10：10 的自然对数。
- Math.LOG2E：以 2 为底的e的对数。
- Math.LOG10E：以 10 为底的e的对数。
- Math.PI：常数π。
- Math.SQRT1_2：0.5 的平方根。
- Math.SQRT2：2 的平方根。

#### 静态方法
Math对象提供以下一些静态方法。
- Math.abs()：绝对值
- Math.ceil()：向上取整
- Math.floor()：向下取整
- Math.max()：最大值
- Math.min()：最小值
- Math.pow()：幂运算
- Math.sqrt()：平方根
- Math.log()：自然对数
- Math.exp()：e的指数
- Math.round()：四舍五入
- Math.random()：随机数

Math对象还提供一系列三角函数方法。
- Math.sin()：返回参数的正弦（参数为弧度值）
- Math.cos()：返回参数的余弦（参数为弧度值）
- Math.tan()：返回参数的正切（参数为弧度值）
- Math.asin()：返回参数的反正弦（返回值为弧度值）
- Math.acos()：返回参数的反余弦（返回值为弧度值）
- Math.atan()：返回参数的反正切（返回值为弧度值）

### JSON对象
#### JSON.stringify()
JSON.stringify()方法用于将一个值转为 JSON 字符串。该字符串符合 JSON 格式，并且可以被JSON.parse()方法还原。如果对象的属性是undefined、函数或 XML 对象，该属性会被JSON.stringify()过滤。如果数组的成员是undefined、函数或 XML 对象，则这些值被转成null。
```js
JSON.stringify('abc') // ""abc""
JSON.stringify(1) // "1"
JSON.stringify(false) // "false"
JSON.stringify([]) // "[]"
JSON.stringify({}) // "{}"
JSON.stringify([1, "false", false]) // '[1,"false",false]'
JSON.stringify({ name: "张三" })    // '{"name":"张三"}'

var obj = {
  a: undefined,
  b: function () {}
};
JSON.stringify(obj) // "{}"

var arr = [undefined, function () {}];
JSON.stringify(arr) // "[null,null]"
```
JSON.stringify()方法还可以接受一个数组，作为第二个参数，指定参数对象的哪些属性需要转成字符串。这个类似白名单的数组，只对对象的属性有效，对数组无效。
```js
var obj = {
  'prop1': 'value1',
  'prop2': 'value2',
  'prop3': 'value3'
};

var selectedProperties = ['prop1', 'prop2'];

JSON.stringify(obj, selectedProperties)
// "{"prop1":"value1","prop2":"value2"}"
```
第二个参数还可以是一个函数，用来更改JSON.stringify()的返回值。这个处理函数是递归处理所有的键。如果处理函数返回undefined或没有返回值，则该属性会被忽略。
```js
function f(key, value) {
  if (typeof value === "number") {
    value = 2 * value;
  }
  return value;
}

JSON.stringify({ a: 1, b: 2 }, f)
// '{"a": 2,"b": 4}'
```
JSON.stringify()还可以接受第三个参数，用于增加返回的 JSON 字符串的可读性。默认返回的是单行字符串，对于大型的 JSON 对象，可读性非常差。第三个参数使得每个属性单独占据一行，并且将每个属性前面添加指定的前缀（不超过10个字符）。
```js
// 默认输出
JSON.stringify({ p1: 1, p2: 2 })
// JSON.stringify({ p1: 1, p2: 2 })

// 分行输出
JSON.stringify({ p1: 1, p2: 2 }, null, '\t')
// {
// 	"p1": 1,
// 	"p2": 2
// }
```

#### JSON.parse()
JSON.parse()方法用于将 JSON 字符串转换成对应的值。如果传入的字符串不是有效的 JSON 格式，JSON.parse()方法将报错。为了处理解析错误，可以将JSON.parse()方法放在try...catch代码块中。
```js
JSON.parse('{}') // {}
JSON.parse('true') // true
JSON.parse('"foo"') // "foo"
JSON.parse('[1, 5, "false"]') // [1, 5, "false"]
JSON.parse('null') // null

var o = JSON.parse('{"name": "张三"}');
o.name // 张三
```
JSON.parse()方法可以接受一个处理函数，作为第二个参数，用法与JSON.stringify()方法类似。

JSON.parse()和JSON.stringify()可以结合使用，像下面这样写，实现对象的深拷贝。但是对象内部不能有 JSON 以及不允许的数据类型，比如函数、正则对象、日期对象等。
```js
JSON.parse(JSON.stringify(obj))
```

## 面向对象编程
### 实例对象与new命令
#### 构造函数
构造函数的特点有两个。
- 函数体内部使用了this关键字，代表了所要生成的对象实例。
- 生成对象的时候，必须使用new命令。

#### new命令
##### new命令的原理
使用new命令时，它后面的函数依次执行下面的步骤。
1. 创建一个空对象，作为将要返回的对象实例。
2. 将这个空对象的原型，指向构造函数的prototype属性。
3. 将这个空对象赋值给函数内部的this关键字。
4. 开始执行构造函数内部的代码。

也就是说，构造函数内部，this指的是一个新生成的空对象，所有针对this的操作，都会发生在这个空对象上。构造函数之所以叫“构造函数”，就是说这个函数的目的，就是操作一个空对象（即this对象），将其“构造”为需要的样子。

如果构造函数内部有return语句，而且return后面跟着一个对象，new命令会返回return语句指定的对象；否则，就会不管return语句，返回this对象。
```js
var Vehicle = function () {
  this.price = 1000;
  return 1000;
};

(new Vehicle()) === 1000
// false
```
但是，如果return语句返回的是一个跟this无关的新对象，new命令会返回这个新对象。
```js
var Vehicle = function (){
  this.price = 1000;
  return { price: 2000 };
};

(new Vehicle()).price
// 2000
```

##### new.target
函数内部可以使用new.target属性。如果当前函数是new命令调用，new.target指向当前函数，否则为undefined。使用这个属性，可以判断函数调用的时候，是否使用new命令。
```js
function f() {
  console.log(new.target === f);
}

f() // false
new f() // true
```

##### Object.create() 创建实例对象
构造函数作为模板，可以生成实例对象。但是，有时拿不到构造函数，只能拿到一个现有的对象。我们希望以这个现有的对象作为模板，生成新的实例对象，这时就可以使用Object.create()方法。
```js
var person1 = {
  name: '张三',
  age: 38,
  greeting: function() {
    console.log('Hi! I\'m ' + this.name + '.');
  }
};

var person2 = Object.create(person1);

person2.name // 张三
person2.greeting() // Hi! I'm 张三.
```

### this关键字
this可以用在构造函数之中，表示实例对象。除此之外，this还可以用在别的场合。但不管是什么场合，this都有一个共同点：它总是返回一个对象。

this的指向是可变的。只要函数被赋给另一个变量，this的指向就会变。

由于函数可以在不同的运行环境执行，所以需要有一种机制，能够在函数体内部获得当前的运行环境（context）。所以，this就出现了，它的设计目的就是在函数体内部，指代函数当前的运行环境。

#### 使用场合
##### 全局环境
全局环境使用this，它指的就是顶层对象window。不管是不是在函数内部，只要是在全局环境下运行，this就是指顶层对象window。
```js
this === window // true

function f() {
  console.log(this === window);
}
f() // true
```

##### 构造函数
构造函数中的this，指的是实例对象。
```js
var Obj = function (p) {
  this.p = p;
};

var o = new Obj(1);
o.p // 1
```

##### 对象的方法
如果对象的方法里面包含this，this的指向就是方法运行时所在的对象。该方法赋值给另一个对象，就会改变this的指向。
```js
var obj ={
  foo: function () {
    console.log(this);
  }
};

obj.foo() // obj
```
但是，下面这几种用法，都会改变this的指向。obj.foo就是一个值。这个值真正调用的时候，运行环境已经不是obj了，而是全局环境，所以this不再指向obj。
```js
// 情况一
(obj.foo = obj.foo)() // window
// 情况二
(false || obj.foo)() // window
// 情况三
(1, obj.foo)() // window
```
可以这样理解，JavaScript 引擎内部，obj和obj.foo储存在两个内存地址，称为地址一和地址二。obj.foo()这样调用时，是从地址一调用地址二，因此地址二的运行环境是地址一，this指向obj。但是，上面三种情况，都是直接取出地址二进行调用，这样的话，运行环境就是全局环境，因此this指向全局环境。

如果this所在的方法不在对象的第一层，这时this只是指向当前一层的对象，而不会继承更上面的层。
```js
var a = {
  p: 'Hello',
  b: {
    m: function() {
      console.log(this.p);
    }
  }
};

a.b.m() // undefined
```

#### 使用注意点
##### 避免多层this
由于this的指向是不确定的，所以切勿在函数中包含多层的this。使用一个变量固定this的值，然后内层函数调用这个变量，是非常常见的做法，请务必掌握。

##### 避免数组处理方法中的this
```js
var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    this.p.forEach(function (item) {
      console.log(this.v + ' ' + item);
    });
  }
}

o.f()
// undefined a1
// undefined a2
```
上面代码中，foreach方法的回调函数中的this，其实是指向window对象，因此取不到o.v的值。原因跟上一段的多层this是一样的，就是内层的this不指向外部，而指向顶层对象。

解决这个问题的一种方法，就是前面提到的，使用中间变量固定this。
```js
var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    var that = this;
    this.p.forEach(function (item) {
      console.log(that.v+' '+item);
    });
  }
}

o.f()
// hello a1
// hello a2
```
另一种方法是将this当作foreach方法的第二个参数，固定它的运行环境。
```js
var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    this.p.forEach(function (item) {
      console.log(this.v + ' ' + item);
    }, this);
  }
}

o.f()
// hello a1
// hello a2
```

#### 绑定this的方法
有时，需要把this固定下来，避免出现意想不到的情况。JavaScript 提供了call、apply、bind这三个方法，来切换/固定this的指向。
##### Function.prototype.call()
函数实例的call方法，可以指定函数内部this的指向（即函数执行时所在的作用域），然后在所指定的作用域中，调用该函数。
```js
var obj = {};

var f = function () {
  return this;
};

f() === window // true
f.call(obj) === obj // true
```
call方法的参数，应该是一个对象。如果参数为空、null和undefined，则默认传入全局对象。
```js
var n = 123;
var obj = { n: 456 };

function a() {
  console.log(this.n);
}

a.call() // 123
a.call(null) // 123
a.call(undefined) // 123
a.call(window) // 123
a.call(obj) // 456
```
如果call方法的参数是一个原始值，那么这个原始值会自动转成对应的包装对象，然后传入call方法。
```js
var f = function () {
  return this;
};

f.call(5)
// Number {[[PrimitiveValue]]: 5}
```
call方法还可以接受多个参数。call的第一个参数就是this所要指向的那个对象，后面的参数则是函数调用时所需的参数。
```js
function add(a, b) {
  return a + b;
}

add.call(this, 1, 2) // 3
```

##### Function.prototype.apply()
apply方法的作用与call方法类似，也是改变this指向，然后再调用该函数。唯一的区别就是，它接收一个数组作为函数执行时的参数。apply方法的第一个参数也是this所要指向的那个对象，如果设为null或undefined，则等同于指定全局对象。第二个参数则是一个数组，该数组的所有成员依次作为参数，传入原函数。原函数的参数，在call方法中必须一个个添加，但是在apply方法中，必须以数组形式添加。
```js
function f(x, y){
  console.log(x + y);
}

f.call(null, 1, 1) // 2
f.apply(null, [1, 1]) // 2
```

##### Function.prototype.bind()
bind()方法用于将函数体内的this绑定到某个对象，然后返回一个新函数。
```js
var counter = {
  count: 0,
  inc: function () {
    this.count++;
  }
};

// 注意此处inc不太括号，即不执行只是引用inc函数
var func = counter.inc.bind(counter);
func();
counter.count // 1
```
bind()还可以接受更多的参数，将这些参数绑定原函数的参数。
```js
var add = function (x, y) {
  return x * this.m + y * this.n;
}

var obj = {
  m: 2,
  n: 2
};

var newAdd = add.bind(obj, 5);
newAdd(5) // 20
```
如果bind()方法的第一个参数是null或undefined，等于将this绑定到全局对象，函数运行时this指向顶层对象（浏览器为window）。

**bind()使用时需要注意的问题**：
- 每一次返回一个新函数：bind()方法每运行一次，就返回一个新函数，这会产生一些问题。比如React的类组件中，render方法每次执行时，都会返回一个新的函数，这会导致组件的重新渲染。
- 结合回调函数使用：一个常见的错误是，将包含this的方法直接当作回调函数。解决方法就是使用bind()方法，将counter.inc()绑定counter。
```js
var counter = {
  count: 0,
  inc: function () {
    'use strict';
    this.count++;
  }
};

function callIt(callback) {
  callback();
}

callIt(counter.inc.bind(counter));
counter.count // 1
```
- 结合call()方法使用：利用bind()方法，可以改写一些 JavaScript 原生方法的使用形式。

### 对象的继承
#### 原型对象
##### 构造函数的缺点
JavaScript 通过构造函数生成新对象，因此构造函数可以视为对象的模板。实例对象的属性和方法，可以定义在构造函数内部。通过构造函数为实例对象定义属性，虽然很方便，但是有一个缺点。同一个构造函数的多个实例之间，无法共享属性，从而造成对系统资源的浪费。
```js
function Cat(name, color) {
  this.name = name;
  this.color = color;
  this.meow = function () {
    console.log('喵喵');
  };
}

var cat1 = new Cat('大毛', '白色');
var cat2 = new Cat('二毛', '黑色');

cat1.meow === cat2.meow
// false
```
上面代码中，cat1和cat2是同一个构造函数的两个实例，它们都具有meow方法。由于meow方法是生成在每个实例对象上面，所以两个实例就生成了两次。也就是说，每新建一个实例，就会新建一个meow方法。这既没有必要，又浪费系统资源，因为所有meow方法都是同样的行为，完全应该共享。

这个问题的解决方法，就是 JavaScript 的原型对象（prototype）。

##### prototype属性的作用
JavaScript 继承机制的设计思想就是，原型对象的所有属性和方法，都能被实例对象共享。也就是说，如果属性和方法定义在原型上，那么所有实例对象就能共享，不仅节省了内存，还体现了实例对象之间的联系。

JavaScript 规定，每个函数都有一个prototype属性，指向一个对象。
```js
function f() {}
typeof f.prototype // "object"
```
对于普通函数来说，该属性基本无用。但是，对于构造函数来说，生成实例的时候，该属性会自动成为实例对象的原型。原型对象的属性不是实例对象自身的属性。只要修改原型对象，变动就立刻会体现在所有实例对象上。
```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.color = 'white';

var cat1 = new Animal('大毛');
var cat2 = new Animal('二毛');

cat1.color // 'white'
cat2.color // 'white'

Animal.prototype.color = 'yellow';

cat1.color // "yellow"
cat2.color // "yellow"
```
上面代码中，原型对象的color属性的值变为yellow，两个实例对象的color属性立刻跟着变了。这是因为实例对象其实没有color属性，都是读取原型对象的color属性。也就是说，当实例对象本身没有某个属性或方法的时候，它会到原型对象去寻找该属性或方法。这就是原型对象的特殊之处。如果实例对象自身就有某个属性或方法，它就不会再去原型对象寻找这个属性或方法。
```js
cat1.color = 'black';

cat1.color // 'black'
cat2.color // 'yellow'
Animal.prototype.color // 'yellow';
```

原型对象的作用，就是定义所有实例对象共享的属性和方法。这也是它被称为原型对象的原因，而实例对象可以视作从原型对象衍生出来的子对象。

#### 原型链
JavaScript 规定，所有对象都有自己的原型对象（prototype）。一方面，任何一个对象，都可以充当其他对象的原型；另一方面，由于原型对象也是对象，所以它也有自己的原型。因此，就会形成一个“原型链”（prototype chain）：对象到原型，再到原型的原型……

如果一层层地上溯，所有对象的原型最终都可以上溯到Object.prototype，即Object构造函数的prototype属性。也就是说，所有对象都继承了Object.prototype的属性。这就是所有对象都有valueOf和toString方法的原因，因为这是从Object.prototype继承的。

Object.prototype对象向上追溯的原型是null。null没有任何属性和方法，也没有自己的原型。因此，原型链的尽头就是null。
```js
Object.getPrototypeOf(Object.prototype)
// null
```
读取对象的某个属性时，JavaScript 引擎先寻找对象本身的属性，如果找不到，就到它的原型去找，如果还是找不到，就到原型的原型去找。如果直到最顶层的Object.prototype还是找不到，则返回undefined。如果对象自身和它的原型，都定义了一个同名属性，那么优先读取对象自身的属性，这叫做“覆盖”（overriding）。

注意，一级级向上，在整个原型链上寻找某个属性，对性能是有影响的。所寻找的属性在越上层的原型对象，对性能的影响越大。如果寻找某个不存在的属性，将会遍历整个原型链。

#### constructor属性
prototype对象有一个constructor属性，默认指向prototype对象所在的构造函数。
```js
function P() {}
P.prototype.constructor === P // true
```

由于constructor属性定义在prototype对象上面，意味着可以被所有实例对象继承。
```js
function P() {}
var p = new P();

p.constructor === P // true
p.constructor === P.prototype.constructor // true
p.hasOwnProperty('constructor') // false
```

constructor属性的作用是，可以得知某个实例对象，到底是哪一个构造函数产生的。
```js
function F() {};
var f = new F();

f.constructor === F // true
f.constructor === RegExp // false
```
另一方面，有了constructor属性，就可以从一个实例对象新建另一个实例。
```js
function Constr() {}
var x = new Constr();

var y = new x.constructor();
y instanceof Constr // true
```

constructor属性表示原型对象与构造函数之间的关联关系，如果修改了原型对象，一般会同时修改constructor属性，防止引用的时候出错。所以，修改原型对象时，一般要同时修改constructor属性的指向。
```js
function Person(name) {
  this.name = name;
}

Person.prototype.constructor === Person // true

Person.prototype = {
  method: function () {}
};

Person.prototype.constructor === Person // false
Person.prototype.constructor === Object // true
```

#### instanceof运算符
instanceof运算符的左边是实例对象，右边是构造函数。它会检查右边构造函数的原型对象（prototype），是否在左边对象的原型链上。因此，下面两种写法是等价的。
```js
var v = new Vehicle();
v instanceof Vehicle // true
// 等同于
Vehicle.prototype.isPrototypeOf(v)  // true
```
由于instanceof检查整个原型链，因此同一个实例对象，可能会对多个构造函数都返回true。
```js
var d = new Date();
d instanceof Date // true
d instanceof Object // true
```

由于任意对象（除了null）都是Object的实例，所以instanceof运算符可以判断一个值是否为非null的对象。
```js
var obj = { foo: 123 };
obj instanceof Object // true
null instanceof Object // false
```
instanceof的原理是检查右边构造函数的prototype属性，是否在左边对象的原型链上。有一种特殊情况，就是左边对象的原型链上，只有null对象。这时，instanceof判断会失真。
```js
var obj = Object.create(null);
typeof obj // "object"
obj instanceof Object // false
```

instanceof运算符只能用于对象，不适用原始类型的值。此外，对于undefined和null，instanceof运算符总是返回false。
```js
var s = 'hello';
s instanceof String // false
undefined instanceof Object // false
null instanceof Object // false
```

#### 构造函数的继承
让一个构造函数继承另一个构造函数，是非常常见的需求。这可以分成两步实现。第一步是在子类的构造函数中，调用父类的构造函数。
```js
function Sub(value) {
  Super.call(this);
  this.prop = value;
}
```
第二步，是让子类的原型指向父类的原型，这样子类就可以继承父类原型。
```js
Sub.prototype = Object.create(Super.prototype);
Sub.prototype.constructor = Sub;
Sub.prototype.method = '...';
```
另外一种写法是Sub.prototype等于一个父类实例。
```js
Sub.prototype = new Super();
```

#### 多重继承
JavaScript 不提供多重继承功能，即不允许一个对象同时继承多个对象。但是，可以通过变通方法，实现这个功能。
```js
function M1() {
  this.hello = 'hello';
}

function M2() {
  this.world = 'world';
}

function S() {
  M1.call(this);
  M2.call(this);
}

// 继承 M1
S.prototype = Object.create(M1.prototype);
// 继承链上加入 M2
Object.assign(S.prototype, M2.prototype);

// 指定构造函数
S.prototype.constructor = S;

var s = new S();
s.hello // 'hello'
s.world // 'world'
```
上面代码中，子类S同时继承了父类M1和M2。这种模式又称为 Mixin（混入）。

#### 模块
##### 基本实现方法
模块是实现特定功能的一组属性和方法的封装。

简单的做法是把模块写成一个对象，所有的模块成员都放到这个对象里面。使用的时候，就是调用这个对象的属性。但是，这样的写法会暴露所有模块成员，内部状态可以被外部改写。比如，外部代码可以直接改变内部计数器的值。
```js
// 封装
var module1 = new Object({
　_count : 0,
　m1 : function (){
　　//...
　},
　m2 : function (){
  　//...
　}
});

// 使用
module1.m1();

// 篡改
module1._count = 5;
```

##### 封装私有变量：构造函数的写法
我们可以利用构造函数，封装私有变量。
```js
function StringBuilder() {
  var buffer = [];

  this.add = function (str) {
     buffer.push(str);
  };

  this.toString = function () {
    return buffer.join('');
  };
}
```
上面代码中，buffer是模块的私有变量。一旦生成实例对象，外部是无法直接访问buffer的。但是，这种方法将私有变量封装在构造函数中，导致构造函数与实例对象是一体的，总是存在于内存之中，无法在使用完成后清除。这意味着，构造函数有双重作用，既用来塑造实例对象，又用来保存实例对象的数据，违背了构造函数与实例对象在数据上相分离的原则（即实例对象的数据，不应该保存在实例对象以外）。同时，非常耗费内存。事实上这就是一个闭包。

```js
function StringBuilder() {
  this._buffer = [];
}

StringBuilder.prototype = {
  constructor: StringBuilder,
  add: function (str) {
    this._buffer.push(str);
  },
  toString: function () {
    return this._buffer.join('');
  }
};
```
这种方法将私有变量放入实例对象中，好处是看上去更自然，但是它的私有变量可以从外部读写，不是很安全。

##### 封装私有变量：立即执行函数（IIFE）的写法
另一种做法是使用“立即执行函数”（IIFE），将相关的属性和方法封装在一个函数作用域里面，可以达到不暴露私有成员的目的。这种写法外部代码无法读取内部的_count变量。
```js
var module1 = (function () {
　var _count = 0;
　var m1 = function () {
　  //...
　};
　var m2 = function () {
　　//...
　};
　return {
　　m1 : m1,
　　m2 : m2
　};
})();

console.info(module1._count); //undefined
```
上面的module1就是 JavaScript 模块的基本写法。

##### 模块的放大模式
如果一个模块很大，必须分成几个部分，或者一个模块需要继承另一个模块，这时就有必要采用“放大模式”（augmentation）。
```js
var module1 = (function (mod){
　mod.m3 = function () {
　　//...
　};
　return mod;
})(module1);
```
上面的代码为module1模块添加了一个新方法m3()，然后返回新的module1模块。

在浏览器环境中，模块的各个部分通常都是从网上获取的，有时无法知道哪个部分会先加载。如果采用上面的写法，第一个执行的部分有可能加载一个不存在空对象，这时就要采用"宽放大模式"（Loose augmentation）。
```js
var module1 = (function (mod) {
　//...
　return mod;
})(window.module1 || {});
```
与"放大模式"相比，“宽放大模式”就是“立即执行函数”的参数可以是空对象。

### Object对象的相关方法
#### Object.getPrototypeOf()
Object.getPrototypeOf方法返回参数对象的原型。这是获取原型对象的标准方法。
```js
var F = function () {};
var f = new F();
Object.getPrototypeOf(f) === F.prototype // true
```
下面是几种特殊对象的原型。
```js
// 空对象的原型是 Object.prototype
Object.getPrototypeOf({}) === Object.prototype // true

// Object.prototype 的原型是 null
Object.getPrototypeOf(Object.prototype) === null // true

// 函数的原型是 Function.prototype
function f() {}
Object.getPrototypeOf(f) === Function.prototype // true
```

#### Object.setPrototypeOf()
Object.setPrototypeOf方法为参数对象设置原型，返回该参数对象。它接受两个参数，第一个是现有对象，第二个是原型对象。
```js
var a = {};
var b = {x: 1};
Object.setPrototypeOf(a, b);

Object.getPrototypeOf(a) === b // true
a.x // 1
```
new命令可以使用Object.setPrototypeOf方法模拟。
```js
var F = function () {
  this.foo = 'bar';
};

var f = new F();
// 等同于
var f = Object.setPrototypeOf({}, F.prototype);
F.call(f);
```
上面代码中，new命令新建实例对象，其实可以分成两步。第一步，将一个空对象的原型设为构造函数的prototype属性（上例是F.prototype）；第二步，将构造函数内部的this绑定这个空对象，然后执行构造函数，使得定义在this上面的方法和属性（上例是this.foo），都转移到这个空对象上。

#### Object.create() 
生成实例对象的常用方法是，使用new命令让构造函数返回一个实例。但是很多时候，只能拿到一个实例对象，它可能根本不是由构建函数生成的，那么能不能从一个实例对象，生成另一个实例对象呢？

JavaScript 提供了Object.create()方法，用来满足这种需求。该方法接受一个对象作为参数，然后以它为原型，返回一个实例对象。该实例完全继承原型对象的属性。
```js
// 原型对象
var A = {
  print: function () {
    console.log('hello');
  }
};

// 实例对象
var B = Object.create(A);

Object.getPrototypeOf(B) === A // true
B.print() // hello
B.print === A.print // true
```
实际上，Object.create()方法可以用下面的代码代替。
```js
if (typeof Object.create !== 'function') {
  Object.create = function (obj) {
    function F() {}
    F.prototype = obj;
    return new F();
  };
}
```
如果想要生成一个不继承任何属性（比如没有toString()和valueOf()方法）的对象，可以将Object.create()的参数设为null。
```js
var obj = Object.create(null);

obj.valueOf()
// TypeError: Object [object Object] has no method 'valueOf'
```
使用Object.create()方法的时候，必须提供对象原型，即参数不能为空，或者不是对象，否则会报错。
```js
Object.create()
// TypeError: Object prototype may only be an Object or null
Object.create(123)
// TypeError: Object prototype may only be an Object or null
```
Object.create()方法生成的新对象，动态继承了原型。在原型上添加或修改任何方法，会立刻反映在新对象之上。
```js
var obj1 = { p: 1 };
var obj2 = Object.create(obj1);

obj1.p = 2;
obj2.p // 2
```
除了对象的原型，Object.create()方法还可以接受第二个参数。该参数是一个属性描述对象，它所描述的对象属性，会添加到实例对象，作为该对象自身的属性。
```js
var obj = Object.create({}, {
  p1: {
    value: 123,
    enumerable: true,
    configurable: true,
    writable: true,
  },
  p2: {
    value: 'abc',
    enumerable: true,
    configurable: true,
    writable: true,
  }
});

// 等同于
var obj = Object.create({});
obj.p1 = 123;
obj.p2 = 'abc';
```
Object.create()方法生成的对象，继承了它的原型对象的构造函数。
```js
function A() {}
var a = new A();
var b = Object.create(a);

b.constructor === A // true
b instanceof A // true
```

#### Object.prototype.isPrototypeOf()
实例对象的isPrototypeOf方法，用来判断该对象是否为参数对象的原型。由于Object.prototype处于原型链的最顶端，所以对各种实例都返回true，只有直接继承自null的对象除外。
```js
Object.prototype.isPrototypeOf({}) // true
Object.prototype.isPrototypeOf([]) // true
Object.prototype.isPrototypeOf(/xyz/) // true
Object.prototype.isPrototypeOf(Object.create(null)) // false
```

#### Object.prototype.__proto__ 
实例对象的__proto__属性（前后各两个下划线），返回该对象的原型。该属性可读写。
```js
var obj = {};
var p = {};

obj.__proto__ = p;
Object.getPrototypeOf(obj) === p // true
```
上面代码通过__proto__属性，将p对象设为obj对象的原型。

根据语言标准，__proto__属性只有浏览器才需要部署，其他环境可以没有这个属性。它前后的两根下划线，表明它本质是一个内部属性，不应该对使用者暴露。因此，应该尽量少用这个属性，而是用Object.getPrototypeOf()和Object.setPrototypeOf()，进行原型对象的读写操作。

#### Object.getOwnPropertyNames()
Object.getOwnPropertyNames方法返回一个数组，成员是参数对象本身的所有属性的键名，不包含继承的属性键名。
```js
Object.getOwnPropertyNames(Date)
// ["parse", "arguments", "UTC", "caller", "name", "prototype", "now", "length"]
```
对象本身的属性之中，有的是可以遍历的（enumerable），有的是不可以遍历的。Object.getOwnPropertyNames方法返回所有键名，不管是否可以遍历。只获取那些可以遍历的属性，使用Object.keys方法。
```js
Object.keys(Date) // []
```

#### Object.prototype.hasOwnProperty()
对象实例的hasOwnProperty方法返回一个布尔值，用于判断某个属性定义在对象自身，还是定义在原型链上。
```js
Date.hasOwnProperty('length') // true
Date.hasOwnProperty('toString') // false
```
hasOwnProperty方法是 JavaScript 之中唯一一个处理对象属性时，不会遍历原型链的方法。

#### in 运算符和 for...in 循环
in运算符返回一个布尔值，表示一个对象是否具有某个属性。它不区分该属性是对象自身的属性，还是继承的属性。in运算符常用于检查一个属性是否存在。
```js
'length' in Date // true
'toString' in Date // true
```
获得对象的所有可遍历属性（不管是自身的还是继承的），可以使用for...in循环。
```js
var o1 = { p1: 123 };

var o2 = Object.create(o1, {
  p2: { value: "abc", enumerable: true }
});

for (p in o2) {
  console.info(p);
}
// p2
// p1
```
为了在for...in循环中获得对象自身的属性，可以采用hasOwnProperty方法判断一下。
```js
for ( var name in object ) {
  if ( object.hasOwnProperty(name) ) {
    /* loop code */
  }
}
```
获得对象的所有属性（不管是自身的还是继承的，也不管是否可枚举），可以使用下面的函数。
```js
function inheritedPropertyNames(obj) {
  var props = {};
  while(obj) {
    Object.getOwnPropertyNames(obj).forEach(function(p) {
      props[p] = true;
    });
    obj = Object.getPrototypeOf(obj);
  }
  return Object.getOwnPropertyNames(props);
}
```

#### 对象的拷贝
如果要拷贝一个对象，需要做到下面两件事情。
- 确保拷贝后的对象，与原对象具有同样的原型。
- 确保拷贝后的对象，与原对象具有同样的实例属性。

下面就是根据上面两点，实现的对象拷贝函数。
```js
function copyObject(orig) {
  var copy = Object.create(Object.getPrototypeOf(orig));
  copyOwnPropertiesFrom(copy, orig);
  return copy;
}

function copyOwnPropertiesFrom(target, source) {
  Object
    .getOwnPropertyNames(source)
    .forEach(function (propKey) {
      var desc = Object.getOwnPropertyDescriptor(source, propKey);
      Object.defineProperty(target, propKey, desc);
    });
  return target;
}
```

另一种更简单的写法，是利用 ES2017 才引入标准的Object.getOwnPropertyDescriptors方法。
```js
function copyObject(orig) {
  return Object.create(
    Object.getPrototypeOf(orig),
    Object.getOwnPropertyDescriptors(orig)
  );
```

### 严格模式
严格模式是从 ES5 进入标准的，主要目的有以下几个。
- 明确禁止一些不合理、不严谨的语法，减少 JavaScript 语言的一些怪异行为。
- 增加更多报错的场合，消除代码运行的一些不安全之处，保证代码运行的安全。
- 提高编译器效率，提升运行速度。
- 为未来新版本的 JavaScript 语法做好铺垫。

总之，严格模式体现了 JavaScript 更合理、更安全、更严谨的发展方向。

#### 显式报错
严格模式使得 JavaScript 的语法变得更严格，更多的操作会显式报错。其中有些操作，在正常模式下只会默默地失败，不会报错。
##### 只读属性不可写
严格模式下，对只读属性赋值，或者删除不可配置（non-configurable）属性都会报错。
##### 只设置了取值器的属性不可写
严格模式下，对一个只有取值器（getter）、没有存值器（setter）的属性赋值，会报错。
##### 禁止扩展的对象不可扩展
严格模式下，对禁止扩展的对象添加新属性，会报错。
##### eval、arguments 不可用作标识名
严格模式下，使用eval或者arguments作为标识名，将会报错。
##### 函数不能有重名的参数
正常模式下，如果函数有多个重名的参数，可以用arguments[i]读取。严格模式下，这属于语法错误。
##### 禁止八进制的前缀0表示法
正常模式下，整数的第一位如果是0，表示这是八进制数，比如0100等于十进制的64。严格模式禁止这种表示法，整数第一位为0，将报错。

#### 增强的安全措施
##### 全局变量显式声明
正常模式中，如果一个变量没有声明就赋值，默认是全局变量。严格模式禁止这种用法，全局变量必须显式声明。因此，严格模式下，变量都必须先声明，然后再使用。
##### 禁止 this 关键字指向全局对象 
正常模式下，函数内部的this可能会指向全局对象，严格模式禁止这种用法，避免无意间创造全局变量。这种限制对于构造函数尤其有用。使用构造函数时，有时忘了加new，这时this不再指向全局对象，而是报错。

严格模式下，函数直接调用时（不使用new调用），函数内部的this表示undefined（未定义），因此可以用call、apply和bind方法，将任意值绑定在this上面。正常模式下，this指向全局对象，如果绑定的值是非对象，将被自动转为对象再绑定上去，而null和undefined这两个无法转成对象的值，将被忽略。

##### 禁止使用 fn.callee、fn.caller
函数内部不得使用fn.caller、fn.arguments，否则会报错。这意味着不能在函数内部得到调用栈了。

##### 禁止使用 arguments.callee、arguments.caller
arguments.callee和arguments.caller是两个历史遗留的变量，从来没有标准化过，现在已经取消了。正常模式下调用它们没有什么作用，但是不会报错。严格模式明确规定，函数内部使用arguments.callee、arguments.caller将会报错。

##### 禁止删除变量
严格模式下无法删除变量，如果使用delete命令删除一个变量，会报错。只有对象的属性，且属性的描述对象的configurable属性设置为true，才能被delete命令删除。

#### 静态绑定
JavaScript 语言的一个特点，就是允许“动态绑定”，即某些属性和方法到底属于哪一个对象，不是在编译时确定的，而是在运行时（runtime）确定的。

严格模式对动态绑定做了一些限制。某些情况下，只允许静态绑定。也就是说，属性和方法到底归属哪个对象，必须在编译阶段就确定。这样做有利于编译效率的提高，也使得代码更容易阅读，更少出现意外。
##### 禁止使用 with 语句
严格模式下，使用with语句将报错。因为with语句无法在编译时就确定，某个属性到底归属哪个对象，从而影响了编译效果。
##### 创设 eval 作用域
正常模式下，JavaScript 语言有两种变量作用域（scope）：全局作用域和函数作用域。严格模式创设了第三种作用域：eval作用域。

正常模式下，eval语句的作用域，取决于它处于全局作用域，还是函数作用域。严格模式下，eval语句本身就是一个作用域，不再能够在其所运行的作用域创设新的变量了，也就是说，eval所生成的变量只能用于eval内部。

##### arguments 不再追踪参数的变化
变量arguments代表函数的参数。严格模式下，函数内部改变参数与arguments的联系被切断了，两者不再存在联动关系。


#### 向下一个版本的JavaScript过渡
JavaScript 语言的下一个版本是 ECMAScript 6，为了平稳过渡，严格模式引入了一些 ES6 语法。
##### 非函数代码块不得声明函数
ES6 会引入块级作用域。为了与新版本接轨，ES5 的严格模式只允许在全局作用域或函数作用域声明函数。也就是说，不允许在非函数的代码块内声明函数。
```js
'use strict';
if (true) {
  function f1() { } // 语法错误
}

for (var i = 0; i < 5; i++) {
  function f2() { } // 语法错误
}
```
注意，如果是 ES6 环境，上面的代码不会报错，因为 ES6 允许在代码块之中声明函数。

##### 保留字
为了向将来 JavaScript 的新版本过渡，严格模式新增了一些保留字（implements、interface、let、package、private、protected、public、static、yield等）。使用这些词作为变量名将会报错。
```js
function package(protected) { // 语法错误
  'use strict';
  var implements; // 语法错误
}
```

## 异步操作
### 单线程模型
单线程模型指的是，JavaScript 只在一个线程上运行。也就是说，JavaScript 同时只能执行一个任务，其他任务都必须在后面排队等待。

JavaScript 只在一个线程上运行，不代表 JavaScript 引擎只有一个线程。事实上，JavaScript 引擎有多个线程，单个脚本只能在一个线程上运行（称为主线程），其他线程都是在后台配合。

JavaScript 之所以采用单线程，而不是多线程，跟历史有关系。JavaScript 从诞生起就是单线程，原因是不想让浏览器变得太复杂，因为多线程需要共享资源、且有可能修改彼此的运行结果，对于一种网页脚本语言来说，这就太复杂了。如果 JavaScript 同时有两个线程，一个线程在网页 DOM 节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？是不是还要有锁机制？所以，为了避免复杂性，JavaScript 一开始就是单线程，这已经成了这门语言的核心特征，将来也不会改变。

这种模式的好处是实现起来比较简单，执行环境相对单纯；坏处是只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。常见的浏览器无响应（假死），往往就是因为某一段 JavaScript 代码长时间运行（比如死循环），导致整个页面卡在这个地方，其他任务无法执行。JavaScript 语言本身并不慢，慢的是读写外部数据，比如等待 Ajax 请求返回结果。这个时候，如果对方服务器迟迟没有响应，或者网络不通畅，就会导致脚本的长时间停滞。

如果排队是因为计算量大，CPU 忙不过来，倒也算了，但是很多时候 CPU 是闲着的，因为 IO 操作（输入输出）很慢（比如 Ajax 操作从网络读取数据），不得不等着结果出来，再往下执行。JavaScript 语言的设计者意识到，这时 CPU 完全可以不管 IO 操作，挂起处于等待中的任务，先运行排在后面的任务。等到 IO 操作返回了结果，再回过头，把挂起的任务继续执行下去。这种机制就是 JavaScript 内部采用的“事件循环”机制（Event Loop）。

单线程模型虽然对 JavaScript 构成了很大的限制，但也因此使它具备了其他语言不具备的优势。如果用得好，JavaScript 程序是不会出现堵塞的，这就是 Node.js 可以用很少的资源，应付大流量访问的原因。

为了利用多核 CPU 的计算能力，HTML5 提出 Web Worker 标准，允许 JavaScript 脚本创建多个线程，但是子线程完全受主线程控制，且不得操作 DOM。所以，这个新标准并没有改变 JavaScript 单线程的本质。

### 同步任务与异步任务
程序里面所有的任务，可以分成两类：同步任务（synchronous）和异步任务（asynchronous）。

同步任务是那些没有被引擎挂起、在主线程上排队执行的任务。只有前一个任务执行完毕，才能执行后一个任务。

异步任务是那些被引擎放在一边，不进入主线程、而进入任务队列的任务。只有引擎认为某个异步任务可以执行了（比如 Ajax 操作从服务器得到了结果），该任务（采用回调函数的形式）才会进入主线程执行。排在异步任务后面的代码，不用等待异步任务结束会马上运行，也就是说，异步任务不具有“堵塞”效应。

举例来说，Ajax 操作可以当作同步任务处理，也可以当作异步任务处理，由开发者决定。如果是同步任务，主线程就等着 Ajax 操作返回结果，再往下执行；如果是异步任务，主线程在发出 Ajax 请求以后，就直接往下执行，等到 Ajax 操作有了结果，主线程再执行对应的回调函数。

### 任务队列与事件循环
JavaScript 运行时，除了一个正在运行的主线程，引擎还提供一个任务队列（task queue），里面是各种需要当前程序处理的异步任务。（实际上，根据异步任务的类型，存在多个任务队列。为了方便理解，这里假设只存在一个队列。）

首先，主线程会去执行所有的同步任务。等到同步任务全部执行完，就会去看任务队列里面的异步任务。如果满足条件，那么异步任务就重新进入主线程开始执行，这时它就变成同步任务了。等到执行完，下一个异步任务再进入主线程开始执行。一旦任务队列清空，程序就结束执行。

异步任务的写法通常是回调函数。一旦异步任务重新进入主线程，就会执行对应的回调函数。如果一个异步任务没有回调函数，就不会进入任务队列，也就是说，不会重新进入主线程，因为没有用回调函数指定下一步的操作。

JavaScript 引擎怎么知道异步任务有没有结果，能不能进入主线程呢？答案就是引擎在不停地检查，一遍又一遍，只要同步任务执行完了，引擎就会去检查那些挂起来的异步任务，是不是可以进入主线程了。这种循环检查的机制，就叫做事件循环（Event Loop）。维基百科的定义是：“事件循环是一个程序结构，用于等待和发送消息和事件（a programming construct that waits for and dispatches events or messages in a program）”。

### 异步操作模式
#### 回调函数
回调函数是异步操作最基本的方法。
```js
function f1(callback) {
  // ...
  callback();
}

function f2() {
  // ...
}

f1(f2);
```

回调函数的优点是简单、容易理解和实现，缺点是不利于代码的阅读和维护，各个部分之间高度耦合（coupling），使得程序结构混乱、流程难以追踪（尤其是多个回调函数嵌套的情况），而且每个任务只能指定一个回调函数。

#### 事件监听
另一种思路是采用事件驱动模式。异步任务的执行不取决于代码的顺序，而取决于某个事件是否发生。

这种方法的优点是比较容易理解，可以绑定多个事件，每个事件可以指定多个回调函数，而且可以“去耦合”（decoupling），有利于实现模块化。缺点是整个程序都要变成事件驱动型，运行流程会变得很不清晰。阅读代码的时候，很难看出主流程。

#### 发布/订阅模式
事件完全可以理解成“信号”，如果存在一个“信号中心”，某个任务执行完成，就向信号中心“发布”（publish）一个信号，其他任务可以向信号中心“订阅”（subscribe）这个信号，从而知道什么时候自己可以开始执行。这就叫做”发布/订阅模式”（publish-subscribe pattern），又称“观察者模式”（observer pattern）。

这种方法的性质与“事件监听”类似，但是明显优于后者。因为可以通过查看“消息中心”，了解存在多少信号、每个信号有多少订阅者，从而监控程序的运行。

### 异步操作的流程控制
如果有多个异步操作，就存在一个流程控制的问题：如何确定异步操作执行的顺序，以及如何保证遵守这种顺序。
```js
function async(arg, callback) {
  console.log('参数为 ' + arg +' , 1秒后返回结果');
  setTimeout(function () { callback(arg * 2); }, 1000);
}

function final(value) {
  console.log('完成: ', value);
}

async(1, function (value) {
  async(2, function (value) {
    async(3, function (value) {
      async(4, function (value) {
        async(5, function (value) {
          async(6, final);
        });
      });
    });
  });
});
// 参数为 1 , 1秒后返回结果
// 参数为 2 , 1秒后返回结果
// 参数为 3 , 1秒后返回结果
// 参数为 4 , 1秒后返回结果
// 参数为 5 , 1秒后返回结果
// 参数为 6 , 1秒后返回结果
// 完成:  12
```
上面代码的async函数是一个异步任务，非常耗时，每次执行需要1秒才能完成，然后再调用回调函数。如果有六个这样的异步任务，需要全部完成后，才能执行最后的final函数。请问应该如何安排操作流程？六个回调函数的嵌套，不仅写起来麻烦，容易出错，而且难以维护。

#### 串行执行
我们可以编写一个流程控制函数，让它来控制异步任务，一个任务完成以后，再执行另一个。这就叫串行执行。
```js
var items = [ 1, 2, 3, 4, 5, 6 ];
var results = [];

function async(arg, callback) {
  console.log('参数为 ' + arg +' , 1秒后返回结果');
  setTimeout(function () { callback(arg * 2); }, 1000);
}

function final(value) {
  console.log('完成: ', value);
}

function series(item) {
  if(item) {
    async( item, function(result) {
      results.push(result);
      return series(items.shift());
    });
  } else {
    return final(results[results.length - 1]);
  }
}

series(items.shift());
```
上面的写法需要六秒，才能完成整个脚本。

#### 并行执行
流程控制函数也可以是并行执行，即所有异步任务同时执行，等到全部完成以后，才执行final函数。
```js
var items = [ 1, 2, 3, 4, 5, 6 ];
var results = [];

function async(arg, callback) {
  console.log('参数为 ' + arg +' , 1秒后返回结果');
  setTimeout(function () { callback(arg * 2); }, 1000);
}

function final(value) {
  console.log('完成: ', value);
}

items.forEach(function(item) {
  async(item, function(result){
    results.push(result);
    if(results.length === items.length) {
      final(results[results.length - 1]);
    }
  })
});
```
上面代码中，forEach方法会同时发起六个异步任务，等到它们全部完成以后，才会执行final函数。

相比而言，上面的写法只要一秒，就能完成整个脚本。这就是说，并行执行的效率较高，比起串行执行一次只能执行一个任务，较为节约时间。但是问题在于如果并行的任务较多，很容易耗尽系统资源，拖慢运行速度。因此有了第三种流程控制方式。

#### 并行与串行的结合 
所谓并行与串行的结合，就是设置一个门槛，每次最多只能并行执行n个异步任务，这样就避免了过分占用系统资源。
```js
var items = [ 1, 2, 3, 4, 5, 6 ];
var results = [];
var running = 0;
var limit = 2;

function async(arg, callback) {
  console.log('参数为 ' + arg +' , 1秒后返回结果');
  setTimeout(function () { callback(arg * 2); }, 1000);
}

function final(value) {
  console.log('完成: ', value);
}

function launcher() {
  while(running < limit && items.length > 0) {
    var item = items.shift();
    async(item, function(result) {
      results.push(result);
      running--;
      if(items.length > 0) {
        launcher();
      } else if(running === 0) {
        final(results);
      }
    });
    running++;
  }
}

launcher();
```
上面代码中，最多只能同时运行两个异步任务。变量running记录当前正在运行的任务数，只要低于门槛值，就再启动一个新的任务，如果等于0，就表示所有任务都执行完了，这时就执行final函数。

这段代码需要三秒完成整个脚本，处在串行执行和并行执行之间。通过调节limit变量，达到效率和资源的最佳平衡。

### 定时器