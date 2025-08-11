import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { useUserPreferences } from '../UserPreferencesContext';

const AgeSelectionScreen = ({ navigation ,route}) => {
  const ageOptions = [
    { label: '18–25', image: require('../assets/images/M1.png'), backgroundColor: '#E4F3F6' },
    { label: '25–40', image: require('../assets/images/M2.png'), backgroundColor: '#FBD9D9' },
    { label: '40+', image: require('../assets/images/M3.png'), backgroundColor: '#E7DFF6' },
  ];

  const { setPreferences } = useUserPreferences();
  const { userId, Email } = route?.params || {};

  const handleAgeSelect = (ageGroup) => {
    setPreferences(prev => ({ ...prev, ageGroup }));
    navigation.navigate("Relation",{userId,Email});
    console.log(userId,Email);
  };

  const renderAgeOption = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleAgeSelect(item.label)}
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

export default AgeSelectionScreen;
