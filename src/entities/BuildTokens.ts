export interface GenerateTokensResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
    exp: number;
    tokenType: string;
  },
  role: string;
}

export interface GenerateTokensProps {
  email: string;
  userName: string;
  role: string;
}

export interface PayloadTokenProps {
  email: string;
  userName: string;
  role: string;
}

export interface payloadTokenResponse {
  iss: string;
  expiration: number;
  iat: number;
  sub: string;
  aud: string;
  tokenType: string;
  email: string;
  userName: string;
  role: string;
}
export interface PayloadTokenResponse {
  payloadAccessToken: payloadTokenResponse;
  payloadRefreshToken: payloadTokenResponse;
  expAccessToken: number;
  expRefreshToken: number;
  iat: number;
}

export interface StoreKeysProps {
  email: string;
  privateKey: string;
  accessToken: string;
  refreshToken: string;
}

export interface GenerateKeyPairResponse {
  kidEncode: string;
  privateKey: object;
}
