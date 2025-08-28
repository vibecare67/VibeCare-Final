import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Video } from 'expo-av';
import * as Animatable from 'react-native-animatable';
import { API_BASE_URL } from "../config/api";

const beckQuestions = [
  "I do not feel sad.",
  "I feel discouraged about the future.",
  "I feel like a failure.",
  "I am not satisfied with things.",
  "I feel guilty most of the time.",
  "I feel punished.",
  "I feel disappointed in myself.",
  "I blame myself for everything.",
  "I have thoughts of killing myself.",
  "I cry more than I used to.",
  "I am more irritable than usual.",
  "I have lost interest in others.",
  "I can't make decisions as well.",
  "I feel unattractive or unworthy.",
  "I can’t work as well as before.",
  "I have trouble sleeping.",
  "I feel more tired than usual.",
  "I have lost appetite.",
  "I have lost interest in sex.",
  "I worry about my health.",
  "I feel hopeless about my situation.",
];
const getOptionLabel = (questionIndex, value) => {
  const options = [
    ["I do not feel sad", "I feel sad", "I am sad all the time", "I am so sad I can't stand it"],
    ["I am not discouraged", "I feel discouraged", "I feel I have nothing to look forward to", "I feel hopeless about the future"],
   ['I do not feel sad.', 'I feel sad much of the time.', 'I am sad all the time.', 'I am so sad or unhappy that I can’t stand it.'] ,
   ['I am not discouraged about my future.', 'I feel more discouraged about my future than I used to.', 'I do not expect things to work out for me.', 'I feel my future is hopeless and will only get worse.'] ,
  ['I do not feel like a failure.', 'I have failed more than I should have.', 'As I look back, I see a lot of failures.', 'I feel I am a total failure as a person.'] ,
   ['I get as much pleasure as I ever did from the things I enjoy.', 'I don’t enjoy things as much as I used to.', 'I get very little pleasure from the things I used to enjoy.', 'I can’t get any pleasure from the things I used to enjoy.'] ,
  ['I don’t feel particularly guilty.', 'I feel guilty over many things I have done or should have done.', 'I feel quite guilty most of the time.', 'I feel guilty all of the time.'] ,
  ['I don’t feel I am being punished.', 'I feel I may be punished.', 'I expect to be punished.', 'I feel I am being punished.'] ,
['I feel the same about myself as ever.', 'I have lost confidence in myself.', 'I am disappointed in myself.', 'I dislike myself.'] ,
   ['I don’t criticize or blame myself more than usual.', 'I am more critical of myself than I used to be.', 'I criticize myself for all of my faults.', 'I blame myself for everything bad that happens.'] ,
   ['I don’t have any thoughts of killing myself.', 'I have thoughts of killing myself, but I would not carry them out.', 'I would like to kill myself.', 'I would kill myself if I had the chance.'] ,
 ['I don’t cry anymore than I used to.', 'I cry more than I used to.', 'I cry over every little thing.', 'I feel like crying, but I can’t.'] ,
 ['I am no more restless or wound up than usual.', 'I feel more restless or wound up than usual.', 'I am so restless or agitated, it’s hard to stay still.', 'I am so restless or agitated that I have to keep moving or doing something.'] ,
   ['I have not lost interest in other people or activities.', 'I am less interested in other people or things than before.', 'I have lost most of my interest in other people or things.', 'It’s hard to get interested in anything.'] ,
   ['I make decisions about as well as ever.', 'I find it more difficult to make decisions than usual.', 'I have much greater difficulty in making decisions than I used to.', 'I have trouble making any decisions.'] ,
['I do not feel I am worthless.', 'I don’t consider myself as worthwhile and useful as I used to.', 'I feel more worthless as compared to others.', 'I feel utterly worthless.'] ,
 ['I have as much energy as ever.', 'I have less energy than I used to have.', 'I don’t have enough energy to do very much.', 'I don’t have enough energy to do anything.'] ,
['I have not experienced any change in my sleeping.', 'I sleep somewhat more than usual.', 'I sleep somewhat less than usual.', 'I sleep a lot more or a lot less than usual.'] ,
  ['I am not more irritable than usual.', 'I am more irritable than usual.', 'I am much more irritable than usual.', 'I am irritable all the time.'] ,
 ['I have not experienced any change in my appetite.', 'My appetite is somewhat less or greater than usual.', 'My appetite is much less or greater than usual.', 'I have no appetite or crave food all the time.'] 
['I can concentrate as well as ever.', 'I can’t concentrate as well as usual.', 'It’s hard to keep my mind on anything for very long.', 'I find I can’t concentrate on anything.'] ,
['I am no more tired or fatigued than usual.', 'I get more tired or fatigued more easily than usual.', 'I am too tired or fatigued to do a lot of the things I used to do.', 'I am too tired or fatigued to do most of the things I used to do.'] ,
['I have not noticed any recent change in my interest in sex.', 'I am less interested in sex than I used to be.', 'I am much less interested in sex now.', 'I have lost interest in sex completely.'] ,



  ];
  return options[questionIndex] ? options[questionIndex][value] : `Option ${value}`;
};




