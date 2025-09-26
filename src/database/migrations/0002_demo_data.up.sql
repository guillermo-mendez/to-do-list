INSERT INTO usuarios (id, name, email, password_hash)
VALUES ('11111111-1111-1111-1111-111111111111','Usuario Demo','demo@todo.com','$2b$10$futFgC3/Zf2q8Dc9Bd4DIeUOkWA3vFB3ZEFZldTjWaY7X0POP81W2')
    ON CONFLICT DO NOTHING;

INSERT INTO categorias (user_id, name, color_hex)
VALUES
    ('11111111-1111-1111-1111-111111111111','Trabajo','#2563eb'),
    ('11111111-1111-1111-1111-111111111111','Personal','#16a34a')
    ON CONFLICT DO NOTHING;

INSERT INTO prioridades (name)
VALUES
    ('Baja'),
    ('Media'),
    ('Alta')
    ON CONFLICT DO NOTHING;

INSERT INTO etiquetas (user_id, name, color_hex)
VALUES
    ('11111111-1111-1111-1111-111111111111','urgente','#ef4444'),
    ('11111111-1111-1111-1111-111111111111','hogar','#f59e0b')
    ON CONFLICT DO NOTHING;
