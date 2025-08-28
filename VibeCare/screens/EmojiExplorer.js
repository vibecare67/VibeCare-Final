import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Animated,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const EMOJI_API = `${API_BASE_URL}/api/emojis`;
const { width } = Dimensions.get('window');

const COLOR_PALETTE = ['#FFD6E8', '#D6F5FF', '#D9FFD9', '#FFF4D6', '#E6D6FF', '#FFE6D6'];

// Utility to darken a hex color
const darkenHexColor = (hex, amount = 20) => {
  let num = parseInt(hex.slice(1), 16);
  let r = Math.max((num >> 16) - amount, 0);
  let g = Math.max(((num >> 8) & 0x00FF) - amount, 0);
  let b = Math.max((num & 0x0000FF) - amount, 0);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
};

const LoadingDots = () => {
  const dotAnimation = useRef(new Animated.Value(0)).current;
  const dots = [0, 1, 2];

  useEffect(() => {
    Animated.loop(
      Animated.timing(dotAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={styles.dotsContainer}>
      {dots.map((i) => {
        const opacity = dotAnimation.interpolate({
          inputRange: [0, 0.33, 0.66, 1],
          outputRange: i === 0 ? [1, 0.3, 0.3, 1] : 
                       i === 1 ? [0.3, 1, 0.3, 0.3] : 
                       [0.3, 0.3, 1, 0.3],
        });
        
        return (
          <Animated.View 
            key={i}
            style={[styles.dot, { opacity }]}
          />
        );
      })}
    </View>
  );
};

const EmojiExplorer = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(EMOJI_API);
      if (res.data && res.data.length > 0) {
        const mainCategories = res.data.slice(0, 12);
        setCategories(mainCategories);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <ImageBackground
        source={require('../assets/images/bgemoji.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingTitle}>📚 Emoji Encyclopedia</Text>
          <LoadingDots />
          <Text style={styles.loadingText}>Loading your emoji universe...</Text>
        </View>
      </ImageBackground>
    );
  }

  const renderItem = ({ item, index }) => {
    const bgColor = COLOR_PALETTE[index % COLOR_PALETTE.length];
    const borderColor = darkenHexColor(bgColor, 30);
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.categoryCard,
          {
            backgroundColor: bgColor,
            borderColor: borderColor,
            borderWidth: 2,
          },
        ]}
        onPress={() => navigation.navigate('SubcategoryScreen', { categoryData: item })}
      >
        <Text style={styles.categoryText}>{item.category}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/images/bgemoji.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>📚 Emoji Encyclopedia</Text>
        <Text style={styles.quote}>"Emotions are the colors of the soul — let's explore them one emoji at a time."</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.darkButton}
            onPress={() => navigation.navigate('EmojiScreen1')}
          >
            <Text style={styles.buttonText}>🎲 Random Emojis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.darkButton}
            onPress={() => navigation.navigate('SearchEmojiScreen')}
          >
            <Text style={styles.buttonText}>🔎 Search Emoji</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.category}-${index}`}
          contentContainerStyle={styles.list}
          numColumns={2}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    marginTop: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
  },
  loadingTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  list: {
    paddingBottom: 32,
  },
  categoryCard: {
    flex: 1,
    padding: 20,
    margin: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 6,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 24,
  },
  darkButton: {
    backgroundColor: '#2C2C2E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
    marginHorizontal: 6,
  },
});

export default EmojiExplorer;