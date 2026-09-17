import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { initDatabase } from './config/db';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  await initDatabase();
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`[Zupply Backend Auth & Cart] Servidor corriendo en http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Error al iniciar el servidor:', err);
});
