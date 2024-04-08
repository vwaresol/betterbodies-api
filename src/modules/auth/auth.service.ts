import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { refreshTokenConst } from 'src/const/refresh-token.const';
import { AuthCredentialsDto } from 'src/dtos/auth/auth-credentials.dto';
import { SignupDto } from 'src/dtos/auth/sign-up.dto';

import { RefreskTokenService } from './refresh-token/refresh-token.service';
import { UserEntity } from './user/user.entity';
import { UserService } from './user/user.service';
import * as bcrypt from 'bcrypt';
import { authErrorsConst } from 'src/const/auth.const';
import { JwtPayload } from 'src/interfaces/jwt/jwt-payload.interface';
import { AuthServiceInterface } from 'src/interfaces/auth/auth-service.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject(UserService)
    private userService: UserService,
    @Inject(RefreskTokenService)
    private tokens: RefreskTokenService,
  ) {}

  async signUp(signUpDto: SignupDto): Promise<JwtPayload> {
    const user = await this.userService.createUser(signUpDto);
    const token = await this.tokens.generateAccessToken(user);
    const refresh = await this.tokens.generateRefreshToken(
      user,
      refreshTokenConst.JWT_REFRESH_TOKEN_DURATION,
    );

    return this.buildResponsePayload(user, token, refresh);
  }

  async signIn({
    username,
    password,
  }: AuthCredentialsDto): Promise<JwtPayload> {
    const user = await this.userService.findForUsername(username);

    if (user.password === '0') {
      throw new ConflictException(authErrorsConst.ERROR_PASSWORD_NOT_FOUND);
    }

    const valid = user ? await bcrypt.compare(password, user.password) : false;

    if (!valid) throw new UnauthorizedException(authErrorsConst.ERROR_LOGIN);

    const token = await this.tokens.generateAccessToken(user);
    const refresh = await this.tokens.generateRefreshToken(
      user,
      refreshTokenConst.JWT_REFRESH_TOKEN_DURATION,
    );
    return this.buildResponsePayload(user, token, refresh);
  }

  async refresh(refreshToken: string): Promise<JwtPayload> {
    const { user, token } = await this.tokens.createAccessTokenFromRefreshToken(
      refreshToken,
    );
    return this.buildResponsePayload(user, token);
  }

  // async findForUsername(email: string): Promise<User | null> {
  //   return await this.userServiceInterface.findForUsername(email);
  // }

  // async setPassword(authResetPassword: AuthResetPasswordDto): Promise<User> {
  //   let isPasswordValidated = true;
  //   if (authResetPassword.confirmationPassword != null)
  //     isPasswordValidated =
  //       authResetPassword.confirmationPassword == authResetPassword.password
  //         ? true
  //         : false;

  //   if (isPasswordValidated) {
  //     return await this.userServiceInterface.setPassword(
  //       authResetPassword.user,
  //       authResetPassword.password,
  //     );
  //   }
  //   throw new ForbiddenException(constants.ERROR_PASSWORD_NOT_MATCH);
  // }

  private async buildResponsePayload(
    user: UserEntity,
    accessToken: string,
    refreshToken?: string,
  ): Promise<JwtPayload> {
    const {
      role: { role },
    } = await this.userService.getUserById(user.id);

    return {
      userId: user.id,
      username: user.username,
      userInfoId: user.userProfile.id,
      role: role,
      payload: {
        type: 'bearer',
        token: accessToken,
        ...(refreshToken ? { refresh_token: refreshToken } : {}),
      },
    };
  }
}
