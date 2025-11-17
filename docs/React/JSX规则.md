---
title: JSX规则
sidebar_position: 5
tags: [React]
date: 2025-11-11
---
## 使用JSX书写标签语言
JSX虽然看起来很像HTML，但在底层其实被转化为了JavaScript对象，不能在一个函数中返回多个对象，除非用一个数组把他们包装起来。这就是为什么多个JSX标签必须要用一个父元素或者Fragment来包裹。

JSX最终会被转化为JavaScript，而JSX中的属性也会变成JavaScript对象中的键值对。在自己的组件中，经常会遇到需要用变量的方式读取这些属性的时候。但JavaScript对变量的命名有限制。例如，变量名称不能包含`-`符号或者像`class`这样的保留字。

这就是为什么在React中，大部分HTML和SVG属性都用驼峰式命名法表示。

```JSX
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```
:::warning 注意
由于历史原因，`aria-*`和`data-*`属性是以带`-`符号的 HTML 格式书写的。
:::

[HTML to JSX转化器](https://transform.tools/html-to-jsx)

## 通过大括号使用JavaScript
在JSX中看到`{{`和`}}`时，代表包在大括号里的一个对象。

:::warning 注意
内联`style`属性使用驼峰命名法编写。例如，HTML`<ul style="background-color: black">`在组件里应该写成`<ul style={{ backgroundColor: 'black' }}>`。
:::

## 将Props传递给组件
有时候，传递 props 会变得非常重复：
```jsx
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```
重复代码没有错,但有时需要重视简洁，它可以更清晰。一些组件将它们所有的props转发给子组件，正如`Profile`转给`Avatar`那样。因为这些组件不直接使用他们本身的任何props，所以使用更简洁的“展开”语法是有意义的：
```jsx
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```
这会将`Profile`的所有props转发到`Avatar`，而不列出每个名字。