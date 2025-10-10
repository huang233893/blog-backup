---
title: 路由和路径
categories:
  - 思科
tags:
  - 网络
  - CCNP
cover: >-
  https://cdn.nlark.com/yuque/0/2024/png/44908083/1730252795715-71f9fcc0-544c-41e7-94a1-cdde5265b108.png
summary: >-
  酥米小机器人来啦，这篇文章主要讲解网络路由协议与路由策略的配置方法包括多厂商环境中使用多种IP路由协议的原因如网络合并过渡新协议及路由策略需求路由重分发需考虑路由回馈信息不兼容收敛时间差异并注意管理距离和度量值选择最佳路由passive-interface配置差异如RIP仅接收更新EIGRP禁止Hello消息和邻接关系OSPF则禁止路由信息交换同时支持单播更新和过滤HELLO包route-map通过match命令匹配路由属性并用set修改路由属性支持逻辑or和and运算distribute-list和prefix-list用于过滤路由更新前缀列表更灵活支持增量修改PBR策略路由根据策略分流数据如设定下一跳IP和出接口实现ISP故障切换等场景应用
date: 2024-11-21 09:01:46
---

<meta name="referrer" content="no-referrer" />

# 路由部分
## 网络中使用多种IP路由协议
需要使用多种IP路由协议的原因-多厂商的路由环境

+ 网络合并(同一协议或是不同协议)
+ 从旧的路由协议过渡到新的路由协议
+ 路由策略的需要(可靠性、冗余性、分流模型等)

路由重分发(多个重分发点，双向重分发)

## 路由重发布
### 概念
路由重分发是指连接到不同路由域(自治系统)的边界路由器在他们之间交换和通告路由选择信息的能力。

+ 从一种协议到另一种协议
+ 同一种协议的多个实例

注意

+ 重分发总是向外的，执行重分发的路由器不会修改其路由表
+ 路由必须要位于路由表中才能被重分发

### 路由重发布
+ 重发布要考虑的因素
    - 路由回馈
    - 路由信息不兼容（度量值信息不一致）
    - 收敛时间不一致（不同路由协议的收敛速度不同）
+ 如果选择最佳路由
    - 管理距离
    - 度量值

### 路由回馈
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730252795715-71f9fcc0-544c-41e7-94a1-cdde5265b108.png)

-

+ 度量值--种子度量值
+ 路由器通告与其接口直接相连的链路时，使用的初始度量值叫做种子度量值(也叫做默认度量值)，是根据接口的特征得到的。
+ 种子度量值或默认度量值是在重分发配置期间定义的，并在自治系统内部正常递增，除了OSPF E2路由。
+ 可使用命令default-metric或是redistribute中使用metric来指定种子度量值

### 度量值——默认种子度量值
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730253536563-710553ac-ca47-4ce5-9027-a64118280c8e.png)

### 单点重分发
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730256948062-64555df9-3f06-41ec-b0c2-9c14cd5cc025.png)

单向重分发

双向重分发

### 多点单向重发布
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730257151571-18b8b2e8-3c79-40ea-b97c-d622e5dc20b8.png)

### 多点双向重发布
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730257180586-f3f245e3-f240-4044-b59e-b2154fde1431.png)

# Passive-interface
+ RIP/IGRP——在指定接口不向外发送路由更新，但是接收路由更新
+ EIGRP——在指定接口不向外发送Hello消息，而且通过这个接口不与其他路由器建立邻接关系，不发送其它EIGRP的数据流
+ OSPF——在指定接口不向外发送Hello消息，而且通过这 个接口不与其他路由器建立邻接关系，不发送和接收路由信息。(有些IOS版本中OSPF在被动接口上发送Helo和DBD分组，但是不发送LSU。)

## Tips
+ 汇聚交换机上所有的三层接口都Network进相应的Area
+ 汇聚交换机将向所有VLAN接口发送HELLO报文，尝试建立邻居关系，而底层的用户也会收到其并不需要的HELLO包

## Passive-interface与单播更新
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730339033871-1958274b-9355-4326-a286-f9c3e31efd0e.png)

配置RIP单播更新

```plain
Router(config)# router rip
Router(config-router)# passive-interface int-type int-num
Router(config-router)# neighbor 192.168.123.3
```

## 常见路由协议管理距离
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730339568655-3eb7af04-e1a6-498c-85a3-f72f55fcd42a.png)

# Route-map
## 特点
+ 使用的match命令匹配特定的分组或路由，set修改该分组或路由的相关属性
+ Route-map中的语句相当于访问列表中的各行
+ Route-map默认为permit，默认序列号为10，序列号不会自动递增，需要指定序列号
+ 末尾隐含deny any
+ 单挑match语句包括多个条件时，使用逻辑or运算；多条match语句时，使用逻辑and运算



