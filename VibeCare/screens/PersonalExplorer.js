import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PersonalExplorer = ({navigation, route} ) => {
  const { userId } = route.params; // Access userId from navigation params
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
 console.log("UserId in personal Explorer screen:",userId);

  return (
    <ImageBackground
      source={require('../assets/images/PerExp.png')} // Replace with the correct path to your image
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ExploreScreen',{userId})}
          style={styles.backButton}
        >
          <Image
            source={require('../assets/images/back.png')} // Ensure this path is correct
            style={styles.arrowBack}
          />
        </TouchableOpacity>

        {/* Button 1 */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'transparent' }]} // Transparent background
          onPress={() => navigation.navigate('CatchesYourEye')}
        >
          <Text style={styles.buttonText}>What catches your eyes first?</Text>
        </TouchableOpacity>

        {/* Button 2 */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'transparent' }]} // Transparent background
          onPress={() => navigation.navigate('EmojiExplorer')}
        >
          <Text style={styles.buttonText}>Emoji Encyclopedia</Text>
        </TouchableOpacity>

        {/* Button 3 */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'transparent' }]} // Transparent background
          onPress={() => navigation.navigate('Dairy',{userId})}
        >
          <Text style={styles.buttonText}>Write what's in your mind</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  arrowBack: {
    width: 24,
    height: 24,
  },
  button: {
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 25,
    borderWidth: 2, // Border width for highlighted borders
    borderColor: 'black', // Black border color
    alignItems: 'center',
    width: 280,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});

export default PersonalExplorer;
