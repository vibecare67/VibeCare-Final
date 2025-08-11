import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';
import HelpSupportScreen from './HelpSupportScreen';
import AboutScreen from './AboutScreen';
import ExploreScreen from './ExploreScreen';
import SuccessStoriesScreen from './SuccessStoriesScreen';
import PrivacyScreen from './PrivacyScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#5F0F09' },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'black',
      }}
    >
      <Tab.Screen
        name="HelpSupportScreen"
        component={HelpSupportScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('../assets/images/faq.png')}
              style={styles.icon}
            />
          ),
          tabBarLabel: 'FAQ',
        }}
      />
      <Tab.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('../assets/images/about_us_icon.png')}
              style={styles.icon}
            />
          ),
          tabBarLabel: 'About Us',
        }}
      />
      <Tab.Screen
        name="ExploreScreen"
        component={ExploreScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('../assets/images/home_icon.png')}
              style={styles.icon}
            />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="SuccessStoriesScreen"
        component={SuccessStoriesScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('../assets/images/stories_icon.png')}
              style={styles.icon}
            />
          ),
          tabBarLabel: 'Stories',
        }}
      />
      <Tab.Screen
        name="PrivacyScreen"
        component={PrivacyScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('../assets/images/privacy_icon.png')}
              style={styles.icon}
            />
          ),
          tabBarLabel: 'Privacy',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

export default BottomTabNavigator;
