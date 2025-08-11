import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, ActivityIndicator, Text, View } from 'react-native';
import { UserPreferencesProvider } from './UserPreferencesContext';
import WelcomeScreen from './screens/WelcomeScreen';
import SignupScreen from './screens/SignupScreen';
import SigninScreen from './screens/SigninScreen';
import InfoScreen from './screens/InfoScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import MyAccount from './screens/MyAccount';
import AboutScreen from './screens/AboutScreen';
import SuccessStoriesScreen from './screens/SuccessStoriesScreen';
import ExploreScreen from './screens/ExploreScreen';
import GenderSelectionScreen from './screens/GenderSelectionScreen';
import AgeFPage from './screens/AgeFPage';
import AgeSelectionScreen from './screens/AgeMPage';
import Relation from './screens/Relation';
import LivingSituationPage from './screens/LivingSituationPage';
import WellBeingPage from './screens/WellBeingPage';
import ChatBotScreen from './screens/ChatbotScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import FeedbackScreen1 from './screens/FeedbackScreen1';
import PersonalExplorer from './screens/PersonalExplorer';
import Dairy from './screens/Dairy';
import CatchesYourEye from './screens/CatchesYourEye';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import VerifyOtpScreen from './screens/VerifyOtpScreen';
import EmojiDetailScreen from './screens/EmojiDetailScreen';
import EmojiScreen1 from './screens/EmojiScreen1';
import HelpSupportScreen from './screens/HelpSupportScreen'; 
import DepressionQuiz from './screens/DepressionQuiz';
import AdminSignIn from './screens/admin';
import EditProfileScreen from './screens/EditProfile';
import FeedbackListScreen from './screens/Feedbacklistscreen';
import RespondTicketScreen from './screens/RespondTicketScreen';
import AddStoryScreen from './screens/AddStoryScreen';
import HistoryScreen from './screens/DiaryHistory';
import OtpVerification from './screens/OtpVerification';
import EmailVerification from './screens/EmailVerification';
import StressPredictor from './screens/StressPredicctor';
import RandomImageQuiz from './screens/RandomImageQuiz';
import EmailVerificationSignUp from './screens/EmailVerificationSignup';
import RandomImage from './screens/RandomImage';
import ResultScreen from './screens/ResultScreen';
import EmojiExplorer from './screens/EmojiExplorer';
import SubcategoryScreen from './screens/SubcategoryScreen';
import SubcategoryDetails from './screens/SubcategoryDetails';
import SearchEmojiScreen from './screens/SearchEmojiScreen';
import Recommendations from './screens/recommendations';
import AnxietyScreen from './screens/AnxietyScreen';
import SettingsScreen from './screens/SettingsScreen';
import CaretakerSignIn from './screens/CaretakersignIn';
import AddCaretakerScreen from './screens/AddCaretakerScreen';
import caretakerdashboard from './screens/caretakerdashboard';
import admindashboard from './screens/admindashboard';
import CaretakerMentalHealthSummaryScreen from './screens/CaretakerMentalHealthSummaryScreen';
import VCHistoryScreen from './screens/VCHistoryScreen';
import AdminSuccessStoriesScreen from './screens/AdminSuccessStoriesScreen';
import AdminUserProfileManagementScreen from './screens/AdminUserProfileManagementScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function LoadingScreen({ navigation }) {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken'); 
        const userId = await AsyncStorage.getItem('userId'); // Retrieve userId

        console.log('User Token:', userToken);
        console.log('User ID:', userId);

        if (userToken && userId) {
          console.log('User is logged in:', userId);
          navigation.replace('ExploreScreen',{userId}); // Navigate to ExploreScreen if user is logged in
        } else {
          navigation.replace('WelcomeScreen'); // Otherwise, navigate to WelcomeScreen
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        navigation.replace('WelcomeScreen');
      }
    };

    setTimeout(checkLoginStatus, 3000); // Wait for 3 seconds before checking
  }, [navigation]);


  return (
    <View style={styles.loadingContainer}>
      <Image source={require('./assets/images/mind.png')} style={styles.image} />
      <Text style={styles.quoteText}>
        "A beautiful mind is a treasure trove of great ideas and dreams." 
      </Text>
      <ActivityIndicator size="large" color="#5F0F09" style={styles.activityIndicator} />
    </View>
  );
}


