---
title: OSPF和LSA详解
summary: >-
  酥米小机器人来啦，这篇文章详细介绍了OSPF协议，一种链路状态路由协议用于IGP网络不产生路由环路，覆盖了网络类型如点对点广播非广播及其配置、DRBDR选举机制基于优先级和RouterID、链路开销自动计算和手动调整、多区域设计以提高网络扩展性和稳定性、帧中继环境下的OSPF模式选择以及LSA的类型概述包括RouterLSA用于链接标识NetworkLSA描述网络结构SummaryLSA实现路由汇总等功能强调了协议在维护网络拓扑同步优化路由中的核心作用并讨论了实际应用和优化策略
categories:
  - 思科
tags:
  - 网络
  - CCNP
cover: >-
  https://cdn.nlark.com/yuque/0/2024/png/44908083/1729819118059-283bca5c-1922-4be5-944a-07aaab2b1e10.png
date: 2024-11-21 09:01:46
---

# OSPF
## 基础回顾
OSPF（Open Shortest Path First，开放最短路径优先）是一种链路状态路由协议，无路由循环(全局拓扑)，属于IGP。RFC2328，“开放”意味着非私有的，对公众开放的。

+ OSPF协议使用的组播地址
    - 所有OSPF路由器224.0.0.5；DR BDR-224.0.0.6
+ OSPF的报文封装
    - OSPF协议包直接封装于IP，协议号89。
+ OSPF路由协议的管理距离:110

## 网络类型
+ **点对点**
+ **广播**
+ **非广播**
    - 非广播又包含了5种运行模式：
        * NBMA（RFC）
        * P2MP（RFC）
        * P2MP nonbroadcast（CISCO）
        * Broadcast（CISCO）
        * P2P（CISCO）

### 点对点类型
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729597653542-543c407b-5fbf-4a07-addb-ef4a220af580.png)

+ 如果二层的协议为PPP、HDLC等，则OSPF网络类型为P2P
+ 如果帧中继子接口类型为P2P的，则OSPF网络类型也为P2P
+ 不选举DR、BDR
+ 使用组播地址224.0.0.5
+ OSPF能够根据二层封装自动检测到P2P网络类型

### 广播型多路访问
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729597748803-b40f6f84-0db0-4015-b26a-7db24de3eec2.png)

+ 通常出现在以太网
+ 选举DR、BDR
+ 所有路由器均与DR及BDR建立邻接关系
+ 使用组播地址224.0.0.5及224.0.0.6

### NBMA网络选择OSPF的模式
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729597933313-047b21b5-add8-4100-bfee-794b3879c1ab.png)

+ 在帧中继主接口上，默认的OSPF模式为非广播
+ 在点到点帧中继子接口上，默认的OSPF模式为点到点
+ 在帧中继多点子接口上，默认的OSPF模式为非广播



## 链路状态协议
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729582503246-0528dc00-6265-464a-a66c-0dbf9991d7f2.png)

## 网络优化-Router-ID
+ 为了提高路由器的RID的稳定性和网络的稳定性建议手动的设置路由器的Router-ID
+ 在OSPF的进程下修改:router-id <x.x.x.x>
+ 在项目实施中，一般是建立loopback口，并且手工指定loopback口地址为router-id

## DR、BDR
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729583194925-732e5d65-058d-45b9-b919-c1a4e44723d4.png)

+ DR的作用：多路访问中为了减少邻接关系（N平方的问题）和LSA的泛洪，采用DR机制，BDR提供了备份
+ MA网络上所有的路由器均与DR、BDR建立邻居关系

## DR选举比较顺序
+ 接口优先级数字越大越优先（优先级为0不能参与DR的选举）、
+ RouterID越大越好
+ 稳定性压倒一切（非抢占）
+ 通过控制接口优先级是控制DR选举的好办法
+ DR的选举是基于接口的，如果说某个路由器是DR，这种说法是错误的

## DR及BDR选举的控制
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729597316618-061a5e61-a25e-40b1-885d-8a2d9fbd2000.png)

`ip ospf priority 10`

比较次序

+ 优先级
+ 路由器ID
+ 优先级为0的不能成为DR或者BDR

## 链路的开销
+ 自动计算:COST=参考带宽(10的8次方)/出口带宽
+ 接口带宽为接口逻辑带宽，可以使用bandwith命令调整，主要用于路由计算而不是接口物理带宽，但一般情况:接口逻辑带宽=接口物理带宽。
+ 手工修改开销的方法

`Router(config)# int serial 1`

`Router(config-if)# ip ospf cost 100	//该命令在收路由的入口`

+ 可修改参考带宽,来保障OSPF在现如今的网络中正常运转

`auto-cost reference-bandwidth <参考带宽以Mbits为单位>`

