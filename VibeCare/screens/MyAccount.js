import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Icons library

const MyAccount = ({ username = 'User' }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* App Title */}
      <Text style={styles.title}>VibeCare</Text>

      {/* Greeting Section */}
      <Text style={styles.greeting}>Hello, {username}</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonContainer1}>
          <ActionButton
            title="Edit Your Profile"
            icon="create-outline"
            onPress={() => navigation.navigate('EditProfile')}
          />
        </View>
        <View style={styles.buttonContainer2}>
          <ActionButton
            title="Login"
            icon="log-in-outline"
            onPress={() => navigation.navigate('SigninScreen')}
          />
        </View>
        <View style={styles.buttonContainer3}>
          <ActionButton
            title="Register"
            icon="person-add-outline"
            onPress={() => navigation.navigate('SignupScreen')}
          />
        </View>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()} // Navigate back to the previous screen
      >
        <Ionicons name="arrow-back-outline" size={24} color="white" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const ActionButton = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Ionicons name={icon} size={24} color="#E792CB" />
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E792CB', // Pink background
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#5c1060',
    marginBottom: 5,
    textAlign: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  buttonContainer1: {
    backgroundColor: '#eac5f0',
    padding: 1,
    borderRadius: 20,
    margin: 10,
    borderWidth:2,
    borderColor:'#e56df7',
  },
  buttonContainer2: {
    backgroundColor: '#82bce8',
    padding: 1,
    borderRadius: 20,
    margin: 10,
    borderWidth:2,
    borderColor:'#0d6eb8',

  },
  buttonContainer3: {
    backgroundColor: '#f5bba6',
    padding: 1,
    borderRadius: 20,
    margin: 10,
    borderWidth:2,
    borderColor:'#c75f3a',
   
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E792CB',
    marginLeft: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white', 
    padding: 15,
    borderRadius: 25,
    position: 'absolute',
    bottom: 50, 
    alignSelf: 'center',
    width: '60%',
    borderWidth:2,
    borderColor:'#ccc2be',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E792CB',
    marginLeft: -30,

  },
});

export default MyAccount;
