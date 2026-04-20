---
title: Vue2与Vue3的区别
description: Vue2与Vue3在多个方面存在显著差异。
sidebar_position: 2
tags: [Vue2,Vue3]
date: 2026-04-20
---

## Vue3框架的优势
- 首次渲染更快
- diff算法更快
- 内存占用更少
- 打包体积更小
- 更好的Typescript支持
- `Composition API`组合 API

## 生命周期
对于生命周期来说，整体上变化不大，只是大部分生命周期钩子名称添加了`on`，功能上是类似的。

不过有一点需要注意，Vue3在Composition API中使用生命周期钩子时需要先引入，而Vue2在Options API中可以直接调用生命周期钩子。

| Vue2          | Vue3             | 说明 |
|---------------|------------------|------|
| `beforeCreate` | `setup()`        | 组件创建之前，执行初始化任务 |
| `created`      | `setup()`        | 组件创建完成，访问数据、获取接口数据 |
| `beforeMount`  | `onBeforeMount`  | 组件挂载之前 |
| `mounted`      | `onMounted`      | 组件挂载完成，DOM已创建，可访问数据或DOM元素、访问子组件 |
| `beforeUpdate` | `onBeforeUpdate` | 数据更新前，获取更新前的所有状态 |
| `updated`      | `onUpdated`      | 组件更新完成，DOM已更新，可访问最新DOM元素 |
| `beforeDestroy` | `onBeforeUnmount` | 组件销毁前，获取销毁前的所有状态 |
| `destroyed`    | `onUnmounted`    | 组件销毁之后 |
> `setup`是围绕`beforeCreate`和`created`生命周期钩子运行的，所以不需要显式地去定义。

## Composition API（组合式API）
Vue2是Options API（选项API），一个逻辑会散乱在文件不同位置（`data`、`props`、`computed`、`watch`、生命周期钩子等），导致代码的可读性变差。当需要修改某个逻辑时，需要上下来回跳转文件位置。

Vue3的Composition API（组合式API）则很好地解决了这个问题，可将同一逻辑的内容写到一起，增强了代码的可读性、内聚性，其还提供了较为完美的逻辑复用性方案。所有逻辑在`setup`函数中，使用`ref`、`watch`等函数组织代码。

![difference-1](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/vue/difference-1.png)

## Setup函数
setup函数是组合式API的入口函数，默认导出配置选项，`setup`函数声明，返回模板需要数据与函数。
- `setup`函数是Vue3特有的选项，作为组合式API的起点。
- 从组件生命周期看，它在`beforeCreate`之前执行。
- 函数中`this`不是组件实例，是`undefined`。
- 如果数据或者函数在模板中使用，需要在`setup`返回。
- 今后在Vue3的项目中几乎用不到`this`, 所有的东西通过函数获取。

## 响应式原理
### 原理
- Vue2响应式原理是利用ES5的`Object.defineProperty()`对数据进行劫持结合发布订阅模式来实现。
- Vue3响应式原理是利用ES6的`proxy`对数据代理，通过`reactive()`函数给每一个对象都包一层`proxy`，通过`proxy`监听属性的变化，从而实现对数据的监控，解决了Vue2无法监听新增/删除属性、数组下标修改、对象嵌套层级过深等问题。

### Object.defineProperty()的缺陷
- 对象新增、删除属性没有响应式
- 数组新增、删除元素没有响应式
- 通过下标修改某个元素没有响应式
- 通过`.length`改变数组长度没有响应式
- 只有实例创建时`data`中有的数据实例创建后才是响应式的，给已创建好的Vue实例`data`对象中添加属性时，数据虽然会更新，但视图不会更新，不具有响应式

### Proxy的优势
- `proxy`性能整体上优于`Object.defineProperty()`
- Vue3支持更多数据类型的劫持：
    - Vue2只支持Object、Array
    - Vue3支持Object、Array、Map、WeakMap、Set、WeakSet
- Vue3支持更多时机来进行依赖收集和触发通知：
    - Vue2只在get时进行依赖收集，Vue3在get/has/iterate时进行依赖收集
    - Vue2只在set时触发通知，Vue3在set/add/delete/clear时触发通知，所以Vue2中的响应式缺陷Vue3可以实现
- Vue3做到了“精准数据”的数据劫持：
    - Vue2会把整个data进行递归数据劫持
    - Vue3只有在用到某个对象时，才进行数据劫持，所以响应式更快并且占存更小
- Vue3的依赖收集器更容易维护：
    - Vue3监听和操作的是原生数组
    - Vue2是通过重写的方法实现对数组的监控

## reactive()和ref()
### reactive()
通常使用它定义复杂类型的响应式数据，使用方法：
- 从`vue`中导入`reactive()`函数
- 在`setup`函数中，使用`reactive()`函数，传入一个普通对象，返回一个响应式数据对象
- 最后`setup`函数返回一个对象，包含该响应式对象即可，模板中可使用

### ref()
使用它定义响应式数据，不限类型，使用方法：
- 从`vue`中导入`ref()`函数
- 在`setup`函数中，使用`ref()`函数，传入普通数据（简单or复杂），返回一个响应式数据
- 最后`setup`函数返回一个对象，包含该响应式数据即可
- 注意：使用`ref`创建的数据，js中需要`.value`，template中可省略

