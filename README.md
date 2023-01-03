# fanqs

> 注意 项目处在**可用但是未完成**的阶段，目前没有继续维护的打算

fanqs 意为 "fuck apple music, netease cloud music, qq music and spotify"，旨在打造一个轻量的、自建的音乐服务。包含一套后端 API 和 前端（计划支持响应式但是已流产），支持本地和服务器 host。

### 依赖

* nodejs
* koa 框架和 koa 相关包
* mongodb

### 运行

1. 确保 mongodb 启动，连接 <code>27017</code> 端口
2. 修改配置文件中的 <code>folders</code>，为你保存音乐的文件夹
3. <code>npm i</code>
<code>node index.js</code>
4. 浏览器访问 <code>8964</code> 端口
5. 如果是第一次使用，点击左侧控制栏的 <kbd>\[refresh\]</kbd> 按钮，然后刷新网页

### 链接

图标生成自 [favicon.io](https://favicon.io/favicon-generator/)
