import 'react-native-get-random-values';
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
import CryptoJS from 'crypto-js';
import RNFS from 'react-native-fs';
import { supabase } from '../config/supabase';
import { Buffer } from 'buffer';

global.Buffer = global.Buffer || Buffer;

export default function AudioRecordingScreen() {

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const MASTER_KEY = 'my-secret-123';

  // ---------------- PERMISSIONS ----------------
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.INTERNET
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
    "help", "emergency", "bachao", "save me",
    "attack", "unsafe", "call police", "sos"
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

        startRecordingLoop(); // 🔁 loop

      }, 15000);

    } catch (err) {
      console.log("Recording Error:", err);
    }
  };

  // ---------------- ENCRYPT + UPLOAD ----------------
const encryptAndUploadAudio = async (filePath) => {
  try {

    console.log("File path:", filePath);

    const base64Audio = await RNFS.readFile(filePath, 'base64');

    console.log("Base64 length:", base64Audio.length);

    const aesKey = CryptoJS.lib.WordArray.random(32).toString();

    const encryptedData =
      CryptoJS.AES.encrypt(base64Audio, aesKey).toString();

    const fileName = `audio/${Date.now()}.enc`;

    console.log("Uploading:", fileName);

    const fileData = Buffer.from(encryptedData, 'utf-8');

    const { data, error } = await supabase.storage
      .from('encrypt-audios')
      .upload(
        fileName,
        fileData,
        {
          contentType: 'application/octet-stream',
          upsert: true
        }
      );

    console.log("Upload data:", data);
    console.log("Upload error:", error);

    if (error) {
      throw error;
    }

    console.log("✅ Upload successful");

    return {
      fileName,
      aesKey
    };

  } catch (err) {
    console.log("❌ Upload Error:", err);
    return null;
  }
};
// ---------------- ALERT ----------------
const sendEmergencyAlert = async (
  emergencyId,
  fileName,
  aesKey
) => {

  try {

    const profile =
      await getProfile();

    const contacts =
      profile?.emergencyContacts || [];

    await fetch(
      'http://192.168.1.8:3000/emergency/alert',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emergencyId,
          fileName,
          aesKey,
          contacts
        })
      }
    );

    console.log("📩 Alert sent");

  } catch (err) {

    console.log(
      "❌ Alert Error:",
      err
    );

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

      const res = await fetch("http://192.168.1.8:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("🎤 RESULT:", data);

      const localKeyword = detectLocalKeyword(data.text);

      // 🚨 EMERGENCY CONDITION
      if (data.emergency === true || localKeyword) {

  Alert.alert(
    "🚨 EMERGENCY DETECTED",
    `Keyword: ${
      localKeyword || "distress detected"
    }`
  );

  const result =
    await encryptAndUploadAudio(
      filePath
    );

  if (result) {

    await sendEmergencyAlert(
      result.emergencyId,
      result.fileName,
      result.aesKey
    );

    setEmergencyData({
      emergencyId:
        result.emergencyId,
      aesKey:
        result.aesKey
    });

  }

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
  container: { flex: 1, backgroundColor: '#F5F7FB' },
  header: {
    padding: 20,
    backgroundColor: '#6C63FF',
    alignItems: 'center'
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 90 },
  status: { fontSize: 22, marginTop: 20 },
  timer: { fontSize: 40, marginTop: 10 },
  info: { marginTop: 20, fontSize: 14, color: '#666' }
});