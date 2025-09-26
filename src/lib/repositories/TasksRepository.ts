import database from "../../database/connection";
import {UserRegistration, UserRow} from "../../entities/Authentication";
import {CreateTask, UpdateTask} from "../../entities/Tasks";


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
            C.name        AS "categoriaName",         
            T.prioridad_id  AS "prioridadId",
            P.name        AS "prioridadName",
            T.titulo,
            T.descripcion,            
            T.completada,
            T.fecha_vencimiento AS "fechaVencimiento",
            T.completada_at AS "completadaAt",
            T.created_at    AS "createdAt"
        FROM tareas T
        INNER JOIN prioridades P ON T.prioridad_id = P.id
        INNER JOIN categorias C ON T.categoria_id = C.id
        WHERE T.deleted_at IS NULL
          AND T.user_id = $1;
    `;

    const { rows } = await database.query(query, [userId]);
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
                    prioridad_id,
                    titulo,
                    descripcion, 
                    fecha_vencimiento                    
    ) VALUES ($1, $2, $3, $4, $5, $6);`;
    const parameters = [
      userId,
      data.categoriaId,
      data.prioridadId,
      data.titulo,
      data.descripcion,
      data.fechaVencimiento
    ];

    await database.query(query, parameters);
  }

  /**
   * Actualizar una tarea.
   * @param data<UpdateTask>
   * @param taskId
   * @param userId
   */
  async updateTask(data: UpdateTask, taskId:string, userId: string): Promise<void> {

    const query = `UPDATE tareas SET                    
                    categoria_id = $1,
                    prioridad_id = $2,
                    titulo = $3,
                    descripcion = $4, 
                    fecha_vencimiento = $5
                  WHERE id = $6 AND user_id = $7;`;
    const parameters = [
      data.categoriaId,
      data.prioridadId,
      data.titulo,
      data.descripcion,
      data.fechaVencimiento,
      taskId,
      userId,
    ];

    await database.query(query, parameters);
  }

  /**
   * Eliminar una tarea.
   * @param taskId
   * @param userId
   */
  async deleteTask(taskId:string, userId: string): Promise<void> {

    const query = `UPDATE tareas SET                    
                    deleted_at = NOW()
                  WHERE id = $1 AND user_id = $2;`;
    const parameters = [
      taskId,
      userId,
    ];

    await database.query(query, parameters);
  }

  /**
   * Completar una tarea.
   * @param taskId
   * @param userId
   */
  async completeTask(taskId:string, userId: string): Promise<void> {
    const query = `UPDATE tareas SET completada = true WHERE id = $1 AND user_id = $2;`;
    const parameters = [taskId,userId];

    await database.query(query, parameters);
  }
}

export default new TasksRepository();