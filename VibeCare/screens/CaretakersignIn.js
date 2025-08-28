import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const CaretakerSignIn = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const navigation = useNavigation();

 const handleLogin = async () => {
  if (name.trim() === '' || code.length !== 6) {
    Alert.alert('Invalid Input', 'Please enter a valid name and 6-digit code.');
    return;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/verify-caretaker`, {
      name,
      otp: code,
    });

    if (response.data.status === 'success') {
      Alert.alert('Success', `Welcome, ${name}!`);
      navigation.navigate('caretakerdashboard', { caretakerId: response.data.caretakerId,name });
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    Alert.alert('Login Failed', error.response?.data?.message || 'Server error');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Caretaker Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name(as set by patient)"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit code(as set by patient)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        maxLength={6}
        value={code}
        onChangeText={setCode}
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CaretakerSignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4ff',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#6a1b9a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#8b3efa',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
