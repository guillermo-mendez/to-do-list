import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pg from 'pg';

const SEEDS_DIR = path.resolve(process.cwd(), 'db/seeds');

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'app',
  password: process.env.DB_PASSWORD || 'app',
  database: process.env.DB_NAME || 'todo_app'
});

function loadSeeds(): { file: string; sql: string }[] {
  if (!fs.existsSync(SEEDS_DIR)) return [];
  return fs
    .readdirSync(SEEDS_DIR)
    .filter(f => /\.sql$/i.test(f))
    .sort((a, b) => a.localeCompare(b))
    .map(f => ({ file: f, sql: fs.readFileSync(path.join(SEEDS_DIR, f), 'utf8') }));
}

(async () => {
  console.log('🌱 Ejecutando seeds...');
  const client = await pool.connect();
  try {
    const seeds = loadSeeds();
    for (const s of seeds) {
      console.log(`➡️  Seed: ${s.file}`);
      await client.query('BEGIN;');
      try {
        await client.query(s.sql);
        await client.query('COMMIT;');
        console.log(`✅ OK: ${s.file}`);
      } catch (e) {
        await client.query('ROLLBACK;');
        console.error(`❌ Error en seed ${s.file}:`, (e as Error).message);
        process.exit(1);
      }
    }
    console.log('🎉 Seeds completados.');
    process.exit(0);
  } catch (e) {
    console.error('❌ Falló seed:', (e as Error).message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();
