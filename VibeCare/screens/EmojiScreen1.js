import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Animated,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const EMOJI_API = `${API_BASE_URL}/api/emojis`;
const { width } = Dimensions.get('window');

const EmojiScreen1 = ({ navigation }) => {
  const [randomEmojis, setRandomEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchRandomEmojis = async () => {
      try {
        const response = await axios.get(EMOJI_API);
        if (response.data && Array.isArray(response.data)) {
          const allEmojis = response.data.flatMap(category =>
            category.subcategories.flatMap(subcategory =>
              subcategory.emojis && Array.isArray(subcategory.emojis) ? subcategory.emojis : []
            )
          );
          const randomEmojis = allEmojis.sort(() => Math.random() - 0.5).slice(0, 5);
          setRandomEmojis(randomEmojis);
        }
      } catch (error) {
        console.error('Error fetching random emojis:', error);
      } finally {
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    };

    fetchRandomEmojis();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA000" />
        <Text style={styles.loadingText}>Keep calm{'\n'}and carry on</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/images/random2.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>🎲 Random Emojis</Text>

        <View style={styles.topContainer}>
          <ImageBackground
            source={require('../assets/images/random7.jpg')}
            style={styles.boxBackground}
            imageStyle={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
          >
            {randomEmojis.length === 0 ? (
              <Text style={styles.error}>No emojis found!</Text>
            ) : (
              <Animated.FlatList
                data={randomEmojis}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('SubcategoryDetails', { emojiData: item })
                    }
                    style={styles.emojiContainer}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.emoji}>{item.emoji}</Text>
                    <Text style={styles.emojiLabel}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => `${item.emoji}-${index}`}
                contentContainerStyle={styles.emojiList}
                showsVerticalScrollIndicator={false}
                style={{ opacity: fadeAnim }}
              />
            )}
          </ImageBackground>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 248, 220, 0.6)',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FF6B00',
    borderBottomWidth: 2,
    borderBottomColor: '#FFA000',
    width: '60%',
    alignSelf: 'center',
    paddingBottom: 5,
    top: 80,
  },
  topContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginTop: 80,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxBackground: {
    width: '100%',
    paddingTop: 20,
    alignItems: 'center',
  },
  emojiContainer: {
    backgroundColor: '#FFF3E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: '100%',
    alignSelf: 'center',
  },
  emoji: {
    fontSize: 64,
  },
  emojiLabel: {
    fontSize: 16,
    color: '#5D4037',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  emojiList: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default EmojiScreen1;
