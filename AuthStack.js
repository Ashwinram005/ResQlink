import React, { useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import BottomTabs from "./BottomTabs";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
            </Stack.Screen>
            <Stack.Screen name="Signup">
              {(props) => <SignupScreen {...props} />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="App" component={BottomTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
