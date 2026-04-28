import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from "hono/cors";
import { serveStatic } from '@hono/node-server/serve-static'

import { productRouter } from './routes/productsRoute.js'
import { userRouter } from './routes/userRoute.js'
import { CategoryRouter } from './routes/categoriesRoute.js';
import { OrdersRouter } from './routes/ordersRoute.js';
import { OrderItemsRouter } from './routes/orderitemRoute.js';
import { CartItemsRouter } from './routes/cartitemsRoute.js';

const app = new Hono()
app.use("*", cors({ origin: "*" }));
app.use('/uploads/*', serveStatic({ root: './' }))

const api = new Hono();

api.route("/cart", CartItemsRouter)
api.route("/product", productRouter)
api.route("/user", userRouter)
api.route("/category", CategoryRouter)
api.route("/order", OrdersRouter)
api.route("/orderitems", OrderItemsRouter)

app.route("/api", api)

serve({
  fetch: app.fetch,
  port: 8000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
