/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

import App from './App';
import { name as appName } from './app.json';

// BACKGROUND / KILLED STATE
messaging().setBackgroundMessageHandler(async remoteMessage => {

  console.log(
    '📩 Background message:',
    remoteMessage
  );

  await notifee.displayNotification({

    title:
      remoteMessage.notification?.title ||
      '🚨 Emergency Alert',

    body:
      remoteMessage.notification?.body ||
      'User may be in danger!',

    android: {
      channelId: 'emergency',
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default'
      }
    }

  });

});

AppRegistry.registerComponent(appName, () => App);








// /**
//  * @format
//  */

// import { AppRegistry } from 'react-native';
// import messaging from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance } from '@notifee/react-native';

// import App from './App';
// import { name as appName } from './app.json';

// // BACKGROUND / KILLED STATE
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('📩 Background message received:', remoteMessage);
  
//   const data = remoteMessage.data || {};
//   const locationLink = String(data.location ?? '');
//   const customMessage = String(data.message ?? '');

//   // 🔥 Default text update rule block for locked screen banner notifications
//   let displayBody = 'User may be in danger!';
//   if (locationLink) {
//     displayBody = `User in danger! Location: ${locationLink}`;
//   } else if (customMessage) {
//     displayBody = customMessage;
//   }

//   await notifee.displayNotification({
//     title: '🚨 Emergency Alert',
//     body: displayBody, // 🔥 Yahan background screen par bhi dynamic live location display karega
//     android: {
//       channelId: 'emergency',
//       importance: AndroidImportance.HIGH,
//       pressAction: {
//         id: 'default'
//       }
//     }
//   });
// });

// AppRegistry.registerComponent(appName, () => App);