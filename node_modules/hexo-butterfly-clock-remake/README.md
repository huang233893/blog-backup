# hexo-butterfly-clock-remake

>  [!IMPORTANT]
> 这是基于[hexo-butterfly-clock](https://github.com/akilarlxh/hexo-butterfly-clock)、[hexo-butterfly-clock-anzhiyu](https://github.com/anzhiyu-c/hexo-butterfly-clock-anzhiyu)、
> [hexo-butterfly-clock-anzhiyu-yang](https://github.com/yjh2643408123/hexo-butterfly-clock-anzhiyu-yang) 项目修改而来的版本，为 hexo-theme-butterfly 添加侧边栏电子钟，在原项目基础上进行了重制。


[电子时钟插件源码修改与分析过程](https://hoochanlon.github.io/posts/59603.html)

<details>
<summary>程序逻辑与优化部分</summary>
程序逻辑：

1. 以和风天气API为执行基础。
1. 通过IP定位API拿到城市位置，通过城市位置拿到和风天气location id
1. 再通过location id获取到天气

优化部分：

* 移除了通过index索引排序，引入了根据类名排序
* 删除了原作者无效的获取ip地址的代码
* 移除了所有高德地图相关代码
* 添加了UniDreamLED.ttf字体
* 修正跨国家访问还显示中国时区时间
* 修正英文文字超出边框的问题
</details>

### 效果

>  [!IMPORTANT]
> 新版在配置上引入了更稳定的根据类名插入排序，移除了通过index索引排序，下图为旧版配置样例

<details>
<summary>图片展示</summary>
  
![20251021234339464](https://tu.zbhz.org/i/2025/10/24/3b359i.png)

![20251022020145924](https://tu.zbhz.org/i/2025/10/24/3b3fke.png)

</details>


### 安装

【1】卸载时钟

```bash
npm uninstall hexo-butterfly-clock
npm uninstall hexo-butterfly-clock-anzhiyu 
npm uninstall hexo-butterfly-clock-anzhiyu-yang
```

【2】安装本插件：

```bash
npm install hexo-butterfly-clock-remake
```

### 使用

【1】 在站点配置文件 _config.yml 或者主题配置文件 _config.butterfly.yml 中添加：

> [!NOTE]
> 提示：使用该插件需注册和风天气开发者账号，并使用自己的和风天气api host和key。
> 
> 👉：https://dev.qweather.com

```yml
# electric_clock
# see：https://github.com/hoochanlon/hexo-butterfly-clock-remake
electric_clock:
  enable: true           # 插件开关
  priority: 5            # 过滤器优先级
  enable_page: all       # 应用页面，可写特定路径或 "all"
  exclude:            # 排除页面，可留空或写具体路径
    # - /posts/
    # - /about/
  layout:
    type: class          # 容器类型，class 或 id
    name: aside-content  # 目标容器的 class 或 id
    # insert_before: user-countdown   # 插入到该元素前面 
    insert_after: card-announcement  # 插入到该元素后面（二选一）
  loading: https://cdn.cbd.int/hexo-butterfly-clock-remake@2.0.6/lib/loading.gif
  clock_css: https://cdn.cbd.int/hexo-butterfly-clock-remake@2.0.6/lib/clock-min.css
  clock_js: https://cdn.cbd.int/hexo-butterfly-clock-remake@2.0.6/lib/clock-min.js
  qweather_api_host: {YOUR API HOST}
  qweather_key: {YOUR KEY}
  default_city: "资兴"
```


【2】 参数释义

  |参数|类型|释义|
  |:--|:--|:--|
  |priority|number|【可选】过滤器优先级，数值越小，执行越早，默认为10，选填|
  |enable|true/false|【必选】控制开关|
  |enable_page|path|【可选】填写想要应用的页面,如根目录就填'/',分类页面就填'/categories/'。若要应用于所有页面，就填`all`，默认为`all`|
  |exclude|path|【可选】填写想要屏蔽的页面，可以多个。写法见示例。原理是将屏蔽项的内容逐个放到当前路径去匹配，若当前路径包含任一屏蔽项，则不会挂载。|
  |layout.type|id/class|【可选】挂载容器类型，填写id或class，不填则默认为id|
  |layout.name|id/class|【必选】挂载容器名称|
  |layout.insert_before|id/class|【可选】 插入到该元素前面（二选一）|
  |layout.insert_after|id/class|【可选】插入到该元素后面（二选一）|
  |loading|URL|【可选】电子钟加载动画的图片|
  |clock_css|URL|【可选】电子钟样式CDN资源|
  |clock_js|URL|【可选】电子钟执行脚本CDN资源|
  |qweather_key|key|【必选】和风天气 key|
  |qweather_api_host|URL|【必选】和风天气 api_host|
  |default_city|string|【可选】当默认城市为空，优先根据IP定位，填写了默认城市将优先使用默认城市的定位和天气|


### 插件重制使用到的工具

* 和风天气location id：https://github.com/qwd/LocationList/blob/master/China-City-List-latest.csv
* 免费获取IP地址API: https://github.com/ihmily/ip-info-api
* IP地址查询：https://tool.lu/ip
* 经纬度查询：https://jingweidu.bmcx.com

