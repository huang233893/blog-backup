---
title: STP高级
summary: >-
  酥米小机器人来啦，这篇文章介绍了STP高级主题的核心内容，涵盖技术背景如单链路故障和环路问题，通过生成树协议提供冗余和拓扑适应。主要讨论了STP标准包括802.1D、PVST+、RSTP和MSTP，以及操作过程涉及根桥选举、根端口和指定端口选择，端口状态如Blocking和Forwarding。重点强调了拓扑变更处理机制，如TCN
  BPDU的使用，以及RSTP相比传统STP更快收敛的优势，实现了从Listening到Forwarding的快速过渡。本文还提到了Cisco的工具如Portfast、BPDU
  Guard、Root Guard，用于端口优化和安全，确保网络稳定性，并提供了详细的配置命令和示例。
categories:
  - 思科
tags:
  - 网络
  - CCNP
cover: >-
  https://cdn.nlark.com/yuque/0/2024/png/44908083/1728646455824-e63f2ae6-4209-407f-9b5d-2350fc785fc8.png
date: 2024-10-17 15:01:46
---

<meta name="referrer" content="no-referrer" />

## STP基础部分
### 技术背景
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728646455824-e63f2ae6-4209-407f-9b5d-2350fc785fc8.png)

+ 接入层交换机单链路上联，存在单链路故障
+ 物理链路冗余，解决了单链路故障问题，但是二层环境存在环路
+ 另一个问题的单点故障，如果任意一个汇聚设备宕机，将直接导致下联的接入网络挂掉

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728991853223-aeb82855-6fc2-4071-a881-6ef8cea0a009.png)

+ 生成树可以有效的解决这个问题
+ 通过生成树协议，在逻辑上将特定端口进行block，从而实现物理上存在冗余环境，而二层又阻止环路的产生
+ 当拓扑发生变更的时候，生成树协议能够探测这些变化，并且及时自动的调整接口状态，从而适应网络拓扑的变化，实现链路冗余

### 生成树的标准
+ 802.1D
+ **<font style="color:#DF2A3F;">PVST+ 思科Cisco私有协议，每个VLAN拥有一颗单独的生成树实例</font>**
+ **<font style="color:#DF2A3F;">802.1W RSTP</font>**
+ **<font style="color:#DF2A3F;">802.1S MSTP</font>**
+ PVRST+ Cisco私有，对RSTP的增强版

### STP的操作
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728992604910-8b3f979a-e693-4e7e-9bf2-931a2daaa69c.png)

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728992769109-d61b90f4-6537-495c-b1bf-23419d750677.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_404%2Climit_0)

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728993147373-c6c3f19e-038f-4f1b-a1b7-a3c112d6141f.png?x-oss-process=image%2Fformat%2Cwebp)

+ 每个广播域选择一个根桥
+ 每个非根桥上选择一个根端口
+ 每个段选择一个指定端口
+ 选择一个非指定端口
    - 根端口：具有最低根路径的接口要考虑的因素：
    - 1.最低根桥ID
    - 2.到根桥的最低路径成本
    - 3.最低的发送者网桥ID
    - 4.最低的发送者端口ID

### 端口的状态
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728993578313-21b82a1c-9151-47a9-b82f-ff5f9eb9e944.png)

+ Disable		不收发任何报文
+ Blocking		不接受也不转发帧，接收但不发送BPDU，不学习MAC地址
+ Listening		不接受也不转发帧，接收并且发送BPDU，不学习MAC地址
+ Learning		不接受也不转发帧，接受并且发送BPDU，学习MAC地址
+ Forwarding	接受并转发帧，接受并且发送BPDU，学习MAC地址

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728993852668-c4c616b2-00e0-47a0-b0ee-a1affc05056a.png)

### STP 拓扑变更
+ TCN BPDU概述
+ 当网络拓扑出现变更的时候，最先意识到变化的交换机将发送TCN BPDU
+ 在发生以下时间时，交换机将发送TCN：
    - 对于正在处于转发和监听状态的接口，过渡到Block状态（链路故障的情况）
    - 端口进入转发状态，并且网桥已经拥有指定端口
    - 非root网桥在它指定的端口收到TCN

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728994204949-b55797be-552d-4227-9276-c7fbaea939b4.png)

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728994221639-299017dc-8cba-42b7-badd-7c7c28a0e771.png)

