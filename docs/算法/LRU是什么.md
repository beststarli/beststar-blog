---
title: LRU是什么
description: LRU是Least Recently Used的缩写，中文译为“最近最少使用”，是一种常见的缓存淘汰算法（Cache Eviction Algorithm）。
sidebar_position: 6
tags: [LeetCode]
date: 2026-01-10
---

# LRU是什么
## 前言
**缓存**是我们写代码过程中常用的一种手段，是一种空间换时间的做法。就拿我们经常使用的 HTTP 协议，其中也存在强缓存和协商缓存两种缓存方式。当我们打开一个网站的时候，浏览器会查询该请求的响应头，通过判断响应头中是否有`Cache-Control`、`Last-Modified`、`ETag`等字段，来确定是否直接使用之前下载的资源缓存，而不是重新从服务器进行下载。

当我们访问Github时，某些资源命中了协商缓存，服务端返回`304`状态码，还有一部分资源命中了强缓存，直接读取了本地缓存。
![LRU-1](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/algorithm/LRU1.png)

但是，缓存并不是无限制的，会有大小的限制。无论是我们的`cookie`（不同浏览器有所区别，一般在`4KB`左右），还是`localStorage`（和`cookie`一样，不同浏览器有所区别，有些浏览器为`5MB`，有些浏览器为`10MB`），都会有大小限制。

这个时候就需要涉及到一种算法，需要将超出大小限制的缓存进行淘汰，一般的规则是淘汰掉最近没有被访问到的缓存，也就是今天要介绍的主角：**LRU**（Least recently used：最近最少使用）。

## 什么是LRU
LRU（Least Recently Used）即最近最少使用缓存，前端在做性能优化的时候会经常用到使用到缓存，用以空间换时间的方式来达到性能优化目标。这个算法在缓存写满的时候，会根据所有数据的访问记录，淘汰掉未来被访问几率最低的数据。也就是说该算法认为，最近被访问过的数据，在将来被访问的几率最大。

最常用到的缓存库就是`lru-cache`，前端SSR框架nuxt就是使用`lru-cache`来实现其页面缓存、组件缓存和接口缓存的功能，以降低服务器cpu的负载提高SSR页面的并发数。
![LRU-2](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/algorithm/LRU-2.png)
0. 假设我们有一块内存，一共能够存储 5 数据块；
1. 依次向内存存入A、B、C、D、E，此时内存已经存满；
2. 再次插入新的数据时，会将在内存存放时间最久的数据A淘汰掉；
3. 当我们在外部再次读取数据B时，已经处于末尾的B会被标记为活跃状态，提到头部，数据C就变成了存放时间最久的数据；
4. 再次插入新的数据G，存放时间最久的数据C就会被淘汰掉；

## LRU实现
LRU的实现有以下要求：
- 需要给定一个数据结构的长度，不能无限制的缓存数据；
- LRU 实例提供一个 get 方法，可通过关键字 key 获取缓存中数据，若没有则返回 -1；
- LRU 实例提供一个 put 方法，变更数据值，若数据存在则修改，不存在则插入一条新数据，插入时超过数据长度则删除最久未使用的关键字。
- get、put的时间复杂度必须是 O(1)

## 数据结构选型
### 问题一
想要实现1、2、3的要求是很容易的，用纯数组就可以实现上述3点的需求，但是在时间复杂度的要求上达不到，用数组的话，不管是get还是put方法的时间复杂度都为O(n)。

所以为了实现对存储结构操作的，这里选择双向链表来实现缓存数据的存储。

### 问题二
在选择双向链表后又出现了一个新问题, 众所周知，对链表插入与删除时间复杂度为O(1)，但是链表的查找时间复杂度却为O(n)，在实现get的过程中肯定会使用到查询操作。

为了解决查询的时间复杂度问题，自然就想到了Map数据结构。ES6的Map数据结构是查询的时间复杂度正是为O(1)。

其实这里使用对象也是可以实现一些简单的需求的，如果key为number或者为string，只需要操作时转化一下即可，也能实现需求。但是需要key类型更复杂的场景，直接使用对象时达不到LRU的要求的。

这里通过`双向链表`，`Map`的数据结构的组合来实现LRU，使用`双向链表`存储数据，使用`Map`标记链表中key的位置这样就可以很容易实现LRUCache的数据结构。因为要实现O(1)的时间复杂度，首先想到的就是使用ES6的Map数据结构来实现。

## 简单实现
```ts
class LinkNode {
    key: number
    value: number
    _prev: LinkNode | null
    _next: LinkNode | null
    constructor(key: number, val: number) {
        this.key = key
        this.value = val
        this._prev = null
        this._next = null
    }
}

class LRUCache {
    head: LinkNode | null
    tail: LinkNode | null
    size: number
    map: Map<number, LinkNode>
    constructor(capacity: number) {
        this.size = capacity
        this.map = new Map()
        this.head = null
        this.tail = null
    }

    get(key: number): number {
        // 在 map 中查找是否存在有这条数据
        if (this.map.has(key)) {
        let node = this.map.get(key) as LinkNode
        let _prev = node._prev
        let _next = node._next

        // 判断是否为头节点，若为头节点则不需要对链表作任何操作，直接返回值，若部位头肩点，需要操作链表达到最近缓存的操作
        if (_prev) {
            // 不为节点需要将该节点移动到头节点的位置

            // 当前节点是尾部节点的情况
            if (!_next) {
            this.tail = _prev
            } else {
            _next._prev = _prev // 等价于 node._next._prev = node._prev
            }

            // 1. 链表操作，移除 node 节点
            _prev._next = _next // 等价于 node._prev._next = node._next

            // 2. 将 node 节点放到链表头部
            node._prev = null

            if (this.head) {
            node._next = this.head
            this.head._prev = node
            }
            this.head = node
        }

        // 返回想要查找的数据值
        return node.value
        }

        return -1
    }

    put(key: number, value: number): void {
        // put 功能包括两部分，修改和新增

        if (this.map.has(key)) {
        // 修改
        let node = this.map.get(key) as LinkNode
        node.value = value
        let _prev = node._prev
        let _next = node._next

        if (_prev) {
            if (!_next) {
            this.tail = _prev
            } else {
            _next._prev = _prev // 等价于 node._next._prev = node._prev
            }

            // 非头部节需要把节点提到链表头部
            _prev._next = _next
            node._next = this.head
            node._prev = null
            this.head && (this.head._prev = node)
            this.head = node
        }
        } else {
        let node = new LinkNode(key, value)
        this.map.set(key, node)

        if (this.head) {
            node._next = this.head
            this.head._prev = node
            this.head = node
        } else {
            this.head = this.tail = node
        }

        // 新增数据的场景
        if (this.map.size > this.size) {
            let _tail = this.tail as LinkNode
            this.map.delete(_tail.key)

            this.tail = _tail._prev

            if (this.tail) {
            this.tail._next = null
            }

            if (this.head.key === _tail.key) {
            this.head = null
            }
        }
        }
    }
}
```

## 参考
- [**前端必学算法- LRU（最近最少使用缓存）**](https://juejin.cn/post/7046670981120655368?searchId=202604011613129E567BC296390603072B)
- [**漫画：什么是LRU算法？**](https://juejin.cn/post/6844903729167073288)
- [**什么是 LRU 算法？**](https://juejin.cn/post/7074754596480286734?searchId=202604011613393D663262C1D52C042A86)
