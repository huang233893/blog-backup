---
title: Linux RAID
categories:
  - 系统类
tags:
  - Linux
  - 指令
cover: >-
  https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/OIP-C2162cc7fc5c709d0.jpg
summary: >-
  酥米小机器人来啦，这篇文章介绍了Linux系统中RAID的常见类型及其优缺点，包括RAID 0提升速度但无数据冗余，RAID
  1增强安全性但降低磁盘利用率，RAID 5平衡读写、安全与成本，RAID 10兼具RAID 0和RAID
  1优势但成本高。部署方面需使用mdadm命令创建RAID设备，通过选项如-a检测设备名称，-n指定数量，-l设定级别，-C创建阵列，-v显示过程，-f模拟损坏，-r移除设备，-x添加备份盘，并配合mkfs.ext4格式化阵列为ext4，创建挂载点后用mount挂载，通过df
  -h验证，将配置写入fstab实现开机自动挂载。故障处理时可使用mdadm -D检测状态，确保所有设备为active
  sync状态，模拟损坏后需添加新盘并等待同步，RAID 1和RAID 10支持热替换，RAID 5需重建阵列，备份盘可提升容错能力。
date: 2024-05-27 15:21:46
---

## 阵列基础策略
### RAID 0：
优点：有效提升硬盘数据的吞吐速度；
缺点：不具备数据备份和错误修复能力

### RAID 1：
优点：数据安全性增加；
缺点：磁盘设备读写速度降低，磁盘利用率降低，成本提高

### RAID 5：
优点：较为均匀的兼顾了读写速度，数据安全性，存储成本

### RAID 10：
优点：集合了RAID 0 和RAID 1的优点；
缺点：成本大幅提高

## 部署磁盘阵列：


- 使用命令mdadm 模式 RAID设备名称 选项 磁盘成员

### 选项：
- -a：检测设备名称
- -n：指定设备数量
- -I：指定RAID级别
- -C：创建
- -v：显示过程
- -f：模拟设备损坏
- -r：移除设备
- -Q：查看摘要信息
- -D：查看详细信息
- -S：停止RAID磁盘阵列
- -x：有备份盘，后接备份盘数量

例：`mdadm -Cv /dev/md0 -a yes -n 4 -l 10 /dev/sda ...`


用命令mkfs将制作好的磁盘阵列格式转化为ext4格式：

- mkfs.ext4 RAID文件
- 创建文件夹用于挂载阵列文件
- 用mount挂载
- 可用`df -h`查看是否成功
- 将其加入到磁盘配置文件中使其永久生效：
- 可使用重定向或直接进入vim编辑

输入以下内容：
```bash
磁盘文件         /RAID        ext4           defaults           0  0
```


- 在RAID 1和RAID10中若一个磁盘损坏可直接添加磁盘后用命令
`mdadm 磁盘阵列 -a 新增磁盘`
- 在使用mdadm 磁盘阵列 -D检测磁盘阵列
- 全都为active sync即为成功
- 若不为可等待一会，可能是它在往新磁盘同步数据



### 模拟磁盘损坏：
`mdadm 磁盘阵列 -f 损坏的磁盘`



### 磁盘阵列+备份盘
指令示例：

`mdadm -Cv /dev/md0 -a yes -n 3 -l 5 -x 1 三个组成阵列的磁盘 一个备份盘`