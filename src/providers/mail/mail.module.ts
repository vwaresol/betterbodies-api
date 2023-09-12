import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { mailConfig } from 'src/config/email/mail-config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return mailConfig(config);
      },
    }),
  ],
  providers: [ConfigService, MailService],
  exports: [MailService],
})
export class MailModule {}
