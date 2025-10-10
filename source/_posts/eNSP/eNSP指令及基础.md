---
title: 华为eNSP基础指令
categories:
  - 系统类
tags:
  - ensp
  - 指令
cover: >-
  https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/OIP-C-1bc90f97feecf1994.jpg
summary: >-
  酥米小机器人来啦，这篇文章主要介绍了华为eNSP配置中的常见报错及基础指令使用方法常见报错包括Incomplete
  command命令不完整Unrecognized command命令有误Ambiguous
  command命令无法识别基础指令部分包含防止交换机配置时一直弹出信息的un info
  e进入特权模式的system-view返回的quit进入端口配置的interface命令进入console口的user-interface
  console修改主机名称的sysname以及查看端口状态的display ip interface
  brief接口类型方面access用于连接终端设备trunk用于连接另一台交换机通过port
  link-type命令切换不同接口类型操作时需注意命令语法的正确性以避免报错同时掌握常用指令的快捷方式能提升配置效率
date: 2024-05-27 15:21:46
---

## 常见报错：
```
Incomplete command：命令不完整
Unrecognized command：命令有误
Ambiguous command：命令无法识别
```

## 基础指令：
```
防止交换机配置时一直弹出信息：un info e（un in e）
进入特权模式：system-view（sy）
返回：quit/q
int   [端口]：进入该端口的配置
进入某个console口：user-interface console 接口
更换主机名称：sysname 主机名称
interface loopback：创建虚拟接口
display ip interface brief：查看所有端口的启用情况和ip地址
```

## 接口类型：
```
使用命令port link-type 【接口】来切换
access：用于连接终端，电脑等
trunk：用于连接另一台终端
```