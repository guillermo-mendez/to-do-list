import database from '../../database/connection';

class BlacklistRepository {

  /**
   * Agrega un token a la lista negra.
   * @param token - Refresh Token.
   * @param userId - ID del usuario asociado.
   * @param expiresAt - Fecha de expiración del token.
   * @param reason - Razón para invalidar el token (opcional).
   */
  async addTokenToBlacklist(token: string, userId: number, expiresAt: Date, reason?: string): Promise<void> {
    const query = `INSERT INTO blacklisted_refresh_tokens (token, user_id, reason, expires_at) VALUES (?, ?, ?, ?)`;
    const params = [token, userId, reason, expiresAt];
    await database.query(query, params);
  }

  /**
   * Verifica si un token está en la lista negra.
   * @param token - Refresh Token.
   * @returns True si el token está en la lista negra, False en caso contrario.
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const query = `
        SELECT 1
        FROM blacklisted_refresh_tokens
        WHERE token = ?
          AND expires_at > NOW() LIMIT 1
    `;
    const result = await database.query(query, [token]);
    return true;
  }

  /**
   * Elimina tokens expirados de la lista negra.
   * @returns Promise<void>
   */
  async removeExpiredTokens(): Promise<void> {
    const query = `
        DELETE
        FROM blacklisted_refresh_tokens
        WHERE expires_at <= NOW()
    `;
    await database.query(query);
  }
}

export default new BlacklistRepository();
