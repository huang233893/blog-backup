---
title: OSPF基础
summary: >-
  酥米小机器人来啦，这篇文章介绍OSPF基础知识，OSPF是一种链路状态路由协议，无路由循环，管理距离为110，它通过SPF算法计算最短路径基于网络拓扑，采用开放式协议可在所有支持路由器上运行，核心包括建立邻接关系、Hello和DBD等报文类型、三张表邻居拓扑路由、RouterID选举和DR/BDR机制来优化多路访问网络，且网络类型如DMA和NBMA定义接口行为，OSPF区域支持路由汇总减少LSA泛洪和提升稳定性，配置实践涉及启用OSPF进程和宣告网络到区域，确保全网路由一致性
categories:
  - 思科
tags:
  - 网络
  - CCNA
cover: https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/OSPF%20(9).png
date: 2024-10-17 15:01:46
---

## 简介
1.OSPF是一种链路状态路由协议，无路由循环（全局拓扑），RFC 2328

2.OSPF采用开放的协议，并非EIGRP一类仅思科可用的专有协议，这意味着OSPF可以在所有支持的路由器上运行

3.管理性距离：110

### 采用SPF算法计算达到目的地的最短路径
+ 什么是链路（link）？= 路由器的接口
+ 什么叫状态（State）？= 是指接口以及其与邻居路由器之间的关系

## 基本运行步骤
1.建立邻接关系（Establish router adjacencies）

2.必要的时候进行DR的选举（Elect the DR / BDR）

3.发现路由（Discover routes）

4.选择合适的路由器（Select appropriate routes）

5.维护路由信息（Maintain routing information）

## 网络类型
### DMA
 DMA 广播型多路访问</span></summary><p id="ub2915ced" class="ne-p"><img src="https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/OSPF%20(9).png" width="434" id="uc4008158" class="ne-image"></p></details>
### Point-To-Point
 Point-to-Point 点对点
 <img src="https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/OSPF%20(6).png" width="413" id="u0f335e14" class="ne-image"></p></details>
### NBMA
 NBMA 非广播型多路访问</span></summary><p id="u0783e427" class="ne-p"><img src="https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/OSPF%20(7).png" width="432" id="u22677836" class="ne-image"></p></details>


### 报文类型
+ **Hello** 建立和维护OSPF邻居关系
+ **DBD** 链路状态数据库描述信息（描述LSDB中LSA头部信息）
+ **LSR** 链路状态请求，向OSPF邻居请求链路状态信息
+ **LSU** 链路状态更新（包含一条或多条LSA）
+ **LSAck** 对LSU中的LSA进行确认

## OSPF三张表类型
### 邻居表（neighbor table）
+ OSPF用邻居机制来发现和维持路由的存在，邻居表储存了双向通信的邻居关系OSPF路由器列表信息。

### 拓扑表（topology table）
+ OSPF用LSA（link state Advertisement 链路状态通告）来描述网络拓扑信息，然后OSPF路由器用拓扑数据库来存储网络的这些LSA。

### OSPF路由表（routing table）
+ 对链路状态数据库进行SPF（Dijkstra）计算，而得出OSPF路由表。

## RouterID
+ 用于标识OSPF路由器的ID，全网唯一性；可手动配置，也可以动态选举（有Loopback接口时，选择最高的Loopback IP地址；否则，选择最高活跃物理接口的IP地址）。

> Router ID演示图![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/OSPF%20(5).png)
>

## DR和BDR
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/OSPF%20(12).png)

+ 为减小多路访问网络中的OSPF流量，OSPF会选举一个指定路由器（DR）和一个备用指定路由器（BDR）。
+ 选举规则：最高接口优先级被选作DR，如果优先级相等（默认为1），具有最高的路由器ID（Router-ID）的路由器被选举成DR，而且DR具有非抢占性
+ 指定路由器（DR）：DR负责使用该变化信息更新其他所有OSPF路由器（DRouter）
+ 备用指定路由器（BDR）：BDR会监控DR的状态，并在当前DR发生故障时接替其角色

## 建立邻接关系-Hello包
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/OSPF%20(10).png)

+ Hello包用来发现OSPF邻居并建立相邻关系，通过组播地址：224.0.0.5 发送给 ALLSPFRouters
+ 通告两台路由器建立相邻关系所必须统一的参数
+ 在以太网和帧中继网络等多路访问网络中选举指定路由器（DR）和备用指定路由器（BDR）

## OSPF metric
+ 每个路由器都把自己当作根，并且给予累积成本（Cost值）来计算到达目的地的最短路径。
+ Cost = 参考带宽（10^8）/接口带宽（b/s）

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/OSPF%20(11).png)

## LSA
### LSU
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/OSPF%20(1).png)

+ 路由器收到包含变化后的LSA的LSU后，更新自己的链路状态数据库，过一段时间（SPF延迟），对更新的链路状态数据库执行SPF算法，必要时更新路由表。

### LSA的泛洪-示例1
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/OSPF%20(2).png)

+ 路由器R3用224.0.0.6通知DR路由器及BDR的路由器
+ DR、BDR监听224.0.0.6这一组播地址

### LSA的泛洪-示例2
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/OSPF%20(3).png)

+ DR利用组播地址224.0.0.5通知其它路由器
+ 所有的OSPF路由器监听224.0.0.5这一组播地址

## OSPF区域
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/OSPF%20(8).png)

+ 在区域边界可以做路由汇总，减小了路由表
+ 减少了LSA泛洪的范围，有效的把拓扑变化控制在区域内，提高了网络的稳定性
+ 拓扑的变化影响可以只限制涉及本区域
+ 多区域提高了网络的扩展性，有利于组建大规模的网络

## 配置实践
### 基本配置
```plain
Router(config)# router ospf process-id #开启OSPF进程，process-id为进程id
Router(config-router)# network address wildcard-mask area area-id #宣告特定网络到OSPF区域
```

#### 通配符掩码
+ 通配符是一个用于决定哪些IP地址位该精准匹配（0代表精准匹配）那些地址为被忽略的32位数值，通常用于处理访问控制列表（ACL）、OSPF、EIGRP等路由协议的网络通告。

##### - 掩码</h5>
1位表示网络位；0位表示主机位。掩码用于区分IP地址中的网络及主机部分

##### - 通配符</h5>
1位表示无所谓；0位表示需要严格匹配。通配符用于决定一个IP中的哪些位应该匹配

### 基本配置 单区域-实例</h3>
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/OSPF%20(4).png)

```plain
Router(config)# router ospf 1
Router(config-if)# network 192.168.12.0 0.0.0.255 area 0
```

```plain
Router(config)# router ospf 1
Router(config-if)# network 192.168.12.0 0.0.0.255 area 0
Router(config-if)# network 192.168.23.0 0.0.0.255 area 0
```

```plain
Router(config)# router ospf 1
Router(config-if)# network 192.168.23.0 0.0.0.255 area 0
```

最后，使用` show ip ospf neighbor `命令，可以查看ospf配置是否成功配置生效。