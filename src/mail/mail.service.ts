import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // 👇 Yahan debug logs daalo
    console.log('👉 SMTP_HOST:', this.configService.get<string>('SMTP_HOST'));
    console.log('👉 SMTP_PORT:', this.configService.get<string>('SMTP_PORT'));
    console.log('👉 SMTP_USER:', this.configService.get<string>('SMTP_USER'));
    console.log('👉 SMTP_PASS:', this.configService.get<string>('SMTP_PASS'));

    this.transporter = nodemailer.createTransport({
      service: 'gmail',  // ⚡ ab sirf gmail bolo
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const info = await this.transporter.sendMail({
      from: `"Sahaayak" <${this.configService.get<string>('SMTP_USER')}>`,
      to,
      subject,
      text,
    });
    console.log('✅ Email sent:', info.messageId);
    return info;
  }
}
