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
组件内部状态且与外部无关的组件，可以考虑用状态组件，这样状态树就不会过于复杂，易于理解和管理。当一个组件不需要管理自身状态时，也就是无状态组件，应该优先设计为函数组件，比如自定义的`<Button />`、`<Input />`等组件。

## 对React中Fragment的理解
在React中组件返回的元素只能有一个根元素，为了不添加多余的DOM节点，可以使用Fragment标签来包裹所有的元素，Fragment标签不会渲染出任何元素。官方对Fragment的解释是：React中的一个常见模式是一个组件返回多个元素，Fragment允许将子列表分组，而无需向DOM添加额外节点。
```jsx
import React, { Component, Fragment } from 'react'

// 一般形式
render() {
    return (
        <React.Fragment>
            <ChildA />
            <ChildB />
            <ChildC />
        </React.Fragment>
    )
}
// 简写形式
render() {
    return (
        <>
            <ChildA />
            <ChildB />
            <ChildC />
        </>
    )
}
```

## React获取组件对应的DOM元素
可以用ref来获取某个子节点的实例，然后通过当前class组件实例的一些特定属性来直接获取子节点实例。ref有三种实现方法：
- 字符串格式：React 16版本之前用的最多，如：
```jsx
<input ref="myInput" />
```
- 函数格式：ref对应一个方法，该方法有一个参数，也就是对应的节点实例，如：
```jsx
<input ref={input => this.myInput = input} />
```
- createRef格式：React 16.3版本引入的新的API，使用React.createRef()来实现：
```jsx
constructor(props) {
    super(props)
    this.myInput = React.createRef()
}
render() {
    return (
        <input ref={this.myInput} />
    )
}
```

## 为什么React中不可以在render访问refs
```jsx
<>
    <span id='name' ref={this.spanRef}>{this.state.title}</span>
    <span>{ this.spanRef.current ? '有值' : '无值' }</span>
</>
```
render阶段DOM还没有生成，无法获取DOM，DOM的获取需要在pre-commit阶段和commit阶段：
![生命周期](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/生命周期.png)

## 插槽Portals
Portals提供了一种将子节点渲染到存在于父组件以外的DOM节点的优秀方案，Portals是React 16提供的官方解决方案，使得组件可以脱离父组件层级挂载在DOM树的任意位置，通俗来讲就是render出一个组件但这个组件的DOM结构并不在本组件内。

Portals语法：
```jsx
ReactDOM.createPortal(child, container)
```
- 第一个参数child是可渲染的React子项，如元素、字符串或者片段等。
- 第二个参数container是一个DOM元素。

一般情况下，组件的render函数返回的元素会被挂载在它的父级组件上：
```jsx
import DemoComponent from './DemoComponent'

render() {
    // DemoComponent元素会被挂载在id为parent的div元素上
    return (
        <div id='parent'>
            <DemoComponent />
        </div>
    )
}
```
然而有些元素需要被挂载在更高层级的位置，最典型的应用场景：当父组件具有overflow: hidden或者z-index的样式设置时，组件有可能被其他元素遮挡，这时就可以考虑要不要使用Protals使组件的挂载脱离父组件，例如：对话框、模态窗。
```jsx
import DemoComponent from './DemoComponent'
render() {
    // react会将DemoComponent组件直接挂载在真实的DOM节点domNode上，生命周期还和16版本之前一样
    return ReactDOM.createPortal(
        <DemoComponent />,
        domNode
    )
}
```

## 如何避免不必要的render
React基于虚拟DOM和高效Diff算法的完美配合，实现了对DOM最小粒度的更新，大多数情况下，React对DOM的渲染效率足够满足业务日常。但在某些特定场景下仍然会有性能问题，一个重要的优化方向就是避免不必要的render。

### shouldComponentUpdate和PureComponent
在React类组件中，可以利用shouldComponentUpdate或者PureComponent来减少因父组件更新而触发子组件的render，从而达到目的。shouldComponentUpdate来决定组件是否重新渲染，如果不希望组件重新渲染，返回false即可。
### 利用高阶组件
在函数组件中，并没有shouldComponentUpdate这个生命周期钩子函数，可以利用高阶组件封装一个类似PureComponent的功能。
### 使用React.memo
React.memo是React 16.6新的一个API，用来缓存组件的渲染，避免不必要的更新，事实上也是一个高阶组件与PureComponent类似，但不同的是React.memo只能用于函数组件。

