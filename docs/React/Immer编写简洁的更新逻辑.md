---
title: Immer编写简洁的更新逻辑
description: Immer 是一个非常流行的库，它可以让你使用简便但可以直接修改的语法编写代码，并会帮你处理好复制的过程。
sidebar_position: 12
tags: [React,添加交互]
date: 2026-05-26
---

# Immer编写简洁的更新逻辑
如果 state 有多层的嵌套，或许应该考虑 将其扁平化。但是，如果不想改变 state 的数据结构，可能更喜欢用一种更便捷的方式来实现嵌套展开的效果。Immer 是一个非常流行的库，它可以使用简便但可以直接修改的语法编写代码，并会处理好复制的过程。通过使用 Immer，写出的代码看起来就像是“打破了规则”而直接修改了对象：
```jsx
import { useImmer } from 'use-immer';

const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
        title: 'Blue Nana',
        city: 'Hamburg',
        image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
});

updatePerson(draft => {
    draft.artwork.city = 'Nanjing'
})
```

## Immer是如何运行的
由 Immer 提供的 draft 是一种特殊类型的对象，被称为 [Proxy](/docs/来时路/JavaScript八股#proxy的功能)，它会记录你用它所进行的操作。这就是你能够随心所欲地直接修改对象的原因所在！从原理上说，Immer 会弄清楚 draft 对象的哪些部分被改变了，并会依照你的修改创建出一个全新的对象。
