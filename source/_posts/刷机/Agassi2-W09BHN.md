---
title: 每一步都是意外之外！荣耀平板5 10.1英寸版本的各种折腾 （总结篇）
description: 每一步都是意外之外！荣耀平板5 10.1英寸版本的各种折腾 （总结篇）
categories:
  - 搞机类
  - 教程类
tags:
  - 刷机
  - 玩机
cover: >-
  https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(29).jpg
summary: >-
  酥米小机器人来啦，这篇文章详细讲述了作者购入荣耀平板5
  10.1英寸屏幕带线版后遭遇屏幕竖纹故障、与卖家追讨退款的纠纷过程，以及华为鸿蒙系统对麒麟659芯片优化不佳导致的卡顿问题；随后探索了官方降级通道关闭下的强刷包降级方法、拆机解锁BL的具体步骤，并指导了刷入LineageOS
  GSI和Magisk的完整教程以实现老设备的流畅系统体验，全文通过亲身经历分享了折腾细节和实用技巧。
date: 2024-12-26 20:21:46
---

# 前提
三天前，我在闲鱼相中了一台荣耀平板5 10英寸，并且以155的低价购入屏幕带线版，当时卖家是说除了屏幕顶上有线其他正常，结果到手三天意外就发生了，屏幕直接被被竖纹给霸占，找商家追诉，返了55块
![01](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(29).jpg)
![02](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(26).jpg)

小嘴一句，这个卖家本来还不想理我，直接未读但闲鱼在线，还把简介的非质量问题改成了不退不换，想耍闲鱼小花招，没门！我直接给他甩追差评+投诉+拉黑小连招，让卖家怂的返了一部分的钱款
![03](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(24).jpg)

# 麒麟659在鸿蒙下
真的好卡！！！！！！我已经不能用言语形容卡顿，是那种没法正常用的卡顿，鸿蒙的对于老机型的优化真的很垃圾，我不明白套壳emui9为什么还能这么卡，在鸿蒙下没装软件滑动桌面都会卡，更别说了装了软件了，我还跑了个娱乐兔跑分，这颗u跑分在14-15w分左右，和625不分伯仲，但是这个价位要什么自行车？/doge
![04](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(1).jpg)
![05](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(2).jpg)


# 降级
## 官方渠道无法正常降级
OKOK扯远了，回到正题，于是我就开启了我的难崩降级之旅，因为华为的解bl和刷机嘛，需要在emui下实现，所以得从鸿蒙降级下来。
华为也很鸡贼，明明之前说好升了鸿蒙可以随便降回emui，但是从Harmony Next之后，华为就取消了所以老机型的降级通道，这意味着唯一的官方通道被彻底覆灭，我也尝试过像代理降级的办法，都是无法正常降级的

# 三键强刷
所幸，我在万维论坛找到了高维禁用的emui9强刷包，食用方法也很简单：

- 下载之后直接解压dload放在sd卡目录（一定是sd卡或者otg，不能是内部存储）

- 然后打开系统自带的计算器输入()()2846579()()进入工程菜单

![06](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(3).jpg)

- 选择软件升级——存储卡升级，平板就会重启到rec自动降级emui9.1了

![07](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(27).jpg)

- 注：由于万维论坛的注册是邀请制，并且限制分享，所以要强刷包下载链接的可以点击右下角三个选项中间的小气泡按钮找我要链接下载

- 也可以使用代理法降级EMUI9（只能降最新的EMUI9.1），这里就不细说了，网上有很多教学视频


## Bingo
恭喜你完成第一步，降级EMUI9，降完级你会得到一个可以正常使用流畅度也还行的麒麟659设备
（本来想降EMUI8的，但是官方彻底关降级通道了）

# 拆机解锁BL
但是还不够，我的终极目标是解锁BL刷入LineageOS GSI！达到真正的流畅使用！

## 拆机
本来是没那么早拆机的，但是因为屏幕迫使我的好奇心一看究竟。
我讲下我的方法吧（过程全错，结果全对doge）

需要的材料：吹风机、热风枪或者拆机台，镊子一个，翘机片若干，刀片x1

## 步骤
- 首先拿吹风机调热风或者热风枪调低温，有那个拆机台加热也可以，加热下屏幕四周，一定要热够时间！！！！而且要热一边拆一边，原装屏幕胶很黏，不热拆不下来（不然会像我一样，死活拆不下来，用刀片割胶）
- 然后用刀片插进屏幕缝隙里翘翘，要慢慢来，不要心急，不要翘成下面的塑料支架，也别妄想从塑料支架上手（深刻的教训呜呜呜，塑料支架里面有螺丝固定）。翘的时候不要刀片朝屏幕方向刮翘，本人亲测会把屏幕边框刮掉色（血的教训呜呜呜！）
- 如果觉得难拆就用翘片顶着刀片刮开松的地方，划过去，只要不刮到屏幕，使劲造，因为屏幕胶很厚，而且屏幕边底下是塑料支架，只要不要刮太深基本上刮不到里面的东西（指纹键除外，这个要注意不要把指纹键边上的玻璃搞断了）
- 四个边都撬开就可以拿起屏幕了，到这里其实差不多了。但是因为要短接，屏幕挂着短接很麻烦，我的建议是可以把屏幕拆下来。
拧下三颗螺丝拆下挡着电池排线和屏幕排线的盖板，把屏幕排线断开拆屏幕就完成了！
由于拆机拆得太入迷了，所以只有拆完的图片doge

