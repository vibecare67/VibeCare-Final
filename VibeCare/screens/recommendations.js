import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '../config/api';

// Helper functions for numeric conversions
const getDepressionLevelNumber = (score) => {
  if (score === null) return -1;
  if (score <= 10) return 0; // "Normal Ups and Downs"
  if (score <= 16) return 1; // "Mild Mood Disturbance"
  if (score <= 20) return 2; // "Borderline clinical depression"
  if (score <= 30) return 3; // "Moderate depression"
  if (score <= 40) return 4; // "Severe depression"
  if (score <= 63) return 5; // "Extreme depression"
  return 0; // default to normal
};

const getStressLevelNumber = (score) => {
  if (score === null) return -1;
  if (score <= 14) return 0; // low
  if (score <= 18) return 1; // moderate
  return 2; // high
};

const getAnxietyLevelNumber = (level) => {
  if (!level) return -1;
  if (typeof level === 'string') {
    if (level.toLowerCase().includes('low')) return 0;
    if (level.toLowerCase().includes('moderate')) return 1;
  }
  return 2; // high
};

const getAgeGroupNumber = (ageGroup) => {
  if (!ageGroup) return -1;
  if (ageGroup.includes('18-25')) return 0;
  if (ageGroup.includes('25-40')) return 1;
  return 2; // 40+
};

const getGenderNumber = (gender) => {
  if (!gender) return -1;
  return gender.toLowerCase().includes('female') ? 1 : 0;
};

const getRelationshipNumber = (status) => {
  if (!status) return -1;
  if (status.toLowerCase().includes('single')) return 0;
  if (status.toLowerCase().includes('married')) return 1;
  return 2; // divorced
};

const getLivingSituationNumber = (situation) => {
  if (!situation) return -1;
  if (situation.toLowerCase().includes('alone')) return 0;
  if (situation.toLowerCase().includes('family')) return 1;
  return 2; // with friends
};

const getDepressionLevelText = (score) => {
  if (score === null) return "Not completed";
  
  if (score <= 10) return "Normal Ups and Downs";
  if (score <= 16) return "Mild Mood Disturbance";
  if (score <= 20) return "Borderline clinical depression";
  if (score <= 30) return "Moderate depression";
  if (score <= 40) return "Severe depression";
  if (score <= 63) return "Extreme depression";
  return "Normal";
};

const getStressLevelText = (score) => {
  if (score === null) return "Not completed";
  
  if (score <= 14) return "Normal";
  if (score <= 18) return "Mild";
  if (score <= 25) return "Moderate";
  if (score <= 34) return "Severe";
  return "Not available";
};

// Model prediction logic
// Model prediction logic - combines both ML model and rule-based recommendations
// Model prediction logic - combines both ML model and rule-based recommendations
const predictRecommendation = async (formData) => {
  try {
    // First get the ML model prediction from the API
    const mlResponse = await axios.post('http://192.168.18.65:5000/predict_suggestion', {
      depression_level: formData.depression_level,
      stress_level: formData.stress_level,
      anxiety_level: formData.anxiety_level,
      age: formData.age,
      gender: formData.gender,
      relationship: formData.relationship,
      living_situation: formData.living_situation
    });

    // Then generate rule-based recommendations
    const severityScore = formData.depression_level * 2 + 
                         formData.stress_level * 1.5 + 
                         formData.anxiety_level * 1.5;

    let ruleBasedRecommendation = "";
    
    if (severityScore >= 8) {
      ruleBasedRecommendation = "Immediate Actions:\n" +
        "• Contact a mental health professional\n" +
        "• Reach out to your support network\n" +
        "• Practice grounding techniques\n\n";
    } else if (severityScore >= 4) {
      ruleBasedRecommendation = "Recommended Actions:\n" +
        "• Schedule a counseling session\n" +
        "• Try daily meditation\n" +
        "• Maintain a mood journal\n\n";
    } else {
      ruleBasedRecommendation = "Wellness Suggestions:\n" +
        "• Practice stress-reduction techniques\n" +
        "• Maintain regular sleep patterns\n" +
        "• Engage in enjoyable activities\n\n";
    }

    // Combine both recommendations
    const combinedRecommendation = 
      "AI-PROVIDED RECOMMENDATION:\n" +
      mlResponse.data.recommendation + "\n\n" +
      "ADDITIONAL SUGGESTIONS BASED ON YOUR ASSESSMENT:\n" +
      ruleBasedRecommendation +
      generateDemographicSuggestions(formData);

    return {
      status: 'success',
      recommendation: combinedRecommendation
    };

  } catch (error) {
    console.error("Prediction error:", error);
    // Fallback to rule-based if API fails
    return generateFallbackRecommendation(formData);
  }
};

