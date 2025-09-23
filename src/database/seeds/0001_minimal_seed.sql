-- Crea una categoría y una tarea de ejemplo para el usuario demo si existe
WITH demo AS (
    SELECT id FROM usuarios WHERE email = 'demo@todo.com'
)
INSERT INTO categorias (usuario_id, nombre)
SELECT id, 'General' FROM demo
    ON CONFLICT DO NOTHING;

WITH demo AS (
    SELECT id AS usuario_id FROM usuarios WHERE email = 'demo@todo.com'
),
     cat AS (
         SELECT c.id FROM categorias c JOIN demo d ON d.usuario_id = c.usuario_id WHERE c.nombre = 'General' LIMIT 1
    )
INSERT INTO tareas (usuario_id, categoria_id, titulo, descripcion, prioridad)
SELECT d.usuario_id, c.id, 'Tarea de ejemplo', 'Bienvenido a tu TODO', 'media'
FROM demo d, cat c;
