import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from "react-native";

import { getProfile, createProfile, updateProfile } from "../api/profileApi";
import { getFCMToken } from "../utils/fcm";

/* 🔥 REUSABLE INPUT */
const InputField = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.inputContainer, focused && styles.inputFocused]}>
      <Text style={styles.labelText}>{placeholder}</Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor="#999"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
};

export default function UserProfileScreen({ navigation, route }) {
  const isEditMode = route?.params?.isEditMode || false;

  const [profile, setProfile] = useState({
    fullName: "",
    age: "",
    dateOfBirth: "",
    gender: "Female",
    mobileNumber: "",
    emergencyContacts: [
      { name: "", relationship: "", phone: "" },
      { name: "", relationship: "", phone: "" },
    ],
    autoSharing: {
      location: true,
      audio: false,
      video: false,
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();

      if (data) {
        setProfile((prev) => ({
          ...prev,
          ...data,
          autoSharing: {
            ...prev.autoSharing,
            ...data.autoSharing,
          },
        }));
      }
    } catch {
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const updateAutoSharing = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      autoSharing: { ...prev.autoSharing, [field]: value },
    }));
  };

  const updateEmergencyContact = (index, field, value) => {
    const contacts = [...profile.emergencyContacts];
    contacts[index][field] = value;
    setProfile((prev) => ({ ...prev, emergencyContacts: contacts }));
  };

  const addEmergencyContact = () => {
    setProfile((prev) => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        { name: "", relationship: "", phone: "" },
      ],
    }));
  };

  const removeContact = (index) => {
    const contacts = [...profile.emergencyContacts];
    contacts.splice(index, 1);
    setProfile((prev) => ({ ...prev, emergencyContacts: contacts }));
  };

  const validateAndSubmit = async () => {
    if (!profile.fullName.trim()) {
      Alert.alert("Error", "Enter full name");
      return;
    }

    if (!profile.mobileNumber || profile.mobileNumber.length < 10) {
      Alert.alert("Error", "Enter valid mobile number");
      return;
    }

    const validContacts = profile.emergencyContacts.filter(
      (c) => c.name && c.phone
    );

    if (validContacts.length < 2) {
      Alert.alert("Error", "Add at least 2 contacts");
      return;
    }

try {
      setLoading(true);
      const token = await getFCMToken();

      const updatedProfile = {
        ...profile,
        emergencyContacts: profile.emergencyContacts.map((c) => ({
          ...c,
          fcmToken: token,
        })),
      };

      if (isEditMode) {
        await updateProfile(updatedProfile);
        Alert.alert("Success", "Profile updated");
        navigation.goBack(); // 👈 Edit mode me goBack() use karein taaki stack clean rhe aur dashboard update ho jaye
      } else {
        await createProfile(updatedProfile);
        Alert.alert("Success", "Profile created");
        navigation.replace("Dashboard");
      }
    } catch {
      Alert.alert("Error", "Save failed");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {isEditMode && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>
        {isEditMode ? "Update Profile" : "Create Profile"}
      </Text>

      {/* BASIC INFO */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Basic Info</Text>

        <InputField
          placeholder="Full Name *"
          value={profile.fullName}
          onChangeText={(t) => updateField("fullName", t)}
        />

        <InputField
          placeholder="Age"
          value={profile.age}
          keyboardType="numeric"
          onChangeText={(t) => updateField("age", t)}
        />

        <InputField
          placeholder="DOB (YYYY-MM-DD)"
          value={profile.dateOfBirth}
          onChangeText={(t) => updateField("dateOfBirth", t)}
        />

        <InputField
          placeholder="Gender"
          value={profile.gender}
          onChangeText={(t) => updateField("gender", t)}
        />

        <InputField
          placeholder="Mobile Number *"
          value={profile.mobileNumber}
          keyboardType="phone-pad"
          onChangeText={(t) => updateField("mobileNumber", t)}
        />
      </View>

      {/* AUTO SHARING */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Auto Sharing</Text>

        {["location", "audio", "video"].map((item) => (
          <View key={item} style={styles.switchRow}>
            <Text style={styles.label}>{item.toUpperCase()}</Text>
            <Switch
              value={profile.autoSharing[item]}
              onValueChange={(v) => updateAutoSharing(item, v)}
              trackColor={{ true: "#1B5E20" }}
            />
          </View>
        ))}
      </View>

      {/* CONTACTS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>

        {profile.emergencyContacts.map((c, i) => (
          <View key={i} style={styles.contactCard}>
            <InputField
              placeholder="Name *"
              value={c.name}
              onChangeText={(t) =>
                updateEmergencyContact(i, "name", t)
              }
            />

            <InputField
              placeholder="Relationship"
              value={c.relationship}
              onChangeText={(t) =>
                updateEmergencyContact(i, "relationship", t)
              }
            />

            <InputField
              placeholder="Phone *"
              value={c.phone}
              keyboardType="phone-pad"
              onChangeText={(t) =>
                updateEmergencyContact(i, "phone", t)
              }
            />

            {i > 1 && (
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeContact(i)}
              >
                <Text style={{ color: "#fff" }}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addEmergencyContact}>
          <Text style={styles.addText}>+ Add Contact</Text>
        </TouchableOpacity>
      </View>

      {/* SUBMIT */}
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={validateAndSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>
          {loading ? "Saving..." : "Save Profile"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* 🎨 FINAL STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1C1C1E",
  },

  backButton: {
    fontSize: 16,
    marginBottom: 10,
    color: "#444",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#222",
  },

  inputContainer: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 12,
  },

  inputFocused: {
    borderColor: "#1B5E20",
    backgroundColor: "#FFFFFF",
  },

  labelText: {
    fontSize: 12,
    color: "#777",
    marginBottom: 4,
  },

  input: {
    fontSize: 16,
    color: "#000",
  },

  label: {
    fontSize: 15,
    color: "#333",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  contactCard: {
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },

  removeBtn: {
    backgroundColor: "#D32F2F",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },

  addBtn: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderStyle: "dashed",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  addText: {
    color: "#555",
    fontWeight: "500",
  },

  submitBtn: {
    backgroundColor: "#1B5E20",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 30,
  },

  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});