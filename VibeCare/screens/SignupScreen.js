import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import { Checkbox } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_BASE_URL} from '../config/api';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

function SignupScreen({ navigation }) {
  const [isChecked, setIsChecked] = useState(false);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [Name, setName] = useState("");
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const [NameError, setNameError] = useState("");
  const [UsernameError, setUsernameError] = useState("");
  const [EmailError, setEmailError] = useState("");
  const [PasswordError, setPasswordError] = useState("");

  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isInteracted, setIsInteracted] = useState(false);

  const validateName = (text) => {
    setName(text);
    if (/^[a-zA-Z\s]+$/.test(text)) {
      setNameError("");
    } else {
      setNameError("Name must only contain letters.");
    }
  };

  const validateUsername = (text) => {
    setUsername(text);
    if (!/\s/.test(text)) {
      setUsernameError("");
    } else {
      setUsernameError("Username should not include spaces.");
    }
  };

  const validateEmail = (text) => {
    setEmail(text);
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text)) {
      setEmailError("");
    } else {
      setEmailError("Enter a valid email address.");
    }
  };

  const validatePassword = (text) => {
    setPassword(text);
    if (text.length >= 8 && /[!@#$%^&*(),.?\":{}|<>]/.test(text)) {
      setPasswordError("");
    } else {
      setPasswordError(
        "Password must be at least 8 characters long and include a special character."
      );
    }
  };
  const userId = `${Username}_${Date.now()}`;

  const handleSignup = async () => {
    if (!isChecked) {
      showAlert("Alert", "You must agree to the terms and conditions to proceed.");
      return;
    }
  
    if (
      NameError ||
      UsernameError ||
      EmailError ||
      PasswordError ||
      !Name ||
      !Username ||
      !Email ||
      !Password
    ) {
      showAlert("Alert", "Please fill all fields correctly before signing up.");
      return;
    }
  
    try {

       const otpResponse = await fetch(`${API_BASE_URL}/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, Email }),
          
        });
        const data = await otpResponse.json();
  
      if (data.status === 'success') {
        navigation.navigate("EmailVerificationSignUp", {
          Name,
          Username,
          Email,
          Password,
        });
      } else {
        showAlert("Error", data.message || "Failed to send OTP."  );
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      showAlert("Error", "An error occurred while sending the OTP. Please try again.");
    }
  };
  
  

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setCustomAlertVisible(true);
  };

  const closeAlert = () => {
    setCustomAlertVisible(false);
  };
  

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("WelcomeScreen")}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {/* App Title */}
      <Text style={styles.title}>
        Vibe<Text style={styles.care}>Care</Text>
      </Text>
      <Text style={styles.subtitle}>Create an account</Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        {/* Name Field */}
        <View style={styles.floatingInputContainer}>
          {(isNameFocused || Name) && (
            <Text style={styles.floatingLabel}>Enter Full Name</Text>
          )}
          <TextInput
            style={[
              styles.input,
              NameError ? { borderColor: "#cc1f1f" } : { borderColor: "#8b3efa" },
            ]}
            placeholder={!isNameFocused ? "Full Name" : ""}
            placeholderTextColor="#aaa"
            value={Name}
            onFocus={() => setIsNameFocused(true)}
            onBlur={() => setIsNameFocused(false)}
            onChangeText={validateName}
          />
          {NameError && <Text style={styles.errorText}>{NameError}</Text>}
        </View>

        {/* Username Field */}
        <View style={styles.floatingInputContainer}>
          {(isUsernameFocused || Username) && (
            <Text style={styles.floatingLabel}>Enter Username</Text>
          )}
          <TextInput
            style={[
              styles.input,
              UsernameError
                ? { borderColor: "#cc1f1f" }
                : { borderColor: "#8b3efa" },
            ]}
            placeholder={!isUsernameFocused ? "Username" : ""}
            placeholderTextColor="#aaa"
            value={Username}
            onFocus={() => setIsUsernameFocused(true)}
            onBlur={() => setIsUsernameFocused(false)}
            onChangeText={validateUsername}
          />
          {UsernameError && <Text style={styles.errorText}>{UsernameError}</Text>}
        </View>

        {/* Email Field */}
        <View style={styles.floatingInputContainer}>
          {(isEmailFocused || Email) && (
            <Text style={styles.floatingLabel}>Enter Email</Text>
          )}
          <TextInput
            style={[
              styles.input,
              EmailError ? { borderColor: "#cc1f1f" } : { borderColor: "#8b3efa" },
            ]}
            placeholder={!isEmailFocused ? "Email" : ""}
            placeholderTextColor="#aaa"
            value={Email}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
            onChangeText={validateEmail}
          />
          {EmailError && <Text style={styles.errorText}>{EmailError}</Text>}
        </View>

        {/* Password Field */}
        <View style={styles.floatingInputContainer}>
          {(isPasswordFocused || Password) && (
            <Text style={styles.floatingLabel}>Enter Password</Text>
          )}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.passwordInput,
                PasswordError
                  ? { borderColor: "#cc1f1f" }
                  : { borderColor: "#8b3efa" },
              ]}
              placeholder={!isPasswordFocused ? "Password" : ""}
              placeholderTextColor="#aaa"
              secureTextEntry={!isPasswordVisible}
              value={Password}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              onChangeText={validatePassword}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Icon
                name={isPasswordVisible ? "eye" : "eye-off"}
                size={24}
                color="#8b3efa"
              />
            </TouchableOpacity>
            
          </View>
          {PasswordError && <Text style={styles.errorText}>{PasswordError}</Text>}
        </View>
      </View>

      {/* Terms and Conditions */}
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={isChecked ? "checked" : "unchecked"}
          onPress={() => setIsChecked(!isChecked)}
          color="#8b3efa"
        />
        <Text style={styles.checkboxText}>
  By signing up, you agree to our Terms of Service and Privacy Policy.{' '}
  <TouchableOpacity onPress={() => navigation.navigate('PrivacyScreen')}>
    <Text style={styles.link}>View Privacy Policies</Text>
  </TouchableOpacity>
</Text>

      </View>

      <Pressable
        onPress={() => setIsInteracted(true)}
        onHoverIn={() => Platform.OS === 'web' && setIsHovered(true)}
        onHoverOut={() => Platform.OS === 'web' && setIsHovered(false)}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={({ pressed }) => [
          styles.button,
          (isHovered || isPressed || isInteracted) && styles.hovered,
          pressed || isPressed ? styles.pressed : null,
        ]}
      >
        <Text style={styles.buttonText}>Tap / Hover to Activate Sign Up</Text>
      </Pressable>

      <TouchableOpacity
        style={[
          styles.signupButton,
          !(isHovered || isInteracted) && { backgroundColor: "#ccc" },
        ]}
        onPress={handleSignup}
        disabled={!(isHovered || isInteracted)}
      >
        <Text style={styles.signupButtonText}>
          {(isHovered || isInteracted) ? "Sign Up" : "Tap or Hover to activate"}
        </Text>
      </TouchableOpacity>

      

      <TouchableOpacity
        style={{ marginTop: 20, alignItems: "center" }}
        onPress={() => navigation.navigate("SigninScreen")}
      >
        <Text style={{ color: "black", fontSize: 12 }}>
          Already started your healing journey?{" "}
          <Text style={{ color: "purple", fontSize: 12, fontWeight: "bold" }}>
            Rejoin us
          </Text>
        </Text>
      </TouchableOpacity>
      
  

      {/* Custom Alert */}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDE6E6",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backArrow: {
    fontSize: 24,
    color: "#4A4A4A",
  },
  title: {
    fontSize: 50,
    color: "#5c1060",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    // marginTop:180,
  },
  care: {
    color: "#5c1060",
  },
  subtitle: {
    fontSize: 20,
    color: "#4A4A4A",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  floatingInputContainer: {
    position: "relative",
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
  link: {
  color: 'purple',
  textDecorationLine: 'underline',
  fontWeight: 'bold',
  fontSize:12,
  top:2,
},
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d1b7f7",
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#8b3efa",
    height:52,  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#4A4A4A",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  checkboxText: {
    fontSize: 14,
    color: "#4A4A4A",
    marginLeft: 10,
    flex: 1,
  },
  signupButton: {
    backgroundColor: "#8b3efa",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    elevation: 5,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#FDE6E6",
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
  errorText: {
    color: "purple",         
    fontSize: 12,          
    marginTop: 1,          
    marginLeft: 10,        
    fontSize:10,
    fontStyle: "italic",   
  },
  button: {
    backgroundColor: '#ce78f0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 4,
    transitionDuration: '200ms',
    marginBottom:20,
    width:220,
    alignItems:'center',
    left:90,

  },
  hovered: {
    backgroundColor: '#dfb6f0',
  },
  pressed: {
    backgroundColor: '#bc40ed',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },

});




export default SignupScreen;
