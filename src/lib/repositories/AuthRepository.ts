import database from "../../database/connection";
import {UserRegistration, UserRow} from "../../entities/Authentication";


class AuthRepository {

  /**
   * Método para obtener la información de la sesión de un usuario.
   * @param {string} email - El email de usuario.
   * @returns {Promise<UserRow>} - La información de la sesión del usuario.
   */
   async getInfoSessionByUser(email: string): Promise<UserRow> {

    const query = `
        SELECT
            U.id            AS "userId",
            U.name          AS "name",
            U.email         AS "email",
            U.password_hash AS "passwordHash"
        FROM usuarios U
        WHERE U.deleted_at IS NULL
          AND LOWER(U.email) = LOWER($1)
            LIMIT 1;
    `;

    const { rows } = await database.query<UserRow>(query, [email.trim()]);
    return rows[0] ?? null;
  }

  /**
   * Registro de usuario
   * @param data
   */
  async userRegistration(data:UserRegistration): Promise<void> {

    const query = `INSERT INTO usuarios (name,email,password_hash) VALUES ($1, $2, $3)`;

    await database.query<UserRow>(query, [data.name, data.email.trim(), data.password]);
  }

  /**
   * Obtiene la información del usuario por su email.
   * @param email
   */
  async getUserInfoByEmail(email: string): Promise<UserRow> {

    const query = `
        SELECT U.id            AS "userId",
               U.name          AS "name",
               U.email         AS "email"               
        FROM usuarios U
        WHERE U.deleted_at IS NULL
          AND LOWER(U.email) = LOWER($1) LIMIT 1;
    `;

    const {rows} = await database.query<UserRow>(query, [email.trim()]);
    return rows[0] ?? null;
  }

}

export default new AuthRepository();