## React-Intl
React-Intl是雅虎的语言国际化开源项目FormatJS的一部分，通过其提供的组件和API可以与ReactJS绑定。React-Intl提供了两种使用方法，一种是引用React组件，另一种是直接调取API，官方推荐使用前者，只有在无法使用React组件的地方才应该调用框架提供的API。它提供了一系列React组件，包括数字格式化、字符串格式化、日期格式化等。

在React-Intl中可以配置不同的语言包，它的工作原理就是根据需要在语言包之间进行切换。

## React context
在React中数据传递一般使用props维持单向数据流，这样可以让组件之间的关系变得简单且可测，但是单项数据流在某些场景并不适用。当组件间层级依赖较深，props的传递就过于繁琐了。

context提供了一种在组件之间共享此类值的方法，不必显式地通过组件树逐层传递props。可以把context当作是特定一个组件树内共享的store，用来做数据传递，实现跨层级组件通信。

JS的代码块在执行期间，会创建一个相应的作用域链，这个作用域链记录着运行时JS代码块执行期间所能访问的活动对象，包括变量和函数，JS程序通过作用域链访问到代码块内部或者外部的变量和函数。假如以JS的作用域链作为类比，React组件提供的context对象其实就好比一个提供给子组件访问的作用域，而context对象的属性可以看成作用域上的活动对象。由于组件的context由其父节点链上所有组件通过getChildContext()返回的context对象组合而成，所以，组件通过context可以访问到父组件链上所有节点组件提供的context的属性。

## 为什么不推荐优先使用context
- 如果能做到高内聚，不破坏组件树之间的依赖关系，可以考虑使用context
- 对于组件之间的数据通信或者状态管理，有效使用props或者state解决，然后再考虑使用Redux或Zustand解决，以上都不是最佳方案时才考虑使用context
- context的更新需要通过setState()触发，但是并不可靠。context支持跨组件访问，但是如果子组件通过一些方法不更新，比如shouldComponentUpdate()返回false，那么不能保证context的更新一定可以使用context的子组件，所以context的可靠性需要关注

## 受控组件
在使用表单来收集用户输入时，输入框等元素都要绑定一个onChange事件，点表单的状态发生变化就会触发onChange事件，更新组件的state，这种组件在React中被称为受控组件。在受控组件中，组件渲染出的状态与它的value或checked属性相对应，React通过这种方式消除了组件的局部状态，使整个状态可控。

受控组件更新state的流程：
- 可以通过初试state设置表单的默认值
- 每当表单的值发生变化时，调用onChange事件处理器
- 事件处理器通过事件对象e拿到改变后的状态并更新组件的state
- 一旦通过setState方法更新state，就会触发视图的重新渲染，完成表单组件的更新

受控组件的缺陷：表单元素的值都是由React组件进行管理，当有多个输入框或者多个类似组件时，如果要同时获取到全部的值就必须每个都要编写事件处理函数，这会让代码变得冗长。

## 非受控组件
如果一个表单组件没有value props时，就可以称为非受控组件，在非受控组件中，可以使用一个ref来从DOM获取表单值，而不是为每个状态更新编写一个事件处理程序。例如，下面的代码在非受控组件中接收单个属性：
```jsx
class NameForm extends React.Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit(event) {
        alert('提交的名字: ' + this.input.value)
        event.preventDefault()
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    名字:
                    <input type="text" ref={input => this.input = input} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        )
    }
}
```
页面中所有输入类的DOM如果是现用现取的方式获取值就称为非受控组件，而通过setState将输入的值维护到了state中，需要时再从state中取出，这些数据就受到了state的控制，这些组件就称为受控组件。

## Refs
Refs提供了一种方法来访问在render方法中创建的React元素或DOM节点。适合Refs的使用场景：
- 处理焦点、文本选择或者媒体的控制
- 触发必要的动画
- 集成第三方DOM库

Refs是使用React.createRef()创建的，他通过ref属性附加到React元素上，要在整个组件中使用Refs，需要将ref在构造函数中分配给其实例属性：
```jsx
class MyComponent extends React.Component {
    constructor(props) {
        super(props)
        this.myRef = React.createRef()
    }
    render() {
        return <div ref={this.myRef} />
    }
}
```
由于函数组件没有实例，因此不能在函数组件上直接使用ref：
```jsx
function MyFunctionComponent() {
    return <input />
}

class Parent extends React.Component {
    constructor(props) {
        super(props)
        this.textInput = React.createRef()
    }
    render() {
        // 下面的代码会报错，因为函数组件没有实例
        return <MyFunctionComponent ref={this.textInput} />
    }
}
```
但可以通过闭合的帮助在函数组件内部使用Refs：
```jsx
function CustomTextInput(props) {
    // textInput必须在函数组件内部声明，这样它才能在handleClick中引用 
    let textInput = null
    function handleClick() {
        textInput.focus()
    }
    return (
        <div>
            <input type="text" ref={(input) => textInput = input} />
            <input type="button" value="Focus the text input" onClick={handleClick} />
        </div>
    )
}
```
注意：
- 不应该过度使用Refs
- ref的返回值取决于节点的类型：
    - 当ref属性被用于一个普通的HTML元素时，React.createRef()将接收底层DOM元素作为其current属性来创建ref。
    - 当ref属性被用于一个自定义的类组件时，ref对象将接收该组件已挂载的实例作为他的current。
