import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  StatusBar,
} from "react-native";

const SettingsScreen = ({ navigation }) => {
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

  // 🎨 Theme Colors
  const theme = darkTheme
    ? {
        bg: "#121212",
        card: "#1e1e1e",
        text: "#ffffff",
        subText: "#aaaaaa",
        primary: "#4CAF50",
        border: "#2c2c2c",
      }
    : {
        bg: "#f4f6f8",
        card: "#ffffff",
        text: "#222",
        subText: "#666",
        primary: "#007AFF",
        border: "#e0e0e0",
      };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={darkTheme ? "light-content" : "dark-content"} />

      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backArrow, { color: theme.text }]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Settings
        </Text>

        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* PROFILE */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>
            Manage your account details
          </Text>

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.btnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* PERMISSIONS */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            Permissions
          </Text>

          {Object.keys(permissions).map((key) => (
            <View key={key} style={styles.row}>
              <Text style={[styles.rowText, { color: theme.text }]}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <Switch
                value={permissions[key]}
                onValueChange={() => togglePermission(key)}
                trackColor={{ true: theme.primary }}
              />
            </View>
          ))}
        </View>

        {/* LANGUAGE */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>Language</Text>

          <View style={styles.languageContainer}>
            {["English", "Hindi", "Marathi"].map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.langBtn,
                  {
                    backgroundColor:
                      language === lang ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setLanguage(lang)}
              >
                <Text
                  style={{
                    color: language === lang ? "#fff" : theme.text,
                    fontWeight: "500",
                  }}
                >
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* THEME */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.row}>
            <Text style={[styles.title, { color: theme.text }]}>
              Dark Mode
            </Text>
            <Switch
              value={darkTheme}
              onValueChange={setDarkTheme}
              trackColor={{ true: theme.primary }}
            />
          </View>
        </View>

        {/* APP DATA */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            App Data
          </Text>

          {["Clear Cache", "Export Data", "Reset App"].map((item) => (
            <TouchableOpacity key={item} style={styles.dataBtn}>
              <Text style={[styles.rowText, { color: theme.text }]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ABOUT */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>About</Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>
            Team Sahaayak
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },

  backArrow: { fontSize: 22 },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  rowText: { fontSize: 15 },

  languageContainer: {
    flexDirection: "row",
    marginTop: 10,
  },

  langBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 10,
  },

  primaryBtn: {
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },

  dataBtn: {
    paddingVertical: 10,
  },
});