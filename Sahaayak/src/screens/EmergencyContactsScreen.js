




// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";

// import { getProfile } from "../api/profileApi";
// import { openWhatsApp } from "../utils/openWhatsApp";
// import { getEmergencyData } from "../store/EmergencyStore";

// export default function EmergencyContactsScreen({ navigation }) {

//   const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // States to monitor layout triggers
//   const [isEmergency, setIsEmergency] = useState(false);
//   const [aesKey, setAesKey] = useState('');
//   const [emergencyId, setEmergencyId] = useState('');
  
//   // Flag to remember what medium triggered the data state map
//   const [emergencyType, setEmergencyType] = useState(''); 

//   useEffect(() => {

//     // Fetching state payload details from store
//     const emergency = getEmergencyData();

//     // Check availability rules for both or either systems setup globally 
//     const currentId = emergency.emergencyId || '';
//     const currentKey = emergency.aesKey || '';
//     const typeOfSource = emergency.fileType || (currentId ? 'media' : '');

//     setEmergencyId(currentId);
//     setAesKey(currentKey);
//     setEmergencyType(typeOfSource);

//     // If any media validation exists, system triggers alert permissions globally
//     setIsEmergency(!!currentId && !!currentKey);

//     const loadContacts = async () => {
//       try {
//         const profile = await getProfile();
//         setContacts(profile?.emergencyContacts || []);
//       } catch (err) {
//         console.log("PROFILE ERROR:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadContacts();

//   }, []);

//   const handleWhatsApp = (contact) => {

//     if (!isEmergency) {
//       return;
//     }

//     // Dynamic messaging interface layout parameter injection
//     // openWhatsApp handles route context processing based on valid active payload parameters
//     openWhatsApp(
//       contact.phone,
//       emergencyId,
//       aesKey
//     );
//   };

//   return (
//     <View style={styles.container}>

//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.back}>←</Text>
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>
//           Emergency Contacts
//         </Text>
//         <View style={{ width: 30 }} />
//       </View>

//       {/* STATUS */}
//       <View
//         style={[
//           styles.statusBox,
//           {
//             backgroundColor: isEmergency
//               ? "#E8F5E9"
//               : "#FFEBEE"
//           }
//         ]}
//       >
//         <Text
//           style={{
//             color: isEmergency
//               ? "#2E7D32"
//               : "#C62828",
//             fontWeight: "700",
//           }}
//         >
//           {
//             isEmergency
//               ? `🚨 Emergency Active (${emergencyType === 'audio' ? 'Audio Stream' : 'Video/Image Stream'})`
//               : "⚠️ No Active Emergency"
//           }
//         </Text>
//       </View>

//       {/* BODY */}
//       <ScrollView
//         contentContainerStyle={{ padding: 16 }}
//         showsVerticalScrollIndicator={false}
//       >

//         {
//           loading ? (
//             <ActivityIndicator
//               size="large"
//               color="#1B5E20"
//             />
//           ) : contacts.length === 0 ? (
//             <Text style={styles.emptyText}>
//               No emergency contacts found
//             </Text>
//           ) : (
//             contacts.map((contact, index) => (
//               <View
//                 key={index}
//                 style={styles.card}
//               >
//                 {/* NAME */}
//                 <Text style={styles.name}>
//                   {contact.name}
//                 </Text>

//                 {/* RELATION */}
//                 <Text style={styles.relation}>
//                   {contact.relationship || "—"}
//                 </Text>

//                 {/* PHONE */}
//                 <Text style={styles.phone}>
//                   {contact.phone}
//                 </Text>

//                 {/* BUTTON */}
//                 <TouchableOpacity
//                   style={[
//                     styles.whatsappBtn,
//                     !isEmergency && styles.disabledBtn,
//                     isEmergency && emergencyType === 'audio' && styles.audioAlertBtn
//                   ]}
//                   disabled={!isEmergency}
//                   onPress={() => handleWhatsApp(contact)}
//                 >
//                   <Text style={styles.btnText}>
//                     {isEmergency && emergencyType === 'audio' 
//                       ? "Send Audio Alert via WhatsApp" 
//                       : "Send Alert via WhatsApp"
//                     }
//                   </Text>
//                 </TouchableOpacity>

//               </View>
//             ))
//           )
//         }

//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F4F6F8",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 16,
//     backgroundColor: "#fff",
//     elevation: 3,
//   },
//   back: {
//     fontSize: 22,
//     color: "#333",
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#222",
//   },
//   statusBox: {
//     margin: 16,
//     padding: 12,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 14,
//     elevation: 2,
//   },
//   name: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: "#1C1C1E",
//   },
//   relation: {
//     fontSize: 14,
//     color: "#777",
//     marginTop: 2,
//   },
//   phone: {
//     fontSize: 15,
//     color: "#444",
//     marginTop: 6,
//   },
//   whatsappBtn: {
//     marginTop: 12,
//     backgroundColor: "#1B5E20",
//     padding: 12,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   audioAlertBtn: {
//     backgroundColor: "#6C63FF", // Matches Sahayak AI Monitoring purple theme if audio triggers
//   },
//   disabledBtn: {
//     backgroundColor: "#9E9E9E",
//   },
//   btnText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 15,
//   },
//   emptyText: {
//     textAlign: "center",
//     marginTop: 50,
//     color: "#777",
//     fontSize: 16,
//   },
// });





import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  SafeAreaView,
  StatusBar,
} from "react-native";

