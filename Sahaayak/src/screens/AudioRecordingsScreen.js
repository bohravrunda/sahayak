import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const AudioRecordingsScreen = () => {
  const [search, setSearch] = useState("");

  // Sample data
  const recordings = [
    { id: "1", title: "Audio_001", duration: "00:32", timestamp: "Today" },
    { id: "2", title: "Audio_002", duration: "01:10", timestamp: "Yesterday" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Recordings</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBox}
        placeholder="Search audio..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Sort Options */}
      <View style={styles.sortRow}>
        <Text style={styles.sortText}>Sort by:</Text>
        <TouchableOpacity><Text style={styles.sortBtn}>Newest</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.sortBtn}>Oldest</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.sortBtn}>Longest</Text></TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSub}>{item.timestamp} • {item.duration}</Text>
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

export default AudioRecordingsScreen;

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
    justifyContent: "space-between",
    marginBottom: 12,
  },
  itemTitle: { fontSize: 18, fontWeight: "600" },
  itemSub: { fontSize: 14, color: "#666" },
  actions: { flexDirection: "row", gap: 10 },
  actionBtn: { fontSize: 22, marginLeft: 10 },
});