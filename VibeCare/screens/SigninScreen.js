import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";

const SigninScreen = ({ navigation, route }) => {
  const userId = route?.params?.userId || null; 
  useEffect(() => {
    if (userId) {
      console.log("Received userId in SigninScreen:", userId);
    }
  }, [userId]);
  
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  // Validate Email
  const validateEmail = (text) => {
    setEmail(text);
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text)) {
      setEmailError("");
    } else {
      setEmailError("Enter a valid email address.");
    }
  };

  // Show Alert Modal
  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setCustomAlertVisible(true);
  };

  // Close Alert Modal
  const closeAlert = () => {
    setCustomAlertVisible(false);
  };

// Handle Form Submission
const handleSubmit = async () => {
  console.log("=== DEBUG: Starting handleSubmit ===");
  console.log("Email entered:", Email);
  console.log("Password entered (length only):", Password.length);

  if (!Email || !Password) {
    console.log("DEBUG: Missing fields -> Email or Password is empty");
    showAlert("Missing Fields", "Please fill in all fields.");
    return;
  }

  const userData = { Email, Password };
  console.log("DEBUG: Sending request with data:", userData);

  try {
    const serverUrl = `${API_BASE_URL}/login-user`;
    console.log("DEBUG: Sending POST request to:", serverUrl);

    const res = await axios.post(serverUrl, userData, {
      timeout: 5000, // helpful to detect hanging requests
    });

    console.log("DEBUG: Full response received:", res);
    console.log("DEBUG: Response data:", res.data);

    if (res.data.status === "ok" && res.data.userId) {
      console.log("DEBUG: Login successful -> Saving token and userId");

      await AsyncStorage.setItem("userToken", res.data.data);
      await AsyncStorage.setItem("userId", res.data.userId);
      if (res.data.username) {
        await AsyncStorage.setItem("username", res.data.username);
      }

      showAlert("Success", "You have logged in successfully!");
      navigation.navigate("ExploreScreen", { userId: res.data.userId });
    } else {
      console.log("DEBUG: Login failed ->", res.data);
      showAlert("Login Failed", res.data.data || "Unknown error occurred.");
    }
  } catch (error) {
    console.log("=== DEBUG: ERROR CAUGHT ===");
    if (error.response) {
      // Server responded but with error code
      console.log("DEBUG: Server error response:", error.response.data);
      console.log("DEBUG: Status code:", error.response.status);
      showAlert("Error", `Server responded with ${error.response.status}`);
    } else if (error.request) {
      // No response received
      console.log("DEBUG: No response received from server.");
      console.log("DEBUG: Request object:", error.request);
      showAlert("Error", "No response from server. Check your network.");
    } else {
      // Something else went wrong
      console.log("DEBUG: Axios setup error:", error.message);
      showAlert("Error", error.message);
    }
  }
};

  const saveUserInfo = async (username) => {
    try {
      await AsyncStorage.setItem('username', username);
    } catch (error) {
      console.error('Error saving username:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("WelcomeScreen")}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>
        Vibe<Text style={styles.care}>Care</Text>
      </Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <View style={styles.floatingInputContainer}>
          {(isEmailFocused || Email) && <Text style={styles.floatingLabel}>Email</Text>}
          <TextInput
            style={[styles.input, emailError ? styles.errorBorder : styles.normalBorder]}
            placeholder={!isEmailFocused ? "Email" : ""}
            placeholderTextColor="#aaa"
            value={Email}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
            onChangeText={validateEmail}
          />
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}
        </View>

        {/* Password Input */}
        <View style={styles.floatingInputContainer}>
          {(isPasswordFocused || Password) && <Text style={styles.floatingLabel}>Password</Text>}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder={!isPasswordFocused ? "Password" : ""}
              placeholderTextColor="#aaa"
              secureTextEntry={!isPasswordVisible}
              value={Password}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Icon name={isPasswordVisible ? "eye" : "eye-off"} size={24} color="#8b3efa" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.forgotPasswordLink}
            onPress={() => navigation.navigate("ForgotPasswordScreen")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signinButton} onPress={handleSubmit}>
        <Text style={styles.signinButtonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Navigate to Signup page */}
      <TouchableOpacity
        style={{ marginTop: 20, alignItems: "center" }}
        onPress={() => navigation.navigate("SignupScreen")}
      >
        <Text style={{ color: "black", fontSize: 12 }}>
          Didn't start your healing journey?{" "}
          <Text style={{ color: "purple", fontSize: 12, fontWeight: "bold" }}>
            Join us Now
          </Text>
        </Text>
      </TouchableOpacity>

      {/* Custom Alert Modal */}
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
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backArrow: {
    fontSize: 24,
    color: "#4A4A4A",
  },
  title: {
    fontSize: 50,
    color: "#5c1060",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  care: {
    color: "#5c1060",
  },
  subtitle: {
    fontSize: 20,
    color: "#4A4A4A",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  floatingInputContainer: {
    position: "relative",
    marginBottom: 15,
  },
  floatingLabel: {
    position: "absolute",
    top: -10,
    left: 15,
    fontSize: 12,
    color: "#8b3efa",
    backgroundColor: "#FDE6E6",
    paddingHorizontal: 5,
    zIndex: 1,
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
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d1b7f7",
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#8b3efa",
    height: 52,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#4A4A4A",
  },
  signinButton: {
    backgroundColor: "#8b3efa",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    elevation: 5,
  },
  signinButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "purple",
    fontSize: 10,
    marginTop: 1,
    marginLeft: 10,
    fontStyle: "italic",
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
    // borderRadius: 20,
    padding: 20,
    alignItems: "center",
    // backgroundColor: "#FDE6E6",
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
  forgotPasswordText: {
    color: "purple",
    fontSize: 12,
    fontWeight: "bold",
  },
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginTop: 5,
  },
});

export default SigninScreen;