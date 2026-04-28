import { Hono } from "hono";
import { UserController } from "../controller/userController.js";
import { CategoryController } from "../controller/categoriesController.js";
export const CategoryRouter = new Hono();

// Public routes
CategoryRouter.get('/', CategoryController.getAll);
CategoryRouter.get('/:id', CategoryController.getById);

// Admin-only routes
CategoryRouter.post(
  '/create', 
  UserController.authMiddleware, 
  UserController.adminMiddleware, 
  CategoryController.create
);

CategoryRouter.patch(
  '/:id', 
  UserController.authMiddleware, 
  UserController.adminMiddleware, 
  CategoryController.update
);

CategoryRouter.delete(
  '/:id', 
  UserController.authMiddleware, 
  UserController.adminMiddleware, 
  CategoryController.delete
);