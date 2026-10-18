# Backend Xupply (Hackathon) — API REST + Tiempo Real

Backend completo de la plataforma B2B: catálogo, pedidos, inventario (FEFO), facturación (DIAN/CUFE), logística con GPS en tiempo real, contabilidad, dashboard y agente de IA (XupAI).

- **Stack**: Node.js + Express + TypeScript + PostgreSQL (`pg`) + Socket.IO
- **Auto-inicialización**: al arrancar, el servidor verifica/crea el esquema (`src/config/schemaSql.ts`) y aplica migraciones (`src/lib/migrations.ts`). No hace falta ejecutar SQL a mano.
- Sincronizado con el proyecto completo (`xupply-D` → `app/server`).

---

## 📁 Estructura

```text
.
├── src/
│   ├── server.ts             # Punto de entrada HTTP + Socket.IO + arranque de BD
│   ├── app.ts                # Express: CORS, healthcheck, rutas, APK, estáticos
│   ├── index.ts              # Entrada de compatibilidad (Vercel)
│   ├── config/
│   │   ├── db.ts             # Pool PostgreSQL + resolución de DATABASE_URL
│   │   └── schemaSql.ts      # Esquema completo embebido (auto-init)
│   ├── middleware/
│   │   ├── auth.ts           # JWT, roles, permisos, token_version
│   │   ├── error.ts          # Manejo global de errores
│   │   └── rateLimit.ts      # Limitador para login/registro
│   ├── routes/               # Todos los módulos de la API (ver abajo)
│   └── lib/                  # audit, email, geo/Bucaramanga, migrations, radar, realtime...
├── scripts/
│   ├── smoke.ts              # Pruebas de humo RBAC/admin
│   ├── populate_mock_data.js # Datos mock
│   └── README.md
├── insert_vehicles.ts        # Siembra vehículos demo (GPS/logística)
├── Xupply_postgresql.sql     # Esquema canónico (idempotente, mismo que auto-crea el server)
├── multimedia_postgresql.sql # Módulo de media independiente
└── schema.sql                # Esquema mínimo legado del módulo login/carrito
```

---

## ⚡ Puesta en marcha

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Variables de entorno**: copia `.env.example` a `.env` y configura como mínimo:
   ```env
   PORT=4000
   DATABASE_URL=postgres://usuario:password@localhost:5432/xupply
   JWT_SECRET=<secreto-largo-aleatorio>
   CLIENT_ORIGIN=http://localhost:5173
   ```

3. **Base de datos**: crea la base en PostgreSQL (por ejemplo `xupply`) y arranca el servidor; el esquema se crea/actualiza solo. Si prefieres hacerlo manual:
   ```bash
   psql -U postgres -d xupply -f Xupply_postgresql.sql
   ```

4. **Modo desarrollo**
   ```bash
   npm run dev          # http://localhost:4000  (verifica con /health)
   ```

5. **Producción**
   ```bash
   npm run build
   npm start
   ```

### Scripts útiles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor en modo desarrollo (tsx watch) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta el build (`dist/server.js`) |
| `npm run typecheck` | Verificación de tipos (src + scripts) |
| `npm run smoke` | Pruebas de humo del API (requiere server + BD) |
| `npx tsx insert_vehicles.ts` | Siembra vehículos demo |
| `node scripts/populate_mock_data.js` | Datos mock adicionales |

---

## 🔌 Endpoints principales

| Prefijo | Módulo |
| --- | --- |
| `/api/auth` | Login, registro, perfil, roles, cambio de plan |
| `/api/restaurants` | Restaurantes y sucursales |
| `/api/suppliers` | Proveedores |
| `/api/products` | Catálogo de productos |
| `/api/categories` | Categorías |
| `/api/orders` | Pedidos B2B (ciclo de vida completo) |
| `/api/inventory` | Inventario / FEFO / movimientos |
| `/api/invoices` | Facturación electrónica (DIAN/CUFE) |
| `/api/reviews` | Reseñas de proveedores |
| `/api/accounting` | Contabilidad y flujo de caja |
| `/api/deliveries` | Entregas y seguimiento GPS |
| `/api/dashboard` | KPIs ejecutivos |
| `/api/ai` | Motor de predicciones |
| `/api/users` | Usuarios |
| `/api/radar` | Radar de alertas/ofertas |
| `/api/purchase-orders` | Órdenes de compra |
| `/api/agent` | Agente operativo |
| `/api/xupai` | Asistente XupAI (DeepSeek) |
| `/api/admin` | Panel de administración |
| `/health` | Estado del servicio + base de datos |

Tiempo real: Socket.IO sobre el mismo servidor (salas por usuario, proveedor, pedido y entrega; GPS de entregas solo a partes autorizadas).

---

## 👥 Usuarios demo (contraseña: `demo1234`)

`admin`, `gerente`, `empleado`, `proveedor`, `domiciliario` — **cambiar contraseñas en producción**.

---

## 🔐 Notas

- `JWT_SECRET` es obligatorio en producción; sin él el servidor no arranca (falla cerrado).
- `CLIENT_ORIGIN` funciona como lista blanca de CORS (HTTP y Socket.IO).
- El login no tiene atajos: solo `bcrypt.compare` contra el hash real.
- Los cambios de rol/contraseña invalidan sesiones vía `token_version`.
