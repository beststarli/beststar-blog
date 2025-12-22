---
title: 关于jwt
description: JWT是一种开放标准，用于在网络应用之间安全地传输声明。
sidebar_position: 3
tags: [Web]
date: 2025-12-22
---

# 关于jwt

## 概念
JWT全称为JSON Web Token，是一种开放标准（RFC 7519），用于在网络应用之间安全地传输声明（claims）。它是一种紧凑的、URL安全的令牌格式，常用于身份验证和授权场景，例如单点登录（SSO）、API 认证等。JWT的核心优势在于其自包含性：令牌本身包含了所有必要的信息，无需额外查询数据库即可验证。

## 基本结构
JWT由三部分组成，用点号`.`分隔，编码为Base64Url格式：
- **Header（头部）**：描述令牌的元数据，如签名算法（例如 HS256、RS256）。
- **Payload（负载）**：包含声明信息，例如用户ID、角色、过期时间等（通常不包含敏感数据，因为它是Base64编码的，可被解码）。
- **Signature（签名）**：使用Header中的算法对Header和Payload进行签名，确保令牌未被篡改。

JWT字符串（简化示例）：
```txt
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
解码后：
- **Header**：`{"alg":"HS256","typ":"JWT"}`
- **Payload**: `{"sub":"1234567890","name":"John Doe","iat":1516239022"}`

## 工作原理
- **生成**：服务器根据用户信息生成JWT，并用密钥签名。
- **传输**：客户端将JWT存储在本地（如localStorage或Cookie），并在后续请求中通过HTTP头（如`Authorization: Bearer <token>`）发送。
- **验证**：服务器使用相同密钥验证签名和过期时间。如果有效，则允许访问资源。
- **过期与刷新**：JWT通常包含过期声明（exp），过期后需刷新令牌（Refresh Token）。

## 常见应用场景
- **Web应用认证**：如OAuth 2.0中的access token。
- **微服务架构**：服务间互信传输用户信息。
- **移动App**：无状态认证，避免会话管理开销。

## 优缺点

| 方面       | 优点                         | 缺点                             |
| ---------- | ---------------------------- | -------------------------------- |
| **安全性** | 自包含、不可篡改（签名机制） | Payload 可解码（不适合敏感数据） |
| **性能**   | 无需服务器存储状态           | 令牌较大，增加传输开销           |
| **适用性** | 跨域、分布式系统友好         | 注销困难（需黑名单或短过期）     |

## 注意事项
- **安全最佳实践**：使用HTTPS传输，避免在Payload中存敏感信息；定期轮换密钥；设置合理过期时间。
- **库支持**：大多数语言有现成库，如 Node.js的`jsonwebtoken`、Python的`PyJWT`。