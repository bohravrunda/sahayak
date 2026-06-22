




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
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Emergency Contacts</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* STATUS */}
      <View
        style={[
          styles.statusBox,
          { backgroundColor: isEmergency ? "#E8F5E9" : "#FFEBEE" }
        ]}
      >
        <Text
          style={{
            color: isEmergency ? "#2E7D32" : "#C62828",
            fontWeight: "700",
          }}
        >
          {isEmergency
            ? `🚨 Emergency Active (${emergencyType === 'audio' ? 'Audio Stream' : 'Video/Image Stream'})`
            : "⚠️ No Active Emergency"
          }
        </Text>
      </View>

      {/* BODY */}
      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#1B5E20" />
        ) : contacts.length === 0 ? (
          <Text style={styles.emptyText}>No emergency contacts found</Text>
        ) : (
          contacts.map((contact, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.name}>{contact.name}</Text>
              <Text style={styles.relation}>{contact.relationship || "—"}</Text>
              <Text style={styles.phone}>{contact.phone}</Text>

              <TouchableOpacity
                style={[
                  styles.whatsappBtn,
                  !isEmergency && styles.disabledBtn,
                  isEmergency && emergencyType === 'audio' && styles.audioAlertBtn
                ]}
                disabled={!isEmergency}
                onPress={() => handleWhatsApp(contact)}
              >
                <Text style={styles.btnText}>
                  {isEmergency && emergencyType === 'audio' 
                    ? "Send Audio Alert + Location" 
                    : "Send Alert + Location"
                  }
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: "#fff", elevation: 3 },
  back: { fontSize: 22, color: "#333" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#222" },
  statusBox: { margin: 16, padding: 12, borderRadius: 12, alignItems: "center" },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 14, elevation: 2 },
  name: { fontSize: 17, fontWeight: "700", color: "#1C1C1E" },
  relation: { fontSize: 14, color: "#777", marginTop: 2 },
  phone: { fontSize: 15, color: "#444", marginTop: 6 },
  whatsappBtn: { marginTop: 12, backgroundColor: "#1B5E20", padding: 12, borderRadius: 10, alignItems: "center" },
  audioAlertBtn: { backgroundColor: "#6C63FF" },
  disabledBtn: { backgroundColor: "#9E9E9E" },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#777", fontSize: 16 },
});