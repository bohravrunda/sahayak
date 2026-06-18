// import { Injectable, OnModuleInit } from '@nestjs/common';
// import * as admin from 'firebase-admin';
// import * as fs from 'fs';
// import * as path from 'path';

// @Injectable()
// export class FirebaseService implements OnModuleInit {
//   public firestore!: admin.firestore.Firestore;

//   onModuleInit() {
//     // ✅ Prevent duplicate initialization
//     if (admin.apps.length > 0) {
//       console.log('⚠️ Firebase already initialized');
//       this.firestore = admin.firestore();
//       return;
//     }

//     let credentials: admin.ServiceAccount;

//     if (
//       process.env.FIREBASE_PROJECT_ID &&
//       process.env.FIREBASE_CLIENT_EMAIL &&
//       process.env.FIREBASE_PRIVATE_KEY
//     ) {
//       credentials = {
//         projectId: process.env.FIREBASE_PROJECT_ID,
//         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//         privateKey: process.env.FIREBASE_PRIVATE_KEY
//           .replace(/\\n/g, '\n')
//           .replace(/"/g, ''),
//       };

//       console.log('✅ Firebase initialized with ENV variables');
//     } else {
//       const serviceAccountPath =
//         process.env.FIREBASE_SERVICE_ACCOUNT ||
//         'C:\\Users\\HP\\sahaayak\\sahayak\\sahaayak\\sahayak-80e13-firebase-adminsdk-fbsvc-e58fb25030.json';

//       const resolvedPath = path.resolve(serviceAccountPath);

//       if (!fs.existsSync(resolvedPath)) {
//         throw new Error(`❌ Firebase service account not found at ${resolvedPath}`);
//       }

//       credentials = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));

//       console.log(`✅ Firebase initialized with JSON (${resolvedPath})`);
//     }

//     admin.initializeApp({
//       credential: admin.credential.cert(credentials),
//     });

//     this.firestore = admin.firestore();

//     console.log('🔥 Connected to Firestore');
//   }
// }



import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  public firestore!: admin.firestore.Firestore;

  onModuleInit() {
    // 🔥 Prevent duplicate init
    if (admin.apps.length > 0) {
      console.log('⚠️ Firebase already initialized');
      this.firestore = admin.firestore();
      return;
    }

    let credentials: admin.ServiceAccount;

    // ✅ ENV METHOD (Production)
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

      console.log('✅ Firebase initialized with ENV');
    } 
    // ✅ JSON METHOD (Local)
    else {
      const serviceAccountPath =
        process.env.FIREBASE_SERVICE_ACCOUNT ||
        path.join(__dirname, 'firebase-admin.json');

      const resolvedPath = path.resolve(serviceAccountPath);

      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`❌ Firebase JSON not found at ${resolvedPath}`);
      }

      credentials = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));

      console.log(`✅ Firebase initialized with JSON (${resolvedPath})`);
    }

    // 🚀 INIT
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });

    this.firestore = admin.firestore();

    console.log('🔥 Firestore connected');
  }

  // 🚨 SEND PUSH NOTIFICATION (MAIN FEATURE)
async sendNotification(token: string, fileUrl: string, encryptedKey: string) {
  try {

    const response = await admin.messaging().send({
      token,

      data: {
        fileUrl: String(fileUrl),
        encryptedKey: String(encryptedKey),
        title: '🚨 Emergency Alert',
        body: 'User may be in danger!'
      },

      android: {
        priority: 'high'
      }
    });

    console.log('✅ FCM sent:', response);

  } catch (error: any) {
    console.log('❌ FCM Error:', error.message);
  }
}}