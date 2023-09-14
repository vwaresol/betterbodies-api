import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ResetPasswordEntity } from './reset-password.entity';
import { UserRepository } from '../user/user.repository';
import { UserEntity } from '../user/user.entity';
import { ChangePasswordCodeDto } from 'src/dtos/reset-password/chage-password-code.dto';
import { resetPasswordConst } from 'src/const/reset-password.const';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ResetPasswordRepository extends Repository<ResetPasswordEntity> {
  constructor(dataSource: DataSource, private userRepository: UserRepository) {
    super(ResetPasswordEntity, dataSource.createEntityManager());
  }

  async deleteUnusedCodes(user: UserEntity): Promise<void> {
    const unusedCode = await this.find({
      where: { user: { id: user.id } },
    });

    if (unusedCode.length > 0) {
      this.softDelete(unusedCode.map((uc) => uc.id));
    }
  }

  async resetPassword(
    user: UserEntity,
    code: string,
  ): Promise<ResetPasswordEntity> {
    const resetPassword = this.create({
      token: code,
      user: user,
    });
    return await this.save(resetPassword);
  }

  async changePasswordCode(
    changePasswordCodeDto: ChangePasswordCodeDto,
  ): Promise<UserEntity> {
    const changePasswordAttempt = await this.createQueryBuilder('resetPassword')
      .innerJoinAndSelect('resetPassword.user', 'user')
      .where({ token: changePasswordCodeDto.token })
      .andWhere({ used: false })
      .getOne();

    if (!changePasswordAttempt) {
      throw new NotFoundException(resetPasswordConst.ERROR_CODE_NOT_FOUND);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      changePasswordCodeDto.password,
      salt,
    );

    changePasswordAttempt.used = true;
    try {
      this.userRepository.merge(changePasswordAttempt.user, {
        password: hashedPassword,
      });

      await this.userRepository.save(changePasswordAttempt.user);

      await this.save(changePasswordAttempt);
      return changePasswordAttempt.user;
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException();
    }
  }
}