## 三张表
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729583395100-67ec4bc7-0287-42cc-8d1b-76f7f8ece3b8.png)

+ 相邻的两台路由器运行OSPF协议
+ 两台路由器直接连接
+ 在同一自治系统
+ Hello/Dead时间一致
+ 区域ID一致
+ 认证密码一致
+ MTP值一致
+ *网络类型一致
+ *链路两端接口掩码一致

## 报文类型
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729583532652-1fe547e6-7e27-4e76-bb58-191ed1d3961e.png)

+ Hello	建立和维护OSPF邻居关系
+ DBD		链路状态数据库描述信息(描述LSDB中LSA头部列表)
+ LSR		链路状态请求,向OSPF邻居请求链路状态信息
+ LSU		链路状态更新(包含一条或多条LSA)
+ LSAck	确认报文

## OSPF邻居建立过程
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729584652052-d4b95daa-8884-47ae-920e-34ad316f4a3a.png)

### 邻居发现
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729584326053-0256b458-b096-42dc-a8e0-e285f71dc6cd.png)

### 路由发现阶段
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729584355522-638bec3d-ff82-4db9-90ba-3579b3a0f3f0.png)

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729584499985-4d227371-bb64-4bbd-ba77-fdbe2784854c.png)

## OSPF路由器建立邻接关系的过程详细描述
+ OSPF路由器接口up，发送Hello包(NBMA模式时将进入Attempt状态)。
+ OSPF路由器接口收到Hello包，进入Init状态;并将该Hello包的发送者的RouterID添加到Hello包(自己将要从该接口发送出去的Hello包)的邻居列表中。
+ OSPF路由器接口收到邻居列表中含有自己RouterID的Hello包，进入Two-way状态形成OSPF邻居关系，并把该路由器的RouterID添加到自己的OSPF邻居表中
+ 在进入Two-way状态后，广播、非广播网络类型的链路，在DR选举等待时间内进行DR选举。点对点没有这个过程。
+ 在DR选举完成或跳过DR选举后，建立OSPF邻接关系，进入exstart(准启动)状态并选举DBD交换主从路由器，以及由主路由器定义DBD序列号，RouterID大的为主路由器。目的是为了解决DBD自身的可靠性。
+ 主从路由器选举完成后，进入Exchange(交换)状态，交换DBD信息。DBD交换完成后，进入Loading状态，对链路状态数据库和收到的DBD的LSA头部进行比较，发现自己数据库中没有的LSA就发送LSR，向邻居请求该LSA;邻居收到LSR后，回应LSU;收到邻居发来的LSU，存储这些LSA到自己的链路状态数据库，并发送LSAck确认。
+ LSA交换完成后，进入FULL状态，所有形成邻居的OSPF路由器都拥有相同链路状态数据库。
+ 定期发送Hello包，维护邻居关系。

## OSPF邻接关系
+ 路由器之间链路状态信息必须同步，LSA具有以下特征：
+ LSA（LSU）是可靠的传输，需要LSAck确认
+ LSA有序列号和寿命，以确保是最新的LAS
+ LSA被定期的刷新以确保拓扑信息的有效性

## 链路状态数据的状态
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729585188616-4c4dd0cf-7eae-44df-8df2-4308bf761556.png)

## OSPF多区域概念
### 单区域
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729585216495-f1b2e4b6-e173-4b2d-9bd3-ec5d0a567d94.png)

+ 收到的LSA通告太多了，OSPF路由器的负担很大
+ 内部动荡会引起全网路由器的完全SPF计算
+ 资源消耗过多，LSDB庞大，设备性能下降，影响数据转发
+ 每台路由器都需要维护的路由表越来越大，单区域内路由无法汇总

#### 解决方案
+ 把大型网络分隔为多个较小，可管理的单元-区域 area;

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729585389704-f78a98ae-479f-43ea-882e-53cc2ffca7c3.png)

+ 划分区域的好处
+ 减少了LSA洪泛的范围，有效地把拓扑变化控制在区域内，提高了网络的稳定性拓扑的变化影响可以只限制涉及本区域
+ 多区域提高了网络的扩展性，有利于组建大规模的网络
+ 在区域边界可以做路由汇总，减小了路由表

### OSPF路由器角色
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729585477757-23c7849f-09a3-4fee-b0a7-5e1fdd6742c5.png)

## 在帧中继环境下的OSPF
### NBMA网络选择OSPF模式 
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729816380101-0577bb5b-d702-4859-8ad0-e5b784de728e.png)

+ 在帧中继的主接口上，默认的OSPF模式为非广播
+ 在点到点帧中继子接口中，默认的OSPF模式为点对点
+ 在帧中继多点子接口上，默认的OSPF模式为非广播

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729818741701-a39e2439-6c8e-4b10-9bba-d886484fee5c.png)