![25](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(19).jpg)

![26](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(7).jpg)

## 解锁BL
先下载链接里面的工具

{% link 123PAN,刷机工具,https://www.123684.com/s/mIXlVv-LEOB %}

提取码:1234

- 先过开机向导
- 打开自带计算器输入()()2846579()() 进入工程菜单
![08](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(3).jpg)

- 选择 后台设置——usb端口设置——选择生产模式
- 安装华为的COM1.0驱动
- 将设备关机，用镊子短接COM1.0刷机点和屏蔽罩，一边刷机点，一边屏蔽罩，然后插入数据线，具体短接点可以参考酷安@孙子烧烤 大佬给出的短接截图
- 设备管理器中出现COM1.0设备就是成功进入啦
![09](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(28).jpg)

- 打开PotatoNV ，Target device选择刚刚的端口，Bootloader选择Kirin 65X（A），勾引Disable Fblock（关闭工厂解锁，使用用户级解锁，这是因为华为将BL解锁划分成了工程解锁和用户解锁，工程解锁可以访问全部分区，用户级则是system啥的普通分区，不建议使用工程解锁，把其他分区搞坏了没备份修复很麻烦）
![10](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(4).png)

- 选择start开始解锁！
- 不一会就会解锁完成自动重启，软件也会显示解锁码，一定要妥善保存，升降EMUI有概率会自动锁上
![11](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(2).png)

- 解锁之后每次开机有提示是正常的，等五秒或者按电源键继续就行
![12](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(11).jpg)

至此，荣耀平板5的解锁BL就到这里了

# 刷入LineageOS GSI
## 前期准备
- 平板和稳定的数据线
- 基于Phh的类原生GSI。尽量不高于安卓12、13，高版本安卓比较卡顿，EMUI8选择Aonly分区的，EMUI9以后请选择A/B分区。（别问其他OEM GSI和SGSI能不能开机，答案是不能，原因应该是内核宽容）
- Magisk 24以上，类原生需要24以上
- 麒麟盘古工具箱（可以前往酷安@某贼 大佬那下载）
- 一双灵巧的手（刚刚都完成拆机了应该不会不巧了吧/doge）
准备好了让我们开始吧！

## 开始刷机
按住电源 + 音量上进入Fastboot 数据线链接电脑
解锁BL（这步前面搞完的可以直接跳过）,使用盘古工具箱解锁BL，平板有提示按音量上然后按电源键确认解锁。解锁了会自动重启格式化，格式化失败是正常滴，直接强制重启再次进Fastboot就行
![13](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(13).jpg)

使用盘古工具箱刷入奇兔通用REC
![14](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(5).jpg)

重启平板,到警告页面的时候长按电源+ 进入eREC
选择格式化，输入yes进入REC（由于华为设备系统分区的特殊性，双rec，这一步的目的是以格式化的名义欺骗eREC进入真正的rec，实际上并不会执行格式化命令）
-然后就进入奇兔rec啦！
![15](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(14).jpg)
![16](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(15).jpg)

选择清除，高级选项
勾选内置存储，Data，System，Cache，Dalvik/ART Cache。滑动清除分区
![17](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(16).jpg)

完事儿后，回到主页面，重启，重启到Bootloader
打开盘古工具箱，选择刷入自定义系统镜像，拖入下载的GSI，等待刷机完成
![18](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(4).jpg)

刷完后，重启等开机。Enjoy it! :)
![19](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(12).jpg)

## 刷入Magisk
注：由于GSI SAR分区的特殊性，刷入Magisk会丢失REC，原来REC的分区会被Magisk用来引导带Root的系统

- 从盘古工具箱提取出来奇兔rec镜像，和Magisk一起传进平板
![20](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(1).png)

- 平板安装Magisk，完成后打开
- 点击右边的安装——安装到rec-选择一个文件修补然后选择刚刚的奇兔镜像进行修补就行啦
![21](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(10).jpg)

- 等输出显示All Done！后，链接电脑把平板内置存储Download目录的修补镜像导出电脑
- 然后将平板进入Fastboot
- 打开盘古工具箱选择刷入自定义REC拖入刚刚的rec镜像路径，回车等待刷入完成
![22](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/honorpad5%20(9).jpg)

- 刷入完成后盘古工具箱选择重启
- 出现启动警告页面后长按三秒音量上键进入erec
- 选择格式化，输入yes，诱骗erec进入root后的系统
- 打开Magisk，如果有提示修补选重启修补就行
Magisk到这里就刷完啦！这篇教程也快到尾声啦，俺还是第一次写这么长的文章，如果有文笔不仔细的地方，请各位见谅！