- 当在父组件中需要访问子组件的ref时可使用forwardRef来转发ref

## React中绑定this
### 在构造函数中绑定this
```jsx
constructor(props) {
    super(props)
    this.state = {
        msg: 'Hello'
    }
    this.getMsg = this.getMsg.bind(this)
}
```
### 函数定义的时候使用箭头函数
```jsx
constructor(props) {
    super(props)
    this.state = {
        msg: 'Hello'
    }
    render() {
        return (
            <div>
                <button onClick={() => this.getMsg()}>点击获取msg</button>
            </div>
        )
    }
}
```
### 函数调用使用bind绑定this
```jsx
<button onClick={this.getMsg.bind(this)}>点击获取msg</button>
```

## React组件的构造函数
构造函数主要有两个目的：
- 通过将对象分配给this.state来初始化本地状态
- 将事件处理程序方法绑定到实例上

所以当在React class中需要设置state的初始值或者绑定事件时需要加上构造函数：
```jsx
class LikeButton extends React.Component {
    constructor(props) {
        super()
        this.state = {
            liked: false
        }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        this.setState({
            liked: !this.state.liked
        })
    }
    render() {
        const text = this.state.liked ? '点赞' : '没有点赞'
        return (
            <div onClick={this.handleClick}>
                {text}
            </div>
        )
    }
}

ReactDOM.render(
    <LikeButton />,
    document.getElementById('root')
)
```
构造函数用来新建父类的this对象，子类必须在constructor方法中调用super方法，否则新建实例会报错，因为子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工。如果不调用super方法，子类就得不到this对象。

注意：
- constructor()必须配上super()，如果要在constructor内部使用this.props就要传入props，否则不用
- JavaScript中的bind每次都会返回一个新的函数，为了性能考虑尽量在constructor中绑定事件

## React.forwardRef
React.forwardRef会创建一个React组件，这个组件能够将其接受的ref属性转发到其组件树下的另一个组件中。这种方法并不常用，但在下面场景中特别有用：
- 转发refs到DOM组件
- 在高阶组件中转发refs

## 类组件与函数组件的异同
### 相同点
组件是React可复用的最小代码片段，它们会返回要在页面中渲染的React元素。也正因为组件是React的最小编码单位，所以无论是函数组件还是类组件，在使用方式和最终呈现效果上都是完全一致的。

可以将一个类组件改写成函数组件，或者把函数组件改写成一个类组件，虽然并不推荐重构这种行为。从使用者的角度很难从体验上区分二者，而在现代浏览器中，闭包和类的性能只在极端场景下才会有明显的差别。所以基本可认为两者作为组件是完全一致的。

### 不同点
- 它们在开发时的语法存在较大差异，类组件是基于面向对象编程的，核心概念是继承、生命周期等；而函数组件内核是函数式编程，核心特点是immutable、没有副作用、引用透明。
- 使用场景上，如果存在需要使用生命周期的组件，那么主推类组件；设计模式上，如果需要使用继承，那么主推类组件；但由于React Hooks的推出，生命周期概念淡化，函数组件可以完全取代类组件，其次继承并不是组件最佳的设计模式，官方推崇“组合优于继承”的设计概念，所以类组件的优势也在淡出。
- 性能优化上，类组件主要依靠shouldComponentUpdate阻断渲染来提升性能，而函数组件依靠React.memo缓存渲染结果来提升性能。
- 类组件更易上手，函数组件是未来主推。
- 类组件在未来时间切片与并发模式中，由于生命周期带来的复杂度，并不易于优化。而函数组件本身轻量简单，且在Hooks的基础上提供了比原先更细粒度的逻辑组织与复用，更适应React未来的发展。

## setState调用的原理
![setState调用](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/setState调用.png)

