---
title: 朋友圈
date: 2025-09-08 23:10:00
aside: false
type: "fcircle"
---

<div id="friend-circle-container">与主机通讯中……</div>

<script>
    if (typeof UserConfig === 'undefined') {
        var UserConfig = {
            // 你的 hexo-circle-of-friends 后端 API 地址（需先部署后端）
            private_api_url: 'https://friends.sumi233.top/',
            // 每次点击“加载更多”时加载的文章数量，默认 24
            page_turning_number: 24,
            // 头像加载失败时的默认图片
            error_img: 'https://cdn.sumi233.top/gh/Rock-Candy-Tea/Friend-Circle-Frontend/logo.png',
        }
    }
</script>

<!-- 样式文件：以主题命名，目前仅支持 butterfly -->
<link rel="stylesheet" href="https://cdn.sumi233.top/gh/Rock-Candy-Tea/Friend-Circle-Frontend/hexo-theme-butterfly/default.min.css">

<!-- 脚本文件：对应主题样式功能 -->
<script src="https://cdn.sumi233.top/gh/Rock-Candy-Tea/Friend-Circle-Frontend/hexo-theme-butterfly/default.min.js"></script>