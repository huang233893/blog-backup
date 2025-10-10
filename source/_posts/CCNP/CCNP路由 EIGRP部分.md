---
title: EIGRP详解
summary: >-
  酥米小机器人来啦，这篇文章详细介绍了 EIGRP（Enhanced Interior Gateway Routing
  Protocol）协议的核心特点、关键技术及其工作原理。EIGRP 是思科私有的增强型内部网关路由协议，采用 DUAL
  有限状态机实现快速路由收敛，并支持触发式更新和部分路由更新，通过多播地址 224.0.0.10
  与邻居路由器交互。该协议能高效计算路由成本（基于延迟与带宽默认度量），支持 VLSM 和链路带宽负载均衡，并允许被动接口配置。EIGRP
  由邻居表、拓扑表和路由表三表支撑数据传输，依靠 Hello 包、Update 包、ACK 和 Active/Passive
  状态协商维护网络拓扑结构，安全性与兼容性涉及协议无关模块支持多协议处理。用户的配置与验证涉及 `no auto-summary`
  关闭自动汇总，及通过接口应用手工汇总的指令，以及 `maximum-paths`、`variance`
  命令设置等价与非等价负载均衡，从而提高网络资源利用效率。
categories:
  - 思科
tags:
  - 网络
  - CCNP
cover: >-
  https://cdn.nlark.com/yuque/0/2024/png/44908083/1730161963616-a3e42c29-d0d2-4365-b3d0-f1e5f30550fc.png
date: 2024-11-21 09:01:46
---

<meta name="referrer" content="no-referrer" />

## 特点
+ 思科私有的增强型的矢量路由协议
+ 快速汇聚：采用DUAL来实现快速汇聚
+ 触发更新
+ 部分更新：EIGRP发送部分更新，把更新的部分传递给需要的路由器
+ 使用多播和单播：使用多播和单播而不是广播，多播地址224.0.0.10
+ 支持VLSM：支持无类
+ 精密的度量值：能实现不等价的负载均衡

## 关键技术
+ 邻居发现协议
    - 使用Hello包发现邻居，并动态的获悉其直连的网络中的其他路由器
+ 可靠传输协议（RTP）
    - 确保EIGRP分组按顺序以可靠的方式传输给所有邻居
+ DUAL有限状态机
    - 选择最低的度量值和无环的路径到达目的网段
+ 协议无关模块
    - EIGRP支持IP、IPv6、Appletalk和IPX，其都有独立EIGRP模块，负责处理网络层协议而异的需求。

## EIGRP的三张表
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730161963616-a3e42c29-d0d2-4365-b3d0-f1e5f30550fc.png)

+ 邻居表
+ 拓扑表
+ 路由表

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730162218489-49492311-099f-4492-ab81-1f7292fec172.png)

## EIGRP数据包
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730162469491-ef6f6e0d-c93a-43a2-911c-db3f1413fa94.png)

## Metric的计算
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730163258199-be43445b-6cd6-40ed-b80c-e8d37f27b360.png)![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730163274887-11941729-c27e-4e74-98e2-ef579f23049b.png)

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730163485100-1b7af06d-b867-41af-a48c-05d2e96f2577.png)

默认K1=1,K2=0,K3=1,K4=0,K5=0

延迟取值沿路所有数据出接口(或路由入口)延迟的累加

DLY= 延迟 (us) / 10 x 256

带宽取值沿路所有数据出接口(或路由入口)带宽的最低值

BW= [ 10000000 / 带宽 (Kbps) ] x 256

**EIGRP路由metric默认为延迟+带宽**

****

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730163876261-21d8ff7a-5ece-432c-bf72-da5da25f67d7.png)

A路由器上，看到的3.3.3.0/24的路由metric(路径1)?

BW=10^7/1544*256=6476(去掉小数)*256=1657856

DLY=20000/10*256+5000/10*256=640000

Metric=640000+1657856=2297856

## 初始路由发现
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730164083165-6ad1f436-b29c-4e42-8178-0df9cd83b893.png)

机翻过程

+ Hello包 1.我是路由器A，链接上是谁?
+ Hello包 2.你好，我是路由器B。
+ Update包 3.下面是我完整的路由信息。
+ ACK包 4.感谢提供的信息!
+ Update包 5.下面是我完整的路线信息。
+ ACK包 6.感谢提供的信息! （凝聚）

## DUAL算法
+ Diffusing Update Algorithm 用于计算最佳无环路径和备用路径

### 实例1
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730165228311-05385374-7357-431e-968e-97b968881d03.png)![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730165266167-e22f9b6a-06d3-4daa-b10a-16b88ae48a9f.png)

+ 将1.0的metric设置为不可达(-1表示不可达)
+ 由于没有FS1.0被标记为Active状态
+ D向C及E发送查询信息，询问去往1.0的替代路径
+ D将C及E标记为未应答查询(q)
+ 路由器C及E将经由D路由器前往网络1.0的路径标记为不可达
+ 路由器C发送应答消息给D，指出到达1.0网段的路径没变
+ D收到C的应答，将C的查询未应答标记删除
+ 保持前往1.0路由的active状态，同时等待E的应答
+ E由于从C前往1.0网段的AD值=3，不小于原来的FD=3，所以E将路由标记为active，且向C查询，并将C标记为查询未应答
+ D收到E的应答消息
+ 删除E的查询未应答标记
+ 计算新的FD将后继路由加入到拓扑表
+ 将1.0路由切换到passive

## 几个术语
后继路由器

可行距离(FD)

可行后继路由器(FS)

通告距离(AD)

