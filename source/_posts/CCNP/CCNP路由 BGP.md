---
title: BGP详解
summary: >-
  酥米小机器人来啦，这篇文章介绍了BGP（边界网关路由协议）作为一种路径矢量协议，其主要功能是跨自治系统传输路由信息，支持承载大量路由（IGP仅千条）、VPN应用和强大策略路由能力。文章概述了BGP的V1、V2、V4和MBGP四个版本，以及企业连接ISP的连接方式如单宿、双宿、多宿和双双宿，并解释了三大使用理由：大规模路由处理、VPN支撑和灵活策略。对比IGP，BGP无拓扑发现，但通过AS_PATH机制防止环路，使用TCP端口179建立EBGP和IBGP邻居。核心内容包括AS定义、路由通告规则、同步机制、配置示例和维护方法，并探讨了关键属性如权重、本地优先级、AS路径和MED，强调了BGP在Internet中的关键作用和网络稳定性。
categories:
  - 思科
tags:
  - 网络
  - CCNP
cover: >-
  https://cdn.nlark.com/yuque/0/2024/jpeg/44908083/1730806229082-7508981d-6da2-4ef1-a7a8-12d8b9d550a9.jpeg
date: 2024-11-21 09:01:46
---

<meta name="referrer" content="no-referrer" />

## BGP概述
+ BGP为BorderGateway Protgcol边界网关路由协议(路径矢量)
+ 主要作用是在AS之间传递路由信息
+ 目前BGR有4个版本:V1、V2、V4、V4+(即MBGP)
+ 企业连接到SP
    - 连接到两家或是多家ISP，提供链路的可靠性，连接方式如下
    - 1.Single homed单宿:只连接到一家ISP且没有冗余链路
    - 2.Dualhomed双宿:只连接到一家ISP，使用两条链路来提供冗余
    - 3.Multihomed多宿:连接到多家ISP
    - 4.DualMultihomed双多宿:连接到多家ISP，同时使用两条链路

## 使用BGP的三大理由
+ 大量路由需要承载，IGP只能容纳千条，而BGP可以容纳上万
+ 支撑MPLS/VPN的应用，传递客户VPN路由
+ 策略能力强，可以很好的实现路由决策与数据控制

## IGP具有以下某些特性或者全部特性
+ 执行拓扑发现
+ 尽力完成快速收敛
+ 需要周期性的更新来确保路由选择信息的精准性
+ 受同一个管理机构的控制
+ 采取共同的路由选择策略
+ 提供了优先的策略控制能力

## 关于BGP
+ AS:autonomoussystem自治系统，指的是在同一个组织管理下使用相同策略的设备的集合
+ 不同AS通过AS号区分，AS号取值范围1-65535，其中64512-65535是私有AS号。IANA负责AS号的分发。
+ 中国电信163 AS号:4134
+ 中国电信CN2 AS号:4809 
+ 中国网通 AS号:9929

## BGP的矢量特征
![](https://cdn.nlark.com/yuque/0/2024/jpeg/44908083/1730806229082-7508981d-6da2-4ef1-a7a8-12d8b9d550a9.jpeg)

+ 路径矢量信息中包含一个BGP自治系统列表
+ BGP路由器不接受路径列表中包含其AS号的路由更新，是**无环路**的
+ BGP支持对BGP自治系统路径应用路由策略
+ BGP路由器只能将其使用的路由通告给邻接自治系统中的对等体

## BGP特征
+ BGP使用TCP为输出层协议，TCP端口号为179
+ BGP路由器之间建立TCP连接，这些路由器称为BGP对等体也叫BGP邻居：**<font style="color:#DF2A3F;">EBGP、IBGP</font>**
+ 对等体之间交换整个BGP路由表
+ BGP路由器只发送增量更新或者触发更新（不会周期性更新）
+ 具有丰富的路径属性
+ BGP通告成千上万的路由，可采用TCP滑动窗口的机制，停止并等待确认前，可以发送65576个字节

## BGP packets
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730807035348-b0a84008-40e6-4ca5-b299-e9f24f59896e.png)



### 报文类型
| 报文名称 | 作用是什么 | 什么时候发包 |
| --- | --- | --- |
| OPEN | 协商BGP邻居的各项参数，建立邻居关系 | 通过TCP建立BGP连接，发送open报文 |
| UPDATE | 进行路由信息的交换 | 连接建立后，有路由需要发送或路由变化时，发送UPDATE通告对端路由信息 |
| NOTIFICATION | 报告错误，终止邻居关系 | 当BGP在运行时发现错误时，要发送NOTIFICATION报文通报BGP对端 |
| KEEPALIVE | 维持邻居关系 | 定时发送KEEPALIVE报文以保持BGP邻居关系的有效性 |
| Route-refresh | 为保证网络稳定，触发更新路由的机制 | 当路由策略发生变化时，触发请求邻居重新通告路由 |


## BGP的有限状态机
| Peer状态名称 | 发什么包 | 在做什么 |
| --- | --- | --- |
| Idle | 尝试建立TCP连接 | 准备开始TCP的连接并监视远程peer启动TCP连接，启用BGP时，要准备足够的资源 |
| Connect | 发TCP包 | 正在进行TCP连接，等待完成中，认证都在TCP建立期间完成的。如果TCP连接不上则进入Active状态，反复尝试连接 |
| Active | 发TCP包 | TCP连接没建立成功，反复尝试TCP连接 |
| OpenSent | 发Open包 | TCP连接建立已经成功，开始发送Open包，Open包携带参数协商对等体的建立 |
| OpenConfim | 发Keepalive包 | 参数、能力特性协商成功，开始自己发送Keepalive包 |
| Established | 发Update包 | 已经收到对方的Keepalive包，双方能力特性一致，开始使用Update通告路由信息 |


