import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from '../api/profileApi';
import colors from '../styles/colors';

export default function EmergencyContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH FROM BACKEND =================
  const loadContacts = async () => {
    try {
      setLoading(true);

      const profile = await getProfile();

      if (profile?.emergencyContacts) {
        setContacts(profile.emergencyContacts);
      } else {
        setContacts([]);
      }
    } catch (err) {
      console.log('❌ CONTACT FETCH ERROR:', err);
      Alert.alert('Error', 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // ================= UI =================
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
      </View>

      {/* CONTENT */}
      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : contacts.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No emergency contacts found
          </Text>
        ) : (
          contacts.map((contact, index) => (
            <View key={index} style={styles.contactCard}>
              <View style={styles.contactIcon}>
                <Text style={styles.contactIconText}>📞</Text>
              </View>

              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRelationship}>
                  {contact.relationship}
                </Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
            </View>
          ))
        )}

        {/* OPTIONAL ADD BUTTON (future feature) */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('UserProfile', { isEditMode: true })}
        >
          <Text style={styles.addButtonText}>+ Edit Contacts</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.primary,
  },

  backButton: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  content: {
    padding: 15,
  },

  contactCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },

  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  contactIconText: {
    fontSize: 20,
    color: '#fff',
  },

  contactInfo: {
    flex: 1,
  },

  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  contactRelationship: {
    color: '#666',
  },

  contactPhone: {
    color: colors.primary,
    marginTop: 3,
  },

  addButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});