import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import ordersRouter from './routes/orders';
import productsRouter from './routes/products';
import { notFound, errorHandler } from './middleware/error';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(express.json());

  // Endpoint de salud
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'zupply-auth-cart-api' });
  });

  // Rutas principales del módulo
  app.use('/api/auth', authRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/products', productsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
