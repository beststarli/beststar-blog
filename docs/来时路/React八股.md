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

### 父子通信
| 方向 | 方式 | 适用场景 |
| :--- | :--- | :--- |
| 父 → 子 | props | 传递数据、配置 |
| 子 → 父 | 回调函数 | 事件通知、数据更新 |
| 父 → 子 | ref | 命令式操作（聚焦、动画） |
| 双向 | render props | 复杂逻辑复用 |

#### 传递+回调函数（最常用）
- 父 → 子：通过 props 传递数据
- 子 → 父：通过回调函数（callback）通知父组件
```tsx
// 父组件
<Child 
    // 父 -> 子 
    value={parentValue} 
    // 子 -> 父 
    onChange={handleChange} 
/> 

// 子组件 
function Child({ value, onChange }) { 
    return ( 
    <div> 
        <p>接收: {value}</p> 
        <input onChange={(e) => onChange(e.target.value)} /> 
        </div> 
    ) 
}
```

#### 通过Ref调用子组件方法（命令式）
使用forwardRef + useImperativeHandle，父组件可以直接调用子组件暴露的方法：
```tsx
// 子组件 
const Child = forwardRef((props, ref) => { 
    useImperativeHandle(ref, () => ({ someMethod() { ... } })) 
    return <div>...</div> 
}) 

// 父组件 
const childRef = useRef() 
<Child ref={childRef} /> 
childRef.current.someMethod()
```
**注意**：命令式操作应该谨慎使用，大多数情况下props+回调是更好的选择，只有在需要直接操作子组件（聚焦、动画）时才使用ref。

#### children和Render Props模式
children可以是函数，实现更灵活的数据传递，这种模式称为“render props”或“function as children”：
```tsx
// 容器组件 
function DataProvider({ children }) { 
    const [data, setData] = useState({...}) 
    return children({ data, setData }) 
}

// 使用 
<DataProvider> 
    {({ data, setData }) => ( <div>{data.name}</div> )} 
</DataProvider>
```

### 兄弟组件通信
| 方式 | 优点 | 缺点 | 适用场景 |
| :--- | :--- | :--- | :--- |
| 状态提升 | 简单、直观 | 多层传递繁琐 | 简单的共享状态 |
| Context | 跨层级、避免 props drilling | 所有消费者重新渲染 | 主题、用户信息等 |
| Event Bus | 完全解耦 | 难以追踪数据流 | 不推荐，用 Redux 代替 |
| Redux/Zustand | 可预测、可调试 | 学习成本 | 复杂应用状态管理 |

#### 状态提升
将共享状态提升到最近的共同父组件，父组件管理状态，通过props传递给子组件：
```tsx
// 父组件管理共享状态
function Parent() { 
    const [sharedState, setSharedState] = useState() 
    return ( 
        <> 
            <SiblingA state={sharedState} onChange={setSharedState} /> 
            <SiblingB state={sharedState} onChange={setSharedState} /> 
        </> 
    ) 
}
```

#### Context API
使用Context在组件树中共享数据，无需逐层传递props。适合跨多层级的状态共享：
```tsx
// 创建 Context 
const MyContext = createContext() 
// Provider 提供数据 
<MyContext.Provider value={{ data, setData }}> 
    <App /> 
</MyContext.Provider> 
// 消费数据 
const { data, setData } = useContext(MyContext)
```

#### 事件总线Event Bus
发布订阅模式，组件之间完全解耦，适合复杂的跨组件通信，但要注意内存泄漏：
```tsx
// 创建事件总线
const eventBus = createEventBus() 
// 订阅（在 useEffect 中） 
useEffect(() => { 
    const unsubscribe = eventBus.on('event', handler) 
    // 清理 
    return unsubscribe 
}, []) 
// 发布 
eventBus.emit('event', data)
```

**注意**：
- 必须在组件卸载时取消订阅，防止内存泄漏
- 事件总线使数据流变得难以追踪，谨慎使用
- 推荐使用Redux、Zustand等状态管理库代替

