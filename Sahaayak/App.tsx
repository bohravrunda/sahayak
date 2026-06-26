// import React, { useEffect, useContext, useRef } from 'react';
// import { StatusBar, SafeAreaView, LogBox } from 'react-native';

// import messaging from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

// // 🚨 SHAKE + SIREN
// import RNShake from 'react-native-shake';
// import { playSiren, stopSiren } from './src/utils/siren';

// import AppNavigator from './src/components/AppNavigator';
// import { configureGoogleSignIn } from './src/config/googleConfig';
// import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';
// import { navigate } from './src/navigation/RootNavigation';

// import {
//   setEmergencyData,
//   setUnreadNotification,
// } from './src/store/NotificationStore';

// LogBox.ignoreLogs(['Setting a timer']);

// const MainApp = () => {
//   const { darkTheme } = useContext(ThemeContext);

//   const isSirenOn = useRef(false); // 🔥 siren state

//   useEffect(() => {

//     // 🚨 SHAKE LISTENER (GLOBAL)
//     const shakeSubscription = RNShake.addListener(() => {
//       console.log("📳 Phone Shaken!");

//       if (isSirenOn.current) {
//         stopSiren();
//         isSirenOn.current = false;
//         console.log("🔇 Siren OFF");
//       } else {
//         playSiren();
//         isSirenOn.current = true;
//         console.log("🚨 Siren ON");
//       }
//     });

//     // 🔔 NOTIFICATION CHANNEL
//     const createChannel = async () => {
//       await notifee.createChannel({
//         id: 'emergency',
//         name: 'Emergency Alerts',
//         importance: AndroidImportance.HIGH,
//       });
//     };

//     createChannel();

//     // 📩 FOREGROUND MESSAGE
//     const unsubscribe = messaging().onMessage(async remoteMessage => {

//       console.log("🔥 NOTIFICATION DATA:", remoteMessage.data);

//       const data = remoteMessage.data || {};

//       const fileUrl = String(data.fileUrl ?? '');
//       const encryptedKey = String(data.encryptedKey ?? '');

//       const title = String(data.title ?? '🚨 Emergency Alert');
//       const body = String(data.body ?? 'User may be in danger!');

//       // 🔥 SAVE GLOBAL STATE
//       setEmergencyData({ fileUrl, encryptedKey });
//       setUnreadNotification(true);

//       await notifee.displayNotification({
//         title,
//         body,
//         data: {
//           fileUrl,
//           encryptedKey,
//         },
//         android: {
//           channelId: 'emergency',
//           importance: AndroidImportance.HIGH,
//           pressAction: {
//             id: 'default',
//           },
//         },
//       });
//     });

//     // 📲 CLICK HANDLER
//     const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {

//       if (type === EventType.PRESS) {

//         const fileUrl = String(detail.notification?.data?.fileUrl ?? '');
//         const encryptedKey = String(detail.notification?.data?.encryptedKey ?? '');

//         setEmergencyData({ fileUrl, encryptedKey });
//         setUnreadNotification(false);

//         navigate('EmergencyContactsScreen', {
//           fileUrl,
//           encryptedKey,
//         });
//       }
//     });

//     // 📲 KILLED STATE
//     const handleInitialNotification = async () => {

//       const initialNotification = await notifee.getInitialNotification();

//       if (initialNotification) {

//         const fileUrl =
//           initialNotification.notification?.data?.fileUrl || '';

//         const encryptedKey =
//           initialNotification.notification?.data?.encryptedKey || '';

//         setEmergencyData({ fileUrl, encryptedKey });
//         setUnreadNotification(false);

//         setTimeout(() => {
//           navigate('EmergencyContactsScreen', {
//             fileUrl,
//             encryptedKey,
//           });
//         }, 400);
//       }
//     };

//     handleInitialNotification();

//     return () => {
//       unsubscribe();
//       unsubscribeNotifee();
//       shakeSubscription.remove(); // 🔥 important
//       stopSiren(); // cleanup
//     };

//   }, []);

//   return (
//     <SafeAreaView style={{
//       flex: 1,
//       backgroundColor: darkTheme ? '#000' : '#f5f5f5',
//     }}>
//       <StatusBar
//         barStyle={darkTheme ? 'light-content' : 'dark-content'}
//         backgroundColor={darkTheme ? '#000' : '#f5f5f5'}
//       />

//       <AppNavigator />
//     </SafeAreaView>
//   );
// };

// const App = () => {
//   useEffect(() => {
//     configureGoogleSignIn();
//   }, []);

//   return (
//     <ThemeProvider>
//       <MainApp />
//     </ThemeProvider>
//   );
// };

