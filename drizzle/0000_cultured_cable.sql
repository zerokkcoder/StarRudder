CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`summary` text NOT NULL,
	`content` text NOT NULL,
	`cover` text,
	`category_id` int,
	`tags` json NOT NULL,
	`source` varchar(20) NOT NULL DEFAULT 'manual',
	`source_url` text,
	`published_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`status` varchar(20) NOT NULL DEFAULT 'published',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `articles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`icon` varchar(100),
	`type` varchar(20) NOT NULL DEFAULT 'site',
	`sort` int NOT NULL DEFAULT 0,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `friend_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(150) NOT NULL,
	`url` text NOT NULL,
	`logo` text,
	`description` varchar(1000) NOT NULL DEFAULT '',
	`status` varchar(20) NOT NULL DEFAULT 'active',
	`sort` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `friend_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rss_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(150) NOT NULL,
	`url` varchar(250) NOT NULL,
	`category_id` int,
	`last_fetched_at` timestamp,
	`status` varchar(20) NOT NULL DEFAULT 'active',
	CONSTRAINT `rss_sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `rss_sources_url_unique` UNIQUE(`url`)
);
--> statement-breakpoint
CREATE TABLE `sites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(150) NOT NULL,
	`slug` varchar(150) NOT NULL,
	`url` text NOT NULL,
	`description` varchar(1000) NOT NULL DEFAULT '',
	`logo` text,
	`category_id` int,
	`tags` json NOT NULL,
	`clicks` int NOT NULL DEFAULT 0,
	`status` varchar(20) NOT NULL DEFAULT 'active',
	`featured` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `sites_id` PRIMARY KEY(`id`),
	CONSTRAINT `sites_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(20) NOT NULL,
	`name` varchar(150) NOT NULL,
	`url` text NOT NULL,
	`description` varchar(1000) NOT NULL DEFAULT '',
	`email` varchar(255),
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(200) NOT NULL,
	`password_hash` text NOT NULL,
	`name` varchar(100) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `articles` ADD CONSTRAINT `articles_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rss_sources` ADD CONSTRAINT `rss_sources_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sites` ADD CONSTRAINT `sites_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `articles_published_idx` ON `articles` (`published_at`);--> statement-breakpoint
CREATE INDEX `articles_category_idx` ON `articles` (`category_id`);--> statement-breakpoint
CREATE INDEX `articles_source_idx` ON `articles` (`source`);--> statement-breakpoint
CREATE INDEX `sites_category_idx` ON `sites` (`category_id`);--> statement-breakpoint
CREATE INDEX `sites_featured_idx` ON `sites` (`featured`);