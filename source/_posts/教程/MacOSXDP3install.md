---
title: MacOS X 10.0 Developer Preview 3安装教程（附酥米的MacOS的小记说说）
description: MacOS X 10.0 Developer Preview 3安装教程（附酥米的MacOS的小记说说）
summary: >-
  酥米小机器人来啦，这篇文章讲述了如何安装MacOS X 10.0 Developer Preview 3。前言指出MacOS
  Classic系统因历史包袱，存在协作式多任务管理及内存缺乏保护的问题，程序崩溃甚至会导致系统瘫痪。转折回顾了苹果对全新内核探索未果，但乔布斯带回NeXTSTEP并发展为基础架构，随着Rhapsody发布，最终演进为现代MacOS系统的早期面貌。安装部分使用QEMU模拟器，需从网络下载镜体及操作系统ISO，通过编写脚本启动虚拟机。接着借助MacOS9光盘完成磁盘分区与操作系统安装，安装后进行一系列设置包括密码设定、网络配置、区域及时间选择等，最后达成自动登录或普通启动，标志着初代MacOS
  X体验环境搭建完毕。
tags:
  - 系统
  - 苹果
categories: 教程类
cover: >-
  https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(1).jpg
date: 2024-11-26 19:17:13
---

### 前记

在MacOS X之前的MacOS，是属于Classic系列的传统操作系统，由于历史包袱的原因，MacOS Classic对多任务的支持并不完善，采用的是基于程序的协作式多任务管理，把内存依托于应用程序分配，再且加上Classic中并没有所谓的内存保护，导致程序和系统处在同一内存空间中，这就导致一个问题，当程序发生崩溃时，整个系统也会随之崩溃。

![MacOS Classic](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(1).jpg)

Apple尝试过修复或者完善这些“烂摊子”，但是由于系统历史包袱原因，系统框架过于老旧。再是后期推出的的系统扩展，系统扩展由第三方或官方提供，可以扩展系统功能或者添加驱动，这就导致一个问题，因为Classic所有的应用扩展驱动系统都是在一个空间内，没有进行隔离，如果扩展冲突或者报错，机子将会连系统一起’宕机‘。

### 转折

苹果也陆陆续续尝试过如copland和AU/X的全新内核的系统，但无一例外，都失败了。直到1997年，苹果收购NeXT公司，被遣退的乔布斯带着NeXTSTEP回到苹果掌舵，NeXTSTEP是乔布斯基于Mach和BSD研发的操作系统，具有完善的GUI，面向对象和Objective-C，强大的多媒体功能，这在当时是十分超前的的。苹果基于NeXTSTEP开发出了现MacOS X Darwin的前身XNU混合内核，之后在1997年中发布了Rhapsody预览开发版，这就是MacOS X的前身……

![NeXTSTEP](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(2).jpg)

之后的事情大家都知道，Rhapsody的大部分组件大幅度得到保留并且逐步完善，并且一步步成为现在的MacOS系统。

### 安装

好啦！酥米扯远了，接下来要体验的版本就是初代MacOS X10.0的预览版本DP3，说起这个预览版本还是很有趣的，DP1和DP2和Rhapsody差不多，用的也是Platinum的界面，还是NeXT+MacOS Classic的味道。但是来到DP3，事情将会截然不同起来，DP3引入了全新的Aqua界面，提升了系统的精致程度（顺带提一嘴，这个aqua界面修修补补用到现在的MacOS最新版）

#### Qemu
这次我们使用Qemu-system-ppc进行模拟安装
镜像可以在WinWorldPC中下载
下载链接：

{% link WinWorldPC,镜像下载链接,http://www.emaculation.com/forum/viewtopic.php?f=34&t=9028 %}

首先将qemu-system-pc解压在目录，然后编写一个Bat脚本用于启动qemu虚拟机
```
qemu-system-ppc.exe ^
-L pc-bios ^
-M g3beige ^
-cpu G3 ^
-m 512 ^
-drive file=mac.img,format=raw,media=disk ^  ##虚拟磁盘地址，可以通过qemu-img创建，需8g以上
-drive file=Mdp2.iso,format=raw,media=cdrom ^ ## 安装镜像地址
-prom-env "vga-ndrv?-true" ^
-prom-env "boot-device=cd:9,\\:tbxi" ^
-usb ^
-netdev user,id=network01 -device sungem,netdev=network01 ^
-device VGA,edid=on ^
-boot c
```
#### 磁盘分区
由于DP版本没有磁盘管理工具，所以需要借助MacOS9的启动光盘进行分区,按照图中进行操作就行
- 打开磁盘分区工具

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/082c7e3d-a76a-44da-94b3-561fed6a306d933d5c1c097fe20b.png)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/b3bede69-ba0e-4ab7-b395-6fca629d892d64f4b84c3853ac43.png)

- 选中刚刚的虚拟磁盘，点击Initialize

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(5).png)

- 再次选择Initialize

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/4d88753e-b7e5-4d36-b6d3-2dddf21b055d87520d3fb48e80d7.png)

至此磁盘的分区步骤全部完毕，接下来就是安装系统啦！

### 正式安装
- 将虚拟机关机，更换光盘镜像，再次启动虚拟机，等待开机……

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(13).png)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/288631E8586752E8507D5DCC3B077CF7b3b611b98f705add.png)

- 选择Continue继续

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(19).png)

- 选择下一步并且Agree

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(16).png)

- 然后选择硬盘下一步

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(3).png)

- 然后按install进行安装

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(12).png)

- 安装ing……

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/754908397BAF9C1028F57134BAA3C458600fdd045b1f72b8.png)

- 安装完成啦！不要让模拟器自动重启哦，直接关闭模拟器，进行下一步操作

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/55abc630-feb1-4a66-b2b4-b89de93c2a30fb098cd1894a107a.png)
#### 正式启动前的最后配置
- 将虚拟机启动脚本的下列稍加修改，让模拟器使用硬盘启动

修改前
```
-boot c # 启动设备
-prom-env "boot-device=cd:9,\\:tbxi" ^ # 指定启动设备
```
修改后
```
-boot d #把c改成d，d为硬盘启动，c为从光盘启动
# 去掉了指定启动设备语句
```
- 再次打开模拟器，就可以慢慢等待模拟器启动啦！
- 进系统啦！第一次安装完会弹出设置助理

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(21).png)

- 点击右下角的箭头下一步
- 这里输入管理员的密码，然后下一步

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(20).png)

- 这里网络设置直接跳过，选择下一步

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(22).png)

- 这里直接下一步

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(9).png)

- 这里是DNS和域名设置，不设置直接下一步

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(18).png)

- 这里是远程登录，可开可不开，选完直接下一步

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(2).png)

- 地区设置

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(17).png)

- 时间设置

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(4).png)

- 用户设置，选择Add可以创建用户

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(11).png)

- 自动登录，可以选择自动并且输入账户密码，可选可不选

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(15).png)

- 设置预览，没有问题就可以选择go ahead继续啦

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(10).png)

#### 完成安装啦！
- 重启之后就可以享受新界面带来的赏心悦目了，Enjoy it! :)
附上一些系统截图

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/396F014F493B905FD9C40FFB95F1E9C242d67356d36b8391.png)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(8).png)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(1).png)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/macosxdp%20(14).png)

### 视频版
#### 本教程根据视频版编写

<iframe class="bilibili" src="//player.bilibili.com/player.html?isOutside=true&aid=959704963&bvid=BV1rp4y1u7ep&cid=1298459925&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts" > </iframe>