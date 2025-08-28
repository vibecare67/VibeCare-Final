import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import API_BASE_URL from '../config/api';

const RespondTicketScreen = ({ route, navigation }) => {
  const { feedbackId } = route.params;
  const [feedback, setFeedback] = useState(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/feedbacks/${feedbackId}`);
      setFeedback(res.data);
    } catch (error) {
      console.error("❌ Error fetching feedback:", error);
      Alert.alert("Error", "Failed to fetch feedback details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      Alert.alert("Error", "Response cannot be empty.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.put(`${API_BASE_URL}/feedbacks/${feedbackId}/response`, {
        response,
      });
      Alert.alert("Success", "Response submitted successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("❌ Error submitting response:", error);
      Alert.alert("Error", "Failed to submit response.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }

  if (!feedback) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Feedback not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Respond to Feedback</Text>

      <View style={styles.feedbackCard}>
        <Text style={styles.userId}>User: {feedback.userId}</Text>
        <Text style={styles.rating}>⭐ Rating: {feedback.rating || "N/A"}</Text>
        {feedback.selectedImprovement && (
          <Text style={styles.improvement}>
            🔧 Improvement: {feedback.selectedImprovement}
          </Text>
        )}
        {feedback.feedback && <Text style={styles.feedbackText}>📝 {feedback.feedback}</Text>}
        <Text style={styles.date}>📅 {new Date(feedback.createdAt).toLocaleString()}</Text>
      </View>

      <Text style={styles.label}>Admin Response:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your response..."
        value={response}
        onChangeText={setResponse}
        multiline
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitResponse}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>{submitting ? "Submitting..." : "Submit Response"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "purple",
    marginBottom: 20,
  },
  feedbackCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  userId: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  rating: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff8c00",
    marginTop: 5,
  },
  improvement: {
    fontSize: 14,
    color: "#007BFF",
    marginTop: 5,
  },
  feedbackText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    color: "#777",
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 100,
    backgroundColor: "#FFF",
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "purple",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});

export default RespondTicketScreen;
