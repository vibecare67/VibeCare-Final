import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const API_URL = `${API_BASE_URL}/random-images`; 

export default function RandomImageQuiz() {
  const [images, setImages] = useState([]);
  const [selectedPersonality, setSelectedPersonality] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    console.log('Attempting to fetch images from:', API_URL);
    try {
      const res = await axios.get(API_URL);
      console.log('API response received:', res.data);

      // Check if 'data' exists and is an array
      if (res.data && Array.isArray(res.data.data)) {
        setImages(res.data.data);  // Use 'data' field from response
      } else {
        console.error('No valid images array found in response');
        setImages([]); // Fallback if no images array is found
      }

      setSelectedPersonality(null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error.message);
      if (error.response) {
        console.error('Server responded with:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received. Request details:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      setLoading(false); // Prevent indefinite spinner
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleOptionClick = (personality) => {
    setSelectedPersonality(personality);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {selectedPersonality && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Your Personality:</Text>
          <Text style={styles.resultText}>{selectedPersonality}</Text>
        </View>
      )}

      {Array.isArray(images) && images.length > 0 ? (
        images.map((img, index) => (
          <View key={img._id} style={styles.card}>
            <Image source={{ uri: img.imageUrl }} style={styles.image} />
            <Text style={styles.questionText}>What catches your eye first?</Text>
            {img.options.map((opt, i) => (
              <TouchableOpacity key={i} style={styles.optionBtn} onPress={() => handleOptionClick(opt.personality)}>
                <Text style={styles.optionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.noImagesText}>No images available</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center'
  },
  card: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
    padding: 12,
    width: '100%',
    maxWidth: 350
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10
  },
  questionText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600'
  },
  optionBtn: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8
  },
  optionText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500'
  },
  resultCard: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginBottom: 24,
    borderRadius: 10,
    width: '100%',
    maxWidth: 350,
    borderColor: '#ccc',
    borderWidth: 1
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8
  },
  resultText: {
    fontSize: 16
  },
  noImagesText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20
  }
});
