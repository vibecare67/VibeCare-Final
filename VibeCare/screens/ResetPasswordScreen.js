import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_BASE_URL } from '../config/api';

const ResetPasswordScreen = ({ navigation, route }) => {
  const { Email } = route.params;
  console.log(Email);
  const [NewPassword, setNewPassword] = useState('');
  const [NewPasswordError, setNewPasswordError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [modalMessage, setModalMessage] = useState(''); // Modal message state

  // Password Validation
  const validatePassword = (text) => {
    setNewPassword(text);
    if (text.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(text)) {
      setNewPasswordError('');
    } else {
      setNewPasswordError(
        'Password must be at least 8 characters long and include a special character.'
      );
    }
  };

  const handleResetPassword = async () => {
    if (!NewPassword) {
      setModalMessage('Please enter a new password');
      setIsModalVisible(true);
      return;
    }

    const passwordData = { Email, newPassword: NewPassword };
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, passwordData);
      if (response.data.status === 'success') {
        setModalMessage('Password reset successfully');
        setIsModalVisible(true);
        // navigation.navigate('SigninScreen');
      } else {
        setModalMessage(response.data.message);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error(error);
      setModalMessage('Unable to connect to the server');
      setIsModalVisible(true);
    }
  };

  // New function for handling OK button press
  const handleOkButtonPress = () => {
    setIsModalVisible(false); // Hide the modal
    if (modalMessage === 'Password reset successfully') {
    navigation.navigate('SigninScreen'); // Navigate to SigninScreen
    }
  };

  return (
    <View style={styles.container}>
      {/* App Title */}
      <Text style={styles.title}>
        Vibe<Text style={styles.care}>Care</Text>
      </Text>
      <Text style={styles.subtitle}>Enter a new password</Text>

      {/* Password Input */}
      <View style={styles.floatingInputContainer}>
        {(isPasswordFocused || NewPassword) && (
          <Text style={styles.floatingLabel}>Enter New Password</Text>
        )}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.passwordInput,
              NewPasswordError
                ? { borderColor: '#cc1f1f' }
                : { borderColor: '#8b3efa' },
            ]}
            placeholder={!isPasswordFocused ? 'New Password' : ''}
            placeholderTextColor="#aaa"
            secureTextEntry={!isPasswordVisible}
            value={NewPassword}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            onChangeText={validatePassword}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Icon
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={24}
              color="#8b3efa"
            />
          </TouchableOpacity>
        </View>
        {NewPasswordError && <Text style={styles.errorText}>{NewPasswordError}</Text>}
      </View>

      {/* Reset Password Button */}
      <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
        <Text style={styles.resetButtonText}>Reset Password</Text>
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
              onPress={handleOkButtonPress} // Added the handler here
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1b7f7',
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#8b3efa',
    height: 52,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#4A4A4A',
  },
  resetButton: {
    backgroundColor: '#8b3efa',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 30,
    elevation: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#cc1f1f',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
    fontStyle: 'italic',
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
    borderRadius: 20,
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

export default ResetPasswordScreen;
