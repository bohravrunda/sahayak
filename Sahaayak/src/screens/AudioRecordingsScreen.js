import React, { useState, useEffect, useRef } from "react"; // 💡 Added useRef
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import Sound from 'react-native-sound'; 

Sound.setCategory('Playback');

const AudioRecordingsScreen = () => {
  const navigation = useNavigation();

  const [search, setSearch] = useState("");
  const [recordings, setRecordings] = useState([]);
  const [activeSort, setActiveSort] = useState("Newest");
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null); 
  
  // 🎯 FIX 1: Use useRef to keep track of the sound object across re-renders
  const currentSound = useRef(null);

  const API_BASE_URL = "http://10.205.27.41:5000"; 

  useEffect(() => {
    fetchDistressRecordings();

    // Optional: Real-time update check (Polls every 7 seconds)
    const interval = setInterval(fetchDistressRecordings, 7000);

    return () => {
      clearInterval(interval);
      if (currentSound.current) {
        currentSound.current.release();
      }
    };
  }, []);

  const fetchDistressRecordings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recordings`);
      const data = await response.json(); 
      
      if (Array.isArray(data)) {
        const formattedFiles = data.map((file, index) => {
          const cTime = new Date(file.mtime || Date.now());
          const formattedDate = cTime.toLocaleDateString() + " " + cTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

          return {
            id: file.name || String(index),
            title: (file.name || "Distress Log").replace(/\.[^/.]+$/, "").replace("distress_", "🚨 Distress_"), 
            filename: file.name,
            size: file.size || 0,
            rawTime: typeof file.mtime === 'number' ? file.mtime : cTime.getTime(),
            timestamp: formattedDate,
            duration: "00:04" 
          };
        });
        setRecordings(formattedFiles);
      }
    } catch (error) {
      console.log("Error fetching from ML server:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔊 AUDIO PLAYBACK ENGINE (FIXED)
  const playAudio = (item) => {
    if (playingId === item.id) {
      stopAudio();
      return;
    }

    if (currentSound.current) {
      currentSound.current.stop();
      currentSound.current.release();
    }

    const audioUrl = `${API_BASE_URL}/uploads/distress_recordings/${item.filename}`;
    console.log("🔊 Playing from URL:", audioUrl);

    setPlayingId(item.id);

    // 🎯 FIX 2: Assign to currentSound.current instead of local variable
    currentSound.current = new Sound(audioUrl, null, (error) => {
      if (error) {
        console.log("❌ Failed to load sound", error);
        Alert.alert("Error", "Could not stream audio from server.");
        setPlayingId(null);
        return;
      }
      
      currentSound.current.play((success) => {
        if (!success) {
          console.log("❌ Playback failed due to audio decoding errors");
        }
        setPlayingId(null); 
      });
    });
  };

  const stopAudio = () => {
    if (currentSound.current) {
      currentSound.current.stop();
      currentSound.current.release();
      currentSound.current = null;
    }
    setPlayingId(null);
  };

  const deleteRecordingFromServer = (filename) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to permanently delete this distress log?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              const res = await fetch(`${API_BASE_URL}/api/recordings/${filename}`, { method: 'DELETE' });
              if (res.status === 200 || res.status === 204) {
                fetchDistressRecordings(); 
              }
            } catch (err) {
              console.log("Server deletion failed:", err);
            }
          } 
        }
      ]
    );
  };

  const getProcessedData = () => {
    let result = [...recordings];
    if (search.trim() !== "") {
      result = result.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (activeSort === "Newest") result.sort((a, b) => b.rawTime - a.rawTime);
    else if (activeSort === "Oldest") result.sort((a, b) => a.rawTime - b.rawTime);
    else if (activeSort === "Longest") result.sort((a, b) => b.size - a.size); 
    return result;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>⬅</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Distress Audio Archives</Text>
      </View>

      <TextInput
        style={styles.searchBox}
        placeholder="Search incident logs..."
        placeholderTextColor="#999999"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.sortRow}>
        <Text style={styles.sortText}>Sort by:</Text>
        {["Newest", "Oldest", "Longest"].map((mode) => (
          <TouchableOpacity key={mode} onPress={() => setActiveSort(mode)}>
            <Text style={[styles.sortBtn, { color: activeSort === mode ? "#6C63FF" : "#666", fontWeight: activeSort === mode ? "700" : "400" }]}>
              {mode}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={getProcessedData()}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No emergency clips saved in archives.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="middle">
                  {item.title}
                </Text>
                <Text style={styles.itemSub}>
                  {item.timestamp} • {item.duration}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => playAudio(item)}>
                  <Text style={[styles.actionBtn, { color: playingId === item.id ? "#FF9500" : "#4CAF50" }]}>
                    {playingId === item.id ? "⏹" : "▶"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteRecordingFromServer(item.filename)}>
                  <Text style={[styles.actionBtn, { color: "#FF3B30" }]}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default AudioRecordingsScreen;

// ... (Styles same rahenge)export default AudioRecordingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", padding: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  backArrow: { fontSize: 24, marginRight: 15, color: '#333333' },
  title: { fontSize: 22, fontWeight: "700", color: "#000000" },
  searchBox: { backgroundColor: "#f2f2f2", color: "#000000", padding: 12, borderRadius: 10, marginBottom: 10, fontSize: 16 },
  sortRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  sortText: { fontSize: 16, marginRight: 10, color: "#666666" },
  sortBtn: { fontSize: 16, marginRight: 15 },
  item: { backgroundColor: "#FFF5F5", padding: 15, borderRadius: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, borderLeftWidth: 4, borderLeftColor: "#FF3B30" },
  itemTitle: { fontSize: 15, fontWeight: "600", color: "#000000" },
  itemSub: { fontSize: 13, color: "#666666", marginTop: 2 },
  actions: { flexDirection: "row", alignItems: "center" },
  actionBtn: { fontSize: 22, marginLeft: 16 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999999', fontSize: 15 }
});