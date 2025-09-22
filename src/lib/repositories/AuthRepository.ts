import database from "../../database/connection";
import {STATUSES} from "../../constants";

class AuthRepository {

  /**
   * Método para nueva session de usuario.
   * @param {number} userId - El ID del usuario.
   * @param {number} statusId - El ID del status.
   * @returns {Promise<{insertId: number}>} - El ID de la nueva session.
   */
  async newUserSession(userId: number, statusId: number): Promise<{insertId: number}> {
    const dbName = database.getDatabaseName();

    const params = [userId, statusId];
    const query = `INSERT INTO ${dbName}.security_active_session_by_user (user_id, status_id)
                   VALUES (?, ?)`
    return await database.executeQuery(query, params);
  }

  /**
   * Método para obtener la información de la sesión de un usuario.
   * @param {string} username - El nombre de usuario.
   * @param {number} statusId - El ID del status.
   * @returns {Promise<any>} - La información de la sesión del usuario
   */
  async getInfoSessionByUser(username: string, statusId: number):Promise<any> {
    const dbName = database.getDatabaseName();
    const params = [username, statusId, statusId, statusId];
    const query = `
        SELECT U.id                     AS userId,
               U.name,
               U.last_name              AS lastName,
               U.email,
               SE.locked,
               SE.temporary_credentials AS temporaryCredentials,
               SE.password              AS passwordDB,
               NSA.sessions_allowed     AS sessionsAllowed
        FROM ${dbName}.security_users U
                 INNER JOIN ${dbName}.security_user_sessions SE
                            ON U.id = SE.user_id AND SE.user = ? AND SE.status_id = ?
                 INNER JOIN ${dbName}.security_number_sessions_allowed NSA
                            ON U.id = NSA.user_id AND NSA.status_id = ?
        WHERE U.status_id = ?; `
    const result = await database.executeQuery(query, params);
    return result[0];
  }

  /**
   * Método para obtener la sesión activa de un usuario.
   * @param {number} userId - El ID del usuario.
   * @param {number} statusId - El ID del status.
   * @returns {Promise<any>} - La sesión activa del usuario.
   */
  async getActiveSession(userId: number, statusId: number): Promise<any> {
    const dbName = database.getDatabaseName();
    const params = [userId, statusId];
    const query = `
        SELECT id,
               user_id   AS userId,
               status_id AS statusId
        FROM ${dbName}.security_active_session_by_user
        WHERE user_id = ?
          AND status_id = ?; `
    return await database.executeQuery(query, params);
  }

  /**
   * Método para obtener la información de un usuario.
   * @param {string} user - El nombre de usuario.
   * @param {number} statusId - El ID del status.
   * @returns {Promise<any>} - La información del usuario.
   */
  async getUserInfoByUser(user: string, statusId: number): Promise<any> {
    const dbName = database.getDatabaseName();
    const params = [user, statusId, statusId];
    const query = `
        SELECT U.id        AS userId,
               U.name,
               U.last_name AS lastName,
               U.email,
               SE.user
        FROM ${dbName}.security_users U
                 INNER JOIN ${dbName}.security_user_sessions SE
                            ON U.id = SE.user_id AND SE.user = ? AND SE.status_id = ?
        WHERE U.status_id = ?; `
    const result = await database.executeQuery(query, params);
    return result[0];
  }

  /**
   * Método para destruir una sesión de usuario.
   * @param {number} userId - El ID del usuario.
   * @returns {Promise<any>} - El resultado de la destrucción de la sesión.
   */
  async destroySession(userId: number):Promise<any> {
    const dbName = database.getDatabaseName();
    const query = `
        UPDATE ${dbName}.security_active_session_by_user
        SET status_id  = ?, deleted_at = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:00')
        WHERE user_id = ?; `;
    return await database.executeQuery(query, [STATUSES.DELETED.id, userId]);
  }

  /**
   * Método para obtener las políticas de un rol.
   * @param {string} role - El nombre del rol.
   * @param {number} statusId - El ID del status.
   * @returns {Promise<{policyId: number, name: string, description: string, is_general: number}[]>} - Las políticas del rol.
   */
  async getPoliciesByRoles(role: string, statusId: number): Promise<{ policyId: number; name: string; description: string; is_general: number; }[]> {
    const dbName = database.getDatabaseName();
    const params = [statusId, statusId, statusId, role];
    const query: string = `
        SELECT policy.id AS policyId,
               policy.name,
               policy.description,
               policy.is_general
        FROM ${dbName}.security_policies policy
                 INNER JOIN ${dbName}.security_roles_policies_rel RPR
                            ON policy.id = RPR.policy_id AND policy.status_id = ? AND RPR.status_id = ?
                 INNER JOIN ${dbName}.security_roles role
                            ON role.id = RPR.role_id AND role.status_id = ? AND role.name = ?;`
    return await database.executeQuery(query, params);
  }

  /**
   * Método para obtener las políticas de un rol.
   * @param {number[]} policies - El ID de las políticas.
   * @param {number} statusId - El ID del status.
   * @returns {Promise<any>} - Las políticas del rol.
   */
  async getPoliciesBackend(policies: number[], statusId: number):Promise<any> {
    const dbName = database.getDatabaseName();
    const params = [policies, statusId];
    const query: string = `
        SELECT policy.id                 AS policyId,
               policy.code,
               policy.description,
               policy.router_name        AS routerName,
               policy.service,
               policy.method,
               policy.endpoint,
               policy.security_policy_id AS securityPoliciesId
        FROM ${dbName}.security_policies_backend policy
        WHERE policy.security_policy_id IN (?)
          AND policy.status_id = ?;`
    return await database.executeQuery(query, params);
  }

  /**
   * Método para obtener las políticas generales.
   * @param {number} statusId - El ID del status.
   * @returns {Promise<{policyId: number, name: string, description: string, is_general: number}[]>} - Las políticas generales.
   */
  async getGeneralPolicies(statusId: number): Promise<{ policyId: number; name: string; description: string; is_general: number; }[]> {
    const dbName = database.getDatabaseName();
    const params = [statusId];
    const query: string = `
        SELECT policy.id AS policyId,
               policy.name,
               policy.description,
               policy.is_general
        FROM ${dbName}.security_policies policy
        WHERE policy.is_general = true
          AND policy.status_id = ?; `
    return await database.executeQuery(query, params);
  }

}

export default new AuthRepository();