### 如何选择
- `reactive()`可以转换对象成为响应式数据对象，但是不支持简单数据类型。
- `ref()`可以转换简单数据类型为响应式数据对象，也支持复杂数据类型，但是操作的时候需要`.value`。
- 它们各有特点，现在也没有最佳实践，没有明显的界限，所有大家可以自由选择。
- 如果能确定数据是对象且字段名称也确定，可使用`reactive()`转成响应式数据，其他一概使用`ref()`。
- 在定义响应式数据的函数选择上，遵循：尽量使用`ref()`函数支持所有场景，确定字段的对象使用`reactive()`可以省去`.value`。

## Hooks
Hooks在前端领域并没有明确定义，借用知乎大佬的定义：在JS里是callback，事件驱动，集成定义一些可复用的方法。官方对自定义Hook定义：在Vue应用的概念中，“组合式函数” (Composables) 是一个利用Vue组合式API来封装和复用有状态逻辑的函数。

### Vue3自定义Hooks
一些可复用的方法像钩子一样挂着，可以随时被引入和调用以实现高内聚低耦合的目标，都可以算是Hook。

以函数形式抽离一些**可复用的方法**像钩子一样挂着，随时可以引入和调用，实现**高内聚低耦合**的目标；
1. 将可复用功能抽离为外部JS文件
2. 函数名/文件名以`use`开头，形如：`useXX`
3. 引用时将响应式变量或者方法显式解构暴露出来如：`const {nameRef，Fn} = useXX()`（在`setup`函数解构出自定义hooks的变量和方法）

### Vue3自定义Hooks和Vue2时代Mixin的关系
#### Mixin/Class的局限性
在以往Vue2的选项式API中，主要通过`Mixin`或是`Class`继承来实现逻辑复用，但这种方式有三个明显的**短板**：
- **不清晰的数据来源**：当使用了多个`mixin`/`class`时，哪个数据是哪个模块提供的将变得难以追寻，这将提高维护难度
- **命名空间冲突**：来自多个`class`/`mixin`的开发者可能会注册同样的属性名，造成冲突
- **隐性的跨模块交流**：不同的`mixin`/`class`之间可能存在某种相互作用，产生未知的后果

#### Hooks的优势
其实`Mixin`/`Class`的缺点反过来就是`Hooks`的优点：
- **清晰一目了然的源头**：Hooks不是一个类，没有将状态、方法存放在对象中，然后通过导出对象的形式实现复用，也就不会有对象间过度**耦合**、**干扰**等问题。Hooks中的各类状态是封装在内部的，与外界隔离，仅暴露部分函数、变量，这使得其来源、功能**清晰可辨**且**不易被干扰**
- **没有命名冲突的问题**：Hooks本质是闭包函数，内部所导出的变量、方法支持重命名，因而同一个Hook在同一个组件中可以N次使用而不冲突
- **精简逻辑**：一个Hook开发完成后，在使用Hook时不需要关心其内部逻辑，只需知道有什么效果、如何使用即可，专注于其他核心业务逻辑，可以节省大量重复代码

### Hooks的各类规范
- Hook的命名需要以`use`开头，比如`useTimeOut`，这是约定俗成的，开发者看到`useXXX`即可明白这是一个Hook。Hook的名称需要清楚地表明其功能。
- 只在当前关注的最顶级作用域使用Hook，而不要在嵌套函数、循环中调用Hook
- 函数必须是纯函数，没有副作用
- 返回值是一个函数或数据，供外部使用
- Hook内部可以使用其他的Hook，组合功能
- 数据必须依赖于输入，不依赖于外部状态，保持数据流的明确性
- 在Hook内部处理错误，不要把错误抛出到外部，否则会增加hook的使用成本
- Hook是单一功能的，不要给一个Hook设计过多功能。

### 如何创建自定义Hook
在设计一个定制的Hook之前，应当至少明白以下几点：
- 明确自己想要的功能以及实现的效果
- 遵守Hook的命名规范以及其他注意事项
- 尽可能好的性能表现以及精简的代码
- 使用TypeScript

## 编译优化
Vue3加入`patchFlag`（标记动态节点）、`hoistStatic`（静态节点提升）等优化，减少Diff对比时间，渲染性能比Vue2提升明显。

Vue3支持Tree-shaking，能按需打包，剔除未使用的代码，打包体积比Vue2更小。

## 新增特性
Vue3新增`Fragments`（无根节点）、`Teleport`（瞬移组件）、`Suspense`（异步组件加载）等功能，拓展了框架的使用场景。

## 参考
- [**Vue3和Vue2的区别**](https://juejin.cn/post/7260748045309837349)
- [**Vue2 和 Vue3 最大区别是什么？（面试必问，建议收藏）**](https://juejin.cn/post/7627135662010269750?searchId=20260420152826FDC048199BACEC3101D3)
- [**Vue2 和Vue3的区别**](https://juejin.cn/post/7502246437372346409?searchId=202604201528558E9C6A1536D32D19A9B8)