+ 1. SwitchA挂掉
+ 2. SwitchB最先检测到拓扑变化，于是产生TCNBPDU并从根端口发送出去(因为根端口是朝着根桥的方向)，B将连续发送TCN BPDU直到指定交换机C发送TCNACK进行确认
+ 3. SwitchB收到这个TCN BPDU，回送一个TCN ACK进行确认，同时向自己的根端口转发这个TCN BPDU
+ 4. Root收到这个TCN，回送一个TCN ACK给C
+ 5. Root修改自己的配置BPDU，以此来通告整个交换网络关于拓扑变更的情况。Root在配置BPDU中设置一段时间的拓扑变更(TC标志)，这段时间等于转发延迟+Max.Age，默认35S
+ 6. 当交换机收到Root发出的这个TC标志置位的配置BPDU，它们使用转发延迟计时器(默认15S)来更新其MAC地址表中的条目。也就是说条目的寿命由原来的300S的默认值变成15S，这样能保证MAC地址条目更快速的刷新。交换机将持续这个过程，直到不再从Root收到TC BPDU消息为止。

## PVST+
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728994621909-130e73a6-de80-47ad-ac46-64d0b5b29a38.png)

### 扩展的SystemID
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728994870216-a6eb1a0d-74e6-4cab-ad8c-b2e3003d0e4b.png)

+ CISCO CATALYST交换机的MAC地址池最多可以容纳1024个地址，交换机的型号决定了可用MAC的数目，并不是所有catalyst交换机都能支持到这么多个MAC
+ 这些MAC地址作为VLAN生成树中的网桥ID的MAC地址部分。不同的交换机型号支持不同的可用MAC地址数目。交换机依照次序分配MAC地址
+ `Show run int | include bia`能看到所有的MAC，其中第一个MAC将被生成树使用，也就是CPU的MAC。接下去就是每个以太网接口的MAC。
+ 我们知道交换机能够支持的VLAN的数据是很庞大的，如果开启PVST+，每个VLAN-棵生成树，而没棵生成树都要有一个独立的标识，都需要耗费一个MAC的话，那么MAC地址池肯定是无法承受的。
+ 因此需要使用到MAC地址缩减方案

### Portfast
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729039809369-9c40389d-88da-496d-bca9-25a6d6234403.png)

+ 在交换机上，将连接主机的接口配置为portfast
+ Portfast接口可以绕过listening和learning状态直接进入forwarding状态


## RSTP
### 概述
+ 802.1w
+ 端口角色：根端口、指定端口、替代端口、备份端口
+ 端口状态：转发、丢弃、学习
+ 在思科catalyst交换机上，pvst+（pvrst+）是基于RSTP实现的perVLAN版本

### BPDU
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729044484996-3b6cd7be-f733-4168-9777-129aea9b5f10.png)

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1728992801739-4802c0b8-889f-443f-829d-086fd6a3fd90.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_750%2Climit_0)

+ 00	未知
+ 01	替代/备份
+ 10	根端口
+ 11	指定端口

### BPDUs检测过程
![](https://cdn.nlark.com/yuque/0/2024/jpeg/44908083/1729045900649-8fc37524-c7fb-439f-b6ab-d3c728338bb8.jpeg)

+ B丢失了到Root的路径
+ 认为自己是Root
+ 于是发送“我就是Root”的次优BPDU

![](https://cdn.nlark.com/yuque/0/2024/jpeg/44908083/1729046055735-49f106e1-3921-4aa5-a6a3-a057c15dee87.jpeg)

+ C知道Root还活着
+ 立即发送包含Root信息的BPDU给B
+ B接受BPDU，并且把连接C的接口设定为根端口

### BPDUGuard
+ 该接口收到BPDU报文后，会立即切换到err-disable状态
+ 常搭配portfast特性在接口上一起使用，用于连接主机
+ 可在接口上激活，也可在全局模式上配置，两者有所不同

### 边缘端口edge-ports
![](https://cdn.nlark.com/yuque/0/2024/jpeg/44908083/1729123357180-16fc75cb-fb7f-4044-a7d7-c22dc6304f23.jpeg)

+ RSTP定义的端口类型与postfast十分类似
+ 因为这些接口用于连接主机，所以一般不会产生环路。这写端口可以跳过LST或LRN直接过渡到转发状态
+ 而且当这这些接口up down的时候不会引起拓扑变更
+ 另外，边缘端口收到BPDU，则立即丢失边缘端口的特征，变成一个普通的Spanning Tree接口
+ 在catalyst交换机上，可以用postfast关键字来进行手工配置

### Rapid Transition to Fowarding State
![](https://cdn.nlark.com/yuque/0/2024/jpeg/44908083/1729124004050-d0224907-d9d7-40ae-adfa-a6b2fd9994e7.jpeg)

+ RSTP能够在边缘端口及P2P链路上快速过度。
+ RSTP的链路类型是通过接口的双工状态自动获取到的，如果接口时半双工，那么链路类型是shared port，如果是全双工那么就是p2p。
+ 当然，接口的链路类型可以通过命令修改，接口模式下：`spanning-tree link-type ？`

#### 链路类型
+ P2P（点对点）
+ shared port（共享端口） 

收敛对比：802.1D
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729124300768-b593c142-1bfe-4859-a852-dbc976dad390.png)

+ A及Root之间新增链路Link1
+ A及root在link1两端的接口都进入Listening状态，A将收到Root发出来的BPDU
+ A将BPDU从自己的指定端口发送出去，BPDU被泛洪到网络中
+ B和C收到这个更优的BPDU，继续向网络中泛洪
+ 数秒后，D收到这个BPDU，Block掉端口P1

Tips：**<font style="color:#DF2A3F;">由于缺乏feednack机制，A连接root的接口从listening到Forwarding，需要经历15*2s的延迟。此时A、B、C下联的用户流量就出现了问题（因为D收到更优的BPDU后，将P1口block了，这时候ABC相当于在A的根端口过渡到forwarding之前都处于网络的“隔离地带”）</font>**

### 收敛对比：RSTP
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729124922667-c1a64149-b6c9-4514-9853-820ffa2b3a3e.png)

+ A及Root之前新增链路Link1

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729124961966-9914c0a0-fd55-4c36-aa6f-36f73a56c1c3.png)

+ A及Root在Link1两端的接口在up之后进入designated blocking。然后双方交互BPDU消息。这个过程实际上是一个协商的过程

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729125063559-0f3a0c30-32df-4e60-a446-c1f2a3ca47dd.png)

