import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id')
    .references(() => workspaces.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  keyPrefix: varchar('key_prefix', { length: 8 }).notNull(),
  keyHash: text('key_hash').notNull(),
  rateLimitPerHour: integer('rate_limit_per_hour').default(1000).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id')
    .references(() => workspaces.id, { onDelete: 'cascade' })
    .notNull(),
  recipientId: varchar('recipient_id', { length: 255 }).notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  category: varchar('category', { length: 50 }).default('info').notNull(),
  actionUrl: text('action_url'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userPreferences = pgTable(
  'user_preferences',
  {
    id: uuid('id').defaultRandom().notNull(),
    workspaceId: uuid('workspace_id')
      .references(() => workspaces.id, { onDelete: 'cascade' })
      .notNull(),
    recipientId: varchar('recipient_id', { length: 255 }).notNull(),
    mutedCategories: text('muted_categories').array().default([]).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.workspaceId, table.recipientId] }),
  })
);

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  tier: varchar('tier', { length: 50 }).default('free').notNull(),
  status: varchar('status', { length: 50 }).default('active').notNull(),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  currentPeriodEnd: timestamp('current_period_end'),
  notificationsSentThisMonth: integer('notifications_sent_this_month')
    .default(0)
    .notNull(),
});
