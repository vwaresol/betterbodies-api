import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/user.entity';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { RefreshTokenEntity } from './refresh-token.entity';
import { RefreshTokenServiceInterface } from 'src/interfaces/refresh-token/refresh-token-service.interface';
import { refreshTokenErrorConst } from 'src/const/refresh-token.const';
import { RefreshTokenPayloadInterface } from 'src/interfaces/refresh-token/refresh-token-payload.interface';
import { RefreshTokenRepository } from './refresh-token.repository';
import { UserService } from '../user/user.service';

@Injectable()
export class RefreskTokenService implements RefreshTokenServiceInterface {
  constructor(
    @Inject(UserService)
    private readonly users: UserService,
    private readonly tokens: RefreshTokenRepository,
    private readonly jwt: JwtService,
  ) {
    this.tokens = tokens;
    this.jwt = jwt;
    this.users = users;
  }

  async generateAccessToken(user: UserEntity): Promise<string> {
    const opts: SignOptions = {
      subject: String(user.id),
    };

    return await this.jwt.signAsync({}, opts);
  }

  async generateRefreshToken(
    user: UserEntity,
    expiresIn: number,
  ): Promise<string> {
    const token = await this.tokens.createRefreshToken(user, expiresIn);

    const opts: SignOptions = {
      expiresIn,
      subject: String(user.id),
      jwtid: String(token.id),
    };

    return this.jwt.signAsync({}, opts);
  }

  async resolveRefreshToken(
    encoded: string,
  ): Promise<{ user: UserEntity; token: RefreshTokenEntity }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    if (!token)
      throw new UnprocessableEntityException(
        refreshTokenErrorConst.REFRESH_TOKEN_NOT_FOUND,
      );
    if (token.isRevoked)
      throw new UnprocessableEntityException(
        refreshTokenErrorConst.REFRESH_TOKEN_REVOKED,
      );

    const user = await this.getUserFromRefreshTokenPayload(payload);

    if (!user)
      throw new UnprocessableEntityException(
        refreshTokenErrorConst.REFRESH_TOKEN_MALFORMED,
      );

    return { user, token };
  }

  async createAccessTokenFromRefreshToken(
    refresh: string,
  ): Promise<{ token: string; user: UserEntity }> {
    const { user } = await this.resolveRefreshToken(refresh);
    const token = await this.generateAccessToken(user);
    return { user, token };
  }

  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayloadInterface> {
    try {
      return this.jwt.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException(
          refreshTokenErrorConst.REFRESH_TOKEN_EXPIRED,
        );
      } else {
        throw new UnprocessableEntityException(
          refreshTokenErrorConst.REFRESH_TOKEN_MALFORMED,
        );
      }
    }
  }

  private async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayloadInterface,
  ): Promise<UserEntity> {
    const subId = payload.sub;

    if (!subId)
      throw new UnprocessableEntityException(
        refreshTokenErrorConst.REFRESH_TOKEN_MALFORMED,
      );

    return this.users.getUserById(subId.toString());
  }

  private async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayloadInterface,
  ): Promise<RefreshTokenEntity | null> {
    const tokenId = payload.jti;

    if (!tokenId)
      throw new UnprocessableEntityException(
        refreshTokenErrorConst.REFRESH_TOKEN_MALFORMED,
      );

    return this.tokens.findTokenById(tokenId);
  }
}
