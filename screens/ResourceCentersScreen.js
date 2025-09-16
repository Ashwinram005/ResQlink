import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, Platform, Linking } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY'; // Replace with your API Key
const BACKEND_URL = 'https://nbw14s66-5000.inc1.devtunnels.ms'; // Replace with your backend API endpoint
const markerImage = require('../assets/reliefcamp.jpg');

export default function ResourceCentersScreen({ navigation }) {
  const [centers, setCenters] = useState([]);
  const [activeTab, setActiveTab] = useState("map");

  // Form State
  const [hubName, setHubName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [areasCovered, setAreasCovered] = useState("");
  const [aidTypes, setAidTypes] = useState({
    Food: false,
    Water: false,
    Medical: false,
    Shelter: false,
    Clothing: false,
  });

  const [selectedCenter, setSelectedCenter] = useState(null);

  // Fetch Relief Hubs from Backend
  const fetchReliefHubs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/reliefhubs`);
      setCenters(response.data);
    } catch (error) {
      console.error("Error fetching relief hubs:", error);
      // Alert.alert("Error", "Failed to fetch relief hubs.");
    }
  };

  useEffect(() => {
    fetchReliefHubs();
  }, []);

  // 🔹 Fetch Coordinates from Address
  const fetchCoordinates = async (address) => {
    if (!address) {
      // Alert.alert("Error", "Please enter an address.");
      return;
    }

    try {
      const response = await axios.get(
       ` https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: { address, key: GOOGLE_MAPS_API_KEY },
        }
      );

      if (response.data.status === "OK") {
        const location = response.data.results[0].geometry.location;
        setLatitude(location.lat.toString());
        setLongitude(location.lng.toString());
      } else {
        console.log("Google Maps API Error:", response.data);
      }
    } catch (error) {
      console.log("Error fetching coordinates:", error);
    }
  };

  const handleAddressChange = (text) => {
    setLocation(text);
    if (text.trim().length > 3) {
      fetchCoordinates(text);
    }
  };

  // 🔹 Register a Relief Center
  const addCenter = async () => {
    if (!hubName || !email || !phone || !location || !areasCovered) {
      Alert.alert("Error", "Please fill all required fields!");
      return;
    }

    try {
      const response = await axios.get(
      `  https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const locationData = response.data.results[0]?.geometry?.location;
      if (!locationData) {
        // Alert.alert("Error", "Invalid address! Please enter a valid location.");
        return;
      }

      setLatitude(locationData.lat.toString());
      setLongitude(locationData.lng.toString());

      const newCenter = {
        id: Date.now().toString(),
        hubName,
        email,
        phone,
        location,
        latitude: locationData.lat,
        longitude: locationData.lng,
        areasCovered,
        aidTypes: Object.keys(aidTypes).filter(type => aidTypes[type]), // Only selected aid types
      };

      // 🔹 Send Data to Backend and Add the Center to the Map
      try {
        const res = await axios.post(`${BACKEND_URL}/api/reliefhub/register`, newCenter);

        if (res.status === 200) {
          // Update the centers state to include the new center
          setCenters((prevCenters) => [...prevCenters, newCenter]);
          setActiveTab("map");

          // Reset Form
          setHubName("");
          setEmail("");
          setPhone("");
          setLocation("");
          setLatitude("");
          setLongitude("");
          setAreasCovered("");
          setAidTypes({ Food: false, Water: false, Medical: false, Shelter: false, Clothing: false });
        } else {
          throw new Error("Failed to register center");
        }
      } catch (error) {
        console.error("Error registering center:", error);
        // Alert.alert("Error", "Failed to register. Please try again.");
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      // Alert.alert("Error", "Failed to find location for this address.");
    }
  };

  // 🔹 Open Directions in Google Maps
  const openDirections = (latitude, longitude) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${latitude},${longitude}`,
      android:` google.navigation:q=${latitude},${longitude}`,
    });

    Linking.openURL(url).catch(err => {
      console.error("Error opening directions:", err);
      // Alert.alert("Error", "Failed to open directions.");
    });
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
            setSelectedCenter(null);
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
  provider={Platform.OS === "android" ? PROVIDER_GOOGLE : null}
  style={styles.map}
  initialRegion={{
    latitude: 11.0168,
    longitude: 76.9558,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  }}
>
  {centers.map((center, index) => {
    const lat = parseFloat(center.latitude);
    const lng = parseFloat(center.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      console.error(`Invalid coordinates for center ${center.id}:`, center.latitude, center.longitude);
      return null; // Skip rendering this marker
    }

    return (
      <Marker
        key={`${center.id}-${index}`}
        coordinate={{ latitude: lat, longitude: lng }}
        onPress={() => setSelectedCenter(center)}
      >
        <Image source={markerImage} style={styles.markerImage} resizeMode="contain" />
      </Marker>
    );
  })}
</MapView>
      ) : (
        <ScrollView style={styles.formContainer}>
          <Text style={styles.headerText}>Register a Relief Center</Text>

          <TextInput style={styles.input} placeholder="Hub Name" value={hubName} onChangeText={setHubName} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={handleAddressChange} />
          
          {/* Read-Only Latitude & Longitude */}
          <TextInput style={styles.input} placeholder="Latitude" value={latitude} editable={false} />
          <TextInput style={styles.input} placeholder="Longitude" value={longitude} editable={false} />

          <TextInput style={styles.input} placeholder="Areas Covered" value={areasCovered} onChangeText={setAreasCovered} />

          {/* ✅ Aid Types Checkboxes */}
          <Text style={styles.label}>Aid Types</Text>
          {Object.keys(aidTypes).map((type) => (
            <TouchableOpacity key={type} onPress={() => setAidTypes({ ...aidTypes, [type]: !aidTypes[type] })} style={styles.checkboxContainer}>
              <Text style={[styles.checkboxText, aidTypes[type] && styles.checked]}>{aidTypes[type] ? "✅" : "⬜"} {type}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.button} onPress={addCenter}>
            <Text style={styles.buttonText}>Register Center</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Center Details Modal */}
      {selectedCenter && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>{selectedCenter.hubName}</Text>
          <Text style={styles.detailsText}>📍 {selectedCenter.location}</Text>
          <Text style={styles.detailsText}>🛠 Resources Available:</Text>
          {selectedCenter.aidTypes.length > 0 ? (
            selectedCenter.aidTypes.map((item, idx) => (
              <Text key={idx} style={styles.detailsResource}>{item}</Text>
            ))
          ) : (
            <Text style={styles.detailsResource}>No resources listed</Text>
          )}

          {/* Get Directions Button */}
          <TouchableOpacity 
            style={styles.button}
            onPress={() => openDirections(selectedCenter.latitude, selectedCenter.longitude)}
          >
            <Text style={styles.buttonText}>Get Directions</Text>
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
  topNav: { flexDirection: "row", backgroundColor: "#F8F9FA", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#DDD" },
  navButton: { flex: 1, alignItems: "center", paddingVertical: 8 },
  navText: { fontSize: 14, color: "#555", fontWeight: "500" },
  activeNav: { borderBottomWidth: 2, borderBottomColor: "#007BFF" },
  activeNavText: { color: "#007BFF", fontWeight: "600" },
  map: { flex: 1 },
  formContainer: { padding: 20, backgroundColor: "#fff" },
  input: { height: 50, borderColor: "#ccc", borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, marginBottom: 12, fontSize: 14 },
  button: { backgroundColor: "#007BFF", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  checkboxText: { fontSize: 16, paddingVertical: 5 },
  checked: { color: "#007BFF" },
  markerImage: {
    width: 42,
    height: 42,
    resizeMode: "contain",
  },
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
  closeButton: {
    marginTop: 12,
    backgroundColor: "#E63946",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: { color: "white", fontWeight: "bold", fontSize: 14 },
});
