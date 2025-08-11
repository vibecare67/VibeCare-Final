import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useUserPreferences } from '../UserPreferencesContext';


const GenderSelectionScreen = ({ navigation, route }) => {
    const { setPreferences } = useUserPreferences();
    const { userId, Email } = route?.params || {};

    const handleGenderSelect = (gender) => {
        setPreferences(prev => ({ ...prev, gender }));
        navigation.navigate("AgeSelectionScreen",{userId,Email});
        console.log(userId,Email);
    };

  return (
    <View style={styles.container}>
      

      {/* App Title */}
      <Text style={styles.title}>VibeCare</Text>

      {/* Choose Gender Heading */}
      <Text style={styles.heading}>Choose Gender</Text>

      {/* Subheading */}
      <Text style={styles.subheading}>
        To give you the best experience possible, we’d like to know a little bit about you.
      </Text>

      {/* Male and Female Options */}
      <View style={styles.genderContainer}>
        {/* Male Option */}
        <TouchableOpacity
          style={styles.genderOption}
          onPress={() => handleGenderSelect("Male")} >

          <Image source={require('../assets/images/male.png')} style={styles.genderImage} />
          <Text style={styles.genderText}>Male</Text>
        </TouchableOpacity>

        {/* Female Option */}
        <TouchableOpacity
          style={styles.genderOption}
           onPress={() => handleGenderSelect("FeMale")} // Replace with actual screen name
        >
          <Image source={require('../assets/images/female.png')} style={styles.genderImage} />
          <Text style={styles.genderText}>Female</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE6E6',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  

  title: {
    fontSize: 48,
    color: '#5c1060',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginVertical: 20,
  },
  subheading: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  genderOption: {
    alignItems: 'center',
  },
  genderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  genderText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default GenderSelectionScreen;
