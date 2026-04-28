import { db } from "../db/index.js";
import { eq, and } from "drizzle-orm";
import { cartitems } from "../db/schema/cartitems.js";
import { products } from "../db/schema/products.js";
import { categories } from "../db/schema/categories.js";

type CartItemsCreateInput = {
  userId: number;
  productId: number;
  quantity?: number;
};

type CartItemsUpdateInput = {
  quantity: number;
};

export const CartItemsModel = {
  getAll() {
    return db.select().from(cartitems);
  },

getByUser(userId: number) {
  return db
    .select({
      id: cartitems.id,
      productId: cartitems.productId,
      quantity: cartitems.quantity,

      name: products.name,
      price: products.price,
      image: products.imageUrl,
      category: categories.name
    })
    .from(cartitems)
    .innerJoin(products, eq(cartitems.productId, products.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(cartitems.userId, userId));
},

  getItem(userId: number, productId: number) {
    return db
      .select()
      .from(cartitems)
      .where(
        and(
          eq(cartitems.userId, userId),
          eq(cartitems.productId, productId)
        )
      );
  },

  async addToCart(data: CartItemsCreateInput) {
    const { userId, productId, quantity = 1 } = data;

    const [existing] = await db
      .select()
      .from(cartitems)
      .where(
        and(
          eq(cartitems.userId, userId),
          eq(cartitems.productId, productId)
        )
      );

    if (existing) {
      const newQty = existing.quantity + quantity;

      await db
        .update(cartitems)
        .set({ quantity: newQty })
        .where(eq(cartitems.id, existing.id));

      return { ...existing, quantity: newQty };
    }

    const result = await db.insert(cartitems).values({
      userId,
      productId,
      quantity,
    });

    const insertId = result[0]?.insertId;

    const [newItem] = await db
      .select()
      .from(cartitems)
      .where(eq(cartitems.id, insertId));

    return newItem;
  },

  updateQuantity(userId: number, productId: number, quantity: number) {
    return db
      .update(cartitems)
      .set({ quantity })
      .where(
        and(
          eq(cartitems.userId, userId),
          eq(cartitems.productId, productId)
        )
      );
  },

  async increase(userId: number, productId: number) {
    const [item] = await this.getItem(userId, productId);
    if (!item) throw new Error("Item not found");

    return db
      .update(cartitems)
      .set({ quantity: item.quantity + 1 })
      .where(eq(cartitems.id, item.id));
  },

  async decrease(userId: number, productId: number) {
    const [item] = await this.getItem(userId, productId);
    if (!item) throw new Error("Item not found");

    if (item.quantity <= 1) {
      throw new Error("Minimum quantity is 1");
    }

    return db
      .update(cartitems)
      .set({ quantity: item.quantity - 1 })
      .where(eq(cartitems.id, item.id));
  },

  removeItem(userId: number, productId: number) {
    return db
      .delete(cartitems)
      .where(
        and(
          eq(cartitems.userId, userId),
          eq(cartitems.productId, productId)
        )
      );
  },

  clearCart(userId: number) {
    return db
      .delete(cartitems)
      .where(eq(cartitems.userId, userId));
  },
};