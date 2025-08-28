import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const AddStoryScreen = ({ navigation, route }) => {
    const { userId } = route.params; // Access userId from navigation params
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [story, setStory] = useState('');
  
    const handleSubmit = async () => {
      try {
        const payload = {
          userId,
          title,
          subtitle,
          story,
        };
  
        console.log('Payload:', payload); // Log the payload
  
        const response = await axios.post(`${API_BASE_URL}/success-stories`, payload);
        console.log('Story added:', response.data);
  
        // Navigate to SuccessStoriesScreen with userId
        navigation.navigate('SuccessStoriesScreen', { userId });
      } catch (error) {
        console.error('Error adding story:', error);
        if (error.response) {
          console.error('Server response:', error.response.data); // Log server response
        }
      }
    };
  
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input1}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input2}
          placeholder="Subtitle"
          value={subtitle}
          onChangeText={setSubtitle}
        />
        <TextInput
          style={[styles.input3, { height: 100 }]}
          placeholder="Your Story"
          value={story}
          onChangeText={setStory}
          multiline
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#80B9A1',
    },
    input1: {
        marginTop:50,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      marginBottom: 20,
    },
    input2: {
        
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
      },
      input3: {
        
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
      },
    submitButton: {
      backgroundColor: '#4CAF50',
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
    },
    submitButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
  export default AddStoryScreen;