import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Platform,
  PermissionsAndroid,
  Animated,
} from 'react-native';
import colors from '../styles/colors';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../api/authApi';
import { getProfile } from '../api/profileApi'; 
import { useIsFocused } from '@react-navigation/native'; 
import Geolocation from '@react-native-community/geolocation';

import { useLanguage } from './../context/LanguageContext'; 

import { playSiren, stopSiren } from '../utils/siren'; 

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function DashboardScreen({ navigation }) {
  const { text } = useLanguage(); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userInitial, setUserInitial] = useState('U'); 
  const [sirenActive, setSirenActive] = useState(false); 

  const isSirenOn = useRef(false);
  const isFocused = useIsFocused(); 
  
  // Animated Values for Glow and Button Scale Effect
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const buttonScaleAnimation = useRef(new Animated.Value(1)).current;

  // Fetch Profile Name on load and focus
  useEffect(() => {
    if (isFocused) {
      loadUserProfile();
    }
  }, [isFocused]);

  // Handle Red Glow Pulsing & Button Pop-In Pop-Out Animation
  useEffect(() => {
    if (sirenActive) {
      // 1. Overlay Border Glow Animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          })
        ])
      ).start();

      // 2. SOS Button Pop-In/Pop-Out (Scale) Animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonScaleAnimation, {
            toValue: 1.08, 
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(buttonScaleAnimation, {
            toValue: 0.95, 
            duration: 600,
            useNativeDriver: true,
          })
        ])
      ).start();

    } else {
      glowAnimation.setValue(0); 
      Animated.spring(buttonScaleAnimation, {
        toValue: 1, 
        useNativeDriver: true,
      }).start();
    }
  }, [sirenActive]);

  // Screen unmount cleanup
  useEffect(() => {
    return () => {
      if (isSirenOn.current) {
        stopSiren();
        isSirenOn.current = false;
        setSirenActive(false);
      }
    };
  }, []);

  const loadUserProfile = async () => {
    try {
      const data = await getProfile();
      if (data && data.fullName) {
        const nameParts = data.fullName.trim().split(/\s+/);
        let initials = '';
        if (nameParts.length > 0) {
          initials += nameParts[0].charAt(0).toUpperCase();
          if (nameParts.length > 1) {
            initials += nameParts[nameParts.length - 1].charAt(0).toUpperCase();
          }
        }
        setUserInitial(initials || 'U');
      }
    } catch (err) {
      console.log("Failed to load profile in dashboard:", err);
    }
  };

  // Android Location Permission Request
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "SOS Emergency me aapki live location contacts ko notification me bhejne ke liye permission chahiye.",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };
  
  const handleLogout = () => {
    Alert.alert(
      text.logout || "Logout",
      text.logoutConfirm || "Are you sure you want to logout?",
      [
        { text: text.cancel || "Cancel", style: "cancel" },
        {
          text: text.logout || "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              await GoogleSignin.signOut();
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

  const handleSOSAlert = async () => {
    if (isSirenOn.current) {
      stopSiren();
      isSirenOn.current = false;
      setSirenActive(false); 
      console.log("🔇 Siren OFF via SOS Button");
      Alert.alert(text.sirenStoppedTitle || 'Siren Stopped', text.sirenStoppedMsg || 'Emergency siren has been turned off.');
    } else {
      playSiren();
      isSirenOn.current = true;
      setSirenActive(true); 
      console.log("🚨 Siren ON via SOS Button");

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(text.permDeniedTitle || "Permission Denied", text.permDeniedMsg || "Location permission ke bina emergency notification nahi bhej sakte.");
        return;
      }

      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
          console.log("📍 Location fetched successfully for SOS:", mapsLink);

          try {
            const profile = await getProfile();
            const currentContacts = profile?.emergencyContacts || [];

            const sosPayload = {
              emergencyId: `SOS-${Date.now()}`,
              fileName: "emergency_audio.mp3",
              fileType: "audio",
              aesKey: "SAHAYAAK-SECURE-KEY",
              contacts: currentContacts,
              locationLink: mapsLink 
            };

            console.log("🚀 Sending SOS Alert Payload to Backend...");

            const response = await fetch('http://10.205.27.41:3000/emergency/alert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(sosPayload),
            });

            const resData = await response.json();
            console.log("✅ Backend Network Response:", resData);

            Alert.alert(
              text.sosActivatedTitle || 'SOS ALERT ACTIVATED',
              text.sosActivatedMsg || 'Siren started and alert with your live location has been sent to all emergency contacts!',
              [
                { text: text.keepSirenPlaying || 'Keep Siren Playing', style: 'default' },
                { 
                  text: text.stopSiren || 'Stop Siren', 
                  style: 'destructive', 
                  onPress: () => {
                    stopSiren();
                    isSirenOn.current = false;
                    setSirenActive(false); 
                  } 
                },
              ]
            );
          } catch (apiErr) {
            console.log("❌ Network Request Error. Failed to send alert data:", apiErr);
            Alert.alert(text.networkErrorTitle || "Error", text.networkErrorMsg || "Backend server se connect nahi ho paya.");
          }
        },
        (error) => {
          console.log("Error getting location: ", error);
          Alert.alert(text.locationErrorTitle || "Location Error", text.locationErrorMsg || "Live location trace nahi ho payi.");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  };

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const closeSidebar = () => setSidebarVisible(false);
  const navigateTo = (screen) => {
    closeSidebar();
    navigation.navigate(screen);
  };

  const recentActivities = [
    { id: 1, activity: text.activityAudio || 'Emergency recording saved', time: text.timeToday || 'Today', icon: '🎤' },
    { id: 3, activity: text.activityVideo || 'Video evidence uploaded', time: text.timeDaysAgo || '2 days ago', icon: '📹' },
  ];

  return (
    <View style={styles.container}>
      
      {/* RED GLOW OVERLAY VIEW */}
      {sirenActive && (
        <Animated.View 
          pointerEvents="none" 
          style={[styles.glowOverlay, { opacity: glowAnimation }]} 
        />
      )}

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
                <Text style={styles.sidebarSubtitle}>{text.menu || "Menu"}</Text>
              </View>
              <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.sidebarContent}>
              <TouchableOpacity style={[styles.sidebarItem, styles.sidebarItemActive]} onPress={() => closeSidebar()}>
                <Text style={styles.sidebarItemIcon}>🏠</Text>
                <Text style={styles.sidebarItemTextActive}>{text.dashboard || "Dashboard"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sidebarItem} onPress={() => { closeSidebar(); navigation.navigate('UserProfile', { isEditMode: true }); }}>
                <Text style={styles.sidebarItemIcon}>👤</Text>
                <Text style={styles.sidebarItemText}>{text.myProfile || "My Profile"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sidebarItem} onPress={() => navigateTo('HowToUse')}>
                <Text style={styles.sidebarItemIcon}>❓</Text>
                <Text style={styles.sidebarItemText}>{text.howToUse || "How to Use"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sidebarItem} onPress={() => navigateTo('RecordingsList')}>
                <Text style={styles.sidebarItemIcon}>🎬</Text>
                <Text style={styles.sidebarItemText}>{text.recordings || "Recordings"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sidebarItem} onPress={() => navigateTo('EmergencyContacts')}>
                <Text style={styles.sidebarItemIcon}>📞</Text>
                <Text style={styles.sidebarItemText}>{text.emergencyContacts || "Emergency Contacts"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sidebarItem} onPress={() => navigateTo('SafeLocations')}>
                <Text style={styles.sidebarItemIcon}>📍</Text>
                <Text style={styles.sidebarItemText}>{text.safeLocations || "Safe Locations"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sidebarItem} onPress={() => navigateTo('Settings')}>
                <Text style={styles.sidebarItemIcon}>⚙️</Text>
                <Text style={styles.sidebarItemText}>{text.settings || "Settings"}</Text>
              </TouchableOpacity>
              <View style={styles.sidebarDivider} />
              <TouchableOpacity style={[styles.sidebarItem, styles.logoutSidebarItem]} onPress={() => { closeSidebar(); handleLogout(); }}>
                <Text style={styles.sidebarItemIcon}>🚪</Text>
                <Text style={styles.sidebarItemText}>{text.logout || "Logout"}</Text>               
              </TouchableOpacity>
            </ScrollView>
          </View>
          <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={closeSidebar}/>
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
          <TouchableOpacity style={styles.userAvatar} onPress={() => navigation.navigate('UserProfile', { isEditMode: true })}>
            <Text style={styles.userAvatarText}>{userInitial}</Text> 
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* ANIMATED SOS ALERT BUTTON */}
        <AnimatedTouchableOpacity 
          style={[
            styles.sosButton, 
            sirenActive && styles.sosButtonActive,
            { transform: [{ scale: buttonScaleAnimation }] }
          ]} 
          onPress={handleSOSAlert}
          activeOpacity={0.8}
        >
          <Text style={styles.sosIcon}>🚨</Text>
          <Text style={styles.sosText}>
            {sirenActive ? (text.stopSirenAlert || 'STOP SIREN / ALERT') : (text.emergencySosAlert || 'EMERGENCY SOS ALERT')}
          </Text>
        </AnimatedTouchableOpacity>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>{text.welcome || "Welcome back, Stay Safe!"}</Text>
          <Text style={styles.welcomeSubtitle}>{text.welcomeSubtitle || "Your safety dashboard overview"}</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={text.searchPlaceholder || "Search recordings, videos..."}
            placeholderTextColor={colors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{text.quickActions || "Quick Actions"}</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]} onPress={() => navigation.navigate('AudioRecording')}>
              <Text style={styles.actionIconLarge}>🎤</Text>
              <Text style={styles.actionTextPrimary}>{text.newAudio || "New Audio Recording"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('VideoRecording')}>
              <Text style={styles.actionIconLarge}>📹</Text>
              <Text style={styles.actionTextSecondary}>{text.newVideo || "New Video Recording"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('EmergencyContacts')}>
              <Text style={styles.actionIconLarge}>👥</Text>
              <Text style={styles.actionTextSecondary}>{text.addContact || "Add Contact"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('SafeLocations')}>
              <Text style={styles.actionIconLarge}>📍</Text>
              <Text style={styles.actionTextSecondary}>{text.safeLocation || "Safe Location"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{text.recentActivity || "Recent Activity"}</Text>
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
  container: { flex: 1, backgroundColor: colors.background },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 15,          
    borderColor: '#ef4444',   
    zIndex: 9999,              
    backgroundColor: 'rgba(239, 68, 68, 0.15)', 
  },
  modalOverlay: { flex: 1, flexDirection: 'row' },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  sidebar: { width: 280, backgroundColor: colors.white, height: '100%', elevation: 10 },
  sidebarHeader: { padding: 20, paddingTop: 50, backgroundColor: colors.primary, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sidebarTitle: { fontSize: 24, fontWeight: 'bold', color: colors.white },
  sidebarSubtitle: { fontSize: 14, color: colors.white, opacity: 0.9 },
  closeButton: { padding: 5 },
  closeButtonText: { fontSize: 28, color: colors.white, fontWeight: 'bold' },
  sidebarContent: { flex: 1, padding: 10, paddingBottom: 20 },
  sidebarItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 5 },
  sidebarItemActive: { backgroundColor: colors.primary },
  sidebarItemIcon: { fontSize: 24, marginRight: 15 },
  sidebarItemText: { fontSize: 16, fontWeight: '600', color: colors.primary },
  sidebarItemTextActive: { fontSize: 16, fontWeight: 'bold', color: colors.white },
  sidebarDivider: { height: 1, backgroundColor: colors.gray, marginVertical: 15 },
  logoutSidebarItem: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  header: { backgroundColor: colors.primary, padding: 20, paddingTop: 50, flexDirection: 'row', alignItems: 'center', elevation: 3 },
  menuButton: { marginRight: 15, padding: 5 },
  menuIcon: { fontSize: 28, color: colors.white, fontWeight: 'bold' },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.white },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  notificationButton: { position: 'relative' },
  notificationIcon: { fontSize: 24, color: '#FFD700' },
  notificationBadge: { position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' },
  userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' },
  userAvatarText: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  scrollView: { flex: 1 },
  sosButton: { 
    backgroundColor: '#ef4444', 
    margin: 20, 
    padding: 20, 
    borderRadius: 10, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10, 
    elevation: 8,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  sosButtonActive: {
    backgroundColor: '#dc2626', 
    elevation: 15,
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  sosIcon: { fontSize: 24 },
  sosText: { fontSize: 18, fontWeight: 'bold', color: colors.white },
  welcomeSection: { paddingHorizontal: 20, marginBottom: 20 },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: colors.primary, marginBottom: 5 },
  welcomeSubtitle: { fontSize: 14, color: colors.gray },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, marginHorizontal: 20, marginBottom: 20, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.gray },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: colors.primary },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.primary, marginBottom: 15 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionButton: { width: '48%', backgroundColor: colors.white, padding: 20, borderRadius: 8, alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: colors.primary },
  actionButtonPrimary: { backgroundColor: colors.primary },
  actionIconLarge: { fontSize: 32, marginBottom: 8 },
  actionTextPrimary: { fontSize: 14, fontWeight: 'bold', color: colors.white, textAlign: 'center' },
  actionTextSecondary: { fontSize: 14, fontWeight: 'bold', color: colors.primary, textAlign: 'center' },
  activityCard: { backgroundColor: colors.white, padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 15, borderWidth: 1, borderColor: colors.gray },
  activityIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center' },
  activityIcon: { fontSize: 20 },
  activityContent: { flex: 1 },
  activityText: { fontSize: 14, fontWeight: '600', color: colors.primary, marginBottom: 3 },
  activityTime: { fontSize: 12, color: colors.gray },
});