### Hooks组件与Class组件互操作
可以做的事情：
- Hooks 组件可以渲染 Class 组件
- Class 组件可以渲染 Hooks 组件
- 可以通过 props 互相传值
- 可以通过 ref 调用对方暴露的方法
- 可以自由嵌套和组合

**注意**：
- Hooks 只能在函数组件或自定义 Hook 中使用
- Class 组件无法直接使用 Hooks
- 推荐新项目使用 Hooks，保持代码风格一致
- 渐进式迁移：可以逐步将 Class 组件改写为 Hooks

#### Hooks组件调用Class组件
Hooks组件可以直接使用Class组件，通过ref可以访问Class组件的实例方法：
```tsx
// Hooks 组件中使用 Class 组件 
function HooksComponent() { 
    const classRef = useRef(null) 
    return ( 
        <> 
            <ClassComponent ref={classRef} /> 
            <button onClick={() => classRef.current.someMethod()}> 
                调用 Class 方法 
            </button> 
        </> 
    ) 
}
```

#### Class组件调用Hooks组件
Class 组件可以直接使用 Hooks 组件，Hooks 组件需要使用 forwardRef + useImperativeHandle 暴露方法：
```tsx
// Class 组件中使用 Hooks 组件 
class ClassComponent extends Component { 
    constructor(props) { 
        super(props) 
        this.hooksRef = createRef() 
    } 
    
    render() { 
        return ( 
            <> 
                <HooksComponent ref={this.hooksRef} /> 
                <button onClick={() => this.hooksRef.current?.someMethod()}> 
                    调用 Hooks 方法 
                </button> 
            </> 
        ) 
    } 
}
```

#### Hooks和Class组件混合使用
Hooks 组件和 Class 组件可以自由混合使用，它们可以互相嵌套、传值、通过 ref 互相调用。

## 状态管理演示（Redux Toolkit）
### 概述
Redux Toolkit 是官方推荐的 Redux 写法，大大简化了 Redux 的使用。

| API | 说明 |
| :--- | :--- |
| `configureStore` | 简化 store 配置，自动添加中间件和 DevTools |
| `createSlice` | 自动生成 action creators 和 action types |
| `createAsyncThunk` | 处理异步逻辑，自动管理 pending/fulfilled/rejected |
| `createSelector` | 创建 memoized selector，避免重复计算 |

Redux Toolkit优势：
- 代码量减少 50%+
- 内置 Immer，可以直接"修改"状态
- TypeScript 友好
- 自动配置 Redux DevTools

### 计数器（基础Redux操作）
基本的Redux操作：dispatch action、select state：
```tsx
// 使用 useSelector 获取状态 
const count = useSelector(state => state.counter.value) 
// 使用 useDispatch 派发 action 
const dispatch = useDispatch() dispatch(increment())
```

### Todo List（数组操作和Selectors）
展示复杂状态操作和 createSelector 的使用：
```tsx
// 使用 createSelector 创建 memoized selector
const selectFilteredTodos = createSelector([selectTodos, selectFilter], (todos, filter) => { 
    // 只有 todos 或 filter 变化时才重新计算 
    return todos.filter(...) 
})
```

### 用户信息（异步操作-createAsyncThunk）
展示异步操作：createAsyncThunk 自动处理 pending/fulfilled/rejected 状态：
```tsx
// 创建异步 thunk
const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId, { rejectWithValue }) => {
    const response = await api.getUser(userId)
    return response.data
  }
)

extraReducers: (builder) => {
  builder
    .addCase(fetchUser.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchUser.fulfilled, (state, action) => {
      state.data = action.payload
    })
    .addCase(fetchUser.rejected, (state, action) => {
      state.error = action.payload
    })
}
```

