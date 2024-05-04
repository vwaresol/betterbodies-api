import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { orderStatusDictionaryForEmial } from 'src/const/order.const';

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

  async orderConfirmation(order) {
    const today = new Date(order.date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    order.stringDate = today.toLocaleDateString('en-US', options);
    order.cart.map((item) => {
      item.totalByProduct = (item.price * item.total).toFixed(2);
      if (item.photos && item.photos.length > 0) {
        [item.photo] = item.photos.filter((photo) => {
          return photo.main === 1
            ? { ...item, ...photo }
            : { ...item, ...photo[0] };
        });
      } else {
        [item.photo] = [{ name: 'backend-assets/superprice-logo.png' }];
      }
    });

    order.total = order.total.toFixed(2);

    this.sendConfirmationEmails(order);
  }

  private async sendConfirmationEmails(order): Promise<void> {
    await this.mailerService.sendMail({
      to: [order.customer.username, 'targa5@aol.com'],
      subject: 'order confirmed',
      template: 'new-order',
      context: {
        logo: process.env.LOGO,
        order,
        customer: true,
        estado: true,
        tax: 8,
        status: orderStatusDictionaryForEmial[order.status.status],
        phone: order.phone.phone,
      },
    });
  }
}
