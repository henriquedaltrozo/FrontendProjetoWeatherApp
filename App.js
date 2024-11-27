import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from './src/screens/authentication/Login';
import BottomMenu from './src/screens/bottomMenu/BottomMenu';
import Register from './src/screens/authentication/Register';
import ForecastDetails from './src/screens/otherScreens/ForecastDetails';
import ChangeData from './src/screens/otherScreens/ChangeData';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
      }}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BottomMenu"
        component={BottomMenu}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForecastDetails"
        component={ForecastDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChangeData"
        component={ChangeData}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
