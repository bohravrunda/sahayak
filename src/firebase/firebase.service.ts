// src/firebase/firebase.service.ts
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { join } from 'path';

@Injectable()
export class FirebaseService {
  private app!: admin.app.App; // ! lagaya taaki TS ko pata ho constructor me initialize hoga

  constructor() {
    if (!admin.apps.length) {
      // JSON file se load kar rahe ho
      const serviceAccount = require(join(
        __dirname,
        '../../firebase-service-account.json',
      ));

      // Initialize app
      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      this.app = admin.app(); // Agar pehle se initialized hai
    }
  }

  getAuth() {
    return this.app.auth();
  }

  getFirestore() {
    return this.app.firestore();
  }

  // Ye tumhare auth.service.ts ke liye shortcut method hai
  getDb() {
    return this.getFirestore();
  }
}
