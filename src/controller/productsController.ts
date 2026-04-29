import { ProductModel } from "../model/productsModel.js";
import { uploadImage } from "../utils/uploadImage.js";

// helper
function getSingleFile(input: any): File | null {
  if (input instanceof File) return input;
  if (Array.isArray(input) && input[0] instanceof File) return input[0];
  return null;
}

export const productController = {
async getAll(c: any) {
  const page = c.req.query("page");
  const limit = c.req.query("limit");

  const products = await ProductModel.getAll(
    page ? Number(page) : undefined,
    limit ? Number(limit) : undefined
  );

  return c.json({ data: products });
},

  async getById(c: any) {
    const id = Number(c.req.param("id"));
    const product = (await ProductModel.getById(id))[0];

    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }

    return c.json(product);
  },

  async getByCategoryId(c: any) {
    const categoryId = Number(c.req.param("categoryId"));
    const result = await ProductModel.getByCategoryId(categoryId);
    return c.json(result);
  },

  async search(c: any) {
    try {
      const query = String(c.req.query("q") || "").trim();

      if (!query) {
        return c.json({ error: "Query cannot be empty" }, 400);
      }

      const results = await ProductModel.search(query);
      return c.json(results);
    } catch (err: any) {
      return c.json({ error: err.message }, 500);
    }
  },

  async create(c: any) {
    try {
      const body = await c.req.parseBody();

      const imageFile = getSingleFile(body.image);
      const uploaded = imageFile ? await uploadImage(imageFile) : null;

      const data = {
        name: String(body.name),
        description: String(body.description),
        price: Number(body.price),
        stock: Number(body.stock ?? 0),
        categoryId: Number(body.categoryId),
        imageUrl: uploaded?.url || null,
      };
      console.log(data)
      const inserted = await ProductModel.create(data);

      return c.json(inserted);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async update(c: any) {
    try {
      const id = Number(c.req.param("id"));
      const body = await c.req.parseBody();

      const imageFile = getSingleFile(body.image);
      const uploaded = imageFile ? await uploadImage(imageFile) : null;

      const updates: any = {};

      if (body.name !== undefined) updates.name = String(body.name);
      if (body.description !== undefined) updates.description = String(body.description);
      if (body.price !== undefined) updates.price = Number(body.price);
      if (body.stock !== undefined) updates.stock = Number(body.stock);
      if (body.categoryId !== undefined) updates.categoryId = Number(body.categoryId);

      if (uploaded?.url) {
        updates.imageUrl = uploaded.url;
      }

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
  },
};