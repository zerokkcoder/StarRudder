import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  int,
  json,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/** 后台管理员 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

/** 分类：站点与资讯共用 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  icon: varchar("icon", { length: 100 }),
  type: varchar("type", { length: 20 }).notNull().default("site"),
  sort: int("sort").notNull().default(0),
});

/** 站点导航 */
export const sites = mysqlTable(
  "sites",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    slug: varchar("slug", { length: 150 }).notNull().unique(),
    url: text("url").notNull(),
    description: varchar("description", { length: 1000 }).notNull().default(""),
    logo: text("logo"),
    categoryId: int("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    tags: json("tags").$type<string[]>().notNull(),
    clicks: int("clicks").notNull().default(0),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => [
    index("sites_category_idx").on(table.categoryId),
    index("sites_featured_idx").on(table.featured),
  ],
);

/** 资讯：manual=原创全文，rss=聚合摘要+原文链接 */
export const articles = mysqlTable(
  "articles",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    summary: text("summary").notNull(),
    content: text("content").notNull(),
    cover: text("cover"),
    author: varchar("author", { length: 150 }),
    categoryId: int("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    tags: json("tags").$type<string[]>().notNull(),
    source: varchar("source", { length: 20 }).notNull().default("manual"),
    sourceUrl: text("source_url"),
    publishedAt: timestamp("published_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("published"),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => [
    index("articles_published_idx").on(table.publishedAt),
    index("articles_category_idx").on(table.categoryId),
    index("articles_source_idx").on(table.source),
  ],
);

/** RSS 订阅源 */
export const rssSources = mysqlTable("rss_sources", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  url: varchar("url", { length: 250 }).notNull().unique(),
  categoryId: int("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  lastFetchedAt: timestamp("last_fetched_at"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
});

/** 友情链接 */
export const friendLinks = mysqlTable("friend_links", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  url: text("url").notNull(),
  logo: text("logo"),
  description: varchar("description", { length: 1000 }).notNull().default(""),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  sort: int("sort").notNull().default(0),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

/** 用户提交 */
export const submissions = mysqlTable("submissions", {
  id: int("id").autoincrement().primaryKey(),
  type: varchar("type", { length: 20 }).notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  url: text("url").notNull(),
  description: varchar("description", { length: 1000 }).notNull().default(""),
  email: varchar("email", { length: 255 }),
  categoryId: int("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Site = typeof sites.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type FriendLink = typeof friendLinks.$inferSelect;
export type RssSource = typeof rssSources.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type User = typeof users.$inferSelect;