## React Router演示
### 概述
| 组件/Hook | 说明 |
| :--- | :--- |
| `BrowserRouter` | 使用 HTML5 History API 的路由器 |
| `Routes/Route` | 定义路由配置 |
| `Link/NavLink` | 导航链接 |
| `useNavigate` | 编程式导航 |
| `useParams` | 获取路由参数 |
| `useSearchParams` | 获取/设置查询参数 |
| `useLocation` | 获取当前位置信息 |
| `Outlet` | 嵌套路由的出口 |

### 路由配置
```tsx
// 路由配置示例 
<Routes> 
    <Route path="/" element={<Home />} /> 
    <Route path="/users" element={<UserList />} /> 
    <Route path="/users/:userId" element={<UserDetail />} /> 
    <Route path="/search" element={<SearchPage />} /> 
    <Route path="*" element={<NotFound />} /> 
</Routes>
```

### 编程式导航
```tsx
// 使用 useNavigate 
const navigate = useNavigate() 
// 跳转到指定路径 
navigate('/users') 
// 带参数跳转 
navigate('/users/1') 
// 带查询参数 
navigate('/search?q=react') 
// 返回上一页 
navigate(-1) 
// 替换当前历史记录 
navigate('/login', { replace: true }) 
// 传递状态 
navigate('/detail', { state: { from: 'home' } })
```

### 路由守卫（Protected Routes）
```tsx
// 创建受保护的路由组件 
function ProtectedRoute({ children }) { 
    // 自定义 Hook 检查登录状态 
    const isAuthenticated = useAuth() 
    const location = useLocation() 
    if (!isAuthenticated) { 
        // 重定向到登录页，保存来源路径 
        return <Navigate to="/login" state={{ from: location }} replace /> 
    } 
    return children 
} 
// 使用 
<Route path="/dashboard" element={ 
    <ProtectedRoute> 
        <Dashboard /> 
    </ProtectedRoute> 
}/>
```
**提示**：路由守卫可以用于权限控制、登录验证等场景。

## React事件机制
```tsx
<div onClick={this.handleClick.bind(this)}>Click Me</div>
```
React并不是将Click事件绑定到了div的真实DOM上，而是在document处监听了所有事件，当事件发生并且冒泡到document处的时候，React将事件内容封装并交由真正的处理函数运行。这样的方式不仅仅减少了内存的消耗，还能在组件挂载销毁时统一订阅和移除事件。

除此之外，冒泡到document上的事件也不是原生的浏览器事件，而是由React自己实现的合成事件（SyntheticEvent）。因此如果不想要是事件冒泡的话应该调用event.preventDefault()，而不是event.stopPropagation()。
![合成事件](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/合成事件.jpg)
JSX上写的事件并没有绑定在对应的真实DOM上，而是通过事件代理的方式，将所有的事件都统一绑定在了document上。这样的方式不仅减少了内存消耗，还能在组件挂载销毁时统一订阅和移除事件。

另外，冒泡到document上的事件也不是原生浏览器事件，而是React自己实现的合成事件（SyntheticEvent）。因此如果不想要事件冒泡的话应该调用event.preventDefault()，而不是event.stopPropagation()。

实现合成事件的目的：
- 合成事件抹平了浏览器兼容问题，这是一个跨浏览器原生事件包装器，赋予了跨浏览器开发的能力
- 对于原生浏览器事件来说，浏览器会给监听器创建一个事件对象。如果有很多事件监听就需要分配很多的事件对象，造成高额的内存分配问题。但是对于合成事件来说，有一个事件池专门来管理它们的创建和销毁，当事件需要被使用时就会从池子中复用对象，事件回调结束后就会销毁事件对象上的属性，从而便于下次复用事件对象。

## React事件和普通HTML事件的区别
- 对于事件名称命名方式，原生事件为全小写，React事件采用小驼峰
- 对于事件函数处理语法，原生事件为字符串，React事件为函数
- React事件不能采用return false的方式来阻止浏览器的默认行为，而必须要明确地调用preventDefault()方法来阻止默认行为

