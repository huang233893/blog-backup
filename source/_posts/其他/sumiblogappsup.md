---
title: 酥米小站微信小程序即将上线
description: 基于Vant-weapp制作的Hexo静态博客微信小程序《酥米小站》即将上线
summary: >-
  酥米小机器人来啦，这篇文章介绍了作者基于ryanuo的hexo-wx-api项目开发的静态博客小程序，通过抓取hexo-generator-restful生成的json文件实现文章实时刷新，目前已完成登录功能和基础阅读留言板分类功能，未来计划添加暗色模式Twikoo评论区文章优化等特性，但因未满18岁暂无法发布，预计月底或下月上线，感谢原项目方为静态博客小程序化提供可能
tags:
  - 博客
categories:
  - 其他
cover: >-
  https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/wx-6.webp
date: 2025-10-14 00:00:13
---

# 前提

最近看到彬红茶大佬更新了博客App，突发奇想（其实是眼馋了🌚），也想做一个属于Hexo的静态博客软件。

静态博客最被人诟病的是页面的刷新不及时，获取信息的速度没有动态博客快，于是我选择了ryanuo大佬的hexo-wx-api项目，通过直接抓取hexo-generator-restful生成的json文件，这样小程序里的文章更新就会比博客网站及时。俺选择微信小程序的原因是方便，不需要特别的打理，也不需要考虑多端适配，只需要打开微信搜索小程序就行了，方便了开发者也方便了用户。


# 启动！开干！

于是我花了大概8hours+，基于ryanuo大佬的hexo-wx-api项目，制作出了这个博客。修改了原项目70%+的代码，目前实现了基础功能

## 截图

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/wx-1.jpg)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/wx-2.jpg)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/wx-3.jpg)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/wx-4.jpg)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/wx-5.jpg)

# 进度

## 目前可以使用的功能

- 文章阅读
- 留言板
- 分类功能
- 博客实时刷新

## 未来完成的功能

- [ ] 暗色模式适配
- [ ] Twikoo评论区
- [ ] 友链页面
- [ ] 文章界面优化
- [x] 添加登录功能（已经通过微信登录实现）
- [ ] 微信文章通知（不知道静态博客可不可以实现，想试试）
- [ ] 博客文章分享
- [ ] 搜索功能（目前是半废状态，所以去除了）


## 问题
- 有部分功能尚未完工，正在抓紧补全
- 部分ui出现拉伸情况，正在修复
- 搜索半废（去掉了）

# 遗憾

本人差半个月成年，暂时无法进行小程序的发布，所以发布日期会在月底至下个月，大家敬请期待哦~

# 链接
感谢ryanuo大佬编写的hexo-wx-api项目，让静态博客小程序化成为了可能，谢谢您！

原项目：

{% link ryanuo/hexo-wx-api,GitHub,https://github.com/ryanuo/hexo-wx-api %}