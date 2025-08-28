import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import axios from 'axios';

const FeedbackScreen = ({ navigation, route }) => {
  console.log("User ID in feedback screen:", route.params.userId); // Debugging
  const { userId } = route.params || {};
  const [rating, setRating] = useState(0);
  const [selectedImprovement, setSelectedImprovement] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState('Feedback');
  const [ticketNumber, setTicketNumber] = useState(null);
  const [feedbackStatus, setFeedbackStatus] = useState("Pending");

  // Fetch feedback status on component mount
  useEffect(() => {
    if (userId) {
      // fetchFeedbackStatus();
    }
  }, [userId]);

  // Fetch feedback status from the backend
  const fetchFeedbackStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/feedback-status/${userId}`);
      console.log("Response from backend:", response.data);
  
      if (response.data.feedback?.status) {
        setFeedbackStatus(response.data.feedback.status);
        Alert.alert(
          "Feedback Status",
          response.data.feedback.status === "Closed"
            ? "Your feedback has been responded to!"
            : "Your feedback is still pending."
        );
      } else {
        Alert.alert("Feedback Status", "No feedback found. Please submit one to check the status.");
      }
    } catch (error) {
      // console.error("Error fetching feedback status:", error);
      if (error.response?.status === 404) {
        Alert.alert("Feedback Status", "No feedback found. Please submit one to check the status.");
      } else {
        Alert.alert("Error", "Unable to check feedback status. Try again later.");
      }
    }
  };

  // Improvement options
  const improvementOptions = [
    { id: 1, label: 'Speed and efficiency' },
    { id: 2, label: 'Chatbot (Your dodo)' },
    { id: 3, label: 'Persona Explorer' },
    { id: 4, label: 'Overall Performance' },
  ];

  // Handle rating selection
  const handleRating = (star) => {
    setRating(star);
  };

  // Handle improvement selection
  const handleImprovementSelection = (id) => {
    setSelectedImprovement(id);
  };

  // Generate a unique ticket number
  const generateTicketNumber = () => {
    return `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  // Handle feedback submission
  const handleSubmit = async () => {
    console.log("Submitting feedback...");
    console.log("User ID:", userId);

    if (!userId) {
      console.error('User ID not found');
      return;
    }

    if (rating === 0 && !selectedImprovement && !feedback.trim()) {
      setShowAlert(true);
      return;
    }

    const ticket = generateTicketNumber();
    setTicketNumber(ticket);

    try {
      await axios.post(`${API_BASE_URL}/submit-feedback`, {
        userId,
        rating,
        selectedImprovement: selectedImprovement
          ? improvementOptions.find((option) => option.id === selectedImprovement)?.label
          : null,
        feedback,
        ticketNumber: ticket,
      });

      console.log("Feedback submitted successfully!");
      setCurrentPage('ThankYouScreen');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert("Error", "Failed to submit feedback. Please try again.");
    }
  };

  // Render Thank You screen
  if (currentPage === 'ThankYouScreen') {
    return (
      <View style={styles.container}>
        <View style={styles.thankYouCard}>
          <Text style={styles.thankYouMessage}>🎉 Thank You! 🎉</Text>
          <Text style={styles.ticketMessage}>
            We appreciate your feedback. Remain in touch to check your feedback status!
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('ExploreScreen', { userId })}
          >
            <Text style={styles.buttonText}>Back to Explore</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.ticketNumber}>Your Ticket Number: {ticketNumber}</Text>
      </View>
    );
  }

  // Render Feedback screen
  return (
    <View style={styles.container}>
      <Text style={styles.header}>VibeCare</Text>

      {/* Incomplete Feedback Alert */}
      <Modal
        transparent
        animationType="fade"
        visible={showAlert}
        onRequestClose={() => setShowAlert(false)}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Incomplete Feedback</Text>
            <Text style={styles.alertMessage}>
              Please fill at least one field before submitting.
            </Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setShowAlert(false)}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Rate Your Experience */}
      <View style={[styles.card, { backgroundColor: '#daf5e1' }]}>
        <Text style={styles.question}>Rate Your Experience</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleRating(star)}
              style={[
                styles.star,
                { backgroundColor: rating >= star ? '#ad26ad' : '#E0E0E0' },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Tell us what can be improved? */}
      <View style={[styles.card, { backgroundColor: '#daeef5' }]}>
        <Text style={styles.question}>Tell us what can be improved?</Text>
        <View style={styles.optionsContainer}>
          {improvementOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleImprovementSelection(option.id)}
              style={[
                styles.improvementOption,
                selectedImprovement === option.id && styles.selectedImprovementOption,
              ]}
            >
              <Text
                style={[
                  styles.improvementOptionText,
                  selectedImprovement === option.id && styles.selectedImprovementOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* How can we improve... */}
      <View style={[styles.card, { backgroundColor: '#e4daf5' }]}>
        <Text style={styles.question}>How can we improve...</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Type your feedback here..."
          multiline
          value={feedback}
          onChangeText={setFeedback}
        />
      </View>

      {/* Submit and Cancel Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.navigate('ExploreScreen', { userId })}
        >
          <Text style={styles.buttonText}>No, thank you.</Text>
        </TouchableOpacity>
      </View>

      {/* Check Feedback Status Button */}
      <TouchableOpacity
        style={styles.statusButton}
        onPress={fetchFeedbackStatus}
      >
        <Text style={styles.buttonText}>Check Feedback Status</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
  },
  header: {
    fontSize: 40,
    color: 'purple',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    paddingTop: 50,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    elevation: 5,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  star: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  improvementOption: {
    padding: 10,
    borderRadius: 8,
    margin: 5,
  },
  selectedImprovementOption: {
    borderColor: 'purple',
    borderWidth: 2,
    backgroundColor: '#ad26ad',
  },
  improvementOptionText: {
    fontSize: 14,
  },
  selectedImprovementOptionText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    height: 100,
    marginTop: 10,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#BDBDBD',
    padding: 15,
    borderRadius: 10,
    flex: 1,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  thankYouCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    marginTop: 200,
  },
  thankYouMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
  },
  ticketMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginRight: 10,
    marginTop: 10,
    padding: 10,
  },
  ticketNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'purple',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    left: 50,
  },
  backButton: {
    backgroundColor: 'purple',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  statusButton: {
    backgroundColor: 'gray',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    marginTop: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FeedbackScreen;