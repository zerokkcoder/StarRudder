# 星舵 StarRudder

> 你的互联网罗盘 · 发现值得停泊的好站 · **https://starrudder.cc**

一个中文站点导航网站，包含资讯、站点导航、友情链接三大模块，带完整后台管理，从一开始就为 Google SEO 做好准备。

- 规划：[docs/PLAN.md](docs/PLAN.md)
- 设计规范：[docs/DESIGN.md](docs/DESIGN.md)
- 域名说明：[docs/DOMAINS.md](docs/DOMAINS.md)
- 部署指南：[docs/DEPLOY.md](docs/DEPLOY.md)

## 技术栈

- Next.js 16（App Router）+ TypeScript
- Tailwind CSS v4 + [coss ui](https://coss.com/ui)（Cal.com 设计系统）
- MySQL 8（schema 同时兼容 5.7）+ Drizzle ORM
- Auth.js 后台鉴权
- Tiptap 富文本 / rss-parser 资讯聚合

## 本地开发

前置条件：本地已运行 MySQL，数据库名 / 用户 / 密码均为 `star_rudder`：

```sql
CREATE DATABASE star_rudder;
CREATE USER 'star_rudder'@'localhost' IDENTIFIED BY 'star_rudder';
GRANT ALL PRIVILEGES ON star_rudder.* TO 'star_rudder'@'localhost';
```

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量（参考 .env.example）
cp .env.example .env.local
# 编辑 .env.local 中的 DATABASE_URL / AUTH_SECRET

# 3. 数据库迁移与种子数据
pnpm db:migrate
pnpm db:seed

# 4. 启动
pnpm dev
```

打开 http://localhost:3000 。
