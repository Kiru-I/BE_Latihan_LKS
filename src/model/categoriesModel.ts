import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { categories } from "../db/schema/categories.js";

type CategoryCreateInput = {
  name: string
};

type CategoryUpdateInput = Partial<CategoryCreateInput>;

export const CategoryModel = {
    getAll() {
        return db.select().from(categories);
    },

    getById(id: number) {
        return db.select().from(categories).where(eq(categories.id, id));
    },

    async create(data: CategoryCreateInput) {
    const result = await db.insert(categories).values(data);

    const insertId = result[0]?.insertId;
    if (!insertId) throw new Error("Failed to insert category");

    const [newCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, insertId));

    return newCategory;
    },

    update(id: number, updates: CategoryUpdateInput) {
        return db.update(categories).set(updates).where(eq(categories.id, id));
    },

    delete(id: number) {
        return db.delete(categories).where(eq(categories.id, id));
    }
    };