可行条件，或称可行性条件(FC)

## 配置和验证
### Passive-interface配置
`Router(config-router)#passive-interface {type number} | default`

+ 该命令用于将特定接口设置为被动状态，defaut将所有路由器接白设置为被动状态

被动接口作用如下

+ 禁止通过被动接口建立邻接关系
+ 禁止通过被动接口接收或发送路由更新让EIGRP进程通告被动接口连接的子网查看:

`show ip protocols`

`show ip eigrp neighbor`

## EIGRP路由汇总
### EIGRP自动汇总
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730170203332-86774a59-6816-4126-a00b-79a436b93c7e.png)

**关闭自动汇总**

`Router(config-router)# no auto-summary`

**配置手工汇总**

`Router(config-if)# ip summary-address eigrp as-number address mask [admin-distance]`

+ 手工配置汇总时，仅当路由选择表中至少有一条该汇总路由的明细路由时，汇总路由才被通告出去。
+ ip summary-address eigrp进行汇总的路由AD=5

## 负载均衡
+ 等价负载均衡
+ EIGRP在度量值相同的所有路径之间分配数据流量，默认为4条等价路径之间均衡IP负载，最大可为16条
+ `Router(config-router)# Maximum-paths maximum-path`

### 非等价均衡
**EIGRP也能在度量值不同的多条路径之间负载均衡**

`Router(config-router)# Variance multiplier`

+ multplier默认值为1，范围1~128
+ 只有可行路径才被用于负载均衡，可行条件为：
    - 路由必须是无环的。（即AD<FD min）
    - FD<= FD min X multiplier
+ 注：variance不指定最大路径，而指定了度量值的范围

### 例：
`Router(config-router)# Variance 2`

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730188848991-445331a1-6714-448c-8a92-04f2e7af5376.png)![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730188866082-9c793dc2-be71-4394-9377-2c39b7231688.png)

## EIGRP认证
### 路由器使用两种身份验证方式
+ 简单密码身份验证
    - IS-IS
    - OSPF
    - RIPv2
+ MD5身份验证
    - OSPF
    - BGP
    - EIGRP
    - RIPv2

### EIGRP MD5身份验证配置
+ 定义key chain（全局模式）
    - `Key chain name-of-chain`
    - `key key-id `
    - `key-string text`
    - `accept-lifetime start-time (infinite end-time duration seconds}`
    - `send-lifetime start-time {infinite | end-time | duration seconds}`
+ 关联key chain（接口模式）
    - `ip authentication key-chain eigrp autonomous-system name-of-chain`
+ 启用认证（接口模式）
    - `ip authentication mode eigrp autonomous-system md5`

#### 实例：
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730189387252-e032d95a-10b6-4916-a220-919f6941dd64.png)

`show ip eigrp neighbors`

`show ip route`

`show ip eigrp interface detail`

## 大型网络EIGRP的可扩展性
大型EIGRP网络通常存在以下一些问题

+ 需要处理的路由表很大
+ 大量的邻居，要维护庞大的拓扑表
+ 需要交换大量的路由更新，发送大量的查询和应答

这使得影响网络的可扩展性的变量变多，如：

+ 邻居间交换的信息量
+ 路由器数量
+ 拓扑深度
+ 网络中的替代路径数

## 陷入主动状态
+ 路由器陷入主动状态并因此发起查询，仅当收到每个查询的应答后，该路由器才会脱离主动状态进入被动状态
+ 如果路由器在3分钟肉没有收到查询应答，路由将陷入主动状态(SIA)此时路由器将重置与未应答的邻居之间的邻接关系。

导致路由进入SIA的常见原因

+ 路由器太忙无法回答查询
+ 路由器之间的链路质量低劣
+ 单向链路

## 防范SIA
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730249689117-deda2787-45c7-4c17-93c9-5d4919815bb5.png)

+ EIGRP分组新增加了SIA-查询和SIA-应答，是由主动过程改进的

**改进前**:主动定时器到期后，A重置与B的邻接关系，但问题出在B和C之间的链路上

**改进后**:主动定时器过半后，A发送SIA-查询，而B确认查询，从而保持邻接关系

## 限制查询范围
+ 确定好路由需求后，可提高EIGRP的可扩展性，使用以下两种方式
    - 在合适的路由器上使用路由汇总
    - 将远程路由器设置有末节EIGRP路由器
+ 将远程路由器设置有末节EIGRP路由器
+ 中央-分支网络拓扑中，stub路由器将所有非本地数据流转发给hub路由器，而无需保存完整的路由表。
+ 对于hub路由器来说，不应将stub路由器最为中转路由器，禁止stub路由器将hub路由器通告给其他的hub。
+ stub路由器不会收到查询，与stub区域相连的hub路由器将代表末节i由器对查询做出应答。
+ 未节路由器时指:该路由器与网络核心相连，且不会被用来中转数据未节路由器的EIGRP邻居全部都是中央路由器:

### 使用路由汇总
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730250750824-bcc81bb9-9bfe-45ec-a6ff-82e841cd2b18.png)

+ 查询在收到汇总路由的路由器结束
+ 仅当路由表中有被查询的网络完全匹配的路由时，远程路由器才会进一步传播查询



## 基础配置
```plain
Router(config)# router eigrp autonomous-system	
#EIGRP将autonomous-system参数称为“自治系统”编号。
Router(config-router)# network network-number [wildcard-mask]
```

```plain
Router(config)# lp default-network network-number
#将路由表中某个网络宣告为缺省网络
Router(config-router)# network network-number
#将指定的网络号通告给其他的路由器
```