如果是非广播这一 OSPF 网络类型,则 OSPF 也不会主动发送组播包去发现邻居，因此邻居关系建立这

里也有问题。

### NBMA网络下OSPF的运行
#### 方式一
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729818282720-8e8c7e7b-6548-41cd-b825-64c10f08f90b.png)

+ 指定OSPF网络类型为broadcast
+ 使用OSPF多播hello分组自动来自动发送邻居
+ 选举DR和BDR
+ DR和BDR必须与其他所有路由器直接相连

```plain
Router(config)# interface serial 0/0
Router(config-if)# encapsulation frame-relay
Router(config-if)# ip ospf network broadcast
```

#### 方式二
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729818405731-56d45fde-6d9d-4394-b5a6-b9a317b9c04a.png)

+ 网络类型为non-broadcast（默认）
+ 手动指定邻居
+ 选举DR和BDR
+ DR和BDR必须与其他所有路由器直接相连

```plain
Router(config)#interface serial 0/0
Router(config)#neighbor ip-address [priority number] [poll-interval number] [cost number] [database-filter all]
Router(config-if)#encapsulation frame-relay
Router(config-if)#ip ospf network non-broadcast
```

#### 方式三
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729818635272-2362be8e-2382-4c0a-94eb-f1f6c6f9ecca.png)

```plain
interface serial0/0
encapsulation frame-relay
ip ospf network point-to-multipoint
router ospf 100
network 202.101.100.0 0.0.0.255 area 0
```

```plain
interface Serial0/0
encapsulation frame-relay
ip ospf network point-to-multipoint
ip ospf priority 0
```

## 基础配置
```plain
Router(config)# router ospf process-id [vrf vpn-name]
Router(config-router)# network ip-address wildcard-mask area area-id
```

```plain
Router(config-router)# router-id ip-address
Router# clear ip ospf process
```

```plain
Router(config-if)# ip ospf network [ {broadcast | non-broadcast | point-to-multipoint [non-broadcast] | point-to-point} ]
```

# LSA
## LSA简介
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729819118059-283bca5c-1922-4be5-944a-07aaab2b1e10.png)

+ **Link State Advertisement**（链路状态通告），这是在网络协议中，尤其是 OSPF（开放最短路径优先）和 IS-IS（中间系统到中间系统）中使用的一种消息类型。



## LSA类型
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729819172881-af6ef12d-89f7-42af-9256-e129103f1207.png)

### 类型1 路由器LSA Router LSA
+ 每个路由器针对它所在的区域产生LSA1，描述区域内部与路由器直连的链路的信息(包括链路类型，Cost等)
+ LSA1只允许在本区域内洪泛，不允许跨越ABR
+ LSA中会标识路由器是否是ABR(B比特置位),ASBR(E比特置位)或者是Virtual-link(V比特置位)的端点的身份信息

### 类型2 网络LSA Network LSA
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729821435220-c6372be2-8ace-40f8-9842-95f87f104bc8.png)

### 类型1、2总结
+ 通过LSA1，LSA2在区域内洪泛,使区域内每个路由器的LSDB达到同步计算生成标识为“O”的路由，解决区域内部的通信问题

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729821481351-2632bc17-429c-4770-aa0a-fcea98417f5c.png)

### 类型3 网络汇总LSA Network Summary LSA
+ 由ABR生成，实际上就是将区域内部的Type1Type2的信息收集起来以路由子网的形式扩散出去，这就是SummayLSA中sunmay的含义(注意这里的summary与路由汇总没有关系)

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729821558294-c0336486-6143-4997-b4c4-c9602d37a3b7.png)

Type3 的链路状态ID是目的网络地址。

+ 如果一台ABR路由器在与它本身相连的区域内有多条路由可以到达目的地,那么它将只会始发单一的一条网络汇总LSA到骨干区域,而且这条网络汇总LSA是上述多条路由中代价最低的。
+ ABR收到来自同区域其它ABR传来的Type3 LSA后重新生成新的Type3 LSA（Advertising Router 改为自己）然后继续在整个OSPF系统内扩散

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729822506797-293ae502-10d7-49ed-a0ab-b1733b5c626e.png)

### 类型4 ASBR Summary LSA
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729822619398-8be5539d-1f33-4d4e-9031-46f359fc9edb.png)

+ ASBR Summary LSA由ABR生成，用于描述ABR能够到达的ASBR它的链路状态ID为目的ASBR的RID。

### 类型5 自治系统外LSA AS external LSA
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729823363172-eff49501-c34f-42fe-a0c6-64d4b5b2b16e.png)

