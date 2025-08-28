import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { API_BASE_URL } from '../config/api';

const EmailVerificationSignUp = ({ navigation, route }) => {
  const { Name, Username, Email, Password, otpSent } = route.params || {};
  const [otp, setOtp] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');


  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setModalVisible(true);
  };

  const verifyOtp = async () => {
    try {
      console.log('📤 Sending OTP verification request...');
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email, otp }),
      });

      const contentType = response.headers.get('content-type');
      const text = await response.text(); // Raw response
      console.log('📥 OTP Response Text:', text);

      if (contentType && contentType.includes('application/json')) {
        const data = JSON.parse(text);

        if (data.status === 'success') {
          console.log('✅ OTP verified, now registering user...');
          const registerResponse = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Name, Username, Email, Password }),
          });

          const registerContentType = registerResponse.headers.get('content-type');
          const registerText = await registerResponse.text();
          console.log('📥 Registration Response Text:', registerText);

          if (registerContentType && registerContentType.includes('application/json')) {
            const registerData = JSON.parse(registerText);

            if (registerData.status === 'success') {
              showAlert('Success!', 'User verified and registered successfully. Add your preferences to get a better experience.');
              setTimeout(() => {
                setModalVisible(false);
                navigation.replace('GenderSelectionScreen', { userId: registerData.userId, Email });
              }, 2000);
            } else {
              showAlert('Registration Error', registerData.message || 'Could not register user.');
            }
          } else {
            console.error('❌ Registration response is not JSON');
            showAlert('Error', 'Unexpected response format during registration.');
          }
        } else {
          showAlert('Invalid OTP', 'Please enter the correct OTP.');
        }
      } else {
        console.error('❌ OTP response is not JSON');
        showAlert('Error', 'Unexpected response format during OTP verification.');
      }
    } catch (error) {
      console.error('❌ Error in OTP verification or registration:', error);
      showAlert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Verification</Text>
      <Text style={styles.infoText}>
        Enter the OTP sent to your email address ({Email})
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={verifyOtp}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      {/* Styled Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{alertTitle}</Text>
            <Text style={styles.modalMessage}>{alertMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EmailVerificationSignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE6E6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'purple',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: 'purple',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    backgroundColor: 'purple',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'purple',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: 'purple',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