import Geolocation from '@react-native-community/geolocation';

import { getProfile } from "../api/profileApi";
import { openWhatsApp } from "../utils/openWhatsApp";
import { getEmergencyData } from "../store/EmergencyStore";

export default function EmergencyContactsScreen({ navigation }) {

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States to monitor layout triggers
  const [isEmergency, setIsEmergency] = useState(false);
  const [aesKey, setAesKey] = useState('');
  const [emergencyId, setEmergencyId] = useState('');
  
  // Flag to remember what medium triggered the data state map
  const [emergencyType, setEmergencyType] = useState(''); 

  useEffect(() => {
    // Fetching state payload details from store
    const emergency = getEmergencyData();

    // Check availability rules for both or either systems setup globally 
    const currentId = emergency.emergencyId || '';
    const currentKey = emergency.aesKey || '';
    const typeOfSource = emergency.fileType || (currentId ? 'media' : '');

    setEmergencyId(currentId);
    setAesKey(currentKey);
    setEmergencyType(typeOfSource);

    // If any media validation exists, system triggers alert permissions globally
    setIsEmergency(!!currentId && !!currentKey);

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
    requestLocationPermission(); 
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Emergency में आपकी लोकेशन शेयर करने के लिए इसकी ज़रूरत है।",
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

  const handleWhatsApp = async (contact) => {
    if (!isEmergency) {
      return;
    }

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "लोकेशन परमिशन के बिना हम आपकी लोकेशन नहीं भेज सकते।");
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        
        console.log("📍 Location fetched successfully:", mapsLink);

        openWhatsApp(
          contact.phone,
          emergencyId,
          aesKey,
          emergencyType, // 4th Parameter (fileType)
          mapsLink       // 5th Parameter (mapsLink)
        );
      },
      (error) => {
        console.log("Error getting location: ", error);
        openWhatsApp(
          contact.phone, 
          emergencyId, 
          aesKey, 
          emergencyType, 
          "Location not available"
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* STATUS BADGE */}
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusBox,
            { 
              backgroundColor: isEmergency ? "#FDF2F2" : "#F3F4F6",
              borderColor: isEmergency ? "#FDE8E8" : "#E5E7EB"
            }
          ]}
        >
          <View style={[styles.pulseDot, { backgroundColor: isEmergency ? "#DC2626" : "#9CA3AF" }]} />
          <Text
            style={[
              styles.statusText,
              { color: isEmergency ? "#991B1B" : "#4B5563" }
            ]}
          >
            {isEmergency
              ? `Emergency Active (${emergencyType === 'audio' ? 'Audio Stream' : 'Video/Image Stream'})`
              : "No Active Emergency"
            }
          </Text>
        </View>
      </View>

      {/* BODY */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#000000" />
          </View>
        ) : contacts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>No emergency contacts found</Text>
            <Text style={styles.emptySubText}>Add contacts from your profile setup to alert them during a crisis.</Text>
          </View>
        ) : (
          contacts.map((contact, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{contact.name?.charAt(0).toUpperCase() || "E"}</Text>
              </View>
              
              <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                  <Text style={styles.name} numberOfLines={1}>{contact.name}</Text>
                  {contact.relationship && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{contact.relationship}</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.phone}>{contact.phone}</Text>

                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    !isEmergency && styles.disabledBtn,
                    isEmergency && emergencyType === 'audio' && styles.audioAlertBtn
                  ]}
                  activeOpacity={0.8}
                  disabled={!isEmergency}
                  onPress={() => handleWhatsApp(contact)}
                >
                  <Text style={styles.btnText}>
                    {isEmergency && emergencyType === 'audio' 
                      ? "Send Audio Alert + Location" 
                      : "Send Alert & Location"
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FAFAFA" 
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: 16, 
    paddingVertical: 14,
    backgroundColor: "#FFFFFF", 
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  backArrow: { 
    fontSize: 20, 
    color: "#111827",
    fontWeight: "600"
  },
  headerTitle: { 
    fontSize: 17, 
    fontWeight: "600", 
    color: "#111827",
    letterSpacing: -0.3
  },
  statusContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  statusBox: { 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10, 
    paddingHorizontal: 16,
    borderRadius: 99, 
    borderWidth: 1,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.1
  },
  loaderContainer: {
    marginTop: 60,
    alignItems: "center"
  },
  card: { 
    flexDirection: "row",
    backgroundColor: "#FFFFFF", 
    padding: 16, 
    borderRadius: 20, 
    marginTop: 14, 
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563"
  },
  cardContent: {
    flex: 1,
    justifyContent: "center"
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  name: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#111827",
    flex: 1,
    marginRight: 8
  },
  badge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#2563EB",
    textTransform: "capitalize"
  },
  phone: { 
    fontSize: 14, 
    color: "#6B7280", 
    marginBottom: 14 
  },
  actionBtn: { 
    backgroundColor: "#10B981", 
    paddingVertical: 12, 
    borderRadius: 12, 
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  audioAlertBtn: { 
    backgroundColor: "#6366F1",
    shadowColor: "#6366F1",
  },
  disabledBtn: { 
    backgroundColor: "#E5E7EB",
    shadowOpacity: 0,
    elevation: 0
  },
  btnText: { 
    color: "#FFFFFF", 
    fontWeight: "600", 
    fontSize: 14 
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  emptyText: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#111827",
    textAlign: "center", 
    marginBottom: 6
  },
  emptySubText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 18
  }
});