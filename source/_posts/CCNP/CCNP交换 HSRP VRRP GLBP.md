---
title: HSRP & VRRP & GLBP
summary: >-
  酥米小机器人来啦，这篇文章介绍了HSRP VRRP
  GLBP三种网关冗余协议技术背景指出网络网关或关键节点故障会导致业务中断链路失效无法检测会威胁稳定性HSRP通过同一LAN内多个路由器协同工作仅一个处于Active状态共享虚拟IP地址作为主机默认网关Active路由器负责数据转发和ARP响应备份路由器监听状态并准备接管虚拟路由器MAC地址采用0000.0c07.acxx格式xx为组ID状态机包括初始化学习发报坚守活跃状态HSRP版本1和2区别在于组ID范围虚拟MAC地址以及Hello包发送地址配置需注意组ID和虚拟IP一致性优先级默认100track功能可跟踪接口状态变化优先级调整preempt命令允许抢占主控权确保网络高可用性
categories:
  - 思科
tags:
  - 网络
  - CCNP
cover: >-
  https://cdn.nlark.com/yuque/0/2024/png/44908083/1729500335707-435129c9-bd7e-4f38-b119-d5de25de2a06.png
date: 2024-11-21 09:01:46
---

<meta name="referrer" content="no-referrer" />

## 技术背景
+ 一旦网络网关或关键节点出现故障，将对业务造成灾难性故障
+ 链路失效无法检测，业务稳定性受到威胁

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729500335707-435129c9-bd7e-4f38-b119-d5de25de2a06.png)

## HSRP部分
### HSRP带来了什么？
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729509362499-499539a3-5928-4791-9d99-59e51b53948f.png)

+ 利用HSRP，一组路由器(同一个LAN中的接口)协同工作，但只有一个处于Active状态。在一个HSRP组内的多个路由器共用一个虚拟的IP地址，该地址被作为局域网内所有主机的缺省网关地址
+ HSRP决定哪个路由器被激活，该被激活的路由器负责接收发过来的数据包并进行路由。以及相应PC对于其网关的ARP请求
+ 备份路由器侦听active路由器的状态，并准备随时接替Active router的工作

### HSRP名词
+ HSRP路由器
    - 运行HSRP的路由器，一台HSRP路由器（的接口）可同时参与到多个HSRP组中，在不同的组中，一台HSRP路由器可以充当不同的角色
+ HSRP组
    - 由多个HSRP路由器组成，属于同一HSRP组的HSRP路由器互相交换信息，每一组由一个组ID进行标识
+ 虚拟路由器
    - 对于每一个HSRP组，抽象出来的一个逻辑路由器，该路由器充当网络用户的网关
+ 虚拟IF地址、MAC地址
    - 用于标识虚拟的路由器，该地址实际上就是用户的默认网关
    - MAC地址为虚拟的
+ Active、Standby路由器
    - Active路由器：就是在HSRP组实际转发数据包的路由器，在每一个VRRP组中，仅有Active响应对虚拟IP地址的ARP请求
    - Standby路由器：就是在HSRP组中处于监听状态的路由器，一旦Active路由器出现故障，Standby路由器就开始接替工作
    - 选举依据：HSRP接口优先级和接口IP地址（比大）

### 虚拟路由器MAC地址
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729510085320-82db06f3-14f2-4a97-858e-175ce2ce09da.png)

+ HSRP使用一个格式为： 0000.0c07.acxx的MAC作为虚拟路由器的MAC，其中xx是该HSRP组的组ID

### Active / Standby Router
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729510204882-1d45a331-3678-400a-bbd7-2025306e8adc.png)

+ Active Router
    - 响应底下PC对网关的ARP请求(使用虚拟MAC响应)
    - 承担实际的流量转发任务
    - 周期性发送Hello包以告知自己的存活情况
+ Standby Router
    - 侦听Active router发送的hello包
    - 当Active Router出现问题的时候接替它的位置，成为Active router

### HSRP状态机
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729510296618-b22b16a8-8238-4639-94bf-3a9dbcb27855.png)

Initial（初始化状态）——Listen（学习状态）——Speak（发报状态【打招呼模式】）——Standby（坚守状态）——Active（活跃状态）

### HSRP version
+ HSRP version1（默认）
    - 组ID范围：0-255
    - 虚拟MAC：0000.0c07.acxx
    - Hello包发送到224.0.0.2
+ HSRP version2（要看具体的IOS版本）
    - 组ID范围：0-4095
    - 虚拟MAC：0000.0C9F。Fxxx
    - Hello包发送到224.0.0.102
    - HSRP v1及v2的报文类型不同
    - Standby 1 version 2

### HSRP的配置
#### 基础配置
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729510472919-88f35300-8cdb-4884-a07c-ff8322cf0a63.png)

+ 接口HSRP优先级默认为100
+ 要注意HSRP group ID必须一致、虚拟IP必须一致

```plain
Interface fast0/0
ip address 10.1.1.253 255.255.255.0
no shutdown
standby 1 ip 10.1.1.254	#虚拟IP
standby 1 priority 120	#优先级
```

```plain
Interface fast0/0
ip address 10.1.1.252 255.255.255.0
no shutdown
standby 1 ip 10.1.1.254
```

#### HSRP track
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729510845997-404129ea-46c6-4676-9a0b-55971f01f2a8.png)

+ HSRP的track特性允许我们跟踪某个本地接口的up/down，当接口down掉后，HSRP自动减去一个自定义的值，从而让standby设备顶上

```plain
Interface fast0/0
ip address 10.1.1.253 255.255.255.0
no shutdown
standby 1 ip 10.1.1.254
standby 1 priority 120
standby 1track serial 1/0 30
```

```plain
Interface fast0/0
ip address 10.1.1.252 255.255.255.0
no shutdown
standby 1 ip 10.1.1.254
standby 1 preempt
```