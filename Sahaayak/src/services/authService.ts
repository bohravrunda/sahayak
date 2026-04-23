import axios from "axios";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// 🔹 For physical device use your computer's local IP
// 🔹 For Android emulator use 10.0.2.2
const API_URL = "http://192.168.1.7:3000";

export interface GoogleLoginResponse {
  ok: boolean;
  token: string;
  user: {
    name: string;
    email: string;
    picture?: string;
  };
}

export async function googleLogin(): Promise<GoogleLoginResponse> {
  try {
    // 1️⃣ Check Google Play Services
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    // 2️⃣ Google Sign In
    const userInfo = await GoogleSignin.signIn();

    // 3️⃣ Get ID Token (RN version safe)
    const idToken =
      (userInfo as any)?.data?.idToken ||
      (userInfo as any)?.idToken;

    if (!idToken) {
      throw new Error("Google ID Token not found");
    }

    // 4️⃣ Call backend (✅ CORRECT ROUTE + PAYLOAD)
    const response = await axios.post<GoogleLoginResponse>(
      `${API_URL}/auth/google/mobile-login`,
      {
        idToken, // ✅ EXACT key backend expects
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Google login failed:",
      error?.response?.data || error.message
    );
    throw error;
  }
}
