import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import colors from "./components/navigation/config/utils/colors";
import { users } from "../AppGlobals";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        Alert.alert("Success", `Welcome ${user.name}!`);
      } else {
        Alert.alert("Error", "Invalid credentials. Try again.");
      }
    } catch (err) {
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Enter your account details</Text>

      <View style={styles.inputWrapper}>
        <FontAwesome name="user" size={20} color={colors.gray} style={styles.icon} />
        <TextInput
          placeholder="Email"
          style={[styles.input, { paddingLeft: 40 }]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Password"
          style={[styles.input, { paddingRight: 40 }]}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
          <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={colors.gray} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: colors.text,
    marginBottom: 30,
  },
  inputWrapper: {
    width: "90%",
    position: "relative",
    marginVertical: 8,
  },
  input: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  icon: {
    position: "absolute",
    left: 10,
    top: 12,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    color: colors.accent,
    fontSize: 14,
  },
});

export default LoginScreen;
