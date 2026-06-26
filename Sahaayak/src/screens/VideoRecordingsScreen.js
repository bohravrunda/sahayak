import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image, // 🔥 Live bada plain frame render karne ke liye
} from "react-native";
import { useNavigation } from '@react-navigation/native';

const VideoRecordingsScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [activeSort, setActiveSort] = useState("Newest");
  const [loading, setLoading] = useState(true);
  
  // 🎯 Track karne ke liye ki kaunsa item list me bada (expanded) hoke chal raha hai
  const [playingId, setPlayingId] = useState(null); 
  const [decryptedCache, setDecryptedCache] = useState({}); // Decrypted images local buffer cache
  const [decryptingId, setDecryptingId] = useState(null); // Loader check karne ke liye

  const API_BASE_URL = "http://192.168.29.208:5000"; 

  useEffect(() => {
    fetchDistressVideos();
  }, []);

  // 📥 Fetch logic
  const fetchDistressVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/videos`);
      const data = await response.json(); 
      
      if (Array.isArray(data)) {
        const formattedVideos = data.map((file, index) => {
          const cTime = new Date(file.mtime || Date.now());
          const formattedDate = cTime.toLocaleDateString() + " " + cTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

          return {
            id: file.name || String(index),
            title: (file.name || "Incident_Log").replace(/\.[^/.]+$/, "").replace("distress_", "🚨 Distress_"), 
            filename: file.name,
            size: file.size || 0,
            rawTime: typeof file.mtime === 'number' ? file.mtime : cTime.getTime(),
            timestamp: formattedDate,
            duration: "IMAGE_FRAME", 
            url: file.url,         
            aesKey: file.aesKey     
          };
        });
        setVideos(formattedVideos);
      } else {
        throw new Error("Invalid structure data from backend");
      }
    } catch (error) {
      console.log("Error querying video streams:", error);
      setVideos([
        { id: "1", title: "🚨 Video_Threat_Trigger_Sandbox", filename: "distress_video_sample.mp4", rawTime: Date.now(), timestamp: "Today 11:05 AM", duration: "00:15", size: 1048576, url: "", aesKey: "test-key" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🔓 Expand aur Decrypt karne ka dynamic pipeline
  const togglePlainViewExpanded = async (item) => {
    if (playingId === item.id) {
      setPlayingId(null);
      return;
    }

    if (decryptedCache[item.id]) {
      setPlayingId(item.id);
      return;
    }

    try {
      if (!item.url || !item.aesKey) {
        Alert.alert("Error", "Cloud URL ya AES Key missing hai.");
        return;
      }

      setDecryptingId(item.id);

      const CryptoJS = require('crypto-js');

      // 1. Fetch ciphertext
      const response = await fetch(item.url);
      const encryptedText = await response.text();

      // 2. Clear bytes conversion
      const bytes = CryptoJS.AES.decrypt(encryptedText, item.aesKey);
      const plainBase64 = bytes.toString(CryptoJS.enc.Utf8);

      if (!plainBase64) throw new Error("Decryption failed");

      const imageUri = `data:image/png;base64,${plainBase64}`;
      setDecryptedCache(prev => ({ ...prev, [item.id]: imageUri }));
      setPlayingId(item.id);

    } catch (error) {
      console.log("Decryption fail:", error);
      Alert.alert("Error", "Could not un-lock plain view data block.");
    } finally {
      setDecryptingId(null);
    }
  };

  const deleteVideoRecord = (filename) => {
    Alert.alert(
      "Confirm Action",
      "Are you sure you want to delete this recorded video metadata?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Video", 
          style: "destructive", 
          onPress: async () => {
            try {
              const res = await fetch(`${API_BASE_URL}/api/videos/${filename}`, { method: 'DELETE' });
              if (res.ok) {
                Alert.alert("Success", "Incident video cleared successfully.");
                fetchDistressVideos(); 
              }
            } catch (err) {
              console.log("Server pipeline error during deletion:", err);
            }
          } 
        }
      ]
    );
  };

  const processSortingAndFiltering = () => {
    let dataset = [...videos];
    if (search.trim() !== "") {
      dataset = dataset.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (activeSort === "Newest") dataset.sort((a, b) => b.rawTime - a.rawTime);
    else if (activeSort === "Oldest") dataset.sort((a, b) => a.rawTime - b.rawTime);
    else if (activeSort === "Length") dataset.sort((a, b) => b.size - a.size); 
    return dataset;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>⬅</Text>
         </TouchableOpacity>
         <Text style={styles.title}>Incident Video Logs</Text>
      </View>

      <TextInput
        style={styles.searchBox}
        placeholder="Filter emergency files..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.sortRow}>
        <Text style={styles.sortText}>Sort by:</Text>
        {["Newest", "Oldest", "Length"].map((mode) => (
          <TouchableOpacity key={mode} onPress={() => setActiveSort(mode)}>
            <Text style={[styles.sortBtn, { color: activeSort === mode ? "#E91E63" : "#666", fontWeight: activeSort === mode ? "bold" : "normal" }]}>
              {mode}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E91E63" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={processSortingAndFiltering()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isExpanded = playingId === item.id;
            
            return (
              // 🔥 Dynamic Flex: Bada view hone par box automatically niche expand ho jayega
              <View style={[styles.item, isExpanded && styles.itemExpanded]}>
                
                {/* Upper row containing headers and side actions */}
                <View style={styles.itemMainRow}>
                  <View style={styles.videoIconBox}>
                     <Text style={{ fontSize: 24 }}>📹</Text>
                  </View>

                  <View style={styles.info}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.itemSub}>
                      {item.timestamp} • {item.duration}
                    </Text>
                  </View>

                  <View style={styles.actions}>
                    {decryptingId === item.id ? (
                      <ActivityIndicator size="small" color="#E91E63" />
                    ) : (
                      <TouchableOpacity onPress={() => togglePlainViewExpanded(item)}>
                         <Text style={[styles.actionBtn, { color: isExpanded ? "#FF9500" : "#4CAF50" }]}>
                            {isExpanded ? "⏹" : "▶"}
                         </Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity onPress={() => deleteVideoRecord(item.filename)}>
                       <Text style={[styles.actionBtn, { color: '#F44336' }]}>🗑</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 🔥 BADA VIEWPORT: Jab expand hoga toh niche bada plain photo layout open hoga */}
                {isExpanded && decryptedCache[item.id] && (
                  <View style={styles.bigImageContainer}>
                    <Image 
                      source={{ uri: decryptedCache[item.id] }} 
                      style={styles.bigPlainFrame}
                      resizeMode="contain"
                    />
                  </View>
                )}

              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default VideoRecordingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  backBtn: { fontSize: 24, marginRight: 15, color: '#333' },
  title: { fontSize: 22, fontWeight: "700", color: '#000' },
  searchBox: { backgroundColor: "#f2f2f2", color: '#000', padding: 12, borderRadius: 10, marginBottom: 10 },
  sortRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  sortText: { fontSize: 16, marginRight: 10, color: '#555' },
  sortBtn: { fontSize: 16, marginRight: 15 },
  
  // Card specs
  item: { backgroundColor: "#FFF5F5", padding: 12, borderRadius: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#E91E63' },
  itemExpanded: { borderLeftColor: '#FF9500', backgroundColor: '#FFFBFB' }, // Expand hone par accent shift
  itemMainRow: { flexDirection: "row", alignItems: "center" },
  
  videoIconBox: { width: 55, height: 55, backgroundColor: '#FFE0E6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  info: { flex: 1, paddingRight: 5 },
  itemTitle: { fontSize: 16, fontWeight: "600", color: '#111' },
  itemSub: { fontSize: 13, color: "#666", marginTop: 2 },
  actions: { flexDirection: "row", gap: 15, alignItems: 'center' },
  actionBtn: { fontSize: 22 },
  
  // 🔥 BADA VIEWPORT SPECIFICATIONS
  bigImageContainer: { width: '100%', marginTop: 15, borderRadius: 10, overflow: 'hidden', backgroundColor: '#000', padding: 5 },
  bigPlainFrame: { width: '100%', height: 260 } // Ekdam perfect bada dimension frame ki details dekhne ke liye
});