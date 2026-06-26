import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import colors from '../styles/colors';

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../../assets/images/bg.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Sahaayak</Text>
          <Text style={styles.subtitle}>Your Safety Companion</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('SignupEmailScreen')} 
            >
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Stay safe with emergency alerts, location sharing, and instant help at your fingertips.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 25,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: colors.white,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  registerText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
});