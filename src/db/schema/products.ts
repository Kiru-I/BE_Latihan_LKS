import { mysqlTable, int, varchar, text, decimal, boolean} from "drizzle-orm/mysql-core";
import { categories } from "./categories.js";
import { is } from "drizzle-orm";

export const products = mysqlTable("products", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  stock: int("stock").default(0),
  categoryId: int("category_id").references(() => categories.id),
  imageUrl: varchar("image_url", { length: 255 }),
  isDeleted: boolean("is_deleted").default(false)
});