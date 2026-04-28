import { mysqlTable, int, varchar, text, decimal } from "drizzle-orm/mysql-core";

export const categories = mysqlTable("categories", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", {length: 100})
});