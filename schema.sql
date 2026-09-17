-- ESQUEMA DE BASE DE DATOS PARA LOGIN Y CARRITO DE COMPRAS / ÓRDENES

-- Roles del sistema
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT
);

INSERT INTO roles (id, name, description) VALUES
  (1, 'admin', 'Administrador Global'),
  (2, 'gerente', 'Gerente de Restaurante'),
  (3, 'empleado', 'Empleado de Restaurante'),
  (4, 'proveedor_admin', 'Administrador de Proveedor'),
  (5, 'domiciliario', 'Conductor / Domiciliario')
ON CONFLICT (id) DO NOTHING;

-- Restaurantes (Clientes)
CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  category VARCHAR(100),
  subscription_plan VARCHAR(50) DEFAULT 'basico',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Proveedores (Vendedores del catálogo)
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  category VARCHAR(100) DEFAULT 'Abarrotes y General',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sedes de Restaurante
CREATE TABLE IF NOT EXISTS branches (
  id SERIAL PRIMARY KEY,
  restaurant_id INT REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  is_main BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Usuarios del Sistema (Para Autenticación / Login)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  role_id INT REFERENCES roles(id),
  restaurant_id INT REFERENCES restaurants(id) ON DELETE SET NULL,
  supplier_id INT REFERENCES suppliers(id) ON DELETE SET NULL,
  branch_id INT REFERENCES branches(id) ON DELETE SET NULL,
  subscription_plan VARCHAR(50) DEFAULT 'basico',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categorías de Productos
CREATE TABLE IF NOT EXISTS product_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sort_order INT DEFAULT 0
);

-- Productos disponibles en el catálogo (Para agregar al Carrito)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  supplier_id INT REFERENCES suppliers(id) ON DELETE CASCADE,
  category_id INT REFERENCES product_categories(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100),
  unit VARCHAR(50) DEFAULT 'kg',
  price_per_unit NUMERIC(12,2) NOT NULL,
  min_order_qty NUMERIC(10,2) DEFAULT 1,
  stock_available NUMERIC(10,2) DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Órdenes / Pedidos (Generados desde el Carrito de Compras)
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_code VARCHAR(50) UNIQUE NOT NULL,
  restaurant_id INT REFERENCES restaurants(id),
  branch_id INT REFERENCES branches(id),
  supplier_id INT REFERENCES suppliers(id),
  status VARCHAR(50) DEFAULT 'nuevo', -- nuevo, confirmado, preparando, despachado, en_camino, entregado, cancelado
  total NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  delivery_address TEXT,
  requested_delivery_date DATE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  dispatched_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ítems de la Órden / Carrito de compras
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  unit VARCHAR(50),
  unit_price NUMERIC(12,2) NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL
);

-- Registro de Auditoría
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT NOT NULL,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