## BGP Peer
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730809493082-98e0e6ca-f4f0-4d60-921c-277b67c3c35c.png)

+ 运行BGP的路由器被称为BGP speaker
+ BGP对等体也叫BGP邻居，建立基于TCP的关系
+ EBGP：BGP位于不同自治相同的路由器之间，称为EBGP
+ 建立EBGP邻接关系，必须满足三个条件
    - EBGP之间自治系统号不同
    - 定义邻居建立TCP会话
    - neighbor中指定的IP地址要可达

## 中转AS中的IBGP路由传递
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730892076962-e019b9cc-49c5-4659-b378-ac6690db7cfa.png)

### 全互联IBGP邻居关系
+ IBGP全互联虽然能解决transit AS内的路由黑洞问题，但是却造成BGP路由器需要耗费大量资源维护大量BGP连接的新问题
    - 路由反射器
    - 联邦

## IBGP水平分割原则
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730892484804-5d4f1364-9a3c-4165-bd3e-40e75f989e0c.png)

+ BGP防环是通过AS_PATH实现的，而AS_PATH仅仅实在路由离开后AS才会被更改，因此再AS内，IBGP就没有EBGP的防环能力，为了防止环路的出现，BGP路由器不会将从IBGP邻居学习过来的路由再通告给自己其他IBGP邻居
+ 由于水平分割原则存在，BGP要求AS内，需保证IBGP全互联（neighbor命令 指定）
+ （根本原因是在AS内部，AS_PATH不会改变，无法使用AS_PATH防环，因此很容易出现环路）

## BGP路由通告规则
+ 当存在多条路径时，BGP router只选取最优的路由（BEST）来使用（没有负载的情况下）
+ BGP只把自己使用的路由，也就是自己认为Best的路由传递给BGP Peer
+ BGP Speaker从EBGP获得的路由会向它所有的BGP相邻体通告（包括EBGP和IBGP）
+ BGP Speaker从IBGP获得的路由不向它的IBGP相邻体通告（避免循环，水平分割；存在路由RR的情况下除外）
+ BGP Speaker从IBGP获得的路由是否通告给它的EBGP Peer要视IGP和BGP同步的情况来决定

## BGP同步
+ BGP同步规则指出，BGP路由器不应使用通过IBGP获悉的路由或将其通告给外部邻居，除非该路由是本地或者通过IGP获悉的
+ 思科Cisco IOS默认关闭同步
+ 同步关闭，则BGP可以将使用这样的路由，并将其通告给外部BGP邻居：从IBGP邻居那里获悉的且没有出现在本地路由表中的路由
+ 同步开启，则路由器通过IBGP获悉路由后，将等待IGP将该路由传遍整个自治系统，然后再将其通告给外部对等体

## Tables
+ BGP邻居表：邻居列表
+ BGP表：包含了从邻居学习的所有路由，以及到达目的网段的多个路径和属性
+ 路由表：列出了到达目的网段的最佳路径，EBGP路由AD为20，IBGP路由AD为200

## Next-Hop
+ BGP是AS·by-AS的路由协议，而不是router-by-router的路由协议
+ 在BGP中，next-hop并不意味着是下一台路由器，而是到达下一个AS的IP地址
+ EBGP中，默认next-hop为发送更新的邻居路由器的IP地址
+ IBGP中，从EBGP传来的next-hop属性在IBGP中保持不变的被传递

### 修改next-hop
+ 为了防止路由黑洞问题，R1、R2、R3建立IBGP全互联且均用各自的LOOPBACK接口建立IBGP关系

## 配置BGP
### 基础配置
`**Router(config)# router bgp** _autonomous-system_`

+ 仅仅执行router bgp不能再路由器上激活BGP，必须执行至少一个子命令才能再路由器激活BGP进程
+ 在路由器上职能配置一个BGP实例

### 指定BGP邻居及激活BGP会话
`Router(config-router)# neighbor {ip-address | peer-group-name } remote-as autonomous-system`

+ 邻居指定的ip地址必须路由可达
+ BGP路由都需手工指定，不能像IGP那样通过协议自动发现
+ AS决定与邻居建立的是EBGP还是IBGP会话

### 指定BGP将通告的网络
`Router(config-router)#network network-number [mask network-mask] [route-map map-tag]`

+ network命今与IGP不同，BGP命令network为通告哪些IP路由进BGP进程，而不是在接口上启用BGP 
+ network支持无类前缀，前缀必须与路由表中的条目完全匹配
+ 如果不指定mask，只通告主类网络号，而且仅当主类网络中至少有一个子网出现在IP路由表中，BGP才会将该主类网络作为一条BGP路由通告
+ 指定了mask，则仅当路由选择表中有与该网络完全匹配的条目时才被通告出去

### BGP同步
`Router(config-router)# no synchronization`

+ 关闭同步(默认关闭)

`Router(config-router)# synchronization`

+ 开启同步

### BGP router-id
`Router(config-router)# bgp router-id x.x.x.x`

+ 手工设置BGP routerlD

### 示例1
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730894784939-f4d16b2c-c930-4ab1-a48c-c47743e91c9d.png)

### 指定更新源
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1730894818299-aa7e1866-0994-4faa-88c4-156f792c9c65.png)

### BGP身份验证
Router(config-router)# neighbor {ip-address | peer-group-name} password string

+ BGP支持MD5邻居身份验证
+ 启用身份验证后，将对通过的对等体之间的TCP连接传输所有的数据等进行验证
+ 认证都是在TCP建立连接的时候完成的

## 维护BGP
+ 重置BGP会话
+ 将新策略应用于所有路由，必须触发一个更新

### 三种触发更新的方式
+ 硬重置
+ 软重置
+ 路由刷新

