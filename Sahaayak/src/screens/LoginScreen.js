import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import colors from '../styles/colors';
import { login, googleLogin } from "../api/authApi";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { configureGoogleSignIn } from '../config/googleConfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Google Sign-in config
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  // ================= NORMAL LOGIN =================
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter email and password");
      return;
    }

    try {
      const res = await login(email, password);
      console.log("✅ LOGIN RESPONSE:", res);

      // 🔥 GET TOKEN SAFELY
      const token = res?.access_token || res?.token || res?.data?.access_token;

      if (!token) {
        console.log("❌ TOKEN NOT FOUND:", res);
        Alert.alert("Login Error", "Token not received from server");
        return;
      }

      // SAVE TOKEN
      await AsyncStorage.setItem("token", token);
      console.log("🔥 TOKEN SAVED:", token);

      // Test storage
      const storedToken = await AsyncStorage.getItem("token");
      console.log("✅ STORED TOKEN:", storedToken);

      Alert.alert("Login Successful", `Welcome ${email}`);
      navigation.replace("Dashboard");

    } catch (err) {
      console.log("❌ LOGIN ERROR:", err);
      Alert.alert("Login Failed", err?.message || "Invalid credentials");
    }
  };

  // ================= GOOGLE LOGIN =================
const handleGoogleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut();

    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo?.data?.idToken || userInfo?.idToken;

    console.log("Google User:", userInfo);
    console.log("Google ID Token:", idToken);

    if (!idToken) {
      Alert.alert("Error", "No Google ID Token");
      return;
    }

    const res = await googleLogin(idToken);
    console.log("✅ GOOGLE LOGIN RESPONSE:", res);

    // 🔥 TOKEN EXTRACT
    const token =
      res?.token ||
      res?.access_token ||
      res?.data?.token;

    if (!token) {
      console.log("❌ TOKEN MISSING:", res);
      Alert.alert("Google Login Error", "Token missing");
      return;
    }

    // ✅ SAVE TOKEN
    await AsyncStorage.setItem("token", token);

    // ✅ SAVE USER PROFILE (THIS WAS MISSING ❌)
    if (res?.user) {
      await AsyncStorage.setItem("user", JSON.stringify(res.user));
      console.log("🔥 USER SAVED:", res.user);
    } else {
      console.log("❌ USER NOT FOUND IN RESPONSE");
    }

    console.log("🔥 GOOGLE TOKEN SAVED:", token);

    // ✅ NAVIGATION
    navigation.replace("Dashboard");

  } catch (err) {
    console.log("❌ Google login failed:", err);
    Alert.alert("Google Login Failed", err.message);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Sahaayak</Text>

<TextInput
  style={styles.input}
  placeholder="Email"
  placeholderTextColor="#999"
  value={email}
  onChangeText={setEmail}
/>

<View style={styles.passwordContainer}>
  <TextInput
    style={styles.passwordInput}
    placeholder="Password"
    placeholderTextColor="#999"
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
  />

  <TouchableOpacity
    onPress={() => setShowPassword(!showPassword)}
  >
    <Ionicons
      name={showPassword ? 'eye-off' : 'eye'}
      size={24}
      color="#777"
    />
  </TouchableOpacity>
</View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Google Login */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image
          source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}>Sign in with Google</Text>
      </TouchableOpacity>
<View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('SignupEmailScreen')}>
          <Text style={styles.linkText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotEmail')}> 
          {/* 🔥 Name fix kiya: 'Email' se 'ForgotEmail' */}
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
          </View>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 25 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: colors.primary, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: colors.gray, borderRadius: 10, padding: 12, marginBottom: 15, backgroundColor: colors.white },
  loginBtn: { backgroundColor: colors.primary, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 5 },
  loginText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },

  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  passwordContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: colors.gray,
  borderRadius: 10,
  backgroundColor: colors.white,
  paddingHorizontal: 12,
  marginBottom: 15,
},

passwordInput: {
  flex: 1,
  paddingVertical: 12,
    color: '#000',      // 🔥 Password text black

},
input: {
  borderWidth: 1,
  borderColor: colors.gray,
  borderRadius: 10,
  padding: 12,
  marginBottom: 15,
  backgroundColor: colors.white,
  color: '#000',          // ← typed text black
},
  googleIcon: { width: 24, height: 24, marginRight: 10 },
  googleText: { fontSize: 16, color: '#000', fontWeight: '500' },

  linksContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  linkText: { color: colors.primary, fontWeight: 'bold' },
});