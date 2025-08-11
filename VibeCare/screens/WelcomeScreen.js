import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleAdminLogin = () => {
    setShowDropdown(false);
    navigation.navigate('AdminSignIn');
  };

  const handleCaretakerLogin = () => {
    setShowDropdown(false);
    navigation.navigate('CaretakerSignIn'); // Make sure this screen exists in navigation
  };

  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        source={require('../assets/images/welcome.mp4')} // Path to your video file
        style={StyleSheet.absoluteFill} // Makes the video cover the whole screen
        resizeMode="cover" // Ensures the video covers the screen properly
        shouldPlay // Automatically play the video
        isLooping // Loop the video
        isMuted // Mutes the video audio
        useNativeControls={false} // Disable native controls
      />

      {/* Semi-Transparent Overlay */}
      <View style={styles.overlay} />

        {/* Admin Icon with Dropdown */}
      <View style={styles.adminContainer}>
        <TouchableOpacity style={styles.adminButton} onPress={toggleDropdown}>
          <Image source={require('../assets/images/admin-panel.png')} style={styles.adminImage} />
        </TouchableOpacity>

        {showDropdown && (
          <View style={styles.dropdown}>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleAdminLogin}>
              <Text style={styles.dropdownText}>Login as Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleCaretakerLogin}>
              <Text style={styles.dropdownText}>Login as Caretaker</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* App Title */}
        <Text style={styles.title}>VibeCare</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Be Kind to Your Mind</Text>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => navigation.navigate('SignupScreen')}
        >
          <Text style={styles.buttonText}>Create an Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate('SigninScreen')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('InfoScreen')}>
          <Text style={styles.link}>Continue Without Account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent black overlay
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 50,
  },
  title: {
    fontFamily: 'Cursive',
    fontSize: 60,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#d1c4e9',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonPrimary: {
    backgroundColor: '#8b3efa',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5, // Adds shadow for Android
  },
  buttonSecondary: {
    backgroundColor: '#d1b7f7',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,   marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },localStoragebuttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    color: '#d1c4e9',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginTop: 20,
  },
  adminButton: {
    position: 'absolute',
    top: 50, // Adjust as needed
    right: 20, // Adjust as needed
    zIndex: 10, // Ensures it's above everything
  },
  adminImage: {
    height: 30,
    width: 30,
    // top:-30,
    resizeMode: 'contain',
  },
  adminContainer: {
  position: 'absolute',
  top: 10,
  right: 0,
  zIndex: 20,
  alignItems: 'flex-end',
},
dropdown: {
  backgroundColor: '#d6ccde',
  borderRadius: 8,
  marginTop: 75,
  right:40,
  paddingVertical: 5,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 5,
  elevation: 10,
  borderWidth: 1,
  borderColor: "#bc9cd6",

},
dropdownItem: {
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderBottomColor:"#bc9cd6",
  
},
dropdownText: {
  fontSize: 14,
  color: '#333',
},

});

export default WelcomeScreen;