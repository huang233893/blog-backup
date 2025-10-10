---
title: Linux 服务器指令基础
categories:
  - 系统类
tags:
  - Linux
  - 指令
cover: >-
  https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/OIP-C2162cc7fc5c709d0.jpg
summary: >-
  酥米小机器人来啦，这篇文章系统梳理了Linux服务器的基础指令与操作，涵盖文件目录管理、软件源配置、定时任务、网络操作及磁盘指令等核心内容。基础指令部分介绍pwd、ls、cd、mkdir、touch、chmod、rm等常用命令，以及关机重启指令shutdown与reboot，还包含命令搜索、别名设置、历史记录等功能。软件源配置区分RPM/YUM与DEB/APT系统，提供更新安装方法。定时任务涉及crontab的安装配置与任务添加，网络操作包括ip配置、防火墙设置及流量控制，磁盘指令详解mount、umount和fstab配置，帮助用户快速掌握Linux服务器基础运维技能。
date: 2024-05-27 15:21:46
---

## 基础指令
```bash
查看文件目录：pwd
查看当前目录下的所有目录和文件：ls
查看当前目录下的所有目录和文件（包括隐藏的文件）：ls -a
列表查看当前目录下的所有目录和文件（列表查看，显示更多信息），与命令"ll"效果一样：ls -l
查看指定目录下的所有目录和文件：ls /xxx/xxx
进入文件目录：cd
进入根目录：cd /
进入当前用户目录：cd ~
退出目录：cd ..
```

```bash
创建文件夹：mkdir
创建文件：touch
设置权限：chmod xxx [文件目录]
删除文件：rm [文件名]
删除文件夹：rm -rf [文件目录]
```

```bash
立刻关机：shutdown -h now 或者 poweroff
两分钟后关机：shutdown -h 2
立刻重启：shutdown -r now 或者 reboot
两分钟后重启：shutdown -r 2 
```

```bash
type：查看指令信息
alias 【别名】=‘原命令’：为原命令起别名（unalias 【别名】：删除该别名）
vim /root/.bashrc：对当前用户设置永久别名
vim /etc/bashrc：对所有用户设置永久别名
man xx：查看xx命令的帮助（详细信息）（按q退出）{内容详情：（name：内容的名称）（synopsis：参数的大致使用方法）（descriotion：介绍说明）（examples：演示）（overview：概述）（defaults：默认的功能）（option：具体的可用选项）（environment：环境变量）（files：用到的文件）（see also：相关资料）（history：维护历史与联系方式）}
history：显示历史执行过的命令（使用！编码数字可以重复执行一次该编码的命令）
history -c：清空所有命令的历史记录
```

```bash
ctrl+r：快速搜索某命令
！$：引用上一个命令的参数
！【关键词】：重复上一个有此关键词的命令并执行
【命令1】 && 【命令2】：先执行命令1后执行命令2，若命令1执行失败则不会执行命令2
which 【命令】:查看命令所在的绝对路径
```
```bash
sudo配置：（使用户a在xxx主机上可以以用户b的身份执行命令)
用vim进入/etc/sudoers
在末行按格式输入：用户a 主机=（用户b） 命令
例子：user2 ALL=（ALL）ALL,!/usr/bin/passwd：使user2在所有主机上都可以使用除passwd以外的所有命令
sudo的使用：sudo [完整的命令]
```
---

## 软件源配置
### 更新软件源：
RPM/YUM系：`yum -y update`
DEB/APT系：`apt -y update`



### 安装软件： 
RPM/YUM系：`yum -y install [软件名]`
DEB/APT系：`apt install -y [软件名]`



### 搜索相应软件包：（以 sl 软件包作例子）
RPM/YUM系：`yum search sl`
DEB/APT系：`apt search sl`


