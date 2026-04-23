import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from '../styles/colors';

export default function RecordingsListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recordings</Text>
      </View>

      <View style={styles.content}>
        {/* Audio Recordings List */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Recordings")}
        >
          <Text style={styles.cardIcon}>🎤</Text>
          <Text style={styles.cardTitle}>Audio Recordings</Text>
          <Text style={styles.cardText}>View all audio files</Text>
        </TouchableOpacity>

        {/* Video Recordings List */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Videos")}
        >
          <Text style={styles.cardIcon}>📹</Text>
          <Text style={styles.cardTitle}>Video Recordings</Text>
          <Text style={styles.cardText}>View all video files</Text>
        </TouchableOpacity>
      </View>
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
  card: {
    backgroundColor: colors.white,
    padding: 25,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: colors.gray,
  },
});
