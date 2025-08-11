import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  closeAlert,

} from "react-native";
import { useNavigation } from "@react-navigation/native";

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

const AdminSignIn = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const [customAlertVisible, setCustomAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    

  const handleLogin = () => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      showCustomAlert("Login Successful", "Welcome, Admin!", () => {
        navigation.navigate("admindashboard");
      });
    } else {
      showCustomAlert("Login Failed", "Invalid Admin-name or Password");
    }
  };
  const showCustomAlert = (title, message, onPress = null) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setCustomAlertVisible(true);
  
    // Optional callback for actions (like navigation)
    if (onPress) {
      setTimeout(() => {
        onPress();
        closeAlert();
      }, 1500); // Delay to show alert before action
    }
  };
  
  const closeAlert = () => {
    setCustomAlertVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Portal</Text>
      <Text style={styles.subtitle}>Sign in to your admin account</Text>
      <View style={styles.inputContainer}>
        {(isUsernameFocused || username) && (
          <Text style={styles.floatingLabel}>Admin-name</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder={!isUsernameFocused ? "Admin-name" : ""}
          placeholderTextColor="#aaa"
          value={username}
          onFocus={() => setIsUsernameFocused(true)}
          onBlur={() => setIsUsernameFocused(false)}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        {(isPasswordFocused || password) && (
          <Text style={styles.floatingLabel}>Password</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder={!isPasswordFocused ? "Password" : ""}
          placeholderTextColor="#aaa"
          value={password}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.signinButton} onPress={handleLogin}>
        <Text style={styles.signinButtonText}>Sign In</Text>
      </TouchableOpacity>
       <Modal
              visible={customAlertVisible}
              transparent
              animationType="fade"
              onRequestClose={closeAlert}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.alertBox}>
                  <Text style={styles.alertTitle}>{alertTitle}</Text>
                  <Text style={styles.alertMessage}>{alertMessage}</Text>
                  <TouchableOpacity style={styles.alertButton} onPress={closeAlert}>
                    <Text style={styles.alertButtonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDE6E6",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 50,
    color: "#5c1060",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: "#4A4A4A",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    position: "relative",
    width: "100%",
    marginBottom: 15,
  },
  floatingLabel: {
    position: "absolute",
    top: -10,
    left: 15,
    fontSize: 12,
    color: "#8b3efa",
    backgroundColor: "#FDE6E6",
    paddingHorizontal: 5,
    zIndex: 1,
  },
  input: {
    width: "100%",
    backgroundColor: "#d1b7f7",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#4A4A4A",
    elevation: 3,
    borderWidth: 1,
    borderColor: "#8b3efa",
  },
  signinButton: {
    backgroundColor: "#8b3efa",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    elevation: 5,
    paddingHorizontal: 100, 
  },
  signinButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  alertBox: {
    width: "80%",
    backgroundColor: "#fff",
    // borderRadius: 20,
    padding: 20,
    alignItems: "center",
    // backgroundColor: "#FDE6E6",
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  alertMessage: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: "#8b3efa",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  alertButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AdminSignIn;
