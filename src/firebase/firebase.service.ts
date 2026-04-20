import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  public firestore!: admin.firestore.Firestore;

  onModuleInit() {
    // ✅ Prevent duplicate initialization
    if (admin.apps.length > 0) {
      console.log('⚠️ Firebase already initialized');
      this.firestore = admin.firestore();
      return;
    }

    let credentials: admin.ServiceAccount;

    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      credentials = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          .replace(/\\n/g, '\n')
          .replace(/"/g, ''),
      };

      console.log('✅ Firebase initialized with ENV variables');
    } else {
      const serviceAccountPath =
        process.env.FIREBASE_SERVICE_ACCOUNT ||
        'C:\\Users\\HP\\sahaayak\\sahayak\\sahaayak\\sahayak-80e13-firebase-adminsdk-fbsvc-e58fb25030.json';

      const resolvedPath = path.resolve(serviceAccountPath);

      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`❌ Firebase service account not found at ${resolvedPath}`);
      }

      credentials = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));

      console.log(`✅ Firebase initialized with JSON (${resolvedPath})`);
    }

    admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });

    this.firestore = admin.firestore();

    console.log('🔥 Connected to Firestore');
  }
}
