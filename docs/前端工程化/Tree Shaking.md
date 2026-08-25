---
title: Tree Shaking
description: Tree Shaking（摇树）是种静态分析优化手段，可以在构建阶段自动移除未被使用的代码，减少最终包的大小。
sidebar_position: 2
tags: [前端工程化]
date: 2026-01-09
---

# Tree Shaking
## 什么是Tree Shaking
**Tree Shaking**（摇树）是一种在**构建阶段**自动移除「未被使用代码」的优化手段。

它的名字很形象：一棵树如果长得过于茂密，就摇一摇，把不需要的枯枝败叶摇下来。同理，一个模块（Module）里的代码如果有一部分从未被使用，构建工具就可以把它们从最终的产物里「摇」掉，从而减小打包体积。

比如下面这段代码，如果项目里只用到了 `add`，那么构建后 `minus` 和 `PI` 就会被移除：
```js
// utils.js
export function add(a, b) {
  return a + b;
}
export function minus(a, b) {
  return a - b;
}
export const PI = 3.1415926;

// main.js
import { add } from './utils.js';
console.log(add(1, 2));
```

`minus` 和 `PI` 由于没有被引用，被 Tree Shaking 移除了。构建后的产物大概长这样：
```js
function add(a, b) {
  return a + b;
}
console.log(add(1, 2));
```

## 为什么只有 ESModule 才能被 Tree Shaking
Tree Shaking 依赖于 ESModule（ESM）的几个特性：
- **静态导入/导出**：`import` / `export` 语句必须出现在模块顶层，不能在函数、条件语句中，所以构建工具可以在编译时确定每个模块导出了什么、导入了什么。
- **导入导出关系确定**：一个模块的导出可以被明确地追踪到被哪些地方引用，引用关系是静态的、确定的。

而 CommonJS 的 `require` 是**动态**的，可以在运行时根据条件去加载不同的模块，构建工具无法静态分析出它到底会加载什么、会用到哪些导出，所以无法安全地做 Tree Shaking。
```js
// CommonJS 无法被静态分析
const utils = process.env.NODE_ENV === 'development'
  ? require('./utils-dev.js')
  : require('./utils-prod.js');
```

## Tree Shaking 的原理
Tree Shaking 的核心是基于 [AST抽象语法树](/docs/前端工程化/AST抽象语法树) 的静态分析，大致分为三步：
1. **构建模块依赖图（Module Graph）**：构建工具（如 Webpack）从入口文件出发，通过 AST 分析每个模块的 `import` / `export`，把模块间的依赖关系构建成一张依赖图，并记录每个模块的导出有哪些。
2. **标记未被引用的导出（Mark）**：从入口模块开始遍历，凡是「没有被任何地方引用」的导出，就标记为 Dead Code（死代码）。
3. **移除死代码（Sweep）**：使用 Terser 等压缩工具，将标记为死代码的部分剔除，得到最终的产物。

这里引用 [Rollup](https://rollupjs.org/) 官网的经典图：从左边的模块依赖图，摇出右边干净的产物。
```
                 main.js
                /    \
            a.js      b.js      → 经过 Tree Shaking
           /    \        \
       c.js     d.js     e.js       只剩 main.js + a.js
```

## Tree Shaking 的局限性
并不是所有代码都能被安全地摇掉，Tree Shaking 有一个重要的概念叫**副作用（Side Effects）**。如果一段代码在模块被加载时执行了「有副作用」的操作（比如修改全局变量、给 DOM 绑定事件、发起请求），构建工具就不敢轻易移除它，因为即使没人引用它的导出，加载模块这件事本身也会产生效果。
```js
// polyfill.js —— 有副作用，加载即执行
window.customEvent = function () {};
```

即使没有任何人 `import` 这个模块，只要它被 `import` 过，构建工具也会保留它，因为移除它会导致 `window.customEvent` 不存在。

### sideEffects 字段
为了告诉构建工具「我们的包是纯的、没有副作用，可以放心摇」，库的作者会在 `package.json` 中声明 `sideEffects` 字段：
```json
{
  "name": "my-lib",
  "sideEffects": false
}
```
- `false`：表示整个包没有任何副作用，所有代码都可以被摇。
- 数组形式：表示「这些文件是有副作用的，别摇它们」，常用于 CSS、全局样式等。

```json
{
  "sideEffects": [
    "*.css",
    "./src/polyfill.js"
  ]
}
```
如果你没有声明 `sideEffects`，构建工具出于安全考虑会保守处理，很多本可以被移除的代码会残留下来，这也是很多库 Tree Shaking 不生效的常见原因。

## 那些「摇不掉」的情况
即使满足 ESModule 的条件，以下写法也会导致 Tree Shaking 失效：

### 1. 副作用调用
```js
// 即使引入方法执行后的返回值没用到，也会执行一次对应方法，产生副作用
import { add } from './utils.js';
add(1, 2);
```

### 2. 动态导入
```js
// 使用变量作为导入路径，无法静态分析
const name = 'utils';
const mod = await import(`./${name}.js`);
```

### 3. 被整体引用的对象
```js
// import * as utils 会把整个模块的所有导出都标记为「被使用」
import * as utils from './utils.js';

console.log(utils.add(1, 2)); // minus、PI 都被标记为已使用，摇不掉
```

但如果是「具名导入 + 属性访问」，部分构建工具可以识别并继续摇掉：

```js
import { add } from './utils.js';
```

## 生产环境必备配置
### Webpack
Webpack 4+ 在 `mode: 'production'` 下默认开启 Tree Shaking（结合 TerserPlugin）。

```js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,   // 标记未被使用的导出
    minimize: true,      // 交给压缩器移除死代码
  },
};
```

### Vite
Vite 生产构建使用 Rollup，默认开启 Tree Shaking，无需额外配置。

## 总结
- Tree Shaking 是**构建阶段**的优化手段，用于移除未被使用的代码，减小打包体积。
- 它的前提是 **ESModule 的静态性**，CommonJS 无法被安全摇树。
- 核心原理是：构建依赖图 → 标记死代码 → 压缩移除。
- **副作用**是摇树最大的阻碍，库作者应通过 `sideEffects: false` 声明无副作用。
- 写代码时尽量用**具名导出**、避免动态导入和无意义的副作用调用，才能让 Tree Shaking 生效。

## 参考
- [**Webpack Tree Shaking 官方文档**](https://webpack.js.org/guides/tree-shaking/)
- [**Rollup Tree Shaking 官方文档**](https://rollupjs.org/introduction/#tree-shaking)