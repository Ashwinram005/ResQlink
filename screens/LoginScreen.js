import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen({ setIsLoggedIn }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError("Both fields are required!");
      return;
    }
    if (!validateEmail(email)) {
      setError("Enter a valid email address!");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    setError("");
    console.log("Logging in with:", { email, password });
    setIsLoggedIn(true); // Navigates to HomeTabs (Handled in App.js)
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.title}>Welcome Back</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                {password.length > 0 && (
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text style={styles.toggleText}>{showPassword ? "Hide" : "Show"}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>New here?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupLink}>Create an Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E293B" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
  content: { width: "100%", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", color: "#FACC15", textAlign: "center", marginBottom: 20 },
  inputContainer: { width: "100%", marginBottom: 16 },
  label: { fontSize: 14, color: "#E2E8F0", marginBottom: 6, fontWeight: "500" },
  input: {
    width: "100%", backgroundColor: "#2D3E50", borderRadius: 8, padding: 14,
    fontSize: 16, color: "#fff", borderWidth: 1, borderColor: "#3B82F6"
  },
  passwordWrapper: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#2D3E50",
    borderRadius: 8, borderWidth: 1, borderColor: "#3B82F6", paddingHorizontal: 12,
    justifyContent: "space-between"
  },
  passwordInput: { flex: 1, paddingVertical: 14, fontSize: 16, color: "#fff" },
  toggleText: { color: "#FACC15", fontWeight: "bold" },
  button: {
    backgroundColor: "#DC2626", paddingVertical: 14, borderRadius: 8, marginTop: 20,
    alignItems: "center", justifyContent: "center", width: "100%",
    shadowColor: "#DC2626", shadowOpacity: 0.6, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  errorText: { color: "#F87171", fontSize: 14, marginBottom: 10, fontWeight: "bold" },
  signupContainer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  signupText: { fontSize: 14, color: "#E2E8F0" },
  signupLink: { fontSize: 14, color: "#FACC15", fontWeight: "bold", marginLeft: 6 }
});
