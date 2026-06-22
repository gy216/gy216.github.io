# gy216.github.io

基于 GitHub Pages 托管的个人静态站点，接入 Cloudflare CDN 全球加速，包含多功能模块与全自动化部署流程。

## ✨ 站点特性

- 🚀 纯静态 HTML 架构，无服务端依赖，开箱即用
- 🌐 GitHub Pages 原生托管，代码推送自动上线
- ⚡ Cloudflare CDN 全球节点加速，自动缓存优化
- 📧 部署完成自动邮件通知，实时掌握上线状态
- 📂 模块化目录管理，各功能页面独立维护
- 🔍 内置完整 SEO 配置（sitemap / robots / IndexNow 主动提交）
- 🛠️ 配套本地预览脚本，开发调试便捷

## 📁 目录结构


gy216.github.io/
├── .github/workflows/     # GitHub Actions 自动化工作流
│   └── pages-notify.yml   # 部署完成邮件通知任务
├── about/                 # 关于页面
├── ai/                    # AI 相关工具模块
├── game/                  # 在线小游戏集合
├── tools/                 # 在线实用工具（水印等）
├── home/                  # 主页相关资源
├── school/                # 校园相关内容
├── Public-welfare/        # 公益相关页面
├── image/                 # 站点图片资源
├── doc/                   # 文档资料
├── link/                  # 导航/友链页面
├── index.html             # 站点首页入口
├── CNAME                  # 自定义域名配置
├── robots.txt             # 搜索引擎爬虫规则
├── sitemap.xml            # 站点地图
├── 启动本地HTML服务器！.py  # 本地预览脚本
└── 一键发送indexnow.py     # SEO 主动提交脚本

## 🚀 部署方式

本仓库采用 **分支直连部署** 方案，无需编译构建流程，代码推送后自动完成发布。

### 自动部署（主流程）

1. 将修改后的代码推送至 `main` 分支根目录
2. GitHub Pages 检测到分支更新，自动触发站点构建
3. 构建完成后自动执行后置任务：
   - 调用 Cloudflare API 清空全站缓存，确保访问到最新版本
   - 推送部署完成通知邮件到绑定邮箱
4. 站点即时生效，可通过 `gy216.github.io` 或自定义域名访问

### 本地预览

仓库内置 Python 本地服务脚本，本地修改后可提前验证效果：

# 运行本地 HTTP 服务器
python 启动本地HTML服务器！.py


运行后访问 `http://localhost:8000` 即可预览本地站点。

## ⚙️ 自动化工作流

仓库内置 GitHub Actions 自动化任务，全程无需人工干预：

### 1. 部署完成邮件通知

- **触发条件**：GitHub Pages 站点构建完成（`page_build` 事件）
- **通知内容**：本次提交内容、提交人、仓库总提交次数、部署状态
- **实现方式**：通过 163 邮箱 SMTP 服务发送，密钥存储于仓库 Secrets

### 2. Cloudflare 缓存自动清理

- **触发条件**：站点部署完成后
- **功能**：自动调用 Cloudflare API 刷新全站缓存，避免 CDN 缓存导致页面更新延迟
- **依赖**：Cloudflare 账号 API 密钥，配置于仓库 Secrets

## 📝 补充说明

- 自定义域名修改请编辑根目录 `CNAME` 文件
- 根目录保留 `.nojekyll` 配置，确保带下划线前缀的静态资源正常加载
- 所有页面采用相对路径编写，适配子目录迁移
- SEO 运营可通过 `一键发送indexnow.py` 主动向搜索引擎提交站点更新

## 📄 许可证

本仓库代码遵循对应开源许可证，详见 LICENSE