合成事件是React模拟原生DOM事件所有能力的一个事件对象，优点如下：
- 兼容所有浏览器，更好的跨平台支持
- 将事件统一存放在一个数组中，避免频繁的新增与删除（垃圾回收）
- 方便React统一管理和事务机制

事件的执行顺序为原生事件先执行，合成事件后执行，合成事件会冒泡绑定到document上，所以尽量避免原生事件与合成事件混用，如果原生事件阻止冒泡，可能会导致合成事件不执行，因为需要冒泡到document上合成事件才会执行。

## React组件事件代理
React基于Virtual DOM实现了一个SyntheticEvent层，所有的事件处理器会接收到一个合成事件对象的实例，符合W3C标准，且与原生的浏览器事件拥有同样的接口，支持冒泡机制，所有的事件都自动绑定在最外层上。

在React底层，主要对合成事件做了两件事：
- 事件委派：React会把所有的事件绑定到结构的最外层，使用统一的事件监听器，这个事件监听器上维持了一个映射来保存所有组件内部事件监听和处理函数。
- 自动绑定：React组件中，每个方法的上下文都会指向该组件的实例，即自动绑定this为当前组件。

## React高阶组件、Render Props、Hooks组件
这三者是目前React解决代码复用的主要方式：
- 高阶组件（HOC）是React中用于复用组件逻辑的一种高级技巧，HOC本身不是React API的一部分，它是一种基于React的组合特性而形成的设计模式。具体而言，高阶组件是参数为组件，返回值为新组件的函数。
- render props是指一种在React组件之间使用一个值为函数的prop共享代码的简单技术，具体来说render prop是一个用于告知组件需要渲染什么内容的函数prop。
- 通常，render props和高阶组件只渲染一个子节点，让Hook来服务这个使用场景更加简单。这两种模式仍有存在价值，例如，一个虚拟滚动条组件或许会有一个renderItem属性，或是一个可见的容器组件或许会有它自己的DOM结构。但在大部分场景下Hooks组件就足够了，并且能够减少嵌套。

### 高阶组件HOC
高阶组件HOC是React中用于复用组件逻辑的一种高级技巧，HOC本身不是React API的一部分，它是一种基于React的组合特性而形成的设计模式。HOC接受一个组件和额外的参数（如果需要），返回一个新的组件，HOC是纯函数，没有副作用。
```tsx
// HOC定义
function withSubscription(WrappedComponent, selectData) {
    return class extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                data: selectData(DataSource, props)
            }
        }

        // 一些复用逻辑
        render() {
            // ...使用新数据渲染被包装的组件
            return <WrappedComponent data={this.state.data} {...this.props} />
        }
    }
}
// 使用HOC
const BlogPostWithSubscription = withSubscription(BlogPost, (DataSource, props) => DataSource.getBlogPost(props.id))
```
HOC的优缺点：
- 优点：逻辑复用、不影响被包裹组件的内部逻辑
- 缺点：HOC传递给被包裹组件的props容易和被包裹后的组件重名，进而被覆盖

### Render props
render props是指一种在React组件之间使用一个值为函数的prop共享代码的简单技术。具有render prop的组件接受一个返回React元素的函数，将render的渲染逻辑注入到组件内部，这里“render”的命名可以是任何其他有效的标识符。
```tsx
// DataProvider组件内部的渲染逻辑如下
class DataProvider extends React.Components {
    state = {
        name: 'React'
    }

    render() {
        return (
            <div>
                <p>共享数据组件自己内部的渲染逻辑</p>
                {/* 将数据传递给render prop */}
                {this.props.render(this.state)}
            </div>
        )
    }
}
// 调用方式
<DataProvider render={(data) => (
    <h1>Hello {data.name}</h1>
)} />
```
Render props的优缺点：
- 优点：数据共享、代码复用，将组件内的state作为props传递给调用者，将渲染逻辑交给调用者
- 缺点：无法在return语句外访问数据、嵌套语法不够优雅

