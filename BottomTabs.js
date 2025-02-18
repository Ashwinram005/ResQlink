import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text ,Image} from 'react-native';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import MissingPersonsScreen from './screens/MissingPersonsScreen';
import RequestHelpScreen from './screens/RequestHelpScreen';


const Tab = createBottomTabNavigator();
const requestHelpIcon = require("./assets/helpicon.jpg");
const missingpersonIcon = require("./assets/missingpersonicon.png");
console.log(requestHelpIcon);
export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon;
          if (route.name === 'Home') icon = "🏠";
          else if (route.name === "Missing") 
            return <Image source={missingpersonIcon} style={{ width: size, height: size ,backgroundColor:"white",resizeMode: 'contain' }} />;;
          if (route.name === "Request Help")
            return <Image source={requestHelpIcon} style={{ width: size, height: size ,resizeMode: 'contain' }} />;
          else if (route.name === "Profile") icon = "👤";

          return <Text style={{ fontSize: size, color }}>{icon}</Text>;
        },
        tabBarStyle: { backgroundColor: "#111827", paddingBottom: 5 },
        tabBarActiveTintColor: "#FACC15",
        tabBarInactiveTintColor: "#fff",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Missing" component={MissingPersonsScreen} /> 
      <Tab.Screen name="Request Help" component={RequestHelpScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
