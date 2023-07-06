import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { RefreshTokenEntity } from './refresh-token.entity';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshTokenEntity> {
  constructor(private dataSource: DataSource) {
    super(RefreshTokenEntity, dataSource.createEntityManager());
  }
  async createRefreshToken(
    user: UserEntity,
    ttl: number,
  ): Promise<RefreshTokenEntity> {
    const expires = new Date();
    expires.setTime(expires.getTime() + ttl);

    const token = this.create({
      user,
      isRevoked: false,
      expires,
    });

    try {
      await this.save(token);
      return token;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error savin refresh token');
    }
  }

  async findTokenById(id: string): Promise<RefreshTokenEntity | null> {
    return this.findOne({ where: { id } });
  }
}
