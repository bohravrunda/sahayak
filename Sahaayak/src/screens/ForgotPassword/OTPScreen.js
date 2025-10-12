// src/screens/OTPScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../styles/colors';



export default function OTPScreen({ navigation }) {
  const [otp, setOtp] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification Code</Text>
      <Text style={styles.subtitle}>
        Please enter the 4-digit code sent to your email.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor={colors.gray}
        keyboardType="numeric"
        maxLength={4}
        value={otp}
        onChangeText={setOtp}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ResetPasswordScreen')}
      >
        <Text style={styles.buttonText}>Verify Code</Text>
      </TouchableOpacity>

      <Text style={styles.timer}>00:40</Text>

      <TouchableOpacity>
        <Text style={styles.link}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tealDark,
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.lightGray,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  input: {
    backgroundColor: colors.tealLight,
    borderRadius: 10,
    color: colors.white,
    textAlign: 'center',
    fontSize: 20,
    letterSpacing: 10,
    padding: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timer: {
    color: colors.lightGray,
    textAlign: 'center',
    marginTop: 20,
  },
  link: {
    color: colors.accent,
    textAlign: 'center',
    marginTop: 10,
  },
});
