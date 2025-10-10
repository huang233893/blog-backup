---
title: OSI基础
summary: >-
  酥米小机器人来啦，这篇文章介绍了OSI模型的基础，该模型是开放式系统互连的体系，共有7层，每层负责特定功能和提供服务：应用层为用户提供各种应用服务如文件传输、电子邮件等；表示层负责数据的格式化、加密和压缩，确保数据可读性和互操作性；会话层管理用户会话的建立、维护和结束，保持数据传输顺序完整性；传输层处理端到端通信，包括数据包分段重组和可靠传输；网络层根据网络地址进行路由选择，实现不同网络间通信；数据链路层将比特流转化为数据帧，涉及物理地址寻址、错误检测和纠正；物理层负责传输原始比特流，关注硬件设备间的数据交互。同时文章简要列出各层的代表协议，如应用层包括HTTP、FTP、SMTP，表示层涵盖SSL/TLS、JPEG、ASCII，会话层如NetBIOS、RPC，传输层有TCP、UDP，网络层包括IP、ICMP、ARP，数据链路层如PPP、HDLC、MAC，物理层则涉及Ethernet、Token
  Ring、RS-232。
categories:
  - 思科
tags:
  - 网络
  - CCNA
cover: https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/image512f7952defa3ef1.png
date: 2024-10-17 15:01:46
---

---

## 模型结构
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/image512f7952defa3ef1.png)

---

## 各层级作用详解
+ **7层**	为用户提供各种应用服务，如文件传输、电子邮件等，是用户直接接触的层级
+ **6层**	负责数据的格式化、加密和压缩，确保数据的可读性，以及在不同系统间的互操作性
+ **5层**	管理用户会话的建立、维护和结束，确保数据传输的顺序和完整性
+ **4层**	负责端到端之间的通信，处理数据包的分段与重组，以及数据包的传输可靠性和正确性
+ **3层**	根据数据包的网络地址进行路由选择，实现不同网络之间的通信
+ **2层**	 负责将比特流转化为具有意义的数据帧，同时进行物理地址寻址、错误检测和纠正等
+ **1层**	负责传输比特流，主要关注硬件设备间如何传输数据

---

## 各层级代表协议
+ **7层**	HTTP（Hypertext Transfer Protocol）、FTP（File Transfer Protocol）、SMTP（Simple Mail Transfer Protocol）
+ **6层**	SSL/TLS（Secure Sockets Layer/Transport Layer Security）、JPEG、ASCII
+ **5层**	NetBIOS（Network Basic Input/Output System）、RPC（Remote Procedure Call）
+ **4层**	TCP（Transmission Control Protocol）、UDP（User Datagram Protocol）
+ **3层**	IP（Internet Protocol）、ICMP（Internet Control Message Protocol）、ARP（Address Resolution Protocol）
+ **2层**	PPP（Point-to-Point Protocol）、HDLC（High-Level Data Link Control）、MAC（Media Access Control）
+ **1层**	Ethernet、Token Ring、RS-232