// Main Stack Navigator
export default function App() {
  return (
<UserPreferencesProvider>
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoadingScreen">
        {/* Loading Screen */}
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SigninScreen" component={SigninScreen} options={{ headerShown: false }} />
        <Stack.Screen name="InfoScreen" component={InfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyAccount" component={MyAccount} options={{ headerShown: false }} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SuccessStoriesScreen" component={SuccessStoriesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ExploreScreen" component={ExploreScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GenderSelectionScreen" component={GenderSelectionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AgeFPage" component={AgeFPage} options={{ headerShown: false }} />
        <Stack.Screen name="AgeSelectionScreen" component={AgeSelectionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Relation" component={Relation} options={{ headerShown: false }} />
        <Stack.Screen name="LivingSituationPage" component={LivingSituationPage} options={{ headerShown: false }} />
        <Stack.Screen name="WellBeingPage" component={WellBeingPage} options={{ headerShown: false }} />
        <Stack.Screen name="ChatBotScreen" component={ChatBotScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FeedbackScreen1" component={FeedbackScreen1} options={{ headerShown: false }} />
        <Stack.Screen name="PersonalExplorer" component={PersonalExplorer} options={{ headerShown: false }} />
        <Stack.Screen name="EmojiScreen1" component={EmojiScreen1} options={{ headerShown: false }} />
        <Stack.Screen name="Dairy" component={Dairy} options={{ headerShown: false }} />
        <Stack.Screen name="CatchesYourEye" component={CatchesYourEye} options={{ headerShown: false }}/>
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="VerifyOtpScreen" component={VerifyOtpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="EmojiDetailScreen" component={EmojiDetailScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="HelpSupportScreen" component={HelpSupportScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AdminSignIn" component={AdminSignIn} options={{ headerShown: false }}/>
        <Stack.Screen name="DepressionQuiz" component={DepressionQuiz} options={{ headerShown: false }}/>
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="FeedbackListScreen" component={FeedbackListScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="RespondTicketScreen" component={RespondTicketScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AddStoryScreen" component={AddStoryScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="HistoryScreen" component={HistoryScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="OtpVerification" component={OtpVerification} options={{headerShown:false}}/>
        <Stack.Screen name="EmailVerification" component={EmailVerification} options={{headerShown:false}}/>
        <Stack.Screen name="StressPredictor" component={StressPredictor} options={{headerShown:false}}/>
        <Stack.Screen name="RandomImageQuiz" component={RandomImageQuiz} options={{headerShown:false}}/>
        <Stack.Screen name="EmailVerificationSignUp" component={EmailVerificationSignUp} options={{headerShown:false}}/>
        <Stack.Screen name="RandomImage" component={RandomImage} options={{headerShown:false}}/>
        <Stack.Screen name="ResultScreen" component={ResultScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="EmojiExplorer" component={EmojiExplorer} options={{ headerShown: false }}/>
        <Stack.Screen name="SubcategoryScreen" component={SubcategoryScreen} options={{headerShown: false}}/>
         <Stack.Screen name='SubcategoryDetails' component={SubcategoryDetails} options={{headerShown:false}}/>
         <Stack.Screen name='SearchEmojiScreen' component={SearchEmojiScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Recommendations' component={Recommendations} options={{headerShown:false}} />
        <Stack.Screen name='AnxietyScreen' component={AnxietyScreen} options={{headerShown:false}} />
        <Stack.Screen name='SettingsScreen' component={SettingsScreen} options={{headerShown:false}}/>
        <Stack.Screen name="CaretakerSignIn" component={CaretakerSignIn} options={{headerShown:false}}/>
        <Stack.Screen name="AddCaretakerScreen" component={AddCaretakerScreen} options={{headerShown:false}}/>
        <Stack.Screen name='caretakerdashboard' component={caretakerdashboard} options={{headerShown:false}}/>
        <Stack.Screen name='admindashboard' component={admindashboard} options={{headerShown:false}}/>
        <Stack.Screen name='CaretakerMentalHealthSummaryScreen' component={CaretakerMentalHealthSummaryScreen} options={{headerShown:false}}/>
         <Stack.Screen name='VCHistoryScreen' component={VCHistoryScreen} options={{headerShown:false}}/>
         <Stack.Screen name='AdminSuccessStoriesScreen' component={AdminSuccessStoriesScreen} options={{headerShown:false}}/>
        <Stack.Screen name="AdminUserProfileManagementScreen" component={AdminUserProfileManagementScreen} options={{headerShown:false}}/>
         </Stack.Navigator>
    </NavigationContainer>
    {/* * </NavigationContainer> */ }
    </UserPreferencesProvider>
  );
  
}

const styles = StyleSheet.create({

  loadingText: {
    fontSize: 20,
    marginTop: 10,
    color: '#5F0F09',
  },
  icon: {
    width: 24,
    height: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDE6E6', 
    paddingHorizontal: 20,
  },
  image: {
    width: 350,
    height: 350,
    marginBottom: -30,
    resizeMode: 'contain',
  },
  quoteText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#5F0F09',
    marginBottom: 50,
    paddingLeft:50,
    paddingRight:50,
  },
  activityIndicator: {
    position: 'absolute',
    bottom: 20,
  },
});



