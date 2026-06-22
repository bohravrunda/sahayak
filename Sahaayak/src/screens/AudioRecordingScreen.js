// import 'react-native-get-random-values';
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Platform
// } from 'react-native';

// import AudioRecord from "react-native-audio-record";
// import CryptoJS from 'crypto-js';
// import RNFS from 'react-native-fs';
// import { supabase } from '../config/supabase';
// import { Buffer } from 'buffer';

// global.Buffer = global.Buffer || Buffer;

// export default function AudioRecordingScreen() {

//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);

//   const MASTER_KEY = 'my-secret-123';

//   // ---------------- PERMISSIONS ----------------
//   const requestPermissions = async () => {
//     if (Platform.OS === 'android') {
//       await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//       ]);
//     }
//   };

//   // ---------------- AUTO START ----------------
//   useEffect(() => {
//     requestPermissions().then(() => {
//       startRecordingLoop();
//     });
//   }, []);

//   // ---------------- TIMER ----------------
//   useEffect(() => {
//     let interval;
//     if (isRecording) {
//       interval = setInterval(() => {
//         setRecordingTime(prev => prev + 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isRecording]);

//   // ---------------- KEYWORDS ----------------
//   const KEYWORDS = [
//     "help", "emergency", "bachao", "save me",
//     "attack", "unsafe", "call police", "sos"
//   ];

//   const normalize = (t) =>
//     t.toLowerCase().replace(/[^a-z ]/g, '').replace(/\s+/g, ' ');

//   const detectLocalKeyword = (text) => {
//     const clean = normalize(text);
//     return KEYWORDS.find(k => clean.includes(k));
//   };

//   // ---------------- RECORD LOOP ----------------
//   const startRecordingLoop = async () => {
//     try {
//       setIsRecording(true);
//       setRecordingTime(0);

//       AudioRecord.init({
//         sampleRate: 16000,
//         channels: 1,
//         bitsPerSample: 16,
//         wavFile: "recorded.wav",
//       });

//       AudioRecord.start();

//       setTimeout(async () => {
//         const filePath = await AudioRecord.stop();
//         setIsRecording(false);

//         await sendToBackend(filePath);

//         startRecordingLoop(); // 🔁 loop

//       }, 15000);

//     } catch (err) {
//       console.log("Recording Error:", err);
//     }
//   };

//   // ---------------- ENCRYPT + UPLOAD ----------------
//   const encryptAndUploadAudio = async (filePath) => {
//     try {
//       console.log("🔐 Encrypt function started");
      
//       // 1. Android path clean-up (Ensure single file:// or no prefix for RNFS)
//       const cleanPath = filePath.startsWith('file://') ? filePath.replace('file://', '') : filePath;
      
//       const fileExists = await RNFS.exists(cleanPath);
//       if (!fileExists) {
//         console.log("❌ File does not exist at:", cleanPath);
//         return null;
//       }

//       console.log("📖 Reading file to Base64...");
//       // Audio file ko base64 string mein read kiya
//       const base64Audio = await RNFS.readFile(cleanPath, 'base64');

//       // 2. AES Encryption keys setup
//       console.log("⚡ Encrypting data...");
//       const aesKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
      
//       // Base64 string ko encrypt kiya
//       const encryptedData = CryptoJS.AES.encrypt(base64Audio, aesKey).toString();
//       const encryptedKey = CryptoJS.AES.encrypt(aesKey, MASTER_KEY).toString();

//       const fileName = `audio/${Date.now()}.enc`;

//       console.log("📤 Uploading encrypted text to Supabase...");
      
//       // FIX: React Native Supabase storage string ko direct accept kar leta hai 
//       // agar contentType 'text/plain' ho. Buffer ki jhanjhat hi khatam!
//       const { data: uploadData, error: uploadError } = await supabase.storage
//         .from('encrypt-audios')
//         .upload(fileName, encryptedData, {
//           contentType: 'text/plain',
//           upsert: true
//         });

//       if (uploadError) {
//         console.log("❌ Supabase Storage Error Details:", JSON.stringify(uploadError, null, 2));
//         throw uploadError;
//       }

//       console.log("🔗 Generating Signed URL...");
//       const { data: urlData, error: urlError } = await supabase.storage
//         .from('encrypt-audios')
//         .createSignedUrl(fileName, 60 * 60);

