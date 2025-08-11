import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';

const { width } = Dimensions.get('window');


const CATEGORY_VIDEOS = {
  'HAPPY AND POSITIVE': require('../assets/images/1happy.mp4'),
  'SAD AND EMOTIONAL': require('../assets/images/2sad2.mp4'),
  'ANGRY & FRUSTRATED': require('../assets/images/3angry.mp4'),
  'LOVE & ROMANCE': require('../assets/images/4love.mp4'),
  'SURPRISED & SHOCKED': require('../assets/images/5shocked.mp4'),
  'FEAR & ANXIETY': require('../assets/images/7fear.mp4'),
  'MISCHIEVOUS & PLAYFUL': require('../assets/images/7playful.mp4'),
  'SLEEPY & TIRED': require('../assets/images/8sleepy.mp4'),
  'SICK & UNWELL': require('../assets/images/9sick.mp4'),
  'CONFUSION & INDECISION': require('../assets/images/10confusion.mp4'),
  'COMMUNICATION & GESTURE': require('../assets/images/11comm.mp4'),
  'OBJECTS & SYMBOLS': require('../assets/images/12objects.mp4'),
};

const SubcategoryScreen = ({ route, navigation }) => {
  const { categoryData } = route.params;
  const videoSource = CATEGORY_VIDEOS[categoryData.category] || require('../assets/images/welcome.mp4');
  console.log('Category:', categoryData.category);

  return (
    <View style={styles.container}>
      <Video
        source={videoSource}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted
      />

      <View style={styles.overlay}>
        <ScrollView>
          <Text style={styles.title}>{categoryData.category}</Text>

          {categoryData.subcategories.map((subcat, index) => (
            <View key={index} style={styles.subcategoryContainer}>
              <Text style={styles.subcategoryTitle}>{subcat.subcategory}</Text>
              <FlatList
                data={subcat.emojis}
                horizontal
                keyExtractor={(item, idx) => item.emoji + idx}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('SubcategoryDetails', {
                        emojiData: item,
                        mainCategory: categoryData.category,
                      })
                    }
                    style={styles.emojiCard}
                  >
                    <Text style={styles.emoji}>{item.emoji}</Text>
                    <Text style={styles.emojiName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subcategoryContainer: {
    marginBottom: 30,
  },
  subcategoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#007AFF',
    paddingLeft: 10,
  },
  emojiCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    width: 100,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 36,
  },
  emojiName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    color: '#444',
  },
});

export default SubcategoryScreen;
