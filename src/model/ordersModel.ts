import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { orders } from "../db/schema/orders.js";
import { orderItems } from "../db/schema/orderitems.js";

type OrdersCreateInput = {
  userId: number;
  payment: string;
  shipping: string;
  name: string;
  phone: string;
  address: string;
};

type OrdersUpdateInput = Partial<OrdersCreateInput>;
type OrderStatus = "pending" | "paid" | "shipped" | "delivered";

export const OrdersModel = {
  getAll() {
    return db.select().from(orders);
  },

  getById(id: number) {
    return db.select().from(orders).where(eq(orders.id, id));
  },

getByStatus(status: OrderStatus) {
  return db.select().from(orders).where(eq(orders.status, status));
},

  getByUserId(id: number){
    return db.select().from(orders).where(eq(orders.userId, id));
  },

  async create(data: OrdersCreateInput & { totalPrice: string }) {
    const result = await db.insert(orders).values(data);

    const insertId = result[0]?.insertId;
    if (!insertId) throw new Error("Failed to insert order");

    const [newOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, insertId));

    return newOrder;
  },

  update(id: number, updates: OrdersUpdateInput) {
    return db.update(orders).set(updates).where(eq(orders.id, id));
  },

 async delete(id: number) {
    return await db.transaction(async (tx) => {
      await tx
        .delete(orderItems)
        .where(eq(orderItems.orderId, id));

      const result = await tx
        .delete(orders)
        .where(eq(orders.id, id));

      return result;
    });
  },
  // uploadImage(id: number, imagePath: string) {
  //   return db
  //     .update(orders)
  //     .set({ paymentImage: imagePath })
  //     .where(eq(orders.id, id));
  // }
};