---
title: 帧中继FrameDelay
summary: >-
  酥米小机器人来啦，这篇文章介绍了帧中继（Frame
  Relay）作为一种广泛使用的广域网（WAN）协议，主要聚焦于其基本原理和关键组件帧中继使用虚电路连接提供面向连接的服务，速率范围在56K到2M之间核心概念包括虚电路（VC）作为逻辑连接标识，DLCI用于本地标识连接，以及LMI作为本地管理接口用于链路维护拓扑结构涵盖星型、全互联和部分互联设计，前者简化管理但后者成本高地址映射涉及DLCI与IP地址的映射方式，可通过手工配置或自动发现（Inverse
  ARP）文章还涵盖帧中 relay的特性，如模拟广播方法和基本配置示例，通过特定路由器命令实现虚电路映射及协议封装，整体强调其高效带宽共享和灵活网络设计特性
categories:
  - 思科
tags:
  - 网络
  - CCNA
cover: https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/image78afa5a21ee4c356.png
date: 2024-10-17 15:01:46
---

## 简介
![](https://img.picgo.net/2024/11/19/image78afa5a21ee4c356.png)

+ 使用虚电路进行连接
+ 提供面向对象的服务
+ 应用非常广泛的WAN协议
+ FR交换设备在用户路由器间建立虚电路，提供基于分组交换的二层通道
+ 面向连接的数据链路技术
+ 速率：56K - 2M

## 帧中继术语VC
![](https://img.picgo.net/2024/11/19/image-1822fb32e7964aa45.md.png)

### 虚电路（VC）
+ 通告帧中继实现的逻辑连接叫做虚电路（VC）
+ 利用虚电路，帧中继允许多个用户共享带宽，而无需使用多条专用物理路线，虚电路是以DLCI标识的

### DLCI（Data Link Connection Identifilier）数据链路连接标识
+ 通常由帧中继服务提供商（例如电话公司）分配
+ 帧中继DLCI仅具有本地意义
+ DLCI 0到15和1008到1023留作特殊用途。服务提供商分配的DLCI范围通常为16到1007

### LMI（本地管理接口）
+ 是一种信令标准，用作管理链路连接及keepalive的机制
+ 终端路由器（DTE）和帧中继交换机（DCE）之间的帧中继设备没10秒（或大概如此）轮询一次网络
+ 思科路由器支持三种LMI，分别是Cisco，Ansi和q933a

路由器从帧中继交换机的帧封装接口接受LMI信息，并将虚链路状态更为下列3钟状态之一：

+ Active State正常状态 
+ Inactive State远程路由器没有在工作
+ Delete State接口没有收到交换机的仍和LMI信息，可能是映射问题或者线路问题

## 帧中继拓扑


### 星型结构（Hub-and-spoke）
![](https://img.picgo.net/2024/11/19/image-2376cc5397034bbb7.md.png)

#### 特点

+ 从一点连接到各处（集中点）



### 全互联（Full Mesh）
![](https://img.picgo.net/2024/11/19/image-329c02835daa6f3fe.md.png)

#### 特点

+ 互相连接

#### 缺点

+ 代价过大



### 部分互联（Partial-Mesh）
![](https://img.picgo.net/2024/11/19/image-42dad52386351e79e.md.png)

#### 特点

+ 节省成本的同时保证稳定性

## 帧中继 地址映射
![](https://img.picgo.net/2024/11/19/image-58ee3b624d6f870af.png)

+ 帧中继映射条目，DLCI从运营商处获取，映射关系为远端的IP地址到本地DICI之间的联系
+ 可以通过手工配置或Inverse ARP自动发现

## Tips
+ 帧中继虽不支持广播，但可以“模拟”广播的操作，做法即是通过向所有的PVC发送一份数据的拷贝
+ 在建立PVC的时候，通过invers-arp自动建立映射，默认就开启上述特性，如果是手工映射，则必须加上boardcast关键字

## 基础配置
### 简单例子
![](https://img.picgo.net/2024/11/19/image-6b7b1ff832a361354.md.png)

```plain
Router(config)# int s0/0
Router(config-if)# ip add 10.1.123.1 255.255.255.0
Router(config-if)# encapsulation frame-relay
Router(config-if)# no frame-relay inverse-arp #关闭insverse-arp
Router(config-if)# frame-relay map ip 10.1.123.2 102 broadcast #手工配置帧中继映射
Router(config-if)# frame-relay map ip 10.1.123.3 103 broadcast
```

```plain
Router(config)# int s0/0
Router(config-if)# ip add 10.1.123.2 255.255.255.0
Router(config-if)# encapsulation frame-relay
Router(config-if)# no frame-relay inverse-arp  #关闭insverse-arp
Router(config-if)# frame-relay map ip 10.1.123.1 201 broadcast #手工配置帧中继映射
```