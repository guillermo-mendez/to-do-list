-- Revertir en orden inverso
DROP TRIGGER IF EXISTS tg_update_etiquetas  ON etiquetas;
DROP TRIGGER IF EXISTS tg_update_tareas     ON tareas;
DROP TRIGGER IF EXISTS tg_update_categorias ON categorias;
DROP TRIGGER IF EXISTS tg_update_usuarios   ON usuarios;

DROP FUNCTION IF EXISTS set_updated_at();

DROP TABLE IF EXISTS tarea_etiquetas;
DROP TABLE IF EXISTS etiquetas;
DROP TABLE IF EXISTS tareas;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prioridad') THEN
DROP TYPE prioridad;
END IF;
END$$;

-- Las extensiones usualmente no se dropean en down; si quieres:
-- DROP EXTENSION IF EXISTS pg_trgm;
-- DROP EXTENSION IF EXISTS "uuid-ossp";
-- DROP EXTENSION IF EXISTS citext;
