import React, { useEffect, useContext, useRef } from 'react';
import { StatusBar, SafeAreaView, LogBox } from 'react-native';

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

// 🚨 SHAKE + SIREN
import RNShake from 'react-native-shake';
import { playSiren, stopSiren } from './src/utils/siren';

import AppNavigator from './src/components/AppNavigator';
import { configureGoogleSignIn } from './src/config/googleConfig';
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';
import { navigate } from './src/navigation/RootNavigation';

import {
  setEmergencyData,
  setUnreadNotification,
} from './src/store/NotificationStore';

LogBox.ignoreLogs(['Setting a timer']);

const MainApp = () => {
  const { darkTheme } = useContext(ThemeContext);

  const isSirenOn = useRef(false); // 🔥 siren state

  useEffect(() => {

    // 🚨 SHAKE LISTENER (GLOBAL)
    const shakeSubscription = RNShake.addListener(() => {
      console.log("📳 Phone Shaken!");

      if (isSirenOn.current) {
        stopSiren();
        isSirenOn.current = false;
        console.log("🔇 Siren OFF");
      } else {
        playSiren();
        isSirenOn.current = true;
        console.log("🚨 Siren ON");
      }
    });

    // 🔔 NOTIFICATION CHANNEL
    const createChannel = async () => {
      await notifee.createChannel({
        id: 'emergency',
        name: 'Emergency Alerts',
        importance: AndroidImportance.HIGH,
      });
    };

    createChannel();

    // 📩 FOREGROUND MESSAGE
    const unsubscribe = messaging().onMessage(async remoteMessage => {

      console.log("🔥 NOTIFICATION DATA:", remoteMessage.data);

      const data = remoteMessage.data || {};

      const fileUrl = String(data.fileUrl ?? '');
      const encryptedKey = String(data.encryptedKey ?? '');

      const title = String(data.title ?? '🚨 Emergency Alert');
      const body = String(data.body ?? 'User may be in danger!');

      // 🔥 SAVE GLOBAL STATE
      setEmergencyData({ fileUrl, encryptedKey });
      setUnreadNotification(true);

      await notifee.displayNotification({
        title,
        body,
        data: {
          fileUrl,
          encryptedKey,
        },
        android: {
          channelId: 'emergency',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
      });
    });

    // 📲 CLICK HANDLER
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {

      if (type === EventType.PRESS) {

        const fileUrl = String(detail.notification?.data?.fileUrl ?? '');
        const encryptedKey = String(detail.notification?.data?.encryptedKey ?? '');

        setEmergencyData({ fileUrl, encryptedKey });
        setUnreadNotification(false);

        navigate('EmergencyContactsScreen', {
          fileUrl,
          encryptedKey,
        });
      }
    });

    // 📲 KILLED STATE
    const handleInitialNotification = async () => {

      const initialNotification = await notifee.getInitialNotification();

      if (initialNotification) {

        const fileUrl =
          initialNotification.notification?.data?.fileUrl || '';

        const encryptedKey =
          initialNotification.notification?.data?.encryptedKey || '';

        setEmergencyData({ fileUrl, encryptedKey });
        setUnreadNotification(false);

        setTimeout(() => {
          navigate('EmergencyContactsScreen', {
            fileUrl,
            encryptedKey,
          });
        }, 400);
      }
    };

    handleInitialNotification();

    return () => {
      unsubscribe();
      unsubscribeNotifee();
      shakeSubscription.remove(); // 🔥 important
      stopSiren(); // cleanup
    };

  }, []);

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: darkTheme ? '#000' : '#f5f5f5',
    }}>
      <StatusBar
        barStyle={darkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={darkTheme ? '#000' : '#f5f5f5'}
      />

      <AppNavigator />
    </SafeAreaView>
  );
};

const App = () => {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
};

export default App;