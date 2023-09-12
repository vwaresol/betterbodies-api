import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  resetPassword(token: string, email: string) {
    this.sendResetPasswordEmail(token, email);
  }

  private async sendResetPasswordEmail(
    token: string,
    email: string,
  ): Promise<void> {
    await this.mailerService
      .sendMail({
        to: email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Reestablecer contraseña',
        template: 'reset-password',
        context: {
          token,
          logo: this.configService.get('LOGO'),
        },
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
