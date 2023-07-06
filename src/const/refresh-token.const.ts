export const refreshTokenConst = {
  SERVICE_INTERFACE: 'RefreshTokenServiceInterface',
  PAYLOAD_INTERFACE: 'RefreshTokenPayloadInterface',
  JWT_REFRESH_TOKEN_DURATION: 60 * 60 * 24 * 30 /* 30 days */,
};

export const refreshTokenErrorConst = {
  REFRESH_TOKEN_MALFORMED: 'Refresh token malformed',
  REFRESH_TOKEN_EXPIRED: 'Refresh token expired',
  REFRESH_TOKEN_REVOKED: 'Refresh token revoked',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found',
};
