import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const counselingSessions = [
  {
    date: 'June 15, 2025',
    messages: [
      {
        sender: 'user',
        text: 'Hi there, I’m here to listen. Please tell me what’s been on your mind lately—anything that’s been bothering you, making you feel low, or even small victories you’d like to share.',
        time: '13:44',
      },
      {
        sender: 'bot',
        text: 'Thank you for reaching out. It takes courage to talk. This is a safe space. Feel free to share whatever you’re comfortable with.',
        time: '13:45',
      },
    ],
  },
  {
    date: 'June 12, 2025',
    messages: [
      {
        sender: 'user',
        text: 'I’ve been feeling really overwhelmed lately with my workload. I can’t seem to relax even when I have time.',
        time: '10:30',
      },
      {
        sender: 'bot',
        text: 'It’s understandable to feel that way. Let’s try to explore what’s contributing to this stress. Have there been any particular triggers recently?',
        time: '10:32',
      },
      {
        sender: 'user',
        text: 'Maybe it’s just the constant pressure of deadlines. I haven’t taken a proper break in weeks.',
        time: '10:34',
      },
      {
        sender: 'bot',
        text: 'That’s important to acknowledge. You deserve rest. Let’s talk about creating a simple plan to prioritize breaks and self-care.',
        time: '10:35',
      },
    ],
  },
];

const VCHistoryScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Virtual Counseling History</Text>

      {counselingSessions.map((session, index) => (
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
              <Text style={styles.messageSender}>{msg.sender === 'user' ? 'You' : 'VibeCare'}</Text>
              <Text style={styles.messageText}>{msg.text}</Text>
              <Text style={styles.timestamp}>{msg.time}</Text>
            </View>
          ))}
        </View>
      ))}
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
    marginTop:30,
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
