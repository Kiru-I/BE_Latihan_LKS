import { Hono } from "hono";
import { UserController } from "../controller/userController.js";
import { OrderItemsController } from "../controller/orderitemsController.js";

export const OrderItemsRouter = new Hono();

// Public routes
OrderItemsRouter.get('/', OrderItemsController.getAll);
OrderItemsRouter.get('/:id', OrderItemsController.getById);

// Admin-only routes
OrderItemsRouter.post(
  '/create', 
  UserController.authMiddleware, 
  UserController.adminMiddleware, 
  OrderItemsController.create
);

OrderItemsRouter.patch(
  '/:id', 
  UserController.authMiddleware, 
  UserController.adminMiddleware, 
  OrderItemsController.update
);

OrderItemsRouter.delete(
  '/:id', 
  UserController.authMiddleware, 
  UserController.adminMiddleware, 
  OrderItemsController.delete
);