// export default App;




// import React, { useEffect, useContext, useRef } from 'react';
// import { StatusBar, SafeAreaView, LogBox } from 'react-native';

// import messaging from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

// // 🚨 SHAKE + SIREN
// import RNShake from 'react-native-shake';
// import { playSiren, stopSiren } from './src/utils/siren';

// import AppNavigator from './src/components/AppNavigator';
// import { configureGoogleSignIn } from './src/config/googleConfig';
// import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';
// import { navigate } from './src/navigation/RootNavigation';

// import {
//   setEmergencyData,
//   setUnreadNotification,
// } from './src/store/NotificationStore';

// LogBox.ignoreLogs(['Setting a timer']);

// const MainApp = () => {
//   const { darkTheme } = useContext(ThemeContext);

//   const isSirenOn = useRef(false); // 🔥 siren state

// useEffect(() => {

//   // 🔥 Notification permission
//   async function requestPermission() {

//     await messaging().requestPermission();

//     await notifee.requestPermission();

//   }

//   requestPermission();

//   // 🚨 SHAKE LISTENER
//   const shakeSubscription = RNShake.addListener(() => {

//     console.log("📳 Phone Shaken!");

//     if (isSirenOn.current) {

//       stopSiren();
//       isSirenOn.current = false;

//       console.log("🔇 Siren OFF");

//     } else {

//       playSiren();
//       isSirenOn.current = true;

//       console.log("🚨 Siren ON");

//     }

//   });

//   // baaki code...    // 🔔 NOTIFICATION CHANNEL
//     const createChannel = async () => {
//     };

//     createChannel();

//     // 📩 FOREGROUND MESSAGE
//     const unsubscribe = messaging().onMessage(async remoteMessage => {

//       console.log("🔥 NOTIFICATION DATA:", remoteMessage.data);

//       const data = remoteMessage.data || {};

//     const emergencyId =
//   String(data.emergencyId ?? '');

// const aesKey =
//   String(data.aesKey ?? '');

//       const title = String(data.title ?? '🚨 Emergency Alert');
//       const body = String(data.body ?? 'User may be in danger!');

//       // 🔥 SAVE GLOBAL STATE
// setEmergencyData({
//   emergencyId,
//   aesKey
// });      setUnreadNotification(true);

//       await notifee.displayNotification({
//         title,
//         body,
//        data: {
//   emergencyId,
//   aesKey,
// },
//         android: {
//           channelId: 'emergency',
//           importance: AndroidImportance.HIGH,
//           pressAction: {
//             id: 'default',
//           },
//         },
//       });
//     });

//     // 📲 CLICK HANDLER
//     const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {

//       if (type === EventType.PRESS) {

//         const emergencyId =
// String(detail.notification?.data?.emergencyId ?? '');

// const aesKey =
// String(detail.notification?.data?.aesKey ?? '');

// setEmergencyData({
//   emergencyId,
//   aesKey
// });

// setUnreadNotification(false);



//         navigate('EmergencyContactsScreen');
//       }
//     });

//     // 📲 KILLED STATE
//     const handleInitialNotification = async () => {

//       const initialNotification = await notifee.getInitialNotification();

//       if (initialNotification) {

//         const emergencyId =
//   String(initialNotification.notification?.data?.emergencyId || '');

// const aesKey =
//   String(initialNotification.notification?.data?.aesKey || '');

// setEmergencyData({
//   emergencyId,
//   aesKey
// });

// setUnreadNotification(false);

// setTimeout(() => {
//   navigate('EmergencyContactsScreen');
// }, 400);
        
//       }
//     };

//     handleInitialNotification();

//     return () => {
//       unsubscribe();
//       unsubscribeNotifee();
//       shakeSubscription.remove(); // 🔥 important
//       stopSiren(); // cleanup
//     };

//   }, []);

//   return (
//     <SafeAreaView style={{
//       flex: 1,
//       backgroundColor: darkTheme ? '#000' : '#f5f5f5',
//     }}>
//       <StatusBar
//         barStyle={darkTheme ? 'light-content' : 'dark-content'}
//         backgroundColor={darkTheme ? '#000' : '#f5f5f5'}
//       />

//       <AppNavigator />
//     </SafeAreaView>
//   );
// };

// const App = () => {
//   useEffect(() => {
//     configureGoogleSignIn();
//   }, []);

//   return (
//     <ThemeProvider>
//       <MainApp />
//     </ThemeProvider>
//   );
// };

// export default App;




import React, { useEffect, useContext, useRef } from 'react';
import { StatusBar, SafeAreaView, LogBox } from 'react-native';

