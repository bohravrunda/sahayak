import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../styles/colors';

// Language Context Integration
import { useLanguage } from './../context/LanguageContext';

export default function HowToUseScreen({ navigation }) {
  const { text } = useLanguage(); // Language context variables extract kiye

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{text.back || "← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{text.howToUseTitle || "How to Use Sahaayak"}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 🚨 Emergency Alert & Siren Section */}
        <Section
          title={text.secSirenTitle || "🚨 Emergency Siren & SOS"}
          description={text.secSirenDesc || "• Phone Shake: Shaking your phone firmly once will instantly trigger a loud panic siren. Shaking it a second time will turn the siren off.\n• SOS Button: Pressing the SOS button on the dashboard will immediately sound the siren and initiate background processing."}
        />

        {/* 🎙️ Audio Monitoring Section */}
        <Section
          title={text.secAudioTitle || "🎙️ Smart Audio Monitoring"}
          description={text.secAudioDesc || "The app monitors audio in the background using short 4-second chunks, followed by a 15-second break to optimize processing. If any vocal distress or specific emergency keywords (such as 'Help', 'बचाओ', or 'वाचवा मला') are detected during active monitoring, an encrypted audio file along with your live location will be shared immediately with your emergency contacts."}
        />

        {/* 🎬 Video Evidence Monitoring */}
        <Section
          title={text.secVideoTitle || "🎬 Video Evidence Monitoring"}
          description={text.secVideoDesc || "The camera continuously analyzes frames during monitoring sessions. If any structural danger, panic expression, or suspicious activity is flagged by the AI analyzer, the system automatically captures encrypted frames and fetches your live location to dispatch immediate alerts."}
        />

        {/* 📍 Location Sharing Section */}
        <Section
          title={text.secLocationTitle || "📍 Automatic Location Sharing"}
          description={text.secLocationDesc || "Whenever an emergency is triggered (via Audio detection, Video detection, or the SOS button), your accurate GPS coordinates are fetched in the background and attached as a maps link within the alert. Please ensure that location permissions are set to 'Allow all the time' for seamless functionality."}
        />

        {/* 📞 Emergency Contacts Section */}
        <Section
          title={text.secContactsTitle || "📞 Emergency Contacts (FCM Alerts)"}
          description={text.secContactsDesc || "Configure your trusted contacts via the profile management section. When an alert is fired, they will receive high-priority push notifications containing your real-time tracking link and the unique decryption key (AES Key) required to view the secure evidence stream."}
        />

        {/* ⚙️ Custom Settings */}
        <Section
          title={text.secCustomTitle || "⚙️ Custom Settings"}
          description={text.secCustomDesc || "Navigate to the Settings menu to customize shake sensitivity thresholds, toggle automated sharing layers, or adjust default monitoring parameters according to your environment."}
        />
      </ScrollView>
    </View>
  );
}

// Reusable Section Component
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
    backgroundColor: colors.background || '#F5F7FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.primary || '#6C63FF',
  },
  backButton: {
    color: colors.white || '#FFFFFF',
    fontSize: 18,
    marginRight: 15,
  },
  headerTitle: {
    color: colors.white || '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: colors.white || '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text || '#333333',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 15,
    color: colors.gray || '#666666',
    lineHeight: 24,
  },
});