//       if (urlError) {
//         console.log("❌ Signed URL Error:", urlError);
//         throw urlError;
//       }

//       const fileUrl = urlData?.signedUrl || '';
//       console.log("✅ Successfully Uploaded & Generated Link:", fileUrl);

//       return { fileUrl, encryptedKey };

//     } catch (err) {
//       console.log("❌ Final Upload Error Catch Block:", err);
//       return null;
//     }
//   };
//   // ---------------- ALERT ----------------
//   const sendEmergencyAlert = async (url, encryptedKey) => {
//     try {
//       await fetch('http://192.168.1.8:3000/emergency/alert', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           fileUrl: url,
//           encryptedKey: encryptedKey
//         })
//       });

//       console.log("📩 Alert sent");

//     } catch (err) {
//       console.log("❌ Alert Error:", err);
//     }
//   };

//   // ---------------- BACKEND ----------------
//   const sendToBackend = async (filePath) => {
//     try {
//       let formData = new FormData();

//       // Check if filePath already has file://
//       const properUri = filePath.startsWith('file://') ? filePath : "file://" + filePath;

//       formData.append("file", {
//         uri: properUri,
//         name: "audio.wav",
//         type: "audio/wav",
//       });

//       console.log("🗣️ Sending to AI backend analyzer...");
//       const res = await fetch("http://192.168.1.8:5000/analyze", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       console.log("🎤 FULL RESPONSE:", JSON.stringify(data, null, 2));

//       const localKeyword = detectLocalKeyword(data.text || '');
//       console.log("Keyword:", localKeyword);

//       if (data.emergency || localKeyword) {
//         console.log("🚨 Emergency Block Entered");

//         Alert.alert(
//           "🚨 EMERGENCY DETECTED",
//           `Keyword: ${localKeyword || "distress detected"}`
//         );

//         // Pass the raw filePath returned by AudioRecord
//         const result = await encryptAndUploadAudio(filePath);

//         if (result) {
//           await sendEmergencyAlert(result.fileUrl, result.encryptedKey);
//         }
//       }

//     } catch (err) {
//       console.log("Backend Error:", err);
//     }
//   };


//   const decryptAudioFromCloud = async (fileUrl, encryptedKey) => {
//   try {
//     console.log("🔓 Starting decryption...");

//     // 1. Download encrypted file content
//     const response = await fetch(fileUrl);
//     const encryptedData = await response.text();

//     // 2. Decrypt AES key using MASTER_KEY
//     const bytesKey = CryptoJS.AES.decrypt(encryptedKey, MASTER_KEY);
//     const aesKey = bytesKey.toString(CryptoJS.enc.Utf8);

//     if (!aesKey) {
//       throw new Error("Invalid AES key decryption");
//     }

//     console.log("🔑 AES Key recovered");

//     // 3. Decrypt audio data
//     const bytesData = CryptoJS.AES.decrypt(encryptedData, aesKey);
//     const base64Audio = bytesData.toString(CryptoJS.enc.Utf8);

//     if (!base64Audio) {
//       throw new Error("Audio decryption failed");
//     }

//     console.log("✅ Audio decrypted successfully");

//     // 4. (Optional) Save file locally
//     const path = `${RNFS.DocumentDirectoryPath}/decrypted_${Date.now()}.wav`;

//     await RNFS.writeFile(path, base64Audio, 'base64');

//     console.log("📁 Saved decrypted audio at:", path);

//     Alert.alert("Success", "Audio decrypted successfully!");

//     return path;

//   } catch (err) {
//     console.log("❌ Decryption Error:", err);
//     return null;
//   }
// };

// const handleDecryptionFlow = async (fileUrl, encryptedKey) => {
//   const localPath = await decryptAudioFromCloud(fileUrl, encryptedKey);

//   if (localPath) {
//     console.log("🎧 Ready to play:", localPath);
//   }
// };
//   // ---------------- UI ----------------
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Sahayak AI Monitoring</Text>
//       </View>

//       <View style={styles.content}>
//         <Text style={styles.icon}>🎙️</Text>
//         <Text style={styles.status}>
//           {isRecording ? "Listening..." : "Running"}
//         </Text>
//         <Text style={styles.timer}>
//           {Math.floor(recordingTime / 60)}:
//           {(recordingTime % 60).toString().padStart(2, '0')}
//         </Text>
//         <Text style={styles.info}>
//           AI Emergency Detection Active
//         </Text>
//       </View>
//     </View>
//   );
// }

