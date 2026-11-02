import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export * from "./auth-schema";

export const CATEGORIES = ["casa", "familia", "projetos", "vida-real"] as const;
export type Category = (typeof CATEGORIES)[number];

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  amountCents: integer("amount_cents").notNull(),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  category: text("category", { enum: CATEGORIES }).notNull(),
  occurredOn: text("occurred_on").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const goals = sqliteTable("goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  category: text("category", { enum: CATEGORIES }).notNull(),
  targetCents: integer("target_cents").notNull(),
  savedCents: integer("saved_cents").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

