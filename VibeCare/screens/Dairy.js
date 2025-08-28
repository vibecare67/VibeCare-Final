import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';
import {API_BASE_URL} from '../config/api';

const API_URL = API_BASE_URL;

const Diary = ({ route,navigation }) => {
  const { userId } = route.params; // Access userId from navigation params
  const [note, setNote] = useState(""); // Current note being edited
  const [savedNotes, setSavedNotes] = useState([]); // Saved notes from the database
  const [isEditing, setIsEditing] = useState(false); // Tracks if editing mode is active

  // Fetch saved notes from the backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${API_URL}/diary`, {
          params: { userId },
        });
        setSavedNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, [userId]);

  // Function to save the note to the backend
  const handleSaveNote = async () => {
    if (note.trim() !== "") {
      try {
        const response = await axios.post(`${API_URL}/diary`, {
          userId,
          note,
        });
        setSavedNotes([response.data.entry, ...savedNotes]); // Add the new note to the list
        setNote(""); // Clear the input
        setIsEditing(false); // Exit editing mode
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false); // Exit editing mode without saving
    setNote(""); // Reset the input field
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
  
  <TouchableOpacity onPress={() => navigation.navigate('HistoryScreen', { userId })}>
    <Ionicons name="time-outline" size={24} color="black" />
  </TouchableOpacity>
</View>
      {/* Book Image */}
      <Image
        source={require("../assets/images/dairy.png")} // Update this path with the actual location of your image
        style={styles.image}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>Your Personal Diary</Text>

      {/* Note Display or Edit */}
      {isEditing ? (
        // Edit Mode
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder="Write your note here..."
            multiline={true}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Display Mode
        
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            {savedNotes.length > 0
              ? savedNotes.map((entry, index) => (
                  <Text key={index}>
                    {entry.note}
                    {"\n\n"}
                  </Text>
                ))
              : "There is nothing in your notes. Tap to add"}
          </Text>
          <TouchableOpacity
            style={styles.addMoreButton}
            onPress={() => setIsEditing(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.addMoreText}>
              {savedNotes.length > 0 ? "Tap to add more" : "Tap to add"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe6eb",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  noteBox: {
    width: "80%",
    minHeight: 100,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  noteText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
  addMoreButton: {
    marginTop: 10,
    backgroundColor: "purple",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  addMoreText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  editContainer: {
    width: "80%",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    fontSize: 16,
    width: "100%",
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    textAlignVertical: "top",
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "purple",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Diary;