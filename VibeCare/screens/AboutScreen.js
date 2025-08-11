import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';

const AboutScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with Icon */}
        <View style={styles.headerSection}>
          <View style={styles.textHeader}>
            <Text style={styles.appTitle}>VibeCare</Text>
            <Text style={styles.tagline}>
              Your trusted space for mental and emotional well-being.
            </Text>
          </View>
          <Image
            source={require('../assets/images/about.png')}
            style={styles.headerImage}
          />
        </View>

        {/* Founder Message */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Message from the Founder</Text>
          <Text style={styles.cardText}>
            "Mental health is not a luxury—it’s a necessity. VibeCare was born from a personal journey to create a space where every emotion is valid, every user feels seen, and every mind is supported. Our platform is designed with compassion and innovation to bring you closer to emotional balance and clarity."
            {'\n\n'}— Team VibeCare
          </Text>
        </View>

        {/* Mission */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Mission</Text>
          <Text style={styles.cardText}>
            At <Text style={styles.highlight}>VibeCare</Text>, we aim to democratize mental health support. Our mission is to foster resilience, understanding, and growth through accessible digital tools that respect every individual’s mental health journey.
          </Text>
        </View>

        {/* What We Offer */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What We Offer</Text>
          <Text style={styles.cardText}>
            • Personalized well-being engine based on validated psychological scales{'\n'}
            • Virtual counseling with AI-powered companions{'\n'}
            • Mood and stress tracking via a digital diary{'\n'}
            • Success story platform to inspire healing journeys{'\n'}
            • Caretaker monitoring tools (with consent) for trusted support
          </Text>
        </View>

        {/* Vision */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Vision</Text>
          <Text style={styles.cardText}>
            To build a future where mental health is openly embraced, and people have access to safe, intelligent, and empathetic platforms that help them thrive. We envision a world where emotional well-being is nurtured with as much care as physical health.
          </Text>
        </View>

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#74ABE2',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    justifyContent: 'space-between',
  },
  textHeader: {
    flex: 1,
    paddingRight: 10,
    top:10,
    left:20,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 16,
    color: '#f5f5f5',
    fontStyle: 'italic',
    // left:20,
  },
  headerImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    right:20,
    top:10,
  },
  card: {
    backgroundColor: '#D6E6FF',
    borderRadius: 18,
    padding: 20,
    marginTop: 25,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2482e0',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 15.5,
    color: '#333',
    lineHeight: 23,
    textAlign: 'justify',
  },
  highlight: {
    color: 'red',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginTop: 40,
    borderWidth: 2,
    borderColor: '#ccc2be',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2482e0',
  },
});

export default AboutScreen;