### rpm:(红帽软件包管理工具)
```bash
-i:安装，一般搭配vh
-U：升级
-v：输出详细详细
-V:校验软件包内的所有文件
-Va:校验所有安装的软件包
-h：输出哈希值
-e：卸载
-q [软件包名称]:查询
-qa：将所有rpm方式安装的软件全部列出
-qi：查询软件包详细信息
-ql：查询软件包相关目录和文件
-qf [文件的绝对路径]：反查某个文件关联的rpm包
```
---

## 定时任务
### 1.使用yum命令安装Crontab：
```bash
yum install vixie-cron 
yum install crontabs
注：vixie-cron软件包是cron的主程序；
crontabs软件包是用来安装、卸装、或列举用来驱动 cron 守护进程的表格的程序。
cron是linux的内置服务，但它不自动起来，可以用以下的方法启动、关闭这个服务：
/sbin/service crond start #启动服务
/sbin/service crond stop #关闭服务
/sbin/service crond restart #重启服务
/sbin/service crond reload #重新载入配置
```



### <font style="color:rgb(77, 77, 77);">2.查看Crontab状态：</font>
```csharp
service crond status
ntsysv #查看crontab服务是否已设置为开机启动
chkconfig –level 35 crond on #加入开机自动启动
```



### <font style="color:rgb(77, 77, 77);">3.添加定时任务：</font>
```ruby
crontab -e #编辑cron任务模式
i #默认文字编辑器为vim，按i字母键即可添加cron任务
30 3 * * * /usr/local/etc/rc.d/lighttpd restart #将命令代码放入，此命令意义为每天的03:30 重启apache
ESC #按ESC键退出编辑模式
:wq #键入:wq保存
service crond restart #重启crontab服务
```

---



## 网络操作基础指令
```bash
ifconfig [网卡名称] [参数]:查看网络配置（down：关闭网卡；up：开启网卡）（特别的,利用ifconfig修改ip地址：ifconfig [网卡名称] [ip地址] netmask [掩码],同时可用vim进入/etc/sysconfig/network-scripts直接修改ip地址等网卡信息)
修改后的网卡文件不会立即生效，需用命令：（nmcli connection up [网卡名称]）来重新连接网卡使配置生效
ping 网址：尝试连接该网站
```

```bash
scp （要传送文件的绝对路径）（传输给的用户)(传送用户的ip）（要传送目录的绝对路径):将文件直接发送给目标用户
```

```bash
nmcli：
nmcli c show:用于表示当前系统中所有的网络连接
nmcli c(=connection的简写) up [网卡名称]:启用connection（相当于ifup)
nmcli c down [网卡名称]:停止connection（相当于ifdown）
通过nmcil给[网卡名称]修改ip地址/掩码：nmcil connection modify [网卡名称] ipv4.address IP/掩码
防火墙设置：(在6.5系统中systemctl为service)
```


```bash
systemctl status firewalld firewalld.service查看防火墙状态
systemctl stop firewalld：关闭防火墙
systemctl start firewalld：开启防火墙
systemctl disable firewalld:开机自动关闭
systemctl enable firewalld:开机自动启动
systemctl is-enabled firewalld:检测防火墙是否为自启动
systemctl iptables stop:关闭网络防火墙
systamctl :列出所有的系统服务
systemctl list-units:列出所有的unit
systemctl network restart
```

```bash
wget [下载网址] -O [下载文件的存放位置]:从网络上下载文件
nslookup [需要解析的域名]：测试能否解析到对应ip地址
curl [选项] [url]：从url上下载文件，访问网页，发送请求，上传文件等(-X:指定http请求方法，后接get，post，put等；-F：直接指定post指令要上传的文件;-u：设置用户名和密码进行HTTP基本认证;-o：将下载的内容保存到指定文件中;-O：将下载的内容保存到当前目录下的文件中，文件名与服务器端文件名相同)
lsof -i:[端口号]:查看端口对应进程的状态，可用来判断端口是否可用
```

