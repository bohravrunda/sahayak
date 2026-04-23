import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '957360595880-i12rhcp11d9v5u11oh59v9rqhj3taq5v.apps.googleusercontent.com', // Must match backend GOOGLE_CLIENT_ID (Web client type 3)
    offlineAccess: true,
  });
};
