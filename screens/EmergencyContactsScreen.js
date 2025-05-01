import React from "react";
import { 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  View, 
  ScrollView, 
  Linking, 
  Pressable 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const emergencyContacts = {
  "General Emergency Number": "112",
  "Police": "100",
  "Fire": "101",
  "Ambulance": "102",
  "Disaster Management Services": "108",
  "NDRF (Floods, Earthquakes, Landslides, Cyclones)": "011-24363260",
  "IMD (Cyclone & Weather Alerts)": "1800-180-1717",
  "Landslide Disaster Helpline": "011-23093563",
  "Road Accident Emergency (National Highways)": "1033",
  "Forest Fire & Wildlife Emergency": "1926",
  "Flood Helpline": "1070",
  "Coast Guard (Marine Emergencies)": "1554",
  "Civil Defense Helpline": "011-23092885",
  "Air Ambulance Services": "+91-124-4983412",
  "Farmer’s Helpline (Natural Disaster Assistance)": "1800-180-1551",
};

export default function EmergencyContactsScreen() {
  const navigation = useNavigation();

  const makeCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Emergency Contacts</Text>
        <Text style={styles.subHeaderText}>
          Quickly access important services in times of crisis.
        </Text>
      </View>

      {/* Emergency Contacts List */}
      <View style={styles.mainContent}>
        {Object.entries(emergencyContacts).map(([service, number], index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{service}</Text>
            <Pressable 
              onPress={() => makeCall(number)} 
              style={({ pressed }) => [styles.cardButton, pressed && styles.cardButtonPressed]}
            >
              <Text style={styles.cardText}>{number}</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F9F9F9", // Light clean background
      padding: 16,
    },
    backButton: {
      backgroundColor: "#D32F2F", // Emergency Red
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignSelf: "flex-start",
      marginBottom: 16,
    },
    backButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    header: {
      alignItems: "center",
      marginBottom: 20,
    },
    headerText: {
      fontSize: 26,
      fontWeight: "bold",
      color: "#D32F2F", // Emergency Red
      marginBottom: 4,
    },
    subHeaderText: {
      fontSize: 14,
      color: "#555",
      textAlign: "center",
      maxWidth: "90%",
    },
    mainContent: {
      marginTop: 10,
      paddingBottom: 20, // ✅ Fix for last card cutoff
    },
    card: {
      backgroundColor: "#FFFFFF",
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: "#FFC107", // Alert Yellow Border
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3, // Android shadow
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 6,
    },
    cardButton: {
      backgroundColor: "#1976D2", // Trustworthy Blue
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      alignSelf: "flex-start",
      marginTop: 6,
    },
    cardButtonPressed: {
      backgroundColor: "#B71C1C", // Darker Red on Press
    },
    cardText: {
      fontSize: 16,
      color: "white",
      fontWeight: "bold",
    },
  });
  