---
title: DHCP协议详解和配置
summary: >-
  酥米小机器人来啦，这篇文章介绍了DHCP协议，是动态主机配置协议基于UDP端口67和68用于自动分配IP地址的核心内容，涵盖了实施背景、传输方式、DHCP中继问题如客户端与服务器不在同一网段时的广播转发障碍及Cisco设备上的中继配置命令，还涉及Relay
  Agent Option支持如Option82的插入用于远程ID和电路ID管理，以及基于策略分配IP地址的流程，并详细说明了手动绑定配置使用ip dhcp
  pool命令直接映射MAC地址到IP地址，所有内容均围绕DHCP在网络环境中的关键作用和实际配置示例展开，重点关注中继机制的处理策略以确保设备间通信无阻和地址分配效率。
categories:
  - 思科
tags:
  - 网络
  - CCNP
cover: >-
  https://cdn.nlark.com/yuque/0/2024/png/44908083/1729165474365-eb0dcff1-1d39-4423-8a7f-d50f6cccc494.png
date: 2024-11-21 09:01:46
---

<meta name="referrer" content="no-referrer" />

## DHCP实施背景
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729165474365-eb0dcff1-1d39-4423-8a7f-d50f6cccc494.png)

## 简介
+ Dynamic Host Configuration Protocol
+ 基于UDP协议 端口67及68
+ bootPC:67（客户端端口号）；bootPS：68（服务端端口号）

## 传输方式
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729166164894-3746dc53-16a4-4763-89f7-d07c779b2eae.png)

## DHCP中继问题
### 案例一
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729498106851-c554df3c-3861-47ee-b981-06b274a46d00.png)

+ PC客户端与DHCP server不在同一个网段PC发出的广播DHCP discover包到达三层设备被三层接口丢弃，因此数据无法到达DHCP服务器

### 案例二
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729498165849-924f9898-3555-4794-99e5-54ee26ea93f9.png)

+ 在三层交换机(或路由器)上部署DHCP中继，使得DHCPserver能够收到Discover消息

### 案例三
![](https://cdn.nlark.com/yuque/0/2024/jpeg/44908083/1729498256138-90c814b3-f678-4c44-8db8-3b81f95deabb.jpeg)

`cisco(config-if)# ip helper-address _address_`

+ 激活中继功能，并为UDP广播包设置中继目标IP(单播包的目标IP地址)
+ 注意是在接口上配置，该接口为沿途阻挡该广播消息的第一个接口

`cisco(config)# ip forward-protocol { udp [ port ]}`

+ 选择被中继的协议(可选)

### 注意事项1
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729498637688-ede34ac4-38ae-472e-98e0-44d3c9108741.png)

`cisco(config)# interface vlan 10`

`cisco(config-if)# ip helper-address 192 168.200.200`

### 注意事项2
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729498803330-8cc66a37-1efb-4664-8343-02bccde28ebf.png)

```plain
interface fast0/0
ip helper-address 10.1.1.200
ip helper-address 10.1.2.200
ip helper-address 10.1.2.201
!!每个地址都会发送一个单播
```

## Relay Agent Option Support
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729498968783-22fd05b0-fe27-4135-ae7d-8748bb83d552.png)

+ 发送广播
+ Option82插入remoteID及circuitID
+ 如果识别option82，则查看插入的option值
+ 除去option字段，实施策略，将IP分配给client
+ 基于option值，返回IP address及策略

## DHCP配置
### 手工配置
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729499528933-45786e82-4126-41d6-9cf8-54dc67e32103.png)

+ 手动绑定是手动映射到DHCP数据库中的主机的MAC地址的IP地址。手动绑定存储在DHCP服务器上的NVRAM中
+ 绑定只是特殊的地址池。手动绑定数量没有限制，但每个主机池只能配置一个手动绑定的配置池

`ip dhcp pool BIND`

`host 192.168.1.111 255.255.255.0`

`client-identifier unique-identifier`

+ DHCP clients require client identifiers. The unique identification ofthe client is specified in dotted hexadecimal notation, for example.01b7.0813.8811.66,where 01 represents the Ethernet media type.（DHCP客户端需要客户端标识符。客户端的唯一标识符用点十六进制表示法指定，例如01b7.0813.8811.66，其中01表示以太网介质类型。）
+ 也可以在服务器上通过show ip dhcp bingding抓取客户端的client-identifier