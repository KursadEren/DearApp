import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './src/HomeScreen';
import AddSubmit from './src/AddSubmit';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Navigator name="Home" component={HomeScreen} />
        <Stack.Navigator name="Submit" component={AddSubmit} />
      </Stack.Navigator>
    </NavigationContainer>

  )
}