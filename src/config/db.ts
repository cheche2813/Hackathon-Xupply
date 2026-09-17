import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1:5432/zupply';

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('neon.tech') || databaseUrl.includes('render.com')
    ? { rejectUnauthorized: false }
    : undefined,
});

export const query = (text: string, params?: unknown[]) => pool.query(text, params);

export async function initDatabase() {
  try {
    const res = await pool.query("SELECT to_regclass('public.users')");
    if (!res.rows[0]?.to_regclass) {
      console.log('[DB] Inicializando esquema de base de datos PostgreSQL...');
      const sqlPath = path.join(__dirname, '..', '..', 'schema.sql');
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, 'utf-8');
        await pool.query(sql);
        console.log('[DB] Esquema y tablas creadas exitosamente.');
      }
    } else {
      console.log('[DB] Conexión establecida y tablas verificadas.');
    }
  } catch (err) {
    console.error('[DB] Error verificando/inicializando base de datos:', err);
  }
}
