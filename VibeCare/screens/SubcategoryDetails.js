import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import FlipCard from 'react-native-flip-card';

const screenWidth = Dimensions.get('window').width;
const pastelColors = [
  '#FFEBEE',
  '#E8F5E9',
  '#E3F2FD',
  '#FFF8E1',
  '#F3E5F5',
  '#E0F7FA',
  '#FCE4EC',
];

const getBorderColor = (color) => {
  const shade = 30;
  return color
    .replace(/^#/, '')
    .match(/.{2}/g)
    .map((c) => Math.max(0, parseInt(c, 16) - shade).toString(16).padStart(2, '0'))
    .reduce((acc, c) => acc + c, '#');
};

const SubcategoryDetails = ({ route }) => {
  const { emojiData } = route.params;

  const sections = [
    { title: ' Can You Guess What I’m Saying?', content: emojiData.expression },
    { title: ' Here’s What I Think About You', content: emojiData['what i say about you'] },
    { title: ' Feel My Vibe? This is What I Mean', content: emojiData['what i mean emotionally'] },
    { title: ' My Worldwide Adventures', content: emojiData['how i travel around the world'] },
    { title: ' The Perfect Time to Use Me', content: emojiData['use me when'] },
    { title: ' Ready for a Fun Little Challenge?', content: emojiData.challenge },
    { title: ' Did You Know This About Me?', content: emojiData.fun_fact },
  ];

  // State for section flips
  const [flippedSections, setFlippedSections] = useState(
    Array(sections.length).fill(false)
  );

  // State for friend flips
  const [flippedFriends, setFlippedFriends] = useState(
    Array(emojiData['my emoji friends'].length).fill(false)
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.emoji}>{emojiData.emoji}</Text>
      <Text style={styles.name}>{emojiData.name}</Text>

      {/* Sections */}
      {sections.map((section, index) => {
        if (!section.content) return null;

        const bgColor = pastelColors[index % pastelColors.length];
        const borderColor = getBorderColor(bgColor);

        return (
          <FlipCard
            key={index}
            style={styles.cardFlip}
            flip={flippedSections[index]}
            flipHorizontal={true}
            flipVertical={false}
          >
            <TouchableOpacity
              style={[styles.card, { backgroundColor: bgColor, borderColor }]}
              onPress={() => {
                const newFlips = [...flippedSections];
                newFlips[index] = !newFlips[index];
                setFlippedSections(newFlips);
              }}
            >
              <Text style={styles.cardTitle}>{section.title}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, { backgroundColor: bgColor, borderColor }]}
              onPress={() => {
                const newFlips = [...flippedSections];
                newFlips[index] = !newFlips[index];
                setFlippedSections(newFlips);
              }}
            >
              <Text style={styles.cardContent}>{section.content}</Text>
            </TouchableOpacity>
          </FlipCard>
        );
      })}

      {/* Emoji Friends */}
      {emojiData['my emoji friends'].map((friend, index) => {
        const bgColor = pastelColors[(index + 2) % pastelColors.length];
        const borderColor = getBorderColor(bgColor);

        const isLastThree = index >= emojiData['my emoji friends'].length - 3;

        const card = (
          <FlipCard
            key={index}
            style={[styles.cardFlipFriend, isLastThree && styles.lastRowCard]}
            flip={flippedFriends[index]}
            flipHorizontal={true}
            flipVertical={false}
          >
            <TouchableOpacity
              style={[styles.card, { backgroundColor: bgColor, borderColor }]}
              onPress={() => {
                const newFlips = [...flippedFriends];
                newFlips[index] = !newFlips[index];
                setFlippedFriends(newFlips);
              }}
            >
              <Text style={styles.FriendcardTitle}>{friend.emoji}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, { backgroundColor: bgColor, borderColor }]}
              onPress={() => {
                const newFlips = [...flippedFriends];
                newFlips[index] = !newFlips[index];
                setFlippedFriends(newFlips);
              }}
            >
              <Text style={styles.cardContent}>{friend.description}</Text>
            </TouchableOpacity>
          </FlipCard>
        );

        return isLastThree ? null : card;
      })}

      <TouchableOpacity>
        <Text style={styles.sectionTitle}>My emoji friends</Text>
      </TouchableOpacity>

      <View style={styles.rowContainer}>
        {emojiData['my emoji friends']
          .slice(-3)
          .map((friend, index) => {
            const bgColor = pastelColors[(index + 5) % pastelColors.length];
            const borderColor = getBorderColor(bgColor);

            const realIndex = emojiData['my emoji friends'].length - 3 + index;

            return (
              <FlipCard
                key={`last-${index}`}
                style={[styles.cardFlipFriend, styles.lastRowCard]}
                flip={flippedFriends[realIndex]}
                flipHorizontal={true}
                flipVertical={false}
              >
                <TouchableOpacity
                  style={[styles.card, { backgroundColor: bgColor, borderColor }]}
                  onPress={() => {
                    const newFlips = [...flippedFriends];
                    newFlips[realIndex] = !newFlips[realIndex];
                    setFlippedFriends(newFlips);
                  }}
                >
                  <Text style={styles.FriendcardTitle}>{friend.emoji}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.card, { backgroundColor: bgColor, borderColor }]}
                  onPress={() => {
                    const newFlips = [...flippedFriends];
                    newFlips[realIndex] = !newFlips[realIndex];
                    setFlippedFriends(newFlips);
                  }}
                >
                  <Text style={styles.cardContent}>{friend.description}</Text>
                </TouchableOpacity>
              </FlipCard>
            );
          })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: 10,
    shadowColor: '#999',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    minWidth: 100,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A148C',
    textAlign: 'center',
    marginBottom: 25,
  },
  cardFlip: {
    width: screenWidth * 0.90,
    height: 95,
    marginBottom: 12,
  },
  cardFlipFriend: {
    width: screenWidth * 0.15,
    height: 100,
    marginBottom: 16,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '300',
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 28,
  },
  FriendcardTitle: {
    fontSize: 26,
    fontWeight: '300',
    color: '#333',
    textAlign: 'center',
    lineHeight: 28,
  },
  cardContent: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 16,
    textAlign: 'center',
    color: '#6A1B9A',
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  lastRowCard: {
    width: '90%',
    height: 100,
    marginBottom: 16,
  },
});

export default SubcategoryDetails;
