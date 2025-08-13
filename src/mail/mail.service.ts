import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `http://localhost:3000/auth/verify?token=${token}`;

    await this.transporter.sendMail({
      to: email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
    });
  }
}
