import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";

const SettingsScreen = ({ navigation }) => {
  // States
  const [language, setLanguage] = useState("English");
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

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* ---------------- PROFILE ---------------- */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <Text style={styles.sectionText}>View & update your personal details</Text>
          <TouchableOpacity 
            style={styles.buttonSmall}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.buttonSmallText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ---------------- PRIVACY & PERMISSIONS ---------------- */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Privacy & Permissions</Text>

          {Object.keys(permissions).map((key) => (
            <View key={key} style={styles.row}>
              <Text style={styles.rowText}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <Switch
                value={permissions[key]}
                onValueChange={() => togglePermission(key)}
              />
            </View>
          ))}
        </View>

        {/* ---------------- LANGUAGE ---------------- */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Language</Text>

          <View style={styles.row}>
            <Text style={styles.rowText}>Selected: {language}</Text>
          </View>

          <View style={styles.languageOptions}>
            {["English", "Hindi", "Marathi"].map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.langBtn,
                  language === lang && styles.langBtnActive,
                ]}
                onPress={() => setLanguage(lang)}
              >
                <Text
                  style={[
                    styles.langText,
                    language === lang && styles.langTextActive,
                  ]}
                >
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ---------------- THEME ---------------- */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Theme</Text>

          <View style={styles.row}>
            <Text style={styles.rowText}>Dark Mode</Text>
            <Switch value={darkTheme} onValueChange={setDarkTheme} />
          </View>
        </View>

        {/* ---------------- APP DATA ---------------- */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>App Data</Text>

          <TouchableOpacity style={styles.dataBtn}>
            <Text style={styles.dataBtnText}>Clear Cache</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dataBtn}>
            <Text style={styles.dataBtnText}>Export App Data</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dataBtn}>
            <Text style={styles.dataBtnText}>Reset App</Text>
          </TouchableOpacity>
        </View>

        {/* ---------------- ABOUT APP ---------------- */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About App</Text>
          <Text style={styles.sectionText}>Version: 1.0.0</Text>
          <Text style={styles.sectionText}>Developed by Team Sahaayak</Text>
          <Text style={styles.sectionText}>For support: support@sahaayak.app</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff",
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  
  backButton: {
    padding: 8,
  },
  
  backArrow: {
    fontSize: 56,
    color: '#000000ff',
    fontWeight: '900',
    marginTop: -60,
    marginLeft: -14,
  },
  
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginTop: -50,
  },
  
  placeholder: {
    width: 44, // Same width as back button for centering
  },
  
  scrollView: {
    flex: 1,
    padding: 20,
  },

  sectionCard: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 2,
  },

  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  sectionText: { fontSize: 15, color: "#555", marginBottom: 6 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  rowText: { fontSize: 16, color: "#333" },

  languageOptions: { flexDirection: "row", marginTop: 10 },
  langBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginRight: 10,
  },
  langBtnActive: { backgroundColor: "#007AFF" },
  langText: { color: "#333", fontSize: 15 },
  langTextActive: { color: "#fff", fontWeight: "600" },

  buttonSmall: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buttonSmallText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  dataBtn: {
    paddingVertical: 10,
    marginTop: 6,
    backgroundColor: "#ececec",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  dataBtnText: { fontSize: 16, color: "#333" },
}); 