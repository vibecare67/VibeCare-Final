import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  StyleSheet,
} from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';

const HelpSupportScreen = ({ navigation }) => {
  const [expanded, setExpanded] = useState(null);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const faqs = [
    { question: 'How do I reset my password?', answer: 'Go to Account > Reset Password and follow the instructions.' },
    { question: 'How do I contact support?', answer: 'You can reach us via email at vibecare67@gmail.com or use the live chat option.' },
    { question: 'Is my data secure?', answer: 'Yes, we use end-to-end encryption to ensure your data remains private and secure.' },
  
  {
    question: 'How do I add a caretaker?',
    answer: 'Go to Profile > Add Caretaker. Enter the email of the person you trust. They’ll receive a request to connect and view your mental health summaries only.',
  },
  {
    question: 'How does Virtual Counseling work?',
    answer: 'Our AI buddy listens to your concerns and gives calming, motivational responses. While it is not a therapist, it’s here to support you 24/7.',
  },
  {
    question: 'How often should I take the mental health quizzes?',
    answer: 'You can take Depression, Anxiety, and Stress assessments weekly to track your progress and emotional trends.',
  },
  {
    question: 'Is my data safe with VibeCare?',
    answer: 'Yes, we use end-to-end encryption. Only you (and your approved caretaker) can access mental summaries. Nothing is shared externally.',
  },
  {
    question: 'How do I share a Success Story?',
    answer: 'Go to the Success Stories section and tap on “Share My Story.” You can write anonymously to inspire others on their healing journey.',
  },
  {
    question: 'Can I use VibeCare without signing in?',
    answer: 'Yes! You can explore many features without signing in. However, signing in lets you save your progress and view past summaries.',
  },
  {
    question: 'Can caretakers see my private data?',
    answer: 'No. Caretakers only see emotional summaries and DAS results. They can’t access your diary, chats, or private responses.',
  },
  
];

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setCustomAlertVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Help & Support</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        
        </TouchableOpacity>
        <Text style={styles.subHeader}>Frequently Asked Questions</Text>
        {faqs.map((faq, index) => (
          <Card key={index} style={styles.card}>
            <TouchableOpacity onPress={() => toggleExpand(index)}>
              <Text style={styles.question}>{faq.question}</Text>
            </TouchableOpacity>
            {expanded === index && <Text style={styles.answer}>{faq.answer}</Text>}
          </Card>
        ))}

        <Divider style={styles.divider} />

        <Text style={styles.subHeader}>Need More Help?</Text>
        <Button mode="contained" style={styles.emailButton} onPress={() => Linking.openURL('mailto:vibecare67@gmail.com')}>
          Email Support
        </Button>
     
      </ScrollView>

      {/* Custom Alert Modal */}
      <Modal
        visible={customAlertVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCustomAlertVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>{alertTitle}</Text>
            <Text style={styles.alertMessage}>{alertMessage}</Text>
            <TouchableOpacity style={styles.alertButton} onPress={() => setCustomAlertVisible(false)}>
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A192F', padding: 20 },
  header: {
    fontSize: 45,
    marginTop: 30,
    color: '#FF6B6B',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(255, 107, 107, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  subHeader: {
    fontSize: 22,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#112240',
    borderRadius: 12,
    elevation: 6,
    borderWidth: 1.5,
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  question: { fontSize: 16, color: '#FF6B6B', fontWeight: 'bold' },
  answer: { fontSize: 16, color: '#A8B2D1', marginTop: 6 },
  divider: { marginVertical: 25, height: 1, backgroundColor: '#FF6B6B' },
  emailButton: {
    marginVertical: 10,
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 30,
  },
  chatButton: {
    marginVertical: 10,
    backgroundColor: '#112240',
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  alertBox: {
    width: '80%',
    // backgroundColor: '#112240',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FF6B6B',
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF6B6B',
  },
  alertMessage: {
    fontSize: 16,
    color: '#A8B2D1',
    textAlign: 'center',
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  alertButtonText: {
    color: '#0A192F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 95,
    left: 10,
  },
  backArrow: {
    fontSize: 26,
    color: '#FF6B6B',
  },
});

export default HelpSupportScreen;