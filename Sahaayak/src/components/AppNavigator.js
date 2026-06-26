import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigationRef } from "../navigation/RootNavigation"; 

// ============ AUTH SCREENS ============
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";

// Signup Flow
import SignupEmailScreen from "../screens/SignupEmailScreen";
import SignupOtpScreen from "../screens/OtpScreen";
import SetPasswordScreen from "../screens/SetPasswordScreen";

// Forgot Password Flow
import EmailScreen from "../screens/ForgotPassword/EmailScreen";
import ForgotOtpScreen from "../screens/ForgotPassword/OTPScreen";
import ResetPasswordScreen from "../screens/ForgotPassword/ResetPasswordScreen";

// ============ POST LOGIN ONBOARDING ============
import PermissionsScreen from "../screens/PermissionsScreen";
import UserProfileScreen from "../screens/UserProfileScreen";

// ============ MAIN APP ============
import DashboardScreen from "../screens/DashboardScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HowToUseScreen from "../screens/HowToUseScreen";

// ============ RECORDINGS ============
import AudioRecordingScreen from "../screens/AudioRecordingScreen";
import VideoRecordingScreen from "../screens/VideoRecordingScreen";
import RecordingsListScreen from "../screens/RecordingsListScreen";
import AudioRecordingsScreen from "../screens/AudioRecordingsScreen";
import VideoRecordingsScreen from "../screens/VideoRecordingsScreen";

// ============ SAFETY ============
import EmergencyContactsScreen from "../screens/EmergencyContactsScreen";
import SafeLocationsScreen from "../screens/SafeLocationsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        
        {/* ---------- AUTH FLOW ---------- */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Signup Flow */}
        <Stack.Screen name="SignupEmail" component={SignupEmailScreen} />
        <Stack.Screen name="SignupOtp" component={SignupOtpScreen} />
        <Stack.Screen name="SetPassword" component={SetPasswordScreen} />

        {/* Forgot Password Flow */}
        <Stack.Screen name="ForgotEmail" component={EmailScreen} />
        <Stack.Screen name="ForgotOtp" component={ForgotOtpScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

        {/* ---------- ONBOARDING ---------- */}
        <Stack.Screen name="Permissions" component={PermissionsScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />

        {/* ---------- MAIN APP ---------- */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="HowToUse" component={HowToUseScreen} />

        {/* ---------- RECORDINGS ---------- */}
        <Stack.Screen name="AudioRecording" component={AudioRecordingScreen} />
        <Stack.Screen name="VideoRecording" component={VideoRecordingScreen} />
        <Stack.Screen name="RecordingsList" component={RecordingsListScreen} />
        
        <Stack.Screen name="Recordings" component={AudioRecordingsScreen} /> 
        
        {/* 🔥 REGISTERED METADATA FOR VIDEO DASHBOARD */}
        <Stack.Screen name="VideoRecordings" component={VideoRecordingsScreen} />

        {/* 🤫 SAFETY ALIAS: Agar code ya kisi notification payload me purana name 'Videos' chhut gaya hoga, toh bhi app crash nahi hogi aur seedhe open ho jayegi! */}
        <Stack.Screen name="Videos" component={VideoRecordingsScreen} />

        {/* ---------- SAFETY ---------- */}
        <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
        <Stack.Screen name="SafeLocations" component={SafeLocationsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}