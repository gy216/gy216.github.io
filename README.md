基于 GitHub Pages 部署的果园编程工作室静态站点，全端适配、内置大量编程工具与学习资源
 
📁 仓库目录结构
 
plaintext  
gy216.github.io
├─ .github               # Github Action 自动化工作流配置
├─ 2FA                   # 二步验证相关页面与工具
├─ 404.html              # 站点404兜底错误页面
├─ 55f1fb93becc9eb2b3abdd02ea0187a6.txt
├─ 57d90a4564104b3eabc6f8271dec863a.txt
├─ APP                   # 移动端应用相关页面、安装包分发入口
├─ BingSiteAuth.xml      # 必应搜索引擎站点验证文件
├─ CDN_resources         # 静态CDN资源存放目录
├─ CNAME                 # 自定义域名 gybc.top 解析配置
├─ LICENSE               # 项目开源协议文件
├─ License‑pages         # 开源声明、版权相关子页面
├─ MS.ttf                # 站点内置字体文件
├─ Public‑welfare       # 公益相关的专题页面
├─ about                 # 工作室介绍、团队履历板块
├─ ai                    # AI工具合集页面
├─ api                   # 站点后端接口、轻量服务路由
├─ bk                    # 备份文件、历史工程归档目录
├─ cloud                 # 云盘、云端文件管理相关功能
├─ csr                   # 证书相关配置文件
├─ dabao                 # Scratch作品一键打包工具主页面
├─ doc                   # 全套开发文档、使用教程库
├─ favicon.ico           # 站点浏览器图标
├─ fw                    # 固件、嵌入式相关工具页面
├─ game                  # 自研小游戏、游玩入口
├─ home.zip              # 首页工程压缩备份包
├─ home                  # 站点真正的首页主页面
├─ image                 # 全站图片静态资源库
├─ index.html            # 根目录跳转页面，0秒重定向到/home
├─ integrity             # 文件完整性校验、站点巡检工具
├─ join                  # 工作室招募、加入团队的报名入口
├─ ling                   # 语音相关工具页面
├─ link                  # 导航友链、快捷链接合集
├─ logo.png              # 站点工作室logo
├─ ms.woff2              # 网页字体woff2格式资源
├─ my                    # 个人中心、创作者工作台板块
├─ new                   # 最新功能、更新公告专区
├─ oldwebsite            # 历史旧版网站工程归档
├─ product               # 成品工具、开发产出展示页
├─ robots.txt            # 爬虫抓取规则配置
├─ school                # 面向中职、中小学的编程研学板块
├─ sitemap.xml           # 站点标准站点地图
├─ sitemap_index         # 站点地图索引目录
├─ sitemap_old.xml       # 历史旧版站点地图备份
├─ so                    # 站内搜索功能模块
├─ study                 # 系统化编程学习资料库
├─ supp                  # 站点售后、故障反馈通道
├─ tools                 # 全套网页开发小工具合集
├─ 一键发送indexnow.py   # 百度站长IndexNow主动推送脚本
└─ 启动本地HTML服务器！.py # 本地开发预览启动脚本
 
 
🎯 项目介绍
 
本仓库为果园编程工作室的官方静态站点，依托 GitHub Pages 完成托管部署，绑定自定义域名  gybc.top 。
站点面向青少年编程爱好者，提供全套轻量化编程能力服务：
 
1. Scratch 项目离线打包导出exe安装包
2. 丰富的前端、Python、嵌入式方向学习资料
3. 大量自研在线开发工具、轻量游戏
4. 工作室成员作品展示、团队招募通道
 
✨ 站点特色
 
1. SEO完整优化
根目录  index.html  配置了canonical标准链接、0秒自动跳转、结构化数据、OpenGraph社交预览标签，搜索收录能力完善。配套站点地图、搜索引擎验证文件完成全量收录配置。
2. 双端适配
全部页面完成移动端、桌面端的响应式适配，手机端访问体验流畅。
3. 完整的运维能力
内置大量自动化脚本，支持站点索引主动推送、本地快速启动调试服务，github action完成站点自动部署。
4. 全链路资源归档
网站全部图片、字体、静态资源均本地化存放，额外留存旧版本网站工程、各类历史备份文件。
 
🚀 本地启动运行
 
1. 将仓库克隆至本地设备
 
bash  
git clone https://github.com/gy216/gy216.github.io.git
cd gy216.github.io
 
 
2. 运行内置的启动脚本即可打开本地预览服务
 
python  
python "启动本地HTML服务器！.py"
 
 
3. 浏览器访问  127.0.0.1  即可查看站点完整效果
 
📌 部署说明
 
站点基于 GitHub Pages 完成上线，域名 gybc.top 通过CNAME文件完成绑定，页面更新后推送至main分支即可自动完成部署。
站点内置 IndexNow 推送脚本，可以快速向百度搜索平台提交站点新链接，加快页面收录速度。
 
📄 开源协议
 
项目代码使用开源许可证开放，版权详情可以查看仓库内  LICENSE  文件与 License‑pages 目录下的详细说明。
 
📞 联系渠道
 
站点的反馈入口位于  /supp  路径，也可以前往工作室的招募页面  /join  提交合作意向。
 
💡 开发提示
 
站点首页的入口位于  /home ，根目录的index.html仅做跳转用途，所有的核心业务页面均存放于对应的子文件夹当中，更新站点内容优先修改home目录下的页面文件。