import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import emojis from '../screens/EmojiData';

const EmojiDetailScreen = ({ route, navigation }) => {
    const { emoji } = route.params;
  
    return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: emoji.bgColor }]}>
        <Text style={styles.header}>{emoji.name}</Text>
  
        {/* Detail Image */}
        <Image source={emoji.detailSource} style={styles.emojiDetailImage} />
  
        {/* Description */}
        <Text style={styles.emojiDescription}>{emoji.description}</Text>
  
        {/* Back Button */}
        <TouchableOpacity style={[styles.backButton, { backgroundColor: emoji.btnColor }]} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };
  const styles = StyleSheet.create({
    container: { 
       flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    emojiDetailImage: { 
      width: 150,
      height: 150,
      resizeMode: 'contain',
      marginBottom: 20,
      alignSelf: 'center',
    },
    detailSource: { 
      width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 20,
    alignSelf: 'center',
   },
    header: {
      fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    padding:10,
   },
    emojiDescription: 
    {
      fontSize: 22,
      color: '#FFFFFF',
      textAlign: 'center',
      marginHorizontal: 10,
      marginBottom: 20,
      padding:10,
    },
    backButton: { 
      //  backgroundColor: '#ad20e3',
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 25,
      marginTop: 20,},
    backButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  });
export default EmojiDetailScreen;  