iptables：
链可用于限制流量通过
```bash
iptables -L：查看规则链
iptables -F：清空规则链
iptables -P INPUT DROP/ACCRPT：将input的默认策略设置为拒绝/同意
iptables -D num INPUT：删除input的第num条规则
在头部添加新策略：（-I改为-A则为在末尾添加）
iptables -I INPUT（处理流入数据包的结点） -p  tcp/udp(匹配协议）-s 需要限制的ip地址  --dport 端口号 -j  DROP/REJEC/ACCEPT（丢弃or拒绝or同意）
```


firewall:

firewall-cmd [参数为一般格式]

参数:
```bash
--get-default-zone   查询默认的区域名称
--set-default-zone=<区城名称>    设置默认的区域，使其永久生效
--get-zones         显示可用的区域
--get-services      显示预先定义的服务
--get-active-zones         显示当前正在使用的区域与网卡名称
--add-source=               将源自此IP或子网的流量导向指定的区域
--remove-sourCe=            不再将源自此IP或子网的流量导向某个指定区域
--add-interface=<网卡名称>          将源自该网卡的所有流量都导向某个指定区域
--change-interface=<网卡名称>            将某个网卡与区域进行关联
--list-all                                  显示当前区域的网卡配置参数、资源、端口以及服务等信息
--list-all-zones                     显示所有区域的网卡配置参数、资源、端口以及服务等信息
```

默认为运行时模式（rentime）重启后就会失效，可添加--permanent将改设置直接为永久生效，若设置永久生效需使用--reload使其立即生效

`firewall-cmd --add-service=[需要放行的服务]：很实用的命令，可用于放行所需的服务，如http（移除：add改为remove）（也可将服务改为端口，端口后要加/tcp或udp`

`firewall-cmd --add-rich-rule 'rule family=ipv4 source address=[需要同意/拒绝的主机的ip地址]/32 service name=[需要同意/拒绝的服务] reject/accept'同意/拒绝):拒绝来自该ip地址主机的流量对http服务的访问`

若无法操作则按以下格式输入

`firewall-cmd --zone=external --add-rich-rule 'rule family=ipv4 source address=192.168.10.11/32 service name=ssh accept'`

`firewall-cmd --add-rich-rule 'rule family=ipv4 source address [需要同意/拒绝的网段，第四位为0] /24 port port [端口号范围，如20-22] protocol tcp/udp drop/accept/reject'拒绝来自该网段的流量对该范围端口的访问`

`firewall-cmd --add-rich-rule 'rule family=ipv4 source address=[需要同意/拒绝的网段] protocol value=icmp accept/reject'：过滤来自该网段的icmp探测，即让该网段无法ping通（不输入family....网段即为拒绝所有网段)`

---

## 磁盘基础指令
### mount 磁盘文件 
- 挂目录：将磁盘临时挂载在目标路径上，重启后失效
- 若要永久挂载需按格式将内容输入到/etc/fstab中
- umount 挂载点/磁盘文件：撤销已经挂载的磁盘文件



### fdisk 磁盘管理工具：
#### 参数:
```bash
m:查看全部可用的参数
n：添加新的分区
d：删除某个分区信息
l：列出所有可用的分区类型
p：查看分区信息
w：保存并推出
q：不保存直接退出
```

加入新磁盘后一定要设定分区后格式化

设定分区流程：
```bash
fdisk 磁盘文件路径（在/dev下）
q查看设备内已有的分区信息
n尝试添加新的分区
p创建主分区
输入1后enter回车
创建一个磁盘分区，格式为+numG，num为数字
p来查看分区信息
w保存退出
file 磁盘文件路径
若输出不是block special则输入
partprobe手动同步，连续执行两次该命令效果会更好
```


### mkfs格式化工具：
mkfs后跟文件类型，这里我们用mkfs.xfs
使用mkfs.xfs 磁盘文件路径

创建一个文件，用mount将该磁盘挂载到该文件下
使用`df -h`查看是否成功



