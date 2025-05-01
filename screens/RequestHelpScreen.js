import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  PermissionsAndroid,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SendIntentAndroid from "react-native-send-intent";

export default function RequestHelpScreen({ navigation }) {
  const [address, setAddress] = useState("");
  const [priority, setPriority] = useState("");
  const [message, setMessage] = useState("");
  const [emergencyType, setEmergencyType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("Pending");

  // Array of emergency phone numbers
  const EMERGENCY_PHONE_NUMBERS = [
    "+919344809016", // Replace with actual emergency numbers
    "+919344809016",
  ];

  // Request SMS permission
  const requestSmsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        {
          title: "SMS Permission",
          message: "This app needs permission to send emergency SMS automatically.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("SMS permission granted");
        return true;
      } else {
        console.log("SMS permission denied");
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Reset form fields
  const resetFields = () => {
    setAddress("");
    setPriority("");
    setMessage("");
    setEmergencyType("");
    setStatus("Pending");
  };

  // Send SMS to multiple numbers
  const sendEmergencySMS = (smsMessage) => {
    try {
      EMERGENCY_PHONE_NUMBERS.forEach((number) => {
        SendIntentAndroid.sendSms(number, smsMessage);
        console.log(`✅ SMS sent successfully to ${number}`);
      });
    } catch (error) {
      console.log("❌ SMS Error:", error);
      Alert.alert("Error", "Failed to send SMS.");
    }
  };

  // Handle help request submission
  const handleRequestHelp = async () => {
    if (!address || !priority || !emergencyType) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }

    // Check for SMS permission
    const hasPermission = await requestSmsPermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "SMS permission is required to send emergency requests.");
      return;
    }

    const smsMessage = `🚨 Emergency Help Request 🚨\nLocation: ${address}\nType: ${emergencyType}\nPriority: ${priority}\nMessage: ${message || "No additional details provided."}`;

    setIsSubmitting(true);

    try {
      // Send SMS to multiple numbers
      sendEmergencySMS(smsMessage);

      // Reset form fields
      resetFields();

      Alert.alert("Success", "Help request sent via SMS!");
    } catch (error) {
      console.log("❌ Error sending request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset fields when the screen is focused
  useFocusEffect(
    useCallback(() => {
      resetFields();
    }, [])
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>🚨 Request Help</Text>

          <Text style={styles.label}>Enter Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.label}>Emergency Type</Text>
          <TextInput
            style={styles.input}
            placeholder="Medical, Fire, Flood..."
            value={emergencyType}
            onChangeText={setEmergencyType}
          />

          <Text style={styles.label}>Priority</Text>
          <TextInput
            style={styles.input}
            placeholder="High, Medium, Low"
            value={priority}
            onChangeText={setPriority}
          />

          <Text style={styles.label}>Additional Info</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Describe your emergency..."
            value={message}
            onChangeText={setMessage}
          />

          {isSubmitting ? (
            <ActivityIndicator size="large" color="red" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleRequestHelp}>
              <Text style={styles.buttonText}>Confirm Request</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.statusText}>Status: {status}</Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 5,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  statusText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
  },
});
