import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Screens
import IntroScreen from './src/screens/IntroScreen';
import GameScreen from './src/screens/GameScreen';
import PricingScreen from './src/screens/PricingScreen';

export type RootStackParamList = {
  Intro: undefined;
  Game: { playerName?: string };
  Pricing: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Intro"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: '#1a1a2e' },
            }}
          >
            <Stack.Screen name="Intro" component={IntroScreen} />
            <Stack.Screen name="Game" component={GameScreen} />
            <Stack.Screen name="Pricing" component={PricingScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
