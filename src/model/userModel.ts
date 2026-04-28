// userModel.ts
import bcrypt from "bcrypt";
import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import { eq } from "drizzle-orm";

export type UserInput = {
  name: string;
  email: string;
  password: string;
  role?: "customer" | "admin";
};

export const UserModel = {
  async create(data: UserInput) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = await db.insert(users).values({
      ...data,
      password: hashedPassword,
    });

    const insertId = result[0]?.insertId;

    const [newUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, insertId));

    return newUser;
  },

  async findByEmail(email: string) {
    const result = await db.select()
      .from(users)
      .where(eq(users.email, email));
    return result[0] || null;
  },

  async validatePassword(user: { password: string | null }, password: string) {
    if (!user.password) return false;
    return bcrypt.compare(password, user.password);
  },

  async getAll() {
    return db.select().from(users);
  },

    async delete(id: number) {
    return db.delete(users).where(eq(users.id, id));
  },

  async update(id: number, data: Partial<UserInput>) {
    return db.update(users).set(data).where(eq(users.id, id));
  },
};