+ Autonomous System External LSA由ASBR生成用于描述OSPF自治域系统外的目标网段信息链路状态ID是目的地址的IP网络号
+ 外部路由通过重发布，引入OSPF路由域，相应信息(路由条目)由ASBR以LSA5的形式生成然后进入OSPF路由域
+ 缺省情况下，LSA5生成路由用OE2表示，可强行指定为OE1
    - OE2 开销=外部开销
    - OE1 开销=外部开销+内部开销
+ LSA5不允许进入特殊区域——stub存根区& NSSA区

#### OE1、OE2的区别
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729823569011-bb805760-c712-4ac8-8c02-a7cb40961599.png)

### 类型7 NSSA中的外部LSA NSSA External LSA
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729823624411-2bc6ff8e-a565-4ddc-b641-e6f34501a7b2.png)

+ 在NSSA(非完全存根区域)not-so-stubby area中ASBR针对外部网络产生类似于LSA5的LSA类型7
+ LSA类型7只能在NSSA区域中洪泛，到达NSSA区域ABR后，NSSAABR将其转换成LSA类型5外部路由，传播到Area0，从而传播到整个OSPF路由域
+ 生成路由缺省用ON2表示，也可指定为ON1

# 其他
## OSPF LSDB和路由表
+ 查看路由表 `show ip route ospf`

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729823720364-54258c69-3cd1-4901-b51f-4a5a1878d36e.png)

+ O  > O IA > O E1 > O E2

## 特殊区域的配置nssa
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730100982306-4a28f112-d02a-4537-be77-83245f365f85.png)

+ R1的配置

```plain
router ospf 1
network 192.168.12.0 0.0.0.255 area 1
area 1 nssa
```

+ R2的配置

```plain
router ospf 1
network 192.168.12.0 0.0.0.255 area 1
network 192.168.23.0 0.0.0.255 area 0
area 1 nssa 
area 1 nssa default-information-orginate #设置默认区域
```

## 特殊区域的配置 特殊区域在工程中的运用
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730101580835-773919f9-0729-4bd0-87b3-657e709babd1.png)

+ 区域划分（含特殊区域）
+ 路由汇总
+ 默认路由传递
+ Passive-interface

## OSPF高级功能配置及验证
+ Passive-interface
    - ![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730103668216-946f3d0c-b38a-44c0-b683-614f039a47ee.png)

```plain
router ospf 1
network 192.168.1.0 0.0.0.255 area 0
network 192.168.12.0 0.0.0.255 area 0
passive-interface fa 0/0
```

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730104286308-472055dd-f8c1-43d5-882d-bbf2abc09ea6.png)

```plain
router ospf 1 
network 192.168.1.0 0.0.0.255 area 0
network 192.168.2.0 0.0.0.255 area 0
network 192.168.3.0 0.0.0.255 area 0
network 192.168.12.0 0.0.0.255 area 0
passive-interface default
no passive-interface fa 2/0
```

+ 注入默认路由
    - ![](https://cdn.nlark.com/yuque/0/2024/jpeg/44908083/1730104513770-3af86fb7-7636-46e3-bd19-cc3e78dbdf41.jpeg)

```plain
router ospf
network 192.168.1.0 0.0.0.255 area 0
network 192.168.2.0 0.0.0.255 area 0 
network 192.168.3.0 0.0.0.255 area 0
default-information originate
```

+ 自动汇总
    - ![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730105593346-f49940e9-7c5d-4a2a-a6f5-a4838f33aa88.png)

```plain
router ospf 1
summary-address 10.1.0.0 255.255.0.0
```

    - ![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730113712965-2913d333-5783-4fa0-b276-eb37021add99.png)

```plain
router ospf 1
area 2 range 172.16.0.0 255.255.0.0 cost ?
```

+ Virtual-link
    - ![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730114278625-137e8159-3d3f-440f-a631-622f2624109a.png)

```plain
router ospf 1
area area-id virtual-link router-id [authentication[message-digest | null]] [hello-interval seconds] [retransmit-interval seconds] [transmit-delay seconds] [dead-interval seconds] [fauthentication-key key] | [message-digest-key key-id md5 key]
```

## OSPF身份验证
+ Null
+ 简单密码身份验证
+ MD5身份验证
+ 接口认证
+ 区域认证

### 明文
接口认证

```plain
Router(config-if)#ip ospf authentication-key password
Router(config-if)#ip ospf authentication
```

区域认证

```plain
Router(config-if)#ip ospf authentication-key password
Router(config-router)#area area-id authentication
```

### 密文
接口认证

```plain
Router(config-if)#ip ospf message-digest-key key-id md5 key
Router(config-if)#lp ospf authentication message-digest
```

区域认证

```plain
Router(config-if)#ip ospf message-digest-key key-id md5 key
Router(config-router)#area 0 authentication messae-digest
```