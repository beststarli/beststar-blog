---
title: 在没有mutation的前提下更新数组
description: 在 JavaScript 中，数组只是另一种对象。同对象一样，需要将 React state 中的数组视为只读的。
sidebar_position: 15
tags: [React,状态管理]
date: 2026-05-26
---

# 在没有mutation的前提下更新数组
在 JavaScript 中，数组只是另一种对象。同对象一样，需要将 React state 中的数组视为只读的。这意味着不应该使用类似于 `arr[0] = 'bird'` 这样的方式来重新分配数组中的元素，也不应该使用会直接修改原始数组的方法，例如 `push()` 和 `pop()`。

相反，每次要更新一个数组时，需要把一个新的数组传入 state 的 setting 方法中。为此，可以通过使用像 `filter()` 和 `map()` 这样不会直接修改原始值的方法，从原始数组生成一个新的数组。然后就可以将 state 设置为这个新生成的数组。

下面是常见数组操作的参考表。当你操作 React state 中的数组时，你需要避免使用左列的方法，而首选右列的方法：
| 操作类型       | 避免使用（会改变原始数组）                  | 推荐使用（会返回一个新数组）                          |
|----------------|---------------------------------------------|-----------------------------------------------------|
| **添加元素**   | `push`, `unshift`                           | `concat`, `[...arr]` 展开语法                       |
| **删除元素**   | `pop`, `shift`, `splice`                    | `filter`, `slice`                                   |
| **替换元素**   | `splice`, `arr[i] = ...` 赋值               | `map`                                               |
| **排序**       | `reverse`, `sort`                           | 先将数组复制一份（推荐使用展开语法或 `slice()`）   |

## 向数组添加数据
push() 会直接修改原始数组，应该创建一个 新 数组，其包含了原始数组的所有元素 以及 一个在末尾的新元素。这可以通过很多种方法实现，最简单的一种就是使用 ... 数组展开 语法：
```jsx
setArtists( // 替换 state
    [ // 是通过传入一个新数组实现的
        ...artists, // 新数组包含原数组的所有元素
        { id: nextId++, name: name } // 并在末尾添加了一个新的元素
    ]
);
```

数组展开运算符还允许你把新添加的元素放在原始的 ...artists 之前：
```jsx
setArtists([
    { id: nextId++, name: name },
    ...artists // 将原数组中的元素放在末尾
]);
```
这样一来，展开操作就可以完成 push() 和 unshift() 的工作，将新元素添加到数组的末尾和开头。

## 从数组中删除数据
从数组中删除一个元素最简单的方法就是将它过滤出去。换句话说，你需要生成一个不包含该元素的新数组。这可以通过 filter 方法实现，例如：
```jsx
setArtists(
    artists.filter(a =>
        a.id !== artist.id
    )
);
```
这里，artists.filter(s => s.id !== artist.id) 表示“创建一个新的数组，该数组由那些 ID 与 artists.id 不同的 artists 组成”。换句话说，每个 artist 的“删除”按钮会把 那一个 artist 从原始数组中过滤掉，并使用过滤后的数组再次进行渲染。注意，filter 并不会改变原始数组。

## 转换数组
如果你想改变数组中的某些或全部元素，你可以用 map() 创建一个新数组。你传入 map 的函数决定了要根据每个元素的值或索引（或二者都要）对元素做何处理。

## 替换数组
想要替换数组中一个或多个元素是非常常见的。类似 arr[0] = 'bird' 这样的赋值语句会直接修改原始数组，所以在这种情况下，你也应该使用 map。

要替换一个元素，请使用 map 创建一个新数组。在你的 map 回调里，第二个参数是元素的索引。使用索引来判断最终是返回原始的元素（即回调的第一个参数）还是替换成其他值：
```jsx
const nextShapes = shapes.map(shape => {
        if (shape.type === 'square') {
            // 不作改变
            return shape;
        } else {
        // 返回一个新的圆形，位置在下方 50px 处
        return {
            ...shape,
            y: shape.y + 50,
        };
    }
});
// 使用新的数组进行重渲染
setShapes(nextShapes);
```

## 替换数组中的元素
想要替换数组中一个或多个元素是非常常见的。类似 arr[0] = 'bird' 这样的赋值语句会直接修改原始数组，所以在这种情况下，你也应该使用 map。

要替换一个元素，请使用 map 创建一个新数组。在你的 map 回调里，第二个参数是元素的索引。使用索引来判断最终是返回原始的元素（即回调的第一个参数）还是替换成其他值：
```jsx
const nextCounters = counters.map((c, i) => {
    if (i === index) {
        // 递增被点击的计数器数值
        return c + 1;
    } else {
        // 其余部分不发生变化
        return c;
    }
});
setCounters(nextCounters);
```

## 向数组中插入元素
有时，你也许想向数组特定位置插入一个元素，这个位置既不在数组开头，也不在末尾。为此，你可以将数组展开运算符 ... 和 slice() 方法一起使用。slice() 方法让你从数组中切出“一片”。为了将元素插入数组，你需要先展开原数组在插入点之前的切片，然后插入新元素，最后展开原数组中剩下的部分：
```jsx
const insertAt = 1; // 可能是任何索引
const nextArtists = [
    // 插入点之前的元素：
    ...artists.slice(0, insertAt),
    // 新的元素：
    { id: nextId++, name: name },
    // 插入点之后的元素：
    ...artists.slice(insertAt)
];
setArtists(nextArtists);
```

## 其他改变数组的情况
总会有一些事，是你仅仅依靠展开运算符和 map() 或者 filter() 等不会直接修改原值的方法所无法做到的。例如，你可能想翻转数组，或是对数组排序。而 JavaScript 中的 reverse() 和 sort() 方法会改变原数组，所以你无法直接使用它们。

然而，你可以先拷贝这个数组，再改变这个拷贝后的值。
```jsx
const nextList = [...list];
nextList.reverse();
setList(nextList);
```
在这段代码中，你先使用 [...list] 展开运算符创建了一份数组的拷贝值。当你有了这个拷贝值后，你就可以使用像 nextList.reverse() 或 nextList.sort() 这样直接修改原数组的方法。你甚至可以通过 nextList[0] = "something" 这样的方式对数组中的特定元素进行赋值。

然而，即使你拷贝了数组，你还是不能直接修改其内部的元素。这是因为数组的拷贝是浅拷贝——新的数组中依然保留了与原始数组相同的元素。因此，如果你修改了拷贝数组内部的某个对象，其实你正在直接修改当前的 state。举个例子，像下面的代码就会带来问题：
```jsx
const nextList = [...list];
nextList[0].seen = true; // 问题：直接修改了 list[0] 的值
setList(nextList);
```
虽然 nextList 和 list 是两个不同的数组，nextList[0] 和 list[0] 却指向了同一个对象。因此，通过改变 nextList[0].seen，list[0].seen 的值也被改变了。这是一种 state 的 mutation 操作，你应该避免这么做！可以用类似于 更新嵌套的 JavaScript 对象 的方式解决这个问题——拷贝想要修改的特定元素，而不是直接修改它。

## 更新数组内部的对象
通常来讲，你应该只直接修改你刚刚创建的对象。如果你正在插入一个新的 artwork，你可以修改它，但是如果你想要改变的是 state 中已经存在的东西，你就需要先拷贝一份了。