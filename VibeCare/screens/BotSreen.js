import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Keyboard,
  Modal,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

// ✅ Use your correct Google API Key
const GEMINI_API_KEY = 'AIzaSyC27KUl5bvMUwVspsJFDOi0vOyqVzM4DMI';


const ChatBotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [historyVisible, setHistoryVisible] = useState(false);
  const flatListRef = useRef(null);
  const [username, setUsername] = useState('');
  const [history, setHistory] = useState([]);

const sendMessage = async () => {
  if (!userInput.trim()) return;

  const userMessage = { text: userInput, sender: 'user' };
  const updatedMessages = [...messages, userMessage];
  setMessages(updatedMessages);
  setUserInput('');
  Keyboard.dismiss();

  try {
    const prompt = `
      You are a licensed psychiatrist named Dodo. You help users deal with mental stress, anxiety, confusion, or daily life issues. Be empathetic, professional, and speak with kindness.
      Now, answer the following as a psychiatrist.Remember,your answer should be as limited as possible , maximum 50 words :
      "${userInput}"
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const botText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
    const botMessage = { text: botText, sender: 'bot' };

    const newMessages = [...updatedMessages, botMessage];

    setHistory((prev) => [...prev, userMessage, botMessage]);
    if (newMessages.length >= 10) {
      setMessages([]); // clear visible messages after 5 exchanges
    } else {
      setMessages(newMessages);
    }

  } catch (error) {
    const errorMsg = { text: 'Error: Try again later.', sender: 'bot' };
    setMessages((prev) => [...prev, errorMsg]);
    setHistory((prev) => [...prev, userMessage, errorMsg]);
  }
};


  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) setUsername(storedUsername);
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => setHistoryVisible(true)}>
          <Image source={require('../assets/images/history.png')} style={styles.historyIcon} />
        </TouchableOpacity>
      </View>

      {messages.length < 5 && (
        <Image source={require('../assets/images/dodo.png')} style={styles.chatbotImage} />
      )}

      <Text style={styles.welcomeText}>Welcome, {username || 'Guest'}!</Text>
      <Text style={styles.subtitle}>Let's have fun with Dodo!</Text>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.chatArea}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={userInput}
          onChangeText={setUserInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* History Modal */}
      <Modal visible={historyVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chat History</Text>
            <FlatList
              data={history.slice(-10)} // last 5 exchanges (user+bot)
              renderItem={({ item }) => (
                <Text style={styles.modalMessage}>
                  {item.sender === 'user' ? '🧑‍💻' : '🤖'} {item.text}
                </Text>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity onPress={() => setHistoryVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDE9E6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', marginTop: 50 },
  logo: { width: 100, height: 40, resizeMode: 'contain' },
  historyIcon: { width: 30, height: 30 },
  chatbotImage: { width: 270, height: 250, alignSelf: 'center', marginVertical: 20 },
  welcomeText: { fontSize: 24, textAlign: 'center', fontWeight: 'bold' },
  subtitle: { textAlign: 'center', fontSize: 16, marginBottom: 20 },
  chatArea: { flex: 1, padding: 10 },
  message: { marginVertical: 5, padding: 10, borderRadius: 10 },
  userMessage: { backgroundColor: '#E8F0FF', alignSelf: 'flex-end' },
  botMessage: { backgroundColor: '#D1FFD1', alignSelf: 'flex-start' },
  messageText: { fontSize: 16 },
  inputArea: { flexDirection: 'row', padding: 10, backgroundColor: '#FFF', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#CCC', borderRadius: 5, padding: 10 },
  sendButton: { backgroundColor: 'purple', padding: 10, marginLeft: 10, borderRadius: 5 },
  sendButtonText: { color: '#FFF', fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: 300, padding: 20, backgroundColor: '#FFF', borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalMessage: { fontSize: 16, marginVertical: 5 },
  closeButton: { marginTop: 10, backgroundColor: 'purple', padding: 10, borderRadius: 5, alignItems: 'center' },
  closeButtonText: { color: '#FFF', fontWeight: 'bold' },
});

export default ChatBotScreen;