### Hooks组件
Hooks组件是React 16.8引入的一种新的组件编写方式，Hooks组件可以在不编写class的情况下使用state以及其他的React特性，通过自定义Hook可以实现代码逻辑复用：
```tsx
// 自定义一个获取订阅数据的Hook
function useSubscription() {
    const data = DataSource.getComments()
    return [data]
}
function CommentList(props) {
    const {data} = props
    const [subData] = useSubscription()
    ...
}
// 使用
<CommentList data='hello'/>
```
Hook解决了HOC的prop覆盖问题，同时使用的方式解决了render props的嵌套地狱问题，Hook的优点：
- 使用直观
- 解决HOC的prop重名问题
- 解决render props因共享数据而出现嵌套地狱的问题
- 解决能在return之外使用数据的问题

Hook只能在组件顶层使用，不可以在分支语句中使用。

## React Fiber
React V15在渲染时，会递归比对Virtual DOM树，找出需要变动的节点，然后同步更新它们，这个过程期间，React会占据浏览器资源，会导致用户触发的事件得不到响应，并且会导致掉帧使用户感到卡顿。

为了给用户通过更流畅的体验，不能让一个任务长期霸占资源，可以讲浏览器的渲染、布局、绘制、资源加载（例如HTML解析）、事件响应、脚本执行视作操作系统的“进程”，需要通过某些调度策略合理地分配CPU资源，从而提高浏览器的用户响应速率，同时兼顾任务执行效率。React通过Fiber架构让这个执行过程变得可被中断，“适时”地让出CPU执行权，除了可以让浏览器及时地响应用户的交互，另外：
- 分批延时对DOM进行操作，避免一次性操作大量DOM节点，可以得到更好的用户体验
- 给浏览器一点喘息的机会，会对代码进行编译优化（JIT）及进行热代码优化，或者对reflow进行修正

**核心思想**：Fiber也称协程或者纤程，与线程不同，协程本身没有并发或者并行能力，需要配合线程，它只是一种控制流程的让出机制。让出CPU的执行权，让CPU能在这段时间执行其他的操作。渲染的过程可以被中断，可以将控制权交回浏览器，让位给高优先级的任务，浏览器空闲后再恢复渲染。

## React.Component和React.PureComponent
PureComponent表示一个纯组件，可以用来优化React程序，减少render函数执行的次数，从而提高组件的性能。在React中，当prop或者state发生变化时，可以通过在shouldComponentUpdate生命周期函数中执行return false来阻止页面的更新，从而减少不必要的render执行。React.PureComponent会自动执行shouldComponentUpdate。

不过pureComponent中的shouldComponentUpdate()进行的是浅比较，也就是说如果是引用数据类型的数据，只会比较不是同一个地址，而不会比较这个地址里面的数据是否一致。浅比较会忽略属性或状态突变情况，其实也就是数据引用指针没有变化，而数据发生改变的时候render是不会执行的。如果需要重新渲染那么就需要重新开辟空间引用数据。pureComponent一般会用在一些纯展示组件上。

使用pureComponent的好处是当组件更新时，如果组件的props或者state都没有改变，render函数就不会触发。省去虚拟DOM的生成和对比过程，达成提升性能的目的，这是因为React自动做了一层浅比较。

## Component、Element、Instance
- Componnet组件：可以通过多种方式声明。可以是带有一个render()方法的类，简单点也可以定义为一个函数。这两种情况下它都把属性props作为输入，把返回的一棵元素树作为输出。
- Element元素：是一个普通对象（plain object），描述了对于一个DOM节点或者其他组件component想让它在屏幕上呈现成什么样子。元素Element可以在它的属性props中包含其他元素用于形成元素树。创建一个React元素Element成本很低，元素Element创建后是不可变的。
- Instance实例：一个实例Instance是在所写的组件类Component Class中使用关键字this所指向的东西，即组件实例。它用来存储本地状态和响应生命周期事件很有用。

函数式组件根本没有实例Instance，类组件有实例Instance，但是永远也不需要直接创建一个组件的实例，因为React会在需要时自动创建。

