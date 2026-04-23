import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform
} from 'react-native';
import AudioRecord from "react-native-audio-record";
import colors from '../styles/colors';

export default function AudioRecordingScreen() {

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // ---------------- PERMISSIONS ----------------
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    }
  };

  // ---------------- AUTO START ----------------
  useEffect(() => {
    requestPermissions().then(() => {
      startRecordingLoop();
    });
  }, []);

  // ---------------- TIMER ----------------
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // ---------------- KEYWORDS ----------------
  const KEYWORDS = [
    "help",
    "emergency",
    "bachao",
    "save me",
    "attack",
    "unsafe",
    "call police",
    "sos"
  ];

  const normalize = (t) =>
    t.toLowerCase().replace(/[^a-z ]/g, '').replace(/\s+/g, ' ');

  const detectLocalKeyword = (text) => {
    const clean = normalize(text);
    return KEYWORDS.find(k => clean.includes(k));
  };

  // ---------------- RECORD LOOP ----------------
  const startRecordingLoop = async () => {
    try {
      setIsRecording(true);
      setRecordingTime(0);

      AudioRecord.init({
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        wavFile: "recorded.wav",
      });

      AudioRecord.start();

      setTimeout(async () => {
        const filePath = await AudioRecord.stop();
        setIsRecording(false);

        await sendToBackend(filePath);

        startRecordingLoop(); // loop

      }, 15000);

    } catch (err) {
      console.log("Error:", err);
    }
  };

  // ---------------- BACKEND ----------------
  const sendToBackend = async (filePath) => {
    try {

      let formData = new FormData();

      formData.append("file", {
        uri: "file://" + filePath,
        name: "audio.wav",
        type: "audio/wav",
      });

      const res = await fetch("http://192.168.1.7:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("RESULT:", data);

      const localKeyword = detectLocalKeyword(data.text);

      // ---------------- EMERGENCY TRIGGER ----------------
      if (
        data.emergency === true ||
        data.sentiment?.fear > 0.5 ||
        localKeyword
      ) {
        Alert.alert(
          "🚨 EMERGENCY DETECTED",
          `Keyword: ${localKeyword || data.keyword || "distress detected"}`
        );
      }

    } catch (err) {
      console.log("Backend Error:", err);
    }
  };

  // ---------------- UI ----------------
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sahayak AI Monitoring</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.icon}>🎙️</Text>

        <Text style={styles.status}>
          {isRecording ? "Listening..." : "Running"}
        </Text>

        <Text style={styles.timer}>
          {Math.floor(recordingTime / 60)}:
          {(recordingTime % 60).toString().padStart(2, '0')}
        </Text>

        <Text style={styles.info}>
          AI Emergency Detection Active
        </Text>

      </View>

    </View>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    padding: 20,
    backgroundColor: colors.primary,
    alignItems: 'center'
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 90 },
  status: { fontSize: 22, marginTop: 20 },
  timer: { fontSize: 40, marginTop: 10 },
  info: { marginTop: 20, fontSize: 14, color: '#666' }
});