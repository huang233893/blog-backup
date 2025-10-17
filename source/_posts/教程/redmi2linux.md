---
title: 红米2？Linux？ | 手把手教你刷入PostmarketOS Linux！老机换新颜！
description: 酥米手把手教你把红米2刷入PostmarketOS Linux！
summary: >-
  酥米小机器人来啦，这篇文章介绍了如何将红米2刷入PostmarketOS
  Linux系统的方法，适用于1g或2g版机型，2a版不支持。前期需要准备数据线、电脑及对应的线刷包和Miflash工具，根据机型下载不同版本刷机包并更新系统至安卓5.1以上。刷入PostmarketOS时需进入Fastboot模式，依次刷入Recovery、引导文件及rootfs，过程中需通过ADB工具执行命令完成刷机，系统默认密码为147147且基于AlpineLinux，软件生态较少建议使用flatpak安装应用。最终可成功启动PostmarketOS系统并附带部分截图和视频教程。
tags:
  - 系统
  - 刷机
  - 教程
categories: 
  - 搞机类
cover: >-
  https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/7f9ab381466b2cab6d83ae8962a5d2281459383e.jpg%40672w_378h_1c.webp
date: 2025-08-19 19:05:13
---

# 前言
本期教程将小白式手把手教大家将红米2刷入PostmarketOS

# 前期准备
- 红米2（1g或者2g版都行，2a不支持刷入Linux）
- 数据线
- 正常使用的电脑（建议系统版本windows10以上）
- 灵巧的手和脑子

# 合并分区
已升级安卓5.1的增强版机型可以跳过此步骤，非增强版或未升级安卓5.1的增强版请继续往下

## 下载附件
请按照以下机型下载线刷包

{% link 线刷包,红米2移动版/2a,https://xiaomirom.com/download/redmi-2-redmi-2-pro-wt86047-stable-V9.2.3.0.LHJCNEK/#china-fastboot %}

{% link 线刷包,红米2联通/电信版,https://xiaomirom.com/download/redmi-2-redmi-2-pro-wt88047-stable-V9.2.5.0.LHJMIEK/#global-fastboot %}

{% link Miflash,Miflash刷机工具,https://miuiver.com/miflash/ %}

## 更新最新版系统合并分区
红米2官方系统安卓5.1版本往上会自动合并分区，仅需使用miflash线刷更新系统即可

首先长按电源键+音量下键将红米2进入Fastboot，并且使用数据线与电脑连接
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-19%20194026.png)
解压下载好的miflash工具，打开点击左上角的driver选项，点击安装，显示完成后关闭
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-19%20194247.png)
解压线刷包，miflash中点击选择，选择刚解压的线刷包文件夹
点击加载设备，让工具识别到设备，识别到了点击刷机等待进度条跑完。如未识别到设备请检测驱动是否安装。
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-19%20194312.png)
进度条跑完后手机会自动重启，此时即更新完成


# 刷入PostmarketOS Linux
## 下载附件
请下载以下刷机包和附件

红米2全系PostmarketOS下载：https://images.postmarketos.org/bpo/edge/xiaomi-wt88047/phosh
ADB，recovery，lk2nd等文件的下载地址：https://www.123pan.com/s/mIXlVv-I7PB.html 提取码:sumi

## 开始刷入PostmarketOS
首先长按电源键+音量下键将红米2进入Fastboot，并且使用数据线与电脑连接

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-19%20194026.png)

解压adb工具，打开cmd，cd到adb目录
刷入fastboot device检测设备
出现`xxxxxxxx  fastboot`即成功识别设备

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-19%20194328.png)

输入`fastboot flash recovery “刚下载的rec.img的文件地址”`以刷入Recovery

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-19%20194045.png)

之后手机长按电源键+音量上键进入工程模式，选择recovery模式进入

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-19%20210211.png)

进入rec后点击settings，更改成简体中文
之后选择清除-高级清除，选择data、system、cache然后滑动清除进行格式化

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-19%20194108.png)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-19%20194140.png)

之后选择格式化Data，输入yes清除，清除后按返回回到主界面

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-19%20194151.png)

选择重启-Bootloader模式进入线刷模式

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-19%20194203.png)

打开cmd，cd到adb目录
输入`fastboot flash boot “刚下载的lk2nd.img的文件地址”`以刷入引导文件

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-19%20194003.png)

输入后fastboot reboot回车进入lk2nd

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-19%20210821.png)

输入以下命令刷入内核和rootfs
```
fastboot flash boot “刚下载的boot.img的文件地址”
fastboot flash userdata “刚下载的rootfs.img的文件地址”
```

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-08-19%20210752.png)

刷入后输入fastboot reboot回车或者单击手机电源键即可进入PostmarketOS系统啦！

## Tips
系统默认密码为：147147
由于postmarketOS基于alpine而并非常见发行版，软件源生态匮乏，建议使用flatpak安装部分软件
## 部分截图
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/IMG_2290.jpg)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/IMG_2289.jpg)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/IMG_2275.jpg)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/IMG_2274.jpg)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/IMG_2291.jpg)
## 视频版

<iframe class="bilibili" src="//player.bilibili.com/player.html?isOutside=true&aid=785369943&bvid=BV1E14y1m7xg&cid=1177972746&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts" > </iframe>