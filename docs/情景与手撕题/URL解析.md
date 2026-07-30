---
title: URL解析
description: 将URL字符串解析为参数对象
sidebar_position: 76
tags: [JavaScript,场景题,手撕题]
date: 2026-07-30
---

将URL字符串解析为参数对象
## 输入输出
示例1:
**输入**：
```txt
"https://www.example.com:8080/path/to/page?name=test&age=18&tag=js#section1"
```
**输出**：
```txt
{
  "protocol": "https",
  "host": "www.example.com",
  "port": "8080",
  "pathname": "/path/to/page",
  "query": {
    "name": "test",
    "age": "18",
    "tag": "js"
  },
  "hash": "section1"
}
```

示例2:
**输入**：
```txt
"http://localhost/api?key=hello%20world"
```
**输出**：
```txt
{
  "protocol": "http",
  "host": "localhost",
  "port": "",
  "pathname": "/api",
  "query": {
    "key": "hello world"
  },
  "hash": ""
}
```

示例3:
**输入**：
```txt
"https://cdn.example.org/assets/logo.png"
```
**输出**：
```txt
{
  "protocol": "https",
  "host": "cdn.example.org",
  "port": "",
  "pathname": "/assets/logo.png",
  "query": {},
  "hash": ""
}
```

示例4:
**输入**：
```txt
"http://127.0.0.1:3000/?a=1&b=2#done"
```
**输出**：
```txt
{
  "protocol": "http",
  "host": "127.0.0.1",
  "port": "3000",
  "pathname": "/",
  "query": {
    "a": "1",
    "b": "2"
  },
  "hash": "done"
}
```

## 代码实现
```js
function parseURL(href) {
  const parsed = new URL(href)
  const query = {}
  parsed.searchParams.forEach((value, key) => {
    query[key] = value
  })

  return {
    protocol: parsed.protocol.replace(':', ''),
    host: parsed.hostname,
    port: parsed.port || '',
    pathname: parsed.pathname,
    query,
    hash: parsed.hash.replace('#', '')
  }
}
```