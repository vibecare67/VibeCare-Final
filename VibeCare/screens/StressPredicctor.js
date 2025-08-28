import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import * as Animatable from 'react-native-animatable';
import { Video } from 'expo-av';
import {API_BASE_URL} from '../config/api';
import { useNavigation } from '@react-navigation/native';

const StressPredictor = ({navigation,route}) => {
  const cardColors = [
    '#fde2e4', '#d0f4de', '#e2f0cb', '#f6eac2', '#fddde6',
    '#cddafd', '#e0c3fc', '#fbe7c6', '#e0f7fa', '#fff1e6'
  ];
  const [customAlert, setCustomAlert] = useState({
    visible: false,
    title: '',
    message: '',
    options: []
  });
  
  const { userId } = route.params || {};
  console.log(userId);
  
  const questionRanges = {
    anxiety_level: { min: 0.0, max: 21.0, step: 1.0 },
    self_esteem: { min: 0.0, max: 30.0, step: 1.0 },
    mental_health_history: { min: 0.0, max: 1.0, step: 1.0 },
    depression: { min: 0.0, max: 27.0, step: 1.0 },
    headache: { min: 0.0, max: 5.0, step: 0.5 },
    blood_pressure: { min: 1.0, max: 3.0, step: 1.0 },
    sleep_quality: { min: 0.0, max: 5.0, step: 0.5 },
    breathing_problem: { min: 0.0, max: 5.0, step: 0.5 },
    noise_level: { min: 0.0, max: 5.0, step: 0.5 },
    living_conditions: { min: 0.0, max: 5.0, step: 0.5 },
    safety: { min: 0.0, max: 5.0, step: 0.5 },
    basic_needs: { min: 0.0, max: 5.0, step: 0.5 },
    academic_performance: { min: 0.0, max: 5.0, step: 0.5 },
    study_load: { min: 0.0, max: 5.0, step: 0.5 },
    teacher_student_relationship: { min: 0.0, max: 5.0, step: 0.5 },
    future_career_concerns: { min: 0.0, max: 5.0, step: 0.5 },
    social_support: { min: 0.0, max: 3.0, step: 1.0 },
    peer_pressure: { min: 0.0, max: 5.0, step: 0.5 },
    extracurricular_activities: { min: 0.0, max: 5.0, step: 0.5 },
    bullying: { min: 0.0, max: 5.0, step: 0.5 }
  };
  
  const questionStatements = {
    anxiety_level: "On a scale of 0-21, how often have you felt nervous or 'on edge' recently?",
    self_esteem: "How would you rate your self-confidence from 0 (low) to 30 (high)?",
    mental_health_history: "Have you ever experienced mental health challenges? (0 = No, 1 = Yes)",
    depression: "How often have you felt down or hopeless? (0 = Never, 27 = Very often)",
    headache: "Rate your headache frequency from 0 (never) to 5 (daily)",
    blood_pressure: "How would you describe your blood pressure? (1 = Normal, 3 = High)",
    sleep_quality: "How would you rate your sleep quality? (0 = Poor, 5 = Excellent)",
    breathing_problem: "Do you experience breathing difficulties? (0 = Never, 5 = Always)",
    noise_level: "How noisy is your environment? (0 = Quiet, 5 = Very loud)",
    living_conditions: "Rate your living conditions (0 = Uncomfortable, 5 = Very comfortable)",
    safety: "How safe do you feel? (0 = Unsafe, 5 = Very safe)",
    basic_needs: "Are your basic needs met? (0 = Not at all, 5 = Completely)",
    academic_performance: "How satisfied are you with your academic performance?",
    study_load: "How manageable is your study workload? (0 = Overwhelming, 5 = Easy)",
    teacher_student_relationship: "Rate your relationship with teachers (0 = Poor, 5 = Excellent)",
    future_career_concerns: "How worried are you about your future career?",
    social_support: "How strong is your support network? (0 = Weak, 3 = Strong)",
    peer_pressure: "How much peer pressure do you feel? (0 = None, 5 = Extreme)",
    extracurricular_activities: "How active are you in extracurriculars?",
    bullying: "Have you experienced bullying? (0 = Never, 5 = Frequently)"
  };

  const questions = Object.keys(questionRanges);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputs, setInputs] = useState(Object.fromEntries(questions.map(q => [q, questionRanges[q].min])));
  const [result, setResult] = useState('');
  const [timeLeft, setTimeLeft] = useState(5);
  const [showWarning, setShowWarning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputError, setInputError] = useState('');
  const timerRef = useRef(null);
  const warningPhaseRef = useRef(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef(null);  
  const [stressScore, setStressScore] = useState(null);
  const [stressTextResult, setStressTextResult] = useState('');

  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      startTimer();
    }
    return () => {
      clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex]);

  const showCustomAlert = (title, message, isFinalWarning = false, customOptions = null) => {
    let options;
    if (customOptions) {
      options = customOptions;
    } else {
      options = isFinalWarning
        ? [
            { text: 'Restart Quiz', onPress: () => {
              setCustomAlert({ ...customAlert, visible: false });
              setCurrentQuestionIndex(0);
              setInputs(Object.fromEntries(questions.map(q => [q, questionRanges[q].min])));
              startTimer();
            }},
            { text: 'Exit Quiz', onPress: () => {
              setCustomAlert({ ...customAlert, visible: false });
              navigation.navigate('WellBeingPage', { userId });
            }}
          ]
        : [
            { text: 'OK', onPress: () => setCustomAlert({ ...customAlert, visible: false }) }
          ];
    }

    setCustomAlert({ visible: true, title, message, options });
  };

  const startTimer = () => {
    setTimeLeft(5);
    setShowWarning(false);
    setInputError('');
    warningPhaseRef.current = 0;
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeOut = () => {
    warningPhaseRef.current += 1;
    if (warningPhaseRef.current === 10) {
      setShowWarning(true);
      showCustomAlert('⏰ Time Warning', 'You have 3 seconds left to answer!');
      startCountdown(60);
    }    
  };

  const startCountdown = (seconds) => {
    setTimeLeft(seconds);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 10000);
  };

  const handleSliderChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });
    setInputError('');
    if (showWarning || warningPhaseRef.current > 0) {
      setShowWarning(false);
      warningPhaseRef.current = 0;
      clearInterval(timerRef.current);
      startTimer();
    }
  };

  const handleNext = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const value = inputs[currentQuestion];
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    setIsProcessing(true);
    try {
      const payload = {};

      // Validate all inputs before sending
      for (const key of Object.keys(inputs)) {
        const value = inputs[key];
        if (value === undefined || isNaN(parseFloat(value))) {
          throw new Error(`Missing or invalid input: ${key}`);
        }
        payload[key] = parseFloat(value);
      }

      const response = await fetch(`http://192.168.18.65:5000/predict_stress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        console.log('Stress prediction response:', data);

        if (data.stress_level !== undefined) {
          setStressTextResult(data.stress_level);
          setResult(`Predicted Stress Level: ${data.stress_level}`);

          const saveResponse = await fetch(`${API_BASE_URL}/stress-result`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userId,
              stress_level: data.stress_level
            }),
          });

          const saveResult = await saveResponse.json();
          if (saveResult.status !== 'success') {
            console.error('Failed to save stress result:', saveResult);
          }
        } else {
          setResult('Invalid response format: stress_level missing');
        }
      } catch (err) {
        console.error('JSON parse error:', err, 'Raw response:', text);
        setResult('Unexpected response format');
      }

      setTimeout(() => {
        setIsProcessing(false);
        setCurrentQuestionIndex(questions.length);
      }, 2000);
    } catch (error) {
      setResult(`Error: ${error.message}`);
      setIsProcessing(false);
      setCurrentQuestionIndex(questions.length);
    }
  };

  useEffect(() => {
    if (currentQuestionIndex === questions.length && result) {
      showCustomAlert('Quiz Result', result, false, [
        { text: 'OK', onPress: () => navigation.navigate('WellBeingPage', { userId, stressScore: stressTextResult }) }
      ]);
    }
  }, [currentQuestionIndex, result]);

  const currentQuestion = questions[currentQuestionIndex];
  const range = questionRanges[currentQuestion];
  const currentValue = inputs[currentQuestion];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../assets/images/bg.mp4')}
        style={styles.backgroundVideo}
        resizeMode="cover"
        isLooping
        isMuted
        shouldPlay
      />

      <View style={styles.centerContainer}>
        {isProcessing ? (
          <ProcessingScreen />
        ) : currentQuestionIndex < questions.length ? (
          <Card style={[styles.card, { backgroundColor: cardColors[currentQuestionIndex % cardColors.length] }]}>
            <Text style={styles.question}>{questionStatements[currentQuestion]}</Text>
            
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{currentValue.toFixed(range.step < 1 ? 1 : 0)}</Text>
              <Slider
                style={styles.slider}
                minimumValue={range.min}
                maximumValue={range.max}
                step={range.step}
                value={currentValue}
                onValueChange={(value) => handleSliderChange(currentQuestion, value)}
                minimumTrackTintColor="#6200ee"
                maximumTrackTintColor="#000000"
                thumbTintColor="#6200ee"
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>{range.min}</Text>
                <Text style={styles.sliderLabel}>{range.max}</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>
                {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <Card style={styles.resultCard}>
            <Text style={styles.resultTitle}>Quiz Completed!</Text>
            <Text style={styles.resultText}>{result}</Text>
          </Card>
        )}
      </View>
      
      <CustomAlertModal
        visible={customAlert.visible}
        title={customAlert.title}
        message={customAlert.message}
        options={customAlert.options}
      />
    </KeyboardAvoidingView>
  );
};

const ProcessingScreen = () => (
  <Animatable.View animation="fadeInUpBig" style={styles.processingContainer}>
    <Animatable.Text
      animation="pulse"
      easing="ease-in-out"
      iterationCount="infinite"
      style={styles.processingText}>
      Analyzing Your Stress Levels...
    </Animatable.Text>
    
    <ActivityIndicator size="large" color="#00b894" style={styles.spinner} />
    
    <Animatable.Image
      animation="rotate"
      iterationCount="infinite"
      duration={4000}
      source={require('../assets/images/stage3.png')}
      style={styles.processingImage}
    />

    <Animatable.Text
      animation="fadeIn"
      delay={2000}
      style={styles.processingSubtext}>
      Please wait while we personalize your analysis.
    </Animatable.Text>
  </Animatable.View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  card: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sliderContainer: {
    width: '100%',
    marginBottom: 30,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#6200ee',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#666',
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  button: {
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultCard: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 18,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  processingText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  processingSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  spinner: {
    marginVertical: 20,
  },
  processingImage: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  alertButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  alertButton: {
    backgroundColor: 'purple',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  alertButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

const CustomAlertModal = ({ visible, title, message, options }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>{title}</Text>
          <Text style={styles.alertMessage}>{message}</Text>
          <View style={styles.alertButtons}>
            {options.map((opt, index) => (
              <TouchableOpacity key={index} style={styles.alertButton} onPress={opt.onPress}>
                <Text style={styles.alertButtonText}>{opt.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default StressPredictor;