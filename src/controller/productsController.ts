import { db } from "../db/index.js";
import { ProductModel } from "../model/productsModel.js";
import { uploadImage } from "../utils/uploadImage.js";

export const productController = {
  async getAll(c: any) {
    const products = await ProductModel.getAll();
    return c.json({ message: "Product fetched", data: products }, 200);
  },

  async getById(c: any) {
    const id = Number(c.req.param("id"));
    const product = (await ProductModel.getById(id))[0];
    if (!product) return c.json({ error: "Product not found" }, 404);
    return c.json(product);
  },

  async getByCategoryId(c: any) {
    const categoryId = Number(c.req.param("categoryId"));
    const products = await ProductModel.getByCategoryId(categoryId);
    return c.json(products);
  },

  async search(c: any) {
    try {
      const query = String(c.req.query("q") || "").trim();
      if (!query) return c.json({ error: "Query cannot be empty" }, 400);

      const results = await ProductModel.search(query);
      return c.json(results);
    } catch (err: any) {
      console.error(err); // logs real SQL errors
      return c.json({ error: err.message }, 500);
    }
  },
// create
  async create(c: any) {
    try {
      const body = await c.req.parseBody();
      
      let imageFile: File | null = null;

      if (body.image instanceof File) {
        imageFile = body.image;
      } else if (Array.isArray(body.image) && body.image[0] instanceof File) {
        imageFile = body.image[0];
      }

      console.log("IMAGE:", imageFile);
      
      const uploaded = imageFile ? await uploadImage(imageFile) : null;

      console.log("UPLOADED:", uploaded);

      const data = {
        name: body.name,
        description: body.description,
        price: Number(body.price),       // 🔥 fix type
        stock: Number(body.stock || 0),  // 🔥 fix type + default
        categoryId: Number(body.categoryId),
        imageUrl: uploaded?.url || null
      }

      const inserted = await ProductModel.create(data);

      return c.json(inserted);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async update(c: any) {
    try {
      const id = Number(c.req.param("id"));
      const updates = await c.req.json();
      await ProductModel.update(id, updates);
      return c.json({ message: "Product updated" });
    } catch (err: any) {
      return c.json({ error: err.message }, 404);
    }
  },

  async delete(c: any) {
    try {
      const id = Number(c.req.param("id"));
      await ProductModel.delete(id);
      return c.json({ message: "Product deleted" });
    } catch (err: any) {
      return c.json({ error: err.message }, 404);
    }
  }
};