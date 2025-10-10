---
title: NAT基础
summary: >-
  酥米小机器人来啦，这篇文章介绍了NAT即网络地址转换于1994年被提出的技术，主要为了解决IPv4地址紧缺问题，通过将内部私有IP地址与公网IP地址对应，实现内部网络主机与外部网络通信，同时缓解IP地址不足但非永久解决方案，NAT技术的优点包括节省公有IP地址、解决网络地址重叠和避免重新编址，缺点则是破坏端对端IP追踪和导致一些应用层协议无法识别例如FTP，NAT分为静态NAT一对一转换、动态NAT从公共IP池中选择未使用地址转换以及端口复用PAT允许多个内部地址共享单一公网IP通过不同端口，私有空间地址包括A类10.0.0.0至10.255.255.255、B类172.16.0.0至172.31.255.255和C类192.168.0.0至192.168.255.255，NAT术语涉及内部本地外部本地内部全局和外部全局地址，基础配置示例包括静态NAT和动态NAT的命令行配置如ip
  nat inside source static命令和ip nat pool pool-name start-ip
  end-ip等，以及查看转换情况的show ip nat translations命令
categories:
  - 思科
tags:
  - 网络
  - CCNA
cover: https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/NAT%20(4).png
date: 2024-10-17 15:01:46
---

## 简介
即Network Address Translation，网络地址转换。于1994年被提出。当在专业网内部的一些主机本来已经分配到了本地IP地址（即在本专用网内使用的专用地址），但现在又想和因特网上的主机通信（不需要加密的）的时候，就可以使用NAT技术。
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/NAT%20(4).png)

## 为什么需要NAT
+ 主要为了解决IPv4地址紧缺的问题，通过将一个公网IP地址和多个私网IP相对应，从而解决IP地址不够用的情况，但是这种技术只是起到了缓解的作用，真正的方法还是得使用IPv6来解决。

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/NAT%20(5).pngg)

## NAT技术的优缺点
### 优点
+ 节省合法的公有的IP地址
+ 地址重叠时，提供一个较为完善的解决方法
+ 网络发生变化时，避免重新编址

### 缺点
+ 无法进行端对端的ip追踪（破坏了端对端通讯的平等性）
+ 很多应用层无法识别（例如FTP协议）

## NAT的三种类型
### 静态NAT
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/NAT%20(1).png)

+ 将内部本地地址与内部全局地址进行一对一的明确转换。这种方法主要用于内部网络中有对外提供服务的服务器，如WEB、MAIL服务器时。该方法的缺点是需要独占宝贵的合法IP地址。即如果某个合法IP地址已经被NAT静态地址转换定义，即使该地址当前没有被使用，也不能用作其他的地址转换。

### 动态NAT
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/NAT%20(2).png)

+ 动态地址转换也是将内部本地地址与内部全局地址进行一对一的转换。但是，是从内部全局地址池中动态地选择一个未使用的地址对内部本地地址进行转换。该地址是由未被使用的地址组成的地址池中在定义时排在最前面的一个。当数据传输完毕后，路由器将把使用完的内部全局地址放回到地址池中，以供其它内部本地地址进行转换。但是在该地址被使用时，不能用该地址再进行一次转换。

### 端口复用PAT
+ 复用地址转换也称为端口地址转换(PortAddressTranslation，PAT)，首先是一种动态地址转换。路由器将通过记录地址、应用程序端口等唯一标识一个转换。通过这种转换，可以使多个内部本地地址同时与同一个内部全局地址进行转换并对外部网络进行访问。对于只申请到少量IP地址甚至只有一个合法IP地址，却经常有很多用户同时要求上网的情况，这种转换方式非常有用
+ 理想状况下，一个单一的IP地址可以使用的端口数为4000个

## 私有空间地址
+ A类：10.0.0.0 - 10.255.255.255
+ B类：172.16.0.0 - 172.31.255.255
+ C类：192.168.0.0 - 192.168.255.255

## NAT术语
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/NAT%20(3).png)

+ 内部本地——转换之前内部源地址的名字
+ 外部本地——转换之前目标主机的名字
+ 内部全局——转换之后内部主机的名字
+ 外部全局——转换之后外部目标主机名字

## 基础配置
```plain
Router(config)# ip nat inside source static local-ip global-ip
Router(config)# ip nat inside
Router(config)# ip nat outside
Router# show ip nat translations #查看配置情况
```

```plain
Router(config)# ip nat pool name start-ip end-ip {netmask netmask | prefix-length prefix-length}
Router(config)# access-list access-list-number permit source [source-wildcard]
Router(config)# ip nat inside source list access-list-number pool name
Router# show ip nat translations #查看配置情况
```

```plain
Router(conflg)# access-list access-list-number permit source source-wildcard
Router(config)# ip nat inside source list access-list-number interface interface overload
Router# show ip nat translations #查看配置情况
```