import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import colors from '../styles/colors';

export default function SafeLocationsScreen({ navigation }) {
  const [locations, setLocations] = useState([
    { id: 1, name: 'Home', address: '123 Main St, City' },
    { id: 2, name: 'Office', address: '456 Work Ave, City' },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', address: '' });

  const addLocation = () => {
    if (!newLocation.name.trim() || !newLocation.address.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLocations([
      ...locations,
      { id: Date.now(), name: newLocation.name, address: newLocation.address },
    ]);
    setNewLocation({ name: '', address: '' });
    setShowAddForm(false);
    Alert.alert('Success', 'Safe location added');
  };

  const deleteLocation = (id) => {
    Alert.alert(
      'Delete Location',
      'Are you sure you want to delete this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setLocations(locations.filter((loc) => loc.id !== id)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Safe Locations</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Add locations where you feel safe. These will be used for quick navigation during emergencies.
        </Text>

        {locations.map((location) => (
          <View key={location.id} style={styles.locationCard}>
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{location.name}</Text>
              <Text style={styles.locationAddress}>{location.address}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteLocation(location.id)}
            >
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}

        {showAddForm ? (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>Add New Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Location Name (e.g., Home, Office)"
              value={newLocation.name}
              onChangeText={(text) => setNewLocation({ ...newLocation, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={newLocation.address}
              onChangeText={(text) => setNewLocation({ ...newLocation, address: text })}
              multiline
            />
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowAddForm(false);
                  setNewLocation({ name: '', address: '' });
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={addLocation}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={styles.addButtonText}>+ Add Safe Location</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.primary,
  },
  backButton: {
    color: colors.white,
    fontSize: 18,
    marginRight: 15,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 20,
    lineHeight: 22,
  },
  locationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  locationAddress: {
    fontSize: 14,
    color: colors.gray,
  },
  deleteButton: {
    padding: 10,
  },
  deleteButtonText: {
    fontSize: 24,
  },
  addButton: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginTop: 10,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addForm: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray,
  },
  cancelButtonText: {
    color: colors.gray,
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
