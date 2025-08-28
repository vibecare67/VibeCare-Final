import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  Email,
} from 'react-native';
import axios from 'axios';
import SignupScreen from './SignupScreen';
import {API_BASE_URL} from '../config/api';

const VerifyOtpScreen = ({ navigation, route }) => {
  const { Email } = route.params;
  const [otp, setOtp] = useState('');
  const [isOtpFocused, setIsOtpFocused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [modalMessage, setModalMessage] = useState(''); // Modal message state
  const placeholderAnimation = useRef(new Animated.Value(0)).current;
   const [customAlertVisible, setCustomAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

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
      setModalMessage('Please enter the OTP');
      setIsModalVisible(true);
      return;
    }

    const otpData = { Email, otp: otp }
   
  try {
    console.log('📤 Sending OTP verification request...');
    const response = await fetch(`${API_BASE_URL}/verifyOtp`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        Email: Email.trim(), 
        otp: otp.trim() // Trim whitespace from OTP
      })
    });

    const data = await response.json();
    console.log('📥 OTP Response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'OTP verification failed');
    }

    if (data.status === 'success') {
      console.log('✅ OTP verified');
      setModalMessage('OTP verified');
      setIsModalVisible(true);
      navigation.navigate('ResetPasswordScreen',{Email});
      console.log(Email);
    } else {
      showAlert('Invalid OTP', data.message || 'The OTP you entered is invalid or expired.');
    }
  } catch (error) {
    console.error('❌ Error in OTP verification:', error);
    showAlert('Error', error.message || 'Something went wrong. Please try again later.');
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

      <Text style={styles.title}>
        Vibe<Text style={styles.care}>Care</Text>
      </Text>
      <Text style={styles.subtitle}>Enter OTP</Text>

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
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>

      {/* Custom Alert Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Alert</Text>
            <Text style={styles.alertMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
       {/* Custom Alert */}
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
    backgroundColor: '#FDE6E6',
    paddingHorizontal: 20,
    justifyContent: 'center',
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
    fontSize: 50,
    color: '#5c1060',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  care: {
    color: '#5c1060',
  },
  subtitle: {
    fontSize: 20,
    color: '#4A4A4A',
    textAlign: 'center',
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
    top: -10,
    left: 15,
    fontSize: 12,
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '80%',
    backgroundColor: '#fff',
    // borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    // backgroundColor: '#FDE6E6',
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  alertMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: '#8b3efa',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerifyOtpScreen;
