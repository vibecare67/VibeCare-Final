import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert } from 'react-native';

const AgeFPage = ({ navigation, route }) => {
  const { userId } = route.params || {}; // Get userId from route params

  const ageOptions = [
    { label: '18–25', image: require('../assets/images/F1.png'), backgroundColor: '#E4F3F6' },
    { label: '25–40', image: require('../assets/images/F2.png'), backgroundColor: '#FBD9D9' },
    { label: '40+', image: require('../assets/images/F3.png'), backgroundColor: '#E7DFF6' },
  ];

  const handleAgeSelect = async (age) => {
    if (!userId) {
      Alert.alert("Error", "User ID is missing.");
      return;
    }

    try {
      const response = await fetch('http://your-server-ip:3000/save-age', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, age }),
      });

      const data = await response.json();
      if (data.status === "success") {
        navigation.navigate("Relation", { userId: data.userId });
      } else {
        Alert.alert("Error", "Failed to save age.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save age.");
    }
  };

  const renderAgeOption = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleAgeSelect(item.label)} // Corrected function call
      style={[styles.ageOption, { backgroundColor: item.backgroundColor }]}
    >
      <Image source={item.image} style={styles.ageImage} />
      <Text style={styles.ageLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.logo}>VibeCare</Text>
        <Text style={styles.title}>Choose Age</Text>
        <Text style={styles.subtitle}>
          To give you the best experience possible, {'\n'}we’d like to know a little bit about you.
        </Text>

        <FlatList
          data={ageOptions}
          renderItem={renderAgeOption}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE9E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '90%',
    padding: 16,
    borderRadius: 20,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    color: '#5c1060',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4A4A',
    textAlign: 'center',
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
  gridContainer: {
    justifyContent: 'center',
  },
  ageOption: {
    margin: 8,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    width: 120,
  },
  ageImage: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  ageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A4A4A',
    textAlign: 'center',
  },
});

export default AgeFPage;
