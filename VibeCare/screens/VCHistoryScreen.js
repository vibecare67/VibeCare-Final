import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import API_BASE_URL from '../config/api';

const VCHistoryScreen = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch("${API_BASE_URL}/get-all-chats"); 
        const data = await response.json();

        if (data.status === "success") {
          // Format API data for UI
          const formattedSessions = data.chats.map(chat => ({
            date: new Date(chat.createdAt).toLocaleDateString(),
            messages: chat.messages.map(msg => ({
              sender: msg.sender,
              text: msg.text,
              time: msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '',
            })),
          }));
          setSessions(formattedSessions);
        } else {
          Alert.alert("Error", data.message || "Failed to fetch chats");
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
        Alert.alert("Error", "Could not connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#610d1b" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Virtual Counseling History</Text>

      {sessions.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#666' }}>No chat history found</Text>
      ) : (
        sessions.map((session, index) => (
          <View key={index} style={styles.sessionContainer}>
            <Text style={styles.sessionDate}>🗓 {session.date}</Text>
            {session.messages.map((msg, i) => (
              <View
                key={i}
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text style={styles.messageSender}>
                  {msg.sender === 'user' ? 'You' : 'VibeCare'}
                </Text>
                <Text style={styles.messageText}>{msg.text}</Text>
                <Text style={styles.timestamp}>{msg.time}</Text>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE9E6',
    padding: 20,
  },
  header: {
    fontSize: 28,
    marginTop: 30,
    fontWeight: 'bold',
    color: '#610d1b',
    marginBottom: 20,
    textAlign: 'center',
  },
  sessionContainer: {
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  sessionDate: {
    fontSize: 16,
    color: '#610d1b',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 16,
    marginVertical: 8,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: '#f3f3f3',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  botBubble: {
    backgroundColor: '#e1d4f3',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageSender: {
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 6,
  },
});

export default VCHistoryScreen;