import messaging from '@react-native-firebase/messaging';
// 🔴 FIX: AndroidStyle ko explicitly import kiya gaya hai badhiya layouts ke liye
import notifee, { AndroidImportance, EventType, AndroidStyle } from '@notifee/react-native';

// 🚨 SHAKE + SIREN
import RNShake from 'react-native-shake';
import { playSiren, stopSiren } from './src/utils/siren';

import AppNavigator from './src/components/AppNavigator';
import { configureGoogleSignIn } from './src/config/googleConfig';
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext'; // 🌐 Language Provider Imported
import { navigate } from './src/navigation/RootNavigation';

import {
  setEmergencyData,
  setUnreadNotification,
} from './src/store/NotificationStore';

LogBox.ignoreLogs(['Setting a timer']);

const MainApp = () => {
  const { darkTheme } = useContext(ThemeContext);
  const isSirenOn = useRef(false); // 🔥 Siren state tracker

  useEffect(() => {
    // 🔥 Notification permissions request
    async function requestPermission() {
      await messaging().requestPermission();
      await notifee.requestPermission();
    }
    requestPermission();

    // 🚨 SHAKE LISTENER LOGIC
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

    // 🔔 HIGH IMPORTANCE EMERGENCY CHANNEL
    const createChannel = async () => {
      await notifee.createChannel({
        id: 'emergency',
        name: 'Emergency Alerts',
        importance: AndroidImportance.HIGH,
      });
    };
    createChannel();

    // 📩 1. FOREGROUND MESSAGE LISTENER (When app is open)
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("🔥 NOTIFICATION DATA RECEIVED:", remoteMessage);

      const data = remoteMessage.data || {};
      const remoteNotif = remoteMessage.notification || {};

      const emergencyId = String(data.emergencyId ?? '');
      const aesKey = String(data.aesKey ?? '');
      const fileUrl = String(data.fileUrl ?? data.fileName ?? '');
      const encryptedKey = String(data.encryptedKey ?? data.aesKey ?? '');
      const fileType = String(data.fileType ?? ''); // 'audio' ya 'video'

      // Direct notification object se ya fir custom data format se fields parse karna
      const title = String(remoteNotif.title ?? data.title ?? '🚨 Emergency Alert');
      const body = String(remoteNotif.body ?? data.message ?? data.body ?? 'User may be in danger!');

      // Global store payload updates
      setEmergencyData({
        emergencyId,
        aesKey,
        fileUrl,
        encryptedKey,
        fileType
      });      
      setUnreadNotification(true);

      // Local Push Notification Trigger
      await notifee.displayNotification({
        title,
        body,
        data: { emergencyId, aesKey, fileUrl, encryptedKey, fileType },
        android: {
          channelId: 'emergency',
          importance: AndroidImportance.HIGH,
          pressAction: { id: 'default' },
          // ✅ Fully compliant structure for Notifee BigTextStyle
          style: { 
            type: AndroidStyle.BIGTEXT, 
            text: body 
          },
        },
      });
    });

    // 📲 2. FOREGROUND INTERACTION (Notification click while phone unlocked)
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        const notifData = detail.notification?.data || {};

        const emergencyId = String(notifData.emergencyId ?? '');
        const aesKey = String(notifData.aesKey ?? '');
        const fileUrl = String(notifData.fileUrl ?? notifData.fileName ?? '');
        const encryptedKey = String(notifData.encryptedKey ?? notifData.aesKey ?? '');
        const fileType = String(notifData.fileType ?? '');

        setEmergencyData({ emergencyId, aesKey, fileUrl, encryptedKey, fileType });
        setUnreadNotification(false);

        // =========================================================================
        // 🔥 NAVIGATION ROUTE REDIRECT (DYNAMIC ROUTING INTEGRATED)
        // =========================================================================
        const isVideoPayload = fileType.toLowerCase() === 'video' || fileUrl.includes('.enc') || fileUrl.includes('distress_');
        
        if (isVideoPayload) {
          navigate('VideoRecordings' as any); // ✅ Navigates properly to VideoRecordingsScreen
        } else {
          navigate('EmergencyContactsScreen' as any);
        }
        // =========================================================================
      }
    });

    // 📲 3. KILLED STATE HANDLER (App closed thi aur notification click se open hui)
    const handleInitialNotification = async () => {
      const initialNotification = await notifee.getInitialNotification();

      if (initialNotification) {
        const notifData = initialNotification.notification?.data || {};

        const emergencyId = String(notifData.emergencyId ?? '');
        const aesKey = String(notifData.aesKey ?? '');
        const fileUrl = String(notifData.fileUrl ?? notifData.fileName ?? '');
        const encryptedKey = String(notifData.encryptedKey ?? notifData.aesKey ?? '');
        const fileType = String(notifData.fileType ?? '');

        setEmergencyData({ emergencyId, aesKey, fileUrl, encryptedKey, fileType });
        setUnreadNotification(false);

        // Execution delayed smoothly for navigation stack mount allocation
        setTimeout(() => {
          // =========================================================================
          // 🔥 KILLED STATE NAVIGATION SYNC
          // =========================================================================
          const isVideoPayload = fileType.toLowerCase() === 'video' || fileUrl.includes('.enc') || fileUrl.includes('distress_');
          
          if (isVideoPayload) {
            navigate('VideoRecordings' as any); // ✅ Fixed target name
          } else {
            navigate('EmergencyContactsScreen' as any);
          }
          // =========================================================================
        }, 800);
      }
    };

    handleInitialNotification();

    // Cleanup loop triggers
    return () => {
      unsubscribe();
      unsubscribeNotifee();
      shakeSubscription.remove(); 
      stopSiren(); 
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

// 🌟 App Wrapper Configured with both Theme and Language Context Global access
const App = () => {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;






// import React, { useEffect, useContext, useRef } from 'react';
// import { StatusBar, SafeAreaView, LogBox, Platform, PermissionsAndroid } from 'react-native';

// import messaging from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

// // 📍 GEOLOCATION
// import Geolocation from '@react-native-community/geolocation';

// // 🚨 SHAKE + SIREN
// import RNShake from 'react-native-shake';
// import { playSiren, stopSiren } from './src/utils/siren';

// // 🔄 PROFILE API
// import { getProfile } from './src/api/profileApi';

// import AppNavigator from './src/components/AppNavigator';
// import { configureGoogleSignIn } from './src/config/googleConfig';
// import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';
// import { navigate } from './src/navigation/RootNavigation';

// import {
//   setEmergencyData,
//   setUnreadNotification,
// } from './src/store/NotificationStore';

// LogBox.ignoreLogs(['Setting a timer']);

// const MainApp = () => {
//   const { darkTheme } = useContext(ThemeContext);
//   const isSirenOn = useRef(false);

//   // Runtime Location Permission Request
//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: "Location Permission Required",
//             message: "Emergency ke waqt aapki location contacts tak bhejne ke liye permission zaroori hai.",
//             buttonPositive: "OK",
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn("Permission Error:", err);
//         return false;
//       }
//     }
//     return true;
//   };

//   // Backend API par alert trigger karna (With Dynamic Contacts)
//   const triggerBackendEmergency = async (mapsLink: string) => {
//     try {
//       // 1. Profile API se current user ke emergency contacts fetch karo
//       const profile = await getProfile();
//       const activeContacts = profile?.emergencyContacts || [];

//       if (activeContacts.length === 0) {
//         console.log("⚠️ No emergency contacts found to notify.");
//       }

//       // 2. Structured payload setup
//       const emergencyPayload = {
//         emergencyId: `shake_${Date.now()}`,
//         fileName: 'shake_audio_log',
//         fileType: 'audio',
//         aesKey: 'shake_secure_key_128',
//         location: mapsLink, // 🔥 Corrected Live Location Maps Link
//         contacts: activeContacts 
//       };

//       console.log("📤 Sending Shake Payload to Backend:", emergencyPayload);

//       // 3. Backend API hit karna
//       const response = await fetch('http://10.205.27.41:3000/emergency/alert', { 
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(emergencyPayload),
//       });

//       const resData = await response.json();
//       console.log("🚀 Shake Backend Notification Response:", resData);
//     } catch (error) {
//       console.log("❌ Failed to ping emergency backend status maps:", error);
//     }
//   };

//   // Shake handler core logic
//   const handleShakeEvent = async () => {
//     console.log("📳 Phone Shaken!");

//     if (isSirenOn.current) {
//       stopSiren();
//       isSirenOn.current = false;
//       console.log("🔇 Siren OFF");
//     } else {
//       playSiren();
//       isSirenOn.current = true;
//       console.log("🚨 Siren ON");

//       // Permission check aur location fetch
//       const hasPermission = await requestLocationPermission();
//       if (!hasPermission) {
//         console.log("❌ Location tracking aborted: Permission denied.");
//         triggerBackendEmergency("Location Permission Denied by User");
//         return;
//       }

//       Geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           // 🔥 Standard Google Maps query dynamic link format fix
//           const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
//           console.log("📍 Location captured during shake:", mapsLink);
          
//           triggerBackendEmergency(mapsLink);
//         },
//         (error) => {
//           console.log("❌ Location retrieval failed during active shake:", error);
//           triggerBackendEmergency(`Location failed: ${error.message || 'GPS OFF/Timeout'}`);
//         },
//         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//       );
//     }
//   };

//   useEffect(() => {
//     async function requestPermission() {
//       await messaging().requestPermission();
//       await notifee.requestPermission();
//       await requestLocationPermission(); 
//     }

//     requestPermission();

//     const shakeSubscription = RNShake.addListener(() => {
//       handleShakeEvent();
//     });

//     const createChannel = async () => {
//       await notifee.createChannel({
//         id: 'emergency',
//         name: 'Emergency Alerts',
//         importance: AndroidImportance.HIGH,
//       });
//     };

//     createChannel();

//     // 📩 FOREGROUND MESSAGE RECEIVER
//     // 📩 FOREGROUND MESSAGE RECEIVER (WITH EMOTION DETECT BACKUP GPS)
// const unsubscribe = messaging().onMessage(async remoteMessage => {
//   console.log("🔥 NOTIFICATION RECEIVED:", remoteMessage.data);
//   const data = remoteMessage.data || {};

//   const emergencyId = String(data.emergencyId ?? '');
//   const aesKey = String(data.aesKey ?? '');
//   const fileUrl = String(data.fileUrl ?? data.fileName ?? '');
//   const encryptedKey = String(data.encryptedKey ?? data.aesKey ?? '');
//   const fileType = String(data.fileType ?? ''); 
//   let locationLink = String(data.location ?? '');
//   const customMessage = String(data.message ?? '');

//   const showNotification = async (finalLocation: string) => {
//     const title = '🚨 Sahayak Emergency Alert';
//     let body = `Emotion Detect Alert! User needs help.`;
    
//     if (finalLocation && finalLocation !== 'undefined' && finalLocation !== 'Location Permission Denied by User') {
//       body = `🚨 Emergency! Location: ${finalLocation}`;
//     } else if (customMessage) {
//       body = customMessage;
//     }

//     setEmergencyData({ emergencyId, aesKey, fileUrl, encryptedKey, fileType, location: finalLocation });      
//     setUnreadNotification(true);

//     await notifee.displayNotification({
//       title,
//       body,
//       data: { emergencyId, aesKey, fileUrl, encryptedKey, fileType, location: finalLocation },
//       android: {
//         channelId: 'emergency',
//         importance: AndroidImportance.HIGH,
//         pressAction: { id: 'default' },
//       },
//     });
//   };

//   // 🔥 BACKUP CRITICAL LOGIC: Agar backend se location undefined ya blank aayi hai
//   if (!locationLink || locationLink === 'undefined') {
//     console.log("🔄 Location missing from backend alert. Fetching local device GPS as backup...");
    
//     Geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         const backupLink = `https://www.google.com/maps?q=${latitude},${longitude}`; // Standard Google Maps format fix
//         showNotification(backupLink);
//       },
//       (error) => {
//         console.log("❌ Local backup GPS failed:", error);
//         showNotification('Location link not synced (GPS issue)');
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   } else {
//     // Agar shake alert se pehle se sahi location link aa rahi hai
//     showNotification(locationLink);
//   }
// });
//     // CLICK HANDLER
//     const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
//       if (type === EventType.PRESS) {
//         const notifData = detail.notification?.data || {};
//         setEmergencyData({
//           emergencyId: String(notifData.emergencyId ?? ''),
//           aesKey: String(notifData.aesKey ?? ''),
//           fileUrl: String(notifData.fileUrl ?? notifData.fileName ?? ''),
//           encryptedKey: String(notifData.encryptedKey ?? notifData.aesKey ?? ''),
//           fileType: String(notifData.fileType ?? ''),
//         });
//         setUnreadNotification(false);
//         navigate('EmergencyContactsScreen');
//       }
//     });

//     return () => {
//       unsubscribe();
//       unsubscribeNotifee();
//       shakeSubscription.remove(); 
//       stopSiren(); 
//     };

//   }, []);

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: darkTheme ? '#000' : '#f5f5f5' }}>
//       <StatusBar barStyle={darkTheme ? 'light-content' : 'dark-content'} backgroundColor={darkTheme ? '#000' : '#f5f5f5'} />
//       <AppNavigator />
//     </SafeAreaView>
//   );
// };

// const App = () => {
//   useEffect(() => { configureGoogleSignIn(); }, []);
//   return (
//     <ThemeProvider>
//       <MainApp />
//     </ThemeProvider>
//   );
// };

// export default App;