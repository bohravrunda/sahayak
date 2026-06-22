// import { Injectable } from '@nestjs/common';
// import { FirebaseService } from '../firebase/firebase.service';

// @Injectable()
// export class EmergencyService {

//   constructor(
//     private firebaseService: FirebaseService
//   ) {}

//   // temporary storage
//   private emergencyMap = new Map();

//   async handleAlert(body: any) {

//     const {
//       emergencyId,
//       fileName,
//       aesKey,
//       contacts
//     } = body;

//     // save mapping
//     this.emergencyMap.set(
//       emergencyId,
//       {
//         fileName,
//         aesKey
//       }
//     );

//     console.log(
//       "Saved:",
//       this.emergencyMap.get(emergencyId)
//     );

//     for (let contact of contacts) {

//       console.log("CONTACT =", contact);

//       if (!contact.fcmToken) {
//         console.log("❌ No FCM token");
//         continue;
//       }

//       const viewLink =
//         `http://192.168.1.8:3000/emergency/view/${emergencyId}`;

//       const message = `
// 🚨 Emergency Alert!

// User may be in danger.

// Open:
// ${viewLink}

// Decrypt key:
// ${aesKey}
// `;

//       try {

//         const response =
//           await this.firebaseService.sendNotification(
//             contact.fcmToken,
//             '🚨 Emergency Alert',
//             message
//           );

//         console.log(
//           "✅ FCM Response:",
//           response
//         );

//       } catch (err) {

//         console.log(
//           "❌ FCM Error:",
//           err
//         );

//       }
//     }

//     return {
//       message: 'Sent'
//     };
//   }

//   getEmergencyData(id: string) {
//     return this.emergencyMap.get(id);
//   }

// }













// ==========================================
// 2. EMERGENCY SERVICE
// ==========================================
import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class EmergencyService {

  constructor(
    private firebaseService: FirebaseService
  ) {}

  private emergencyMap = new Map();

  async handleAlert(body: any) {
    const {
      emergencyId,
      fileName,
      fileType, 
      aesKey,
      contacts
    } = body;

    // Save metadata locally to dynamic state map
    this.emergencyMap.set(
      emergencyId,
      {
        fileName,
        fileType,
        aesKey
      }
    );

    console.log("Saved mapping payload configuration:", this.emergencyMap.get(emergencyId));

    for (let contact of contacts) {
      if (!contact.fcmToken) {
        console.log("❌ No FCM token found for target contact structure");
        continue;
      }

      try {
        const response = await this.firebaseService.sendNotification(
          contact.fcmToken,
          emergencyId,
          aesKey
        );
        console.log("✅ FCM Response sent:", response);
      } catch (err) {
        console.log("❌ FCM Push Notification Error:", err);
      }
    }

    return { message: 'Sent' };
  }

  getEmergencyData(id: string) {
    return this.emergencyMap.get(id);
  }
}