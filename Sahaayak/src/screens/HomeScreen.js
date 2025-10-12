import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import colors from '../styles/colors';

export default function HomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../../assets/images/bg1.png')} // replace with your blurred image
      style={styles.background}
      blurRadius={3}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to Sahaayak</Text>
        <Text style={styles.subtitle}>Your smart personal assistant</Text>

        {/* White Box Login Button */}
        <TouchableOpacity
          style={[styles.button, styles.whiteBoxButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={[styles.buttonText, { color: colors.primary }]}>Login</Text>
        </TouchableOpacity>

        {/* White Box Register Button */}
        <TouchableOpacity
          style={[styles.button, styles.whiteBoxButton]}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={[styles.buttonText, { color: colors.primary }]}>Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.white,
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  whiteBoxButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
