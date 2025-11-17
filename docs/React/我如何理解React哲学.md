---
title: 我如何理解React哲学
description: 我对React哲学的看法
sidebar_position: 3
tags: [React, 思考]
date: 2025-11-10
---

React是通过组件化的思路来构建界面的，如果把界面比作一棵树，那么组件就是这棵树上的一片片树叶，它们通过数据这个树枝来相互连接。

## 设计原型拆解
一开始，我们应对要构建的界面UI设计蓝图进行层级化和原子化组件分割，每个组件匹配原型的中的每个部分，这样的思路在搭建[Gridman](https://github.com/beststarli/gridman)前端交互界面基座时便有所体现，这个系统是以VSCode界面为设计原型。
![Gridman基座](/img/docs/react/gridman.png)

可以看到基座Framework组件经过抽象大致可以分割成四个子组件，即IconBar、Explorer、TabBar、Scenario四部分，如果把IconBar作为上层组件，则每个Icon Button是它的子组件；如果把Explorer作为上层组件，对它而言还可以再分出Private Tree和Public Tree两个子组件；如果把TabBar作为上层组件，则每个TabNode又是它的子组件。他们的组织嵌套结构就好像一棵树，也就是组件树，数据在这颗树上的各组件之间流动。
- Framework
    - IconBar
        - Icon Button
    - Explorer
        - Private Tree
        - Public Tree
    - TabBar
        - TabNode
    - Scenario

## 搭建组件空模板
基于HTML、JavaScript、CSS前端三件套思路在React框架下搭建静态界面，实现组件样式与显示层级，形成可复用的静态组件，然后按组件逻辑一步一步添加交互处理方法，暂时不需要考虑状态管理，预留向外暴露`props`接收该组件需要的参数和方法，形成**单向数据流**，数据从树的顶层组件传递到下面的组件。

构建一个静态版本需要写大量的代码，并不需要什么思考; 但添加交互需要大量的思考，却不需要大量的代码。

可以“自上而下”也可以“自下而上”地构建组件，对于简单例子前者合适，反之大型项目后者更合适。

## 思考完整state表示
在开始添加状态之前，应好好地思考哪些结构或是量组织成state，保持**DRY**原则和state的绝对精简。

什么不是state？
- 随着时间推移**保持不变**？如此，便不是state。
- 通过**props从父组件传递**？如此，便不是state。
- 是否可以基于已存在于组件中的**state**或者**props进行计算**？如此，它肯定不是state！

:::info props vs state
- props像是传递给函数的参数，由父组件传给子组件，如果说静态模板是填空题，这些props就像是答案。
- state像组件的内存，它可以保持对一些信息的追踪，根据交互来改变。

props和state不同，但它们共同工作。父组件经常在state中放置一些信息并且作为子组件的属性**向下**传递至它的子组件。
:::

## state应该放哪里
想清楚最小state数据后，我们还需要思考哪些组件通过state实现了响应式或持有这个state。对于每一个state要做的是：
- 验证每一个基于特定state渲染的组件。
- 寻找它们最近并且共同的父组件——在层级结构中，一个凌驾于它们所有组件之上的组件。
- 决定state应该被放置于哪里：
    - 通常情况下，可以直接放置state于它们共同的父组件。
    - 也可以将state放置于它们父组件上层的组件。
    - 如果找不到合适的地方来放这个state，可以单独创建一个新的组件去管理这个state，并将它添加到它们父组件上层的某个地方。

##  添加反向数据流
React使数据流变得明确，但比双向数据绑定需要多写一些代码。为了能通过子组件设置父组件的state，可以为子组件添加onChange事件处理器来监听状态变化以传递给父组件。

## 总结
现在，一个传统的React应用程序就可以成功工作了！