import {NextFunction, Request, Response} from 'express';
import jwtService from '../security/JWTService';
import {ENDPOINTS_WITH_AUTHORIZATION} from '../constants';
import {UserAuth} from "../entities/Authentication";
import authRepository from "../lib/repositories/AuthRepository";

// Define el tipo de datos que el middleware va a agregar a la solicitud
declare global {
  namespace Express {
    interface Request {
      user: UserAuth;
      fileValidationError: string;
    }
  }
}
const authentication = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const isAllowed = ENDPOINTS_WITH_AUTHORIZATION.some(endpoint => req.path.includes(endpoint));

  if (isAllowed) {
    return next();
  }

  if (req.path.startsWith('/swagger-api-docs')) {
    return next();
  }

  if (req.path.includes('/health') && req.method.toUpperCase() === 'GET') {
    return next();
  }

  if (!req.headers['authorization']) {
    return res.status(403).json({statusText: 'Api not authorized, invalid header'});
  }

  const accessToken = req.headers['authorization'].replace('Bearer ', '');
  if (!accessToken) {
    return res.status(403).json({statusText: 'Invalid authentication token'});
  }

  try {
    const {email, role} = jwtService.verifyToken(accessToken);
    if (!email) {
      return res.status(403).json({statusText: 'Invalid authentication token'});
    }
    const user = await authRepository.getUserInfoByEmail(email);
    req.user = <UserAuth>{userId: user.userId, email, role}
    next();

  } catch (error) {
    return res.status(403).json({statusText: 'Internal error authentication failed'});
  }

};

export default authentication;

