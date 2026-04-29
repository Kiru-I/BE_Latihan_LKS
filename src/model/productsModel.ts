import { db } from "../db/index.js";
import { products } from "../db/schema/products.js";
import { categories } from "../db/schema/categories.js";
import { eq, or, like } from "drizzle-orm";

type ProductCreateInput = {
  name: string;
  description: string;
  price: number;
  stock?: number;
  categoryId: number;
  imageUrl?: string | null;
};

type ProductUpdateInput = Partial<ProductCreateInput>;

export const ProductModel = {
  getAll(page?: number, limit?: number) {
    const query = db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        stock: products.stock,
        imageUrl: products.imageUrl,
        description: products.description,
        categoryId: products.categoryId,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id));

    if (page && limit) {
      const offset = (page - 1) * limit;
      query.limit(limit).offset(offset);
    }

    return query;
  },

  getById(id: number) {
    return db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        stock: products.stock,
        imageUrl: products.imageUrl,
        categoryId: products.categoryId,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id));
  },

  async getByCategoryId(categoryId: number) {
    const result = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        imageUrl: products.imageUrl,
        categoryId: products.categoryId,
      })
      .from(products)
      .where(eq(products.categoryId, categoryId));

    const category = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(eq(categories.id, categoryId));

    return {
      category: category[0] || null,
      products: result,
    };
  },

  search(query: string) {
    const q = `%${query}%`;
    return db
      .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          stock: products.stock,
          imageUrl: products.imageUrl,
          categoryId: products.categoryId,
          categoryName: categories.name,
        })
      .from(products)
      .where(
        or(
          like(products.name, q),
          like(products.description, q),
          like(categories.name, q)
        ) 
      )
      .leftJoin(categories, eq(products.categoryId, categories.id));
  },

  create(data: ProductCreateInput) {
    console.log("MODEL RECEIVED:", data); // 🔥 IMPORTANT
    return db.insert(products).values({
      name: data.name,
      description: data.description,
      price: data.price.toString(),
      stock: data.stock ?? 0,
      categoryId: data.categoryId,
      imageUrl: data.imageUrl || null,
    });
  },

  update(id: number, updates: ProductUpdateInput) {
    const safeUpdates: any = {};

    if (updates.name !== undefined) safeUpdates.name = updates.name;
    if (updates.description !== undefined) safeUpdates.description = updates.description;
    if (updates.price !== undefined) safeUpdates.price = updates.price.toString();
    if (updates.stock !== undefined) safeUpdates.stock = updates.stock;
    if (updates.categoryId !== undefined) safeUpdates.categoryId = updates.categoryId;
    if (updates.imageUrl !== undefined) safeUpdates.imageUrl = updates.imageUrl;

    return db
      .update(products)
      .set(safeUpdates)
      .where(eq(products.id, id));
  },

  delete(id: number) {
    return db.delete(products).where(eq(products.id, id));
  },
};