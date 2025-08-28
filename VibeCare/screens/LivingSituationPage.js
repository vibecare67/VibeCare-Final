import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { useUserPreferences } from '../UserPreferencesContext';
import { API_BASE_URL } from '../config/api';

const LivingSituationPage = ({ navigation, route }) => {
  const { preferences } = useUserPreferences();
  const { userId } = route.params || {};  

  const [showDialog, setShowDialog] = useState(false);

  // ✅ Function to close the dialog
  const closeDialog = () => {
    setShowDialog(false);
    navigation.replace("SigninScreen", { userId });
  };

  const handleLivingSituationSelect = async (livingSituation) => {
    const fullPreferences = { ...preferences, livingSituation, userId };

    try {
      const response = await fetch(`${API_BASE_URL}/save-preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullPreferences),
      });

      const data = await response.json();
      if (data.status === "success") {
        console.log("Preferences saved successfully!");
        setShowDialog(true); 
      }
    } catch (error) {
      console.error("Error:", error);
    }
    console.log("Saving preferences for userId:", userId);

  };

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.logo}>VibeCare</Text>
      <Text style={styles.title}>Choose Living Situation</Text>
      <Text style={styles.subtitle}>
        To give you the best experience possible,{"\n"}we'd like to know a little bit about you.
      </Text>

      {/* Options */}
      <View style={styles.optionsWrapper}>
        {buildOption({
          iconPath: require('../assets/images/alone.png'),
          color: '#db7d91',
          label: 'Alone',
          onPress: () => handleLivingSituationSelect('Alone'),
        })}
        {buildOption({
          iconPath: require('../assets/images/family.png'),
          color: 'pink',
          label: 'With family',
          onPress: () => handleLivingSituationSelect('With family'),
        })}
        {buildOption({
          iconPath: require('../assets/images/friends.png'),
          color: '#a795c9',
          label: 'With friends',
          onPress: () => handleLivingSituationSelect('With friends'),
        })}
      </View>

      {/* Success Dialog */}
      <Modal
        visible={showDialog}
        transparent={true}
        animationType="slide"
        onRequestClose={closeDialog}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.dialogTitle}>Preferences Added Successfully.</Text>
            <Text style={styles.dialogQuote}>
              “Your journey to heal begins today. It's okay not to be okay.”
            </Text>
            <View style={styles.dialogDivider} />
            <Text style={styles.dialogMessage}>
              Let's begin ...
            </Text>
            <TouchableOpacity style={styles.okButton} onPress={closeDialog}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Reusable function for option buttons
const buildOption = ({ iconPath, color, label, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.optionContainer, { backgroundColor: color }]}
  >
    <View style={styles.optionContent}>
      <Image source={iconPath} style={styles.optionIcon} />
      <Text style={styles.optionLabel}>{label}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE6E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBar: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'column',
    alignItems: 'center',
  },
  optionContainer: {
    width: 300,
    height: 70,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIcon: {
    width: 30,
    height: 30,
  },
  optionLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FDE6E6',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  dialogTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'purple',
    textAlign: 'center',
    fontFamily: 'Cursive',
  },
  dialogQuote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#000',
    textAlign: 'center',
    marginVertical: 20,
  },
  dialogDivider: {
    width: '100%',
    height: 1.5,
    backgroundColor: 'purple',
    marginVertical: 20,
  },
  dialogMessage: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: 'purple',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  okButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LivingSituationPage;