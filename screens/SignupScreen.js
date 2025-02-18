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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Home, Bell, MapPin, User } from "lucide-react-native";

export default function SignupScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSignup = () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("All fields are required!");
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
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");
    console.log("Signing up with:", { name, email, password });
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.title}>Create Account</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} placeholder="Enter your name" placeholderTextColor="#aaa" value={name} onChangeText={setName} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor="#aaa" keyboardType="email-address" value={email} onChangeText={setEmail} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput style={styles.passwordInput} placeholder="Enter your password" placeholderTextColor="#aaa" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
                {password.length > 0 && (
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text style={styles.toggleText}>{showPassword ? "Hide" : "Show"}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput style={styles.passwordInput} placeholder="Re-enter your password" placeholderTextColor="#aaa" secureTextEntry={!showConfirmPassword} value={confirmPassword} onChangeText={setConfirmPassword} />
                {confirmPassword.length > 0 && (
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Text style={styles.toggleText}>{showConfirmPassword ? "Hide" : "Show"}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.signupLink}>Login</Text>
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
  input: { width: "100%", backgroundColor: "#2D3E50", borderRadius: 8, padding: 14, fontSize: 16, color: "#fff", borderWidth: 1, borderColor: "#3B82F6" },
  passwordWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#2D3E50", borderRadius: 8, borderWidth: 1, borderColor: "#3B82F6", paddingHorizontal: 12, justifyContent: "space-between" },
  passwordInput: { flex: 1, paddingVertical: 14, fontSize: 16, color: "#fff" },
  toggleText: { color: "#FACC15", fontWeight: "bold" },
  button: { backgroundColor: "#DC2626", paddingVertical: 14, borderRadius: 8, marginTop: 20, alignItems: "center", justifyContent: "center", width: "100%", shadowColor: "#DC2626", shadowOpacity: 0.6, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  errorText: { color: "#F87171", fontSize: 14, marginBottom: 10, fontWeight: "bold" },
  signupContainer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  signupText: { fontSize: 14, color: "#E2E8F0" },
  signupLink: { fontSize: 14, color: "#FACC15", fontWeight: "bold", marginLeft: 6 }
});
