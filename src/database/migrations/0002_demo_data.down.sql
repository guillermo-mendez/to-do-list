DELETE FROM tarea_etiquetas te USING tareas t
WHERE te.tarea_id = t.id AND t.user_id = '11111111-1111-1111-1111-111111111111';

DELETE FROM etiquetas
WHERE user_id = '11111111-1111-1111-1111-111111111111'
  AND name IN ('urgente','hogar');

DELETE FROM categorias
WHERE user_id = '11111111-1111-1111-1111-111111111111'
  AND name IN ('Trabajo','Personal');

DELETE FROM usuarios
WHERE id = '11111111-1111-1111-1111-111111111111';
