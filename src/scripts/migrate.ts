import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pg from 'pg';

const MIGRATIONS_DIR = path.resolve(process.cwd(), './src/database/migrations');

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

function sha256(s: string) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

// Crea la tabla de migraciones si no existe
async function ensureMigrationsTable(client: pg.PoolClient) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      checksum TEXT NOT NULL,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

// Lee los archivos de migración desde el disco
// Devuelve un array de { name, upSql, checksum }
function loadMigrations(): { name: string; upSql: string; checksum: string }[] {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];

  const ups = fs.readdirSync(MIGRATIONS_DIR).filter(f => /\.up\.sql$/i.test(f)).sort((a, b) => a.localeCompare(b));
  return ups.map(f => {
    const full = path.join(MIGRATIONS_DIR, f);
    const upSql = fs.readFileSync(full, 'utf8');
    return { name: f.replace(/\.up\.sql$/i, ''), upSql, checksum: sha256(upSql) };
  });
}

//Consulta la tabla migrations y devuelve un mapa { [name]: checksum } con lo ya aplicado.
async function alreadyApplied(client: pg.PoolClient): Promise<Record<string, string>> {
  const { rows } = await client.query('SELECT name, checksum FROM migrations;');
  const map: Record<string, string> = {};
  rows.forEach(r => (map[r.name] = r.checksum));
  return map;
}

// Ejecuta una función con un advisory lock para evitar que múltiples instancias corran migraciones al mismo tiempo
async function withAdvisoryLock<T>(client: pg.PoolClient, fn: () => Promise<T>): Promise<T> {
  // Usar una llave arbitraria pero constante para este proyecto
  const lockKey = 1483228801; // por ejemplo, 2017-01-01 00:00:01 :)
  await client.query('SELECT pg_advisory_lock($1);', [lockKey]);
  try {
    return await fn();
  } finally {
    await client.query('SELECT pg_advisory_unlock($1);', [lockKey]);
  }
}

(async () => {
  console.log('Ejecutando migraciones...');
  const client = await pool.connect();
  try {
    await withAdvisoryLock(client, async () => {
      await ensureMigrationsTable(client);

      const disk = loadMigrations();
      const applied = await alreadyApplied(client);

      for (const m of disk) {
        const prev = applied[m.name];
        if (prev && prev !== m.checksum) {
          throw new Error(
            `Checksum conflicto en migración "${m.name}". El archivo cambió tras haberse aplicado. ` +
            `Recomendado: crear nueva migración para ajustes.`
          );
        }
        if (prev) {
          console.log(`${m.name} (ya aplicada, saltando)`);
          continue;
        }

        console.log(`Aplicando ${m.name}...`);
        await client.query('BEGIN;');
        try {
          await client.query(m.upSql);
          await client.query('INSERT INTO migrations(name, checksum) VALUES ($1, $2);', [m.name, m.checksum]);
          await client.query('COMMIT;');
          console.log(`✔ OK: ${m.name}`);
        } catch (e) {
          await client.query('ROLLBACK;');
          console.error(`❌ Error en ${m.name}:`, (e as Error).message);
          process.exit(1);
        }
      }
    });

    console.log('Migraciones al día.');
    process.exit(0);
  } catch (e) {
    console.error('❌ Falló migrate:', (e as Error).message);
    process.exit(1);
  } finally {
    client.release();
   // await pool.end();
  }
})();
