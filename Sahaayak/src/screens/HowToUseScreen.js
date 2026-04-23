import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../styles/colors';

export default function HowToUseScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How to Use</Text>
      </View>

      <ScrollView style={styles.content}>
        <Section
          title="🚨 Emergency Alert"
          description="Press the power button 3 times quickly to trigger an emergency alert. This will send your location to emergency contacts and start recording."
        />
        <Section
          title="📍 Location Sharing"
          description="Your location is automatically shared with emergency contacts when you trigger an alert. Make sure location permissions are enabled."
        />
        <Section
          title="🎙️ Audio Recording"
          description="Start audio recording from the dashboard or sidebar. Recordings are saved automatically and can be accessed from the Recordings section."
        />
        <Section
          title="🎬 Video Recording"
          description="Capture video evidence during emergencies. Videos are stored securely and can be shared with authorities if needed."
        />
        <Section
          title="📞 Emergency Contacts"
          description="Add trusted contacts who will be notified during emergencies. They will receive your location and can access your recordings."
        />
        <Section
          title="⚙️ Settings"
          description="Customize alert modes, trigger preferences, and auto-sharing options from the Settings menu."
        />
      </ScrollView>
    </View>
  );
}

function Section({ title, description }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.primary,
  },
  backButton: {
    color: colors.white,
    fontSize: 18,
    marginRight: 15,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 16,
    color: colors.gray,
    lineHeight: 24,
  },
});
