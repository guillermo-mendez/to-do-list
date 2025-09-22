import {ResultService} from "../../entities/Result-service";
import {errorHandler, responseHandler} from 'error-handler-express-ts';
import bcrypt from 'bcryptjs';
import authRepository from '../repositories/AuthRepository';
import jwtService from '../../security/JWTService';
import {STATUSES} from '../../constants';

class AuthService {

  async getUserInfoByUser(user: string) {
    try {
      const statusId = STATUSES.ACTIVE.id;
      const userInfo = await authRepository.getUserInfoByUser(user, statusId);

      return responseHandler(userInfo);

    } catch (err) {
      throw new errorHandler().error(err).method('getUserInfoByUser').debug(user).build();
    }
  }

  async getPoliciesByRoles(role: string) {
    try {

      const policies = await authRepository.getPoliciesByRoles(role, STATUSES.ACTIVE.id);

      const policyIds = policies.map((policy: { policyId: number; }) => policy.policyId);

      const generalPolicies = await authRepository.getGeneralPolicies(STATUSES.ACTIVE.id);
      const generalPolicyIds = generalPolicies.map((policy: { policyId: number; }) => policy.policyId);

      const allPolicies = [...policyIds, ...generalPolicyIds];
      const uniquePolicies = [...new Set(allPolicies)];

      const policiesBackend = await authRepository.getPoliciesBackend(uniquePolicies, STATUSES.ACTIVE.id);

      return responseHandler(policiesBackend);

    } catch (err) {
      throw new errorHandler().error(err).method('getPoliciesByRoles').debug().build();
    }
  }

  async login(username: string, password: string): Promise<ResultService> {
    try {
      const statusId = STATUSES.ACTIVE.id;
      const userAdminId = 1;
      const infoSession = await authRepository.getInfoSessionByUser(username, statusId);

      if (infoSession) {
        const {
          userId,
          name,
          lastName,
          email,
          locked,
          temporaryCredentials,
          passwordDB,
          sessionsAllowed
        } = infoSession;

        const activeSession = await authRepository.getActiveSession(userId, statusId);
        const numberActiveSessions = activeSession.length

        // Compara la contraseña ingresada con la contraseña encriptada en la base de datos
        const isValidPasswords = await bcrypt.compare(password, passwordDB); // comparar que las contraseñas son iguales
        if (!isValidPasswords) {
          throw new errorHandler()
            .unauthorized('Credenciales incorrecta')
            .debug({username, password})
            .build();
        }

        // Si el usuario esta bloqueado y las credenciales temporales han caducado
        if (locked === 'yes' && temporaryCredentials === 'yes' && userId !== userAdminId) {
          throw new errorHandler()
            .unauthorized('Usuario bloqueado, las credenciales temporales han caducado, consulte con el administrador')
            .debug({username, password})
            .build();
        }

        if (numberActiveSessions >= sessionsAllowed) {
          throw new errorHandler()
            .unauthorized('Este usuario ha superado el numero de sesiónes activas')
            .debug({username, password})
            .build();
        }

        const {insertId: sessionId} = await authRepository.newUserSession(userId, statusId);

        const generatedAccessTokenData = jwtService.generateAccessToken({
          email,
          userName: `${name} ${lastName}`,
          role: 'admin'
        });
        const generatedRefreshTokenData = jwtService.generateRefreshToken({
          email,
          userName: `${name} ${lastName}`,
          role: 'admin'
        });

        const tokens = {...generatedAccessTokenData, ...generatedRefreshTokenData, role: 'admin'};

        return responseHandler(tokens);

      } else {
        throw new errorHandler()
          .unauthorized('El usuario es incorrecto')
          .debug({username, password})
          .build();
      }

    } catch (err) {
      throw new errorHandler().error(err).method('login').debug().build();
    }
  }

  async logout(userId: number) {
    try {
      await authRepository.destroySession(userId);
      // await generateToken.deleteTokensByKeyId(1);

      return responseHandler('Sesión cerrada');

    } catch (err) {
      throw new errorHandler().error(err).method('logout').debug(userId).build();
    }

  }

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

export default new AuthService();