1. 首先调用setState入口函数，入口函数充当分发器的角色，根据入参的不同将其分发到不同的功能函数中：
```jsx
ReactComponent.prototype.setState = function(partialState, callback) {
    this.updater.enqueueSetState(this, partialState)
    if (callback) {
        this.updater.enqueueCallback(this, callback, 'setState')
    }
}
```
2. enqueueSetState方法将新的state放入组件的状态队列中，并调用enqueueUpdate来处理将要更新的实例对象：
```jsx
function enqueueSetState(publicInstance, partialState) {
    // 根据this拿到对应的组件实例
    var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState')
    // 这个queue对应的就是一个组件实例的state数组
    var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = [])
    queue.push(partialState)
    // enqueueUpdate用来处理当前的组件实例对象
    enqueueUpdate(internalInstance)
}
```
3. 在enqueueUpdate方法中引入一个关键的对象——batchingStrategy，该对象具备isBatchingUpdates属性直接决定当下是走更新流程还是排队等待。如果轮到执行就调用batchedUpdates方法来直接发起更新流程，由此可以知道batchingStrategy或许是React内部专门用于管控批量更新的对象。
```jsx
function enqueueUpdate(component) {
    ensureInjected()
    // isBatchingUpdates标识着当前是否处于批量创建/更新组件的阶段
    if (!batchingStrategy.isBatchingUpdates) {
        // 若当前没有处于批量创建/更新组件的阶段，则立即更新组件
        batchingStrategy.batchedUpdates(enqueueUpdate, component)
        return 
    }
    // 否则，先把组件塞入dirtyComponents数组中，等到批量更新阶段再统一处理
    dirtyComponents.push(component)
    if (component._updateBatchNumber == null) {
        component._updateBatchNumber = updateBatchNumber + 1
    }
}
```
**注意**：batchingStrategy对象可以理解为“锁管理器”，这里的“锁”是指React全局唯一的isBatchingUpdates变量，isBatchingUpdates的初始值是false，意味着“当前并未进行任何批量更新操作”。每当React调用batchedUpdate去执行更新动作时，会先把这个锁给锁上即设为true，表明“现在处于批量更新流程中”，当锁被“锁上”时，任何需要更新的组件都只能暂时进入dirtyComponents里排队等候下一次批量更新，而不能随意插队。此处体现了任务锁的思想，是React面对大量状态仍然能够实现有序分批处理的基石。

## setState调用后发生了什么
在代码中调用setState之后，React会将传入的参数对象与组件之前的状态合并，然后触发调和过程（Reconciliation），经过调和过程，React会以相对高效的的方式根据新的状态构建React元素树并着手重新渲染整个UI界面。

在React得到元素树之后，React会自动计算出新的树与老树的节点差异，然后根据差异对界面进行最小化重新渲染。在差异计算算法中，React能够相对精确地知道哪些位置发生了什么改变以及应该如何改变，这就保证了按需更新而不是全部重新渲染。

如果在短时间内频繁setState，React会将state的改变压入栈中，在合适的时机批量更新state和视图，达到提高性能的效果。

## setState是同步的还是异步的
假如所有setState是同步的，意味着每执行一次setState时，都重新VNode Diff + DOM修改，这对性能极为不好。如果是异步的，则可以把一个同步代码中的多个setState合并成一次组件更新，所以默认是异步的，但是一些情况下是同步的。

setState并不是单纯同步或异步的，它的表现会因调用场景的不同而不同，在源码中通过isBatchingUpdates来判断setState是先存进state队列还是直接更新，如果值为true则执行异步操作，为false则直接更新。
- 异步：在React可以控制的地方则为true，如在React生命周期事件和合成事件中，都会走合并操作，延迟更新的策略。
- 同步：在React无法控制的地方，如原生事件addEventListener、setTimeout、Promise等异步回调函数中，就只能同步更新。

一般认为做异步设计是为了性能优化、减少渲染次数：
- `<font style="background-color:transparent">setState</font>`设计为异步，可以显著的提升性能。如果每次调用setState都进行一次更新，那么意味着render函数会被频繁调用，界面更新渲染，这样效率很低。最好的办法应该是获取到多个更新之后进行批量更新。
- 如果同步更新了state，但是还没有执行render函数，那么state和props不能保持同步。state和props不能保持一致性，会在开发中产生很多问题。

## setState批量更新的过程
调用setState时，组件的state并不会立即改变，setState只是把要修改的state放入一个队列，React会优化真正的执行时机，并出于性能原因会将React事件处理程序中的多次React事件处理程序中的多次setState的状态修改合并成一次状态修改。最终更新只产生一次组件及其子组件的重新渲染，这对于大型应用程序中的性能提升至关重要。
```jsx
this.setState({
  count: this.state.count + 1    ===>    入队，[count+1的任务]
});
this.setState({
  count: this.state.count + 1    ===>    入队，[count+1的任务，count+1的任务]
});
                                          ↓
                                         合并 state，[count+1的任务]
                                          ↓
                                         执行 count+1的任务
```
只要同步代码还在执行，“攒起来”这个动作就不会停止。这里之所以多次 +1 最终只有一次生效，是因为在同一个方法中多次 setState 的合并动作不是单纯地将更新累加。比如这里对于相同属性的设置，React 只会为其保留最后一次的更新。

