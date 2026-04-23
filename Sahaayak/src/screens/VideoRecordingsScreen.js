import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const VideoRecordingsScreen = () => {
  const [search, setSearch] = useState("");

  const videos = [
    {
      id: "1",
      title: "Video_001",
      duration: "00:45",
      timestamp: "Today",
      thumbnail: "https://via.placeholder.com/120",
    },
    {
      id: "2",
      title: "Video_002",
      duration: "01:20",
      timestamp: "Yesterday",
      thumbnail: "https://via.placeholder.com/120",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Recordings</Text>

      <TextInput
        style={styles.searchBox}
        placeholder="Search video..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.sortRow}>
        <Text style={styles.sortText}>Sort by:</Text>
        <TouchableOpacity><Text style={styles.sortBtn}>Newest</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.sortBtn}>Oldest</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.sortBtn}>Length</Text></TouchableOpacity>
      </View>

      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />

            <View style={styles.info}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSub}>
                {item.timestamp} • {item.duration}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity><Text style={styles.actionBtn}>▶</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.actionBtn}>🗑</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.actionBtn}>📤</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default VideoRecordingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 10 },
  searchBox: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sortText: { fontSize: 16, marginRight: 10 },
  sortBtn: {
    fontSize: 16,
    color: "#007AFF",
    marginRight: 15,
  },
  item: {
    backgroundColor: "#f7f7f7",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  info: { flex: 1 },
  itemTitle: { fontSize: 18, fontWeight: "600" },
  itemSub: { fontSize: 14, color: "#666" },
  actions: { flexDirection: "row", gap: 10 },
  actionBtn: { fontSize: 22, marginLeft: 10 },
});