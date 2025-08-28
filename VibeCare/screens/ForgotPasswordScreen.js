import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

function ForgotPasswordScreen({ navigation }) {
  const [Email, setEmail] = useState("");
  const [EmailError, setEmailError] = useState("");
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const validateEmail = (text) => {
    setEmail(text);
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text)) {
      setEmailError("");
    } else {
      setEmailError("Enter a valid email address.");
    }
  };

  const handleForgotPassword = () => {
    if (EmailError || !Email) {
      showAlert("Alert", "Please provide a valid email address.");
      return; 
    }
  
    axios
      .post(`${API_BASE_URL}/forgot-password`, { Email })
      .then((res) => {
        // Show success alert and navigate to VerifyOtpScreen
        showAlert("Success", res.data.message || "Reset link sent to your email.");
        setTimeout(() => {
          setCustomAlertVisible(false); // Close the alert
          navigation.navigate("VerifyOtpScreen", { Email }); // Navigate
        }, 1000); // Delay navigation slightly to give time for the alert to appear
      })
      .catch((error) => {
        showAlert(
          "Error",
          error.response?.data?.message || "Unable to process request."
        );
      });
  };
  

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setCustomAlertVisible(true);
  };

  const closeAlert = () => {
    setCustomAlertVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("SigninScreen")}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Vibe<Text style={styles.care}>Care</Text>
      </Text>
      <Text style={styles.subtitle}>Forgot Password</Text>

      <View style={styles.inputContainer}>
        <View style={styles.floatingInputContainer}>
          {(isEmailFocused || Email) && (
            <Text style={styles.floatingLabel}>Enter Email</Text>
          )}
          <TextInput
            style={[
              styles.input,
              EmailError ? { borderColor: "#cc1f1f" } : { borderColor: "#8b3efa" },
            ]}
            placeholder={!isEmailFocused ? "Email" : ""}
            placeholderTextColor="#aaa"
            value={Email}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
            onChangeText={validateEmail}
          />
          {EmailError && <Text style={styles.errorText}>{EmailError}</Text>}
        </View>
      </View>

      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleForgotPassword}
      >
        <Text style={styles.signupButtonText}>Reset Password</Text>
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
}

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
  signupButton: {
    backgroundColor: "#8b3efa",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    elevation: 5,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
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
  errorText: {
    color: "purple",
    fontSize: 12,
    marginTop: 1,
    marginLeft: 10,
    fontSize: 10,
    fontStyle: "italic",
  },
});

export default ForgotPasswordScreen;
