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





// import * as admin from 'firebase-admin';
// import { Injectable, OnModuleInit } from '@nestjs/common';
// import * as fs from 'fs';
// import * as path from 'path';

// @Injectable()
// export class FirebaseService implements OnModuleInit {
//   public firestore!: admin.firestore.Firestore;

//   onModuleInit() {
//     if (admin.apps.length) {
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
//         privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//       };
//     } else {
//       const filePath = path.resolve(
//         process.env.FIREBASE_SERVICE_ACCOUNT || './firebase-admin.json',
//       );

//       credentials = JSON.parse(fs.readFileSync(filePath, 'utf8'));
//     }

//     admin.initializeApp({
//       credential: admin.credential.cert(credentials),
//     });

//     this.firestore = admin.firestore();
//   }

//   async sendNotification(
//     token: string,
//     emergencyId: string,
//     aesKey: string,
//   ) {

//     const viewLink =
//       `http://192.168.1.8:3000/emergency/view/${emergencyId}`;

//     const message =
// `🚨 Emergency Alert!

// User may be in danger.

// Open:
// ${viewLink}

// Decrypt key:
// ${aesKey}`;

//     return admin.messaging().send({

//       token,

//       notification: {
//         title: '🚨 Emergency Alert',
//         body: 'User may be in danger!',
//       },

//       data: {
//         emergencyId: String(emergencyId),
//         aesKey: String(aesKey),
//         message: message,
//       },

//       android: {
//         priority: 'high',
//         notification: {
//           sound: 'default',
//         },
//       },
//     });
//   }
// }






import * as admin from 'firebase-admin';
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  public firestore!: admin.firestore.Firestore;

  onModuleInit() {
    if (admin.apps.length) {
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
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
    } else {
      const filePath = path.resolve(
        process.env.FIREBASE_SERVICE_ACCOUNT || './firebase-admin.json',
      );

      credentials = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });

    this.firestore = admin.firestore();
  }

async sendNotification(
  token: string,
  emergencyId: string,
  aesKey: string,
  locationLink?: string, 
) {
  const viewLink = `http://10.205.27.41:3000/emergency/view/${emergencyId}`;
  
  // 1. Pehle check karein ki locationLink real mein valid hai ya nahi (khali string, null ya "No Location" toh nahi)
  const hasLocation = locationLink && locationLink !== 'No Location' && locationLink.trim() !== '';

  // 2. Agar location hai toh Maps dikhao, nahi toh direct Stream aur Key dikhao (No Location wali line hat gayi)
  const alertBody = hasLocation 
    ? `📍 Maps: ${locationLink} | 🎥 Stream: ${viewLink} | 🔑 Key: ${aesKey}`
    : `🎥 Stream: ${viewLink} | 🔑 Key: ${aesKey}`;

  const locationInfo = hasLocation ? locationLink : 'No Location';

  return admin.messaging().send({
    token,
    notification: {
      title: '🚨 SAHAYAAK EMERGENCY',
      body: alertBody, 
    },
    data: {
      emergencyId: String(emergencyId),
      aesKey: String(aesKey),
      locationLink: String(locationInfo),
      viewLink: String(viewLink),
      message: alertBody,
    },
    android: {
      priority: 'high',
      notification: {
        title: '🚨 SAHAYAAK EMERGENCY',
        body: alertBody,
        sound: 'default',
        priority: 'max',
        visibility: 'public',
        tag: `emergency-${emergencyId}`,
      },
    },
  });
}}


// import * as admin from 'firebase-admin';
// import { Injectable, OnModuleInit } from '@nestjs/common';
// import * as fs from 'fs';
// import * as path from 'path';

// @Injectable()
// export class FirebaseService implements OnModuleInit {
//   public firestore!: admin.firestore.Firestore;

//   onModuleInit() {
//     if (admin.apps.length) {
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
//         privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//       };
//     } else {
//       const filePath = path.resolve(
//         process.env.FIREBASE_SERVICE_ACCOUNT || './firebase-admin.json',
//       );
//       credentials = JSON.parse(fs.readFileSync(filePath, 'utf8'));
//     }

//     admin.initializeApp({
//       credential: admin.credential.cert(credentials),
//     });

//     this.firestore = admin.firestore();
//   }

//   async sendNotification(
//     token: string,
//     emergencyId: string,
//     aesKey: string,
//     location: string, // 🔥 Added location parameter
//   ) {
//     const viewLink = `http://10.205.27.41:3000/emergency/view/${emergencyId}`;

//     // Notification body text for display
//     const notificationBody = `User may be in danger! Location: ${location || 'Not Available'}`;

//     const fullMessageText = 
// `🚨 Emergency Alert!

// User may be in danger.

// Location Link:
// ${location || 'Not Available'}

// Open Dashboard:
// ${viewLink}

// Decrypt key:
// ${aesKey}`;

//     return admin.messaging().send({
//       token,
//       notification: {
//         title: '🚨 Emergency Alert',
//         body: notificationBody, // 🔥 Ab yahan dynamic location dikhegi notification pop-up mein
//       },
//       data: {
//         emergencyId: String(emergencyId),
//         aesKey: String(aesKey),
//         location: String(location || ''), // 🔥 React Native client ko read karne ke liye object key
//         message: fullMessageText,
//       },
//       android: {
//         priority: 'high',
//         notification: {
//           sound: 'default',
//         },
//       },
//     });
//   }
// }