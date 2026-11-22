import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/** 后台管理员 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/** 分类：站点与资讯共用，type 区分 */
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  icon: varchar("icon", { length: 100 }),
  type: varchar("type", { length: 20 }).notNull().default("site"), // site | news
  sort: integer("sort").notNull().default(0),
});

/** 站点导航 */
export const sites = pgTable(
  "sites",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    slug: varchar("slug", { length: 150 }).notNull().unique(),
    url: text("url").notNull(),
    description: text("description").notNull().default(""),
    logo: text("logo"),
    categoryId: integer("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    tags: jsonb("tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    clicks: integer("clicks").notNull().default(0),
    status: varchar("status", { length: 20 }).notNull().default("active"), // active | hidden
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("sites_category_idx").on(table.categoryId),
    index("sites_featured_idx").on(table.featured),
  ],
);

/** 资讯：manual=后台原创全文，rss=聚合摘要+原文链接 */
export const articles = pgTable(
  "articles",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    summary: text("summary").notNull().default(""),
    content: text("content").notNull().default(""),
    cover: text("cover"),
    categoryId: integer("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    tags: jsonb("tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    source: varchar("source", { length: 20 }).notNull().default("manual"), // manual | rss
    sourceUrl: text("source_url"),
    publishedAt: timestamp("published_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    status: varchar("status", { length: 20 }).notNull().default("published"), // published | draft
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("articles_published_idx").on(table.publishedAt),
    index("articles_category_idx").on(table.categoryId),
    index("articles_source_idx").on(table.source),
  ],
);

/** RSS 订阅源 */
export const rssSources = pgTable("rss_sources", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  url: text("url").notNull().unique(),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true }),
  status: varchar("status", { length: 20 }).notNull().default("active"),
});

/** 友情链接 */
export const friendLinks = pgTable("friend_links", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  url: text("url").notNull(),
  logo: text("logo"),
  description: text("description").notNull().default(""),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  sort: integer("sort").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/** 用户提交（站点/友链申请） */
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 20 }).notNull(), // site | link
  name: varchar("name", { length: 150 }).notNull(),
  url: text("url").notNull(),
  description: text("description").notNull().default(""),
  email: varchar("email", { length: 255 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending | approved | rejected
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Site = typeof sites.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type FriendLink = typeof friendLinks.$inferSelect;
export type RssSource = typeof rssSources.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type User = typeof users.$inferSelect;
