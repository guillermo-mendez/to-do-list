import {Request, Response} from 'express';
import authsService from "../services/AuthService";
import validation from '../../validators/AuthValidator';

class AuthController {
  /**
   * Registro de usuario
   * @param req
   * @param res
   */
  async userRegistration(req: Request, res: Response): Promise<Response> {
    validation.userRegistrationValidation(req.body);
    const result = await authsService.userRegistration(req.body);
    return res.json(result);
  }

  /**
   * Login de usuario
   * @param req
   * @param res
   */
  async login(req: Request, res: Response): Promise<Response> {
    validation.loginValidation(req.body);
    const {email, password} = req.body;
    const result = await authsService.login(email, password);
    return res.json(result);
  }

  /**
   * Refresh Token
   * @param req
   * @param res
   */
  async refreshToken(req: Request, res: Response): Promise<Response> {

    validation.refreshTokenValidation(req.body);
    const result = await authsService.refreshToken(req.body);
    return res.json(result);
  }

  /**
   * Obtener perfil de usuario
   * @param req
   * @param res
   */
  async getUserProfile(req: Request, res: Response): Promise<Response> {
   const user = req.user;
   if (!user) {
      return res.status(401).json({message: 'No autorizado'});
    }
    const result = await authsService.getUserProfile(user);
    return res.json(result);
  }

}

export default new AuthController();