## getDefaultProps的作用
通过实现组件的getDefaultProps，对属性设置默认值：
```jsx
var ShowTitle = React.createClass({
    getDefaultProps: function() {
        return {
            title: 'React'
        }
    },
    render: function() {
        return (
            <h1>{this.props.title}</h1>
        )
    }
})
```

## setState第二参数
setState 的第二个参数是一个可选的回调函数。这个回调函数将在组件重新渲染后执行。等价于在 componentDidUpdate 生命周期内执行。通常建议使用 componentDidUpdate 来代替此方式。在这个回调函数中你可以拿到更新后 state 的值：
```jsx
this.setState({
    key1: newState1,
    key2: newState2,
    ...
}, callback) // 第二个参数是 state 更新完成后的回调函数
```

## setState和replaceState的区别
### setState
setState()用于设置状态对象，语法如下：
```jsx
setState(object nextState[, function callback])
```
- nextState，将要设置的新状态，该状态会和当前的state合并
- callback，可选参数，回调函数。该函数会在setState设置成功，且组件重新渲染后调用。

合并nextState和当前state，并重新渲染组件。setState是React事件处理函数中和请求回调函数中触发UI更新的主要方法。

### replaceState
replaceState()方法与setState()类似，但是方法只会保留nextState中状态，原state不在nextState中的状态都会被删除。其语法如下：
```jsx
replaceState(object nextState[, function callback])
```
- nextState，将要设置的新状态，该状态会替换当前的state。
- callback，可选参数，回调函数。该函数会在replaceState设置成功，且组件重新渲染后调用。

总结： setState 是修改其中的部分状态，相当于 Object.assign，只是覆盖，不会减少原来的状态。而replaceState 是完全替换原来的状态，相当于赋值，将原来的 state 替换为另一个对象，如果新状态属性减少，那么 state 中就没有这个状态了。

## this.state和setState的区别
this.state通常是用来初始化state的，this.setState是用来修改state值的。如果初始化了state之后再使用this.state，之前的state会被覆盖掉，如果使用this.setState，只会替换掉相应的state值。所以，如果想要修改state的值，就需要使用setState，而不能直接修改state，直接修改state之后页面是不会更新的。

## state如何注入到组件，reducer到组件经历的过程
通过connect和mapStateToProps将state注入到组件中：
```jsx
import { connect } from 'react-redux'
import { setVisibilityFilter } from '@/reducers/Todo/actions'
import Link from '@/containers/Todo/components/Link'

const mapStateToProps = (state, ownProps) => ({
    active: ownProps.filter === state.visibilityFilter
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setFilter: () => {
        dispatch(setVisibilityFilter(ownProps.filter))
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Link)
```
上面代码中，active就是注入到Link组件中的状态。 mapStateToProps（state，ownProps）中带有两个参数，含义是∶
- state-store管理的全局状态对象，所有的组件状态数据都存储在该对象中。
- ownProps组件通过props传入的参数。

reducer到组件经历的过程：
- reducer对action对象处理，更新组件状态，并将新的状态值返回store。
- 通过connect（mapStateToProps，mapDispatchToProps）（Component）对组件Component进行升级，此时将状态值从store取出并作为props参数传递到组件。

高阶组件实现源码：
```jsx
import React from 'react'
import PropTypes from 'prop-types'

// 高阶组件 contect 
export const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => {
    class Connect extends React.Component {
        // 通过对context调用获取store
        static contextTypes = {
            store: PropTypes.object
        }

        constructor() {
            super()
            this.state = {
                allProps: {}
            }
        }

        // 第一遍需初始化所有组件初始状态
        componentWillMount() {
            const store = this.context.store
            this._updateProps()
            store.subscribe(() => this._updateProps()); // 加入_updateProps()至store里的监听事件列表
        }

        // 执行action后更新props，使组件可以更新至最新状态（类似于setState）
        _updateProps() {
            const store = this.context.store;
            let stateProps = mapStateToProps ?
                mapStateToProps(store.getState(), this.props) : {} // 防止 mapStateToProps 没有传入
            let dispatchProps = mapDispatchToProps ?
                mapDispatchToProps(store.dispatch, this.props) : {
                                    dispatch: store.dispatch
                                } // 防止 mapDispatchToProps 没有传入
            this.setState({
                allProps: {
                    ...stateProps,
                    ...dispatchProps,
                    ...this.props
                }
            })
        }

        render() {
            return <WrappedComponent {...this.state.allProps} />
        }
    }
    return Connect
}
```

