import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const RecordingsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recordings</Text>

      {/* Audio Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("AudioRecordings")}
      >
        <Text style={styles.cardTitle}>🎤 Audio Recordings</Text>
        <Text style={styles.cardText}>View all audio files</Text>
      </TouchableOpacity>

      {/* Video Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("VideoRecordings")}
      >
        <Text style={styles.cardTitle}>🎥 Video Recordings</Text>
        <Text style={styles.cardText}>View all video files</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecordingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginVertical: 10,
    color: "#000",
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 12,
    marginTop: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  cardText: {
    fontSize: 16,
    marginTop: 5,
    color: "#555",
  },
});