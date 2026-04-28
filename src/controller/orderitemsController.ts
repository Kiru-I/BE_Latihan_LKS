import { db } from "../db/index.js";
import { OrderItemsModel } from "../model/orderitemsModel.js";

export const OrderItemsController = {
  async getAll(c: any) {
    const data = await OrderItemsModel.getAll();
    return c.json(data);
  },

  async getById(c: any) {
    const id = Number(c.req.param("id"));
    const orders = (await OrderItemsModel.getById(id))[0];
    if (!orders) return c.json({ error: "order not found" }, 404);
    return c.json(orders);
  },

  async create(c: any) {
    try {
      const data = await c.req.json();
      const inserted = await OrderItemsModel.create(data);
      return c.json(inserted);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async update(c: any) {
    try {
      const id = Number(c.req.param("id"));
      const updates = await c.req.json();
      await OrderItemsModel.update(id, updates);
      return c.json({ message: "order updated" });
    } catch (err: any) {
      return c.json({ error: err.message }, 404);
    }
  },

  async delete(c: any) {
    try {
      const id = Number(c.req.param("id"));
      await OrderItemsModel.delete(id);
      return c.json({ message: "order deleted" });
    } catch (err: any) {
      return c.json({ error: err.message }, 404);
    }
  }
};