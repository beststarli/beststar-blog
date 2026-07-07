---
title: 将JS对象转化为树形结构
description: 将JS对象转化为树形结构。
sidebar_position: 43
tags: [JavaScript,数据处理,手撕题]
date: 2026-07-07
---

## 示例
```js
// 转换前：
const source = [{
            id: 1,
            pid: 0,
            name: 'body'
          }, {
            id: 2,
            pid: 1,
            name: 'title'
          }, {
            id: 3,
            pid: 2,
            name: 'div'
          }]
// 转换为: 
const tree = [{
          id: 1,
          pid: 0,
          name: 'body',
          children: [{
            id: 2,
            pid: 1,
            name: 'title',
            children: [{
              id: 3,
              pid: 1,
              name: 'div'
            }]
          }
        }]
```

## 代码实现
```js
function jsonToTree(data) {
  // 初始化结果数组，并判断输入数据的格式
  let result = []
  if (!Array.isArray(data)) {
    return result
  }
  // 使用map，将当前对象的id与当前对象对应存储起来
  let map = {}
  data.forEach(item => {
    map[item.id] = item
  })
  // 遍历数据，判断当前对象的父级是否存在，如果存在，则将当前对象放入父级的children中，否则直接放入结果数组中
  data.forEach(item => {
    let parent = map[item.pid]
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      result.push(item)
    }
  })
  return result
}
```