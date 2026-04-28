import { db } from "../db/index.js";
import { eq, sql } from "drizzle-orm";

import { orders } from "../db/schema/orders.js";
import { orderItems } from "../db/schema/orderitems.js";
import { cartitems } from "../db/schema/cartitems.js";
import { products } from "../db/schema/products.js";

type CheckoutInput = {
  payment: string;
  shipping: string;
  name: string;
  phone: string;
  address: string;
};

export async function checkout(userId: number, data: CheckoutInput) {
  return db.transaction(async (tx) => {
    // 0. basic validation
    if (!data.payment) throw new Error("Payment required");
    if (!data.shipping) throw new Error("Shipping required");
    if (!data.address) throw new Error("Address required");

    // 1. get cart items + product data
    const items = await tx
      .select({
        productId: cartitems.productId,
        quantity: cartitems.quantity,
        price: products.price,
        stock: products.stock
      })
      .from(cartitems)
      .innerJoin(products, eq(cartitems.productId, products.id))
      .where(eq(cartitems.userId, userId));

    if (items.length === 0) {
      throw new Error("Cart is empty");
    }

    // 2. calculate total
    let total = 0;
    for (const item of items) {
      if (!item.stock || item.quantity > item.stock) {
        throw new Error("Stock not enough");
      }
      total += Number(item.price) * item.quantity;
    }

    // 3. create order
    const result = await tx.insert(orders)
      .values({
        userId,
        payment: data.payment,
        shipping: data.shipping,
        name: data.name,
        phone: data.phone,
        address: data.address,
        totalPrice: total.toString(),
      })
      .$returningId();

    const orderId = result[0]?.id;

    if (!orderId) {
      throw new Error("Failed to create order");
    }

    // 4. insert order items
    const orderItemsData = items.map((item) => ({
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    await tx.insert(orderItems).values(orderItemsData);

    // 5. atomic stock update (prevents race condition)
    for (const item of items) {
      const updated = await tx
        .update(products)
        .set({
          stock: sql`${products.stock} - ${item.quantity}`
        })
        .where(
          sql`${products.id} = ${item.productId} AND ${products.stock} >= ${item.quantity}`
        );

      if (!updated[0] || updated[0].affectedRows === 0) {
        throw new Error("Stock conflict, please retry");
      }
    }

    // 6. clear cart
    await tx.delete(cartitems).where(eq(cartitems.userId, userId));

    // 7. return order + items (better for FE)
    const [newOrder] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    return {
      order: newOrder,
      items: orderItemsData
    };
  });
}