 import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import colors from '../styles/colors';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../api/authApi';



export default function DashboardScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const stats = [
    { title: 'Recordings', value: '0', icon: '🎤', screen: 'Recordings' },
    { title: 'Videos', value: '0', icon: '📹', screen: 'Videos' },
    { title: 'Emergency Contacts', value: '0', icon: '📞', screen: 'EmergencyContacts' },
    { title: 'Safe Locations', value: '0', icon: '📍', screen: 'SafeLocations' },
  ];

  const recentActivities = [
    { id: 1, activity: 'Emergency recording saved', time: 'Today', icon: '🎤' },
    { id: 3, activity: 'Video evidence uploaded', time: '2 days ago', icon: '📹' },
  ];

const handleLogout = () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();

            // Google account logout
            await GoogleSignin.signOut();

            // Remove local data
            await AsyncStorage.clear();

            navigation.replace("Login");

          } catch (err) {
            console.log("Logout Error:", err);
          }
        },
      },
    ]
  );
};
  const handleSOSAlert = () => {
    Alert.alert(
      'SOS ALERT',
      'Emergency alert will be sent to all your emergency contacts!',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Alert', 
          style: 'destructive', 
          onPress: () => Alert.alert('Alert Sent!', 'Emergency contacts have been notified.') 
        },
      ]
    );
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  const navigateTo = (screen) => {
    closeSidebar();
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {/* Sidebar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sidebarVisible}
        onRequestClose={closeSidebar}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <View>
                <Text style={styles.sidebarTitle}>Sahaayak</Text>
                <Text style={styles.sidebarSubtitle}>Menu</Text>
              </View>
              <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.sidebarContent}>
              <TouchableOpacity 
                style={[styles.sidebarItem, styles.sidebarItemActive]}
                onPress={() => closeSidebar()}
              >
                <Text style={styles.sidebarItemIcon}>🏠</Text>
                <Text style={styles.sidebarItemTextActive}>Dashboard</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.sidebarItem}
                onPress={() => {
                  closeSidebar();
                  navigation.navigate('UserProfile', { isEditMode: true });

                }}
              >
                <Text style={styles.sidebarItemIcon}>👤</Text>
                <Text style={styles.sidebarItemText}>My Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.sidebarItem}
                onPress={() => navigateTo('HowToUse')}
              >
                <Text style={styles.sidebarItemIcon}>❓</Text>
                <Text style={styles.sidebarItemText}>How to Use</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.sidebarItem}
                onPress={() => navigateTo('RecordingsList')}
              >
                <Text style={styles.sidebarItemIcon}>🎬</Text>
                <Text style={styles.sidebarItemText}>Recordings</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.sidebarItem}
                onPress={() => navigateTo('EmergencyContacts')}
              >
                <Text style={styles.sidebarItemIcon}>📞</Text>
                <Text style={styles.sidebarItemText}>Emergency Contacts</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.sidebarItem}
                onPress={() => navigateTo('SafeLocations')}
              >
                <Text style={styles.sidebarItemIcon}>📍</Text>
                <Text style={styles.sidebarItemText}>Safe Locations</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.sidebarItem}
                onPress={() => navigateTo('Settings')}
              >
                <Text style={styles.sidebarItemIcon}>⚙️</Text>
                <Text style={styles.sidebarItemText}>Settings</Text>
              </TouchableOpacity>

              <View style={styles.sidebarDivider} />

              <TouchableOpacity 
                style={[styles.sidebarItem, styles.logoutSidebarItem]}
                onPress={() => {
                  closeSidebar();
                  handleLogout();
                }}
              >
                <Text style={styles.sidebarItemIcon}>🚪</Text>
<TouchableOpacity onPress={handleLogout}>
  <Text>Logout</Text>
</TouchableOpacity>                
              </TouchableOpacity>
            </ScrollView>
          </View>
          <TouchableOpacity 
            style={styles.modalBackground} 
            activeOpacity={1} 
            onPress={closeSidebar}
          />
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Sahayaak</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.userAvatar}
            onPress={() => navigation.navigate('UserProfile')}
          >
            <Text style={styles.userAvatarText}>U</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* SOS Alert Button */}
        <TouchableOpacity 
          style={styles.sosButton}
          onPress={handleSOSAlert}
        >
          <Text style={styles.sosIcon}>🚨</Text>
          <Text style={styles.sosText}>EMERGENCY SOS ALERT</Text>
        </TouchableOpacity>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back, Stay Safe!</Text>
          <Text style={styles.welcomeSubtitle}>Your safety dashboard overview</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search recordings, videos..."
            placeholderTextColor={colors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={() => navigation.navigate('AudioRecording')}
            >
              <Text style={styles.actionIconLarge}>🎤</Text>
              <Text style={styles.actionTextPrimary}>New Audio Recording</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('VideoRecording')}
            >
              <Text style={styles.actionIconLarge}>📹</Text>
              <Text style={styles.actionTextSecondary}>New Video Recording</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('EmergencyContacts')}
            >
              <Text style={styles.actionIconLarge}>👥</Text>
              <Text style={styles.actionTextSecondary}>Add Contact</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('SafeLocations')}
            >
              <Text style={styles.actionIconLarge}>📍</Text>
              <Text style={styles.actionTextSecondary}>Safe Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityIconContainer}>
                <Text style={styles.activityIcon}>{activity.icon}</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{activity.activity}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Sidebar Styles
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 280,
    backgroundColor: colors.white,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  sidebarHeader: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  sidebarSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 28,
    color: colors.white,
    fontWeight: 'bold',
  },
  sidebarContent: {
    flex: 1,
    padding: 10,
    paddingBottom: 20,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
  },
  sidebarItemActive: {
    backgroundColor: colors.primary,
  },
  sidebarItemIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  sidebarItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  sidebarItemTextActive: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 15,
  },
  logoutSidebarItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  logoutSidebarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  // Header Styles
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButton: {
    marginRight: 15,
    padding: 5,
  },
  menuIcon: {
    fontSize: 28,
    color: colors.white,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 24,
    color: '#FFD700',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  sosButton: {
    backgroundColor: '#ef4444',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  sosIcon: {
    fontSize: 24,
  },
  sosText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.gray,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.white,
    margin: 6,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
  },
  actionIconLarge: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTextPrimary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  actionTextSecondary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIcon: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 12,
    color: colors.gray,
  },
});