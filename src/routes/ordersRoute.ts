import { Hono } from "hono";
import { UserController } from "../controller/userController.js";
import { OrdersController } from "../controller/ordersController.js";
import { checkout } from "../middleware/checkout.js";

type Variables = {
  user: {
    id: number
  }
}

export const OrdersRouter = new Hono<{ Variables: Variables }>();


OrdersRouter.get('/', UserController.authMiddleware, UserController.adminMiddleware, OrdersController.getAll);
OrdersRouter.get('/user', UserController.authMiddleware, OrdersController.getByUserId);
OrdersRouter.get('/status', UserController.authMiddleware, UserController.adminMiddleware, OrdersController.getByStatus);
OrdersRouter.get('/:id', UserController.authMiddleware, UserController.adminMiddleware, OrdersController.getById);


// Admin-only routes
OrdersRouter.post(
  '/create', 
  UserController.authMiddleware, 
  UserController.adminMiddleware, 
  OrdersController.create
);

OrdersRouter.patch(
  '/:id', 
  UserController.authMiddleware, 
  UserController.adminMiddleware, 
  OrdersController.update
);  

OrdersRouter.delete(
  '/:id', 
  UserController.authMiddleware, 
  UserController.adminMiddleware, 
  OrdersController.delete
);

OrdersRouter.post("/checkout", UserController.authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const user = c.get("user"); // from JWT

    const order = await checkout(user.id, {
      payment: body.payment,
      shipping: body.shipping,
      name: body.name,
      phone: body.phone,
      address: body.address,
    });

    return c.json({ message : "Order created",data : order}, 200);
  } catch (err: any) {
    console.error(err);
    return c.json({ message: err.message }, 400);
  }
});