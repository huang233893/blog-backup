---
title: VLAN基础
summary: >-
  酥米小机器人来啦，这篇文章介绍了VLAN基础内容，包括VLAN作为虚拟局域网技术用于划分物理局域网为多个逻辑广播域，隔离不同VLAN间通讯，并详细描述了其作用如限制广播域节省带宽、增强网络安全性、提升稳定性以及灵活构建工作组，VLAN特点包括广播域局限、逻辑子网组成和基于端口划分，同时覆盖VLAN范围、TrunkAccess和Hybrid接口类型、MAC地址48位全球唯一、802.1Q帧标记细节、思科ISL私有协议以及VTP协议用于VLAN配置同步和模式ServerClientTransparent，还包括VTP修剪功能以及基础配置命令如vlan
  vlan-id和switchport mode设置，文中系统阐述了VLAN的核心原理和网络设备间通信管理细节以提升网络效率和安全
categories:
  - 思科
tags:
  - 网络
  - CCNA
cover: >-
  https://cdn.nlark.com/yuque/0/2024/png/44908083/1727261880185-f61475a1-7523-4625-bd01-30f41e930bec.png
date: 2024-10-17 15:01:46
---

<meta name="referrer" content="no-referrer" />

## 简介
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1727261880185-f61475a1-7523-4625-bd01-30f41e930bec.png)

+ VLAN即虚拟局域网，是将一个物理的LAN在逻辑上划分成多个广播域的通讯技术
+ 每个VLAN内可以互相通讯，而每个VLAN之间是完全隔离开的，并不能直接互通，每个VLAN间的广播报文就被隔离开来。

## VLAN的作用
+ **限制广播域：**广播域被限制在一个VLAN之中，节省了带宽，提升网络处理的效率
+ **增强局域网的安全性：**不同VLAN之间的报文广播互相隔离，有效提升安全性
+ **提升了局域网的稳定性：**单个VLAN局域网出问题下机时不会影响到其他的VLAN正常运行
+ **灵活构建虚拟工作组：**不同需求的用户划分到不同的VLAN之间，各个VLAN间发挥不同作用

## VLAN的特点
+ 一个VLAN中所有设备都是在同一广播域内；广播不能跨越VLAN传播
+ 一个VLAN为一个逻辑子网；由被配置为此VLAN成员的设备组成，不同VLAN间需通过路由器实现互相通讯
+ VLAN中成员多基于Switch端口号码，划分VLAN就是对Switch接口划分
+ VLAN工作于OSI参考模型的第二层

## VLAN的范围
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1727261984139-0609b985-a483-4055-bdee-b2c57a47cba0.png)

+ VLAN 1-1001皆可正常使用，1范围无法进行删除，1001无法进行创建使用和删除

## 接口类型
### Trunk接口
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1727261657279-d246491a-12c9-465a-9ad7-2bdcddc31dee.png)

Trunk一般用于路由器，交换机，AP间以及可同时收发Tagged帧和Untagged帧的终端之间支持互连，它可以允许多个VLAN的帧带Tag通过，但只允许一个VLAN的帧从该类接口上发出时不带Tag（即剥除Tag）。

### Access接口
Access接口一般用于和不能识别Tag的用户终端（如用户主机、服务器等）相连，或者不需要区分不同VLAN成员时使用。它只能收发Untagged帧，且只能为Untagged帧添加唯一VLAN的Tag。

### Hybird接口
Hybrid接口既可以用于连接不能识别Tag的用户终端（如用户主机、服务器等）和网络设备（如Hub），也可以用于连接交换机、路由器以及可同时收发Tagged帧和Untagged帧的语音终端、AP。它可以允许多个VLAN的帧带Tag通过，且允许从该类接口发出的帧根据需要配置某些VLAN的帧带Tag（即不剥除Tag）、某些VLAN的帧不带Tag（即剥除Tag）。

## Mac硬件地址
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1727261710061-f3a8792b-648d-4b3e-a4f9-9658ce187a77.png)

+ MAC地址有48位，通常表示为点十六进制数。
+ MAC地址全球唯一，有IEEE对这些地址进行管理的和分配。
+ 每个地址由两部分组成，分别是供应商代码和序列号。其中前24位二进制代表该供应商代码。剩下的24位由厂商自己分配。

## 802.1Q Tag
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1727253192833-a4d3a08b-6a08-473c-89f5-a728f93219aa.png)

### 802.1Q 帧标记
+ 默认情况下，在802.1Q Trunk上对所有的VLAN打Tag，除了Native VLAN；
+ 交换机根据以太网帧头信息来转发数据包；

### Tag标记字段详细信息
+ Tag标记字段包含一个2 bytes EtherType（以太类型）字段、一个3Bits的PRi字段、1bit的CFI字段、12bits的VLAN ID字段；

## ISL
### 特点
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1727232795002-f91da91e-f3d1-4769-90f7-5a1f695d9f6b.png)

+ 思科私有协议，仅可在思科的设备上互通
+ 通过硬件（ASIC）实现
+ ISL标识不会出现在工作站，客户端并不知道ISL的封装信息
+ 在交换机或路由器与交换机之间，在交换机与具有ISL网卡的服务器之间可以实现；

### 报文形式
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1727232857479-d7dc114a-8b8b-411a-95d9-30e0df6bbadf.png)

## VTP
+ 一个能够宣告VLAN的配置信息的信息系统；
+ 通过一个共有的管理域，维持VLAN配置信息的一致性；
+ VTP只能在主干端口发送要宣告的信息；
+ 支持混合的介质主干链接（快速以太网，FDDI，ATM）；

### VTP的运作
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1727262262150-ca39be19-8d3a-4ca5-9740-affe0d19cdb1.png)

+ VTP协议通过组播地址01-00-0C-CC-CC-CC在Trunk链路上发送VTP通告；
+ VTP Server和Clients通过最高的修订号来同步数据库；
+ VTP协议每隔五分钟发送一次VTP通告或者有变化时发生；

### VTP模式
#### Server
+ 删除vlan
+ 发送/转发信息宣告
+ 同步
+ 存储于NVRAM中
+ Catalyst交换机默认是server模式

#### Client
+ 发送/转发信息宣告
+ 同步
+ 不会存储于NVRAM

#### Transparent
+ 创建修改删除VLAN
+ 转发
+ 信息宣告
+ 不同步
+ 存储于NVRAM

### VTP Pruning（修剪）
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1727262775728-359c02e7-1c19-4ed2-8757-71c88d6e1b6c.png)

## 基础配置
```plain
SW1(config)# vlan vlan-id
SW1(config-vlan)# switchport mode [mode]
SW1(config-vlan)# switchport access vlan [vlan-id | none]
```