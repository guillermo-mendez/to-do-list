import {Request, Response} from 'express';
import authsService from "../services/AuthService";
import validation from '../../validators/AuthValidator';

class AuthController {
  async login(req: Request, res: Response): Promise<Response> {
    validation.loginValidation(req.body);
    const {username, password} = req.body;
    const result = await authsService.login(username, password);
    return res.json(result);
  }

  async logout(req: Request, res: Response): Promise<Response> {
    const {userId} = req.user;
    const result = await authsService.logout(userId);
    return res.json(result);
  }

  async refreshToken(req: Request, res: Response): Promise<Response> {

    validation.refreshTokenValidation(req.body);
    const result = await authsService.refreshToken(req.body);
    return res.json(result);
  }

  async getUserRoles(req: Request, res: Response): Promise<Response> {

    const result = {code: 200, data: 'getUserRoles'}
    return res.json(result);
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {

    const result = {code: 200, data: 'resetPassword'}
    return res.json(result);
  }

  async changePassword(req: Request, res: Response): Promise<Response> {
    const result = {code: 200, data: 'changePassword'}
    return res.json(result);
  }
}

export default new AuthController();