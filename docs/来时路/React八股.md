---
title: React八股
description: React八股
sidebar_position: 6
date: 2026-06-04
---

# React八股
## React路线图
![路线图](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/react.png)

## React Hooks
### useState
- 使用函数式更新 `setCount(prev => prev + 1)` 可以确保基于最新状态进行更新，避免闭包陷阱。
- 更新对象时必须创建新对象，保持不可变性：`setUser(prev => ({ ...prev, name: newName }))`
- 数组更新同样需要创建新数组：
    - 添加：`[...prev, newItem]`
    - 删除：`prev.filter(item => item.id !== id)`
    - 修改：`prev.map(item => item.id === id ? newItem : item)`
- 惰性初始化：`useState(() => expensiveComputation())` 只有在初始渲染时调用一次。

### useEffect
- useEffect(fn) - 每次渲染后执行
- useEffect(fn, []) - 只在挂载时执行一次
- useEffect(fn, [a, b]) - 当 a 或 b 变化时执行

最佳实践：
- 定时器、事件监听等必须在清理函数中释放资源：return () => clearInterval(intervalId)
- 异步操作要处理竞态条件。
- 避免在 effect 中直接使用异步函数，而是在内部定义。
> 竞态条件：快速切换用户时，旧请求的结果不应该覆盖新请求。 使用 cancelled 标志或 AbortController 来处理。

### useCallback
useCallback(fn, deps) 返回一个 memoized 函数，只有当依赖项变化时，才会返回新的函数引用，配合 React.memo 使用，可以避免子组件不必要的重新渲染。

使用函数式更新 setState(prev => ...) 可以减少 useCallback 的依赖项， 使函数更稳定。

推荐使用场景：
- 函数作为 props 传递给 React.memo 优化的子组件
- 函数作为其他 Hook（如 useEffect）的依赖项
- 函数被频繁传递且创建成本较高

不需要使用的场景：
- 函数只在当前组件内使用，不传递给子组件
- 子组件没有使用 React.memo 优化
- 简单的事件处理函数（过度优化可能适得其反）

### useMemo
useMemo(() => value, deps) 缓存计算结果，只有当依赖项变化时，才会重新执行计算，适用于耗时计算、复杂对象创建、大数据处理等场景。

#### useMemo与useCallback对比
- useMemo 缓存值 const memoizedValue = useMemo(() => computeValue(a, b), [a, b])
- useCallback 缓存函数 const memoizedCallback = useCallback(() => doSomething(a, b), [a, b])
- 等价关系 useCallback(fn, deps) === useMemo(() => fn, deps)

选择建议：
- useMemo: 缓存计算结果、数组、对象等
- useCallback: 缓存函数，作为 props 传递给子组件
- 两者都是为了性能优化，不要过度使用

### 自定义Hook
最佳实践：
- 命名以 use 开头
- 只在顶层调用 Hook，不要在循环、条件或嵌套函数中调用
- 抽取可复用的逻辑，保持组件简洁
- 返回必要的状态和方法，隐藏实现细节
- 使用 TypeScript 定义类型，提高代码可读性

## Ref用法
### Ref API
| API | 使用场景 | 说明 |
| :--- | :--- | :--- |
| `useRef` | 函数组件 | 创建可变的 ref 对象 |
| `createRef` | Class 组件 | 每次渲染创建新的 ref |
| `forwardRef` | 组件封装 | 将 ref 转发给子组件 |
| `useImperativeHandle` | 配合 forwardRef | 自定义暴露给父组件的方法 |
| 回调 Ref | 特殊场景 | 使用函数作为 ref |

使用场景：
- 管理焦点、文本选择或媒体播放
- 触发强制动画
- 集成第三方 DOM 库
- 保存不需要触发重新渲染的可变值（如定时器 ID）

注意：
- 避免过度使用 ref，大多数情况下使用声明式方式更好
- 不要在渲染期间读写 ref.current
- 修改 ref.current 不会触发重新渲染

### 类组件使用createRef
在 Class 组件中，使用 React.createRef() 创建 ref，通常在构造函数中创建并赋值给实例属性：
```tsx
class MyComponent extends Component { 
    constructor(props) { 
        super(props) 
        this.inputRef = createRef() 
    } 

    render() { 
        return <input ref={this.inputRef} /> 
    } 
}
```

### 回调Ref
传递一个函数给 ref 属性，React 会在挂载和卸载时调用它，适用于需要在节点挂载后立即获取信息的场景：
```tsx
// 回调 ref：当 ref 被附加或分离时调用
const measureRef = useCallback((node) => {
    if (node !== null) {
        // node 是 DOM 元素
        setHeight(node.getBoundingClientRect().height)
    }
}, [])

return <div ref={measureRef}>...</div>
```

### forwardRef
使用 forwardRef 可以将 ref 转发给子组件：
```tsx
const FancyInput = forwardRef((props, ref) => { 
    return <input ref={ref} {...props} /> 
}) 
// 使用 
const inputRef = useRef() 
<FancyInput ref={inputRef} /> inputRef.current.focus()
```

### useImperativeHandle
useImperativeHandle 自定义暴露给父组件的实例值，可以限制父组件能访问的方法，而不是暴露整个 DOM：
```tsx
useImperativeHandle(ref, () => ({ 
    play() { 
        ...
    }, 
    pause() { 
        ...
    }, 
    toggle() { 
        ...
    } 
}), [dependencies])
```

### 最佳实践
- 使用 forwardRef 让组件可以接收 ref
- 使用 useImperativeHandle 限制暴露的方法
- 只暴露必要的操作，隐藏实现细节
- 为暴露的方法提供清晰的命名

### 注意事项
- 避免过度使用命令式操作，优先使用 props 和 state
- ref 应该是 "逃生舱口"，用于必须的 DOM 操作
- 不要滥用 useImperativeHandle 暴露过多方法

## 组件通信
### 概述

| 通信类型 | 方式 | 适用场景 |
| :--- | :--- | :--- |
| 父 → 子 | props | 传递数据、配置 |
| 子 → 父 | 回调函数 | 事件通知、状态更新 |
| 父 ↔ 子 | ref | 命令式操作 |
| 兄弟组件 | 状态提升 | 简单共享状态 |
| 跨层级 | Context | 主题、用户信息等 |
| 复杂应用 | Redux/Zustand | 全局状态管理 |

选择建议：
- 优先使用 props 和回调（最简单、最直观）
- 跨多层级使用 Context
- 复杂状态管理使用 Redux/Zustand
- 避免使用 Event Bus（难以追踪数据流）
