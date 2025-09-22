import mariadb, {Pool, PoolConnection} from 'mariadb';
import {config} from 'dotenv';

config();


// Configuración de la conexión a la base de datos
const pool: Pool = mariadb.createPool({
  host: process.env.DB_HOST, // Dirección del servidor
  user: process.env.DB_USER,       // Usuario de la base de datos
  password: process.env.DB_PASSWORD,   // Contraseña del usuario
  database: process.env.DB_NAME ,   // Nombre de la base de datos
  port: parseInt(process.env.DB_PORT || '3306'), // Puerto de conexión
  connectionLimit: 10,                       // Límite de conexiones simultáneas
  multipleStatements : true,                 // Permite múltiples consultas en una sola llamada
});

// Función para obtener una conexión de prueba desde el pool
const getConnectionTest = async (): Promise<PoolConnection> => {
  try {
    const connection = await pool.getConnection();
    console.log('✔ Conexión establecida con la base de datos.');
    return connection;
  } catch (err: any) {
    console.error(`❌ Error al conectar con la base de datos: ${err.message}`);
    throw err; // Propagar el error para manejarlo en otras capas
  }
};

// Función para obtener una conexión de prueba desde el pool
const getConnection = async (): Promise<PoolConnection> => {
  try {
    return await pool.getConnection();
  } catch (err: any) {
    console.error(`❌ Error al conectar con la base de datos: ${err.message}`);
    throw err; // Propagar el error para manejarlo en otras capas
  }
};

// Exportar el pool y la función de conexión
export default {
  pool,
  getConnection,
  getConnectionTest,
  databaseName: process.env.DB_NAME || 'you_database',
};
