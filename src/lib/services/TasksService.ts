import {ResultService} from "../../entities/Result-service";
import {errorHandler, responseHandler} from 'error-handler-express-ts';
import bcrypt from 'bcryptjs';
import tasksRepository from '../repositories/TasksRepository';
import jwtService from '../../security/JWTService';
import {UserAuth} from "../../entities/Authentication";
import {CreateTask} from "../../entities/Tasks";

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
   * Método para obtener el perfil del usuario.
   * @param user
   */
  async getUserProfile(user:UserAuth) {
    try {
      const userInfo = await tasksRepository.getUserInfoByEmail(user.email);

      return responseHandler(userInfo);

    } catch (err) {
      throw new errorHandler().error(err).method('getUserProfile').debug(user).build();
    }
  }

  /**
   * Método para refrescar el token de acceso.
   * @param data
   */
  async refreshToken(data: { refreshToken: string }) {
    try {
      const refreshTokenData = jwtService.verifyToken(data.refreshToken, true);
      const {email, userName, role} = refreshTokenData;

      const generatedAccessTokenData = jwtService.generateAccessToken({email, userName, role});
      const generatedRefreshTokenData = jwtService.generateRefreshToken({email, userName, role});

      const tokens = {...generatedAccessTokenData, ...generatedRefreshTokenData, role};
      return responseHandler(tokens, 'Token actualizado');

    } catch (err) {
      throw new errorHandler().error(err).method('refreshToken').debug(data).build();
    }
  }
}

export default new TasksService();