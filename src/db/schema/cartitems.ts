import { mysqlTable, int, varchar, text, decimal } from "drizzle-orm/mysql-core";
import { products } from "./products.js"
import { users } from "./users.js";

export const cartitems = mysqlTable("cart_items", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").references(() => users.id),
  productId: int("product_id").references(() => products.id).notNull(),
  quantity: int("quantity").notNull().default(1),
}); 