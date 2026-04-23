import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import colors from '../styles/colors';

export default function PermissionsScreen({ navigation }) {
  const [permissions, setPermissions] = useState({
    location: false,
    camera: false,
    microphone: false,
    contacts: false,
  });

  const requestPermission = async (type) => {
    if (Platform.OS !== 'android') {
      Alert.alert('Info', 'Permission handling for iOS not implemented');
      return;
    }

    let permission;
    let permissionName;

    switch (type) {
      case 'location':
        permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
        permissionName = 'Location';
        break;
      case 'camera':
        permission = PermissionsAndroid.PERMISSIONS.CAMERA;
        permissionName = 'Camera';
        break;
      case 'microphone':
        permission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
        permissionName = 'Microphone';
        break;
      case 'contacts':
        permission = PermissionsAndroid.PERMISSIONS.READ_CONTACTS;
        permissionName = 'Contacts';
        break;
      default:
        return;
    }

    try {
      const granted = await PermissionsAndroid.request(permission, {
        title: `${permissionName} Permission`,
        message: `Sahaayak needs access to your ${permissionName.toLowerCase()} for safety features`,
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      });

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissions((prev) => ({ ...prev, [type]: true }));
        Alert.alert('Success', `${permissionName} permission granted`);
      } else {
        Alert.alert('Denied', `${permissionName} permission denied`);
      }
    } catch (err) {
      console.error('Permission error:', err);
      Alert.alert('Error', 'Failed to request permission');
    }
  };

  const requestAllPermissions = async () => {
    await requestPermission('location');
    await requestPermission('camera');
    await requestPermission('microphone');
    await requestPermission('contacts');
  };

  const handleContinue = () => {
    const allGranted = Object.values(permissions).every((p) => p);
    if (!allGranted) {
      Alert.alert(
        'Permissions Required',
        'Some permissions are not granted. You can continue, but some features may not work.',
        [
          { text: 'Grant Permissions', onPress: requestAllPermissions },
          {
            text: 'Continue Anyway',
            onPress: () => navigation.navigate('UserProfile'),
          },
        ]
      );
    } else {
      navigation.navigate('UserProfile');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Permissions</Text>
      <Text style={styles.subtitle}>
        We need these permissions to keep you safe
      </Text>

      <View style={styles.permissionsList}>
        <PermissionItem
          icon="📍"
          title="Location"
          description="Track your location during emergencies"
          granted={permissions.location}
          onPress={() => requestPermission('location')}
        />
        <PermissionItem
          icon="📷"
          title="Camera"
          description="Capture photos/videos for evidence"
          granted={permissions.camera}
          onPress={() => requestPermission('camera')}
        />
        <PermissionItem
          icon="🎤"
          title="Microphone"
          description="Record audio during emergencies"
          granted={permissions.microphone}
          onPress={() => requestPermission('microphone')}
        />
        <PermissionItem
          icon="📞"
          title="Contacts"
          description="Access emergency contacts"
          granted={permissions.contacts}
          onPress={() => requestPermission('contacts')}
        />
      </View>

      <TouchableOpacity
        style={styles.grantAllButton}
        onPress={requestAllPermissions}
      >
        <Text style={styles.buttonText}>Grant All Permissions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

function PermissionItem({ icon, title, description, granted, onPress }) {
  return (
    <TouchableOpacity style={styles.permissionItem} onPress={onPress}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.permissionInfo}>
        <Text style={styles.permissionTitle}>{title}</Text>
        <Text style={styles.permissionDesc}>{description}</Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          granted ? styles.granted : styles.notGranted,
        ]}
      >
        <Text style={styles.statusText}>{granted ? '✓' : '○'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 30,
  },
  permissionsList: {
    flex: 1,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  icon: {
    fontSize: 32,
    marginRight: 15,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  permissionDesc: {
    fontSize: 14,
    color: colors.gray,
  },
  statusBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  granted: {
    backgroundColor: '#4CAF50',
  },
  notGranted: {
    backgroundColor: '#E0E0E0',
  },
  statusText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  grantAllButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  continueText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
