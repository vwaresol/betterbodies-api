import { RefreshTokenEntity } from 'src/modules/auth/refresh-token/refresh-token.entity';
import { UserEntity } from 'src/modules/auth/user/user.entity';

export interface RefreshTokenServiceInterface {
  generateAccessToken(user: UserEntity): Promise<string>;
  generateRefreshToken(user: UserEntity, expiresIn: number): Promise<string>;
  resolveRefreshToken(
    encoded: string,
  ): Promise<{ user: UserEntity; token: RefreshTokenEntity }>;
  createAccessTokenFromRefreshToken(
    refresh: string,
  ): Promise<{ token: string; user: UserEntity }>;
}