### 硬重置
+ 断开相应TCP连接，通过这些会话收到的所有信息都将失效，并从BGP中删除
+ （不建议优先使用硬路由，谨慎！这将删除数据，请三思而后行！！！！）
    - `clear ip bgp {neighbor-address}`
    - `clear ip bgp *`

### 软重置
+ 不拆除并重建TCP或者BGP连接，而是仅出发更新操作以便让新的路由策略生效
+ 软重置可以仅由于出站或入站策略，也可同时用于出入站策略

#### 出站软重置
+ 不会拆除TCP连接，不会重置BGP会话，仅促发更新操作以便让新的路由策略生效（发送update消息）
+ 需要修改出站策略时，建议使用该命令
+ `clear ip bgp soft out`

#### 入站软重置
+ 本地发送route-refresh给所有的BGP邻居
+ `clear ip bgp soft in`

注：CISCOIOS 12.1开始全面支持入站路由的动态软重配置，但在之前的版本在使用入站软重配置之前必须首先在BGP进程中增加如下配置:neighbor x.x.x.x soft-reconfiguration inbound然后再使用clear ip bgp soft in命令这条命令会将x.x.x.x邻居发送过来的BGP路由存储在内存中，当配置入站软重置后，路由器不再向邻居发送更新请求，而是直接在内存中存储的路由中执行新配置的入站策略，以此来防止触发大批量的路由更新而造成资源的浪费，但是这种操作仍会耗费内存，因此在使用的时候要非常慎重。

## BGP属性
| 公认属性<br/>（Well-known） | 公认必遵<br/>（Well-known mandatory） | BGP 必须都能识别，且在更新消息必须包含 | Origin<br/>AS-Path<br/>Next hop |
| --- | --- | --- | --- |
| | 公认自决<br/>（Well-known discretionary） | BGP 必须都能识别，更新消息可包含可不包含 | Local-Preference<br/>ATOMIC_Aggregate |
| 可选属性<br/>（Optional） | 可选传递<br/>（Optional transitive） | 可以不支持该属性，但即使不支持也应当接受包含该属性的路由并传递给其他邻居 | Community<br/>Aggregator |
| | 可选非传递<br/>（Opinional non-transitive） | 可以不支持该属性，不识别的BGP进程可以忽略包含这个属性的更新消息，并且不传递给其他BGP邻居 | MED<br/>Originator_ID<br/>Cluster_list<br/>*Weight |


## WEIGHT
+ 在路由器本地配置，只提供本地路由策略，不会传播给任何BGP邻居
+ 范围：0~65535；越大越优先
+ 路由器本地始发的路径默认权重是32768，从其他BGP邻居学到的为0

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1731410361179-24230caa-4101-4214-b7b2-e36684c17565.png)

## LOCAL PREFERENCE
+ **<font style="color:#DF2A3F;">公认自由决定属性</font>**
+ 告诉AS中的路由器，哪条路径是离开AS的首选路径
+ LP越高路径越优
+ 只发送给IBGP邻居，而不能传给EBGP邻居
+ 默认本地优先级为100
+ ![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1731410490396-d8420a3c-2906-416b-944d-863e909fac07.png)

## AS-Path（公认强制属性）
+ 是前往目标网络的路由经过的自治系统号列表，通告该路由的自治系统号位于列表末尾
+ 作用：确认无环，通告时给EBGP时会加上自己的AS号；通告给IBGP时不修改AS-Path

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1731410691990-01881309-1058-46d1-a075-114e2b239fd1.png)

### 四种类型
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1731411052266-03328819-94f7-4586-8077-d5e506eee364.png)

+ **<font style="color:#DF2A3F;">AS_SET</font>**：一个去往特定目的地所经路径上的无序AS列表
+ **<font style="color:#DF2A3F;">AS_SEQENCE</font>**：一个有序的AS号列表
+ **<font style="color:#DF2A3F;">AS_CONFED_SEQUENCE</font>**：一个去往特地目的地所经路径上的有序AS号列表，其用法与AS_SEQENCE完全一样，区别于该列表的AS号属于本地联邦中的AS
+ **<font style="color:#DF2A3F;">AS_CONFED_SET</font>**：一个去往特定目的地上的无序AS号列表，其用法与AS_SET一样，区别在于列表中的AS号属于本地联邦中的AA

## Origin（公认强制属性）
+ 标识路由的起源，有下列三种可能：
    - i	通过BGP network，也就是起源于IGP，因为BGP network必须保证该网络在路由表中
    - e	是由EGP这种早期协议重发布而来
    - ？	Incomplete，从其他渠道学习到的，路由来源不完全（确认该路由来源的信息不完全）。（重发布的路由）
+ 路由优选顺序：lowest origin code（IGP>EGP>Incomplete）

## MED（可选非传递属性）
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1731411803897-0b6bf6f9-e658-48a4-a306-7a8d455526f8.png)

+ 是一种度量值，用于外部邻居指出进入AS的首选路径，即当入口有多个时，自治系统可以使用MED动态的影响其他AS如何选择进入路径
+ 度量值越小路径越优
+ MED是在AS之间切换，MED发送给EBGP对等体。这些路由器在AS内传播MED，不传递给下一个AS
+ 默认情况下，仅当路径来自同一个AS中的不同EBGP邻居时，路由器才比较他们的MED属性
+ MED影响进入AS的数据流:LP影响离开AS的数据流

### 比较原则及配置注意事项
+ 本地在将一条BGP路由通告给EBGP Peer时，是否携带MED值,需要根据以下条件进行判断(不对EBGP Peer使用Route-map的情况下)
    - 如果该BGP路由是本地始发(network或redistribute)的,则携带MED值发送给EBGP Peer(如果MED为空,则设置为0)
    - 如果该BGP路由是从其他BGP Peer学习过来的，那么将该路由通告给EBGPPeer时不携带MED
