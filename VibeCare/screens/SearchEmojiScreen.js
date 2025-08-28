import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import {API_BASE_URL} from '../config/api';

const EMOJI_API = `${API_BASE_URL}/api/emojis`;

const SearchEmojiScreen = ({ navigation }) => {
  const [emojiInput, setEmojiInput] = useState('');
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    axios
      .get(EMOJI_API)
      .then(res => setData(res.data))
      .catch(err => console.error('Failed to fetch emoji data', err));
  }, []);

  const handleSearch = () => {
    const inputEmoji = emojiInput.trim();
    if (!inputEmoji) return;

    for (const category of data) {
      for (const subcategory of category.subcategories) {
        for (const emoji of subcategory.emojis) {
          if (emoji.emoji === inputEmoji) {
            navigation.navigate('SubcategoryDetails', {
              emojiData: emoji,
              mainCategory: category.category,
            });
            return;
          }
        }
      }
    }

    setModalVisible(true);
  };

  return (
    <ImageBackground
      source={require('../assets/images/searchbg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.box}>
          <Text style={styles.label}>🔍 Search for an Emoji</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter emoji..."
            placeholderTextColor="#ccc"
            value={emojiInput}
            onChangeText={text => {
              if (text.length <= 2) setEmojiInput(text);
            }}
            maxLength={2}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
          />
          <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <Text style={styles.buttonText}>Find Meaning</Text>
          </TouchableOpacity>
        </View>

        {/* Custom Alert Modal */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Emoji Not Found</Text>
              <Text style={styles.modalMessage}>Enter only emojis!</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default SearchEmojiScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    top: 250,
  },
  box: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 25,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  label: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4B3000',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#FFC107',
    padding: 12,
    fontSize: 24,
    borderRadius: 14,
    textAlign: 'center',
    color: '#333',
    backgroundColor: 'rgba(255, 255, 200, 0.4)',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF6B00',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
