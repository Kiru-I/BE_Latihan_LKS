import { Hono } from "hono";
import { productController } from "../controller/productsController.js";
import { UserController } from "../controller/userController.js";
export const productRouter = new Hono();

// Public
productRouter.get('/', productController.getAll);
productRouter.get('/search', productController.search)
productRouter.get('/:id', productController.getById);
productRouter.get('/category/:categoryId', productController.getByCategoryId);


// Admin
productRouter.post(
  '/create', 
  UserController.authMiddleware, 
  UserController.adminMiddleware, 
  productController.create
);

productRouter.patch(
  '/:id', 
  UserController.authMiddleware, 
  UserController.adminMiddleware, 
  productController.update
);

productRouter.delete(
  '/delete/:id', 
  UserController.authMiddleware, 
  UserController.adminMiddleware, 
  productController.delete
);