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

-- Prioridades
CREATE TABLE IF NOT EXISTS prioridades (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ NULL
    );


CREATE TABLE IF NOT EXISTS tareas (
                                      id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    categoria_id      UUID REFERENCES categorias(id) ON DELETE SET NULL,
    prioridad_id      UUID REFERENCES prioridades(id) ON DELETE SET NULL,
    titulo            TEXT NOT NULL,
    descripcion       TEXT,
    completada        BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_vencimiento DATE,
    completada_at     TIMESTAMPTZ NULL,
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


