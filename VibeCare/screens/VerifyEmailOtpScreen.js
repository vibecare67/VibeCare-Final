import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const VerifyEmailOtpScreen = ({ navigation, route }) => {
  const { Email, userId, profileData } = route.params;
  const [otp, setOtp] = useState('');
  const [isOtpFocused, setIsOtpFocused] = useState(false);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const placeholderAnimation = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsOtpFocused(true);
    Animated.timing(placeholderAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsOtpFocused(false);
    if (!otp) {
      Animated.timing(placeholderAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
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

  const handleVerifyOtp = async () => {
    if (!otp) {
      showAlert("Alert", "Please enter the OTP");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/verify-email-otp`, {
        Email: Email.trim(),
        otp: otp.trim(),
        userId: userId
      });

      if (response.data.status === 'success') {
        // OTP verified, now update the profile
        try {
          await axios.put(`${API_BASE_URL}/edit-profile`, {
            userId,
            ...profileData,
          });
          showAlert("Success", "Email verified and profile updated successfully");
          setTimeout(() => {
            setCustomAlertVisible(false);
            navigation.goBack(); // Go back to previous screen
          }, 1000);
        } catch (error) {
          console.error("Error updating profile:", error);
          showAlert("Error", "Failed to update profile after OTP verification");
        }
      } else {
        showAlert("Invalid OTP", response.data.message || 'The OTP you entered is invalid or expired.');
      }
    } catch (error) {
      console.error('Error in OTP verification:', error);
      showAlert("Error", error.response?.data?.message || 'Something went wrong. Please try again later.');
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post(`${API_BASE_URL}/send-email-otp`, {
        Email: Email,
        userId: userId
      });
      showAlert("Success", "OTP resent to your email address.");
    } catch (error) {
      console.error("Error resending OTP:", error);
      showAlert("Error", "Failed to resend OTP. Please try again.");
    }
  };

  const placeholderPosition = placeholderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [15, -10],
  });

  const placeholderFontSize = placeholderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to {Email}</Text>

      <View style={styles.inputContainer}>
        <View style={styles.floatingInputContainer}>
          {(isOtpFocused || otp) && (
            <Animated.Text
              style={[
                styles.floatingLabel,
                {
                  top: placeholderPosition,
                  fontSize: placeholderFontSize,
                },
              ]}
            >
              Enter OTP
            </Animated.Text>
          )}
          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            onFocus={handleFocus}
            onBlur={handleBlur}
            keyboardType="numeric"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={resendOtp}>
        <Text style={styles.resendText}>Didn't receive OTP? Resend</Text>
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
    position: 'absolute',
    top: 50,
    left: 20,
  },
  backArrow: {
    fontSize: 24,
    color: '#4A4A4A',
  },
  title: {
    fontSize: 30,
    color: "#5c1060",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#4A4A4A",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  floatingInputContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  floatingLabel: {
    position: 'absolute',
    left: 15,
    color: '#8b3efa',
    backgroundColor: '#FDE6E6',
    paddingHorizontal: 5,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#d1b7f7',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#4A4A4A',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#8b3efa',
  },
  button: {
    backgroundColor: '#8b3efa',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendText: {
    color: '#8b3efa',
    textAlign: 'center',
    fontSize: 14,
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

export default VerifyEmailOtpScreen;