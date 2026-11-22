# 星舵 StarRudder · 上线部署指南

> 生产地址：`https://starrudder.cc`
> 方案：自有线上服务器 + 线上 MySQL 8 + Next.js standalone + PM2 + Nginx + HTTPS。

---

## 1. 服务器准备

- Node.js ≥ 20.9（Next.js 16 最低要求）
- MySQL 8（schema 使用兼容写法，MySQL 5.7 也可运行）
- Nginx
- PM2：`npm i -g pm2`
- HTTPS 证书：`certbot --nginx -d starrudder.cc -d www.starrudder.cc`

在运维面板创建数据库与用户（名称 / 用户 / 密码均为 `star_rudder` 或自定义）：

```sql
CREATE DATABASE star_rudder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'star_rudder'@'localhost' IDENTIFIED BY '请替换为强密码';
GRANT ALL PRIVILEGES ON star_rudder.* TO 'star_rudder'@'localhost';
```

---

## 2. 环境变量

在服务器创建 `/var/www/starrudder/.env.local`（standalone 运行时由 `server.js` 进程读取）：

```env
DATABASE_URL=mysql://star_rudder:强密码@127.0.0.1:3306/star_rudder?charset=utf8mb4
AUTH_SECRET=至少32位的随机字符串
CRON_SECRET=另一个随机字符串
NEXT_PUBLIC_SITE_URL=https://starrudder.cc
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=你的Google验证码
```

> `NEXT_PUBLIC_*` 会在构建时写入客户端包，修改后必须**重新构建**。
> standalone 产物不会自动读取 `.env.local`；`ecosystem.config.js` 已加 `node_args: "--env-file=.env.local"`，请确保该文件与 `server.js` 同目录。

---

## 3. 构建与部署

本地或 CI 构建（**先准备生产 `.env.local`**，因为 `NEXT_PUBLIC_SITE_URL` 会写进构建产物）：

```bash
pnpm install
pnpm typecheck
pnpm build
```

构建前确认 `.env.local` 中 `NEXT_PUBLIC_SITE_URL=https://starrudder.cc`，否则 canonical / sitemap 会指向错误域名。

`next.config.ts` 已开启 `output: "standalone"`，产物在 `.next/standalone`。

上传服务器：

```bash
# 在服务器
mkdir -p /var/www/starrudder
# 把以下三项 scp 到该目录
#   .next/standalone/*   -> /var/www/starrudder/
#   .next/static         -> /var/www/starrudder/.next/static
#   public               -> /var/www/starrudder/public
# 同时把 ecosystem.config.js 放到 /var/www/starrudder/
```

目录结构应为：

```
/var/www/starrudder/
├── server.js
├── .next/standalone/... （已展开到当前目录）
├── .next/static/...
├── public/...
├── .env.local
└── ecosystem.config.js
```

启动：

```bash
cd /var/www/starrudder
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 4. 数据库迁移

迁移 SQL 已生成在 `drizzle/`（当前 3 个迁移：建表、提交分类字段、作者字段）。首次部署任选一种方式：

**方式 A（推荐，本地执行，连线上库）：**
```bash
# 本地 .env.local 的 DATABASE_URL 临时改成线上库
pnpm db:migrate
pnpm db:seed   # 仅首次需要，会清空并重建数据
```

**方式 B（服务器执行）：** 在服务器安装完整依赖后运行 `pnpm db:migrate`。

> 若线上库里已有数据，不要执行 `db:seed`（它会清空表并重建站点/文章/订阅源）。
> 订阅源配置已写进 `db/seed.ts`（7 个中文源，按编程开发 / AI 进展 / 游戏开发 / 产品设计分类）；若选择不 seed，需在后台 `/admin/rss-sources` 手动添加，否则 RSS 定时任务取不到内容。

---

## 5. Nginx 反向代理

```nginx
server {
    listen 80;
    server_name starrudder.cc www.starrudder.cc;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name starrudder.cc www.starrudder.cc;

    ssl_certificate     /etc/letsencrypt/live/starrudder.cc/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/starrudder.cc/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 6. 定时任务（RSS 聚合）

```bash
crontab -e
# 每 6 小时抓取一次（密钥替换成实际 CRON_SECRET）
0 */6 * * * curl -s -X POST -H "Authorization: Bearer 你的CRON_SECRET" https://starrudder.cc/api/rss/fetch >> /var/log/starrudder/rss.log 2>&1
```

---

## 7. SEO 上线检查

- [ ] `https://starrudder.cc/robots.txt` 返回正确 sitemap 地址
- [ ] `https://starrudder.cc/sitemap.xml` 包含全部页面（含全部内容详情页）
- [ ] 首页标题、描述、canonical 均为 starrudder.cc
- [ ] Google Search Console 添加资源，验证 meta 或上传验证文件
- [ ] 提交 sitemap；检查「网址前缀」与 canonical 一致
- [ ] JSON-LD（`WebSite` / `Organization` / `Article` / `ItemList`）无报错
- [ ] Lighthouse SEO / 可访问性分数检查
- [ ] 深色模式、⌘K 检索、随机发现、提交表单在线上可用

---

## 8. 常用运维

```bash
pm2 logs starrudder          # 查看日志
pm2 restart starrudder       # 重启
pm2 reload starrudder        # 零停机重载
```
