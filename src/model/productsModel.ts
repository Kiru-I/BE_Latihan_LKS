import { db } from "../db/index.js";
import { cartitems } from "../db/schema/cartitems.js";
import { categories } from "../db/schema/categories.js";
import { orderItems } from "../db/schema/orderitems.js";
import { products } from "../db/schema/products.js";
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
getAll() {
  return db
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
},

getAllAdmin() {
  return db
    .select({
      id: products.id,  
      name: products.name,
      price: products.price,
      imageUrl: products.imageUrl,
      categoryId: products.categoryId,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id));
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

  // get category separately
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
  }
},

  search(query: string) {
      const q = `%${query}%`; // for partial match
      return db
        .select()
        .from(products)
        .where(
          or(
            like(products.name, q),
            like(products.description, q)
          )
        );
    },

  create(data: ProductCreateInput) {
    const safeData = {
      ...data,
      price: data.price.toFixed(2),
    };
    return db.insert(products).values(safeData);
  },

  update(id: number, updates: ProductUpdateInput) {
    const safeUpdates: any = { ...updates };
    if (updates.price !== undefined) {
      safeUpdates.price = updates.price.toFixed(2);
    }
    return db.update(products).set(safeUpdates).where(eq(products.id, id));
  },

  delete(id: number) {
    
  }
};