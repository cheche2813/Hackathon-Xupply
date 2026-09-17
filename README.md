# 🚀 Zupply IA - Plataforma B2B ERP & Ecosistema Logístico

> Plataforma B2B inteligente para restaurantes y proveedores de alimentos en **Bucaramanga, Santander, Colombia**.

---

## 🌟 Características Principales

1. **Autenticación y RBAC (5 Roles)**:
   - **Administrador**: Control total del negocio, métricas y usuarios.
   - **Gerente**: Pedidos, facturación y reportes.
   - **Empleado**: Inventario operativo y comandas.
   - **Proveedor Admin**: Catálogo B2B, recepción de pedidos y despachos.
   - **Domiciliario**: Consola logística móvil y GPS en ruta.
2. **Dashboard Ejecutivo**: KPIs en tiempo real, ventas del día, alertas de stock crítico y ranking de proveedores.
3. **Gestión de Pedidos B2B**: Ciclo de vida completo (`nuevo` ➔ `confirmado` ➔ `preparando` ➔ `despachado` ➔ `en_camino` ➔ `entregado`).
4. **Inventario & FEFO**: Control de fechas de caducidad (First Expired First Out), stock mínimo y mermas.
5. **Costeo de Platos & Recetas**: Deducción automática por proporciones de ingredientes e histórico de costos.
6. **Facturación Electrónica DIAN / CUFE**: Cálculo automático de IVA (19%) e Impoconsumo (8%), emisión de CUFE y 3 modos: Electrónica, POS y Comandas de mesa.
7. **Rastreo GPS en Tiempo Real**: Visualización sobre **Leaflet + OpenStreetMap** en el mapa de Bucaramanga (Cabecera, San Pío, Centro, etc.).
8. **Motor de Inteligencia Artificial (Zupply IA)**:
   - Predicciones de demanda e inventario óptimo.
   - Asistente conversacional en lenguaje natural para consultas operativas.
9. **Contabilidad & Flujo de Caja**: Registro de ingresos y egresos clasificados por categoría.

---

## 👥 Usuarios Demo (Contraseña: `demo123`)

| Usuario | Rol | Nombre | Entidad |
|---|---|---|---|
| `admin` | Administrador | Carlos Rueda | Rancho Grande BGA |
| `gerente` | Gerente | Laura Vargas | Rancho Grande BGA |
| `empleado` | Empleado | Miguel Torres | Rancho Grande BGA |
| `proveedor` | Proveedor Admin | Pedro Mora | Carnes El Paisa S.A.S |
| `domiciliario` | Domiciliario | Jhon Díaz | Carnes El Paisa S.A.S |

---

## 📦 Estructura del Proyecto

```
zupply/
├── client/                    # Frontend React 19 + TypeScript + Vite + Tailwind
├── server/                    # Backend Node.js + Express + TypeScript
├── database/                  # Scripts SQL de esquema para MySQL
├── docker-compose.yml        # Configuración de contenedores Docker
├── Dockerfile                # Build multi-etapa para producción
└── package.json              # Scripts raíz unificados
```

---

## 🛠️ Instalación y Puesta en Marcha

### Prerrequisitos
- **Node.js**: v18+ (recomendado v20+)
- **npm** o **yarn**
- *(Opcional)* **Docker & Docker Compose** o **MySQL 8**

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/tu-usuario/zupply.git
cd zupply
npm run install:all
```

### 2. Variables de Entorno
Copia los ejemplos en `server/.env.example` y `client/.env.example`:
```bash
# Servidor
cp server/.env.example server/.env

# Cliente
cp client/.env.example client/.env
```

### 3. Ejecutar en Modo Desarrollo
Inicia el backend y el frontend simultáneamente:
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)

### 4. Sembrado de Datos Demo (Seed)
```bash
npm run seed
```

### 5. Ejecución con Docker (Opcional)
```bash
docker-compose up --build
```

---

## 📍 Datos de Negocio y Ubicación
- **Ciudad**: Bucaramanga, Santander, Colombia
- **NIT**: 900.123.456-7
- **Teléfono**: (607) 634-5678
- **Dirección**: Cra 27 #45-32, Cabecera BGA
- **Moneda**: Pesos Colombianos (COP) en formato `es-CO`

---

## 📄 Licencia
Este proyecto está bajo la Licencia MIT.