+ 本地在将一条BGP路由通告给IBGPPeer时，一定会携带MED值
    - 如果接收或产生的路由的MED为空,那么在向IBGP Peer通告时,将MED设置为0
+ 总结1、2两点就是MED在IBGP之间传递没有问题(不会丢失)，但是在EBGP之间传递要看路由是否起源于自己。

## NEXT_HOP（公认强制属性）2
+ 如果路由传递自EBGP peer

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1731412077866-bf31be10-26e7-4487-8738-b72ccc505e38.png)

+ 如果路由传递自IBGP邻居，并描述的是AS外的目的地

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1731412193230-54295d0a-b300-4fea-bf2b-203de0f4a3e0.png)

+ 如果路由传递自IBGP邻居，并由AS内BGP路由器引入

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1731412344784-f2e1be11-a76c-4738-9ecf-dc9a4e8884c9.png)

Tips：如果IBGP peer使用network或重发布的方式引入IGP路由，那么通告者将使用这些路由的IGP下一跳作为NH；如果这些路由是该IBGP peer配置的BGP汇总路由，则NH为其更新源IP。

### On Shared Media
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1731413016975-73d4cf2b-a590-4d19-a73b-aeef941be1d8.png)

+ RouterB将路由100.100.100.0/24传递给A，NEXT_HOP为10.1.123.2
+ RouterA将路由100.100.100.0/24传递给C，此时NEXT_HOP保持不变
+ 如果路由器收到某条BGP路由，该路由的NEXT_HOP地址值与EBGP邻居(更新对象)同属一个网段，那么该条路由的NEXTHOP地址将保持不变并传递给它的BGP邻居

### On NBMA
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1731413248307-5df17964-315e-4c31-8d2b-5b159d9bcf53.png)

+ 如果中间的多路访问不是Ethernet，而是帧中继（NBMA）呢？

## COMMUNITY
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1731458979252-74a8f3c5-cb61-494c-8820-44d1f21f23cf.png)

+ 可选传递属性
+ 一种标记，用于简化路由策略的执行
+ 可以将某些路由分配一个特定的COMMUNITY属性，之后就可以基于COMMUNITY值而不是每条路由进行BGP属性的设置了

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1731460387790-d039cfe4-b94c-44ce-a4f2-0d89f944d64a.png)

### 几个众所周知的值
```plain
route-map test permit 10
set community ?
<1-4294967295>	community number
aa:nn						community number in aa:nn format
additive				Add to the existing community
internet				Internet (well-known community)
local-AS				Do not send outside local AS (well-known community)
no-advertise		Do not advertise to any peer (well-known community)
no-export				Do not export to next AS (well-known community)
none						No community attribute
```



**Route**

Community=no-adv

R2不会将该路由再通告给任何BGP peer

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1731460836560-e5a0cea7-a8fa-4bd1-a0d9-bbefda45b523.png)

## Atomi_Aggregate及aggregator
172.16.0.0/16

汇总路由丢失明确路由的路径属性

需要给下游邻居告警，并提示“汇总点”及汇总地AS

![](https://cdn.nlark.com/yuque/0/2024/jpeg/44908083/1731461244712-db15a1db-b381-40ae-8c8e-83d80a966bf6.jpeg)

`aggregate-address 172.16.0.0 255.255.0.0 summary-only`

```plain
R4# show ip bgp 172.16.0.0
BGP routing table entry for 172.16.0.0/16, version 4
Paths:(1 available, best #1, table Default-lP-Routing-Table)
Flag:0x820
Not advertised to any peer
300,(aggregated by 300 3.3.3.3)
10.1.34.3 from 10.1.34.3 (3.3.3.3)
Origin lGP, metric 0, localpref 100, valid, external,atomic-aggregate, best
```

### 报文案例
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1731461667500-f2c080c5-fc71-4b5c-984c-22dcd23c405a.png)

## BGP自动汇总
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1731461782082-4df50a90-5604-4b26-93cd-52ae719c6130.png)

+ 若R1开启auto-summary，并用重发布直连的方式引入1.1.1.0/24，则该子网会被汇总
+ 若R1开启auto-summary,且network1.1.1.0 mask 255.255.255.0，则仍以明细更新
+ 若R1开启auto-summary,且network1.0.0.0 mask 255.0.0.0,则该子网会被汇总
+ 上面这条network等同于network 1.0.0.0(network的有类宣告)

**<font style="color:#DF2A3F;">因此BGP自动汇总(auto-summary)只汇总重发布引入的路由，以及使用network命令有类宣告方式引入的路由。目前CISCO IOS默认关闭自动汇总。</font>**

## <font style="color:#000000;">BGP手动汇总</font>
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733121752791-989f633a-4d0d-48dd-ac50-8335ac3782e9.png)

+ 可以考虑在R3上创建静态的汇总路由

`ip route 172.16.0.0 255.255.0.0 null0`

+ 然后再将汇总路由network进BGP
+ 不推荐此方法

### 针对特定邻居取消抑制
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733121996017-8e7e4481-a185-40b9-85c2-3742644693c5.png)

```plain
access-ist 1 permit 172.16.1.0
route-map unsupp permit 10
  match ip address 11
router bgp 300
  neighbor 10.1.35.5 unsuppress-map unsupp
  aggregate-address 172.16.0.0 255.255.0.0 as-set summary-only
```

### advertise-map
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733122218668-609b391f-86ce-4a69-9cd4-22e981484fd5.png)

```plain
ip prefix-list list1 permit 172.16.1.0/24
ip prefix-list list1 permit 172.16.2.0/24
route-map adv permit 10
  match ip address prefix-list list1
aggregate-address 172.16.0.0 255.255.0.0 summary-only as-set advertise-map adv
```

