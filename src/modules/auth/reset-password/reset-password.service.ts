import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { ResetPasswordServiceInterface } from 'src/interfaces/reset-password/reset-password.interface';
import { ResetPasswordDto } from 'src/dtos/reset-password/reset-password.dto';
import { ResetPasswordRepository } from './reset-password.repository';
import crypto = require('crypto');
import { userErrorsConst } from 'src/const/user.const';
import { ChangePasswordCodeDto } from 'src/dtos/reset-password/chage-password-code.dto';
import { MailService } from 'src/providers/mail/mail.service';

@Injectable()
export class ResetPasswordService implements ResetPasswordServiceInterface {
  constructor(
    @InjectRepository(ResetPasswordRepository)
    private resetPasswordRepository: ResetPasswordRepository,
    @Inject(UserService)
    private userService: UserService,
    private mailService: MailService,
  ) {}

  async resetPassword({ email }: ResetPasswordDto): Promise<string> {
    const user = await this.userService.findForUsername(email);
    if (user) {
      const token = this.generateToken(6);
      await this.resetPasswordRepository.deleteUnusedCodes(user);
      await this.resetPasswordRepository.resetPassword(user, token);

      await this.mailService.resetPassword(token, email);
      return token;
    }
    throw new NotFoundException(userErrorsConst.ERROR_USER_NOT_FOUND);
  }

  async changePasswordCode(
    changePasswordCodeDto: ChangePasswordCodeDto,
  ): Promise<void> {
    await this.resetPasswordRepository.changePasswordCode(
      changePasswordCodeDto,
    );
  }

  private generateToken(length: number): string {
    return crypto
      .randomBytes(length / 2)
      .toString('hex')
      .toUpperCase();
  }
}
