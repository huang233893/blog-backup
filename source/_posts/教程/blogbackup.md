---
title: 自动备份你的Hexo博客
description: 给你的Hexo博客添加github仓库备份
summary: >-
  酥米小机器人来啦，这篇文章主要介绍如何通过Git和自动化脚本实现Hexo博客的备份，用户需先初始化Git仓库并配置远程地址，创建.gitignore文件过滤无用文件，手动首次提交源码至GitHub，再安装shelljs编写auto_backup.js脚本绑定deployAfter事件，自动执行代码提交和推送操作，确保博客数据安全，最终在部署后通过GitHub仓库验证备份结果。
tags:
  - 博客
  - 教程
categories:
  - 教程类
cover: >-
  https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/ht3-3.webp
date: 2025-10-10 15:55:13
---

# 前提
最近十分难绷，为了搞code-server远程编辑博客，把博客的依赖给刷掉了，还好之前有备份逃过一劫，这也让我萌生了一个想法，可不可以把hexo源代码备份到github仓库上面呢？于是我在万能的度娘寻找答案，还真给我找到了一个方法。

# 原文章地址

{% link 自动备份 Hexo 博客源文件,AISYUN's Blog,https://blog.cyida.com/2023/32DJ476.html %}

感谢AISYUN大佬提供的方案，此文章只做记录留档，如侵犯到您的权利，请联系我下架此文章，谢谢~

# 正文

## 将Hexo目录加入到Git仓库中

```
git init
git remote add origin git@github.com:Github用户名/项目名字.git
git pull origin main # 原教程中为Master，现已替换为main
```

建议在博客根目录中写入`.gitignore` 文件，填入以下内容：

```
public/
.deploy
.deploy_git/
*.log
```
这样可以防止编译过的网页以及log文件被上传到仓库里，提升备份速度

然后再执行以下命令，手动将源代码首次推送至Github仓库中：

```
git add .
git commit -m "备份hexo源码文件"
git push origin master
```

## 自动化实现

首先安装shelljs

```
npm install --save shelljs
```

然后在博客根目录/scripts（如果没有此文件夹，就创建一个）文件夹里，创建一个名为`auto_backup.js`的脚本

并且填入以下内容：
```
require('shelljs/global');
try {
    hexo.on('deployAfter', function() {//当deploy完成后执行备份
        run();
    });

} catch (e) {
    console.log("产生了一个错误啊<(￣3￣)> !，错误详情为：" + e.toString());
}
function run() {
    if (!which('git')) {
        echo('Sorry, this script requires git');
        exit(1);
    } else {
        echo("======================Auto Backup Begin===========================");
        cd('Your Blog Folder');    //此处修改为Hexo根目录路径
        if (exec('git add --all').code !== 0) {
            echo('Error: Git add failed');
            exit(1);
        }
        if (exec('git commit -am "blog auto backup script\'s commit"').code !== 0) {
            echo('Error: Git commit failed');
            exit(1);
        }
        if (exec('git push origin main').code !== 0) {
            echo('Error: Git push failed');
            exit(1);
        }
        echo("==================Auto Backup Complete============================")
    }
}

```
- Your Blog Folder处请改成自己博客的**绝对**目录路径如：D:/blog/
- 如果你的仓库名称不是默认origin和分支不是main的话，需改成自己的仓库和相应分支名

## 结果
保存好脚本，在博客目录执行`hexo deploy`命令，在博客常规推送之后，会出现以下输出：

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/ht3-1.png)

就证明博客代码推送成功啦~

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/ht3-2.png)

此时查看Github仓库上也有相应的博客代码啦！