## React.createClass和extends Component的区别
### 语法
- createClass本质上是一个工厂函数，extends的方式更加接近ES6规范的class写法。两种方式在语法上的差别主要体现在方法的定义和静态属性的声明上。
- createClass方式的方法定义使用逗号分隔，因为createClass本质上是一个函数，传递给它的是一个object，而class的方式定义方法时务必谨记不能用逗号隔开，这是ES6 class的语法要求。

### propTypes和getDefaultProps
- React.createClass：通过propTypes对象和getDefaultProps()方法来设置和获取props
- React.Component：通过设置两个属性propTypes和defaultProps来设置和获取props

### 状态
- React.createClass：通过getInitialState()方法返回一个包含初始值的对象
- React.Component：通过constructor设置初始状态

### this
- React.createClass：正确绑定this
- React.Component：由于使用了ES6，会有一些不同，属性并不会自动绑定到React类的实例上

### Mixins
- React.createClass：使用React.createClass的话可以在创建组件时添加一个叫做mixins的属性，并将可供混合的类的集合以数组的形式赋给mixins。
- 如果使用ES6的方式来创建组件，那么React mixins的特性将不能被使用了。

## React高阶组件与普通组件的区别
高阶组件HOC是一个函数，且该函数接收一个组件作为参数，并返回一个新的组件，它只是一种组件的设计模式，这种设计模式是由React自身的组合性质必然产生的，将它们称为纯组件，因为它们可以接受任何动态提供的子组件，但它们不会修改或复制其输入组件中的任何行为。
```tsx
function withSubscription(WrappedComponent, selectData) {
    return class extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                data: selectData(DataSource, props)
            }
        }
        // 一些通用的逻辑处理
        render() {
            // ...使用新数据渲染被包装的组件
            return <WrappedComponent data={this.state.data} {...this.props} />
        }
    }
}
// 使用
const BlogPostWithSubscription = withSubscription(BlogPost, (DataSource, props) => DataSource.getBlogPost(props.id))
```
### HOC的优缺点
- 优点：逻辑复用、不影响被包裹组件的内部逻辑
- 缺点：HOC传递给被包裹组件的props容易和被包裹后的组件重名，进而被覆盖

### 适用场景
- 代码复用，逻辑抽象
- 渲染劫持
- State抽象和更改
- Props更改

### 应用例子
#### 权限控制
利用高阶组件的条件渲染特性可以对页面进行权限控制，权限控制一般分为页面级别和页面元素级别两个维度：
```tsx
// HOC.js
function withAdminAuth(WrappedComponent) {
    return class extends React.Component {
        state = {
            isAdmin: false
        }
        async UNSAFE_componentWillMount() {
            const currentRole = await getCurrentUserRole()
            this.setState({
                isAdmin: currentRole === 'Admin'
            })
        }
        render() {
            if (this.state.isAdmin) {
                return <WrappedComponent {...this.props} />
            } else {
                return <div>没有权限访问</div>
            }
        }
    }
}

// page-a.js
class PageA extends React.Component {
    constructor(props) {
        super(props)
        // ...
    }
    UNSAFE_componentWillMount() {
        // ...
    }
    render() {
        // render page with data
    }
}
export default withAdminAuth(PageA)

// page-b.js
class PageB extends React.Component {
    constructor(props) {
        super(props)
        // ...
    }
    UNSAFE_componentWillMount() {
        // ...
    }
    render() {
        // render page with data
    }
}
export default withAdminAuth(PageB)
```