### attrubute-map
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733122395149-ba69abf1-caa8-4996-a318-f50e5741822e.png)

```plain
route-map attr permit 10
  set ?
aggregate-address 172.16.0.0 255.255.0.0 summary-only as-set attribute-map attr
```

### 终方案
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733122474434-007e0670-c4db-4dd8-9b54-e9c5ded166c2.png)

```plain
aggregate-address 172.16.0.0 255.255.0.0 summary-only as-set
```

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733122543075-6fe96b97-2d36-4b13-9bd8-ec7c21098471.png)

```plain
access-list 1 permit 172.16.2.0
access-list 1 permit 172.16.11.0
route-map suppmap permit 10
  match ip address 1
aggregate-address 172.16.0.0 255.255.0.0 suppress-map suppmap
```

## 正则表达式
+ 正则表达式（regular expresion）是按照一定的模板来匹配字符串的公式。

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733122792066-d45f8c40-28be-44fc-9ef2-fe1d61632c39.png)

### 原子字符
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733122829384-9067e136-8d1b-4941-a29a-d059b397d1ce.png)

#### 示例
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733122859463-f2706ecb-995d-434a-adcd-fb3603038c63.png)

### 乘法字符
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733122918646-e2bfab69-bfb0-4d20-99e2-2e598f14cf10.png)

#### 示例
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733122964843-3d32c0ca-e4f3-4de0-9ec0-3260d8a107af.png)

+ 一个乘法字符可以应用于一个单字符或多个字符，如果用于多字符，需将字符串放入（ ）中

### 范围字符
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733122937086-5335bee7-7d2d-4911-b02c-c4bd1c6cdc3a.png)

#### 示例
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733123043302-ae7c2612-b283-4ed8-be08-c8ed67973230.png)

### 使用正则表达式匹配AS_PATH
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733123094575-e9208cd3-efbf-46e1-92d6-728495dcb98d.png)

+ AS_PATH可以当作字符串并使用正则表达式进行匹配
+ String中的 "__" 为空格，这也是一个字符，也有可能被匹配

#### 示例
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733123298715-383afd98-b548-4353-bc46-54d9ee5187f6.png)

+ 注意as-path access-list也是默认含隐拒绝所有

### 使用as-path access-list 匹配路由
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733123415356-86bd5433-a930-4f66-a9a1-7d144b63fec7.png)

#### 示例1 搭配filter-list
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733123497581-877d75ef-a72f-4ab8-aa0a-e4a792edcf90.png)

+ 在R3上可做策略

```plain
ip as-path access-ist 1deny _600$
ip as-path access-list 1 permit .*
router bgp 300
  neighbor 10.1.23.2 filter-list 1 in
```

#### 示例2 搭配route-map
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733123628617-406b7486-d886-41d5-9ed5-115603b2032f.png)

+ R3可做策略

```plain
ip as-path access-ist 1 permit _600$
route-map setCommu permit 10
  match as-path 1
  set community no-advertise
route-map setCommu permit 10

router bgp 300
  neighbor 10.1.23.2 route-map setcommu in
```

### 配置命令
`Router(config)# ip as-path access-list num {permit|deny} regexp`

+ 配置as-path access-list

`Router(config-router)# neighbor x.x.x.x filter-list as-path-filter {inlout}`

+ 关联as-path access-list到filter-list，起到路由过滤作用

#### 验证及查看
`Router# show ip as-path-access-list`

+ 查看配置的 as-path access-list

`Router# show ip bgp regexp xx`

+ 显示BGP表中所有被该正则表达式匹配上的路由，这是一个非常不错的工具

`Router# show ip bgp filter-list access-list-num`

+ 显示BGP表中所有被该filter-list匹配的路由

## 通告community操控路由
### BGP Communities
+ BGP communities是一种路由标记方法，用于确保路由过滤和选择的连续性
+ 可选传递属性，不支持该属性的BGP router原封不动的将community值传递给下游BGP邻居

### Community
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733124090787-e2d027b9-f95b-466a-b5e8-86d7bdb3805c.png)

+ 使用全局配置命令切换：

`ip bgp-community new-format`

### BGP路径操纵
#### 设置Community
```plain
route-map test permit 10
set community ?
<1-4294967295>		community number
aa:nn							community number in aa:nn format
additive					Add to the existing community
internet					Internet(well-known community)
local-AS					Do not send outside local AS (well-known community)
no-advertise			Do not advertise to any peer (well-known community)
no-export					Do not export to next AS (well-known community)
none							No community attribute
```

### 总所周知的值
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733124385448-cf61fcfb-a43e-4fb0-b8af-97b8e047e12d.png)

**Route**

+ Community=local-as
+ 该路由只能在本AS内传递（如果定义了联邦，则为只在联邦成员AS传递）

### 为路由前缀分配Community
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733124481538-4caea059-33d5-4c50-89d2-305d5b25bf67.png)

+ R1配置如下：

```plain
ip prefix-ist 11 permit 11.11.11.0/24
route-map test permit 10
  match ip address prefix-list 11
  set community 100:11
  
router bgp 100
  network 11.11.11.0 mask 255.255.255.0
  neighbor 10.1.12.2 remote-as 200
  neighbor 10.1.12.2 send-community
  neighbor 10.1.12.2 route-map test out
```

### 为路由前缀分配多个Community
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733124672973-08971d75-7687-4f0c-a733-782014d85b5c.png)

+ R2的配置如下：

```plain
ip community-ist 11 permit 100:11
route-map test permit 10
  match community 11
  set community no-export additive

router bgp 200
  neighbor 10.1.12.1 remote-as 100
  neighbor 10.1.23.3 remote-as 300
  neighbor 10.1.23.3 send-community
  neighbor 10.1.23.3 route-map test out
```

