import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const API_URL = `${API_BASE_URL}`; // Replace with your actual API base URL

const AdminSuccessStoriesScreen = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/success-stories`);
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
      Alert.alert('Error', 'Failed to fetch success stories');
    } finally {
      setLoading(false);
    }
  };

  const deleteStory = async (id) => {
    Alert.alert('Delete Story', 'Are you sure you want to delete this story?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/success-stories/${id}`);
            fetchStories(); // Refresh the list after deletion
          } catch (error) {
            console.error('Error deleting story:', error);
            Alert.alert('Error', 'Failed to delete the story');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Success Stories Management</Text>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Success Stories Management</Text>

      {stories.map((story) => (
        <View key={story._id} style={styles.storyCard}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{story.title}</Text>
            <TouchableOpacity onPress={() => deleteStory(story._id)}>
              <Ionicons name="trash-outline" size={24} color="#B00020" />
            </TouchableOpacity>
          </View>
          <Text style={styles.location}>📍 {story.subtitle}</Text>
          <Text style={styles.storyText}>{story.story}</Text>
        </View>
      ))}

      {stories.length === 0 && !loading && (
        <Text style={styles.emptyText}>No success stories to display.</Text>
      )}
    </ScrollView>
  );
};

// Keep all the styles exactly the same as in your original code
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