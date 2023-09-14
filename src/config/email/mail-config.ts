import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path/posix';

export function mailConfig(config: any): any {
  return {
    // transport: 'smtps://appcdsa@gmail.com:Cvvtuhobjtfaeeyg@smtp.gmail.com',
    transport: {
      host: config.get('MAIL_HOST'),
      secure: false,
      port: 587,
      secureConnection: true,
      requireTLS: true,
      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASSWORD'),
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    },
    defaults: {
      from: `"No Reply" <${config.get('MAIL_FROM')}>`,
    },
    template: {
      dir: join(__dirname, '../../../src/providers/mail/templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
}