### 为路由前缀分配多个Community（cont.）
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733124846029-37b26bce-3e5b-41e6-949a-f6f5eca0889c.png)

+ R3上查看11.11.11.0的BGP路由：

```plain
R3#sh ip b 11.11.11.0
BGP routing table entry for 11.11.11.0/24,version 5
Paths:(1 available, best #1, table Default-P-Routing-Table, not advertised
to EBGP peer)
Flag:0x820
  Not advertised to any peer
  200 100
    10.1.23.2 from 10.1.23.2 10.1.23.2)
    Origin lGP, localpref 100, valid, external, best
    Community:100:11 no-export
```

### 用community-list匹配团体属性
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733124981265-f03cbe06-2d35-4141-82f4-4bc934728879.png)

`lp community-list 1 permit 100:11`

+ 匹配。匹配community中包含100:11的路由

`lp community-list 1 permit 100:11 no-adv`

+ 不匹配。要求100:11及no-adv两者都有才匹配成立

`lp community-list 1 permit 100:11`

`Ip community-list 1 permit no-export(或将no-export换成no-adv)`

+ 匹配。只要community中包含100:11或no-export

### 用community-list匹配团体属性（cont.）
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733125149714-85e3e77c-fab0-4cb2-aae7-d89f093f56c3.png)

`ip community-list 12 permit internet`

+ 所有路由默认都属于internet

### 用community-list匹配团体属性 严格匹配
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733125250291-e5171d9b-624d-4446-b988-3117e17dd97d.png)

```plain
lp community-list 11 permit no-export
route-map test permit 10
match community 11 exact-match		// 严格匹配
严格匹配community属性为no-export的路由，多一点，少一点都不行

Show lp community-ist 1 [exact-match]
查看community-list 1
```

### 删除某个或多个community值
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733125335491-71efe10e-6c26-4e45-afe6-6f30821e8c97.png)

+ **一条路由，允许携带多个community值，构成一个community列表，那么如何删除某个或者某几个community值?譬如只想删除11路由的no-export属性**

```plain
ip community-list standard del permit no-export		// 匹配要删除的commu值
route-map test permit 10
  set comm-list del delete		// 用这条命令删除
```

### 删除多个community值
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733125474298-a0ab0f1a-bc22-46f8-bce2-e8fcd77cebf0.png)

```plain
ip community-list standard del permit no-export		// 用多行community-list
ip community-list standard del permit 100:11		// 用多行community-list
route-map test permit 10
  set comm-list del delete
```

### 配置community-list
`lp community-list 1-99 permit|deny value [value...]`

定义标准的community-list，使用internet关键字匹配任何community

`lp community-list 100-199 permit|deny regexp`

定义扩展的community-list，可使用正则表达式匹配community

`show ip community-list`

查看配置的community-list

`show ip bgp x.x.x.x`

查看BGP路由的详细信息，包括community

## Prefix-list
### 配置实例
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733125724825-5fc79afd-ba57-4220-a7e3-c07cbc16d21f.png)

+ R2上，过滤掉12.12.12.0/24路由，其他放行

```plain
R2(config)# ip prefix-list 12 deny 12.12.12.0/24
R2(config)# ip prefix-list 12 permit 0.0.0.0/0 le 32
R2(config)# router bgp 12
R2(config-router)# neighbor 10.1.23.3 prefix-list 12 out
```

## distribute-list
### 配置实例
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733125796770-bb717766-917b-4aca-9dce-e03e43310a11.png)

+ R2上，过滤掉12.12.12.0/24路由，其他放行

```plain
R2(config)# access-ist 1 deny 12.12.12.0
R2(config)# access-list 1 permit any
R2(config)# router bgp 12
R2(config-router)# neighbor 10.1.23.3 distribute-list 1 out
```

## Route-map
### 可以在以下的BGP命令中使用route-map关键字
+ neighbor
+ bgp dampening
+ network
+ redistribute

### 可以为特定的目的在不同的命令中调用定义好的route-map
+ suppress-map
+ unsuppress-map
+ advertise-map
+ inject-map
+ exist-map
+ non-exist-map
+ tabel-map

### match语句能匹配
+ Access-list
+ Ip prefix-list
+ Ip next-hop
+ local-preference
+ metric
+ Tag
+ AS PATH
+ BGP community
+ IGP route-type(internal/external)

### set语句能设置
+ Origin
+ Weight
+ BGP community
+ LOCAL PREFERENCE
+ MED

### 配置实例 关联network 执行策略
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733126321432-30b4a9e2-5670-4e5c-b28e-b11d6398051b.png)

+ _**R1上，network引入路由时设置路径属性**_

```plain
ip prefix-list 11 permit 11.11.11.0/24
ip prefix-ist 12 permit 12.12.12.0/24
route-map RP1 permit 10
  set community 100:11
route-map RP2 permit 20
  set community 100:12
router bgp 100
  network 11.11.11.0 mask 255.255.255.0 route-map RP1
  network 12.12.12.0 mask 255.255.255.0 route-map RP2
  neighbor 10.1.12.2 send-community
```

+ **该策略对所有BGP邻居有效**

### 关联neighbor，针对特定邻居执行策略
**R1上，对R2传递路由时，设定MED属性值**

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733126749376-550e409c-c6c6-419c-8ca7-fa6ec14c3a1d.png)

```plain
ip prefix-list 11 permit 11.11.11.0/24
ip prefix-list 12 permit 12.12.12.0/24
route-map RP permit 10
  match ip address 11
  set metric 1000
route-map RP permit 20
  match ip address 12
  set metric 2000
router bgp 100
  neighbor 10.1.12.2 route-map RP out
```

