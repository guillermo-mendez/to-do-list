import {PoolConnection} from 'mariadb';
import database from '../config/database';
import {QueriesPropsTransaction} from "./models";

class DatabaseConnection {
  // Método para probar la conexión a la base de datos
  async testConnection(): Promise<void> {
      const connection: PoolConnection = await database.getConnectionTest();
      connection.release(); // Libera la conexión después de usarla
  }

  // Método genérico para ejecutar consultas
  async executeQuery<T>(query: string, params: any[] = []): Promise<any> {
    let connection: PoolConnection | null = null;
    try {
      connection = await database.getConnection();
      return await connection.query(query, params);
    } catch (err: any) {
      console.error('❌ Error al ejecutar la consulta:', err.message);
      throw err;
    } finally {
      if (connection) connection.release(); // Asegura liberar la conexión
    }
  }

  async executeTransaction(queries: QueriesPropsTransaction[]): Promise<void> {
    let connection: PoolConnection | null = null;
    try {
      connection = await database.getConnection();
      await connection.beginTransaction();

      for (const { query, params } of queries) {
        await connection.query(query, params);
      }

      await connection.commit();
    } catch (err: any) {
      if (connection) await connection.rollback();
      console.error('❌ Error en la transacción:', err.message);
      throw err;
    } finally {
      if (connection) connection.release();
    }
  }

  // Ejemplo de uso de transacción
 /* const runTransaction = async () => {
    try {
      const queries = [
        {
          query: 'INSERT INTO users (name, email) VALUES (?, ?)',
          params: ['John Doe', 'johndoe@example.com'],
        },
        {
          query: 'INSERT INTO accounts (user_id, balance) VALUES (LAST_INSERT_ID(), ?)',
          params: [1000],
        },
      ];

      await databaseConnection.executeTransaction(queries);
      console.log('✔ Transacción ejecutada correctamente.');
    } catch (err) {
      console.error('❌ Error ejecutando la transacción:', err.message);
    }
  };

  runTransaction();
*/

  getDatabaseName(): string {
    return database.databaseName;
  }

  async getConnection(): Promise<PoolConnection> {
    return await database.getConnection();
  }
}

export default new DatabaseConnection();
