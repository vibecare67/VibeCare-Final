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

const OtpVerification = ({ navigation, route }) => {
  const { Email, userId } = route.params;
  const [Otp, setOtp] = useState('');
  const [isOtpFocused, setIsOtpFocused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
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
    if (!Otp) {
      Animated.timing(placeholderAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleVerifyOtp = async () => {
    if (!Otp) {
      setModalMessage('Please enter the OTP');
      setIsModalVisible(true);
      return;
    }

    const otpData = { Email, otp: Otp };
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, otpData);
      if (response.data.status === 'success') {
        navigation.navigate('SigninScreen', { userId });
      } else {
        setModalMessage('Invalid OTP');
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error(error);
      setModalMessage('Unable to connect to the server');
      setIsModalVisible(true);
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
          {(isOtpFocused || Otp) && (
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
            value={Otp}
            onChangeText={setOtp}
            onFocus={handleFocus}
            onBlur={handleBlur}
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>

      {/* Modal */}
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
    padding: 20,
    alignItems: 'center',
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

export default OtpVerification;
