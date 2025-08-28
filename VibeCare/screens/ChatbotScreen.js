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
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native'; 
import {API_BASE_URL} from '../config/api';


//Google API Key
const GEMINI_API_KEY = 'AIzaSyDHrhraOvy-f5mOfEe0wiqSds37R_66WvI';
const URL = `${API_BASE_URL}`; 

const ChatBotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [historyVisible, setHistoryVisible] = useState(false);
  const flatListRef = useRef(null);
  const [username, setUsername] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

const showDeleteConfirmation = () => {
  setShowDeleteAlert(true);
};

const handleDeleteConfirm = () => {
  setShowDeleteAlert(false);
  deleteChatHistory();
};

const handleDeleteCancel = () => {
  setShowDeleteAlert(false);
};

  

  // Fetch user data on component mount
 const route = useRoute();
const userId = route.params?.userId || null;
 useEffect(() => {
    if (userId) {
      console.log("✅ User ID received successfully:", userId);
    } else {
      console.log("⚠️ No User ID received - user might be guest or error occurred");
    }
  }, [userId]);

  // Fetch username only (since we get userId from route params)
useEffect(() => {
  const fetchUserData = async () => {
    if (!userId) {
      console.log("No userId available, skipping user data fetch");
      return;
    }

    try {
      console.log("🔍 Fetching user data for userId:", userId);
      const response = await fetch(`${API_BASE_URL}/get-user/${userId}`);
      
      // First check if the response is OK (status 200-299)
      if (!response.ok) {
        const errorData = await response.json();
        console.log("⚠️ Server responded with error:", errorData.message);
        throw new Error(errorData.message || 'Failed to fetch user data');
      }

      // Parse the response data
      const responseData = await response.json();
      
      // Check if we got successful response with user data
      if (responseData.status === "success" && responseData.data) {
        const userData = responseData.data; // Access the nested data object
        console.log("✅ User data fetched successfully:", userData);
        
        // Set username from the response data
        const usernameToSet = userData.Username || userData.Name || 'User';
        setUsername(usernameToSet);
        await AsyncStorage.setItem('username', usernameToSet);
      } else {
        console.log("⚠️ User data not found in response");
        // Fallback to AsyncStorage if available
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          console.log("Using username from AsyncStorage as fallback");
          setUsername(storedUsername);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching user data:', error.message);
      // Fallback to AsyncStorage if available
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        console.log("Using username from AsyncStorage after error");
        setUsername(storedUsername);
      } else {
        // If all else fails, set a default username
        setUsername('User');
      }
    }
  };

  fetchUserData();
}, [userId]);


  // Save chat to MongoDB
  const saveChatToMongoDB = async (chatData) => {
    if (!userId) {
      console.log("Not saving chat - no userId available");
      return null;
    }

    try {
      console.log("💾 Attempting to save chat to MongoDB...");
      const response = await fetch(`${API_BASE_URL}/save-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          messages: chatData,
          timestamp: new Date()
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Chat saved successfully to MongoDB:", data);
      } else {
        console.log("⚠️ Chat save response not OK:", data);
      }
      return data;
    } catch (error) {
      console.error('❌ Error saving chat:', error);
      return null;
    }
  };


  // Fetch chat history from MongoDB
 // Updated fetchChatHistory function
const fetchChatHistory = async () => {
  if (!userId) {
    console.log("Not fetching history - no userId available");
    return;
  }

  try {
    setLoadingHistory(true);
    console.log("📚 Fetching chat history for userId:", userId);
    const response = await fetch(`${API_BASE_URL}/get-chats?userId=${userId}`);
    
    // First check if response is OK
    if (!response.ok) {
      const errorData = await response.json();
      console.log("⚠️ Server responded with error:", errorData.message);
      throw new Error(errorData.message || 'Failed to fetch chat history');
    }

    const responseData = await response.json();
    console.log("Full response data:", responseData);
    
    // Check if we got successful response with chat data
    if (responseData.status === "success" && Array.isArray(responseData.chats)) {
      console.log(`✅ Retrieved ${responseData.chats.length} chat sessions from history`);
      
      // Safely flatten messages from all chat sessions
      const allMessages = responseData.chats.reduce((acc, chat) => {
        return acc.concat(chat.messages || []);
      }, []);
      
      console.log(`📝 Total messages in history: ${allMessages.length}`);
      setChatHistory(allMessages);
    } else {
      console.log("⚠️ No chat data found or invalid format:", responseData);
      setChatHistory([]); // Set empty array if no data
    }
  } catch (error) {
    console.error('❌ Error fetching chat history:', error.message);
    setChatHistory([]); // Set empty array on error
  } finally {
    setLoadingHistory(false);
  }
};
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { text: userInput, sender: 'user', timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput('');
    Keyboard.dismiss();

    try {
      setLoading(true);
      const prompt = `
        You are a licensed psychiatrist named Dodo. You help users deal with mental stress, anxiety, confusion, or daily life issues. Be empathetic, professional, and speak with kindness.
        Now, answer the following as a psychiatrist:
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
      const botMessage = { text: botText, sender: 'bot', timestamp: new Date() };

      const newMessages = [...updatedMessages, botMessage];
      const newChatData = [...updatedMessages, botMessage];

      // Save to MongoDB
      if (userId) {
        await saveChatToMongoDB(newChatData);
      }

      setMessages(newMessages);
      
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = { text: 'Error: Try again later.', sender: 'bot', timestamp: new Date() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Load chat history when history modal is opened
  const handleOpenHistory = async () => {
    if (userId) {
      await fetchChatHistory();
    }
    setHistoryVisible(true);
  };

  // Toggle between showing last 15 messages and full history
  const toggleHistoryView = () => {
    setShowFullHistory(!showFullHistory);
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  // Add this function to your component
const deleteChatHistory = async () => {
  if (!userId) {
    console.log("No userId available, cannot delete history");
    return;
  }

  try {
    setLoadingHistory(true);
    console.log("🗑️ Deleting chat history for userId:", userId);
    const response = await fetch(`${API_BASE_URL}/delete-chats`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    });

    if (response.ok) {
      console.log("✅ Chat history deleted successfully");
      setChatHistory([]); // Clear local chat history
      setShowSuccessAlert(true); // Show custom success alert
    } else {
      const errorData = await response.json();
      console.log("⚠️ Failed to delete chat history:", errorData.message);
      Alert.alert("Error", errorData.message || "Failed to delete chat history");
    }
  } catch (error) {
    console.error('❌ Error deleting chat history:', error);
    Alert.alert("Error", "Failed to delete chat history");
  } finally {
    setLoadingHistory(false);
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setInfoVisible(true)}>
          <Image 
            source={require('../assets/images/logo.png')} 
            style={styles.infoIcon} 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenHistory}>
          <Image source={require('../assets/images/history.png')} style={styles.historyIcon} />
        </TouchableOpacity>
      </View>

      {messages.length < 5 && (
        <View style={styles.chatbotImageContainer}>
          <Image 
            source={require('../assets/images/dodo.png')} 
            style={styles.chatbotImage} 
          />
        </View>
      )}

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome, {username || 'Guest'}!</Text>
        <Text style={styles.subtitle}>Let's have fun with Dodo!</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#888"
          value={userInput}
          onChangeText={setUserInput}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity 
          style={[styles.sendButton, loading && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.sendIcon} 
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Info Modal */}
      <Modal visible={infoVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.infoModalContent}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.infoImage} 
            />
            <Text style={styles.infoTitle}>About Dodo</Text>
            <Text style={styles.infoText}>
              Dodo is your friendly AI psychiatrist designed to help you with mental wellness.
              {"\n\n"}
              • Always confidential
              {"\n"}
              • Available 24/7
              {"\n"}
              • Non-judgmental support
            </Text>
            <TouchableOpacity 
              onPress={() => setInfoVisible(false)}
              style={styles.infoCloseButton}
            >
              <Text style={styles.infoCloseText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* History Modal */}
      <Modal visible={historyVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chat History</Text>
            
            {loadingHistory ? (
              <ActivityIndicator size="large" color="#6a51af" style={styles.loadingIndicator} />
            ) : (
              <>
                <FlatList
                  data={showFullHistory ? chatHistory : chatHistory.slice(-15)}
                  renderItem={({ item }) => (
                    <View style={[
                      styles.historyMessage, 
                      item.sender === 'user' ? styles.historyUserMessage : styles.historyBotMessage
                    ]}>
                      <Text style={styles.historyMessageText}>
                        <Text style={styles.historySender}>
                          {item.sender === 'user' ? 'You: ' : 'Dodo: '}
                        </Text>
                        {item.text}
                      </Text>
                      <Text style={styles.historyTime}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.historyList}
                  contentContainerStyle={styles.historyContent}
                />
                
                {chatHistory.length > 0 && (
                  <TouchableOpacity 
                    onPress={showDeleteConfirmation}
                    style={styles.delete}
                  >
                    <Text style={styles.deleteText}>Delete All History</Text>
                    {showDeleteAlert && (
  <Modal transparent visible={showDeleteAlert} onRequestClose={handleDeleteCancel}>
    <View style={styles.alertOverlay}>
      <View style={styles.alertContainer}>
        <Text style={styles.alertTitle}>Delete Chat History</Text>
        <Text style={styles.alertMessage}>
          Are you sure you want to delete all your chat history?
        </Text>
        <View style={styles.alertButtonContainer}>
          <TouchableOpacity 
            style={[styles.alertButton, styles.cancelButton]}
            onPress={handleDeleteCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.alertButton, styles.deleteButton]}
            onPress={handleDeleteConfirm}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)}
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  onPress={toggleHistoryView} 
                  style={styles.toggleHistoryButton}
                >
                  <Text style={styles.toggleHistoryButtonText}>
                    {showFullHistory ? 'Show Recent' : 'View Full History'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
            
            <TouchableOpacity 
              onPress={() => {
                setHistoryVisible(false);
                setShowFullHistory(false);
              }} 
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Success Alert Modal */}
<Modal transparent visible={showSuccessAlert} onRequestClose={() => setShowSuccessAlert(false)}>
  <View style={styles.alertOverlay}>
    <View style={styles.alertContainer}>
      <Text style={styles.alertTitle}>Success</Text>
      <Text style={styles.alertMessage}>
        Your chat history has been deleted successfully!
      </Text>
      <TouchableOpacity 
        style={[styles.alertButton, styles.successButton]}
        onPress={() => setShowSuccessAlert(false)}
      >
        <Text style={styles.successButtonText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    // backgroundColor: '#6a51af',
    top:50,
    paddingHorizontal:30,
  },
  logo: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
    // tintColor: '#fff'
  },
  historyIcon: {
    width: 28,
    height: 28,
    // tintColor: '#fff'
  },
  infoIcon: {
    width: 28,
    height: 38,
    // tintColor: '#fff'
  },
  chatbotImageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10
  },
  chatbotImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#6a51af'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a3c8f',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center'
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 15
  },
  chatContent: {
    paddingBottom: 15
  },
  message: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 15,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  userMessage: {
    backgroundColor: '#e3f2fd',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0
  },
  botMessage: {
    backgroundColor: '#ede7f6',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    alignSelf: 'flex-end'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    marginRight: 10
  },
  sendButton: {
    backgroundColor: '#6a51af',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendButtonDisabled: {
    backgroundColor: '#b39ddb'
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: windowWidth * 0.9,
    maxHeight: windowHeight * 0.8,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  infoModalContent: {
    width: windowWidth * 0.85,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6a51af',
    marginBottom: 15,
    textAlign: 'center'
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6a51af',
    marginVertical: 15,
    textAlign: 'center'
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20
  },
  infoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#6a51af'
  },
  historyList: {
    flexGrow: 1,
    marginBottom: 15
  },
  historyContent: {
    paddingBottom: 10
  },
  historyMessage: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  historyUserMessage: {
    backgroundColor: '#e3f2fd',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0
  },
  historyBotMessage: {
    backgroundColor: '#ede7f6',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0
  },
  historyMessageText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20
  },
  historySender: {
    fontWeight: 'bold',
    color: '#6a51af'
  },
  historyTime: {
    fontSize: 11,
    color: '#666',
    marginTop: 5,
    alignSelf: 'flex-end'
  },
  delete: {
    // backgroundColor: '#ff5252',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center'
  },
  deleteText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
    right:120,
    top:20,
  },
  toggleHistoryButton: {
    backgroundColor: '#6a51af',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center'
  },
  toggleHistoryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  closeButton: {
    backgroundColor: '#6a51af',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center'
  },
  infoCloseButton: {
    backgroundColor: '#6a51af',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  infoCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  loadingIndicator: {
    marginVertical: 30
  },
  alertContainer: {
    backgroundColor: '#f5f7ff',
    borderRadius: 15,
    padding: 20
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6a51af',
    marginBottom: 10
  },
  alertMessage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20
  },
  alertButton: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5
  },



alertOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
alertContainer: {
  width: '80%',
  backgroundColor: 'white',
  borderRadius: 15,
  padding: 20,
  alignItems: 'center',
},
alertTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#6a51af',
  marginBottom: 10,
},
alertMessage: {
  fontSize: 16,
  color: '#555',
  marginBottom: 20,
  textAlign: 'center',
},
alertButtonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
},
alertButton: {
  padding: 12,
  borderRadius: 8,
  width: '45%',
  alignItems: 'center',
},
cancelButton: {
  backgroundColor: '#e0e0e0',
},
deleteButton: {
  backgroundColor: '#ff5252',
},
cancelButtonText: {
  color: '#333',
  fontWeight: 'bold',
},
deleteButtonText: {
  color: 'white',
  fontWeight: 'bold',
},
successButton: {
  backgroundColor: '#6a51af',
  width: '100%',
},
successButtonText: {
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'center',
},
});

export default ChatBotScreen;