## state和props的区别
- state：主要作用是用于组件保存、控制以及修改自己的状态，它只能在constructor中初始化，它算是组件的私有属性，不可通过外部访问和修改，只能通过组件内部的this.setState来修改，修改state属性会导致组件的重新渲染。
- props：一个从外部传进组件的参数，主要作为就是从父组件向子组件传递数据，它具有可读性和不变性，只能通过外部组件主动传入新的props来重新渲染子组件，否则子组件的props以及展现形式不会改变。

区别：
- props 是传递给组件的（类似于函数的形参），而state 是在组件内被组件自己管理的（类似于在一个函数内声明的变量）。
- props 是不可修改的，所有 React 组件都必须像纯函数一样保护它们的 props 不被更改。
- state 是在组件中创建的，一般在 constructor中初始化 state。state 是多变的、可以修改，每次setState都异步更新的。

## props为什么是只读的
this.props是组件之间沟通的一个接口，原则上来讲，它只能从父组件流向子组件。React具有浓重的函数式编程的思想。

提到函数式编程就要提一个概念：纯函数。它有几个特点：
- 给定相同的输入，总是返回相同的输出。
- 过程没有副作用。
- 不依赖外部状态。

this.props就是汲取了纯函数的思想。props的不可以变性就保证的相同的输入，页面显示的内容是一样的，并且不会产生副作用。

## props改变时更新组件的方法
在一个组件传入的props更新时重新渲染该组件常用的方法是在componentWillReceiveProps中将新的props更新到组件的state中（这种state被成为派生状态（Derived State）），从而实现重新渲染。React 16.3中还引入了一个新的钩子函数getDerivedStateFromProps来专门实现这一需求。
### componentWillReceiveProps（已废弃）
在react的componentWillReceiveProps(nextProps)生命周期中，可以在子组件的render函数执行前，通过this.props获取旧的属性，通过nextProps获取新的props，对比两次props是否相同，从而更新子组件自己的state。
这样的好处是，可以将数据请求放在这里进行执行，需要传的参数则从componentWillReceiveProps(nextProps)中获取。而不必将所有的请求都放在父组件中。于是该请求只会在该组件渲染时才会发出，从而减轻请求负担。

### getDerivedStateFromProps（16.3引入）
这个生命周期函数是为了替代componentWillReceiveProps存在的，所以在需要使用componentWillReceiveProps时，就可以考虑使用getDerivedStateFromProps来进行替代。

两者的参数是不相同的，而getDerivedStateFromProps是一个静态函数，也就是这个函数不能通过this访问到class的属性，也并不推荐直接访问属性。而是应该通过参数提供的nextProps以及prevState来进行判断，根据新传入的props来映射到state。

需要注意的是，如果props传入的内容不需要影响到你的state，那么就需要返回一个null，这个返回值是必须的，所以尽量将其写到函数的末尾：
```jsx
static getDerivedStateFromProps(nextProps, prevState) {
    const {type} = nextProps;
    // 当传入的type发生变化的时候，更新state
    if (type !== prevState.type) {
        return {
            type,
        };
    }
    // 否则，对于state不进行任何操作
    return null;
}
```

## 如何校验props
React为我们提供了PropTypes以供验证使用。当我们向Props传入的数据无效（向Props传入的数据类型和验证的数据类型不符）就会在控制台发出警告信息。它可以避免随着应用越来越复杂从而出现的问题。并且，它还可以让程序变得更易读。
```jsx
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```
当然，如果项目汇中使用了TypeScript，那么就可以不用PropTypes来校验，而使用TypeScript定义接口来校验props。

## React的生命周期
React通常将组件生命周期分为三个阶段：
- 挂载阶段（Mount），组件第一次在DOM树中被渲染的过程；
- 更新过程（Update），组件状态发生变化，重新更新渲染的过程；
- 卸载过程（Unmount），组件从DOM树中被移除的过程；
![React生命周期](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/生命周期.png)
### 组件挂载阶段
挂载阶段组件被创建，然后组件实例插入到 DOM 中，完成组件的第一次渲染，该过程只会发生一次，在此阶段会依次调用以下这些方法：
- constructor
- getDerivedStateFromProps
- render
- componentDidMount
#### constructor
组件的构造函数，第一个被执行，若没有显式定义它，会有一个默认的构造函数，但是若显式定义了构造函数，我们必须在构造函数中执行 super(props)，否则无法在构造函数中拿到this。

