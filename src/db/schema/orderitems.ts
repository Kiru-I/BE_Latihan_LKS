import { mysqlTable, int, varchar, text, decimal } from "drizzle-orm/mysql-core";
import { products } from "./products.js";
import { orders } from "./orders.js";

export const orderItems = mysqlTable("order_items", {
    id: int("id").primaryKey().autoincrement(),
    orderId: int("order_id").references(() => orders.id),
    productId: int("product_id").references(() => products.id),
    quantity: int("quantity"),
    price: decimal("price", { precision: 10, scale: 2 })
});