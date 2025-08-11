import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const initialStories = [
  {
    id: '1',
    name: 'Farhan M.',
    age: 22,
    location: 'Islamabad, Pakistan',
    story: `As a university student living away from family, anxiety hit hard. I avoided socializing, my studies suffered, and I felt like I was drowning silently. VibeCare became my silent partner. Its mental well-being engine identified my rising anxiety levels early.\n\nThe daily mindfulness exercises and community support reminded me I wasn’t alone. Within 6 weeks, I had my first anxiety-free presentation. Now I share my experience openly. VibeCare gave me the tools — and the courage — to face life again.`,
  },
  {
    id: '2',
    name: 'Ayesha R.',
    age: 25,
    location: 'Lahore, Pakistan',
    story: `Hi there, I’m here to listen. Please tell me what’s been on your mind lately—anything that’s been bothering you, making you feel low, or even small victories you’d like to share. There’s no judgment here, just a safe space to talk.\n\nYou can start by describing how your day has been or something that’s been weighing on you. I’m here to help, support, and guide you through this.`,
  },
];

const AdminSuccessStoriesScreen = () => {
  const [stories, setStories] = useState(initialStories);

  const deleteStory = (id) => {
    Alert.alert('Delete Story', 'Are you sure you want to delete this story?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setStories((prev) => prev.filter((story) => story.id !== id));
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Success Stories Management</Text>

      {stories.map((story) => (
        <View key={story.id} style={styles.storyCard}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{story.name}, {story.age}</Text>
            <TouchableOpacity onPress={() => deleteStory(story.id)}>
              <Ionicons name="trash-outline" size={24} color="#B00020" />
            </TouchableOpacity>
          </View>
          <Text style={styles.location}>📍 {story.location}</Text>
          <Text style={styles.storyText}>{story.story}</Text>
        </View>
      ))}

      {stories.length === 0 && (
        <Text style={styles.emptyText}>No success stories to display.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE9E6',
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#610d1b',
    marginVertical: 20,
    textAlign: 'center',
    marginTop:50,
  },
  storyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#37474F',
  },
  location: {
    color: '#607D8B',
    marginTop: 4,
    marginBottom: 10,
    fontSize: 14,
  },
  storyText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    textAlign: 'justify',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});

export default AdminSuccessStoriesScreen;
