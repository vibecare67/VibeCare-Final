import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import axios from 'axios';
import { Video } from 'expo-av';
import { API_BASE_URL } from '../config/api';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const questions = [
  { key: 'numbness', statement: 'Do you feel numbness in your body?' },
  { key: 'wobbliness', statement: 'Do you experience wobbliness or unsteadiness?' },
  { key: 'afraidofworsthappening', statement: 'Do you often fear something bad will happen?' },
  { key: 'heartpounding', statement: 'Do you notice your heart pounding?' },
  { key: 'unsteadyorunstable', statement: 'Do you feel physically unstable or unsteady?' },
  { key: 'terrified', statement: 'Do you feel terrified without reason?' },
  { key: 'handstrembling', statement: 'Do your hands tremble or shake?' },
  { key: 'shakystate', statement: 'Do you feel like your body is in a shaky state?' },
  { key: 'difficultyinbreathing', statement: 'Do you have difficulty in breathing?' },
  { key: 'scared', statement: 'Do you feel scared often?' },
  { key: 'hotorcoldsweats', statement: 'Do you get hot or cold sweats?' },
  { key: 'faceflushed', statement: 'Do you notice your face flushing?' },
];

const optionLabels = {
  0: 'Not at all',
  1: 'A little bit',
  2: 'Quite a bit',
  3: 'Extremely',
};

