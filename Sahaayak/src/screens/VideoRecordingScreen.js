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
import { setEmergencyData } from '../store/EmergencyStore';
import { Buffer } from 'buffer';

export default function VideoRecordingScreen() {

  const [hasPermission, setHasPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const cameraRef = useRef(null);
  const intervalRef = useRef(null);
  const dangerStartRef = useRef(null);
  const processingRef = useRef(false);

  const DANGER = ['angry', 'fear', 'sad'];
  const MASTER_KEY = 'my-secret-123';

  // 📷 Permissions
  useEffect(() => {
    const getPermission = async () => {
      const camera = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );

      if (camera === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true);
      }
    };

    getPermission();
  }, []);

  // 🧠 Emotion detection
  const runEmotionDetection = async () => {
    try {
      if (!cameraRef.current || processingRef.current || !cameraReady) return;

      processingRef.current = true;

      const frame = await cameraRef.current.takePictureAsync({
        quality: 0.4,
        base64: false,
        pauseAfterCapture: false
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

        if (duration >= 100) {
          dangerStartRef.current = null;

          stopRecording(); // 🔥 stop loop

          await handleUpload(frame.uri);

          Alert.alert("🚨 Emergency", "Alert sent automatically!");
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
    intervalRef.current = setInterval(runEmotionDetection, 5000);
  };

  // ⏹ Stop
  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(intervalRef.current);
    dangerStartRef.current = null;
  };

  // 🔐 Upload + BACKEND ALERT
const handleUpload = async (imageUri) => {
  try {
    const base64 = await RNFS.readFile(imageUri, 'base64');

    const aesKey = CryptoJS.lib.WordArray.random(32).toString();

    const emergencyId = Date.now().toString();

    const encryptedData = CryptoJS.AES.encrypt(base64, aesKey).toString();

    const encryptedKey = CryptoJS.AES.encrypt(aesKey, MASTER_KEY).toString();

    const fileName = `emergency/${Date.now()}.enc`;

    const fileData = Buffer.from(encryptedData, 'utf-8');

    const { error } = await supabase.storage
      .from('encrypted-videos')
      .upload(fileName, fileData, {
        contentType: 'application/octet-stream',
        upsert: true
      });

    if (error) throw error;

    const { data } = await supabase.storage
      .from('encrypted-videos')
      .createSignedUrl(fileName, 60 * 60);

    const fileUrl = data?.signedUrl || '';

    console.log("🔥 fileUrl:", fileUrl);
    console.log("🔥 encryptedKey:", encryptedKey);

    if (!fileUrl || !encryptedKey) {
      console.log("❌ Missing data, not sending alert");
      return;
    }

await sendEmergencyAlert(
  emergencyId,
  fileName,
  aesKey
);

setEmergencyData({
  emergencyId,
  aesKey
});
} catch (err) {
    console.log("❌ Upload error:", err);
  }
};  // 🚨 BACKEND CALL
  const sendEmergencyAlert = async (
  emergencyId,
  url,
  encryptedKey
) => {
    try {
      const profile = await getProfile();
      const contacts = profile?.emergencyContacts || [];

      await fetch('http://10.205.27.41:3000/emergency/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
  emergencyId,
  fileName: url,
  aesKey: encryptedKey,
  contacts
})
      });

      console.log("📩 Alert sent to backend");

    } catch (err) {
      console.log("❌ Backend error:", err);
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
        onCameraReady={() => {
          console.log("✅ Camera Ready");
          setCameraReady(true);
        }}
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