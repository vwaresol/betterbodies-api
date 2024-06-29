import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepository } from 'src/modules/auth/user/user.repository';

@ValidatorConstraint({ name: 'emailExist', async: true })
@Injectable()
export class EmailExistRule implements ValidatorConstraintInterface {
  constructor(private userRepository: UserRepository) {}

  async validate(username: string): Promise<boolean> {
    try {
      await this.userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      return true;
    }
    return false;
  }
}
