import { mysqlTable, int, varchar, text, decimal, mysqlEnum, timestamp } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", {length: 100}),
    email: varchar("email", {length: 100}).unique(),
    password: varchar("password", {length:255}),
    role: mysqlEnum("role", ["customer", "admin"]).default("customer"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow()
});