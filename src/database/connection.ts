import pg from 'pg';
import 'dotenv/config';


const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

export const testConnection = async (): Promise<void> => {
  console.log('Probando conexión a db...');
  try {
    const { rows } = await pool.query('SELECT 1 AS ok;');
    console.log('✔ Connexion OK.');
    if (rows[0].ok !== 1) {
      throw new Error('Error en la consulta de prueba.');
    }
  } catch (err) {
    console.error('❌ Error de conexión:', (err as Error).message);
    process.exit(1);
  }
}


export default pool;