### 配置实例 重发布关联route-map
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733126794524-8909f174-b61c-467b-9e8e-4a56528ab197.png)

**R2上，将OSPF路由重发布进BGP**

```plain
router bgp 200
redistribute ospf 1 route-map RP match ?
neighbor 10.1.12.1 remote-as 100
no auto-summary
```

**redistribute ospf 1**

+ 默认只重发布Intra-Area及Inter-Area路由
+ match extemnal只重发布E1及E2
+ match external 1只重发布E1;external 2只重发布E2
+ match nssa-external 只重发布NSSA外部路由

### Policy-list
+ 可预先将包含一组match语句的route-map定义成一个命令列表，这个列表称为policy-list
+ 这些policy-list可以在route-map中被调用
+ 一个policy-list就像个只包含match语句的route-map当route-map被执行，被其调用的policy-list中所包含的match语句将一并被遍历且执行match动作
+ 这是一种在大中型网络中运用、使得配置“模块化”的特性

#### 特性
+ Ipv6不支持
+ 12.0(22)S 和12.2(15)T之前的CISCOIOS版本不支持该特性，另外更老的IOS版本的路由器重启存在路由策略配置丢失的风险
+ Policy-list中不能包含set语句，但是它被route-map调用后，该route-map中可以包含set语句
+ Policy-list只在BGP中支持，其他的IP路由协议并不支持这个特性

#### 配置
```plain
ip policy-list as100 permit
  match as-path 1
  match community 1
```

+ 上述命令创建一个policy-list
+ Policy-list只能包含match语句

```plain
route-map RP permit 10
  match policy-list as100
  match ip address prefix-list 100
  set local-preference 300
```

+ 上述命令在route-map中调用定义好的policy-list
+ 一个route-map中可调用多个policy-list

## ORF
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733127261820-c5da6b86-80e8-429d-bc1a-2a6100b878e4.png)

### 配置
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733127420812-f87e5d92-541e-4e91-91ee-8da2c7342e7e.png)

+ R2的配置（sender）

```plain
router bgp 12
  address-family ipv4 unicast
  neighbor 10.1.12.1 capability orf prefix-ist send
  neighbor 10.1.12.1 prefix-list FILTER in

ip prefix-ist FlLTER deny 1.1.1.0/24
ip prefix-list FlLTER permit
```

+ R1的配置（receiver）

```plain
router bgp 12
  address-family ipv4 unicast
  neighbor 10.1.12.2 capability orf prefix-list receive
```

+ 注意：省去基本配置，如手工指定BGP邻居

### 一些
+ ORF消息包含以下内容
    - AFl/SAFlipv4 unicast
    - ORF TYPE
    - When to refresh
    - List of ORF entries
+ ORF类型不同，ORFentries也不尽相同
+ 每种ORF类型都需要进行ORF能力的协商

## 路由拆分 BGP Deaggregation
### 背景
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733127855820-e4b03bc3-1426-46bb-b770-6e35ac5f0b46.png)

### 配置
+ Conditional inject的配置如下(BGP路由选择进程模式下)

`bgp inject-map map1 exist-map map2 [copy attributes]`

+ 上述命令的意思是当map2所匹配的汇总路由正常时，在本地BGP RIB中注入map1中定义的明细路由。
+ 当汇总路由挂掉，这条明细也就跟着消失，这就是所谓的条件注入-conditional injection。
+ 下面我们在看来一下这两个route-map的详细内容，这些是需要格外注意的。
+ exist-map使用的route-map最少具有以下两个match语句

`match ip address prefix-list`

+ 上面这条match语句用来匹配汇总路由

`match ip route-source`

+ 上面这条match语句用来匹配发送该汇总路由的邻居IP。如果指定了copyattributes选项，那么被inject的明细路由会继承汇总路由的路径属性，否则明细将被当成本地生成的路由。
+ Inject-map使用的route-map中

`Set ip address prefix-list`

+ 上面的这条set命令用来定义将被注入到本地BGPRIB的明细路由。被注入的前缀可以使用

`Show ip bgpinjected-path`

+ 来显示

## 路由反射器
### 中转AS中的IBGP问题
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733138789405-9509b338-52b2-4cd0-b7b8-716ee84b829a.png)

+ AS内要求IBGP全互联（IBGP水平分割）
+ BGP routers
    - 需维护大量的TCP和BGP链接
    - 网络中充斥着BGP路由信息
+ 解决方案
    - 路由反射器
    - BGP联邦

### 背景
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733138923248-9e3c4eb2-ccea-4481-8feb-28e80a14bd4e.png)

+ 因为IBGP水平分割原则，导致AS内部需要维护大量的BGP链接（要求IBGP全互联），从而影响网络性能，路由反射器可以“放宽”水平分割原则，缓解该问题

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733139053948-4ababdc6-fc58-4813-a03b-65e6b92fa662.png)

+ Route Reflector
+ Client

### 联邦内的BGP路由路径属性
+ 在联邦内部保留外部路由的NEXT_HOP属性
+ 公布给联邦的路由的MED属性在整个联邦范围内予以保留
+ 路由的LP属性在整个联邦范围内予以保留
+ 在联邦范围内，将成员AS号压入AS PATH，但不公布到联邦外，并且使用TYPE3、4的AS PATH
+ AS PATH中的联邦成员AS号用于在联邦内部避免环路;联邦内成员AS号不参与AS PATH长度计算

### 路由反射原则
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733139094878-a409c072-6d0f-48f0-8f54-d88dc4810e2a.png)

+ 如果路由学习自非client IBGP对等体，则反射给所有client
+ 如果路由学习自—client，则反射给所有非client IBGP邻居和除了该client以外的所有client
+ 如果路由学习自EBGP邻居，则发送给所有的client和非client IBGP邻居

