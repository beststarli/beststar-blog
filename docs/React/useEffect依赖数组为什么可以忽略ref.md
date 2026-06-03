---
title: useEffect依赖数组为什么可以忽略ref
description: useEffect的依赖数组可以不把ref声明为依赖项。
sidebar_position: 18
tags: [React,脱围机制]
date: 2026-06-02
---

# useEffect依赖数组为什么可以忽略ref
下面的 Effect 同时使用了 ref 与 isPlaying prop，但是只有 isPlaying 被声明为依赖项：
```jsx
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```
这是因为 ref 具有 稳定 的标识：React 确保你在 每轮渲染中调用同一个 useRef 时，总能获得相同的对象。ref 不会改变，所以它不会导致重新运行 Effect。因此，在依赖数组中它可有可无。把它加进去也可以：
```jsx
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```
useState 返回的 set 函数 也具有稳定的标识，因此它们通常也会被省略。如果在省略某个依赖项时 linter 不会报错，那么这么做就是安全的。

省略始终稳定的依赖项仅在 linter 能“看到”对象是稳定的时候才有效。例如，如果 ref 是从父组件传递过来的，则必须在依赖数组中指定它。这很有必要，因为你无法确定父组件是一直传递相同的 ref，还是根据条件传递不同的 ref。所以，你的 Effect 会依赖于被传递的是哪个 ref。