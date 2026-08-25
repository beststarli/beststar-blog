---
title: AST抽象语法树
description: 抽象语法树(Abstract Syntax Tree)，简称AST，它是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。
sidebar_position: 4
tags: [前端工程化]
date: 2026-05-11
---

# AST抽象语法树
## 什么是 AST
**抽象语法树**（Abstract Syntax Tree，简称 **AST**）是源代码语法结构的一种**抽象表示**。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。

简单来说就是：编译器/解释器没法直接理解 `const a = 1 + 2` 这种字符串，它需要先把字符串拆解成一棵结构化的树，树上的每个节点代表一个语法单元（比如变量声明、运算表达式、数字字面量），之后才能进一步分析、转换、执行。

它「抽象」是因为：**只保留与语法结构相关的信息，丢弃与语法无关的细节**。比如空格、换行、注释、括号这些符号，在 AST 里通常不会单独出现（括号会体现为节点之间的嵌套关系）。

## 一段代码的 AST 长什么样
以 `const a = 1 + 2;` 为例，它对应的 AST 结构大致如下：
```
VariableDeclaration          // 变量声明
├── kind: "const"
└── declarations
    └── VariableDeclarator   // 变量声明器
        ├── id: Identifier   // 变量名 -> "a"
        └── init: BinaryExpression  // 初始化表达式
            ├── operator: "+"
            ├── left:  Literal 1    // 数字 1
            └── right: Literal 2    // 数字 2
```

很像DOM树，AST 的本质就是一种树形数据结构，只是节点类型不同。用工具可以把真实的 AST 可视化出来。可以安装 `@babel/parser` 解析上面这行代码：
```js
const parser = require('@babel/parser');

const code = 'const a = 1 + 2;';
const ast = parser.parse(code);

console.log(JSON.stringify(ast, null, 2));
```

输出的大致结构（省略部分字段）：
```js
{
  "type": "File",
  "program": {
    "type": "Program",
    "body": [
      {
        "type": "VariableDeclaration",
        "kind": "const",
        "declarations": [
          {
            "type": "VariableDeclarator",
            "id": { "type": "Identifier", "name": "a" },
            "init": {
              "type": "BinaryExpression",
              "operator": "+",
              "left": { "type": "NumericLiteral", "value": 1 },
              "right": { "type": "NumericLiteral", "value": 2 }
            }
          }
        ]
      }
    ]
  }
}
```

## AST 是怎么生成的
源代码从字符串变成 AST，需要经过两步：**词法分析**和**语法分析**，这两步合起来叫**解析（Parsing）**。
### 1. 词法分析（Lexical Analysis）
把源代码拆分成一个个最小的、有意义的单元——**Token**（词法单元），比如关键字 `const`、标识符 `a`、运算符 `+`、数字 `1` 和 `2`、分号 `;`。

```js
// 代码: const a = 1 + 2;
// 词法分析后得到 Token 序列:
[
  { type: 'keyword',  value: 'const' },
  { type: 'identifier', value: 'a' },
  { type: 'punctuator', value: '=' },
  { type: 'number',    value: '1' },
  { type: 'punctuator', value: '+' },
  { type: 'number',    value: '2' },
  { type: 'punctuator', value: ';' },
]
```
负责这一步的工具叫 **Lexer（词法分析器）**，例如 `@babel/tokenizer`。

### 2. 语法分析（Syntactic Analysis）
根据语言的语法规则，把 Token 序列组合成带有层级关系的树形结构，也就是 AST。负责这一步的工具叫 **Parser（语法分析器）**，例如 `@babel/parser`（Babel 的解析器）、`acorn`、`espree`（ESLint 用的解析器）。

## 常见节点类型
AST 的节点类型在社区有统一的规范，叫 [**ESTree 规范**](https://github.com/estree/estree)，Babel 在它的基础上做了一些扩展（`@babel/types`）。常见的有：

| 类别 | 节点类型 | 含义 |
| --- | --- | --- |
| 字面量 | `NumericLiteral` / `StringLiteral` / `BooleanLiteral` | 数字 / 字符串 / 布尔值 |
| 标识符 | `Identifier` | 变量名、函数名等 |
| 表达式 | `BinaryExpression` / `CallExpression` / `MemberExpression` | 二元运算 / 函数调用 / 属性访问 |
| 语句 | `VariableDeclaration` / `FunctionDeclaration` / `IfStatement` / `ReturnStatement` | 变量声明 / 函数声明 / 条件语句 / 返回语句 |
| 类 | `ClassDeclaration` / `ClassMethod` | 类声明 / 类方法 |
| 模块 | `ImportDeclaration` / `ExportNamedDeclaration` | 导入 / 具名导出 |

## 遍历和修改 AST
拿到 AST 后，通常会做三件事：**遍历（Traversal）、修改（Transformation）、生成代码（Generate）**。Babel 的工作流程就是典型的代表：

```
源代码 --解析--> AST --转换--> 修改后的AST --生成--> 目标代码
```

- **解析**：`@babel/parser` 把源代码转成 AST
- **转换**：`@babel/traverse` 深度优先遍历 AST，访问并修改节点
- **生成**：`@babel/generator` 把修改后的 AST 重新生成为代码字符串

Babel 插件本质上就是定义了一些**访问器（Visitor）**，当遍历到对应类型的节点时执行你的逻辑：

```js
const babel = require('@babel/core');

const code = 'const a = 1 + 2;';

const result = babel.transformSync(code, {
  plugins: [
    {
      visitor: {
        BinaryExpression(path) {
          // 把 a + b 转换成 a - b
          path.node.operator = '-';
        },
      },
    },
  ],
});

console.log(result.code); // "const a = 1 - 2;"
```

## AST 的应用场景
前端工程化中几乎所有的工具，底层都在操作 AST：
- **代码转换**：Babel 把 ES6+ 的新语法编译成低版本浏览器能运行的代码；`babel-plugin-import` 按需引入组件库。
- **静态检查**：ESLint 基于 AST 检查代码规范、找出潜在 Bug；TypeScript 编译器把 TS 源码转成 AST 再做类型检查。
- **代码压缩**：Terser、UglifyJS 通过 AST 识别可以合并、缩短的代码。
- **[Tree Shaking](/docs/前端工程化/Tree Shaking)**：构建工具通过 AST 分析 `import` / `export` 的引用关系，标记并移除未被使用的代码。
- **代码格式化**：Prettier 将代码解析成 AST 后再按统一风格重新打印输出。
- **代码高亮**：PrismJS、Shiki 等工具解析代码生成带语义的 token 再进行渲染。
- **编辑器工具**：VSCode 的智能提示、跳转定义、重命名，都依赖解析器产生的 AST 和 Symbol 表。

## 总结
- **AST** 是源代码语法结构的树形抽象，剥离了空格、注释等无关信息，只保留语法语义。
- 生成过程分两步：**词法分析**（拆成 Token）→ **语法分析**（组合成树）。
- 社区通过 **ESTree 规范**统一了 AST 的节点类型，工具之间可以共用解析结果。
- 前端工程化中，**Babel、ESLint、Terser、Prettier、Tree Shaking** 等几乎所有工具，本质上都是「解析成 AST → 处理 AST → 生成新代码」。

## 参考
- [**ESTree 规范**](https://github.com/estree/estree)
- [**Babel 插件手册**](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md)
- [**astexplorer 在线查看 AST**](https://astexplorer.net/)