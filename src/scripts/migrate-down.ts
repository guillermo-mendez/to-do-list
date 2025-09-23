import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pg from 'pg';

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'db/migrations');

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'app',
  password: process.env.DB_PASSWORD || 'app',
  database: process.env.DB_NAME || 'todo_app'
});

function downFileFor(name: string) {
  const filename = `${name}.down.sql`;
  const full = path.join(MIGRATIONS_DIR, filename);
  if (!fs.existsSync(full)) throw new Error(`No se encontró el archivo de rollback: ${filename}`);
  return fs.readFileSync(full, 'utf8');
}

(async () => {
  console.log('↩️  Revirtiendo última migración...');
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        checksum TEXT NOT NULL,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const { rows } = await client.query(
      'SELECT id, name FROM migrations ORDER BY executed_at DESC, id DESC LIMIT 1;'
    );
    if (!rows[0]) {
      console.log('No hay migraciones aplicadas.');
      process.exit(0);
    }
    const last = rows[0].name as string;
    const downSql = downFileFor(last);

    await client.query('BEGIN;');
    try {
      await client.query(downSql);
      await client.query('DELETE FROM migrations WHERE name = $1;', [last]);
      await client.query('COMMIT;');
      console.log(`✅ Revertida: ${last}`);
      process.exit(0);
    } catch (e) {
      await client.query('ROLLBACK;');
      throw e;
    }
  } catch (e) {
    console.error('❌ Falló migrate:down:', (e as Error).message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();
