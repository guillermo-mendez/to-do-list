import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import blacklistRepository from '../lib/repositories/BlacklistRepository';
import {BCRYPT_SALT_ROUNDS} from "../constants";
import {
  GenerateTokensProps,
  GenerateTokensResponse,
  PayloadTokenProps,
  PayloadTokenResponse
} from "../entities/BuildTokens";
import ms from "ms";

class JWTService {
  private secretKey: string;
  private refreshSecretKey: string;
  private accessTokenExpiry: string;
  private refreshTokenExpiry: string;

  constructor() {
    // Se leen las claves y configuraciones desde variables de entorno para mayor seguridad
    this.secretKey = process.env.JWT_SECRET_KEY || 'defaultSecretKey';
    this.refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY || 'defaultRefreshSecretKey';
    this.accessTokenExpiry = process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m'; // Duración del Access Token
    this.refreshTokenExpiry = process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d'; // Duración del Refresh Token
  }


  private getPayloadToken({email, userName, role}: PayloadTokenProps): PayloadTokenResponse {
    const expAccessToken = Math.floor((Date.now() + ms('15m')) / 1000);
    const expRefreshToken = Math.floor((Date.now() + ms('7d')) / 1000);
    const iat = Math.floor(Date.now() / 1000);

    const payloadAccessToken = {
      iss: 'https://citruxtec.com/',
      expiration: expAccessToken,
      iat: iat,
      sub: email,
      aud: 'colombia',
      tokenType: 'access_token',
      email: email,
      userName: userName,
      role: role
    };

    const payloadRefreshToken = {
      iss: 'https://citruxtec.com/',
      expiration: expRefreshToken,
      iat: iat,
      sub: email,
      aud: 'colombia',
      tokenType: 'refresh_token',
      email: email,
      userName: userName,
      role: role
    };

    return {payloadAccessToken, payloadRefreshToken, expAccessToken, expRefreshToken, iat};

  }


  /**
   * Genera un Access Token.
   * @param payload - Datos a incluir en el token.
   * @returns Access Token como string.
   */
  generateAccessToken({email, userName, role}: GenerateTokensProps): {accessToken: string, expirationAccessToken: number} {
    const { payloadAccessToken, expAccessToken } = this.getPayloadToken({email, userName, role});

    const options: SignOptions = {
      expiresIn: this.accessTokenExpiry,
    };

    const accessToken = jwt.sign(payloadAccessToken, this.secretKey, options);
    return {
      accessToken,
      expirationAccessToken: expAccessToken
    }
  }

  /**
   * Genera un Refresh Token.
   * @param payload - Datos a incluir en el token.
   * @returns Refresh Token como string.
   */
  generateRefreshToken({email, userName, role}: GenerateTokensProps): {refreshToken: string, expirationRefreshToken: number} {
    const { payloadRefreshToken, expRefreshToken } = this.getPayloadToken({email, userName, role});

    const options: SignOptions = {
      expiresIn: this.refreshTokenExpiry,
    };
    const refreshToken = jwt.sign(payloadRefreshToken, this.refreshSecretKey, options);
    return {
      refreshToken,
      expirationRefreshToken: expRefreshToken
    }
  }

  /**
   * Verifica y decodifica un token.
   * @param token - Token a verificar.
   * @param isRefreshToken - Indica si es un Refresh Token (por defecto, false).
   * @returns Decodificación del payload si el token es válido.
   * @throws Error si el token es inválido o ha expirado.
   */
  verifyToken(token: string, isRefreshToken: boolean = false): JwtPayload {
    try {
      const secret = isRefreshToken ? this.refreshSecretKey : this.secretKey;
      return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Renueva un Access Token usando un Refresh Token válido.
   * @param refreshToken - Refresh Token válido.
   * @returns Nuevo Access Token.
   * @throws Error si el Refresh Token es inválido o ha expirado.
   */
  renewAccessToken(refreshToken: string): {accessToken: string, expirationAccessToken: number} {
    const decoded = this.verifyToken(refreshToken, true);
    // Evitamos incluir información sensible en el payload
    const {email, userName, role} = decoded;

    return this.generateAccessToken({email, userName, role});
  }

  /**
   * Invalida un Refresh Token agregándolo a la lista negra.
   * @param refreshToken - Refresh Token.
   * @param userId - ID del usuario asociado.
   * @param expiresAt - Fecha de expiración del token.
   * @param reason - Razón para invalidar el token (opcional).
   */
  async invalidateRefreshToken(refreshToken: string, userId: number, expiresAt: Date, reason?: string): Promise<void> {
    const hashedToken = await bcrypt.hash(refreshToken, BCRYPT_SALT_ROUNDS); // Hash para mayor seguridad
    await blacklistRepository.addTokenToBlacklist(hashedToken, userId, expiresAt, reason || 'No especificada');
    console.log(`Refresh Token invalidado: ${hashedToken}`);
  }

  /**
   * Verifica si un Refresh Token está en la lista negra.
   * @param refreshToken - Refresh Token.
   * @returns True si está invalidado, False en caso contrario.
   */
  async isRefreshTokenBlacklisted(refreshToken: string): Promise<boolean> {
    const hashedToken = await bcrypt.hash(refreshToken, BCRYPT_SALT_ROUNDS); // Hash para mayor seguridad
    return blacklistRepository.isTokenBlacklisted(hashedToken);
  }

}

export default new JWTService();
