import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserProfileEntity } from './user-profile.entity';

@Injectable()
export class UserProfileRepository extends Repository<UserProfileEntity> {
  constructor(private dataSource: DataSource) {
    super(UserProfileEntity, dataSource.createEntityManager());
  }
}
