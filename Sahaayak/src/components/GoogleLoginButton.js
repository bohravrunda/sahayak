// src/components/GoogleLoginButton.js
import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

export default function GoogleLoginButton() {
  return (
    <TouchableOpacity style={styles.button}>
      <Image
        source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
        style={styles.icon}
      />
      <Text style={styles.text}>Login with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    color: '#444',
    fontWeight: '600',
  },
});
