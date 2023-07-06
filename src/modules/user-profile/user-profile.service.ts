import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfileServiceInterface } from 'src/interfaces/user-profile/user-profile-service.interface';
import { UserProfileEntity } from './user-profile.entity';
import { UserProfileRepository } from './user-profile.repository';

@Injectable()
export class UserProfileService implements UserProfileServiceInterface {
  constructor(
    @InjectRepository(UserProfileRepository)
    private userInfoRepository: UserProfileRepository,
  ) {}

  async getProfile(id: string): Promise<UserProfileEntity> {
    return await this.userInfoRepository.findOne({
      where: { id },
      relations: ['address', 'phone','user'],
    });
  }
}
