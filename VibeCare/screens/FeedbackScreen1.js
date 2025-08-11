import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const FeedbackScreen1 = () => {
  const navigation = useNavigation(); // Hook to access navigation

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>VibeCare</Text>

      {/* Feedback Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/fb.png')} // Replace with your feedback image path
          style={styles.image}
        />
      </View>

      {/* Thank You Message */}
      <Text style={styles.thankYouText}>
        Thank you for your valuable feedback! We'll use it to make the app even better for you.
      </Text>

      {/* Ticket Generated */}
      <Text style={styles.ticketText}>Ticket generated.</Text>

      {/* Confirmation Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.checkMark}>✓</Text>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('ExploreScreen')} // Navigate to ExploreScreen
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE9E6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    color: '#E63946',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  thankYouText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginVertical: 15,
  },
  ticketText: {
    fontSize: 20,
    color: '#6B705C',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#c48bf0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkMark: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'purple',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FeedbackScreen1;
