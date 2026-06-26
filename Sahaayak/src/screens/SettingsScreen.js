import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  StatusBar,
  Alert,
} from "react-native";
// Custom Context import
import { useLanguage } from "./../context/LanguageContext"; 

const SettingsScreen = ({ navigation }) => {
  // Global context se current language aur text strings extract karein
  const { language, setLanguage, text } = useLanguage(); 
  
  const [darkTheme, setDarkTheme] = useState(false);
  const [permissions, setPermissions] = useState({
    location: true,
    microphone: true,
    storage: false,
    notifications: true,
    background: true,
  });

  const togglePermission = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearCache = () => {
    Alert.alert(text.cacheCleared, text.cacheSuccess);
  };

  const handleExportData = () => {
    Alert.alert(text.dataExported, text.dataSuccess);
  };

  const handleResetApp = () => {
    Alert.alert(
      text.resetTitle,
      text.resetMsg,
      [
        { text: text.cancel, style: "cancel" },
        { 
          text: text.reset, 
          style: "destructive", 
          onPress: () => {
            setLanguage("English"); // Context reset
            setDarkTheme(false);
            setPermissions({
              location: true,
              microphone: true,
              storage: false,
              notifications: true,
              background: true,
            });
          } 
        },
      ]
    );
  };

  const theme = darkTheme
    ? { bg: "#0B0B0F", card: "#16161E", text: "#FFFFFF", subText: "#94A3B8", primary: "#3b82f6", border: "#232330", danger: "#ef4444" }
    : { bg: "#F8FAFC", card: "#FFFFFF", text: "#0F172A", subText: "#64748B", primary: "#007AFF", border: "#E2E8F0", danger: "#ff3b30" };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={darkTheme ? "light-content" : "dark-content"} backgroundColor={theme.bg} />

      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <Text style={[styles.backArrow, { color: theme.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{text.settings}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        
        {/* PROFILE CARD */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={[styles.title, { color: theme.text }]}>{text.profile}</Text>
            <Text style={[styles.subtitle, { color: theme.subText }]}>{text.manageProfile}</Text>
          </View>
          <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.primary }]} onPress={() => navigation?.navigate("Profile")}>
            <Text style={styles.btnText}>{text.edit}</Text>
          </TouchableOpacity>
        </View>

        {/* THEME */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>{text.appearance}</Text>
          <View style={styles.row}>
            <Text style={[styles.rowText, { color: theme.text }]}>{text.darkMode}</Text>
            <Switch value={darkTheme} onValueChange={setDarkTheme} trackColor={{ true: theme.primary, false: "#CBD5E1" }} thumbColor={"#FFF"} />
          </View>
        </View>

        {/* LANGUAGE SELECTION */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>{text.language}</Text>
          <View style={styles.languageContainer}>
            {["English", "Hindi", "Marathi"].map((lang) => {
              const isSelected = language === lang;
              return (
                <TouchableOpacity 
                  key={lang} 
                  style={[styles.langBtn, { backgroundColor: isSelected ? theme.primary : "transparent", borderColor: theme.border, borderWidth: 1 }]} 
                  onPress={() => setLanguage(lang)}
                >
                  <Text style={{ color: isSelected ? "#FFF" : theme.text, fontWeight: "600", fontSize: 14 }}>{lang}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* PERMISSIONS */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>{text.permissions}</Text>
          {Object.keys(permissions).map((key, index, arr) => (
            <View key={key} style={[styles.row, index !== arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
              <Text style={[styles.rowText, { color: theme.text }]}>{text[key] || key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              <Switch value={permissions[key]} onValueChange={() => togglePermission(key)} trackColor={{ true: theme.primary, false: "#CBD5E1" }} thumbColor={"#FFF"} />
            </View>
          ))}
        </View>

        {/* APP DATA */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>{text.appData}</Text>
          <TouchableOpacity onPress={handleClearCache} style={[styles.dataBtn, { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
            <Text style={[styles.rowText, { color: theme.text }]}>{text.clearCache}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleExportData} style={[styles.dataBtn, { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
            <Text style={[styles.rowText, { color: theme.text }]}>{text.exportData}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleResetApp} style={styles.dataBtn}>
            <Text style={[styles.rowText, { color: theme.danger, fontWeight: "600" }]}>{text.resetApp}</Text>
          </TouchableOpacity>
        </View>

        {/* ABOUT */}
        <View style={[styles.aboutCard, { backgroundColor: "transparent" }]}>
          <Text style={[styles.aboutText, { color: theme.subText }]}>{text.version} 1.0.0</Text>
          <Text style={[styles.aboutText, { color: theme.subText, fontWeight: "600" }]}>{text.team}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 20, paddingBottom: 12, paddingHorizontal: 8, borderBottomWidth: 1 },
  backButton: { padding: 8, width: 40, alignItems: "center" },
  backArrow: { fontSize: 24, fontWeight: "600" },
  headerTitle: { fontSize: 19, fontWeight: "700", letterSpacing: -0.5 },
  card: { borderRadius: 16, padding: 16, marginTop: 16, borderWidth: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 12, letterSpacing: -0.2, width: "100%" },
  subtitle: { fontSize: 13, marginTop: -8, marginBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, width: "100%" },
  rowText: { fontSize: 15, fontWeight: "500" },
  languageContainer: { flexDirection: "row", gap: 8, width: "100%" },
  langBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  primaryBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  dataBtn: { paddingVertical: 14, width: "100%" },
  aboutCard: { marginTop: 24, alignItems: "center", gap: 4, width: "100%" },
  aboutText: { fontSize: 12 }
});