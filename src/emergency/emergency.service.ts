import { Injectable } from '@nestjs/common';
import Twilio from 'twilio';

@Injectable()
export class EmergencyService {
  private client;

  constructor() {
    this.client = Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async handleAlert(body: any) {
    const { fileUrl, encryptedKey, contacts } = body;

    for (let contact of contacts) {
      console.log("Sending SMS to:", contact.phone);

      await this.sendSMS(
        contact.phone,
        `🚨 EMERGENCY!
User may be in danger.

Secure File:
${fileUrl}

Key:
${encryptedKey}`
      );
    }

    return { message: 'Emergency alert sent' };
  }

  async sendSMS(phone: string, message: string) {
    try {
      const res = await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE, // Twilio number
        to: phone.startsWith('+') ? phone : `+91${phone}`
      });

      console.log("✅ SMS SENT:", res.sid);

    } catch (err: any) {
      console.log("❌ ERROR:", err.message);
    }
  }
}