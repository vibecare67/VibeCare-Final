import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Import screens
import PrivacyScreen from './PrivacyScreen';
import MyAccount from './MyAccount';
import AboutScreen from './AboutScreen';
// import SuccessStoriesScreen from './SuccessStoriesScreen';
// import SignupScreen from './SignupScreen';

const InfoScreen = () => {
  const navigation = useNavigation();

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  // Info Card Component
  const InfoCard = ({ icon, color, title, description, onPress }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress}>
      <View style={styles.cardContent}>
        <Image source={icon} style={styles.cardIcon} />
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>VibeCare</Text>

      {/* Subheading */}
      <Text style={styles.subtitle}>
        Empower Your Mind:{'\n'}Your Guide to Better Mental{'\n'}Health and Well-Being
      </Text>

      {/* Illustration */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/abc.jpg')} // Replace with your image path
          style={styles.image}
        />
      </View>

      {/* Info Cards */}
      <ScrollView style={styles.cardContainer}>
        <InfoCard
          icon={require('../assets/images/privacy.png')}
          color="#E0A0A0"
          title="Privacy Terms"
          description="Your data is secure. Learn more about our privacy policy."
          onPress={() => navigateTo('PrivacyScreen')}
        />
        <InfoCard
          icon={require('../assets/images/faq.png')}
          color="#E792CB"
          title="Help and Support"
          description="Resolve your issues and enhance your experience."
          onPress={() => navigateTo('HelpSupportScreen')}
        />
        <InfoCard
          icon={require('../assets/images/about.png')}
          color="#98C7EE"
          title="About Us"
          description="Our mission is to provide accessible support to everyone."
          onPress={() => navigateTo('AboutScreen')}
        />
        <InfoCard
          icon={require('../assets/images/stories.png')}
          color="#80B9A1"
          title="Success Stories"
          description="Read stories from users who’ve benefitted from our app."
          onPress={() => navigateTo('SuccessStoriesScreen')}
        />
      </ScrollView>

      {/* Start Your Journey Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigateTo('SignupScreen')}>
          <Text style={styles.buttonText}>Start your journey</Text>
          <Text style={styles.forwardArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE6E6',
    paddingHorizontal: 20,
  },
  appBar: {
    marginTop: 50,
  },
  backArrow: {
    fontSize: 24,
    color: 'black',
  },
  title: {
    fontFamily: 'Cursive',
    fontSize: 36,
    color: '#5c1060',
    fontWeight: 'bold',
    textAlign: 'left',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'flex-end',
  },
  image: {
    height: 200,
    width: 200,
    borderTopLeftRadius: 300,
    borderTopRightRadius: 300,
  },
  cardContainer: {
    marginVertical: 10,
  },
  card: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 45,
    height: 40,
    marginRight: 15,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  cardDescription: {
    fontSize: 12,
    color: '#555',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#d1b7f7',
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    elevation: 2,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    borderColor: '#8b3efa',
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  forwardArrow: {
    marginLeft: 10,
    fontSize: 20,
    color: 'black',
  },
});

export default InfoScreen;
