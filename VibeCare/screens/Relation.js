import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useUserPreferences } from '../UserPreferencesContext';

const Relation = ({ navigation , route }) => {
  const { setPreferences } = useUserPreferences();
  const { userId, Email } = route?.params || {};


  const handleRelation = (relationshipStatus) => {
    setPreferences((prev) => ({ ...prev, relationshipStatus }));
    navigation.navigate("LivingSituationPage",{userId,Email});
    console.log(userId,Email);
  };

  const buildOption = ({ iconPath, color, label, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.optionContainer, { backgroundColor: color }]}>
      <Image source={iconPath} style={styles.optionIcon} />
      <Text style={styles.optionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.logo}>VibeCare</Text>
      <Text style={styles.title}>Choose Relationship Status</Text>
      <Text style={styles.subtitle}>
        To give you the best experience possible, {"\n"}we'd like to know a little bit about you.
      </Text>

      {/* Options */}
      <View style={styles.optionsWrapper}>
        {buildOption({
          iconPath: require('../assets/images/single.png'),
          color: '#79aaf7',
          label: 'Single',
          onPress: () => handleRelation("Single"),
        })}
        {buildOption({
          iconPath: require('../assets/images/couple.png'),
          color: 'pink',
          label: 'Married\\ \n In Relationship',
          onPress: () => handleRelation("Married"),
        })}
        {buildOption({
          iconPath: require('../assets/images/divorce.png'),
          color: '#4e8a4e',
          label: 'Divorced\\ \nBreakUp',
          onPress: () => handleRelation("Divorced"),
        })}
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
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
  },
  logo: {
    fontSize: 48,
    color: '#5c1060',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  optionsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  optionContainer: {
    width: 180,
    height: 70,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  optionIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  optionLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Relation;
