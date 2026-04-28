import { CartItemsModel } from "../model/cartitemsModel.js";

export const CartItemsController = {

  // ✅ GET /api/cart
  async getCart(c: any) {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const data = await CartItemsModel.getByUser(user.id);
    return c.json(data);
  },

  // ✅ GET /api/cart/:productId
  async getItem(c: any) {
    const user = c.get("user");
    const productId = Number(c.req.param("productId"));

    const [item] = await CartItemsModel.getItem(user.id, productId);

    if (!item) return c.json({ error: "Item not found" }, 404);

    return c.json(item);
  },

  // ✅ POST /api/cart
  async addToCart(c: any) {
    try {
      const user = c.get("user");
      const body = await c.req.json();

      const result = await CartItemsModel.addToCart({
        userId: user.id,
        productId: Number(body.productId),
        quantity: body.quantity || 1,
      });

      return c.json({message: "Added to cart",data : result}, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  // ✅ PUT /api/cart/:productId
  async updateQuantity(c: any) {
    try {
      const user = c.get("user");
      const productId = Number(c.req.param("productId"));
      const { quantity } = await c.req.json();

      if (quantity < 1) {
        return c.json({ error: "Quantity must be at least 1" }, 400);
      }

      await CartItemsModel.updateQuantity(user.id, productId, quantity);

      return c.json({ message: "Quantity updated" });
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  // ✅ PATCH increase
  async increase(c: any) {
    try {
      const user = c.get("user");
      const productId = Number(c.req.param("productId"));

      await CartItemsModel.increase(user.id, productId);

      return c.json({ message: "Increased" });
    } catch (err: any) {
      return c.json({ error: err.message }, 404);
    }
  },

  // ✅ PATCH decrease
  async decrease(c: any) {
    try {
      const user = c.get("user");
      const productId = Number(c.req.param("productId"));

      await CartItemsModel.decrease(user.id, productId);

      return c.json({ message: "Decreased" });
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  // ✅ DELETE /api/cart/:productId
  async removeItem(c: any) {
    try {
      const user = c.get("user");
      const productId = Number(c.req.param("productId"));

      await CartItemsModel.removeItem(user.id, productId);

      return c.json({ message: "Item removed" });
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  // ✅ DELETE /api/cart
  async clearCart(c: any) {
    try {
      const user = c.get("user");

      await CartItemsModel.clearCart(user.id);

      return c.json({ message: "Cart cleared" });
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};