const AnxietyScreen = ({ navigation, route }) => {
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [timeoutModal, setTimeoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultHandled, setResultHandled] = useState(false);
  const [timerCount, setTimerCount] = useState(0);
  const { userId, depressionScore } = route.params || {};
  const [baiScore, setBaiScore] = useState(null);
  const [anxietyLevel, setAnxietyLevel] = useState(null);

  const timerRef = useRef(null);
  const videoRef = useRef(null);

  const softColors = ['#E8F6EF', '#FFF4E3', '#FCE1E4', '#E6F7FF', '#FAF3DD', '#E2F0CB', '#F9DFDC', '#E4F9F5', '#FFF0F5', '#F0F5FF', '#F0FFF0', '#FFFACD'];
  const [pausedAt, setPausedAt] = useState(null);

  // Calculate BAI score from answers
  const calculateBaiScore = (answers) => {
    return Object.values(answers).reduce((sum, value) => sum + (parseInt(value) || 0), 0);
  };

  // Determine anxiety level based on BAI score
  const determineAnxietyLevel = (score) => {
    if (score <= 21) return 'Low Anxiety Level';
    if (score <= 35) return 'Moderate Anxiety Level';
    return 'High Anxiety Level';
  };

  const storeResultInDB = async (bai_score, anxiety_level) => {
    try {
      const response = await fetch(`${API_BASE_URL}/anxiety-result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          bai_score,
          anxiety_level,
          createdAt: new Date().toISOString()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to store result:", data.message || "Unknown error");
        throw new Error(data.message || "Failed to store result");
      }
      return data;
    } catch (error) {
      console.error("Error storing result:", error.message);
      throw error;
    }
  };

  const startTimer = (initialCount = 0) => {
    clearInterval(timerRef.current);
    let count = initialCount;
    setTimerCount(count);

    timerRef.current = setInterval(() => {
      count += 1;
      setTimerCount(count);

      if (count === 60) {
        clearInterval(timerRef.current);
        setPausedAt(50);
        setAlertMsg('Hurry up! 5 seconds left.');
        setShowAlert(true);
      } else if (count === 8) {
        clearInterval(timerRef.current);
        setPausedAt(20);
        setAlertMsg('Only 2 seconds left!');
        setShowAlert(true);
      } else if (count >= 10) {
        clearInterval(timerRef.current);
        setTimeoutModal(true);
      }
    }, 6000);
  };

  useEffect(() => {
    if (currentIndex < questions.length) {
      startTimer();
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [currentIndex]);

  useEffect(() => {
    if (currentIndex >= questions.length && !resultHandled) {
      handleSubmit();
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (inputValue === '' || isNaN(inputValue) || inputValue < 0 || inputValue > 3) {
      setAlertMsg('Please select an option.');
      setShowAlert(true);
      return;
    }
    const key = questions[currentIndex].key;
    setAnswers(prev => ({ ...prev, [key]: parseInt(inputValue) }));
    setInputValue('');
    setCurrentIndex(prev => prev + 1);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setInputValue('');
    setTimeoutModal(false);
    setResultHandled(false);
    setShowResult(false);
    startTimer(0);
  };

  const handleExit = () => {
    setTimeoutModal(false);
    navigation.navigate('WellBeingPage', { userId, depressionScore });
  };

  const handleSubmit = async () => {
    if (resultHandled) return;
    setResultHandled(true);
    setLoading(true);

    try {
      // Calculate BAI score and anxiety level
      const calculatedBaiScore = calculateBaiScore(answers);
      const calculatedAnxietyLevel = determineAnxietyLevel(calculatedBaiScore);
      
      setBaiScore(calculatedBaiScore);
      setAnxietyLevel(calculatedAnxietyLevel);

      // Prepare data for prediction
      const data = {
        Gender: 0,
        Age: 20,
        ...answers,
      };

      // Make prediction request
      const response = await axios.post('http://192.168.18.65:5000/predict_anxiety', data);
      const output = parseInt(response.data.predicted_anxiety_level);
      const levelText = output === 0 ? 'Low Anxiety Level' : output === 1 ? 'Moderate Anxiety Level' : 'High Anxiety Level';
      
      // Store the actual BAI result
      await storeResultInDB(calculatedBaiScore, calculatedAnxietyLevel);
      
      setTimeout(() => {
        setLoading(false);
        setAlertMsg(levelText);
        setShowAlert(true);
        setShowResult(true);
      }, 1500);
    } catch (err) {
      setLoading(false);
      setAlertMsg('Prediction failed. Try again later.');
      setShowAlert(true);
      console.error("Submission error:", err);
    }
  };

  const renderQuestionCard = () => {
    if (currentIndex >= questions.length) return null;

    const { statement } = questions[currentIndex];
    const selected = inputValue;

    return (
      <View style={[styles.card, { backgroundColor: softColors[currentIndex % softColors.length] }]}>
        <Text style={styles.statement}>{statement}</Text>

        <View style={styles.optionsContainerVertical}>
          {[0, 1, 2, 3].map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => setInputValue(num.toString())}
              style={[
                styles.optionButtonFull,
                selected === num.toString() && styles.optionButtonSelected
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  selected === num.toString() && styles.optionTextSelected
                ]}
              >
                {optionLabels[num]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        {/* <Text style={{ marginTop: 10, fontSize: 16, fontWeight: '600', color: '#444' }}>
          Time: {timerCount}s
        </Text> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../assets/images/bg1.mp4')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted
      />

      {loading ? (
        <Animatable.View animation="fadeInUpBig" style={styles.processingContainer}>
          <Animatable.Text
            animation="pulse"
            easing="ease-in-out"
            iterationCount="infinite"
            style={styles.processingText}>
            Analyzing Your Anxiety Levels...
          </Animatable.Text>

          <ActivityIndicator size="large" color="#00b894" style={styles.spinner} />

          <Animatable.Image
            animation="rotate"
            iterationCount="infinite"
            duration={4000}
            source={require('../assets/images/stage2.png')}
            style={styles.processingImage}
          />

          <Animatable.Text
            animation="fadeIn"
            delay={2000}
            style={styles.processingSubtext}>
            Please wait while we personalize your analysis.
          </Animatable.Text>
        </Animatable.View>
      ) : (
        renderQuestionCard()
      )}

      <Modal visible={showAlert} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.alertText}>{alertMsg}</Text>
            <TouchableOpacity
              onPress={() => {
                setShowAlert(false);
                if (!showResult) {
                  startTimer(pausedAt); // resume from last paused second
                  setPausedAt(null);    // clear paused marker
                }
                if (showResult) {
                  setShowResult(false);
                  navigation.navigate('WellBeingPage', { 
                    userId, 
                    depressionScore, 
                    anxietyScore: alertMsg,
                    baiScore,
                    anxietyLevel 
                  });
                }
              }}
              style={[styles.modalButton, { backgroundColor: '#800080' }]}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={timeoutModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.alertText}>Time's up! What would you like to do?</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={handleRestart} style={[styles.modalButton, { backgroundColor: '#6c5ce7' }]}>
                <Text style={styles.modalButtonText}>Restart</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleExit} style={[styles.modalButton, { backgroundColor: '#d63031' }]}>
                <Text style={styles.modalButtonText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  card: {
    padding: 20,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    alignItems: 'center'
  },
  statement: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  button: {
    backgroundColor: '#800080',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center'
  },
  alertText: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333'
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  optionsContainerVertical: {
    marginVertical: 10,
    width: '100%',
    gap: 10
  },
  optionButtonFull: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
  },
  optionButtonSelected: {
    backgroundColor: 'white',
    borderColor: 'gray', 
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: 'black',
    fontWeight: 'bold',
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20
  },
  processingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center'
  },
  spinner: {
    marginVertical: 20
  },
  processingImage: {
    width: 120,
    height: 120,
    marginBottom: 20
  },
  processingSubtext: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center'
  }
});

export default AnxietyScreen;