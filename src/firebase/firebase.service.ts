import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  public firestore: admin.firestore.Firestore;

  onModuleInit() {
    let credentials: admin.ServiceAccount;

    // 1️⃣ Prefer env variables
   if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
) {
  credentials = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, ''),
  };
  console.log('✅ Firebase initialized with ENV variables');
} else {
      // 2️⃣ Fallback to local JSON file
      const serviceAccountPath =
        process.env.FIREBASE_SERVICE_ACCOUNT || 'C:\\Users\\HP\\sahaayak\\sahayak\\sahaayak\\sahayak-80e13-firebase-adminsdk-fbsvc-e58fb25030.json';
      const resolvedPath = path.resolve(serviceAccountPath);

      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`❌ Firebase service account not found at ${resolvedPath}`);
      }

      credentials = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
      console.log(`✅ Firebase initialized with service account JSON (${resolvedPath})`);
    }

    // 3️⃣ Initialize Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });

    this.firestore = admin.firestore();
    console.log('🔥 Connected to Firestore');
  }
}
