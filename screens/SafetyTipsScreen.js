import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons"; // Replaced Expo Icons

const safetyTips = [
  { id: "1", tip: "Stay calm and check your surroundings for immediate dangers." },
  { id: "2", tip: "Always have an emergency kit with essential supplies ready." },
  { id: "3", tip: "Keep emergency contacts saved in your phone and written down." },
  { id: "4", tip: "Follow official alerts and updates for accurate information." },
  { id: "5", tip: "Move to higher ground during floods and avoid crossing water." },
];

export default function SafetyTipsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safety Tips</Text>

      <FlatList
        data={safetyTips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>• {item.tip}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={20} color="#fff" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E293B",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FACC15",
    marginBottom: 15,
    textAlign: "center",
  },
  tipCard: {
    backgroundColor: "#334155",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  tipText: {
    fontSize: 16,
    color: "#E2E8F0",
    textAlign: "left",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
});