// Helper function for demographic-specific suggestions
const generateDemographicSuggestions = (formData) => {
  let suggestions = "";
  
  // Age-specific
  if (formData.age === 0) { // Young
    suggestions += "For your age group:\n" +
      "• Explore campus resources if available\n" +
      "• Limit social media comparison\n" +
      "• Connect with peer groups\n\n";
  } else if (formData.age === 1) { // Adult
    suggestions += "For your age group:\n" +
      "• Prioritize work-life balance\n" +
      "• Schedule regular health check-ups\n" +
      "• Practice time management\n\n";
  } else { // Senior
    suggestions += "For your age group:\n" +
      "• Engage in community activities\n" +
      "• Try gentle exercises\n" +
      "• Maintain social connections\n\n";
  }

  // Gender-specific
  if (formData.gender === 1) { // Female
    suggestions += "Gender-specific considerations:\n" +
      "• Track mood patterns\n" +
      "• Build strong support networks\n" +
      "• Address hormonal factors if relevant\n\n";
  } else if (formData.gender === 0) { // Male
    suggestions += "Gender-specific considerations:\n" +
      "• Be open about emotional needs\n" +
      "• Challenge stereotypes about help-seeking\n" +
      "• Find healthy stress outlets\n\n";
  }

  return suggestions;
};

// Fallback recommendation if API fails
const generateFallbackRecommendation = (formData) => {
  const severityScore = formData.depression_level * 2 + 
                       formData.stress_level * 1.5 + 
                       formData.anxiety_level * 1.5;

  let recommendation = "Our recommendation system is currently unavailable. " +
    "Here are general suggestions based on your assessment:\n\n";

  if (severityScore >= 8) {
    recommendation += "Urgent Recommendations:\n" +
      "1. Contact a mental health professional immediately\n" +
      "2. Reach out to trusted friends/family\n" +
      "3. Practice grounding techniques\n" +
      "4. Ensure your safety\n" +
      "5. Consider therapy options\n\n";
  } else if (severityScore >= 4) {
    recommendation += "Recommended Actions:\n" +
      "1. Schedule a counseling session\n" +
      "2. Try daily meditation\n" +
      "3. Maintain a mood journal\n" +
      "4. Engage in physical activity\n" +
      "5. Practice self-care\n\n";
  } else {
    recommendation += "Wellness Suggestions:\n" +
      "1. Maintain healthy habits\n" +
      "2. Practice stress-reduction\n" +
      "3. Check in with yourself weekly\n" +
      "4. Engage in enjoyable activities\n" +
      "5. Build a support network\n\n";
  }

  recommendation += generateDemographicSuggestions(formData);

  return {
    status: 'success',
    recommendation: recommendation
  };
};