#### 组件渲染性能追踪
借助父组件子组件生命周期规则捕获子组件的生命周期，可以方便的对某个组件的渲染时间进行记录：
```tsx
class Home extends React.Component {
    render() {
        return (
            <h1>Home</h1>
        )
    }
}
function withTiming(WrappedComponent) {
    return class extends WrappedComponent {
        constructor(props) {
            super(props)
            this.start = 0
            this.end = 0
        }
        UNSAFE_componentWillMount() {
            super.componentWillMount && super.componentWillMount()
            this.start = Date.now()
        }
        componentDidMount() {
            super.componentDidMount && super.componentDidMount()
            this.end = Date.now()
            console.log(`${WrappedComponent.name} 组件渲染时间为 ${this.end - this.start} ms`)
        }
        render() {
            return super.render()
        }
    }
}
export default withTiming(Home)
```
withTiming是利用反向继承实现的一个高阶组件，功能是计算被包裹组件（此处为Home组件）的渲染时间。

#### 页面复用
```tsx
const withFetching = fetching => WrappedComponent => {
    return class extends React.Component {
        state = {
            data: []
        }
        async UNSAFE_componentWillMount() {
            const data = await fetching()
            this.setState({
                data
            })
        }
        render() {
            return <WrappedComponent data={this.state.data} {...this.props} />
        }
    }
}

// page-a.js
export default withFetching(fetching('science-fiction'))(MovieList)
// page-b.js
export default withFetching(fetching('action'))(MovieList)
// page-c.js
export default withFetching(fetching('comedy'))(MovieList)
```

## 对componentWillReceiveProps的理解
该方法当props发生变化时执行，初始化render时不执行，在这个回调函数里面可以根据属性的变化通过调用this.setState()来更新组件状态，旧的属性还是可以通过this.props来获取，这里调用更新状态是安全的，并不会触发额外的render调用。

在这个生命周期中，可以在子组件的render函数执行前获取新的props，从而更新子组件自己的state。可以将数据请求放在这里进行执行，需要传的参数则从componentWillReceiveProps(nextProps)中获取，而不必将所有的请求都放在父组件中，于是该请求只会在该组件渲染时才会发出，从而减轻请求负担。componentWillReceiveProps在初始化render的时候不会执行，它会在Component接收到新的状态props时被触发，一般用于父组件状态更新时子组件的重新渲染。

## 会触发React重新渲染的方法
### setState()被调用
setState是React中最常用的命令，通常情况下，执行setState会触发render，但需要注意的是执行setState不一定会重新渲染，当setState传入null的时候，并不会触发render。
```jsx
class App extends React.Component {
    state = {
        a: 1
    }
    render() {
        console.log('render')
        return (
            <React.Fragment>
                <p>{this.state.a}</p>
                {/* 这里并没有更改a的值 */}
                <button onClick={() => this.setState({ a: 1 })}>点击更新</button>
                <button onClick={() => this.setState(null)}>点击更新</button>
                <Child />
            </React.Fragment>
        )
    }
}
```
### 父组件重新渲染
只要父组件重新渲染了，即使进入子组件的props未发生变化，子组件也会重新渲染，进而触发render()。

### 重新渲染render做了什么
- 会对新旧Virtual DOM进行对比，也就是Diff算法。
- 对新旧两棵树进行深度优先遍历，这样每一个节点都会有一个标记，在深度遍历的时候，每遍历到一个节点就把该节点和新的节点树进行对比，如果有差异就放到一个对象里面。
- 遍历差异对象，根据差异的类型通过对应规则更新Virtual DOM树。

React处理render的基本思维模式是每次一有变动就去重新渲染整个应用，在Virtual DOM没有出现之前，最简单的方法就是调用innerHTML，Virtual DOM厉害的地方不是它比直接操作DOM快，而是说不管数据怎么变，都会尽量以最小的代价去更新DOM。React将render函数返回的虚拟DOM树与老的进行比较，从而确定DOM要不要更新、怎么更新。当DOM树很大时，遍历两棵树进行各种比对还是相当耗费性能的，特别是在顶层setState一个微小的修改，默认会去遍历整棵树。尽管React使用高度优化的Diff算法，但是这个过程仍然损耗性能。

## React如何判断需要重新渲染组件
组件状态的改变可以因为props的改变或者直接通过setState方法改变。组件获得新的状态，然后React决定是否应该重新渲染组件，只要组件的state发生变化，React就会对组件进行重新渲染，这是因为React中的shouldComponentUpdate方法默认返回true，这就是导致每次更新都重新渲染的原因。

