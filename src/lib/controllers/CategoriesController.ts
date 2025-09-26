import {Request, Response} from 'express';
import categoriesService from "../services/CategoriesService";
import validation from '../../validators/CategoriesValidator';

class CategoriesController {
  /**
   * Obtener todas las categorias del usuario autenticado
   * @param req
   * @param res
   */
  async getCategories(req: Request, res: Response): Promise<Response> {
    const user = req.user;
    if (!user) {
      return res.status(401).json({message: 'No autorizado'});
    }
    const result = await categoriesService.getCategories(user);
    return res.json(result);
  }

  /**
   * Crear nueva categoria
   * @param req
   * @param res
   */
  async createCategory(req: Request, res: Response): Promise<Response> {
    validation.createCategoryValidation(req.body);
    const userId = req.user?.userId;
    const result = await categoriesService.createCategory(req.body, userId);
    return res.json(result);
  }

  /**
   * Actualizar categoria
   * @param req
   * @param res
   */
  async updateCategory(req: Request, res: Response): Promise<Response> {
    const categoryId = req.params.id;
    validation.updateTaskValidation({...req.body,categoryId});
    const userId = req.user?.userId;
    const result = await categoriesService.updateCategory(req.body, categoryId, userId);
    return res.json(result);
  }

  /**
   * Eliminar categoria
   * @param req
   * @param res
   */
  async deleteCategory(req: Request, res: Response): Promise<Response> {
    const categoryId = req.params.id;
    validation.deleteTaskValidation({categoryId});
    const userId = req.user?.userId;
    const result = await categoriesService.deleteCategory(categoryId, userId);
    return res.json(result);
  }

}

export default new CategoriesController();