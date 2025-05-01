import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ProfileScreen = ({ setIsAuthenticated }) => {
  // Dummy user data (Replace with actual user data)
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    profilePic: "https://i.pravatar.cc/150?img=3",
  };

  const handleLogout = () => {
    setIsAuthenticated(false); // Logs the user out
  };

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: user.profilePic }} style={styles.profileImage} />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      {/* Profile Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editProfileButton}>
          <Icon name="create-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E293B",
    padding: 20,
    alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#FACC15",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FACC15",
    marginTop: 10,
  },
  userEmail: {
    fontSize: 16,
    color: "#E2E8F0",
    marginTop: 5,
  },
  actions: {
    width: "100%",
    marginTop: 20,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
