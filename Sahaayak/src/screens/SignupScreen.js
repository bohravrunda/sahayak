import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import colors from "./components/navigation/config/utils/colors";
import { users } from "../AppGlobals";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

// ✅ Move InputRow outside the main component
const InputRow = ({ icon, placeholder, value, onChangeText, secureTextEntry, isPassword, showPassword, setShowPassword }) => (
  <View style={styles.inputRow}>
    <View style={styles.iconContainer}>{icon}</View>
    <TextInput
      placeholder={placeholder}
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      placeholderTextColor={colors.gray}
    />
    {isPassword && (
      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name={showPassword ? "eye-off" : "eye"} size={22} color={colors.gray} />
      </TouchableOpacity>
    )}
  </View>
);

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (users.find(u => u.email === email)) {
      Alert.alert("Error", "Email already registered");
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      users.push({ name, email, password });
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Error", "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join the Sahaayak community</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.singleInput}
        value={name}
        onChangeText={setName}
        placeholderTextColor={colors.gray}
      />

      <InputRow
        icon={<FontAwesome name="user" size={22} color={colors.gray} />}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <InputRow
        icon={<FontAwesome name="lock" size={22} color={colors.gray} />}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        isPassword={true}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 28, color: colors.primary, fontWeight: "bold", marginBottom: 10 },
  subtitle: { color: colors.text, marginBottom: 30 },
  singleInput: { width: "90%", backgroundColor: colors.white, borderRadius: 10, padding: 12, marginVertical: 8, borderWidth: 1, borderColor: colors.gray, minHeight: 50 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    minHeight: 50,
  },
  iconContainer: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12 },
  button: { backgroundColor: colors.primary, padding: 15, borderRadius: 10, width: "90%", alignItems: "center", marginTop: 15 },
  buttonText: { color: colors.white, fontWeight: "bold", fontSize: 16 },
  link: { marginTop: 20, color: colors.accent, fontSize: 14 },
});

export default SignupScreen;
