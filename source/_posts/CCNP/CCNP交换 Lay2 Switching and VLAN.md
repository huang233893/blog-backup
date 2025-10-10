---
title: Lay2 Switching and VLAN
categories:
  - 思科
tags:
  - 网络
  - CCNP
cover: >-
  https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/Lay2sw%26vlan%20(10).png
summary: >-
  酥米小机器人来啦，这篇文章主要讲解了L2交换和VLAN相关技术知识，包括基于硬件的L2交换特点如线速转发低延迟定义MAC地址，不同帧类型如IPARP
  RARP和IPXSPX的区分，MAC地址48位结构及全球唯一性，VLAN通过划分逻辑广播域实现设备隔离通信，Trunk链路用于传输多VLAN信息需两端匹配干道
  protocol，ISL和802.1Q两种VLAN
  encapsulation方式差异，其中ISL为思科私有协议支持2的10次方个VLAN，802.1Q为IEEE标准协议重新计算FCS，Native
  VLAN设置规则及默认vlan1的重要性，同时涉及交换机端口配置命令如switchport trunk native vlan和vlan dot1q tag
  native
date: 2024-10-17 15:01:46
---

## Lay2 Switching
### 简介</h3>
+ 基于硬件的交换
+ 线速转发性能
+ 低延迟
+ 定义MAC地址

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/Lay2sw%26vlan%20(10).png)

### Lay2 Frame
+ 类型字段取值为0800的帧代表IP协议
+ 类型字段取值为0806的帧代表ARP协议帧
+ 类型字段取值为0835的帧代表RARP协议帧
+ 类型字段取值为8137的帧代表IPX和SPX传输协议帧

Ethernet II帧

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/Lay2sw%26vlan%20(9).png)

802.3帧

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/Lay2sw%26vlan%20(8).png)

MAC
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/Lay2sw%26vlan%20(7).png)

+ MAC地址有48位，通常被表示为点分十六进制数
+ MAC地址全球唯一，由IEEE对这些地址进行管理和分配
+ 每个地址由两部分组成，分别是供应商代码和序列号。其中前24位二进制代表该供应商代码。剩下的24位由厂商自己分配

## VLAN概率回顾
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/Lay2sw%26vlan%20(6).png)



+ 形成逻辑的广播域，不同之间的VLAN互相隔离
+ 一个VLAN中所有设备都是在同一广播域内，不同的VLAN为不同的广播域VLAN之间互相隔离，广播不能跨越VLAN传播，因此不同VLAN之间的设备一般无法互访，不同VLAN间需通过三层设备实现相互通信
+ 一个VLAN一般为一个逻辑子网，由被配置为此VLAN成员的设备组成VLAN中成员多基于交换机的端口分配，划分VLAN就是对交换机的接口划分
+ VLAN工作于OSI参考模型的第二层
+ VLAN是二层交换机的一个非常根本的工作机制



## Trunk概念回顾
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/Lay2sw%26vlan%20(5).png)

+ 当一条链路，需要承载多VLAN信息的时候，需使用trunk来实现
+ Trunk两端的交换机需擦用相同的干道协议
+ 一般见于交换机之间或交换机与路由器、服务器之间

## ISL与802.1Q
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/Lay2sw%26vlan%20(4).png)

### ISL
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/Lay2sw%26vlan%20(3).png)

+ 思科私有协议
+ 支持PVST
+ 在原始数据帧基础上封装ISL头及新的FCS
+ 没有修改原始的数据帧，因此处理效率比802.1Q高
+ VLAN字段，15分比特目前用了十个，那么最多支持2的10次方=1024个VLAN

### 802.1Q
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/Lay2sw%26vlan%20(2).png)

+ IEEE共有协议
+ 插入Tag字段，同时重新计算FCS

## Native VLAN
+ Native VLAN所属的帧在经过trunk时不打标签
+ Native VLAN在Trunk两端必须匹配，否则会出现VLAN流量互串
+ 默认native vlan是vlan1
+ 建议将一个生僻的VLAN配置成Native VLAN

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/Lay2sw%26vlan%20(1).png)

### 基础配置
```plain
Router(config-if)# switchport trunk native vlan ? #在trunk设置native vlan
Router(config)# vlan dot1q tag native #也对native vlan打标签
```