## 配置
```plain
match ip address 匹配访问列表或前缀列表
match length 根据分组的第三层长度进行匹配
match interface 匹配下一跳出接口为指定接口之一的路由
match ip next-hop 匹配下一跳地址为特定访问列表中被允许的那些路由
match metric 匹配具有指定度量值的路由
match route-type 匹配指定类型的路由
match community 匹配BGP共同体
match tag 根据路由的标记进行匹配
```

# distribute-list
## distribute-list 可根据下列因素过滤更新
+ 入站接口
+ 出站接口
+ 从另一种路由协议重分发

## 对于距离矢量路由协议
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730765382208-5939d7f3-0224-48a4-8bd2-4b38e06c0c22.png)

## 对于链路状态路由协议
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730765432018-af56c92b-2a62-4a66-8430-79f752fc4a02.png)

## 配置
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730768260182-2e14961d-ad68-4651-ae82-e9eebcc05966.png)

```plain
R2(config)# access-list 1 permit 192.168.1.0
R2(config)# access-list 1 permit 192.168.2.0
R2(config)# router rip
R2(config-router)# distribute-list 1 out fa 1/0
```

# prefix-list
## 背景
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730768421821-4f542729-31cd-484e-bd5c-0c7a22b12463.png)

+ 外部路由172.16.32.0-39.0/24，以及汇总路由32.0/21被R1引入OSPF现在需在注入过程中，仅将汇总路由32.0/21过滤，所有明细放行，使用ACL匹配路由，该如何写?

`R1(config)# access-list 1 deny 172.16.32.0	#如果加上反掩码呢`

`R1(config)# access-ist 1 permit any`

## 前缀列表
+ 前缀列表的可控性比访问列表高得多，支持增量修改，更为灵活
+ 判断路由前缀与前缀列表中的前缀是否匹配
+ 前缀列表包含序列号，从最小的开始匹配，默认序列为5，以5增加
+ 如果前缀不与前缀列表中的任何条目匹配，将被拒绝

## 配置
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730771586431-d5907351-8a3b-4875-bb63-9a586ef96637.png)

`router(config)# **ip prefix-list** {list-name [**seq** number] {**deny | permit**} _network/length_ [**ge** _ge-value_] [**le** _le-value_]`

输入条件：length < ge-value < le-value <= 32

### 配置示例
+ 匹配某条特定路由：192.168.1.0/24
    - `ip prefix-list pxlist 192.168.1.0/24`
+ 匹配默认路由：
    - `ip prefix-list pxlist permit 0.0.0.0/0`
+ 匹配所有主机路由：
    - `ip prefix-list pxlist permit 0.0.0.0/0 ge 32`

# 路径控制
网络实现冗余，还需要考虑以下问题

+ 弹性：实现链路的主动切换同时备用链路可用于负载均衡
+ 可用性：从主链路切换到备用链路的时间
+ 自适应：主链路拥塞时也可以使用冗余路径
+ 性能：提高带宽的使用率

## 路径控制工具
+ 妥善的编制方案：VLSM和CIDR
+ 重分发和路由协议的特征
+ passive-interface
+ distribute-list
+ prefix-list
+ AD的把控
+ route-map
+ 路由标记
+ offset-list
+ 路由标记
+ 思科IOS IP SLAs
+ PBR

## offset-list的作用
+ 用于在入站或出站时增大通过EIGRP或RIP获悉的路由度量值

`router(config-router)# offset-list {access-list-number| name} {in|out} offset [interface-type interface-number]`

## offset-list的配置
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730773350466-5d587359-93a3-41f8-ae95-2a94868aecb4.png)

```plain
access-list 1 permit 10.1.1.0
router rip
offset-list 1 out 2 serial 0/0
```

# PBR策略路由
## PBR
+ 基于策略的路由比传统路由能力更强，使用更灵活，它使网络管理者不仅能够根据目的地址而且能够根据协议类型、报文大小、应用或IP源地址来选择转发路径。策略可以定义为通过多路由器的负载平衡或根据总流量在各线上进行报文转发的服务质量来定义策略路由。
+ 策略路由主要对经过路由器的数据流进行分流和过滤以及感兴趣数据流匹配

## 传统路由VS策略路由
### 传统路由
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730775469785-37c97bda-3880-410d-bb4d-3def31028fb9.png)

### 策略路由
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730775507016-b35087ed-da05-4558-aed6-aafa6e38c85e.png)

## PBR对数据的处理
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730775547268-b569e647-03d1-41eb-b6f6-444d7cd1ac02.png)

## 配置
+ 设定分组的下一跳IP（必须为直连IP）
    - `set ip next-hop ip-address [...ip-address]`
+ 设定分组的出接口
    - `set interface type number [...type number]`

### 场景1
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730788273052-453973f9-cb0f-4d85-a1a5-2ed89d2b898b.png)

+ 当网络正常时，PC访问外网数据走ISP1
+ 当ISP1宕机时(GW感知到)，数据切换至ISP2
+ 当ISP1容机时(GW无感知)，数据仍然走ISP1

```plain
access-list 1 permit any
route-map PBR permit 10
match ip address 1
set ip next-hop 10.1.1.2 10.2.2.2
```