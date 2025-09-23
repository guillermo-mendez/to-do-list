import database from "../../database/connection";
import {UserRegistration, UserRow} from "../../entities/Authentication";
import {CreateTask} from "../../entities/Tasks";


class TasksRepository {

  /**
   * Obtiene las tareas del usuario autenticado
   * @param userId
   */
   async getTasks(userId: string): Promise<any> {

    const query = `
        SELECT
            T.id            AS "taskId",
            T.categoria_id  AS "categoriaId",
            T.titulo,
            T.descripcion,
            T.prioridad,
            T.completada,
            T.fecha_vencimeinto AS "fechaVencimeinto"
            T.completada_en AS "completadaEn",
            T.created_at    AS "createdAt",
        FROM tareas T
        WHERE T.deleted_at IS NULL
          AND T.user_id = $1;
    `;

    const { rows } = await database.query<UserRow>(query, [userId]);
    return rows;
  }

  /**
   * Registro de una nueva tarea.
   * @param data<CreateTask>
   * @param userId
   */
  async createTask(data: CreateTask,userId: string): Promise<void> {

    const query = `INSERT INTO tareas (
                    user_id,
                    categoria_id,
                    titulo,
                    descripcion,
                    prioridad,
                    completada,
                    fecha_vencimiento,
                    completada_en
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
    const parameters = [
      userId,
      data.categoriaId,
      data.titulo,
      data.descripcion,
      data.prioridad,
      data.completada,
      data.fechaVencimeinto,
      data.completadaEn
    ];

    await database.query<UserRow>(query, parameters);
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

export default new TasksRepository();