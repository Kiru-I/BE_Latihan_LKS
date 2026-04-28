import { db } from "../db/index.js";
import { CategoryModel } from "../model/categoriesModel.js";

export const CategoryController = {
  async getAll(c: any) {
    const data = await CategoryModel.getAll();
    return c.json(data);
  },

    async getById(c: any) {
        const id = Number(c.req.param("id"));   
        const data = (await CategoryModel.getById(id))[0];
        if (!data) return c.json({ error: "Category not found" }, 404);
        return c.json(data);
    },

    async create(c: any) {
    try {
        const data = await c.req.json();

        if (!data.name || typeof data.name !== "string") {
        return c.json({ error: "Name is required" }, 400);
        }

        const inserted = await CategoryModel.create({
        name: data.name,
        });

        return c.json(inserted, 201);
    } catch (err: any) {
        return c.json({ error: "Internal Server Error" }, 500);
    }
    },

  async update(c: any) {
    try {
      const id = Number(c.req.param("id"));
      const updates = await c.req.json();
      await CategoryModel.update(id, updates);
      return c.json({ message: "Category updated" });
    } catch (err: any) {
      return c.json({ error: err.message }, 404);
    }
  },

  async delete(c: any) {
    try {
      const id = Number(c.req.param("id"));
      await CategoryModel.delete(id);
      return c.json({ message: "Category deleted" });
    } catch (err: any) {
      return c.json({ error: err.message }, 404);
    }
  }
};