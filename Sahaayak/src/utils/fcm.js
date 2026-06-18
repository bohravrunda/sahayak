import messaging from '@react-native-firebase/messaging';

export const getFCMToken = async () => {
  const permission = await messaging().requestPermission();

  if (
    permission === messaging.AuthorizationStatus.AUTHORIZED ||
    permission === messaging.AuthorizationStatus.PROVISIONAL
  ) {
    const token = await messaging().getToken();
    console.log("🔥 FCM TOKEN:", token);
    return token;
  }
};