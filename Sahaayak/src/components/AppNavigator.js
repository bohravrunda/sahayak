import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen"; // Landing page
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import EmailScreen from "../screens/ForgotPassword/EmailScreen";
import OTPScreen from "../screens/ForgotPassword/OTPScreen";
import ResetPasswordScreen from "../screens/ForgotPassword/ResetPasswordScreen";
import DashboardScreen from "../screens/DashboardScreen"; // Actual post-login screen

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Email" component={EmailScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
