import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, PermissionsAndroid, Platform, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const GOOGLE_API_KEY = 'AIzaSyDrGux6OKRJflNu25xsDbAkBES9FsnDXik'; 

export default function SafeLocationsScreen({ navigation }) {
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 📍 Map reference hook create kiya animation ke liye
  const mapRef = useRef(null);

  const [mapRegion, setMapRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getUserCurrentLocation();
        } else {
          Alert.alert("Permission Denied", "Location permission is required.");
          setLoading(false);
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      getUserCurrentLocation();
    }
  };

  const getUserCurrentLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newReg = {
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        };
        setMapRegion(newReg);
        
        // Initial location par map ko animate karo
        mapRef.current?.animateToRegion(newReg, 1000);

        fetchNearbyEmergencyPlaces(latitude, longitude);
      },
      (error) => {
        Alert.alert("Error", "Could not fetch current location.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchNearbyEmergencyPlaces = async (lat, lng) => {
    try {
      const types = ['hospital', 'police'];
      let combinedPlaces = [];

      for (const type of types) {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=3000&type=${type}&key=${GOOGLE_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results) {
          const formatted = data.results.map(place => ({
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            type: type
          }));
          combinedPlaces = [...combinedPlaces, ...formatted];
        }
      }
      setNearbyPlaces(combinedPlaces);
    } catch (error) {
      console.log('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✨ Smoothly Map animate karne aur Google Maps options dene ka function
  const handlePlacePress = (place) => {
    const targetRegion = {
      latitude: place.latitude,
      longitude: place.longitude,
      latitudeDelta: 0.005, // deep zoom
      longitudeDelta: 0.005,
    };

    // 🗺️ Yeh map ko smooth slide karke spot par le jayega
    mapRef.current?.animateToRegion(targetRegion, 1000);

    // Prompt user to open in External Google Maps app for direction/details
    Alert.alert(
      place.name,
      "Would you like to view full details or get directions in Google Maps?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Open Google Maps 🗺️", 
          onPress: () => openInGoogleMapsApp(place.latitude, place.longitude, place.name) 
        }
      ]
    );
  };

  // 🌍 Real Google Maps application wrapper call
  const openInGoogleMapsApp = (lat, lng, label) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Google Maps app open karne me dikkat aa rahi hai.");
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby Emergency Spots</Text>
      </View>

      {/* 🗺️ LIVE MAP WITH REF */}
      <View style={styles.mapContainer}>
        <MapView 
          ref={mapRef} // Attached map ref here
          style={styles.map} 
          initialRegion={mapRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {nearbyPlaces.map((place) => (
            <Marker
              key={place.id}
              coordinate={{ latitude: place.latitude, longitude: place.longitude }}
              title={place.name}
              description={place.address}
              pinColor={place.type === 'hospital' ? 'red' : 'blue'}
              onPress={() => handlePlacePress(place)} // Marker click handler
            />
          ))}
        </MapView>
        
        {loading && (
          <View style={styles.mapLoader}>
            <ActivityIndicator size="large" color="#075E54" />
            <Text style={styles.loaderText}>Fetching Live Location & Safe Spots...</Text>
          </View>
        )}
      </View>

      {/* 📜 LIST VIEW */}
      <View style={styles.listContainer}>
        <Text style={styles.mapLegend}>🔴 Hospitals  |  🔵 Police Stations</Text>
        <Text style={styles.sectionTitle}>Tap any spot below to view on Map & Open Details:</Text>
        
        <ScrollView style={styles.content}>
          {nearbyPlaces.map((place) => (
            <TouchableOpacity 
              key={place.id} 
              style={styles.placeCard}
              onPress={() => handlePlacePress(place)} // List item tap handler
            >
              <View style={styles.iconContainer}>
                <Text style={styles.placeIcon}>{place.type === 'hospital' ? '🏥' : '👮'}</Text>
              </View>
              <View style={styles.placeInfo}>
                <Text style={styles.placeName} numberOfLines={1}>{place.name}</Text>
                <Text style={styles.placeAddress} numberOfLines={1}>{place.address}</Text>
                <Text style={[styles.badge, { backgroundColor: place.type === 'hospital' ? '#ffebee' : '#e3f2fd', color: place.type === 'hospital' ? 'red' : 'blue' }]}>
                  {place.type === 'hospital' ? 'Hospital' : 'Police Station'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {nearbyPlaces.length === 0 && !loading && (
            <Text style={styles.emptyText}>No emergency spots found in 3KM radius.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#075E54' },
  backButton: { color: '#fff', fontSize: 18, marginRight: 15 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  mapContainer: { height: '45%', width: '100%' },
  map: { ...StyleSheet.absoluteFillObject },
  mapLoader: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.8)', justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 10, fontSize: 14, fontWeight: 'bold', color: '#333' },
  listContainer: { flex: 1, padding: 15 },
  mapLegend: { textAlign: 'center', fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#444' },
  sectionTitle: { fontSize: 13, color: '#666', marginBottom: 8, fontStyle: 'italic' },
  content: { flex: 1 },
  placeCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10, elevation: 2, alignItems: 'center' },
  iconContainer: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  placeIcon: { fontSize: 22 },
  placeInfo: { flex: 1 },
  placeName: { fontSize: 15, fontWeight: 'bold', color: '#000' },
  placeAddress: { fontSize: 12, color: '#666', marginTop: 2, marginBottom: 4 },
  badge: { fontSize: 10, fontWeight: 'bold', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#999' }
});