import 'react-native-get-random-values';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { supabase } from '../config/supabase';
import CryptoJS from 'crypto-js';
import RNFS from 'react-native-fs';
import { detectEmotion } from '../api/emotionApi';
import { getProfile } from '../api/profileApi';
import { Buffer } from 'buffer';

export default function VideoRecordingScreen() {

  const [hasPermission, setHasPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const cameraRef = useRef(null);
  const intervalRef = useRef(null);
  const dangerStartRef = useRef(null);
  const processingRef = useRef(false);

  const DANGER = ['angry', 'fear', 'sad'];
  const MASTER_KEY = 'my-secret-123';

  // 📷 Permission
  useEffect(() => {
    const getPermission = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true);
      }
    };

    getPermission();
  }, []);

  // 🧠 Emotion detection
  const runEmotionDetection = async () => {
    try {
      if (!cameraRef.current || processingRef.current) return;

      processingRef.current = true;

      const frame = await cameraRef.current.takePictureAsync({
        quality: 0.4,
        base64: false,
      });

      const result = await detectEmotion(frame.uri);
      const emotion = result?.emotions?.[0] || "";

      console.log("Emotion:", emotion);

      const isDanger = DANGER.some(e =>
        emotion.toLowerCase().includes(e)
      );

      const now = Date.now();

      if (isDanger) {
        if (!dangerStartRef.current) {
          dangerStartRef.current = now;
        }

        const duration = now - dangerStartRef.current;

        if (duration >= 5000) {
          dangerStartRef.current = null;
          await handleUpload(frame.uri);
          Alert.alert("🚨 Emergency", "Auto alert sent!");
        }

      } else {
        dangerStartRef.current = null;
      }

      processingRef.current = false;

    } catch (err) {
      console.log("Detection error:", err);
      processingRef.current = false;
    }
  };

  // ▶ Start
  const startRecording = () => {
    setIsRecording(true);
    intervalRef.current = setInterval(runEmotionDetection, 3000);
  };

  // ⏹ Stop
  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(intervalRef.current);
    dangerStartRef.current = null;
  };

  // 🔐 ENCRYPT + UPLOAD + ALERT
  const handleUpload = async (imageUri) => {
    try {
      // Convert image to base64
      const base64 = await RNFS.readFile(imageUri, 'base64');

      // Generate AES key
      const aesKey = CryptoJS.lib.WordArray.random(32).toString();

      // Encrypt image
      const encryptedData = CryptoJS.AES.encrypt(base64, aesKey).toString();

      // Encrypt key using master key
      const encryptedKey = CryptoJS.AES.encrypt(aesKey, MASTER_KEY).toString();

      const fileName = `emergency/${Date.now()}.enc`;
      const fileData = Buffer.from(encryptedData, 'utf-8');

      // Upload encrypted file
      const { error } = await supabase.storage
        .from('encrypted-videos')
        .upload(fileName, fileData, {
          contentType: 'application/octet-stream',
          upsert: true
        });

      if (error) throw error;

      // Generate signed URL
      const { data: signedData, error: signedError } =
        await supabase.storage
          .from('encrypted-videos')
          .createSignedUrl(fileName, 60 * 60);

      if (signedError) throw signedError;

      const fileUrl = signedData.signedUrl;

      console.log("✅ Upload success");

      // 🚨 Send alert to backend
      await sendEmergencyAlert(fileUrl, encryptedKey);

    } catch (err) {
      console.log("❌ Upload error:", err);
    }
  };

  // 🚨 SEND ALERT (SMS via backend)
  const sendEmergencyAlert = async (url, encryptedKey) => {
    try {
      const profile = await getProfile();
      const contacts = profile?.emergencyContacts || [];

      await fetch('http://192.168.1.7:3000/emergency/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileUrl: url,
          encryptedKey: encryptedKey,
          contacts: contacts
        })
      });

      console.log("📩 Emergency alert sent");

    } catch (err) {
      console.log("SMS Error:", err);
    }
  };

  if (!hasPermission) {
    return <Text>Camera permission required</Text>;
  }

  return (
    <View style={{ flex: 1 }}>

      <RNCamera
        ref={cameraRef}
        style={{ flex: 1 }}
        type={RNCamera.Constants.Type.front}
        captureAudio={false}
      />

      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isRecording ? 'red' : 'green' }
          ]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.text}>
            {isRecording ? 'Stop' : 'Start'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  button: {
    padding: 18,
    borderRadius: 50,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});