import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

const PrivacyScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
       
        <Text style={styles.title}>Privacy Policy</Text>
      </View>

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/images/privacy_icon.png')} // Add a local image for privacy icon
          style={styles.headerIcon}
        />
        <Text style={styles.headerTitle}>Your Privacy is Our Priority</Text>
        <Text style={styles.headerSubtitle}>
          We value your privacy and ensure your data is secure.
        </Text>
      </View>

      {/* Terms Content */}
      <ScrollView style={styles.content}>
  {renderTermsCard(
    "1. Data We Collect",
    "VibeCare collects personal data such as your name, email, age, gender, mental health responses, and app activity. This helps us provide personalized mental wellness experiences."
  )}
  {renderTermsCard(
    "2. Use of AI & User Input",
    "Your responses are analyzed using secure AI models to assess your emotional well-being and suggest therapy or activities. We do not use your data for any commercial profiling."
  )}
  {renderTermsCard(
    "3. Data Confidentiality",
    "All user data is encrypted during transmission and storage. We do not share any personal or mental health information with third parties without your consent."
  )}
  {renderTermsCard(
    "4. Role of Caretakers & Admins",
    "Caretakers can only view emotional summaries of users they’re assigned to. Admins can manage anonymized user insights for service improvement, never accessing private chats or responses."
  )}
  {renderTermsCard(
    "5. User Rights & Control",
    "You have full rights to access, update, or delete your data. Just contact our support through the Help section. We respect your decisions and privacy."
  )}
  {renderTermsCard(
    "6. Data Retention Policy",
    "Your data is retained only as long as necessary for therapy progress tracking and insights. If inactive for 6 months, your data is securely deleted from our servers."
  )}
  {renderTermsCard(
    "7. Feedback & Support",
    "Feedback is used only to improve our app and never linked to your health records. For any concerns, reach out via our in-app support or email us directly."
  )}
</ScrollView>


      {/* Accept Button */}
      <TouchableOpacity style={styles.acceptButton} onPress={() => navigation.goBack()}>
        <Text style={styles.acceptButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

// Helper function for rendering Terms Card
const renderTermsCard = (title, description) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBC6C6',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 15,
    backgroundColor: 'transparent',
  },
  backIcon: {
    fontSize: 24,
    color: 'white',
    marginRight: 15,
  },
  title: {
    fontSize: 38,
    top:0,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 40,
    left:89,
    marginBottom: 10,
    textAlign: 'center',
  },
  headerContainer: {
    backgroundColor: '#D68585',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 0,
  },
  headerIcon: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  content: {
    margin: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D68585',
  },
  cardDescription: {
    fontSize: 16,
    color: '#4F4F4F',
    marginTop: 5,
  },
  acceptButton: {
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    margin: 20,
    width:"60%",
    borderWidth:2,
    borderColor:'#ccc2be',
    left:50,
  },
  acceptButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0A0A0',
  },
});

export default PrivacyScreen;
