import { Hono } from "hono";
import { UserController } from "../controller/userController.js";

export const userRouter = new Hono();

userRouter.post("/register", UserController.register);
userRouter.post("/login", UserController.login);

userRouter.get("/", UserController.authMiddleware, UserController.getMe);

userRouter.get(
  "/all",
  UserController.authMiddleware,
  UserController.adminMiddleware,
  UserController.getAll
);

userRouter.delete(
  "/:id",
  UserController.authMiddleware,
  UserController.adminMiddleware,
  UserController.deleteUser
);

userRouter.patch(
  "/:id",
  UserController.authMiddleware,
  UserController.updateUser
);