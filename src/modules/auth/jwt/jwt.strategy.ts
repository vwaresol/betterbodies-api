import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../user/user.repository';
import { JwtAccessTokenPayload } from 'src/interfaces/jwt/jwt-access-token-payload.interface';
import { authConst } from 'src/const/auth.const';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: false,
      signOptions: {
        expiresIn: authConst.TOKEN_EXPIRATION,
      },
    });
  }

  async validate(payload: JwtAccessTokenPayload): Promise<UserEntity> {
    const { sub: id } = payload;

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: id.toString() },
      relations: ['userProfile'],
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
