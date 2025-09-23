-- Extensiones
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS citext;

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          TEXT NOT NULL,
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ NULL
    );

-- Categorías
CREATE TABLE IF NOT EXISTS categorias (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    color_hex   TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ NULL,
    UNIQUE (user_id, name)
    );

-- Prioridad
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prioridad') THEN
CREATE TYPE prioridad AS ENUM ('baja','media','alta');
END IF;
END$$;

-- Tareas
CREATE TABLE IF NOT EXISTS tareas (
                                      id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    categoria_id      UUID REFERENCES categorias(id) ON DELETE SET NULL,
    titulo            TEXT NOT NULL,
    descripcion       TEXT,
    prioridad         prioridad NOT NULL DEFAULT 'media',
    completada        BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_vencimiento DATE,
    completada_en     TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ NULL
    );

-- Etiquetas
CREATE TABLE IF NOT EXISTS etiquetas (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id   UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    name      TEXT NOT NULL,
    color_hex   TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ NULL,
    UNIQUE (user_id, name)
    );

-- MM
CREATE TABLE IF NOT EXISTS tarea_etiquetas (
                                               tarea_id    UUID NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
    etiqueta_id UUID NOT NULL REFERENCES etiquetas(id) ON DELETE CASCADE,
    PRIMARY KEY (tarea_id, etiqueta_id)
    );

-- Índices
CREATE INDEX IF NOT EXISTS idx_tareas_usuario ON tareas(user_id);
CREATE INDEX IF NOT EXISTS idx_tareas_categoria ON tareas(categoria_id);
CREATE INDEX IF NOT EXISTS idx_tareas_completada ON tareas(user_id, completada);
CREATE INDEX IF NOT EXISTS idx_tareas_fecha_venc ON tareas(user_id, fecha_vencimiento);
CREATE INDEX IF NOT EXISTS idx_tareas_prioridad ON tareas(user_id, prioridad);
CREATE INDEX IF NOT EXISTS idx_tareas_created_at ON tareas(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tareas_titulo_trgm ON tareas USING GIN (titulo gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_tareas_desc_trgm   ON tareas USING GIN (descripcion gin_trgm_ops);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER tg_update_usuarios   BEFORE UPDATE ON usuarios   FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tg_update_categorias BEFORE UPDATE ON categorias FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tg_update_tareas     BEFORE UPDATE ON tareas     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tg_update_etiquetas  BEFORE UPDATE ON etiquetas  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
