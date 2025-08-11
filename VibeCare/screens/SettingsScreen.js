import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";

export default function SettingsScreen({ navigation, route }) {
  const { userId } = route.params;

  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [password, setPassword] = useState("");
  const [caretakerEmail, setCaretakerEmail] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalError, setModalError] = useState(false);

  const showModal = (message, isError = false) => {
    setModalMessage(message);
    setModalError(isError);
    setModalVisible(true);
  };

  const hideModal = () => setModalVisible(false);

  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, isDarkTheme ? styles.darkBg : styles.lightBg]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        
        <TouchableOpacity
        
        >
          <Text style={styles.mainTitle}>Settings</Text>
        </TouchableOpacity>

        {/* Edit Profile Card */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("EditProfileScreen", { userId })}
        >
          <Text style={styles.cardTitle}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Dark Theme */}
        <View style={[styles.card, styles.row]}>
          <View>
            <Text style={styles.cardTitle}>Dark Theme</Text>
            <Text style={styles.cardSubTitle}>Toggle light/dark mode</Text>
          </View>
          <Switch
            value={isDarkTheme}
            onValueChange={setIsDarkTheme}
            thumbColor={notificationsEnabled ? "#bf96fa" : "#a266fa"}
            trackColor={{ false: "#bf96fa", true: "#34027d" }}
          />
        </View>

        {/* Set Password */}
        <View style={styles.card}>
            <TouchableOpacity
          onPress={() => navigation.navigate("EditProfileScreen", { userId })}
        ></TouchableOpacity>
          <Text style={styles.cardTitle}>Set App Password</Text>
         
        </View>

        {/* Add Caretaker */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add Your Caretaker</Text>
          
        
        </View>

        {/* Notifications */}
        <View style={[styles.card, styles.row]}>
          <View>
            <Text style={styles.cardTitle}>Enable Notifications</Text>
            <Text style={styles.cardSubTitle}>Receive app alerts & updates</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            thumbColor={notificationsEnabled ? "#bf96fa" : "#a266fa"}
            trackColor={{ false: "#bf96fa", true: "#34027d" }}
          />
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={hideModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, modalError && styles.modalError]}>
            <Text style={[styles.modalText, modalError ? styles.errorText : styles.successText]}>
              {modalMessage}
            </Text>
            <Pressable style={styles.modalButton} onPress={hideModal}>
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  lightBg: { backgroundColor: "#FDE6E6" },
  darkBg: { backgroundColor: "black" },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
mainTitle:{
    margin:20,
    fontSize:40,
    paddingLeft:75,
    fontWeight:'500',
    // paddingTop:50,
    margin:50,
    borderRadius:20,
    backgroundColor:"#FDE6E6",
},
  card: {
    backgroundColor: "#d1b7f7", 
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
    shadowColor: "#4a148c",
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    borderColor:"#7b06cf",
    borderWidth:1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#560027", // soft pink
    marginBottom: 6,
  },

  cardSubTitle: {
    color: "#d1b3e0",
    fontSize: 14,
  },

  input: {
    backgroundColor: "#c098fa", // lighter purple
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#560027",
    marginBottom: 18,
    shadowColor: "#6a1b9a",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  inputDark: {
    backgroundColor: "#6a1b9a",
    color: "#f8bbd0",
  },

  button: {
    backgroundColor: "#a266fa", // pink
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#ec407a",
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
  },

  buttonText: {
    color: "#560027",
    fontWeight: "600",
    fontSize: 18,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(22, 0, 44, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  modalContent: {
    backgroundColor: "#7b1fa2",
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 30,
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    shadowColor: "#4a148c",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
  },

  modalError: {
    backgroundColor: "#b71c1c",
  },

  modalText: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 28,
    color: "#ffd7f0",
  },

  errorText: {
    color: "#ffbaba",
  },

  successText: {
    color: "#d0f0c0",
  },

  modalButton: {
    backgroundColor: "#f48fb1",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 60,
    shadowColor: "#ec407a",
    shadowOpacity: 0.8,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },

  modalButtonText: {
    color: "#560027",
    fontWeight: "900",
    fontSize: 18,
  },
});
