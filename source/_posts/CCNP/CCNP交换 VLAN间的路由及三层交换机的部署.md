---
title: VLAN间的路由及三层交换机的部署
categories:
  - 思科
tags:
  - 网络
  - CCNP
cover: >-
  https://cdn.nlark.com/yuque/0/2024/png/44908083/1729153334630-a8c6d042-08e1-4b43-87f8-aa6252bf8900.png
summary: >-
  酥米小机器人来啦，这篇文章主要讲解了VLAN间路由及三层交换机的部署方法不同VLAN互访需求可通过单臂路由实现而如今路由技术已具备硬件转发能力并解决了交换网络的二层环路与LAN隔离问题Switch
  Virtual Interface（SVI）作为VLAN的三层逻辑接口需要满足对应VLAN存在且激活、接口未处于administratively
  down状态以及至少有一个二层接口处于forwarding状态才能正常工作SVI autostate
  exclude功能可使特定接口脱离up-down状态计算与SVI口状态无关交换机管理VLAN用于设备管理二层交换机仅能配置一个VLAN接口IP地址三层交换环境则支持多个管理VLAN端口模式区分二层access/trunk与三层路由接口SVI配置需开启三层路由功能创建VLAN并为SVI分配IP地址同时配置路由接口和静态路由实现跨VLAN通信
date: 2024-11-21 09:01:46
---

<meta name="referrer" content="no-referrer" />

## Q & A
### 如何满足不同VLAN的互访需求？
+ 解决方案1：单臂路由

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729153334630-a8c6d042-08e1-4b43-87f8-aa6252bf8900.png)

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729153355876-a7ca5fed-7f69-4e14-82d7-b5d7aa717043.png)

## 路由 VS. 交换的园区网结构
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729162997065-d2ea58a5-246a-44d6-925d-3b16b41a0532.png)

+ 在过去，交换是基于硬件的转发，而路由是基于软件的转发，因此园区网络更多的采用交换网络的设计
+ 而如今，路由已经几乎与交换一样快，也能够基于硬件做转发，与此同时路由的设计很好的解决了交换网络的二层环路问题，以及LAN的隔离问题

## Switch Virtual interface（SVI）
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729163085261-9648ecce-8584-479f-a56a-bf5679c5b3bf.png)

## SVI autostate exclude command
+ SVI口的Line-state在以下条件满足的情况下才会是UP
    - SVI对应的VLAN必须在vlan database中存在并且是激活的
    - Vlan interface存在并且不能说administratively down的
    - 必须至少有一个二层接口（SVI对于VLAN的access接口或者trunk口）是UP的，而且必须是spanning-tree的forwarding状态
+ SVI autostate exclude特性可以让特定接口跳出上述up-and-down的计算过程，也就是说该接口的up down与SVI口的up down无关了

`Switch(config)# int f0/24`

`Switch(config-if)# switchport auto-state exclude`

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729164827120-91130c8c-63de-4e8f-8628-0259875e2c44.png)

## 交换机管理VLAN
### 二层交换机的管理VLAN
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729165022772-166a0a14-8a04-4f1f-be6f-226ecbf1918a.png)

+ 交换机的管理VLAN用于交换机本身的设备管理
+ 二层交换机只能有一个VLAN接口可以拥有IP地址，具体的VLAN可以根据实际需求选定
+ 有了这个VLAN接口，PC就能够telnet到交换机上执行管理操作
+ 用户VLAN与交换管理VLAN重叠会有什么问题？

### 三层交换环境的管理VLAN
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729165215265-252a3155-b8c1-4065-9cc0-764a2291e798.png)

## 三层交换机的端口模式
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729163463953-598b285c-b189-41f6-80b0-e3a5a7637588.png)

+ 二层接口：access模式，trunk模式
+ 三层接口：路由接口（no switchport或称为routed port）、SVI接口

## 基础配置
```plain
Switch(config)# ip routing
#	开启三层交换机路由功能

Switch(config)# vlan 10
Switch(config-vlan)# name name
# 创建VLAN

Switch(config)# int vlan 10 
Switch(config-Vlanif10)# ip add x.x.x.x mask 
Switch(config-Vlanif10)# no sh
#	配置VLAN对于SVI接口

Switch(config)# int f0/1
Switch(config-if)# no switchport
Switch(config-if)# ip add x.x.x.x mask
Switch(config-if)# no sh
#	配置no switchport（routed port）三层接口

Switch(config)# ip route 0.0.0.0 0.0.0.0 x.x.x.x
#	配置静态路由
```