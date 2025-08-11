import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const caretakerdashboard = ({ route, navigation }) => {
  const { userName } = route.params || { navigationame: 'Your User' };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Caretaker Dashboard</Text>

      <View style={styles.quoteBox}>
        <Text style={styles.quote}>
          “Your presence is the most powerful support someone can receive.”
        </Text>
      </View>

      <Text style={styles.description}>
        As a caretaker, your role in supporting someone's emotional well-being is invaluable. Use the options below to explore their mental health status and past counselling conversations.
      </Text>

      <Image
        source={require('../assets/images/caretaker1.png')} // Replace with your local image path
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.caretakerInfo}>
        You are a caretaker of Arooj<Text style={styles.highlight}>{userName}</Text>
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CaretakerMentalHealthSummaryScreen', { userName })}
      >
        <Text style={styles.buttonText}>📊 View Mental Health Summary</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('VCHistoryScreen', { userName })}
      >
        <Text style={styles.buttonText}>🗂️ View Counselling History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FDE9E6',
    padding: 20,
    alignItems: 'center',
    flexGrow: 1,
  },
  heading: {
    top:30,
    fontSize: 38,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  quoteBox: {
    backgroundColor: 'rgba(222, 185, 160, 1.0)',
    top:40,
    borderRadius: 20,
    padding: 16,
    marginVertical: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333',
    textAlign: 'center',
    top:0,
  },
  description: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 22,
    top:50,
  },
  image: {
    width: 400,
    height: 280,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    top:50,
  },

  caretakerInfo: {
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
    top:20,
  },
  highlight: {
    fontWeight: 'bold',
    color: 'red',
  },
  button: {
    top:35,
    backgroundColor: '#610d1b',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  secondaryButton: {
    top:40,
    backgroundColor: '#8b3efa',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});



export default caretakerdashboard;
