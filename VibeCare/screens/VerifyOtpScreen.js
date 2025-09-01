import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from '../config/api';

const EditProfileScreen = ({ route, navigation }) => {
  const userId = route?.params?.userId;

  const [profile, setProfile] = useState({
    Name: "",
    Username: "",
    Email: "",
  });

  const [originalEmail, setOriginalEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!userId) {
      console.error("userId not found");
      return;
    }
    axios
      .get(`${API_BASE_URL}/user-profile?userId=${userId}`)
      .then((response) => {
        setProfile(response.data);
        setOriginalEmail(response.data.Email); // Store original email for comparison
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [userId]);

  const handleChange = (key, value) => {
    setProfile((prevState) => ({ ...prevState, [key]: value }));
    
    // Validate email format when email changes
    if (key === "Email") {
      validateEmail(value);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setCustomAlertVisible(true);
  };

  const closeAlert = () => {
    setCustomAlertVisible(false);
  };

  const handleSubmit = async () => {
    // Check if email has changed
    if (profile.Email !== originalEmail) {
      // Validate email format
      if (emailError || !profile.Email) {
        showAlert("Alert", "Please provide a valid email address.");
        return;
      }
      
      // Send OTP to the new email
      try {
        await axios.post(`${API_BASE_URL}/send-email-otp`, {
          Email: profile.Email,
          userId: userId
        });
        showAlert("Success", "OTP sent to your new email address.");
        setTimeout(() => {
          setCustomAlertVisible(false);
          // Navigate to OTP verification screen
          navigation.navigate("VerifyEmailOtpScreen", { 
            Email: profile.Email, 
            userId: userId,
            profileData: profile 
          });
        }, 1000);
      } catch (error) {
        console.error("Error sending OTP:", error);
        showAlert("Error", "Failed to send OTP. Please try again.");
      }
    } else {
      // If email hasn't changed, update profile directly
      try {
        await axios.put(`${API_BASE_URL}/edit-profile`, {
          userId,
          ...profile,
        });
        showAlert("Success", "Profile updated successfully");
      } catch (error) {
        console.error("Error updating profile:", error);
        showAlert("Error", "Failed to update profile");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={profile.Name}
        onChangeText={(text) => handleChange("Name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={profile.Username}
        onChangeText={(text) => handleChange("Username", text)}
      />

      <TextInput
        style={[styles.input, emailError ? styles.inputError : null]}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={profile.Email}
        onChangeText={(text) => handleChange("Email", text)}
        keyboardType="email-address"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <Modal
        visible={customAlertVisible}
        transparent
        animationType="fade"
        onRequestClose={closeAlert}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>{alertTitle}</Text>
            <Text style={styles.alertMessage}>{alertMessage}</Text>
            <TouchableOpacity style={styles.alertButton} onPress={closeAlert}>
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDE6E6",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    color: "#5c1060",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#d1b7f7",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#4A4A4A",
    elevation: 3,
    borderWidth: 1,
    borderColor: "#8b3efa",
    marginBottom: 15,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#8b3efa",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    elevation: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  alertBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  alertMessage: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: "#8b3efa",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  alertButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;