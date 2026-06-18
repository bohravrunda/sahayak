import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class EmergencyService {

  constructor(private firebaseService: FirebaseService) {}

async handleAlert(body: any) {
  const { fileUrl, encryptedKey, contacts } = body;

  console.log("📩 ALERT BODY:", body); // 🔥 ADD THIS

  for (let contact of contacts) {

    if (!contact.fcmToken) continue;

    await this.firebaseService.sendNotification(
      contact.fcmToken,
      String(fileUrl),
      String(encryptedKey)
    );
  }

  return { message: 'Sent' };
}}