const bgColors = [
  "#FFEBEE", "#E8F5E9", "#E3F2FD", "#FFF3E0", "#F3E5F5", "#FBE9E7", "#E0F2F1",
  "#F1F8E9", "#EDE7F6", "#FFFDE7", "#ECEFF1", "#FFF8E1", "#E1F5FE", "#F9FBE7",
  "#FCE4EC", "#EDE7F6", "#E8F5E9", "#FBE9E7", "#FFF3E0", "#F1F8E9", "#F3E5F5",
];

// Lighten or darken a hex color by a percent
const shadeColor = (color, percent) => {
  let R = parseInt(color.substring(1,3),16);
  let G = parseInt(color.substring(3,5),16);
  let B = parseInt(color.substring(5,7),16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;
  G = (G<255)?G:255;
  B = (B<255)?B:255;

  const RR = (R.toString(16).length==1)?"0"+R.toString(16):R.toString(16);
  const GG = (G.toString(16).length==1)?"0"+G.toString(16):G.toString(16);
  const BB = (B.toString(16).length==1)?"0"+B.toString(16):B.toString(16);

  return "#"+RR+GG+BB;
};


const screenWidth = Dimensions.get('window').width;

const DepressionQuiz = ({ navigation ,route}) => {
  const [answers, setAnswers] = useState(Array(21).fill(""));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [timer, setTimer] = useState(10);
  const intervalRef = useRef(null);
  const [showFinalTimeUpModal, setShowFinalTimeUpModal] = useState(false);
  const [result, setResult] = useState(null);
  const { userId } = route.params || {};
  console.log(userId);

const storeResultInDB = async (bdi_score, depression_level) => {
  try {
    const response = await fetch(`${API_BASE_URL}/depression-result`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        bdi_score,
        depression_level,
        createdAt: new Date().toISOString()
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to store result:", data.error);
    }
  } catch (error) {
    console.error("Error storing result:", error.message);
  }
};



  const handleChange = (text, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = text;
    setAnswers(newAnswers);
  };

const stopTimer = () => {
  clearInterval(intervalRef.current);
};

const resumeTimer = () => {
  startTimer(timer); // resume from remaining time
};

const startTimer = (startFrom = 60) => {
  let time = startFrom;
  setTimer(time);
  clearInterval(intervalRef.current);
  intervalRef.current = setInterval(() => {
    time -= 1;
    setTimer(time);

    if (time === 5 || time === 2) {
      stopTimer();
      setAlertMessage(time === 5 ? "⏳ Time’s ticking! Please answer soon." : "⚠️ Hurry! seconds left!");
      setShowAlert(true);
      return;
    }

    if (time === 0) {
      stopTimer();
      setShowFinalTimeUpModal(true);
    }
  }, 6000);
};

useEffect(() => {
  if (currentQuestion < beckQuestions.length) {
    startTimer();
  } else {
    stopTimer();
  }

  return () => stopTimer();
}, [currentQuestion]);

const closeAlert = () => {
  setShowAlert(false);
  resumeTimer();
};


  const handleNext = () => {
    if (!answers[currentQuestion]) {
      setAlertMessage("❗ Missing Answer", "Please answer before continuing.");
      return;
    }
    if (currentQuestion === 20) {
      handleSubmit();
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };



  const handleSubmit = async () => {
  clearInterval(intervalRef.current);
  setLoading(true);
  setResult(null);  // clear old result

setTimeout(async () => {
  try {
    console.log("📌 Preparing answers:", answers);

    const numericAnswers = answers.map((a) => parseInt(a));
    console.log("✅ Numeric answers:", numericAnswers);

    const url = "http://192.168.18.65:5000/predict_depression";
    console.log("🌍 Sending request to:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responses: numericAnswers }),
    });

    console.log("🔎 Response status:", response.status);

    let data;
    try {
      data = await response.json();
      console.log("📥 Response JSON:", data);
    } catch (jsonErr) {
      console.error("❌ JSON parse error:", jsonErr);
      throw new Error("Invalid JSON response from backend");
    }

    setLoading(false);

    if (data.error) {
      console.error("⚠️ Backend returned error:", data.error);
      Alert.alert("Error", data.error);
    } else {
      console.log("🎯 Prediction result:", data);
      setResult(data);  
      await storeResultInDB(data.bdi_score, data.depression_level);
    }
  } catch (error) {
    console.error("🚨 Fetch/Network Error:", error);
    setLoading(false);
    Alert.alert("⚠️ Connection Error", `Could not reach backend server.\nDetails: ${error.message}`);
  }
}, 3000);
  };




  return (
    <View style={styles.container}>
         <Video
             source={require('../assets/images/depbg.mp4')} 
             style={StyleSheet.absoluteFill} 
             resizeMode="cover" 
             shouldPlay 
             isLooping 
             isMuted 
             useNativeControls={false} 
           />
{result && (
  <Modal transparent animationType="fade" visible={true}>
    <View style={styles.alertBox}>
      <View style={styles.alertContent}>
        <Text style={styles.alertText}> Prediction Result</Text>
        <Text style={{fontSize:16, marginBottom:10}}>
          BDI Score: {result.bdi_score}
        </Text>
        <Text style={{fontSize:16, marginBottom:20}}>
          Depression Level: {result.depression_level}
        </Text>
        <TouchableOpacity
          style={[styles.alertButton, { backgroundColor: '#6200ea' }]}
          onPress={() => {
            setResult(null);
            navigation.navigate('WellBeingPage', { userId, depressionScore: result.depression_level });
          }}
        >
          <Text style={[styles.alertButtonText, { color: '#fff' }]}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}


      {loading ? (
        <Animatable.View animation="fadeInUpBig" style={styles.processingContainer}>
     <Animatable.Text
       animation="pulse"
       easing="ease-in-out"
       iterationCount="infinite"
       style={styles.processingText}>
       Analyzing Your Depression Levels...
     </Animatable.Text>
     
     <ActivityIndicator size="large" color="#00b894" style={styles.spinner} />
     
     <Animatable.Image
       animation="rotate"
       iterationCount="infinite"
       duration={4000}
       source={require('../assets/images/depression.png')}
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
        <ScrollView contentContainerStyle={styles.cardWrapper}>
          <View style={[styles.card, { backgroundColor: bgColors[currentQuestion % bgColors.length] }]}>
            <Text style={styles.question}>
              Q{currentQuestion + 1}. {beckQuestions[currentQuestion]}
            </Text>

         <View style={styles.optionsWrapper}>
 {[0, 1, 2, 3].map((value) => {
  const isSelected = answers[currentQuestion] === value.toString();
  const cardColor = bgColors[currentQuestion % bgColors.length];
  const lighter = shadeColor(cardColor, 30);
  const darker = shadeColor(cardColor, -30);

  return (
    
    <TouchableOpacity
      key={value}
      style={[
        styles.optionBox,
        isSelected && {
          backgroundColor: lighter,
          borderColor: darker,
          borderWidth: 2,
        },
      ]}
      onPress={() => handleChange(value.toString(), currentQuestion)}
    >
      <Text
        style={[
          styles.optionText,
          isSelected && { fontWeight: "bold", color: "#333" },
        ]}
      >
        {value} - {getOptionLabel(currentQuestion, value)}
      </Text>
    </TouchableOpacity>
  );
})}

</View>


            {/* <Text style={styles.timerText}>⏱️ Time left: {timer}s</Text> */}

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextText}>{currentQuestion === 20 ? "Submit" : "Next"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <Modal visible={showAlert} transparent animationType="fade">
        <View style={styles.alertBox}>
          <View style={styles.alertContent}>
            <Text style={styles.alertText}>{alertMessage}</Text>
            <TouchableOpacity onPress={closeAlert} style={styles.alertButton}>
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={showFinalTimeUpModal} transparent animationType="fade">
  <View style={styles.alertBox}>
    <View style={styles.alertContent}>
      <Text style={styles.alertText}>⏰ Time Up! Do you want to restart or exit?</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => {
            setShowFinalTimeUpModal(false);
            setCurrentQuestion(0);
            setAnswers(Array(21).fill(""));
            startTimer(60);
          }}
          style={[styles.alertButton, { marginRight: 10 }]}
        >
          <Text style={styles.alertButtonText}>Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setShowFinalTimeUpModal(false);
            navigation.navigate("WellBeingPage", {userId});
          }}
          style={[styles.alertButton, { backgroundColor: '#e74c3c' }]}
        >
          <Text style={[styles.alertButtonText, { color: '#fff' }]}>Exit</Text>
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
    position: "relative",
    backgroundColor: "#fff",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    zIndex: -1,
    opacity: 0.2,
  },
  cardWrapper: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  card: {
    width: screenWidth - 40,
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  question: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 12,
    padding: 8,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  nextButton: {
    backgroundColor: "#6200ea",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },
  optionsWrapper: {
  marginTop: 5,
  marginBottom: 16,
},

optionBox: {
  backgroundColor: "white",
  padding: 8,
  borderRadius: 12,
  marginVertical: 8,
  elevation: 2,
},


optionSelected: {
  backgroundColor: '#9146fa',
  borderColor: '#6200ea',
},

optionText: {
  fontSize: 16,
  color: '#333',
},

optionTextSelected: {
  color: '#fff',
  fontWeight: 'bold',
},
  nextText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  timerText: {
    textAlign: "right",
    marginBottom: 8,
    fontSize: 14,
    color: "#444",
  },
  alertBox: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background for focus
},

alertContent: {
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

alertText: {
  fontSize: 18,
  textAlign: 'center',
  marginBottom: 20,
  fontWeight: 'bold',
  color: '#333',
},

alertButton: {
  backgroundColor: 'purple',
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 10,
  marginHorizontal: 10,
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 100,
},

alertButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "500",
    color: "#6200ea",
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: "transparent",
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
});

export default DepressionQuiz;
