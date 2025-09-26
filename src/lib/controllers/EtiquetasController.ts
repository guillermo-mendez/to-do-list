import {Request, Response} from 'express';
import etiquetasService from "../services/EtiquetasService";
import validation from '../../validators/EtiquetasValidator';

class EtiquetasController {
  /**
   * Obtener todas las categorias del usuario autenticado
   * @param req
   * @param res
   */
  async getEtiquetas(req: Request, res: Response): Promise<Response> {
    const user = req.user;
    if (!user) {
      return res.status(401).json({message: 'No autorizado'});
    }
    const result = await etiquetasService.getEtiquetas(user);
    return res.json(result);
  }

  /**
   * Crear nueva categoria
   * @param req
   * @param res
   */
  async createEtiqueta(req: Request, res: Response): Promise<Response> {
    validation.createEtiquetaValidation(req.body);
    const userId = req.user?.userId;
    const result = await etiquetasService.createEtiqueta(req.body, userId);
    return res.json(result);
  }

  /**
   * Actualizar etiqueta
   * @param req
   * @param res
   */
  async updateEtiqueta(req: Request, res: Response): Promise<Response> {
    const etiquetaId = req.params.id;
    validation.updateEtiquetaValidation({...req.body,etiquetaId});
    const userId = req.user?.userId;
    const result = await etiquetasService.updateEtiqueta(req.body, etiquetaId, userId);
    return res.json(result);
  }

  /**
   * Eliminar etiqueta
   * @param req
   * @param res
   */
  async deleteEtiqueta(req: Request, res: Response): Promise<Response> {
    const etiquetaId = req.params.id;
    validation.deleteEtiquetaValidation({etiquetaId});
    const userId = req.user?.userId;
    const result = await etiquetasService.deleteEtiqueta(etiquetaId, userId);
    return res.json(result);
  }

}

export default new EtiquetasController();