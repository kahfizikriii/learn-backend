import type { Request, Response, NextFunction, Application } from 'express';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { errorHandler } from './middlewares/error.handlers';
import { errorResponse, successResponse } from './utils/respons';
import productRouter from './routes/product.route';
import categoryRouter from './routes/category.route';
import userRouter from './routes/user.route'
import ordersRouter from './routes/order.route'
import ordersItemsRouter from './routes/orderitems.route'
import authroute from './routes/auth.route';




const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use((req: Request, _res: Response, next: NextFunction) => {
  req.startTime = Date.now();
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return errorResponse(res, "Header X-API-Key wajib diisi!", 401);
  }

  if (apiKey !== "secret-api-key-123") {
    return errorResponse(res, "API Key tidak valid!", 403);
  }

  next();
});

app.get("/", (req: Request, res: Response) => {
  const time = Date.now() - (req as any).startTime;
  successResponse(res, "API Produk aktif!", { waktuProses: `${time}ms` });
});

// ROUTE TEST ERROR
app.get("/api/error-test", () => {
  throw new Error("Ini error test!");
});

app.use('/api/products', productRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/user', userRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/orderitems', ordersItemsRouter)
app.use('/api/auth', authroute)

// 404 fallback
app.use((req: Request) => {
  throw new Error(`Route ${req.originalUrl} tidak ditemukan!`);
});

// GLOBAL ERROR HANDLER
app.use(errorHandler);

export default app;