// // ---------------- STYLES ----------------
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F5F7FB' },
//   header: {
//     padding: 20,
//     backgroundColor: '#6C63FF',
//     alignItems: 'center'
//   },
//   headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
//   content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   icon: { fontSize: 90 },
//   status: { fontSize: 22, marginTop: 20 },
//   timer: { fontSize: 40, marginTop: 10 },
//   info: { marginTop: 20, fontSize: 14, color: '#666' }
// });


















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

import { getProfile } from '../api/profileApi';
import { setEmergencyData } from '../store/EmergencyStore';

global.Buffer = global.Buffer || Buffer;

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
        wavFile: "recorded.wav", // 🎙️ Generates a raw WAV stream file
      });

      AudioRecord.start();

      setTimeout(async () => {
        const filePath = await AudioRecord.stop();
        setIsRecording(false);

        await sendToBackend(filePath);

        startRecordingLoop(); 

      }, 15000);

    } catch (err) {
      console.log("Recording Error:", err);
    }
  };

  // ---------------- ENCRYPT + UPLOAD + BACKEND ALERT ----------------
  const handleUpload = async (filePath) => {
    try {
      console.log("🔐 Encrypt & Upload function started");
      
      const cleanPath = filePath.startsWith('file://') ? filePath.replace('file://', '') : filePath;
      
      const fileExists = await RNFS.exists(cleanPath);
      if (!fileExists) {
        console.log("❌ Audio file does not exist at:", cleanPath);
        return;
      }

      console.log("📖 Reading file to Base64...");
      const base64Audio = await RNFS.readFile(cleanPath, 'base64');

      console.log("⚡ Generating AES Key & Encrypting...");
      const aesKey = CryptoJS.lib.WordArray.random(32).toString();
      const emergencyId = Date.now().toString();

      const encryptedData = CryptoJS.AES.encrypt(base64Audio, aesKey).toString();

      // Appending .enc but context remains audio stream
      const fileName = `audio/${Date.now()}.enc`;
      const fileData = Buffer.from(encryptedData, 'utf-8');

      console.log("📤 Uploading encrypted text to Supabase...");
      const { error } = await supabase.storage
        .from('encrypted-videos')
        .upload(fileName, fileData, {
          contentType: 'application/octet-stream',
          upsert: true
        });

      if (error) throw error;

      if (!fileName || !aesKey) {
        console.log("❌ Missing key data details, aborting alert setup");
        return;
      }

      // 🔥 FIXED: Added safe explicit parameters matching infrastructure layers
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
      console.log("❌ Upload/Encryption Error Catch Block:", err);
    }
  };

  // ---------------- 🚨 BACKEND CALL ----------------
  const sendEmergencyAlert = async (emergencyId, url, encryptedKey) => {
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
          fileType: 'audio', // 🔥 CRITICAL: Tells NestJS that this is an Audio file stream
          contacts
        })
      });

      console.log("📩 Alert sent to backend successfully");

    } catch (err) {
      console.log("❌ Backend communication error:", err);
    }
  };

  // ---------------- AI DETECTOR BACKEND ----------------
  const sendToBackend = async (filePath) => {
    try {
      let formData = new FormData();
      const properUri = filePath.startsWith('file://') ? filePath : "file://" + filePath;

      formData.append("file", {
        uri: properUri,
        name: "audio.wav",
        type: "audio/wav",
      });

      console.log("🗣️ Sending to AI backend analyzer...");
      const res = await fetch("http://10.205.27.41:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("🎤 FULL RESPONSE:", JSON.stringify(data, null, 2));

      const localKeyword = detectLocalKeyword(data.text || '');
      console.log("Keyword:", localKeyword);

      if (data.emergency || localKeyword) {
        console.log("🚨 Emergency Detected in Audio stream");

        Alert.alert(
          "🚨 EMERGENCY DETECTED",
          `Keyword: ${localKeyword || "distress detected"}`
        );

        await handleUpload(filePath);
      }

    } catch (err) {
      console.log("Backend Error:", err);
    }
  };

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB' },
  header: { padding: 20, backgroundColor: '#6C63FF', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 90 },
  status: { fontSize: 22, marginTop: 20 },
  timer: { fontSize: 40, marginTop: 10 },
  info: { marginTop: 20, fontSize: 14, color: '#666' }
});