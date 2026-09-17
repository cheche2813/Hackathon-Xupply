-- ============================================================
-- ZUPPLY IA - Esquema de Base de Datos PostgreSQL
-- Plataforma B2B ERP / Ecosistema Logístico con IA
-- Surtesoft - v2.0
-- ============================================================

-- ------------------------------------------------------------
-- TIPOS ENUM personalizados
-- ------------------------------------------------------------
CREATE TYPE order_status AS ENUM ('nuevo', 'confirmado', 'preparando', 'despachado', 'en_camino', 'entregado', 'cancelado');
CREATE TYPE invoice_mode AS ENUM ('electronica', 'pos', 'comandas');
CREATE TYPE invoice_id_type AS ENUM ('nit', 'cedula', 'email', 'Pasaporte');
CREATE TYPE payment_method AS ENUM ('Efectivo', 'Tarjeta', 'Nequi', 'PSE', 'Daviplata', 'Credito');
CREATE TYPE invoice_status AS ENUM ('borrador', 'emitida', 'pagada', 'anulada');
CREATE TYPE inventory_stock_status AS ENUM ('critical', 'low', 'normal');
CREATE TYPE accounting_type AS ENUM ('ingreso', 'egreso');
CREATE TYPE vehicle_type AS ENUM ('moto', 'furgon', 'camion', 'camioneta');
CREATE TYPE vehicle_status AS ENUM ('disponible', 'en_ruta', 'cargando', 'mantenimiento');
CREATE TYPE delivery_status AS ENUM ('asignado', 'en_camino', 'llegando', 'entregado', 'fallido');
CREATE TYPE inventory_movement_type AS ENUM ('entrada', 'salida', 'ajuste', 'merma');

-- ------------------------------------------------------------
-- TABLA: roles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- TABLA: permissions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- TABLA: role_permissions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- ------------------------------------------------------------
-- TABLA: restaurants
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  nit VARCHAR(20) UNIQUE,
  phone VARCHAR(20),
  email VARCHAR(200),
  address VARCHAR(500),
  city VARCHAR(100) DEFAULT 'Bucaramanga',
  department VARCHAR(100) DEFAULT 'Santander',
  logo_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- TABLA: branches
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS branches (
  id SERIAL PRIMARY KEY,
  restaurant_id INT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  address VARCHAR(500),
  phone VARCHAR(20),
  is_main BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- TABLA: users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200),
  phone VARCHAR(20),
  role_id INT NOT NULL REFERENCES roles(id),
  restaurant_id INT REFERENCES restaurants(id) ON DELETE SET NULL,
  branch_id INT REFERENCES branches(id) ON DELETE SET NULL,
  supplier_id INT,
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- TABLA: suppliers
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  nit VARCHAR(20) UNIQUE,
  category VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(200),
  address VARCHAR(500),
  city VARCHAR(100) DEFAULT 'Bucaramanga',
  logo_url VARCHAR(500),
  rating DECIMAL(2,1) DEFAULT 0.0,
  review_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
