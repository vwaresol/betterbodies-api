import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  resetPassword(token: string, email: string) {
    this.sendResetPasswordEmail(token, email);
  }

  private async sendResetPasswordEmail(
    token: string,
    email: string,
  ): Promise<void> {
    const year = new Date().getFullYear();

    await this.mailerService
      .sendMail({
        to: email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Password Recovery',
        template: 'reset-password',
        context: {
          token,
          logo: process.env.LOGO,
          year: year,
        },
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
