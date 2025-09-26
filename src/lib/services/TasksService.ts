import {ResultService} from "../../entities/Result-service";
import {errorHandler, responseHandler} from 'error-handler-express-ts';
import tasksRepository from '../repositories/TasksRepository';
import {UserAuth} from "../../entities/Authentication";
import {CreateTask, UpdateTask} from "../../entities/Tasks";

class TasksService {
  /**
   * Get tasks for the authenticated user
   * @param user
   */
  async getTasks(user: UserAuth): Promise<ResultService> {
    try {
      const userId = user.userId;

      const tasks = await tasksRepository.getTasks(userId);

      return responseHandler(tasks);

    } catch (err) {
      throw new errorHandler().error(err).method('getTasks').debug().build();
    }
  }

  /**
   * Método para crear una nueva tarea.
   * @param data<CreateTask>
   * @param userId
   */
  async createTask(data:CreateTask, userId: string): Promise<ResultService> {
    try {

      await tasksRepository.createTask(data,userId);
      const tasks = await tasksRepository.getTasks(userId);

        return responseHandler(tasks);


    } catch (err) {
      throw new errorHandler().error(err).method('createTask').debug().build();
    }
  }

  /**
   * Método para actualizar una tarea.
   * @param data<UpdateTask>
   * @param taskId
   * @param userId
   */
  async updateTask(data:UpdateTask, taskId:string, userId: string): Promise<ResultService> {
    try {

      await tasksRepository.updateTask(data,taskId,userId);
      const tasks = await tasksRepository.getTasks(userId);

      return responseHandler(tasks);


    } catch (err) {
      throw new errorHandler().error(err).method('updateTask').debug().build();
    }
  }

  /**
   * Método para eliminar una tarea.
   * @param taskId
   * @param userId
   */
  async deleteTask(taskId:string, userId: string): Promise<ResultService> {
    try {

      await tasksRepository.deleteTask(taskId,userId);
      const tasks = await tasksRepository.getTasks(userId);

      return responseHandler(tasks);


    } catch (err) {
      throw new errorHandler().error(err).method('deleteTask').debug().build();
    }
  }

/**
   * Método para completar una tarea.
   * @param taskId
   * @param userId
   */
  async completeTask(taskId:string, userId: string): Promise<ResultService> {
    try {
      await tasksRepository.completeTask(taskId,userId);
      const tasks = await tasksRepository.getTasks(userId);

      return responseHandler(tasks);


    } catch (err) {
      throw new errorHandler().error(err).method('completeTask').debug().build();
    }
  }
}

export default new TasksService();