lsblk:查看系统已经挂载的块设备和挂载点
df -h/mount:查看当前系统已经挂载的文件系统及其挂载点
du 选项 文件:查看文件占用了多大的硬盘空间



### 磁盘配额:
对每个用户可使用的磁盘空间和创建最大文件个数进行限制
进行配置前需先进行以下操作
进入/etc/fstab在/boot /xfs后的参数defaults后添加,uquota
作用是让磁盘支持uquota技术
保存退出后重启
可用`mount | grep boot`查看是否成功配置
为了更好的显示效果可使用`chmod -Rf o+w /boot`为所有人赋予写入权限



#### 命令：
`xfs_quota -x -c 'limit bsoft=（需要软限制的大小，以m为单位）（空格）bhard=（需要硬限制的大小，以m为单位）(空格）isoft=（inode 的软限制数量）（空格）ihard=（inode的硬限制数量）（需要操作的用户）'  （需要操作的文件夹）`
配置用户对指定文件夹的限额，其中所有参数不可更改



`dd if=/dev/zero of=/（路径） bs=（需要创建的文件大小，以m为单位） count=（要复制的块数，即为inode数）`
创建文件并用零字节将其填至指定大小，并复制指定数量的块



`edquota -u/g 用户/组`
在已经使用xfs_quota指令配置过限额后才可使用，在其中可修改配额





### 软硬链接：
#### 软连接：
近似于创建源文件的快捷方式，源文件删除后该软链接也无法打开了

#### 硬链接：
直接指向磁盘中的存储位置，会增加文件的inode数，源文件删除后依然可以使用

`ln 选项 源文件 链接文件 创建链接（选项为-s时为软连接，不加默认为硬链接）(其中链接文件不可提前创建否则会报错）（-f：强制创建文件或目录的链接，加了此参数可以无需在意是否提前创建链接文件；-i`
覆盖前先询问；-v：显示创建链接的过程）

---

## 用户管理
```bash
useradd [参数] [用户名]:创建用户（-c：指定用户的描述信息；-d：指定用户的主目录，该目录不用事先创建；-p:同时创建密码;-g：制定用户所属的主组，后接GID或组名；-G：制定用户所属的附属组，后接GID或组名；-s：指定用户的shell；-u：制定用户的uid）
usermod [参数] [用户名]:修改用户(-l:修改用户名；其他参数与usedadd相同)
userdel [参数] [用户名]:删除用户(-r:同时删除其主目录和邮箱,没加则会保留)
passwd [参数] [用户名]:管理用户密码（-d:删除用户密码；-l：锁定用户账户，即禁用账户;-u:解锁用户账户)
特别的：echo [密码] | passwd --stdin [用户]:利用管道直接修改密码
id [用户名]:查看用户信息
su [参数] [用户名]:切换用户（-或-l：初始化大部分环境变量，更改主目录，如同重新登陆一样，不加则为临时登陆）
whoami:查看当前用户
```

---



## 用户组管理
```bash
groupadd [参数] [组名]:创建组(-g:指定组的GID)
groupmod [参数] [组名]:修改组(-g:修改GID;-n:修改组名）
groupdel [参数] [组名]:删除组
gpasswd [参数] [组名]:组的管理(不加参数:设置组的密码；-r：删除组的密码；-a：将用户加入到组中，成为组的成员；-d:将用户从组中移除；-A：将用户设置为组的管理员)
groups [组名]:查看用户隶属的组
newgrp：登录到其他组
```

---



## 进程管理
```bash
ps：查看系统中的进程状态
ps -a：显示所有进程
ps -u：用户以及其他详细信息
ps -x：显示没有控制终端的进程
top：用于动态监视进程活动与系统负载等信息
pidof：用于查询某个指定服务进程的PID值
kill：终止此PID值的活动进程
free -h：显示当前系统中内存的使用量信息
ctrl+c：终止前台的程序
```