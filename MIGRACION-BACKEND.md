# Hackathon-Xupply — Backend de producción

Este repositorio (`cheche2813/Hackathon-Xupply`) contiene **solo el backend** de Xupply
(Express + TypeScript + PostgreSQL + Socket.IO). Es la versión endurecida y migrada
desde `JuanBerro-back/xupply-D` (`app/server`), lista para desplegar en producción.

- **Auditoría y hallazgos:** `SECURITY-AUDIT.md`
- **Correo enterprise (SPF/DKIM/DMARC):** `EMAIL-ENTERPRISE.md`
- **Variables de entorno:** `.env.example` (local) y `.env.production.example` (producción)

---

## 1. Qué cambió respecto al código anterior

### Seguridad (P0/P1)

| Área | Antes | Ahora |
|---|---|---|
| Usuarios demo | `admin` / `demo1234` creados siempre | Solo con `SEED_DEMO_DATA=true`; en producción se **neutralizan** las cuentas heredadas |
| Bootstrap de admin | Ninguno | `ADMIN_USERNAME` + `ADMIN_PASSWORD` (12+ caracteres) si la BD está vacía |
| Productos de proveedor | IDOR (leer/editar/borrar ajenos) | Ownership obligatorio + whitelist de campos + roles |
| Socket.IO | Sin autenticación (`client:identify`) | Handshake con JWT HS256, identidad fresca desde BD, salas derivadas del token |
| Planes | Cualquier usuario se cambiaba de plan | `admin` únicamente, planes en lista blanca |
| Código de entrega | Visible para todos / sin límite | Visible solo a roles autorizados, confirmación con rate limit y comparación en tiempo constante |
| XupAI | Sin límite, estado enviado por el cliente | 30 req/10 min, propuestas en servidor con TTL, topes de tamaño |
| CORS / proxy | `*` | Lista blanca `CLIENT_ORIGIN`, fail-closed en producción, `trust proxy` |
| Errores | Stack traces al cliente | `{ error, requestId }` genérico + log interno |
| Cabeceras | Ninguna | `helmet` (CSP, HSTS, nosniff, frame-options, referrer-policy) + equivalentes en Vercel/Caddy |
| Dashboard | Datos de otros inquilinos y cifras inventadas | Filtrado por `restaurant_id`, sin fallbacks falsos |
| Reseñas | Spam y columnas arbitrarias | 1 por usuario/proveedor, rating 1–5, whitelist |
| Admin | `LIMIT` arbitrario | Paginación acotada (100 / 200) |
| Migraciones | `UPDATE` peligrosos al arrancar | DDL idempotente; sin mutaciones de datos demo |

### Correo enterprise

`src/lib/email.ts` soporta SMTP corporativo, Resend y EmailJS (legacy) con autodetección:

- HTML + texto plano, `Reply-To`, `BCC` de auditoría, cabeceras anti-spam.
- Reintentos con backoff; `sendEmail()` nunca lanza (no rompe pedidos ni facturas).
- Diagnóstico: `GET /api/admin/email/status` y `POST /api/admin/email/test` (solo admin, solo su propio correo).
- Script: `npm run email:test -- correo@dominio.com`.

Detalle completo en `EMAIL-ENTERPRISE.md`.

---

## 2. Requisitos

- Node.js 20+
- PostgreSQL 14+ (16 recomendado)
- Opcional: Docker / Docker Compose para despliegue con TLS automático

---

## 3. Ejecución local

```bash
npm ci
cp .env.example .env      # completa DATABASE_URL y JWT_SECRET
npm run dev               # tsx watch src/server.ts
```

El esquema se crea/actualiza automáticamente al arrancar (`ensureServerInitialized`).
Sin `SEED_DEMO_DATA=true` no se crean datos de demostración.

Verificación:

```bash
npm run typecheck
npm run build
npm start                 # node dist/server.js
curl http://localhost:4000/health
```

---

