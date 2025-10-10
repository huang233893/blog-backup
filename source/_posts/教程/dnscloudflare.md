---
title: 使用CloudFlare加速Github Pages
description: 使用CloudFlare CDN进行加速您的github pages
summary: >-
  酥米小机器人来啦，这篇文章介绍了如何利用CloudFlare CDN加速Github
  Pages网站访问。由于Github服务器位于国外导致国内用户访问延迟或失败，通过CloudFlare可有效改善这一情况。需准备已注册的域名、搭建好的Github
  Pages站点及操作能力，注册CloudFlare后连接主域名并选择Free计划，配置DNS记录为A类型，开启代理功能，填写子域名如www.xxxx.top及对应的四个IP地址，最后将域名DNS服务器更改为CloudFlare提供的地址。需注意域名解析迁移后建议使用独立域名或仅通过CloudFlare解析其他子域名记录以确保稳定性。
tags:
  - 网络
categories: 教程类
cover: >-
  https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/cf.webp
date: 2025-08-02 17:24:13
---

# 前言
由于Github服务器在国外，导致国内用户总是打不开基于Github Pages的网站（或者抽风），于是在网上翻查了下，发现可以使用CloudFlare CDN进行加速，虽然服务器也在国外，但也好过没有（DOGE。

# 准备事项
- 一个正常使用的域名
- 已经搭建好的GitHub Pages，并且绑定上域名
- 灵活的脑子和手

# 正文

{% link Cloudflare,Cloudflare注册链接,https://dash.cloudflare.com/ %}

打开cloudflare官网，进行注册。注册后点击右上角添加——连接域，输入你的主域名，默认选项继续。

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/cloudflaredns%20(1).png)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/cloudflaredns%20(2).png)

之后选择Free版计划，下一步会跳转到DNS记录。新增四个记录，类型为A，勾选代理，名称填写子域名，如要作为网站使用的域名为`www.xxxx.top`那子域名就是`www`，ipv4地址分别如下
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/cloudflaredns%20(3).png)

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/cloudflaredns%20(6).png)

之后点击激活，会显示出两个cloudflare的专用解析DNS地址，去域名运营商那修改DNS服务器
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/cloudflaredns%20(4).png)
![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed/top/huang233893/imgs/blog/cloudflaredns%20(5).png)
等待运营商域名刷新后就大功告成啦！


## 小贴士
- 域名的DNS修改后，整个域名的DNS解析功能将会迁移至CloudFlare，建议使用单独的域名食用或在cloudflare上重新解析其他子域名记录