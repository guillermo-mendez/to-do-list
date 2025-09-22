import {Request, Response, NextFunction} from 'express';
import authService from '../lib/services/AuthService';
import {ENDPOINTS_WITH_AUTHORIZATION} from '../constants';
import {removeNumbersFromAString} from '../utils/removeNumbersFromAString';

const authorization = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
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

  const role = req.user.role;

  if (!role || role === '') {
    res.status(401).json({message: 'este usuario no tiene roles, póngase en contacto con el administrador'});
  }

  const policies = await authService.getPoliciesByRoles(role);

  if (!policies || policies.data.length === 0) {
    res.status(401).json({message: 'este rol de usuario no tiene políticas, póngase en contacto con el administrador'});

  }

  const policyFound = policies.data.find((policy: {
    endpoint: string;
    method: string;
  }) => removeNumbersFromAString(policy.endpoint) === removeNumbersFromAString(req.path) && policy.method.toUpperCase() === req.method.toUpperCase());

  if (policyFound) {
    next();
  } else {
    res.status(401).json({message: 'No tienes permisos para esta solicitud'});
  }

};


export default authorization;

