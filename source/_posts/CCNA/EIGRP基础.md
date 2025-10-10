---
title: EIGRP基础
summary: >-
  酥米小机器人来啦，这篇文章主要介绍了EIGRP作为思科私有路由协议的基础知识，其从IGRP发展而来但算法大幅改进，采用D-V算法，在收敛速度、网络带宽和系统资源使用上有显著提升，具备无环路、快速收敛、支持大规模网络等优点；它是一种高级距离矢量协议，支持无类路由、VLSM和不连续子网，依赖DUAL算法确保最佳路径计算和备用路由；EIGRP的核心组件包括邻居表、拓扑表和路由表，通过Hello、更新、查询、应答及ACK等数据包进行路由交换，metric基于延迟和带宽计算，默认权重设置为延迟和带宽之和；它还支持快速收敛、触发更新、不等价负载均衡，并通过简单配置如在路由器上启用EIGRP并指定自治系统等相关命令来实现基本设置。
categories:
  - 思科
tags:
  - 网络
  - CCNA
cover: https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/EIGRP%20(4).png
date: 2024-10-17 15:01:46
---

## 简介
EIGRP是思科发明的一个私有路由协议，由IGRP发展而来，但是算法做了很大的改动。EIGRP和IGRP，RIP一样是一个采用D-V算法的动态路由协议，在收敛速度，占用网络带宽和系统资源等方面有了很大的改进，且有收敛快，无环路由计算，可以应用于大规模网络的优点。

## 特点
+ 高级距离矢量协议——具有距离矢量性和链路状态协议特征
+ 无类路由协议——可划分子网、可聚合子网路由
+ 支持VLSM与不连续子网
+ 100%无环路——DUAL算法
+ 快速收敛——路由条目用不更新，拥有备份路由
+ 触发更新
+ 低路由更新信息开销
+ 配置简单
+ 支持多种路由协议（IP、IPX、Appletalk、etc. ）

## EIGRP的前身 IGRP
懒得打字了，直接上图

 ![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/EIGRP%20(4).png)



## 三张表
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/EIGRP%20(2).png)

+ IP EIGRP Neighbor Table（EIGRP邻居表）
+ IP EIGRP Topology Table（EIGRP技术表）
+ The IP Routing Table（路由表）

## EIGRP数据包
### Hello分组

以224.0.0.10发送，无需确认hello包

EIGRP依靠分组来发现，验证和重新发现邻居router

以固定时间发送hello包，改时间间隔与接口带宽有关

LAN上默认为5S

### 更新

EIGRP协议的这些更新数据包只在必要的时候传递必要的信息,而且仅仅传递给需要路由信息的路由器。当只有某一指定的路由器需要路由更新时,更新数据包就是单播发送的;当有多台路由器需要路由更新时,更新数据包就是组播发送的以可靠的方式发送，需要确认

### 查询

当某条路由丢失，向邻居查询关于路由信息，通常靠组播方式发送，有时也用单播重传;可靠地发送

### 应答

响应查询分组，单播;可靠方式发送

### 确认（ACK）

以单播发送的HELLO包(不包含数据)，包含确认号。用来确认更新、查询和应答。ACK本身不需确认。

## EIGRP的Metric
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/EIGRP%20(1).png)

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/EIGRP%20(3).png)

+ 默认K1 = 1，K2 = 0，K3 = 1，K4 = 0，K5 = 0
+ 延迟取值沿路所有数据出接口（或路由入口）延迟的累加
    - DLY=延迟（US）/10 x 256
+ 带宽取值沿路所有数据出接口（或路由入口）带宽的最低值
    - BW=[10000000 / 带宽（Kbps）] x 256
+ EIGRP路由metric默认为 延迟+带宽

## DUAL算法
+ Diffusing Update Algorithm 用于计算最佳无环路径和备用路径

### 特点
+ 无环拓扑
+ 可立即使用的无环备用路径
+ 快速收敛
+ 低带宽利用率（通过限定更新实现）

### 几个术语
+ 后继路由器
+ 可行距离（FD）
+ 可行后继路由器（FS）
+ 通告距离（AD）
+ 可行距离，或称可行性条件（FC）

### 后继与可行可行距离
+ 后继路由器（Successors）：被实际选中作为到达一个目的地所使用的下一跳的路由器。该条路由保存在路由表中
+ 可行距离（Feasible distance）：计算出通向目的网络的最小度量

### 可行后继路由器及通告距离
+ 可行后继（Feasible Successor）是一条备份路由，只保存在拓扑表中。要成为可行后继，下一跳路由器前往某个特定网络的AD必须比当前后继的FD小
+ 通告距离（Advertise Distance）即为EIGRP邻居通向相同目的网络的他自己的可行距离

`符合了可行性条件（Feasible Condition）是指当邻居通向一个网络的通告距离（AD）比本地路由器通向同一个目的网络的可行距离短时。`

## EIGRP其他特性
### 不等价负载均衡
+ 最多支持等价的路径的条数不同的IOS版本不同进行负载（默认是4条）
+ 可以通过maximum-paths修改



## 基础配置
```plain
Router(config)# router eigrp autonomous-system
Router(config-router)# network network-number [wildcard-mask]
```