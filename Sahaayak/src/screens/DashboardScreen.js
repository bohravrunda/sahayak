import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to your Dashboard!</Text>
      <Text style={styles.subtitle}>You are now logged in.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')} // Logout goes back to Home
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.secondary }]}
        onPress={() => alert('Add more features here!')}
      >
        <Text style={styles.buttonText}>Explore Features</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.primary, marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 18, color: colors.black, marginBottom: 30, textAlign: 'center' },
  button: { backgroundColor: colors.primary, padding: 15, borderRadius: 10, width: '80%', alignItems: 'center', marginBottom: 20 },
  buttonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
});
