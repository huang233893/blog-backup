---
title: ACL基础
summary: >-
  酥米小机器人来啦，这篇文章介绍访问控制列表ACL的基础知识，ACL是一种由规则组成的集合，这些规则基于报文的源地址、目的地址、端口号等条件进行匹配，形成一种报文过滤器，用于实现网络流量控制和匹配感兴趣流量两大功能。ACL主要分为标准类型，仅根据源地址过滤整个协议套件；和扩展类型，能够根据源、目的地址、端口号等进行详细过滤并允许或拒绝特定协议。识别ACL可通过编号或命名方式，基础配置使用命令如access-list定义规则，并在接口上应用入站或出站方向，利用通配符实现精确或全匹配，从而在网络管理中提升安全性和效率，帮助管理员有效控制流量。
categories:
  - 思科
tags:
  - 网络
  - CCNA
cover: https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/ACL-image2be1cd78ae7434f9.png
date: 2024-10-17 15:01:46
---

## 简介
+ 访问控制列表ACL（Access Control List）是由一条或多条规则组成的集合。所谓规则，是指描述报文匹配条件的判断语句，这些条件可以是报文的源地址、目的地址、端口号等。
+ ACL本质上是一种报文过滤器，规则是过滤器的滤芯。设备基于这些规则进行报文匹配，可以过滤出特定的报文，并根据应用ACL的业务模块的处理策略来允许或阻止该报文通过。

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/ACL-image2be1cd78ae7434f9.png)

## 为什么要用ACL
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/ACL-image-1ff33b348f14d7bdf.png)

+ ACL的两大主要功能
+ 流量控制
+ 匹配感兴趣流量

## ACL的类型
### 标准访问控制列表
+ 检查源地址
+ 通常允许或拒绝整个协议套件

### 扩展访问控制列表
+ 检查源地址和目标地址
+ 通常允许或拒绝特定的协议和应用

### 用于识别标准ACL和扩展ACL的两种方法
+ 编号ACL使用一个数字来识别
+ 命名ACL使用描述性名称或数字来标识

### 标准访问控制列表
+ 只能根据源地址做过滤
+ 针对整个协议采取相关动作（允许或禁止）

![](https://img.picgo.net/2024/11/19/image-2575da0debcc560ea.md.png)

## 扩展访问控制列表
+ 能根据源、目的地地址、端口号等等进行过滤
+ 能允许或拒绝特定的协议
+ ![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/ACL-image-2575da0debcc560ea.png)

## ACL的标示
### IPv4 ACL
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/ACL-image-4ac2cc35cbdfcb46c.png)

## 出站及入站 
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/ACL-image-5e1632473fddc86b8.png)

### 入方向的ACL操作
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/ACL-image-6d383172498686b6a.png)

### 出方向的ACL操作
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/ACL-image-7042aa1fa1369eb38.png)

## 通配符
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/ACL-image-8a0301b67a2235fc3.png)

+ 0 表示严格匹配
+ 1 表示无所谓

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/ACL-image-93289ca2dec660a11.png)

### 通配符缩写
192.168.1.1 0.0.0.0			= host 192.168.1.1

+ 精确匹配192.16.1.1这个IP

---

0.0.0.0 255.255.255.255 		= any

+ 匹配所有ip

## 基础配置
```plain
Router(config)# access-list access-list-number {permit|deny} source [wildcard mask]
Router(config-if)# ip access-group access-list-number {in|out}
```

+ 编号选择1-99
+ 通配符若无，默认0.0.0.0
+ `no access-list _access-list-number_`将会删除整个ACL列表
+ 在接口中应用
+ 应用时关联入或出站方向
+ 默认出站
+ `no ip access-group _access-list-number_`可移除接口上应用的访问列表

```plain
Router(config)# access-list access-list-number {permit|deny} protocol source source-wildcard [operator port] destination destination-wildcard [operator port] [established] [log]
Router(config-if)# ip access-group access-list-number {in|out}
```

+ 在接口中应用
+ 应用时关联入或出站方向