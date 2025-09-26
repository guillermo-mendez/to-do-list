import {Request, Response} from 'express';
import tasksService from "../services/TasksService";
import validation from '../../validators/TasksValidator';

class TasksController {
  /**
   * Obtener todas las tareas del usuario autenticado
   * @param req
   * @param res
   */
  async getTasks(req: Request, res: Response): Promise<Response> {
    const user = req.user;
    if (!user) {
      return res.status(401).json({message: 'No autorizado'});
    }
    const result = await tasksService.getTasks(user);
    return res.json(result);
  }

  /**
   * Crear nueva tarea
   * @param req
   * @param res
   */
  async createTask(req: Request, res: Response): Promise<Response> {
    validation.createTaskValidation(req.body);
    const userId = req.user?.userId;
    const result = await tasksService.createTask(req.body, userId);
    return res.json(result);
  }

  /**
   * Actualizar tarea
   * @param req
   * @param res
   */
  async updateTask(req: Request, res: Response): Promise<Response> {
    const taskId = req.params.id;
    validation.updateTaskValidation({...req.body,taskId});
    const userId = req.user?.userId;
    const result = await tasksService.updateTask(req.body, taskId, userId);
    return res.json(result);
  }

  /**
   * Eliminar tarea
   * @param req
   * @param res
   */
  async deleteTask(req: Request, res: Response): Promise<Response> {
    const taskId = req.params.id;
    validation.deleteTaskValidation({taskId});
    const userId = req.user?.userId;
    const result = await tasksService.deleteTask(taskId, userId);
    return res.json(result);
  }

  /**
   * Marcar tarea como completada
   * @param req
   * @param res
   */
  async completeTask(req: Request, res: Response): Promise<Response> {
    const taskId = req.params.id;
    console.log({taskId});
    validation.completeTaskValidation({taskId});
    const userId = req.user?.userId;
    const result = await tasksService.completeTask(taskId, userId);
    return res.json(result);
  }

}

export default new TasksController();