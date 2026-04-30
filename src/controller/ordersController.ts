import { db } from "../db/index.js";
import { OrdersModel } from "../model/ordersModel.js";

export const OrdersController = {
async getAll(c: any) {
  const page = c.req.query("page");
  const limit = c.req.query("limit");

  const products = await OrdersModel.getAll(
    page ? Number(page) : undefined,
    limit ? Number(limit) : undefined
  );

  return c.json({ data: products });
},


  async getById(c: any) {
    const id = Number(c.req.param("id"));
    const orders = (await OrdersModel.getById(id))[0];
    if (!orders) return c.json({ error: "order not found" }, 404);
    return c.json(orders);
  },

    async getByUserId(c: any) {
      const user = c.get("user");
      if (!user) return c.json({ error: "Unauthorized" }, 401);
  
      const data = await OrdersModel.getByUserId(user.id);
      return c.json(data);
    },

  async getByStatus(c: any) {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const status = c.req.query("eq") as "pending" | "paid" | "shipped" | "delivered";

    if (!status) {
      return c.json({ error: "Status is required" }, 400);
    }

    const data = await OrdersModel.getByStatus(status);
    return c.json(data);
  },

  async create(c: any) {
    try {
      const data = await c.req.json();
      const inserted = await OrdersModel.create(data);
      return c.json(inserted);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async update(c: any) {
    try {
      const id = Number(c.req.param("id"));
      const updates = await c.req.json();
      await OrdersModel.update(id, updates);
      return c.json({ message: "order updated" });
    } catch (err: any) {
      return c.json({ error: err.message }, 404);
    }
  },

  async updateStatus(c: any){
    try {
      const id = Number(c.req.param("id"));
      const {status} = await c.req.json();
      if (!status) {
        return c.json({error: "Status is required"}, 400)
      }
      await OrdersModel.updateStatus(id, status);
      return c.json({message: "Order status updated"});
    } catch (err: any){
      return c.json({error: err.message}, 404);
    }
  },

  async delete(c: any) {
    try {
      const id = Number(c.req.param("id"));
      await OrdersModel.delete(id);
      return c.json({ message: "order deleted" });
    } catch (err) {
      console.error(err)
      return c.json({error: 'Failed to delete order'}, 500)
    }
  }
}