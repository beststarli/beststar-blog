---
title: 使用ref回调管理ref列表
description: 有时候，你可能需要为列表中的每一项都绑定 ref ，而你又不知道会有多少项。
sidebar_position: 17
tags: [React,脱围机制]
date: 2026-06-02
---

# 使用ref回调管理ref列表
有时候，你可能需要为列表中的每一项都绑定 ref ，而你又不知道会有多少项。像下面这样做是行不通的：
```jsx
<ul>
  {items.map((item) => {
    // 行不通！
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```
这是因为 Hook 只能在组件的顶层被调用。不能在循环语句、条件语句或 map() 函数中调用 useRef 。

一种可能的解决方案是用一个 ref 引用其父元素，然后用 DOM 操作方法如 querySelectorAll 来寻找它的子节点。然而，这种方法很脆弱，如果 DOM 结构发生变化，可能会失效或报错。

另一种解决方案是将函数传递给 ref 属性。这称为 ref 回调。当需要设置 ref 时，React 将传入 DOM 节点来调用你的 ref 回调，并在需要清除它时传入 null 。这使你可以维护自己的数组或 Map，并通过其索引或某种类型的 ID 访问任何 ref。
