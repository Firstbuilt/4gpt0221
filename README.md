# 欧盟 AI 监管追踪台（可查看前台原型）

这是一个可直接运行的前端交互界面，支持你作为“欧洲隐私合规专家”进行：

- AI 监管知识库管理（立法/指导/判例）
- 监管动态跟踪（新闻/立法进展/执法等）
- 自动报告输出（全局报告 + 每条动态时评）

并且对“隐私合规（重点）”进行醒目标注，同时覆盖竞争法、消费者保护、网络安全等领域。

## 你可以在前台做什么

1. 查看顶部 KPI 看板（总条目、隐私占比、重点隐私动态）
2. 在知识库和监管动态中按关键词+领域筛选
3. 新增知识条目和监管动态
4. 一键生成全局报告，自动生成每条动态时评
5. 使用“加载演示数据”快速恢复演示状态

## 运行

```bash
npm start
```

浏览器访问：

- `http://127.0.0.1:4173/`（默认直接展示应用）
- `http://127.0.0.1:4173/index.html`

## 说明

- 数据存储在浏览器 `localStorage`，刷新后保留。
- 这是原型，后续可扩展为后端版（数据库、权限、自动抓取、周报导出）。


## Preview/一键启动（推荐）

如果你的 preview 环境默认执行 `npm start`，可直接使用：

```bash
npm start
```

默认端口为 `4173`，也支持通过环境变量指定端口（如 `PORT=8000 npm start`）。


- Preview 启动使用内置 `server.js`，支持未知路径回退到 `index.html`（避免 Preview 打开子路径时报 Not Found，且根路径直接展示应用）。


- 兼容常见 Preview 平台：`start` / `dev` / `preview` 均可启动同一服务。


## 一键部署到 Vercel

本项目已改为可直接按静态站点方式部署到 Vercel（包含 SPA 路由回退配置）。

### 方式 1：一键部署按钮（推荐）

将下面链接中的仓库地址替换为你的 GitHub 仓库地址后打开：

```text
https://vercel.com/new/clone?repository-url=https://github.com/<YOUR_ORG>/<YOUR_REPO>
```

### 方式 2：Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

### 部署说明

- 已提供 `vercel.json`：
  - 非静态资源路径自动回退到 `index.html`（避免刷新子路径 404）。
  - 可直接支持当前单页应用前端结构。


### Vercel 出现 `404: Not Found` 的处理

如果你已经部署但根路径仍 404，通常是路由规则未命中。当前仓库已改为 `routes + filesystem` 的兼容配置：

1. 先匹配真实静态文件（`index.html`、`app.js`、`styles.css` 等）
2. 其余路径统一回退到 `index.html`

请在 Vercel 控制台触发一次 **Redeploy**（使用最新 commit），然后再访问：

- `https://<your-project>.vercel.app/`

若仍 404，请确认项目设置里 **Root Directory** 指向仓库根目录（不是子目录）。
