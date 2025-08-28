import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // For the back button icon
import {API_BASE_URL} from '../config/api'; 

const HistoryScreen = ({ route, navigation }) => {
  const { userId } = route.params; // Access userId from navigation params
  const [entries, setEntries] = useState([]);

  // Fetch diary entries from the backend
  useEffect(() => {
    fetchEntries();
  }, [userId]);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/diary`, {
        params: { userId },
      });
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  // Function to delete a diary entry
  const handleDeleteEntry = async (entryId) => {
    try {
      await axios.delete(`${API_BASE_URL}/diary/${entryId}`);
      fetchEntries(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting entry:', error);
      Alert.alert('Error', 'Failed to delete the entry. Please try again.');
    }
  };

  // Function to confirm deletion
  const confirmDelete = (entryId) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => handleDeleteEntry(entryId) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('PersonalExplorer', { userId })}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Diary History</Text>

      {/* Diary Entries List */}
      <FlatList
        data={entries}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer} // Ensure proper spacing
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
            <Text style={styles.note}>{item.note}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => confirmDelete(item._id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffe6eb',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  title: {
    top: 40,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20, // Ensure the last item is not cut off
  },
  entry: {
    top: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    padding: 10,
    color: '#666',
    marginBottom: 5,
  },
  note: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;