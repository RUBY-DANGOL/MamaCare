// rootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import StageScreen from '../screens/StageScreen';
import PersonalScreen from '../screens/PersonalScreen';
import PartnerScreen from '../screens/PartnerScreen';
import CalendarScreen from '../screens/CalendarScreen';
import LogPregnancy from '../screens/LogPregnancy';
import NutriScreen from '../screens/NutriScreen'; 
// import RecommendedFoods from '../screens/RecommendedFoods';



export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  SignUp: undefined;
  Stage: undefined;
  Personal: undefined;
  Partner: undefined;
  Calendar: undefined;
  Nutri: undefined;
  // RecommendedFoods: undefined;


};

const Stack = createNativeStackNavigator

<RootStackParamList>();

type RootNavigatorProps = {
  initialRouteName: keyof RootStackParamList;
};



export default function RootNavigator({ initialRouteName }: RootNavigatorProps) {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Stage" component={StageScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Personal" component={PersonalScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Partner" component={PartnerScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Nutri" component={NutriScreen} options={{ headerShown: false }} />
      {/* <Stack.Screen name="RecommendedFoods" component={RecommendedFoods} options={{ headerShown: true, title: 'Recommended Foods' }} /> */}



    </Stack.Navigator>
  );
}
