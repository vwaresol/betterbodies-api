import { ChangePasswordCodeDto } from 'src/dtos/reset-password/chage-password-code.dto';
import { ResetPasswordDto } from 'src/dtos/reset-password/reset-password.dto';

export interface ResetPasswordServiceInterface {
  resetPassword(ResetPasswordDto: ResetPasswordDto): Promise<string>;
  changePasswordCode(changePasswodCodeDto: ChangePasswordCodeDto): void;
}
