import { mysqlTable, int, varchar, text, decimal, mysqlEnum, timestamp } from "drizzle-orm/mysql-core";
import { users } from "./users.js";

export const orders = mysqlTable("orders", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").references(() => users.id),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  shipping: varchar("shipping", { length: 50 }).notNull(), // e.g. JNE, J&T, SiCepat
  payment: varchar("payment", { length: 50 }).notNull(),   // e.g. COD, BCA, OVO
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
  // paymentImage: varchar("image_url", { length: 255 }).default("null"),
  status: mysqlEnum("status", ["pending", "paid", "shipped", "delivered"]).default("pending"),
  createdAt: timestamp("created_at").defaultNow()
});