+ A在收到Root发送的BPDU后，将自己的所有非边缘端口Block（这个过程称为同步sync），并且回送一个agreement消息给Root
+ 在此之后，Root及A在link1上的端口立即都过渡到转发状态。而网路目前是没有环路的，A往下的网路目前是切断的

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729125279663-95c22911-ebd8-44ab-b706-67c5fab68886.png)

+ A与B和C之间，开始一轮新的协商，BC收到A发送的bPDU后，完成同步Sync过程，将自己的非边缘端口Block掉，然后都向A回送agreement信息。同时ABC互联的接口进入转发状态。在BC同步操作的过程中，B下联全是主机，因此没有端口被Blcok（已经完成同步）；而C要block掉连接D的端口

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729125689365-ecd8155a-fb87-4009-82a9-c104aafbd310.png)

+ 完成上一步后，生成树状态如图
+ 最终BPDU到达D，D将P1口Block掉

Tips：

**<font style="color:#DF2A3F;">在RSTP收敛过程中，耗费是时间仅仅是BPDU从Root泛洪到网络末端的时间，不用受到任何Timer的限制，直接绕过两个转发延迟时间。因此收敛速度更快。</font>**

+ 有两点需注意:
    - 交换机之间的这种协商机制只在P2P链路上被执行
    - 边缘端口的配置非常重要，如果配置不当有可能会在同步过程中被BLOCK。

### Proposal/Agreement Squence
![](https://cdn.nlark.com/yuque/0/2024/jpeg/44908083/1729126908014-9ffda30f-cba3-4c31-8607-345dbd34c1e9.jpeg)![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729126942017-56bd8d43-41d8-457f-a4c2-18f7ec77ea7c.png)

**<font style="color:#DF2A3F;">Root和A之间新增了一条链路，链路两端的接口在收到对方发送的BPDU前是designated blocking状态</font>**

+ 当一个被选举为指定端口的接口在discarding或learning状态(目只在这个状态)，它在其发送的BPDU中进行proposalbit置位。这就是步骤1的P0的情况

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729127237066-9878cdaa-4a0b-46a8-b820-0687f9cb411e.png)

+ 在A完成同步后，A就可以将新选出的根端口unblock并且发送一个agreement消息给Root。这个agreement消息是A的proposal消息的拷贝，但是agreement bit置位了。
+ 如此一来，P0就收到了应答，立即转为forwarding。注意这时候P3接口仍处于designateddiscarding状态，于是它向它的邻居网桥去发送proposal，而且也在积极等待回传的agreement以便进入forwarding状态

## Cisco STP toolkit
+ Portfast
+ BPDUGuard
+ BPDUFilter
+ UplinkFast
+ BackboneFast
+ RootGuard
+ LoopGuard
+ UDLD

## 基础配置
```plain
Switch(config)# spanning-tree vlan-id		#激活特定VLAN的stp
Switch(config)# spanning-tree vlan vlan-id priorty pri		#配置桥优先级，这里注意是perVLAN的，优先级默认3
Switch(config)# spanning-tree vlan vlan-id root {primary | secondary} [diameter diameter] #设置主根次根，该交换机在默认优先级的状态下vlan优先级为24576，如果是secondary，则为28672
```

```plain
Switch(config-if)# spanning-tree [vlan vlan-id] cost cost
Switch(config-if)# spanning-tree [vlan vlan-id] post-priority pri
Switch(config)# spanning-tree [vlan vlan-id] hello-time sec
Switch(config)# spanning-tree [vlan vlan-id] forward-time sec
Switch(config)# spanning-tree [vlan vlan-id] max-time sec
```

```plain
Switch(config)# spanning-tree postfast default
Switch(config-if)# spanning-tree portfast [trunk]
```