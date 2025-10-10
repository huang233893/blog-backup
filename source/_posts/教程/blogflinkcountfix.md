---
title: anzhiyu主题友链测速后端修复
description: anzhiyu主题友链测速后端修复方案和脚本
summary: >-
  酥米小机器人来啦，这篇文章介绍了anzhiyu主题友链测速后端修复过程，原js代码不兼容提示格式错误，经豆包调整现已支持自动检测编码、修复并生成合适的友链json，可检测语法问题输出错误，脚本可放置scripts文件夹或直接执行node
  link.js，代码通过处理BOM头替换制表符、严格解析YAML结构实现功能优化，同时提供错误定位与调试信息输出。
tags:
  - 博客
  - 教程
categories:
  - 教程类
cover: >-
  https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/ht1-3.png
date: 2025-09-24 02:20:13
---

# 前提
最近在捣腾anzhiyu主题的友链延迟检测，前端使用了辰渊尘大佬的方法，后端则使用了LiuShen大佬的Github Action方法，但是大佬附带的友链提取js并不适配anzhiyu主题，提示格式错误，于是我投给豆包进行了修改。

现已支持自动检测编码和自动修复并生成合适的友链json,也能检测出语法问题并且输出错误。

脚本可以放在scripts文件夹也可以单独执行`node link.js`来生成

**效果如图**：

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/ht1-1.png)

# 代码
代码如下：
```node.js
const YML = require('yamljs');
const fs = require('fs').promises;
const path = require('path');

// 路径配置
const LINK_YML_PATH = path.join('source', '_data', 'link.yml');
const OUTPUT_JSON_PATH = path.join('source', 'flink_count.json');
const TAKE_COUNT = 2;

async function processLinks() {
  try {
    // 读取文件（二进制方式）
    const yamlBuffer = await fs.readFile(LINK_YML_PATH);
    console.log('文件读取成功，大小:', yamlBuffer.length, '字节');
    
    // 处理UTF-8 BOM头（移除BOM）
    let cleanBuffer = yamlBuffer;
    if (yamlBuffer[0] === 0xef && yamlBuffer[1] === 0xbb && yamlBuffer[2] === 0xbf) {
      console.warn('检测到UTF-8 BOM头，已自动移除');
      cleanBuffer = yamlBuffer.slice(3); // 移除前3个BOM字节
    }
    
    // 转换为字符串
    const yamlContent = cleanBuffer.toString('utf8');
    
    // 显示文件前100个字符用于调试
    console.log('文件前100字符:', yamlContent.substring(0, 100).replace(/\n/g, '\\n'));
    
    // 更安全的YAML处理 - 只处理确实为空的rss字段
    const processedContent = yamlContent
      .replace(/^\s*rss:\s*$/gm, 'rss: ""')  // 处理空的rss字段
      .replace(/\t/g, '  ');  // 将制表符替换为两个空格（YAML不允许制表符缩进）
    
    // 保存处理后的内容用于调试
    await fs.writeFile('processed_yaml_debug.yml', processedContent, 'utf8');
    console.log('已保存处理后的YAML到 processed_yaml_debug.yml');
    
    // 尝试使用更严格的方式定位错误
    try {
      console.log('开始解析YAML...');
      const data = YML.parse(processedContent);
      console.log('YAML解析成功，根结构类型:', Array.isArray(data) ? '数组' : typeof data);
      
      if (!Array.isArray(data)) {
        throw new Error('YAML文件的根结构不是数组');
      }
      
      const linkList = [];
      for (let i = 0; i < Math.min(TAKE_COUNT, data.length); i++) {
        const item = data[i];
        if (item && Array.isArray(item.link_list)) {
          linkList.push(...item.link_list);
        } else {
          console.warn(`第${i+1}项不包含有效的link_list数组，已跳过`);
        }
      }
      
      const outputData = {
        link_list: linkList,
        length: linkList.length
      };
      
      await fs.writeFile(
        OUTPUT_JSON_PATH,
        JSON.stringify(outputData, null, 2),
        'utf8'
      );
      
      console.log(`成功生成 ${OUTPUT_JSON_PATH}，共包含 ${linkList.length} 条友链`);
      
    } catch (parseError) {
      console.error('\n=== YAML解析错误 ===');
      console.error('错误信息:', parseError.message);
      
      // 尝试定位错误行
      if (parseError.parsedLine) {
        console.error('错误位置: 第', parseError.parsedLine, '行');
        // 输出错误行附近的内容
        const lines = processedContent.split('\n');
        const errorLine = parseError.parsedLine - 1; // 转换为数组索引
        // 显示错误行前后3行
        for (let i = Math.max(0, errorLine - 3); i <= Math.min(lines.length - 1, errorLine + 3); i++) {
          console.log(`${i + 1}: ${lines[i]}`);
        }
      } else {
        console.error('错误位置: 未知（可能是文件开头附近）');
      }
      console.error('请检查 processed_yaml_debug.yml 文件是否有格式问题');
    }
    
  } catch (error) {
    console.error('\n=== 处理过程出错 ===');
    console.error('错误信息:', error.message);
  }
}

processLinks();
```

运行脚本前请先安装yamljs `node install yamljs --save`

# 后端Github Action修复方案

{% note warning flat %}此修复方法仅经过本人测试正常运行，可否正常使用请自行测试{% endnote %}

作者原版github actions运行后可能会出现找不到环境变量的问题，导致抓取失败。

这里有个走偏门的方法，可以Fork后修改workflows文件夹里面的yaml文件夹的**check_links.yml**,将`env：`下面的

`SOURCE_URL: ${{ secrets.SOURCE_URL }}`

改成自己的URL，例如：

`SOURCE_URL: https://www.sumi233.top/flink_count.json`

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/ht1-4.png)

然后在项目的Github Actions再次运行workflows即可。

# 引用教程
- 谢谢大佬们的无私贡献！

{% link Github Action实现友链状态检测,LiuShen,https://blog.liushen.fun/posts/c2262998/ %}

{% link 安知鱼主题实现友链状态前端显示,辰渊尘の个人博客,https://blog.mcxiaochen.top/posts/p1c0fbc06/ %}

# 最终实现效果

![](https://cdn.sumi233.top/gh/huang233893/blog-image-bed@main/top/huang233893/imgs/blog/ht1-2.png)
