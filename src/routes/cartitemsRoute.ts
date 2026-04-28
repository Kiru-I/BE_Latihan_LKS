import { Hono } from "hono";
import { CartItemsController } from "../controller/cartitemsController.js";
import { UserController } from "../controller/userController.js";

export const CartItemsRouter = new Hono();

// 🔐 protect all routes
CartItemsRouter.use("*", UserController.authMiddleware);

CartItemsRouter.get("/", CartItemsController.getCart);
CartItemsRouter.get("/:productId", CartItemsController.getItem);
CartItemsRouter.post("/", CartItemsController.addToCart);
CartItemsRouter.put("/:productId", CartItemsController.updateQuantity);
CartItemsRouter.patch("/:productId/increase", CartItemsController.increase);
CartItemsRouter.patch("/:productId/decrease", CartItemsController.decrease);
CartItemsRouter.delete("/:productId", CartItemsController.removeItem);
CartItemsRouter.delete("/", CartItemsController.clearCart);