# 星舵 StarRudder

> 你的互联网罗盘 · 发现值得停泊的好站

一个中文站点导航网站，包含资讯、站点导航、友情链接三大模块，带完整后台管理，从一开始就为 Google SEO 做好准备。

详细规划见 [docs/PLAN.md](docs/PLAN.md)。

## 技术栈

- Next.js 16（App Router）+ TypeScript
- Tailwind CSS v4 + [coss ui](https://coss.com/ui)（Cal.com 设计系统）
- PostgreSQL + Drizzle ORM
- Auth.js 后台鉴权
- Tiptap 富文本 / rss-parser 资讯聚合

## 本地开发

前置条件：本地已运行 PostgreSQL，并创建数据库 `star_rudder`：

```sql
CREATE DATABASE star_rudder;
```

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量（参考 .env.example）
cp .env.example .env.local
# 编辑 .env.local 中的 DATABASE_URL / AUTH_SECRET

# 3. 数据库迁移与种子数据（M1 完成后补齐命令）
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 4. 启动
pnpm dev
```

打开 http://localhost:3000 。
