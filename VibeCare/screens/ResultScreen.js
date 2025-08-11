import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

const ResultScreen = () => {
  const route = useRoute();
  const { image } = route.params; // Get image passed from CatchesYourEye
  const [selectedPersonality, setSelectedPersonality] = React.useState(null);

  if (!image) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No image selected.</Text>
      </View>
    );
  }

  const handleOptionClick = (personality) => {
    setSelectedPersonality(personality);
  };

  return (
    <ImageBackground
      source={require('../assets/images/bg1.jpg')}
      style={styles.backgroundImage}
    >
      {selectedPersonality && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Your Personality:</Text>
          <Text style={styles.resultText}>{selectedPersonality}</Text>
        </View>
      )}

      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>
          "What you see is not always what it seems. Every perspective holds a story."
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.transparentBox}>
          <Image source={{ uri: image.imageUrl }} style={styles.treeImage} />
          <Text style={styles.instructionText}>What catches your eye first?</Text>
          {image.options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={styles.optionBtn}
              onPress={() => handleOptionClick(opt.personality)}
            >
              <Text style={styles.optionText}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    paddingTop: 60,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 150,
  },
  quoteBox: {
    width: '90%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    padding: 15,
    alignSelf: 'center',
    marginBottom: 10,
  },
  quoteText: {
    color: '#FFF',
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#FFF',
    padding: 20,
    margin: 10,
    borderRadius: 15,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 18,
    color: '#333',
  },
  transparentBox: {
    width: '90%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  treeImage: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    marginVertical: 10,
  },
  optionBtn: {
    backgroundColor: '#ffffff99',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 6,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default ResultScreen;
