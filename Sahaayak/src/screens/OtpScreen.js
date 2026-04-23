import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import colors from '../styles/colors';
import { verifyOtp } from '../api/authApi';

export default function OtpScreen({ route, navigation }) {

  const { email } = route.params;
  const [otp, setOtp] = useState('');

  const verify = async () => {

    if (!otp)
      return Alert.alert("Error", "Please enter OTP");

    try {
      const res = await verifyOtp(email, otp);

      console.log("OTP VERIFY RESPONSE:", res); // 🔎 debug

      if (res?.ok) {

        if (!res.token)
          return Alert.alert("Error", "Token not received from server");

        // ✅ pass token NOT email
        navigation.navigate("SetPassword", { token: res.token });

      } else {
        Alert.alert("Invalid OTP", res?.message || "OTP incorrect");
      }

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />

      <Button title="Verify OTP" color={colors.primary} onPress={verify} />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: colors.white
  }
});
