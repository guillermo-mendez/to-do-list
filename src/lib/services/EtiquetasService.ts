import {ResultService} from "../../entities/Result-service";
import {errorHandler, responseHandler} from 'error-handler-express-ts';
import etiquetasRepository from '../repositories/EtiquetasRepository';
import {UserAuth} from "../../entities/Authentication";
import {CreateEtiqueta, UpdateEtiquetas} from "../../entities/Etiquetas";

class EtiquetasService {
  /**
   * Get etiquetas for the authenticated user
   * @param user
   */
  async getEtiquetas(user: UserAuth): Promise<ResultService> {
    try {
      const userId = user.userId;

      const tasks = await etiquetasRepository.getEtiquetas(userId);

      return responseHandler(tasks);

    } catch (err) {
      throw new errorHandler().error(err).method('getEtiquetas').debug().build();
    }
  }

  /**
   * Método para crear una nueva etiqueta.
   * @param data<CreateEtiqueta>
   * @param userId
   */
  async createEtiqueta(data:CreateEtiqueta, userId: string): Promise<ResultService> {
    try {
      await etiquetasRepository.createEtiqueta(data,userId);
      const tasks = await etiquetasRepository.getEtiquetas(userId);

        return responseHandler(tasks);


    } catch (err) {
      throw new errorHandler().error(err).method('createEtiqueta').debug().build();
    }
  }

  /**
   * Método para actualizar una etiqueta.
   * @param data<UpdateEtiquetas>
   * @param etiquetaId
   * @param userId
   */
  async updateEtiqueta(data:UpdateEtiquetas, etiquetaId:string, userId: string): Promise<ResultService> {
    try {

      await etiquetasRepository.updateEtiqueta(data,etiquetaId,userId);
      const tasks = await etiquetasRepository.getEtiquetas(userId);

      return responseHandler(tasks);


    } catch (err) {
      throw new errorHandler().error(err).method('updateEtiqueta').debug().build();
    }
  }

  /**
   * Método para eliminar una etiqueta.
   * @param etiquetaId
   * @param userId
   */
  async deleteEtiqueta(etiquetaId:string, userId: string): Promise<ResultService> {
    try {

      await etiquetasRepository.deleteEtiqueta(etiquetaId,userId);
      const tasks = await etiquetasRepository.getEtiquetas(userId);

      return responseHandler(tasks);


    } catch (err) {
      throw new errorHandler().error(err).method('deleteEtiqueta').debug().build();
    }
  }

}

export default new EtiquetasService();