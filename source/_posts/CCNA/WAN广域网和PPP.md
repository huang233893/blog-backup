---
title: WAN广域网和PPP
summary: >-
  酥米小机器人来啦，这篇文章详细介绍了WAN广域网（Wide Area
  Network）的基础知识包括其定义为跨越地理范围连接不同LAN的数据通信链路特性如需向运营商购买接入方式涉及OSI物理层和数据链路层操作常见接入方式有专线如DDN和E1电路交换如ISDN分组交换如Frame
  Relay以及物理层接口特性核心聚焦PPP协议它作为广泛应用的点对点封装协议支持链路建立IP地址分配多种网络层协议身份验证通过LCP链路控制协议和NCP网络控制协议协商管理并提供PAP和CHAP两种认证方法文章全面概述了WAN联网基础与点对点通信机制帮助读者理解广域网技术应用在180字
categories:
  - 思科
tags:
  - 网络
  - CCNA
cover: >-
  https://cdn.nlark.com/yuque/0/2024/png/44908083/1728352642968-6c903617-d770-4e08-a656-48689e47b8ba.png
date: 2024-10-17 15:01:46
---

<meta name="referrer" content="no-referrer" />

## WAN广域网简介
### 为什么需要WAN？
+ 分区或分支结构的员工需要与总部通信并共享数据
+ 组织经常需要与其他组织远距离共享信息
+ 经常出差的员工需要访问公司网络信息

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728352642968-6c903617-d770-4e08-a656-48689e47b8ba.png)

### 什么是广域网网络
+ 用于连接LAN的，跨地理位置的数据通信链路，例如同属一个公司的不同分支机构（处于不同的地理位置）之间的互联链路。
+ WAN链路一般需要向运营商购买
+ WAN链路的地理跨越范围比LAN更广
+ 链路类型多样，用户可以根据自己的需要选择

### WAN在OSI
+ WAN操作主要集中在第一层和第二层上
    - 物理层（OSI第一层）协议描述链接通信服务提供商提供的服务所需的电器，机械，操作和功能特性
    - 数据链路层（OSI第二层）协议定义如何封装传向远程位置的数据以及最终数据帧的传输机制

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728353337164-42582bff-217e-454d-8dbc-fe1f3bc85c06.png)

## WAN广域网接入方式
### 专线
+ 如DDN、POS、E1、以太网专线等
+ 点对点的专有连接（安全、高传输质量）
+ 支持多种物理介质与物理接口标准
+ 稳定可靠，配置与维护见到
+ 适合长时间的业务流量需求；流量相对较高
+ ![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728353876877-28916c58-781f-47d9-ba12-635cb027e336.png)

### 电路交换
+ 定义：由SP为企业原创网络节点间通讯提供的临时数据传输通道，其操作特性类似电话拨号技术
+ 最常见的如ISDN，ADSL
+ 逻辑连接持久有效，按需拨号
+ 传输介质主要为电话线，也可以为光纤
+ 带宽主要为56Kbps，64Kbps，128Kbps，2mbps
+ 稳定性较差，配置和维护较复杂
+ PSTN模拟拨号（异步）
    - 利用传统承载语音模拟信号的电话线来承载数字信号业务的拨号技术
    - 数/模信号转换
    - 带宽小，信号质量取决于电话介质信号质量

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728354678348-2904e2c4-ddf7-4932-8d38-37832016b8e1.png)



### 分组交换（包交换）
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728354731782-d6d2ee9b-6c6d-4a97-8643-f73a2264092a.png)

+ 分组交换设备根据数据帧的二层地址来进行路径的选择
+ **PVC永久虚电路**	在交换开始时就已经建立了路由
+ **SVC交换虚电路**	根据需要建立
+ 常用业务如x.25、FrameRelay

### VPN
暂时搁置

### 无线
暂时搁置

### WAN物理层
+ WAN物理层协议描述连接WAN服务所需的电气、机械、操作和功能特性。
+ WAN物理层还描述DTE和DCE之间的接口

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728354974355-5ce0a711-97a2-4f7d-a876-9e26997bfcfe.png)

## 常见的封装协议
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728355030117-4df0f986-8894-4697-9f68-e6b08ddde778.png)

+ 专用线路	PPP、HDLC
+ 电路交换	Telephone company
+ 分组交换	FrameRelay

### HDLC
+ 专用线路在数据链层一般采用HDLC或PPP封装
+ 专用线路是一条永久的点对点线路
+ HDLC（High-Level Data Link Control）高级数据链路控制协议是一种在同步链路上传输数据的二层协议
+ HDLC由SDLC协议发展而来
+ 每个厂家的HDLC可能有所不同，因此不同厂家之间的HDLC未必能够兼容

#### 普通HDLC
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728369039384-68b71f94-66c2-4fe0-9cfc-ece2a5e2c406.png)

+ 传统ISO HDLC只支持单协议环境

#### 思科HDLC
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728369091407-173357fe-3f75-43a2-8634-b3a83b477383.png)

+ 思科HDLC支持多协议
+ 增加了Proprietary私有字节用于识别

## PPP简介
PPP协议是目前使用最广泛的广域网点对点链路封装协议之一，它具有以下特性

+ 能够控制数据链路的建立
+ 能够对IP地址进行分配和使用
+ 支持多种网络层协议
+ 能够配置和测试数据链路
+ 能够进行错误检测
+ 提供身份验证
+ 有协商选项，能够对网络层的地址和数据压缩等进行协商、

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728369245419-e64a57e6-5864-4b17-9f6f-203c0a850654.png)

+ PPP使用基于数据链路层的点对点传输，即PPP封装
+ PPP上层支持三层协议，分别为TCP/IP、IPX、AppleTalk

## PPP的层次结构
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728369696975-78542e05-1ace-451b-894c-8ad9e6e115ce.png)

+ PPP工作在数据链路层
+ PPP主要由NCP和LCP两个协议配合组合而来

### PPP的组件
+ 链路控制协议LCP（Link Control Protocol)
    - LCP负责创建，维护或终止一条数据链路
+ 网络控制协议NCP（Network Control Protocol)
    - NCP是一个协议族，负责解决物理连接上运行什么网络协议，以及解决上层网络协议发生的问题。
+ 认证协议
    - 最常用的包括口令验证协议PAP（PasswordAuthenticationProtocol）和挑战握手验证协议CHAP（Challenge-HandshakeAuthentication Protocol）

## PPP会话的建立
+ 链路的建立和配置协商
    - 通信的发起方发送LCP frame来配置和检测数据链路
+ 链路质量检测，认证阶段(可选)
    - 判断链路的质量是否能携带网络层信息。 如果使用身份验证的话，那么验证过程发
    - 生在这步
+ 网络层协议的配置协商
    - 通信的发起方发送NCP frame用以选择和配置网络层协议。配置完毕，通信双方可以发送各自的网络展协议数据分组

## PAP认证（单向）
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728371375625-0300c2f8-8136-45e5-8923-6bd1f53e11da.png)

+ 2次握手
+ 密码以明文的形式直接发送

## CHAP认证（单向）
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728371472275-484410a9-4d45-4013-ba20-6350f19a1f34.png)



## 基础配置
```plain
Router(config)# int s0/0	#进入接口
Router(config)# hostname name	#（可选）指定路由器名字
Router(config)# username name password password	#（可选）标示远端路由的用户名和密码，配置在认证服务端
Router(config-if)# encapsulation ppp	#修改接口类型为PPP协议
Router(config-if)# ppp authentication {chap|chap pap|pap chap|pap}	#（可选）启用PAP或者CHAP认证，配置在认证服务端
```