const Recommendations = ({ route }) => {
  const { userId } = route.params;
  const [formData, setFormData] = useState({
    "Depression Level": "",
    "Stress Level": "",
    "Anxiety Level": "",
    "Age Group": "",
    "Gender": "",
    "Relationship Status": "",
    "Living Situation": ""
  });

  const [numericFormData, setNumericFormData] = useState({
    "Depression Level": -1,
    "Stress Level": -1,
    "Anxiety Level": -1,
    "Age Group": -1,
    "Gender": -1,
    "Relationship Status": -1,
    "Living Situation": -1
  });

  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [depressionData, setDepressionData] = useState(null);
  const [anxietyData, setAnxietyData] = useState(null);
  const [stressData, setStressData] = useState(null);

  const motivationalQuotes = [
    "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    "Healing is not linear, but every step forward is progress.",
    "You are stronger than you think, and more capable than you imagine.",
    "The journey of a thousand miles begins with a single step. - Lao Tzu",
    "You don't have to be perfect to be amazing.",
    "Self-care is how you take your power back."
  ];

  const [currentQuote, setCurrentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        
        const preferencesResponse = await fetch(`${API_BASE_URL}/get-user-preferences?userId=${userId}`);
        const preferencesResult = await preferencesResponse.json();
        
        const depressionResponse = await fetch(`${API_BASE_URL}/get-latest-result?userId=${userId}`);
        const depressionResult = await depressionResponse.json();
        
        const anxietyResponse = await fetch(`${API_BASE_URL}/get-latest-anxiety-result?userId=${userId}`);
        const anxietyResult = await anxietyResponse.json();
        
        const stressResponse = await fetch(`${API_BASE_URL}/stress-result/latest/${userId}`);
        const stressResult = await stressResponse.json();

        // Text version for display
        const updatedFormData = {
          "Depression Level": depressionResult.status === "success" 
            ? getDepressionLevelText(depressionResult.result.bdi_score) 
            : "Not completed",
          "Stress Level": stressResult.status === "success" 
            ? getStressLevelText(stressResult.data.stress_level)
            : "Not completed",
          "Anxiety Level": anxietyResult.status === "success"
            ? anxietyResult.result.anxiety_level || "Not available"
            : "Not completed",
          "Age Group": preferencesResult.status === "success" 
            ? preferencesResult.preferences.ageGroup 
            : "Not specified",
          "Gender": preferencesResult.status === "success" 
            ? preferencesResult.preferences.gender 
            : "Not specified",
          "Relationship Status": preferencesResult.status === "success" 
            ? preferencesResult.preferences.relationshipStatus 
            : "Not specified",
          "Living Situation": preferencesResult.status === "success" 
            ? preferencesResult.preferences.livingSituation 
            : "Not specified"
        };

        // Numeric version for API
        const updatedNumericData = {
          "Depression Level": depressionResult.status === "success" 
            ? getDepressionLevelNumber(depressionResult.result.bdi_score)
            : -1,
          "Stress Level": stressResult.status === "success" 
            ? getStressLevelNumber(stressResult.data.stress_level)
            : -1,
          "Anxiety Level": anxietyResult.status === "success"
            ? getAnxietyLevelNumber(anxietyResult.result.anxiety_level)
            : -1,
          "Age Group": preferencesResult.status === "success" 
            ? getAgeGroupNumber(preferencesResult.preferences.ageGroup)
            : -1,
          "Gender": preferencesResult.status === "success" 
            ? getGenderNumber(preferencesResult.preferences.gender)
            : -1,
          "Relationship Status": preferencesResult.status === "success" 
            ? getRelationshipNumber(preferencesResult.preferences.relationshipStatus)
            : -1,
          "Living Situation": preferencesResult.status === "success" 
            ? getLivingSituationNumber(preferencesResult.preferences.livingSituation)
            : -1
        };

        setFormData(updatedFormData);
        setNumericFormData(updatedNumericData);
        
        if (depressionResult.status === "success") setDepressionData(depressionResult.result);
        if (anxietyResult.status === "success") setAnxietyData(anxietyResult.result);
        if (stressResult.status === "success") setStressData(stressResult.data);

        console.log("Numeric form data prepared:", updatedNumericData);

      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to load data");
      } finally {
        setLoadingData(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleSubmit = async () => {
  try {
    setLoading(true);
    
    const predictionData = {
      depression_level: numericFormData["Depression Level"],
      stress_level: numericFormData["Stress Level"],
      anxiety_level: numericFormData["Anxiety Level"],
      age: numericFormData["Age Group"],
      gender: numericFormData["Gender"],
      relationship: numericFormData["Relationship Status"],
      living_situation: numericFormData["Living Situation"]
    };
    
    const result = await predictRecommendation(predictionData);
    setSuggestion(result.recommendation);
    
  } catch (error) {
    Alert.alert("Error", "Failed to generate recommendations");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  if (loadingData) {
    return (
      <View style={styles.loadingContainer}>
        <Image 
          source={require('../assets/images/depbg.mp4')}
          style={styles.loadingImage}
        />
        <ActivityIndicator size="large" color="#6a51ae" />
        <Text style={styles.loadingText}>Preparing your personalized insights...</Text>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"{currentQuote}"</Text>
          <View style={styles.quoteDecoration} />
        </View>

        <View style={styles.mainContent}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Image 
                source={require('../assets/images/depbg.mp4')} 
                style={styles.cardIcon}
              />
              <Text style={styles.sectionHeader}>Your Assessment Results</Text>
            </View>
            
            <View style={styles.infoItem}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Depression Level</Text>
                <View style={styles.infoPill}>
                  <Text style={styles.pillText}>
                    {depressionData ? depressionData.bdi_score : '--'}
                  </Text>
                </View>
              </View>
              <View style={[styles.dataDisplay, styles.depressionDisplay]}>
                <Text style={styles.dataText}>{formData["Depression Level"]}</Text>
                <Text style={styles.numericValue}>Code: {numericFormData["Depression Level"]}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Stress Level</Text>
                <View style={styles.infoPill}>
                  <Text style={styles.pillText}>
                    {stressData ? stressData.stress_level : '--'}
                  </Text>
                </View>
              </View>
              <View style={[styles.dataDisplay, styles.stressDisplay]}>
                <Text style={styles.dataText}>{formData["Stress Level"]}</Text>
                <Text style={styles.numericValue}>Code: {numericFormData["Stress Level"]}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Anxiety Level</Text>
                <View style={styles.infoPill}>
                  <Text style={styles.pillText}>
                    {anxietyData ? (anxietyData.bai_score || anxietyData.score) : '--'}
                  </Text>
                </View>
              </View>
              <View style={[styles.dataDisplay, styles.anxietyDisplay]}>
                <Text style={styles.dataText}>{formData["Anxiety Level"]}</Text>
                <Text style={styles.numericValue}>Code: {numericFormData["Anxiety Level"]}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Image 
                source={require('../assets/images/depbg.mp4')} 
                style={styles.cardIcon}
              />
              <Text style={styles.sectionHeader}>Your Profile</Text>
            </View>
            
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Age Group</Text>
                <View style={styles.gridValue}>
                  <Text style={styles.gridText}>{formData["Age Group"]}</Text>
                  <Text style={styles.numericValueSmall}>Code: {numericFormData["Age Group"]}</Text>
                </View>
              </View>
              
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Gender</Text>
                <View style={styles.gridValue}>
                  <Text style={styles.gridText}>{formData["Gender"]}</Text>
                  <Text style={styles.numericValueSmall}>Code: {numericFormData["Gender"]}</Text>
                </View>
              </View>
              
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Relationship</Text>
                <View style={styles.gridValue}>
                  <Text style={styles.gridText}>{formData["Relationship Status"]}</Text>
                  <Text style={styles.numericValueSmall}>Code: {numericFormData["Relationship Status"]}</Text>
                </View>
              </View>
              
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Living Situation</Text>
                <View style={styles.gridValue}>
                  <Text style={styles.gridText}>{formData["Living Situation"]}</Text>
                  <Text style={styles.numericValueSmall}>Code: {numericFormData["Living Situation"]}</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, (loading || !formData["Depression Level"] || formData["Depression Level"] === "Not completed") && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading || !formData["Depression Level"] || formData["Depression Level"] === "Not completed"}
          >
            <View style={styles.buttonContent}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Image 
                    source={require('../assets/images/depbg.mp4')} 
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.submitButtonText}>Get My Personalized Plan</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          {suggestion !== "" && (
            <View style={[styles.card, styles.suggestionCard]}>
              <View style={styles.cardHeader}>
                <Image 
                  source={require('../assets/images/depbg.mp4')} 
                  style={styles.cardIcon}
                />
                <Text style={styles.sectionHeader}>Your Wellness Plan</Text>
              </View>
              <View style={styles.suggestionContent}>
                <Text style={styles.suggestionText}>{suggestion}</Text>
                <Image 
                  source={require('../assets/images/depbg.mp4')} 
                  style={styles.suggestionDecoration}
                />
              </View>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>You're taking great steps toward wellness!</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#f5f7ff',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7ff',
    padding: 20,
  },
  loadingImage: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#6a51ae',
    fontFamily: 'Avenir-Medium',
  },
  quoteContainer: {
    backgroundColor: 'rgba(106, 81, 174, 0.1)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#6a51ae',
  },
  quoteText: {
    fontSize: 16,
    color: '#4a2cba',
    fontStyle: 'italic',
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'Avenir-Medium',
  },
  quoteDecoration: {
    height: 2,
    width: '30%',
    backgroundColor: '#6a51ae',
    alignSelf: 'center',
    marginTop: 15,
    opacity: 0.5,
  },
  mainContent: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#6a51ae',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: '#6a51ae',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a2cba',
    fontFamily: 'Avenir-Heavy',
  },
  infoItem: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    fontFamily: 'Avenir-Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoPill: {
    backgroundColor: '#e8e0ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a2cba',
    fontFamily: 'Avenir-Heavy',
  },
  dataDisplay: {
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  depressionDisplay: {
    backgroundColor: 'rgba(138, 43, 226, 0.08)',
    borderLeftWidth: 4,
    borderLeftColor: '#8a2be2',
  },
  stressDisplay: {
    backgroundColor: 'rgba(70, 130, 180, 0.08)',
    borderLeftWidth: 4,
    borderLeftColor: '#4682b4',
  },
  anxietyDisplay: {
    backgroundColor: 'rgba(219, 112, 147, 0.08)',
    borderLeftWidth: 4,
    borderLeftColor: '#db7093',
  },
  dataText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Avenir-Medium',
    marginBottom: 5,
  },
  numericValue: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Avenir-Medium',
    fontStyle: 'italic',
  },
  numericValueSmall: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'Avenir-Medium',
    fontStyle: 'italic',
    marginTop: 3,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 15,
  },
  gridLabel: {
    fontSize: 12,
    color: '#777',
    fontFamily: 'Avenir-Medium',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gridValue: {
    backgroundColor: '#f0f0ff',
    padding: 12,
    borderRadius: 10,
  },
  gridText: {
    fontSize: 14,
    color: '#4a2cba',
    fontFamily: 'Avenir-Medium',
  },
  submitButton: {
    backgroundColor: '#6a51ae',
    borderRadius: 15,
    marginVertical: 20,
    overflow: 'hidden',
    shadowColor: '#4a2cba',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonContent: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#fff',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Avenir-Heavy',
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  suggestionCard: {
    marginTop: 10,
  },
  suggestionContent: {
    position: 'relative',
  },
  suggestionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#444',
    fontFamily: 'Avenir-Medium',
  },
  suggestionDecoration: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 80,
    height: 80,
    opacity: 0.1,
  },
  footer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(106, 81, 174, 0.1)',
    borderRadius: 15,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6a51ae',
    fontFamily: 'Avenir-Medium',
    textAlign: 'center',
  },
});

export default Recommendations;