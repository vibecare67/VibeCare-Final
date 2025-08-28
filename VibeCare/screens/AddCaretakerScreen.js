import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import {API_BASE_URL} from '../config/api';


// Reusable Floating Label Input Component
const FloatingLabelInput = ({ label, value, onChangeText, keyboardType = 'default' }) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useState(new Animated.Value(value ? 1 : 0))[0];

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

 const labelStyle = {
  position: 'absolute',
  left: 20,
  top: animatedIsFocused.interpolate({
    inputRange: [0, 1],
    outputRange: [13, -5],
  }),
  fontSize: animatedIsFocused.interpolate({
    inputRange: [0, 1],
    outputRange: [17, 12],
  }),
  color: '#8b3efa',
  backgroundColor: '#d1b7f7',
  borderRadius:20,
  paddingHorizontal: 4,
  zIndex: 1,
};


  return (
    <View style={styles.inputContainer}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        blurOnSubmit
      />
    </View>
  );
};

const AddCaretakerScreen = ({ route }) => {
  const [caretakerName, setCaretakerName] = useState('');
  const [caretakerOtp, setCaretakerOtp] = useState('');
  const { userId } = route.params;

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const [listModalVisible, setListModalVisible] = useState(false);
  const [caretakerList, setCaretakerList] = useState([]);

  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleAddCaretaker = async () => {
    if (!userId || !caretakerName || !caretakerOtp) {
      showAlert('error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/add-caretaker`, {
        userId,
        caretakerName,
        caretakerOtp,
      });

      if (response.data.status === 'success') {
    const caretakerData = {
        name: caretakerName,
        otp: caretakerOtp,
        addedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(`caretaker_${userId}`, JSON.stringify(caretakerData));
        showAlert('success', 'Caretaker added successfully!');
        setCaretakerName('');
        setCaretakerOtp('');
      } else {
        showAlert('error', response.data.message);
      }
    } catch (error) {
      console.error('❌ Axios Error:', error.response?.data || error.message);
      showAlert('error', error.response?.data?.message || 'Server error');
    }
  };
   const fetchCaretakers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-caretakers?userId=${userId}`);
      if (response.data.status === 'success') {
        setCaretakerList(response.data.caretakers);
        setListModalVisible(true);
      } else {
        showAlert('error', response.data.message);
      }
    } catch (error) {
      console.error('Fetch caretakers error:', error);
      showAlert('error', 'Unable to fetch caretakers');
    }
  };

  return (
    <View style={styles.container}>
         <TouchableOpacity style={styles.viewIcon} onPress={fetchCaretakers}>
        <Icon name="account-multiple-outline" size={28} color="#5c1060" />
      </TouchableOpacity>
      <Text style={styles.title}>
        Add Caretaker
      </Text>

      <FloatingLabelInput
        label="Caretaker Name"
        style="label"
        value={caretakerName}
        onChangeText={setCaretakerName}
      />
      <FloatingLabelInput
        label="Caretaker OTP" 
        style="label"
        value={caretakerOtp}
        onChangeText={setCaretakerOtp}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddCaretaker}>
        <Text style={styles.addButtonText}>Add Caretaker</Text>
      </TouchableOpacity>

      {/* Custom Alert */}
      <Modal transparent={true} visible={alertVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Icon
              name={alertType === 'success' ? 'check-circle-outline' : 'alert-circle-outline'}
              size={48}
              color={alertType === 'success' ? '#4BB543' : '#ff4d4d'}
            />
            <Text style={styles.modalText}>{alertMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setAlertVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
       <Modal visible={listModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>Caretakers</Text>
            <FlatList
              data={caretakerList}
              keyExtractor={(item, index) => index.toString()}
             renderItem={({ item }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontSize: 16, fontWeight: '600', color: '#5c1060' }}>
      👤 {item.caretakerName}
    </Text>
    <Text style={{ fontSize: 13, color: '#555' }}>
      🕒 {new Date(item.createdAt).toLocaleString()}
    </Text>
  </View>
)}

            />
            <TouchableOpacity
              style={[styles.modalButton, { marginTop: 20 }]}
              onPress={() => setListModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
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
    paddingTop: 18,
  },
  viewIcon: {
  position: 'absolute',
  top: 50,
  right: 20,
  zIndex: 10,
},
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#5c1060',
    textAlign: 'center',
    marginBottom: 30,
  },
 
  inputContainer: {
    marginBottom: 25,
    position: 'relative',
  },
  input: {
    backgroundColor: '#d1b7f7',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#4A4A4A',
    borderWidth: 1,
    borderColor: '#8b3efa',
    elevation: 3,
  },
  addButton: {
    backgroundColor: '#8b3efa',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 5,
    marginTop: 10,
  },
  label:{
     fontSize: 14,
    color: "#8b3efa",
    marginBottom: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
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
    padding: 30,
    alignItems: 'center',
    elevation: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#8b3efa',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default AddCaretakerScreen;
