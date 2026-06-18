import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { getProfile } from "../api/profileApi";
import { openWhatsApp } from "../utils/openWhatsApp";
import { getEmergencyData } from "../store/EmergencyStore";

export default function EmergencyContactsScreen({ navigation }) {

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEmergency, setIsEmergency] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [encryptedKey, setEncryptedKey] = useState('');

  useEffect(() => {

    const emergency = getEmergencyData();

    setFileUrl(emergency.fileUrl || '');
    setEncryptedKey(emergency.encryptedKey || '');

    setIsEmergency(
      !!emergency.fileUrl && !!emergency.encryptedKey
    );

    const loadContacts = async () => {
      try {
        const profile = await getProfile();

        setContacts(profile?.emergencyContacts || []);

      } catch (err) {
        console.log("PROFILE ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();

  }, []);

  const handleWhatsApp = (contact) => {

    if (!isEmergency) {
      return;
    }

    openWhatsApp(
      contact.phone,
      fileUrl,
      encryptedKey
    );
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Emergency Contacts
        </Text>

        <View style={{ width: 30 }} />

      </View>

      {/* STATUS */}
      <View
        style={[
          styles.statusBox,
          {
            backgroundColor: isEmergency
              ? "#E8F5E9"
              : "#FFEBEE"
          }
        ]}
      >

        <Text
          style={{
            color: isEmergency
              ? "#2E7D32"
              : "#C62828",
            fontWeight: "700",
          }}
        >
          {
            isEmergency
              ? "🚨 Emergency Active"
              : "⚠️ No Active Emergency"
          }
        </Text>

      </View>

      {/* BODY */}
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >

        {
          loading ? (

            <ActivityIndicator
              size="large"
              color="#1B5E20"
            />

          ) : contacts.length === 0 ? (

            <Text style={styles.emptyText}>
              No emergency contacts found
            </Text>

          ) : (

            contacts.map((contact, index) => (

              <View
                key={index}
                style={styles.card}
              >

                {/* NAME */}
                <Text style={styles.name}>
                  {contact.name}
                </Text>

                {/* RELATION */}
                <Text style={styles.relation}>
                  {contact.relationship || "—"}
                </Text>

                {/* PHONE */}
                <Text style={styles.phone}>
                  {contact.phone}
                </Text>

                {/* BUTTON */}
                <TouchableOpacity
                  style={[
                    styles.whatsappBtn,
                    !isEmergency &&
                    styles.disabledBtn,
                  ]}
                  disabled={!isEmergency}
                  onPress={() =>
                    handleWhatsApp(contact)
                  }
                >

                  <Text style={styles.btnText}>
                    Send Alert via WhatsApp
                  </Text>

                </TouchableOpacity>

              </View>

            ))
          )
        }

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 3,
  },

  back: {
    fontSize: 22,
    color: "#333",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  statusBox: {
    margin: 16,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 2,
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1C1C1E",
  },

  relation: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },

  phone: {
    fontSize: 15,
    color: "#444",
    marginTop: 6,
  },

  whatsappBtn: {
    marginTop: 12,
    backgroundColor: "#1B5E20",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  disabledBtn: {
    backgroundColor: "#9E9E9E",
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#777",
    fontSize: 16,
  },
});