# Módulo Backend: Login & Carrito de Compras (Zupply)

Este paquete contiene la parte del código de backend encargada del **Inicio de Sesión (Login / Autenticación)** y el **Carrito de Compras / Procesamiento de Pedidos**, listo para desplegar e integrar en un repositorio mediante una rama de Git.

---

## 📁 Estructura del Módulo

```text
backend-login-cart/
├── README.md                 # Guía completa de uso, arquitectura y endpoints
├── package.json              # Dependencias (Express, PostgreSQL, JWT, Bcrypt)
├── tsconfig.json             # Configuración de TypeScript
├── .env.example              # Ejemplo de variables de entorno
├── schema.sql                # Script de creación de tablas en PostgreSQL
└── src/
    ├── server.ts             # Punto de entrada HTTP y arranque de DB
    ├── app.ts                # Configuración de Express, CORS y middleware
    ├── config/
    │   └── db.ts             # Conexión a PostgreSQL (pg pool)
    ├── middleware/
    │   ├── auth.ts           # Middleware JWT y control de roles
    │   └── error.ts          # Manejador global de errores Express
    ├── routes/
    │   ├── auth.ts           # Endpoints: Login, Registro, Me, Roles
    │   ├── orders.ts         # Endpoints: Carrito checkout, Lista de pedidos, Estado
    │   └── products.ts       # Endpoints: Catálogo para armar el Carrito
    └── lib/
        ├── realtime.ts       # Emisión de eventos en tiempo real
        ├── email.ts          # Servicio de notificaciones por email
        └── bucaramangaGeo.ts # Cálculo de coordenadas/geolocalización
```

---

## ⚡ Instalación y Ejecución Local

1. **Instalar dependencias:**
   ```bash
   cd backend-login-cart
   npm install
   ```

2. **Configurar Variables de Entorno (`.env`):**
   Copia `.env.example` a `.env` y define tu base de datos:
   ```env
   PORT=4000
   DATABASE_URL=postgres://usuario:password@localhost:5432/zupply
   JWT_SECRET=tu_clave_secreta_jwt
   CLIENT_ORIGIN=http://localhost:5173
   ```

3. **Base de Datos:**
   Puedes ejecutar el script `schema.sql` en tu instancia de PostgreSQL o dejar que el servidor lo inicialice automáticamente al arrancar.

4. **Iniciar en modo desarrollo:**
   ```bash
   npm run dev
   ```

5. **Compilar para producción:**
   ```bash
   npm run build
   npm start
   ```

---

## 🔌 API Endpoints Principales

### 🔑 Autenticación & Login (`/api/auth`)
- **`POST /api/auth/login`**: Inicia sesión con `username` y `password`. Retorna el Token JWT y el usuario.
- **`POST /api/auth/register`**: Registra un nuevo restaurante o proveedor con su rol correspondiente.
- **`GET /api/auth/me`**: Retorna el perfil y rol del usuario actual autenticado (requiere Header `Authorization: Bearer <TOKEN>`).
- **`GET /api/auth/roles`**: Retorna la lista de roles del sistema.

### 🛒 Carrito de Compras & Órdenes (`/api/orders`)
- **`POST /api/orders`**: **Checkout del Carrito de Compras.**
  - Body de ejemplo:
    ```json
    {
      "supplier_id": 1,
      "branch_id": 1,
      "items": [
        { "product_id": 5, "quantity": 10 },
        { "product_id": 8, "quantity": 2 }
      ],
      "notes": "Entregar en puerta trasera",
      "delivery_address": "Calle 36 # 24-10, Bucaramanga"
    }
    ```
- **`GET /api/orders`**: Lista los pedidos del restaurante o proveedor autenticado.
- **`GET /api/orders/:id`**: Obtiene los detalles e ítems comprados en una órden.
- **`PATCH /api/orders/:id/status`**: Transición de estado (`confirmado`, `despachado`, `entregado`, `cancelado`).

### 📦 Productos (`/api/products`)
- **`GET /api/products`**: Obtiene el catálogo de productos disponibles para armar el carrito de compras.

---

## 🌿 Cómo subir este módulo a una rama en Git

Puedes subir este módulo en una rama dedicada siguiendo estos comandos desde la raíz del proyecto:

```bash
# 1. Crear y cambiarse a la nueva rama
git checkout -b feature/backend-login-cart

# 2. Agregar la carpeta del módulo
git add backend-login-cart

# 3. Guardar los cambios con un commit
git commit -m "feat(backend): agregar modulo aislado de Login y Carrito de Compras"

# 4. Subir la rama a tu repositorio remoto (GitHub, GitLab, Bitbucket, etc.)
git push -u origin feature/backend-login-cart
```
