import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Ensures ConfigService works everywhere
  ],
  providers: [
    MailService,
    {
      provide: 'MAIL_TRANSPORT',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('SMTP_HOST'),
        port: config.get<number>('SMTP_PORT'),
        secure: false,
        auth: {
          user: config.get<string>('SMTP_USER'),
          pass: config.get<string>('SMTP_PASS'),
        },
      }),
    },
  ],
  exports: [
    MailService,  
    'MAIL_TRANSPORT',   // Optional but useful if needed outside
  ],
})
export class MailModule {}
