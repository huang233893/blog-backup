---
title: DOD（TCP/IP）
summary: >-
  酥米小机器人来啦，这篇文章详细介绍了DOD的TCP/IP协议簇，这是一个由美国国防部开发的分布式开放系统互连模型，旨在确保数据传输的可靠性。文章首先概述了其四层结构：应用层提供电子邮件和文件传输等服务，传输层通过TCP协议进行可靠端到端通信或使用UDP协议的无连接传输，网际层负责IP地址分配、路由选择和数据包转发，物理层处理硬件设备间的通信和数据链路操作。接着，文章列出了关键协议如HTTP、FTP、SMTP、TCP、UDP、ICMP、ARP，并介绍了工具Ping和Traceroute用于网络诊断。还比较了TCP的三次握手机制与UDP的简单传输方式，突出TCP/IP协议簇在现代网络中的核心作用，强调其高效性和基础性。
categories:
  - 思科
tags:
  - 网络
  - CCNA
cover: https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/DoD%20(11).png
date: 2024-10-17 15:01:46
---

## 模型结构
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/DoD%20(11).png)

+ 4层：应用层
+ 3层：传输层
+ 2层：网际层
+ 1层：物理层

## 各层级作用详解
+ 4层： 与OSI模型中的应用层类似，为用户提供各种应用服务，如电子邮件、文件传输等</font>
+  3层：与OSI模型中的传输层类似，负责端到端之间的通信，处理数据包的分段与重组，以及数据传输的可靠性和正确性</font>
+  2层：在TCP/IP模型中相当于OSI模型的网络层，负责IP地址的分配和路由选择，实现不同网络之间的通信</font>
+  1层：负责物理硬件设备间的通信，包括数据链路的操作、错误检测和纠正等功能</font>

## 因特网层
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/DoD%20(8).png)

网络层也叫Internet层

+ 负责将分组报文从源端发送到目的端

网络层作用

+ 为网络中设备提供逻辑地址
+ 负责数据包的寻径和转发

### 因特网层协议
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/DoD%20(1).png)

### 因特网层的工具
+ Ping（ICMP）——测试ip与本机的连通性
+ Traceroute/Tracert ——追踪数据包的每一跳

### 因特网层ip报文
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/DoD%20(9).png)

+ 简称TTL，作用是放置一个数据包在网络中无休无止的进行传输

### ARP
ARP协议具有两种功能

+ 将IPV4地址解析为MAC地址
+ 维护映射的缓存

### ARP报文详解
+ IP与MAC的关联需要ARP配合实现
+ 思科中使用` show arp `查看arp表

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/DoD%20(2).png)

## 应用层
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/DoD%20(7).png)

### 常见应用的端口
+ HTTP 80端口
+ HTTPS 443端口
+ Telnet 23端口
+ FTP 20、21端口
+ SMTP 25端口
+ POP3 110端口
+ TFTP 69端口

## TCP/IP协议簇简解
+ 传输控制协议/IRI特网协议（TCP/IP）组是由关国国防部（DoD）所创建的，主要用来确保数据的完整性及毁灭战争中维持通讯
+ 是由一组不同功能的协议组合在一起构成的协议簇、
+ 利用一组协议完成OSI所实现的功能

### 各层级代表协议
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/DoD%20(3).png)

+ 4层：HTTP（Hypertext Transfer Protocol）、FTP（File Transfer Protocol）、SMTP（Simple Mail Transfer Protocol）
+ 3层：TCP（Transmission Control Protocol）、UDP（User Datagram Protocol）
+ 2层：IP（Internet Protocol）、ICMP（Internet Control Message Protocol）、ARP（Address Resolution Protocol）
+ 1层：：Ethernet、PPP（Point-to-Point Protocol）、ARPANET

## TCP & UDP
+ TCP（传输控制协议） 属于面向连接的网络协议
+ UDP（用户报文协议） 属于无连接的网络协议

### TCP到UDP
传统控制协议（TCP）

+ 面向连接
+ 可靠传输
+ 控流

用户数据报协议（UDP）

+ 无连接
+ 不可靠传输
+ 尽力传输

+ 使用TCP的应用：Web浏览器；电子邮件；文件传输程序
+ 使用UDP的应用：域名系统（DNS）；视频流；IP语言（VoIP）
+ 源端口随机分配，目标端口使用知名端口
+ 应用客户端使用的源端口号一般为系统中未使用的且大于1023
+ 目的端口号为服务器端应用服务的进程。如telnet为23

### TCP包结构
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/DoD%20(4).png)

### TCP的三次握手
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/DoD%20(10).png)

+ 1.设备1发送 SYN 包
+ 2.设备2收到了SYN包后再次发送回设备1带有ACK的包
+ 3.设备1收到SYN包后验证成功

### UDP包结构
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/DoD%20(5).png)