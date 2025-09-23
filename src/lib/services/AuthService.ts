import {ResultService} from "../../entities/Result-service";
import {errorHandler, responseHandler} from 'error-handler-express-ts';
import bcrypt from 'bcryptjs';
import authRepository from '../repositories/AuthRepository';
import jwtService from '../../security/JWTService';
import {BCRYPT_SALT_ROUNDS, STATUSES} from '../../constants';
import {UserAuth, UserRegistration} from "../../entities/Authentication";

class AuthService {
  /**
   * Registro de usuario
   * @param data
   */
  async userRegistration(data: UserRegistration): Promise<ResultService> {
    try {
      const {password} = data;
      data.password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
      await authRepository.userRegistration(data);

      return responseHandler('Usuario registrado correctamente');

    } catch (err) {
      throw new errorHandler().error(err).method('userRegistration').debug(data).build();
    }
  }

  /**
   *
   * @param email
   * @param password
   */
  async login(email: string, password: string): Promise<ResultService> {
    try {
      const user = await authRepository.getInfoSessionByUser(email);

        // Compara la contraseña ingresada con la contraseña encriptada en la base de datos
        const isValidPasswords = await bcrypt.compare(password, user.passwordHash); // comparar que las contraseñas son iguales
        if (!isValidPasswords) {
          throw new errorHandler()
            .unauthorized('Credenciales incorrecta')
            .debug({email, password})
            .build();
        }

        const generatedAccessTokenData = jwtService.generateAccessToken({
          email,
          userName: user.name,
          role: 'admin'
        });
        const generatedRefreshTokenData = jwtService.generateRefreshToken({
          email,
          userName: user.name,
          role: 'admin'
        });

        const tokens = {...generatedAccessTokenData, ...generatedRefreshTokenData, role: 'admin'};

        return responseHandler(tokens);


    } catch (err) {
      throw new errorHandler().error(err).method('login').debug().build();
    }
  }

  /**
   * Método para obtener el perfil del usuario.
   * @param user
   */
  async getUserProfile(user:UserAuth) {
    try {
      const userInfo = await authRepository.getUserInfoByEmail(user.email);

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

export default new AuthService();