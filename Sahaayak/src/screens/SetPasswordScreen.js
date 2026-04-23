import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import colors from '../styles/colors';
import { setPassword } from '../api/authApi';
import Icon from 'react-native-vector-icons/Feather';

export default function SetPasswordScreen({ route, navigation }) {

  const { token } = route.params; // ✅ receive token not email

  const [password, setPass] = useState('');
  const [confirmPassword, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const submit = async () => {

    if (!password || !confirmPassword)
      return Alert.alert("Error", "All fields required");

    if (password !== confirmPassword)
      return Alert.alert("Error", "Passwords do not match");

    try {
      const res = await setPassword(token, password, confirmPassword);

      console.log("SET PASSWORD RES:", res);

      if (res?.ok || res?.success) {
        Alert.alert("Success", "Account created successfully");
        navigation.replace("Login"); // ✅ replace not navigate
      } else {
        Alert.alert("Error", res?.message || "Failed to set password");
      }

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Password</Text>

      {/* PASSWORD */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPass}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Icon name={showPass ? "eye" : "eye-off"} size={22} color="#777" />
        </TouchableOpacity>
      </View>

      {/* CONFIRM PASSWORD */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirm}
          value={confirmPassword}
          onChangeText={setConfirm}
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Icon name={showConfirm ? "eye" : "eye-off"} size={22} color="#777" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btn} onPress={submit}>
        <Text style={styles.btnText}>Finish Signup</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    color: colors.primary,
    textAlign: 'center'
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: colors.white
  },

  input: {
    flex: 1,
    paddingVertical: 12
  },

  btn: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }
});