如果不初始化 state 或不进行方法绑定，则不需要为 React 组件实现构造函数Constructor。

constructor中通常只做两件事：
- 初始化组件的 state
- 给事件处理方法绑定 this
```jsx
constructor(props) {
  super(props);
  // 不要在构造函数中调用 setState，可以直接给 state 设置初始值
  this.state = { counter: 0 }
  this.handleClick = this.handleClick.bind(this)
}
```
#### getDerivedStateFromProps
```jsx
static getDerivedStateFromProps(props, state)
```
这是个静态方法，所以不能在这个函数里使用 this，有两个参数 props 和 state，分别指接收到的新参数和当前组件的 state 对象，这个函数会返回一个对象用来更新当前的 state 对象，如果不需要更新可以返回 null。

该函数会在装载时，接收到新的 props 或者调用了 setState 和 forceUpdate 时被调用。如当接收到新的属性想修改 state ，就可以使用。
```jsx
// 当 props.counter 变化时，赋值给 state 
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      counter: 0
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (props.counter !== state.counter) {
      return {
        counter: props.counter
      }
    }
    return null
  }
  
  handleClick = () => {
    this.setState({
      counter: this.state.counter + 1
    })
  }
  render() {
    return (
      <div>
        <h1 onClick={this.handleClick}>Hello, world!{this.state.counter}</h1>
      </div>
    )
  }
}
```
现在可以显式传入 counter ，但是这里有个问题，如果想要通过点击实现 state.counter 的增加，但这时会发现值不会发生任何变化，一直保持 props 传进来的值。这是由于在 React 16.4^ 的版本中 setState 和 forceUpdate 也会触发这个生命周期，所以当组件内部 state 变化后，就会重新走这个方法，同时会把 state 值赋值为 props 的值。因此需要多加一个字段来记录之前的 props 值，这样就会解决上述问题。具体如下：
```jsx
// 这里只列出需要变化的地方
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 增加一个 preCounter 来记录之前的 props 传来的值
      preCounter: 0,
      counter: 0
    }
  }
  static getDerivedStateFromProps(props, state) {
    // 跟 state.preCounter 进行比较
    if (props.counter !== state.preCounter) {
      return {
        counter: props.counter,
        preCounter: props.counter
      }
    }
    return null
  }
  handleClick = () => {
    this.setState({
      counter: this.state.counter + 1
    })
  }
  render() {
    return (
      <div>
        <h1 onClick={this.handleClick}>Hello, world!{this.state.counter}</h1>
      </div>
    )
  }
}
```
#### render
render是React中最核心的方法，一个组件中必须要有这个方法，它会根据状态 state 和属性 props 渲染组件。这个函数只做一件事，就是返回需要渲染的内容，所以不要在这个函数内做其他业务逻辑，通常调用该方法会返回以下类型中一个： 
- React元素：这里包括原生的 DOM 以及 React 组件；
- 数组和Fragment（片段）：可以返回多个元素；
- Portals（插槽）：可以将子元素渲染到不同的 DOM 子树种；
- 字符串和数字：被渲染成 DOM 中的 text 节点；
- 布尔值或null：不渲染任何内容。

#### componentDidMount()
componentDidMount()会在组件挂载后（插入 DOM 树中）立即调用。该阶段通常进行以下操作：
- 执行依赖于DOM的操作；
- 发送网络请求；（官方建议）
- 添加订阅消息（会在componentWillUnmount取消订阅）；

如果在 componentDidMount 中调用 setState ，就会触发一次额外的渲染，多调用了一次 render 函数，由于它是在浏览器刷新屏幕前执行的，所以用户对此是没有感知的，但是我应当避免这样使用，这样会带来一定的性能问题，尽量是在 constructor 中初始化 state 对象。

在组件装载之后，将计数数字变为1：
```jsx
class App extends React.Component  {
  constructor(props) {
    super(props)
    this.state = {
      counter: 0
    }
  }
  componentDidMount () {
    this.setState({
      counter: 1
    })
  }
  render ()  {
    return (
      <div className="counter">
        counter值: { this.state.counter }
      </div>
    )
  }
}
```

### 组件更新阶段
当组件的 props 改变了，或组件内部调用了 setState/forceUpdate，会触发更新重新渲染，这个过程可能会发生多次。这个阶段会依次调用下面这些方法：
- getDerivedStateFromProps
- shouldComponentUpdate
- render
- getSnapshotBeforeUpdate
- componentDidUpdate

