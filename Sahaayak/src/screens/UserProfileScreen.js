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
import colors from "../styles/colors";

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
    alertMode: "siren",
    triggerPreference: "power button",
    autoSharing: {
      location: true,
      audio: false,
      video: false,
    },
  });

  const [loading, setLoading] = useState(false);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    if (isEditMode) loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      console.log("PROFILE FROM BACKEND:", data);

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
    } catch (err) {
      console.log("❌ FETCH PROFILE ERROR:", err);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */
  const updateField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const updateAutoSharing = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      autoSharing: {
        ...prev.autoSharing,
        [field]: value,
      },
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

  /* ================= SUBMIT ================= */
  const validateAndSubmit = async () => {
    if (!profile.fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
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
      Alert.alert("Error", "Add at least 2 emergency contacts");
      return;
    }

    try {
      setLoading(true);
      console.log("SENDING PROFILE:", profile);

      if (isEditMode) {
        await updateProfile(profile);
        Alert.alert("Success", "Profile updated!");
      } else {
        await createProfile(profile);
        Alert.alert("Success", "Profile created!");
      }

      navigation.replace("Dashboard");
    } catch (error) {
      console.log("❌ SAVE ERROR:", error);
      Alert.alert("Error", "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <ScrollView style={styles.container}>
      {isEditMode && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>
        {isEditMode ? "Update Profile" : "Create Profile"}
      </Text>

      {/* BASIC INFO */}
      <TextInput
        style={styles.input}
        placeholder="Full Name *"
        value={profile.fullName}
        onChangeText={(t) => updateField("fullName", t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={profile.age}
        onChangeText={(t) => updateField("age", t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={profile.dateOfBirth}
        onChangeText={(t) => updateField("dateOfBirth", t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={profile.gender}
        onChangeText={(t) => updateField("gender", t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile Number *"
        keyboardType="phone-pad"
        value={profile.mobileNumber}
        onChangeText={(t) => updateField("mobileNumber", t)}
      />

      {/* ALERT SETTINGS */}
      <Text style={styles.sectionTitle}>Alert Settings</Text>

      <TextInput
        style={styles.input}
        placeholder="Alert Mode (siren/vibration)"
        value={profile.alertMode}
        onChangeText={(t) => updateField("alertMode", t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Trigger Preference (power button/shake)"
        value={profile.triggerPreference}
        onChangeText={(t) => updateField("triggerPreference", t)}
      />

      {/* AUTO SHARING */}
      <Text style={styles.sectionTitle}>Auto Sharing</Text>

      <View style={styles.switchRow}>
        <Text>Share Location</Text>
        <Switch
          value={profile.autoSharing.location}
          onValueChange={(v) => updateAutoSharing("location", v)}
        />
      </View>

      <View style={styles.switchRow}>
        <Text>Share Audio</Text>
        <Switch
          value={profile.autoSharing.audio}
          onValueChange={(v) => updateAutoSharing("audio", v)}
        />
      </View>

      <View style={styles.switchRow}>
        <Text>Share Video</Text>
        <Switch
          value={profile.autoSharing.video}
          onValueChange={(v) => updateAutoSharing("video", v)}
        />
      </View>

      {/* EMERGENCY CONTACTS */}
      <Text style={styles.sectionTitle}>Emergency Contacts</Text>

      {profile.emergencyContacts.map((c, i) => (
        <View key={i} style={styles.contactCard}>
          <TextInput
            style={styles.input}
            placeholder="Name *"
            value={c.name}
            onChangeText={(t) => updateEmergencyContact(i, "name", t)}
          />

          <TextInput
            style={styles.input}
            placeholder="Relationship"
            value={c.relationship}
            onChangeText={(t) =>
              updateEmergencyContact(i, "relationship", t)
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Phone *"
            keyboardType="phone-pad"
            value={c.phone}
            onChangeText={(t) => updateEmergencyContact(i, "phone", t)}
          />

          {i > 1 && (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeContact(i)}
            >
              <Text style={{ color: "white" }}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity
        style={styles.addContactButton}
        onPress={addEmergencyContact}
      >
        <Text style={styles.addContactText}>+ Add Another Contact</Text>
      </TouchableOpacity>

      {/* SUBMIT */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={validateAndSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>
          {loading ? "Saving..." : isEditMode ? "Update Profile" : "Complete Profile"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  backButton: { fontSize: 18, color: colors.primary, marginBottom: 10 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.primary,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: colors.white,
    color: "black",
  },
  contactCard: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  removeBtn: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addContactButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addContactText: { color: colors.primary, fontWeight: "bold" },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: { color: "white", fontSize: 18, fontWeight: "bold" },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});