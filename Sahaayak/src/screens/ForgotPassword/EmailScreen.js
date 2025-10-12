import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export default function EmailScreen({ navigation }) {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your registered email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OTP')}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 25 },
  title: { fontSize: 28, color: colors.primary, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.black, marginBottom: 25, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: colors.gray, borderRadius: 10, padding: 12, marginBottom: 15, backgroundColor: colors.white },
  button: { backgroundColor: colors.primary, padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
});
