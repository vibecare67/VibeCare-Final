import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";

const FeedbackListScreen = ({ navigation }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "info",
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const showAlert = (title, message, type = "info", onConfirm = () => {}) => {
    setAlertConfig({ title, message, type, onConfirm });
    setAlertVisible(true);
  };

  const hideAlert = () => setAlertVisible(false);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("${API_BASE_URL}/feedbacks");
      setFeedbacks(response.data);
    } catch (error) {
      showAlert("Error", "Failed to fetch feedbacks", "error");
      console.error("❌ Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    showAlert(
      "Delete Feedback",
      "Are you sure you want to delete this feedback?",
      "warning",
      async () => {
        try {
          await axios.delete(`${API_BASE_URL}/feedbacks/${id}`);
          setFeedbacks(feedbacks.filter((item) => item._id !== id));
          showAlert("Success", "Feedback deleted successfully", "success");
        } catch (error) {
          showAlert("Error", "Failed to delete feedback", "error");
          console.error("❌ Error deleting feedback:", error);
        }
      }
    );
  };

  const handleRespond = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/feedbacks/${id}/respond`);
      showAlert("Success", "Feedback status updated to Responded", "success");
      fetchFeedbacks();
    } catch (error) {
      showAlert("Error", "Failed to update feedback status", "error");
      console.error("❌ Error updating feedback status:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom Alert Component */}
      <Modal visible={alertVisible} transparent animationType="fade">
        <View style={styles.alertOverlay}>
          <View style={[
            styles.alertBox,
            alertConfig.type === "error" && styles.errorAlert,
            alertConfig.type === "success" && styles.successAlert,
            alertConfig.type === "warning" && styles.warningAlert
          ]}>
            <Icon 
              name={
                alertConfig.type === "error" ? "error" :
                alertConfig.type === "success" ? "check-circle" :
                "warning"
              } 
              size={40} 
              color={
                alertConfig.type === "error" ? "#dc3545" :
                alertConfig.type === "success" ? "#28a745" :
                "#ffc107"
              } 
            />
            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
            <Text style={styles.alertMessage}>{alertConfig.message}</Text>
            <View style={styles.alertButtons}>
              {alertConfig.type === "warning" && (
                <TouchableOpacity
                  style={[styles.alertButton, styles.cancelButton]}
                  onPress={hideAlert}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.alertButton, styles.confirmButton]}
                onPress={() => {
                  alertConfig.onConfirm();
                  hideAlert();
                }}
              >
                <Text style={styles.buttonText}>
                  {alertConfig.type === "warning" ? "Confirm" : "OK"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header Section */}
      <View style={styles.headerWrapper}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("WelcomeScreen")}
        >
          <Icon name="arrow-back" size={24} color="purple" />
        </TouchableOpacity>
        <Text style={styles.header}>User Feedback</Text>
      </View>

      {/* Content Section */}
      {feedbacks.length === 0 ? (
        <Text style={styles.noFeedback}>No feedback available.</Text>
      ) : (
        <FlatList
          data={feedbacks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.feedbackCard}>
              <View style={styles.feedbackHeader}>
                <Text style={styles.userId}>User: {item.userId}</Text>
                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                  <Icon name="delete" size={22} color="red" />
                </TouchableOpacity>
              </View>
              <Text style={styles.rating}>⭐ Rating: {item.rating || "N/A"}</Text>
              {item.selectedImprovement && (
                <Text style={styles.improvement}>
                  🔧 Improvement: {item.selectedImprovement}
                </Text>
              )}
              {item.feedback && <Text style={styles.feedbackText}>📝 {item.feedback}</Text>}
              <Text style={styles.date}>📅 {new Date(item.createdAt).toLocaleString()}</Text>
              
              <TouchableOpacity 
                style={styles.respondButton} 
                onPress={() => handleRespond(item._id)}
              >
                <Text style={styles.buttonText}>Respond to Ticket</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    padding: 20,
    paddingTop: 50,
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "purple",
  },
  noFeedback: {
    textAlign: "center",
    fontSize: 18,
    color: "#555",
  },
  feedbackCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  respondButton: {
    marginTop: 10,
    backgroundColor: "purple",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
  },
  errorAlert: {
    borderLeftWidth: 5,
    borderColor: "#dc3545",
  },
  successAlert: {
    borderLeftWidth: 5,
    borderColor: "#28a745",
  },
  warningAlert: {
    borderLeftWidth: 5,
    borderColor: "#ffc107",
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  alertMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  alertButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  alertButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  confirmButton: {
    backgroundColor: "purple",
  },
});

export default FeedbackListScreen;