import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
// import API_BASE_URL from '../config/api';
import { API_BASE_URL } from "../config/api";


const API_URL = `${API_BASE_URL}/random-images`;
const { width } = Dimensions.get('window');

console.log("API_BASE_URL =", API_BASE_URL);
console.log("Full API_URL =", API_URL);


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

const CatchesYourEye = () => {
  const navigation = useNavigation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {

  try {
    const url = `${API_BASE_URL}/random-images`;

    const res = await axios.get(url);

    if (res.data && Array.isArray(res.data.data)) {
      console.log("📷 Images array length =", res.data.data.length);
      setImages(res.data.data.slice(0, 5));
    } else {
      setImages([]);
    }
  } catch (error) {
    if (error.response) {
    } else if (error.request) {
    } else {
      console.error("🔴 Axios config error:", error.message);
    }
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageClick = async (img) => {
    console.log("Image ID being sent:", img._id);
    try {
      const res = await axios.get(`${API_BASE_URL}/image-details/${img._id}`);
      if (res.data && res.data.data) {
        navigation.navigate("ResultScreen", { image: res.data.data });
      } else {
        alert("Failed to load image details.");
      }
    } catch (error) {
      console.error("Error fetching image details:", error.message);
      alert("Error fetching details.");
    }
  };
  
  const renderRows = () => {
    if (images.length < 5) return null;
  
    const firstRow = images.slice(0, 2);
    const center = images[2];
    const secondRow = images.slice(3, 5);
  
    return (
      <>
        <View style={styles.row}>
          {firstRow.map((img, index) => (
            <TouchableOpacity key={img._id || index} onPress={() => handleImageClick(img)}>
              <ImageBackground source={{ uri: img.imageUrl }} style={styles.optionButton} />
            </TouchableOpacity>
          ))}
        </View>
  
        <View style={styles.rowCenter}>
          <TouchableOpacity key={center._id || "center"} onPress={() => handleImageClick(center)}>
            <ImageBackground source={{ uri: center.imageUrl }} style={styles.optionButton} />
          </TouchableOpacity>
        </View>
  
        <View style={styles.row}>
          {secondRow.map((img, index) => (
            <TouchableOpacity key={img._id || index} onPress={() => handleImageClick(img)}>
              <ImageBackground source={{ uri: img.imageUrl }} style={styles.optionButton} />
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  };

  if (loading) {
    return (
      <ImageBackground
        source={require("../assets/images/bgeye.png")}
        style={styles.loadingBackground}
        resizeMode="cover"
      >
        <View style={styles.loadingContainer}>
          <Image
            source={require("../assets/images/CatchYoureye.png")}
            style={styles.loadingHeaderImage}
          />
          <Text style={styles.loadingText}>Discovering captivating images...</Text>
          <LoadingDots />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require("../assets/images/bgeye.png")}
        style={styles.topContainer}
        resizeMode="cover"
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("PersonalExplorer")}
            style={styles.backButton}
          >
            <Image
              source={require("../assets/images/back.png")}
              style={styles.arrowBack}
            />
          </TouchableOpacity>
  
          <Image
            source={require("../assets/images/CatchYoureye.png")}
            style={styles.headerImage}
          />
          <Text style={styles.headerTitle}>
            Your personality is as unique as your perspective.
          </Text>
        </View>
      </ImageBackground>
  
      <View style={styles.optionsContainer}>{renderRows()}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDE6E6",
  },
  loadingBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(253, 230, 230, 0.9)',
  },
  loadingHeaderImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 40,
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
  topContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 500,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 50,
  },
  headerContainer: {
    width: "90%",
    padding: 20,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  arrowBack: {
    width: 24,
    height: 24,
    right: 30,
    top: 10,
  },
  headerImage: {
    width: 300,
    height: 300,
    borderRadius: 50,
    marginBottom: 15,
    top: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    padding: 10,
  },
  optionsContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 0,
  },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 0,
  },
  optionButton: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    overflow: "hidden",
    margin: 1,
    borderWidth: 3,
    borderColor: "black",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default CatchesYourEye;