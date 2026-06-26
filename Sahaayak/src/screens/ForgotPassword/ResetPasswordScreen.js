import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export default function ResetPasswordScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Password</Text>
      <Text style={styles.subtitle}>
        New password must be different from your last password
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#bbb"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#bbb"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')} // Perfectly Matched 👍
      >
        <Text style={styles.buttonText}>Save Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.tealDark || '#004D40', justifyContent: 'center', padding: 25 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  subtitle: { color: '#b0bec5', textAlign: 'center', marginTop: 10, marginBottom: 30 },
  input: {
    backgroundColor: colors.tealLight || '#00695C',
    borderRadius: 10,
    color: '#fff',
    padding: 15,
    marginBottom: 20,
  },
  button: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 15 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});