import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

// Import Screens
import EmergencyAlertsScreen from "./EmergencyAlertsScreen";
import SafetyTipsScreen from "./SafetyTipsScreen";
import ResourceCentersScreen from "./ResourceCentersScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="EmergencyAlerts" component={EmergencyAlertsScreen} />
      <Stack.Screen name="SafetyTips" component={SafetyTipsScreen} />
      <Stack.Screen name="ResourceCenters" component={ResourceCentersScreen} />
    </Stack.Navigator>
  );
}

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("EmergencyAlerts")}>
        <Text style={styles.menuText}>Emergency Alerts</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("SafetyTips")}>
        <Text style={styles.menuText}>Safety Tips</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("ResourceCenters")}>
        <Text style={styles.menuText}>Resource Centers</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1E293B" },
  menuButton: { backgroundColor: "#3B82F6", padding: 15, marginBottom: 10, borderRadius: 8, width: "80%", alignItems: "center" },
  menuText: { color: "#fff", fontSize: 18, fontWeight: "bold" }
});
