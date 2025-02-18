import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import { Linking } from 'react-native';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCyZYuKJc4YREy3ppZxlnODX_HL7sJlAbk'; // 🔹 Replace with your API Key
const markerImage = require('../assets/reliefcamp.jpg'); // 🔹 Load custom marker image

export default function ResourceCentersScreen({ navigation }) {
  const [centers, setCenters] = useState([]);
  const [activeTab, setActiveTab] = useState("map"); // 'map' or 'register'
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [resources, setResources] = useState("");
  const [selectedCenter, setSelectedCenter] = useState(null); // 🔹 Store clicked marker details

  // 🔹 Convert Address to Coordinates & Register Center
  
  const addCenter = async () => {
    if (!name || !address || !resources) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const location = response.data.results[0]?.geometry?.location;

      if (!location) {
        Alert.alert("Error", "Invalid address! Please enter a valid location.");
        return;
      }

      const newCenter = {
        id: Date.now().toString(),
        name: name.trim(),  // 🔹 Ensure it's a string
        address: address.trim(),
        latitude: location.lat,
        longitude: location.lng,
        resources: resources ? resources.split(",").map((item) => item.trim()) : [],
      };

      setCenters((prevCenters) => [...prevCenters, newCenter]);
      setActiveTab("map"); // Switch back to map view
      setName("");
      setAddress("");
      setResources("");
    } catch (error) {
      console.error("Geocoding Error:", error);
      Alert.alert("Error", "Failed to fetch location. Check the address.");
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔝 Top Navigation Tabs */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>⬅ Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("map")} style={[styles.navButton, activeTab === "map" && styles.activeNav]}>
          <Text style={[styles.navText, activeTab === "map" && styles.activeNavText]}>📍 View Centers</Text>
        </TouchableOpacity>
        <TouchableOpacity 
  onPress={() => { 
    setActiveTab("register"); 
    setSelectedCenter(null); // 🔹 Close details box when switching tabs
  }} 
  style={[styles.navButton, activeTab === "register" && styles.activeNav]}
>
  <Text style={[styles.navText, activeTab === "register" && styles.activeNavText]}>
    ➕ Register Center
  </Text>
</TouchableOpacity>

      </View>

      {/* 🔄 Map or Register Form */}
      {activeTab === "map" ? (
        <MapView
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : null} // ✅ Fix for Android
          style={styles.map}
          initialRegion={{
            latitude: 11.0168, 
            longitude: 76.9558,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
        >
          {centers.map((center, index) => (
            <Marker
              key={`${center.id}-${index}`}
              coordinate={{ latitude: center.latitude, longitude: center.longitude }}
              onPress={() => setSelectedCenter(center)} // 🔹 Store clicked marker details
            >
              <Image source={markerImage} style={styles.markerImage} />
            </Marker>
          ))}
        </MapView>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.headerText}>Register a Relief Center</Text>
          <TextInput style={styles.input} placeholder="Relief Center Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
          <TextInput 
            style={styles.input} 
            placeholder="Available Resources (comma-separated)" 
            value={resources} 
            onChangeText={setResources} 
          />
          <TouchableOpacity style={styles.button} onPress={addCenter}>
            <Text style={styles.buttonText}>Register Center</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 📌 Bottom Info Box for Selected Marker */}
      {selectedCenter && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>{selectedCenter.name}</Text>
          <Text style={styles.detailsText}>📍 {selectedCenter.address}</Text>
          <Text style={styles.detailsText}>🛠 Resources Available:</Text>
          {selectedCenter.resources.length > 0 ? (
            selectedCenter.resources.map((item, idx) => (
              <Text key={idx} style={styles.detailsResource}>{`\t\t`}{item}</Text>
            ))
          ) : (
            <Text style={styles.detailsResource}>No resources listed</Text>
          )}
          <TouchableOpacity 
  style={styles.navigateButton} 
  onPress={() => {
    const { latitude, longitude } = selectedCenter;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  }}
>
  <Text style={styles.navigateButtonText}>🧭 Get Directions</Text>
</TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedCenter(null)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4" },
  topNav: { 
  flexDirection: "row", 
  backgroundColor: "#F8F9FA", // Light gray for a softer look 
  paddingVertical: 6,  // Further reduced padding
  borderBottomWidth: 1, 
  borderBottomColor: "#DDD", // Softer separator color
  alignItems: "center",
  },

  navButton: { 
  flex: 1, 
  alignItems: "center",
  paddingVertical: 6,
  },

  navText: { 
  fontSize: 13,
  color: "#555", 
  fontWeight: "500",
  fontFamily: "sans-serif",
  },

  activeNav: { 
  borderBottomWidth: 2, 
  borderBottomColor: "#007BFF", 
  },

  activeNavText: { 
  color: "#007BFF", 
  fontWeight: "600", 
  },



  /* 🌍 Map */
  map: { flex: 1 },

  /* 📌 Marker Image */
  markerImage: {
    width: 42,
    height: 42,
    resizeMode: "contain",
  },

  /* 📌 Relief Center Info */
  detailsContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  detailsTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#222" },
  detailsText: { fontSize: 14, marginBottom: 6, color: "#444" },
  detailsResource: { fontSize: 14, marginLeft: 10, color: "#007BFF" },

  /* ⛔ Close Button */
  closeButton: {
    marginTop: 12,
    backgroundColor: "#E63946",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: { color: "white", fontWeight: "bold", fontSize: 14 },

  /* 📝 Form Styles */
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  headerText: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#222", textAlign: "center" },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
    fontSize: 14,
    color: "#333",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  navigateButton: {
  marginTop: 10,
  backgroundColor: "#34A853", // Google Maps Green
  paddingVertical: 10,
  borderRadius: 8,
  alignItems: "center",
},

navigateButtonText: {
  color: "white",
  fontWeight: "bold",
  fontSize: 14,
},
});