import jwt from "jsonwebtoken";
import { UserModel } from "../model/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const UserController = {
  async register(c: any) {
    const { name, email, password } = await c.req.json();

    const existing = await UserModel.findByEmail(email);
    if (existing) return c.json({ error: "Email already exists" }, 400);

    await UserModel.create({
      name,
      email,
      password
    });

    return c.json({ message: "User registered successfully" });
  },

  async login(c: any) {
    const { email, password } = await c.req.json();

    const user = await UserModel.findByEmail(email);
    if (!user) return c.json({ error: "Invalid credentials" }, 401);

    const valid = await UserModel.validatePassword(user, password);
    if (!valid) return c.json({ error: "Invalid credentials" }, 401);

    const token = jwt.sign(
      {message: "Login Berhasil", id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return c.json({ token });
  },

async getMe(c: any) {
  const authUser = c.get("user");
  if (!authUser) return c.json({ error: "Unauthorized" }, 401);

  const dbUser = await UserModel.findByEmail(authUser.email);

  if (!dbUser) return c.json({ error: "User not found" }, 404);

  const { password, ...safeUser } = dbUser;

  return c.json(safeUser);
},

  async getAll(c: any) {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const users = await UserModel.getAll();
    return c.json({ users });
  },

  async deleteUser(c: any) {
    try {
      const id = Number(c.req.param("id"));

      await UserModel.delete(id);

      return c.json({ message: "User deleted" });
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

async updateUser(c: any) {
  try {
    const id = Number(c.req.param("id"));
    const authUser = c.get("user");

    if (!authUser) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (authUser.id !== id && authUser.role !== "admin") {
      return c.json({ error: "Forbidden" }, 403);
    }

    const updates = await c.req.json();

    if (updates.role && authUser.role !== "admin") {
      return c.json({ error: "Cannot change role" }, 403);
    }

  await UserModel.update(id, updates);

  return c.json({ message: "User updated" });
} catch (err: any) {
  return c.json({ error: err.message }, 400);
}
},

  // AUTH MIDDLEWARE
  authMiddleware: async (c: any, next: any) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) return c.json({ error: "No token provided" }, 401);

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      c.set("user", decoded);
      await next();
    } catch {
      return c.json({ error: "Invalid token" }, 401);
    }
  },

  // ADMIN-ONLY MIDDLEWARE
  adminMiddleware: async (c: any, next: any) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    if (user.role !== "admin") {
      return c.json({ error: "Forbidden: Admins only" }, 403);
    }

    await next();
  },
};