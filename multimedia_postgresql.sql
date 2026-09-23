-- ============================================================
-- BASE DE DATOS: multimedia (PostgreSQL)
-- Plataforma: Xuplly IA
-- Propósito: Esquema de almacenamiento y metadatos para imágenes y videos
-- ============================================================

-- ------------------------------------------------------------
-- EXTENSIONES
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- TIPOS ENUM PERSONALIZADOS
-- ------------------------------------------------------------
CREATE TYPE media_type AS ENUM ('image', 'video');
CREATE TYPE media_status AS ENUM ('uploading', 'processing', 'ready', 'failed', 'deleted');
CREATE TYPE media_entity_type AS ENUM (
  'product',            -- Foto de catálogo de producto
  'user_avatar',        -- Avatar de usuario
  'restaurant_logo',    -- Logo o foto de restaurante
  'xupplier_logo',      -- Logo o foto de proveedor
  'delivery_proof',     -- Foto de evidencia de entrega del domiciliario
  'recipe_media',       -- Foto o video de preparación
  'banner',             -- Banners de la app
  'general'             -- Uso general
);

-- ------------------------------------------------------------
-- TABLA: media_files (Tabla principal de archivos)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  description TEXT,
  original_name VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL UNIQUE,
  file_extension VARCHAR(20) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  media_type media_type NOT NULL,
  size_bytes BIGINT NOT NULL CHECK (size_bytes > 0),
  
  -- Rutas de almacenamiento y acceso directo
  file_path VARCHAR(500) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  
  -- Control de integridad y deduplicación
  hash_sha256 VARCHAR(64),
  
  -- Relación con entidades del sistema Xuplly
  entity_type media_entity_type DEFAULT 'general',
  entity_id INT NULL,
  uploaded_by_user_id INT NULL,
  
  -- Estado y visibilidad
  status media_status DEFAULT 'ready',
  is_public BOOLEAN DEFAULT TRUE,
  
  -- Auditoría
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_media_type ON media_files(media_type);
CREATE INDEX idx_media_status ON media_files(status);
CREATE INDEX idx_media_entity ON media_files(entity_type, entity_id);
CREATE INDEX idx_media_hash ON media_files(hash_sha256);
CREATE INDEX idx_media_created_at ON media_files(created_at DESC);

-- ------------------------------------------------------------
-- TABLA: image_metadata (Detalles técnicos de imágenes)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS image_metadata (
  id SERIAL PRIMARY KEY,
  media_file_id UUID NOT NULL UNIQUE REFERENCES media_files(id) ON DELETE CASCADE,
  width INT NOT NULL CHECK (width > 0),
  height INT NOT NULL CHECK (height > 0),
  aspect_ratio DECIMAL(5,2),
  format VARCHAR(20),                -- 'png', 'jpeg', 'webp', 'avif', etc.
  has_alpha BOOLEAN DEFAULT FALSE,   -- Si tiene canal de transparencia
  color_space VARCHAR(30) DEFAULT 'sRGB',
  thumbnail_url VARCHAR(1000),       -- Miniatura comprimida
  webp_url VARCHAR(1000),            -- Versión WebP optimizada
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_img_meta_media_id ON image_metadata(media_file_id);

-- ------------------------------------------------------------
-- TABLA: video_metadata (Detalles técnicos de videos)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS video_metadata (
  id SERIAL PRIMARY KEY,
  media_file_id UUID NOT NULL UNIQUE REFERENCES media_files(id) ON DELETE CASCADE,
  duration_seconds DECIMAL(8,2) NOT NULL CHECK (duration_seconds >= 0),
  width INT NOT NULL CHECK (width > 0),
  height INT NOT NULL CHECK (height > 0),
  resolution_label VARCHAR(20),       -- '1080p', '720p', '4K', etc.
  framerate DECIMAL(5,2),            -- FPS (e.g. 30.00, 60.00)
  bitrate_kbps INT,                  -- Tasa de bits en kbps
  video_codec VARCHAR(50),           -- 'H.264', 'H.265', 'VP9', 'AV1'
  audio_codec VARCHAR(50),           -- 'AAC', 'MP3', 'Opus'
  thumbnail_url VARCHAR(1000),       -- Captura de portada (poster frame)
  preview_gif_url VARCHAR(1000),     -- Previsualización animada
  hls_stream_url VARCHAR(1000),      -- URL para streaming adaptable HLS (.m3u8)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_video_meta_media_id ON video_metadata(media_file_id);

-- ------------------------------------------------------------
-- TABLA: media_tags (Etiquetas para clasificación y búsqueda)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relación muchos a muchos: media_files <-> media_tags
CREATE TABLE IF NOT EXISTS media_file_tags (
  media_file_id UUID NOT NULL REFERENCES media_files(id) ON DELETE CASCADE,
  tag_id INT NOT NULL REFERENCES media_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (media_file_id, tag_id)
);

-- ------------------------------------------------------------
-- TABLA: media_collections (Galerías o agrupaciones)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_collections (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  description TEXT,
  created_by_user_id INT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media_collection_items (
  collection_id INT NOT NULL REFERENCES media_collections(id) ON DELETE CASCADE,
  media_file_id UUID NOT NULL REFERENCES media_files(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (collection_id, media_file_id)
);

-- ------------------------------------------------------------
-- FUNCION Y TRIGGERS: Auto-actualizar updated_at
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_multimedia_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER trg_media_files_updated_at
  BEFORE UPDATE ON media_files
  FOR EACH ROW
  EXECUTE FUNCTION update_multimedia_updated_at();

CREATE TRIGGER trg_media_collections_updated_at
  BEFORE UPDATE ON media_collections
  FOR EACH ROW
  EXECUTE FUNCTION update_multimedia_updated_at();

-- ------------------------------------------------------------
-- VISTAS
-- ------------------------------------------------------------

-- Vista general de archivos con metadatos unificados
CREATE OR REPLACE VIEW v_media_overview AS
SELECT
  m.id,
  m.title,
  m.original_name,
  m.mime_type,
  m.media_type,
  m.size_bytes,
  m.file_path,
  m.url,
  m.entity_type,
  m.entity_id,
  m.status,
  m.created_at,
  -- Datos de imagen
  img.width AS img_width,
  img.height AS img_height,
  img.thumbnail_url AS img_thumbnail,
  -- Datos de video
  vid.duration_seconds AS vid_duration,
  vid.resolution_label AS vid_resolution,
  vid.thumbnail_url AS vid_poster,
  vid.preview_gif_url AS vid_preview
FROM media_files m
LEFT JOIN image_metadata img ON m.id = img.media_file_id
LEFT JOIN video_metadata vid ON m.id = vid.media_file_id
WHERE m.deleted_at IS NULL;

-- Vista de estadísticas de almacenamiento
CREATE OR REPLACE VIEW v_media_storage_stats AS
SELECT
  media_type,
  COUNT(*) AS total_files,
  ROUND(SUM(size_bytes) / 1024.0 / 1024.0, 2) AS total_megabytes,
  ROUND(AVG(size_bytes) / 1024.0, 2) AS avg_kilobytes_per_file
FROM media_files
WHERE deleted_at IS NULL
GROUP BY media_type;
