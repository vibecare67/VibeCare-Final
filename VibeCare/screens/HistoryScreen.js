import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
// import { ChatContext } from '../ChatContext';
import { API_BASE_URL } from '../config/api';

const HistoryScreen = () => {
  const { messages } = useContext(ChatContext);

  const renderMessage = ({ item }) => (
    <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat History</Text>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatArea}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFD6D6', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  chatArea: { flexGrow: 1 },
  message: { marginVertical: 5, padding: 10, borderRadius: 10 },
  userMessage: { backgroundColor: '#E8F0FF', alignSelf: 'flex-end' },
  botMessage: { backgroundColor: '#D1FFD1', alignSelf: 'flex-start' },
  messageText: { fontSize: 16 },
});

export default HistoryScreen;
