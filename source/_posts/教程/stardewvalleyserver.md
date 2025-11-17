---
title: 没有显卡也能在Windows下开星露谷服务器啦！无显卡开设星露谷物语服务器
description: 无显卡在windows下开设星露谷物语服务器
summary: >-
  酥米小机器人来啦，这篇文章介绍了在无显卡的Windows服务器上配置星露谷物语服务器的方法，无需安装Linux或具备代码基础，通过使用Mesa驱动模拟3D显卡使游戏能正常运行，同时提到了配置模组、解决联机公网问题以及相关文件下载链接等内容。
tags:
  - 游戏
  - 教程
categories:
  - 教程类
cover: >-
  https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/svs1-8.webp
date: 2025-11-17 19:50:13
---

## 前提

{% note danger flat %} 星露谷物语本身不存在服务端这个概念，所谓服务器端仅是客户端加装模组的联机模式，望各位周知。 {% endnote %}

众所周知，星露谷物语对于显卡驱动有要求，驱动打不对或者没有显卡就**打不开**游戏了，这对于一般不带集显（独显）的服务器就是一个十足的劣势了，其实也是有办法绕过的，但是大部分教程都是让你安装Linux还要配置docker容器，其中的难度已经劝退85%的人了，并且还没有算上网络环境导致的下载问题。

最近知道了一个方便的方法在无显卡的服务器在Windows下配置星露谷服务器，**不需要Linux**，**不需要代码基础**，**仅需要点击鼠标键盘就行**。

## 需要的东西

- 服务器VPS一个，Windows7系统以上（1核2g以上，建议2h2g，不然多人会卡）
- 星露谷物语本体（学习版steam版皆可，*建议学习版*）我这里使用的是1.6.15（*由于版权问题，学习版请自行搜索下载*）
- SMAPI模组加载器（建议版本在4.1.10。网盘中有一个，可以不用跑去github下载，多人服务器模组据说在新版本的模组加载器上会出问题）
- 服务器的模组（我已经打包好放在网盘啦，仅在1.6.15上测试正常，其他版本需自行测试）
- mesa驱动，可以在网盘链接中下载，也可以在github下载最新版

## 配置模组和服务端

1. 解压游戏本体，安装模组加载器（这个网上有教程，比较容易，可以自行在网上搜教程）

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/svs1-2.jpg)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/svs1-4.jpg)

2. 复制压缩包的所有模组到打过模组加载器的游戏根目录Mods文件夹

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/svs1-3.jpg)

至此，服务端的配置也就到这里了，接下来就是修复无独显导致游戏打不开的问题

## 修复无独显导致打不开游戏的问题

一般没有显卡的情况下，直接打开模组加载器启动游戏，会报一大段红色报错，大概意思就是找不到显卡设备（原版打开直接没有任何反应）。

此时我们就需要Mesa这个驱动啦，它可以虚拟一个3d显卡出来，供星露谷物语使用（实际仍使用cpu进行计算）

下载 `mesa3d-25.2.6-release-mingw.7z` 之后，解压它，里面有两个cmd文件，首先运行 `perappdeploy.cmd`（使用管理员权限），让它初始化显卡驱动
打开之后一直回车到窗口消失即可，之后运行 `systemwidedeploy.cmd`（使用管理员权限），安装Mesa3D驱动，需要下一步的地方直接回车，直到窗口消失，这样就安装完成啦。

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/svs1-1.jpg)

此时可以直接打开游戏测试效果啦！本人亲测可以正常开服使用，并且没有太大的问题

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/svs1-5.jpg)

小小提一嘴，星露谷的联机挺不错的，和Minecraft基岩版一样，支持跨平台联机。

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/svs1-6.jpg)

不过星露谷的服务器可比mc服务器占用少太多了，我的i3 NAS随便带。

## 公网问题

纯原版开服建议使用樱花frp或其他内网穿透（**有公网地址最好**），星露谷物语原生不支持ipv6联机，有条件可以给客户端打ipv6补丁以支持v6公网链接（服务端模组自带ipv6支持）

## 文件链接

网盘链接：

{% link 需要用到的材料（国内镜像） 密码:38zf,蓝奏云,https://wwtr.lanzouw.com/b0nzni3oh %}

以下是原项目地址链接：

{% link mesa-dist-win,pal1000,https://github.com/pal1000/mesa-dist-win/releases %}

{% link SMAPI,Pathoschild,https://github.com/Pathoschild/SMAPI/releases %}