#### shouldComponentUpdate
```jsx
shouldComponentUpdate(nextProps, nextState)
```
在说这个生命周期函数之前，来看两个问题：
1. 问题一：setState 函数在任何情况下都会导致组件重新渲染吗？例如下面这种情况：
```jsx
this.setState({number: this.state.number})
```
2. 问题二：如果没有调用setState，props值也没有变化，是不是组件就不会重新渲染？

问题一的答案是会，问题二如果是父组件重新渲染时，不管传入的props有没有变化，都会引起子组件的重新渲染。

那么有没有什么方法解决在这两个场景下不让组件重新渲染进而提升性能呢？这个时候shouldComponentUpdate登场了，这个生命周期函数是用来提升速度的，它是在重新渲染组件开始前触发的，默认返回true，可以比较this.props和nextProps，this.state和nextState值是否变化，来确认返回true或者false。当返回false时，组件的更新过程停止，后续的render、componentDidUpdate也不会被调用。

注意：添加shouldComponentUpdate方法时，不建议使用深度相等检查（如使用JSON.stringify()），因为深比较效率很低，可能会比重新渲染组件效率还低。而且该方法维护比较困难，建议使用该方法会产生明显的性能提升时使用。

#### getSnapshotBeforeUpdate
```jsx
getSnapshotBeforeUpdate(prevProps, prevState)
```
这个方法在render之后，componentDidUpdate之前调用，有两个参数prevProps和prevState，表示更新之前的props和state，这个函数必须要和componentDidUpdate一起使用，并且要有一个返回值，默认是null，这个返回值作为第三个参数传给componentDidUpdate。

#### componentDidUpdate
componentDidUpdate()会在更新后会被立即调用，首次渲染不会执行此方法。该阶段通常进行以下操作：
- 当组件更新后，对DOM进行操作；
- 如果你对更新前后的props进行了比较，也可以选择在此处进行网络请求；（例如，当props未发生变化时，则不会执行网络请求）。
```jsx
componentDidUpdate(prevProps, prevState, snapshot){}
```
该方法有三个参数：
- prevProps: 更新前的props
- prevState: 更新前的state
- snapshot: getSnapshotBeforeUpdate()生命周期的返回值

### 组件卸载阶段
卸载阶段只有一个生命周期函数，componentWillUnmount()会在组件卸载及销毁之前直接调用。在此方法中执行必要的清理操作：
- 清除timer，取消网络请求或清除
- 取消在componentDidMount()中创建的订阅等；

这个生命周期在一个组件被卸载和销毁之前被调用，因此你不应该在这个方法中使用setState，因为组件一旦被卸载，就不会再装载，也就不会重新渲染。

### 错误处理阶段
componentDidCatch(error, info)，此生命周期在后代组件抛出错误后被调用。它接收两个参数∶
- error：抛出的错误。
- info：带有componentStack key的对象，其中包含有关组件引发错误的栈信息

### 生命周期大致过程
- 挂载阶段，首先执行constructor构造方法，来创建组件
- 创建完成之后，就会执行render方法，该方法会返回需要渲染的内容
- 随后，React会将需要渲染的内容挂载到DOM树上
- 挂载完成之后就会执行componentDidMount生命周期函数
- 如果我们给组件创建一个props（用于组件通信）、调用setState（更改state中的数据）、调用forceUpdate（强制更新组件）时，都会重新调用render函数
- render函数重新执行之后，就会重新进行DOM树的挂载
- 挂载完成之后就会执行componentDidUpdate生命周期函数
- 当移除组件时，就会执行componentWillUnmount生命周期函数

### 总结
- getDefaultProps：这个函数会在组件创建之前被调用一次（有且仅有一次），它被用来初始化组件的 Props；
- getInitialState：用于初始化组件的 state 值；
- componentWillMount：在组件创建后、render 之前，会走到 componentWillMount 阶段。这个阶段我个人一直没用过、非常鸡肋。后来React 官方已经不推荐大家在 componentWillMount 里做任何事情、到现在 React16 直接废弃了这个生命周期，足见其鸡肋程度了；
- render：这是所有生命周期中唯一一个你必须要实现的方法。一般来说需要返回一个 jsx 元素，这时 React 会根据 props 和 state 来把组件渲染到界面上；不过有时，你可能不想渲染任何东西，这种情况下让它返回 null 或者 false 即可；
- componentDidMount：会在组件挂载后（插入 DOM 树中后）立即调用，标志着组件挂载完成。一些操作如果依赖获取到 DOM 节点信息，我们就会放在这个阶段来做。此外，这还是 React 官方推荐的发起 ajax 请求的时机。该方法和 componentWillMount 一样，有且仅有一次调用。