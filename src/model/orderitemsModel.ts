import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { orderItems } from "../db/schema/orderitems.js";

type OrdersItemCreateInput = {
  orderId: number;
  productId: number;
  quantity: number;
  price: string;
};

type OrdersItemUpdateInput = Partial<OrdersItemCreateInput>;

export const OrderItemsModel = {
  getAll() {
    return db.select().from(orderItems);
  },

  getById(id: number) {
    return db.select().from(orderItems).where(eq(orderItems.id, id));
  },

  async create(data: OrdersItemCreateInput) {
    const result = await db.insert(orderItems).values(data);

    const insertId = result[0]?.insertId;
    if (!insertId) throw new Error("Failed to insert order item");

    const [newOrderItem] = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.id, insertId));

    return newOrderItem;
  },

  async createMany(items: OrdersItemCreateInput[]) {
    return db.insert(orderItems).values(items);
  },

  update(id: number, updates: OrdersItemUpdateInput) {
    return db.update(orderItems).set(updates).where(eq(orderItems.id, id));
  },

  delete(id: number) {
    return db.delete(orderItems).where(eq(orderItems.id, id));
  }
};