当React将要渲染组件时会执行shouldComponentUpdate方法来看它是否返回true（组件应该更新，也就是重新渲染），所以需要重写shouldComponentUpdate方法让它根据情况返回true或者false来告诉React什么时候重新渲染，什么时候跳过重新渲染。

## React声明组件的方法
React声明组件有三种方式：
- 函数式定义的无状态组件：它是为了创建纯展示组件，这种组件只负责根据传入的props来展示，不涉及到state状态的操作组件不会被实例化，整体渲染性能得到提升，不能访问this对象，不能访问生命周期的方法
- ES5原生方式React.createClass定义的组件：RFC，React.createClass会自绑定函数方法，导致不必要的性能开销，增加代码过时的可能性。
- ES6形式的extends React.Component定义的组件：RCC，目前极为推荐的创建有状态组件的方式，最终会取代React.createClass形式，相对于React.createClass可以更好实现代码复用。

与无状态组件相比，React.createClass和React.Component都是创建有状态的组件，这些组件是要被实例化的，并且可以访问组件的生命周期方法。

## React.createClass和React.Component的区别
### 函数this自绑定
- React.createClass创建的组件，其每一个成员函数的this都有React自动绑定，函数中的this会被正确设置。
- React.Component创建的组件，其成员函数不会自动绑定this，需要开发者手动绑定，否则this不能获取当前组件实例对象。

### propTypes和getDefaultProps配置不同
- React.createClass在创建组件时，有关组件props的属性类型及组件默认的属性会作为组件实例的属性来配置，其中defaultProps是使用getDefaultProps()方法来获取默认组件属性的
- React.Component在创建组件时配置这两个对信息时，他们是作为组件类的属性，不是组件实例的属性，也就是所谓的类的静态属性来配置的。

### 组件初始状态state的配置不同
- React.createClass创建的组件，其状态state是通过getInitialState()方法来配置组件相关的状态
- React.Component创建的组件，其状态state是在constructor中像初始化组件属性一样声明的

## 有状态组件
### 特点
- 类组件
- 有继承
- 可以使用this
- 可以使用React的生命周期
- 使用较多、容易频繁触发生命周期钩子函数，影响性能
- 内部使用state，维护自身状态的变化，有状态组件根据外部组件传入的props和自身的state进行渲染。

### 使用场景
- 需要使用到状态
- 需要使用状态操作组件

### 总结
类组件可以维护自身的状态变量，即组件的state，类组件还有不同的生命周期方法，可以让开发者能够在组件的不同阶段（挂载、更新、卸载），对组件做更多的控制。类组件则既可以充当无状态组件，也可以充当有状态组件。当一个类组件不需要管理自身状态时，也可称为无状态组件。

## 无状态组件
### 特点
- 不依赖自身的状态state
- 可以是类组件或者函数组件
- 可以完全避免使用this关键字，使用的是箭头函数事件无需绑定
- 有更高的性能，当不需要使用生命周期钩子时，应该首先使用无状态函数组件
- 组件内部不维护state，只根据外部组件传入的props进行渲染的组件，当props改变时组件重新渲染

### 使用场景
组件不需要管理state，纯展示

### 优缺点
优点：
- 简化代码、专注于render
- 组件不需要被实例化，无生命周期，提升性能。输出（渲染）只取决于输入（属性），无副作用
- 视图和数据的解耦分离

缺点：
- 无法使用ref
- 无生命周期方法
- 无法控制组件的重渲染，因为无法使用shouldComponentUpdate方法，当组件接收到新的属性时则会重渲染

### 总结
组件内部状态且与外部无关的组件，可以考虑用状态组件，这样状态树就不会过于复杂，易于理解和管理。当一个组件不需要管理自身状态时，也就是无状态组件，应该优先设计为函数组件，比如自定义的<Button />、<Input />等组件。


