---
title: 介绍
description: 记录React Native移动端开发学习笔记。
sidebar_position: 1
date: 2025-12-09
---

# React Native介绍

## 介绍

记录React Native移动端开发学习笔记。

## 记录在前
React Native是一个优秀的跨平台框架，可以用JavaScript编写一次代码，同时生成iOS和Android应用。我的个人手机是IPhone为iOS系统，所以我期望学习开发一款iOS应用程序，但iOS开发有严格限制：Apple的Xcode和iOS SDK仅支持macOS，因此由于系统环境限制，在纯Windows环境下无法直接构建或运行iOS应用（包括模拟器）。 我可以在Windows上针对Android编写和调试代码，但iOS构建需要额外方案。

好消息是，有两种实用方法：**使用Expo框架+云构建服务（推荐，简单无硬件需求）**或**安装macOS虚拟机（更灵活，但复杂）**。

我选择使用Expo，Expo减少了环境配置的痛点，适合快速原型和MVP项目。