## 4. Variables de entorno imprescindibles

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DATABASE_URL` | Sí | Cadena de conexión PostgreSQL (`postgres://user:pass@host:5432/db`). |
| `JWT_SECRET` | Sí en producción | 64+ caracteres aleatorios. El servidor no arranca en producción sin él. |
| `JWT_EXPIRES_IN` | Recomendado | `12h` por defecto. |
| `CLIENT_ORIGIN` | Sí en producción | Origen(es) del frontend separados por coma. Sin esto no se acepta CORS cruzado. |
| `SEED_DEMO_DATA` | Sí | `false` en producción (valor por defecto). |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Primer arranque | Crea el administrador inicial si la BD no tiene usuarios. |
| `MAIL_*`, `SMTP_*`, `RESEND_API_KEY` | Para enviar correo | Ver `EMAIL-ENTERPRISE.md`. |
| `DEEPSEEK_API_KEY` / `XUPAI_API_KEY` | Opcional | Agente XupAI. |

> Genera el secreto JWT con:
> `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

---

## 5. Opciones de despliegue

### 5.1 Vercel (solo API)

`vercel.json` ya define el preset Express, el build y las cabeceras de seguridad.

1. Importa el repo en Vercel.
2. Settings → Environment Variables: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`,
   `CLIENT_ORIGIN`, `SEED_DEMO_DATA=false`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` y las de correo.
3. Deploy.

> **Limitación:** Vercel es serverless; **Socket.IO no funciona** ahí. La app debe usar
> polling HTTP o desplegar el backend en Render/VPS/Docker para tiempo real.

### 5.2 Render

`render.yaml` crea el servicio y la base de datos. Define en el panel `CLIENT_ORIGIN`,
`ADMIN_USERNAME`, `ADMIN_PASSWORD` y las variables de correo (`sync: false`).
`JWT_SECRET` se genera automáticamente.

### 5.3 Docker Compose + Caddy (recomendado para producción real)

```bash
cp .env.production.example .env.production   # completa TODOS los valores
docker compose up -d --build
```

- `app`: Node 20, usuario `node`, filesystem de solo lectura, `cap_drop: ALL`, healthcheck.
- `db`: PostgreSQL 16 con volumen persistente (el esquema lo crea la app).
- `caddy`: TLS automático (Let's Encrypt) para `DOMAIN`, cabeceras de seguridad y proxy WebSocket.

Verifica:

```bash
curl -I https://TU_DOMINIO/health
```

### 5.4 Docker suelto

```bash
docker build -t xupply-backend .
docker run --env-file .env.production -p 4420:4420 xupply-backend
```

---

## 6. Checklist de puesta en producción

- [ ] `JWT_SECRET` nuevo y aleatorio (invalida sesiones anteriores).
- [ ] Contraseña de PostgreSQL rotada.
- [ ] `SEED_DEMO_DATA=false`.
- [ ] `ADMIN_USERNAME` / `ADMIN_PASSWORD` definidos en el primer arranque.
- [ ] `CLIENT_ORIGIN` con el dominio real del frontend.
- [ ] Variables de correo cargadas y `npm run email:test -- tu-correo@...` recibido en **Recibidos**.
- [ ] SPF, DKIM y DMARC publicados (ver `EMAIL-ENTERPRISE.md`).
- [ ] Logs `[SECURITY]` revisados: cuentas demo bloqueadas.
- [ ] `/health` responde `200` y no filtra información.
- [ ] Cabeceras verificadas (`content-security-policy`, `strict-transport-security`, `x-frame-options`, `x-content-type-options`).
- [ ] Login real, catálogo, pedido, entrega con código y factura probados.
- [ ] Socket.IO probado **solo** en host persistente (no Vercel).

Consulta de control de cuentas demo:

```sql
SELECT id, username, is_active FROM users
WHERE username IN ('admin','gerente','empleado','proveedor','domiciliario');
```

---

## 7. Notas de la migración

- El código se copió desde `xupply-D/app/server` (`src`, `scripts`, `package.json`,
  `package-lock.json`, `tsconfig*`, `.env.example`) y se adaptaron los archivos de
  despliegue a la raíz de este repo (backend-only).
- `src/lib/migrations.ts` ya **no** ejecuta `UPDATE` sobre usuarios/entregas al arrancar;
  las columnas necesarias (`vehicle_type`, `driver_id`, etc.) viven en `schemaSql.ts`
  o en migraciones idempotentes.
- El frontend (`app/web`) y la app Android siguen en `xupply-D`. Para construir el APK,
  actualiza `DEFAULT_RENDER_URL` con el nuevo dominio del backend.
- La app móvil no usa cookies: sigue enviando `Authorization: Bearer <JWT>`.
