import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SafetyTipsScreen() {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safety Tips</Text>
      <Text style={styles.content}>Important safety guidelines will be displayed here.</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1E293B" },
  title: { fontSize: 24, fontWeight: "bold", color: "#FACC15", marginBottom: 10 },
  content: { fontSize: 16, color: "#E2E8F0", textAlign: "center", marginBottom: 20 },
  backButton: { backgroundColor: "#DC2626", padding: 10, borderRadius: 8 },
  backButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});
