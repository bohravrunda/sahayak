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