import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';
import { RoleRepository } from './role/role.repository';
import { RefreskTokenService } from './refresh-token/refresh-token.service';
import { RefreshTokenRepository } from './refresh-token/refresh-token.repository';
import { UserProfileRepository } from '../user-profile/user-profile.repository';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from './user/user.entity';
import { RoleEntity } from './role/role.entity';
import { UserProfileEntity } from '../user-profile/user-profile.entity';
import { RefreshTokenEntity } from './refresh-token/refresh-token.entity';
import { RoleService } from './role/role.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { authConst } from 'src/const/auth.const';
import { ResetPasswordRepository } from './reset-password/reset-password.repository';
import { ResetPasswordService } from './reset-password/reset-password.service';
import { ResetPasswordEntity } from './reset-password/reset-password.entity';
import { MailModule } from 'src/providers/mail/mail.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 10,
        },
      }),
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      RoleEntity,
      UserProfileEntity,
      RefreshTokenEntity,
      ResetPasswordEntity,
    ]),
    MailModule,
  ],
  controllers: [AuthController, UserController],
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
    UserRepository,
    RoleService,
    RoleRepository,
    UserProfileRepository,
    UserProfileRepository,
    RefreskTokenService,
    RefreshTokenRepository,
    ResetPasswordService,
    ResetPasswordRepository,
    // MailService,
  ],
  exports: [UserService, JwtStrategy],
})
export class AuthModule {}
