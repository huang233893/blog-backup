---
title: EtherChannal详解
summary: >-
  酥米小机器人来啦，这篇文章主要详解EtherChannel技术其通过逻辑聚合多条物理链路提升带宽并实现负载均衡和冗余支持将多个物理接口视为单一逻辑接口同时支持Switch
  ports和Routed
  ports配置时需选择端口并确定使用PAgP或LACP协议通过channel-group命令设置组ID及接口模式如desirable或auto建立逻辑接口后可进一步配置实施要点包括port-channel接口一旦创建即形成逻辑接口后续配置在该逻辑接口中完成最多支持8个端口捆绑物理接口需保持speedduplex接口模式及VLAN配置一致负载均衡可基于MAC端口或IP地址默认采用源目IP地址对策略通过相关命令可查看和调整负载均衡方式
categories:
  - 思科
tags:
  - 网络
  - CCNP
cover: >-
  https://cdn.nlark.com/yuque/0/2024/png/44908083/1729210282296-45cab1db-f0cb-412a-9681-ea25c5371e44.png
date: 2024-11-21 09:01:46
---

<meta name="referrer" content="no-referrer" />

## 背景
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729210282296-45cab1db-f0cb-412a-9681-ea25c5371e44.png)

+ 解决方案提供更多的带宽对类似链路进行逻辑聚合
+ 看成一个逻辑链接
+ 提供负载平衡和冗余支持
+ 支持Switch ports和Routed ports

![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729210552290-923b722e-fa59-400d-8ad0-01aeeb5febe7.png)

## PAgP modes
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729211184779-0808aa71-e83c-42d3-a943-ba7fa545e288.png)

+ On	通道成员不协商(无协议)
+ Desirable	主动询问对方是否可以/将
+ Auto	被动等待对方询问
+ Off	未在接口上配置的 EtherChannel

## LACP modes
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729211269400-1daba43d-af56-4eec-96ee-5d97aee5b79c.png)

+ On	通道成员不协商(无协议)
+ Active	主动询问对方是否可以/将
+ Passive	被动等待对方询问
+ Off	未在接口上配置的 EtherChannel

### EtherChannel的配置
+ 选择用于Channel的端口
+ 选择PAgP或LACP
+ 在接口上配置channel-group
    - 设置channel-groupID
    - 根据特定的协议，选择接口模式完成
+ 上述步骤后，逻辑的etherchannel接口就建立好了。
    - 可以进一步对这个逻辑的etherchannel接口进行配置

## EtherChannel的实施要点
+ **Port-channel接口一旦建立完成后，就形成了一个个逻辑的接口，后续针对该接口的配置在port-channel逻辑接口中完成**
+ **最大支持8个端口做捆绑**
+ **Port-channel接口不能成为SPAN的目的接口**
+ **隶属于一个port-channel的物理接口需有相同的如下配置**
    - 相同的speed和duplex
    - 相同的接口模式(access、trunk)
    - 如果是trunk模式，那么native vlan及allowed vlan需相同
    - 如果是access模式，所属vlan需相同

## EC的负载均衡
![](https://cdn.nlark.com/yuque/0/2024/png/44908083/1729212993237-1a809b68-e3bc-4757-acee-38be5f7f66fe.png) 

+ EtherChannel支持在同一个port-channel的链路中执行负载均衡
+ 负载均衡动作可以基于MAC、端口、IP(源IP、目的IP或两者)
+ 默认的行为:源目IP地址对(src-dst-ip)

`Switch(config)# port-channelload-balance type`

`Switch# show etherchannelload-balance`

## EC的配置
```plain
Switch(config)# int range f0/1 - 2	#进入接口范围
Switch(config-if-range)# switchport	#将接口配置为二层接口
Switch(config-if-range)# switchport trunk encapsulation dot1q	#trunk封装协议为dot1q
Switch(config-if-range)# switchport mode trunk	#设置接口模式为Trunk模式
Switch(config-if-range)# channel-protocol pagp/lacp
Switch(config-if-range)# channel-group 1 mode desirable	#配置etherchannel，ID为1，模式为desirable
```