### 实例1
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733139249267-49816366-cad0-4367-bc94-0694daae41ae.png)

+ 如果路由学习自一client，则反射给所有非client IBGP邻居和除了该client以外的所有client

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733139304799-ced25330-ed76-4b30-8385-39709a182131.png)

+ 如果路由学习至自client IBG对等体，则反射给所有的client

### 路由反射器下的防环
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733139376642-4f17a413-a0ac-4a12-b60a-b5f67e6af3da.png)

+ 由于AS PATH属性在AS内部不会发生变化(仅当路由离开本AS才会被更新)，因此AS内才有水平分割的机制用于防止环路，而路由反射器实际上是放宽了水平分割原则，这个就会给环路带来一定的隐患，因此路由反射器需使用以下两个属性防止环路ORIGINATOR ID和CLUSTER LIST是路由反射器使用的可选非传递属性，用来防止环路。

### Originator_ID、Cluster_list
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733140109190-57da2edc-e4e2-44dd-859d-498ca74c3909.png)

#### Originator_ID
+ 每当一条路由被路由反射器反射时，该路由的始发IBGP路由器的Router-ID将会被存在路由的originator_ID属性中
+ 当一台路由器收到IBGP路由且其originatorID与该路由器的RouterID相同，则路由器忽略该条路由
+ Originator_ID及Cluster-list属性将会影响BGP路径决策

#### Originator_ID的值
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733140502948-58450af4-a6d4-4764-b425-43380d718b4b.png)

### 路由反射原则
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733140292005-dd4b4b29-9070-492d-9038-64a94ac51f6e.png)

+ 如果路由学习自非client lBGP对等体，则反射给所有client
+ 如果路由学习自一client，则反射给所有非ctientIBGP邻居和除了该client以外的所有client
+ 如果路由学习自EBGP邻居，则发送给所有client和非clientIBGP邻居

### 路由反射簇
+ 路由反射簇包括反射器及其Client
+ 每一个簇都有唯一的簇ID
+ 每当一条路由被反射器反射后，该反射器(该簇)的ClusterID就会被添加至路由的Cluster list属性中
+ 每当反射器收到一条Cluster list属性已经包含该簇的ClusterID的路由时，该路由基于防环的目的将不被反射

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733140660257-05943ad7-9a7c-4dab-af52-05dac354ea2b.png)

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733140718784-4731164f-0b69-4428-b4ff-cbeeaab41843.png)

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733140920126-45d22e04-6ac7-4ea2-b433-4ecf734da20a.png)

### 路由反射器冗余
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733141230441-a00716c4-3db4-4a6c-9fb7-535cd4ebe1d1.png)

+ 冗余RR增加了网络的健壮性
+ 使用Originator IDCluster_list属性来在冗余RR环境中避免路由环路。
+ 例如将两个RR 的Cluster_ID配置为一样，那么可以起到进一步的防环作用
+ 所有的RR之间建议采用IBGP全互联
+ Client会收到来自两个RR反射的路由，如何决策 ?

### BGP选路规则
1. 优选具有最大Weight值的路由
2. 优选具有最大Local Pref值的路由
3. 优选起源于本地的路由(如本地networkaggregate或redistribute的)即下一跳是0.0.0.0(在BGP 表中,当前路由器通告的路由的下一跳为0.0.0.0)
4. 优选AS-Path最短的路由
5. Origin(IGP >EGP>Incomplete )
6. 优选MED最小的路由，默认情况下仅有当所有的备选路由来自同一AS才会比较MED
7. 优选EBGP邻居发来的路由(相对于IBGP邻居学过来的)，在联邦EBGP和IBGP中首选联邦EBGP 路由
8. 优选到BGP NEXT HOP最近的邻居
9. 如果有多条来自相同相邻AS的路由并通过Maximum-paths 使多条路径可用,则将所有开销相同的路由放入Loc-RIB
10. 优选最老的EBGP路由，降低滚翻的影响(此条主要对EBGP路由起效，但是现在基本不用该条，因不确定性太大)
11. BGP 邻居的RID越小越优先
12. 优选Cluster-List 最短的路由
13. 选择邻居ip地址(BGP的neighbor配置中的那个地址)最小的路由

## 优选MED最小的路由
### MED属性设置方法
+ 将IGP路由引入BGP时关联Route-map进行设置
+ 对BGP Peer应用IN/OUT方向的Route-map进行设置
+ 非Route-map(自动)方式
    - 使用network或redistribute方式将IGP路由引入BGP时,MED将继承IGP路由的Metric(直联路由及静态路由的Metric为0)
    - 使用aggregate-address方式引入路由，则MED为空

### MED注意事项
+ 默认情况下，只比较来自同一邻居AS的BGP路由的MED值，就是说如果同一个目的地的两条路由来自不同的AS，则不进行MED值的比较。如果仍然希望比较来自不同邻接AS的路由，可使用如下命令
+ `bgp always-compare-med`
+ MED只是在直接相连的自治系统间影响业务量，而不会跨AS传递

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1733208543904-53fea48b-83db-441b-964d-f8c27e92a6ee.png)

## BGP负载均衡
+ 当前面的8条选路原则都无法优选出最优路由时，并且在BGP进程下面配置了maximum-paths[ibgp]n,n的取值为2-6,那么将执行等价负载均衡，也就是将这些等代价的BGP路径都放进IP路由表使用，但是要注意，虽然这些路径在本地都用了，最终却只有一条BGP路径是best最优的。具备等价负载均衡条件的候选路径需满足如下条件:
    - 必须有相同的路径属性，如weight、LP、AS PATH(不仅是长度，整个AS PATH包括AS号都要相同)、origincode、MED及IGP的Distance值
    - 每一条路径的下一跳都不相同

__