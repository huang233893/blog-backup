---
title: Trunk VTP and pVLAN
categories:
  - 思科
tags:
  - 网络
  - CCNP
cover: >-
  https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/vtppvlan%20(4).png
summary: >-
  酥米小机器人来啦，这篇文章主要介绍Trunk
  VTP和私有VLAN（pVLAN）的网络配置知识首先讲解VLAN编号范围其中0和4095为保留系统使用1为思科默认VLAN2-1001用于以太网VLAN1002-1005为FDDI及TokenRing保留1006-4094用于以太网特殊平台再说明Trunking配置方式包括手工静态配置和DTP动态协商协议VTP作为思科私有协议用于简化VLAN信息同步需在trunk链路上传递并每隔5分钟或有变化时发送通告其模式分为Server可管理VLANClient仅同步Transparent可转发但不同步最后阐述pVLAN结构通过主VLAN和辅助VLAN划分同一IP网段提升安全性隔离VLAN内部及跨隔离VLAN无法通信仅可通过混杂端口与主VLAN或辅助VLAN设备通信团体VLAN则允许同团体端口通信但需通过SV或路由器接口实现并指出混杂端口可与所有其他端口通信VLAN端口类型包括独立隔离混杂及团体模式
date: 2024-10-17 15:01:46
---

## VLAN范围（Dot1Q）
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/vtppvlan%20(4).png)

+ 0，4095	保留，系统使用
+ 1	思科默认vlan
+ 2-1001	For Ethernet VLANs
+ 1002-1005	思科默认为FDDI及TokenRing
+ 1006-4094	只能为Ethernet使用，在一些特殊平台使用

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/vtppvlan%20(2).png)

## Trunking配置
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/vtppvlan%20(3).png)

+ Trunk可以手工静态配置或者通过DTP进行协商
+ DTP是的交换机之间能够进行trunk协商



![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/vtppvlan%20(5).png)

## Trunk相关配置
```plain
Switch(config)# switchport mode access	#接口设置access模式
Switch(config)# switchport mode encapsulation {dot1q | ISL}	#如果接口是trunk，设置干道协议类型
Switch(config)# switchport mode dynamic {auto | desirable}	#将接口设置为DTP动态协商，可选auto或者desirable
Switch(config)# switchport nonegotiate	#将接口设置为nonegotiate，不发送DTP帧，如果配置非协商，那么就必须手工配置接口模式，为access或者trunk
```

## VTP（VLAN Trunking Protocol）
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/vtppvlan%20(7).png)

+ 思科的私有协议
+ 只能传递VLAN信息
+ 简化大型园区网中VLAN信息库同步的问题（同一个VTP管理域中）
+ 只同步VLAN信息
+ 需要交换机之间的trunk链路支持

## VTP模式
### Server
+ 可创建修改删除VLAN
+ 发送/转发信息宣告
+ 同步
+ VLAN信息存储于NVRAM
+ Catalyst交换机默认是server模式

### Client
+ 不能创建修改删除VLAN
+ 发送/转发信息宣告
+ 同步
+ VLAN信息不会存贮于NVRAM

### Transparent
+ 可创建修改删除VLAN 
+ 转发信息宣告
+ 不同步 不始发
+ VLAN信息存贮于NVRAM

### Tips：
+ 删除VLAN配置请使用`delete flash:config.text`，切勿使用`delete flash:`，这将会清除flash中的IOS固件

## VTP的运作
+ VTP协议通过组播地址0100-0CCC-CCCC在trunk链路上发送VTP通告
+ VTP Server和clients通过最高的修订号来同步数据部
+ VTP协议每隔5分钟发送一次VTP通告或者有变化时发生

![](https://img.picgo.net/2024/11/19/image-5b89cbafacef6088c.png)

## VTP的配置
```plain
Switch(config)# vtp domain cisco	#配置VTP域名
Switch(config)# vtp mode { server | client | transparent }	#配置本机VTP模式
Switch(config)# vtp password x	#（可选）配置密码
```

## 私有VLAN（PVLAN）
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/vtppvlan%20(1).png)

+ 主VLAN
+ 辅助VLAN
+ 团体VLANs
+ 混杂端口

## PVLANs
+ 将一个VLAN划分成几个单独的VLAN，这些VLAN都使用同一个IP网段
+ 可以提高安全性，降低子网数目，提高IP利用率
+ 尽管网络设备处于同一个子网中，但是他们属于不同的pVlan，pVlans之间的通信还是必须通过默认网关来实现。 
+ 每个pVLAN包括一个主VLAN以及多个辅助VLAN。
+ 所有的辅助VLAN都映射到主VLAN。辅助VLAN分为团体VLAN和隔离VLAN。
+ 相同团体VLAN能够互相通信(lay2)，但是团体VLAN之间必须通过设置SV或者路由器接口才能通信。
+ 相同隔离VLAN内部(端口之间)以及隔离VLAN之间都是不能够互相通信的，只能与混杂接口通信。
+ 一个主VLAN只能有一个Isolate vlan
+ 混杂端口能够与PVLAN中的任何设备通信，不管对方是处于主VLAN，还是辅助VLAN.

## VLAN port types
+ 独立（Isolated）
    - 仅与混杂端口通信
+ 混杂（Promiscuous）
    - 与所有其他端口通信
+ 团体模式（Community）
    - 与团体其他接口和所有混杂接口进行沟通