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






import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class EmergencyService {

  constructor(
    private firebaseService: FirebaseService
  ) {}

  private emergencyMap = new Map();

  async handleAlert(body: any) {
    // Debug ke liye: Pura body print karke check karein ki key ka naam 'locationLink' hi hai na?
    console.log("Incoming Emergency Body:", body);

    const {
      emergencyId,
      fileName,
      fileType, 
      aesKey,
      contacts,
      locationLink 
    } = body;

    this.emergencyMap.set(
      emergencyId,
      { fileName, fileType, aesKey, locationLink }
    );

    for (let contact of contacts) {
      if (!contact.fcmToken) {
        console.log("❌ No FCM token found for target contact structure");
        continue;
      }

      try {
        // Data bhejte waqt confirm karein ki locationLink khali na jaa raha ho
        const response = await this.firebaseService.sendNotification(
          contact.fcmToken,
          emergencyId,
          aesKey,
          locationLink || body.location // Fallback agar frontend se sirf 'location' aa raha ho
        );
        console.log("✅ FCM Response sent with location:", response);
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



// import { Injectable } from '@nestjs/common';
// import { FirebaseService } from '../firebase/firebase.service';

// @Injectable()
// export class EmergencyService {
//   constructor(private firebaseService: FirebaseService) {}

//   private emergencyMap = new Map();

//   async handleAlert(body: any) {
//     const {
//       emergencyId,
//       fileName,
//       fileType, 
//       aesKey,
//       contacts,
//       location
//     } = body;

//     // Local state map cache payload configuration
//     this.emergencyMap.set(emergencyId, {
//       fileName,
//       fileType,
//       aesKey,
//       location,
//     });

//     console.log("Saved mapping payload configuration:", this.emergencyMap.get(emergencyId));

//     for (let contact of contacts) {
//       if (!contact.fcmToken) {
//         console.log("❌ No FCM token found for target contact structure");
//         continue;
//       }

//       try {
//         // 🔥 Parameters pass karne ka sahi silsila (Token, ID, Key, Location)
//         const response = await this.firebaseService.sendNotification(
//           contact.fcmToken,
//           emergencyId,
//           aesKey,
//           location // <-- Location parameter yahan se pipeline mein gaya
//         );
//         console.log("✅ FCM Response sent:", response);
//       } catch (err) {
//         console.log("❌ FCM Push Notification Error:", err);
//       }
//     }

//     return { message: 'Sent' };
//   }

//   getEmergencyData(id: string) {
//     return this.emergencyMap.get(id);
//   }
// }