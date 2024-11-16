import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; // İkonlar için kütüphane
import HomeScreen from './src/HomeScreen';
import AddSubmit from './src/AddSubmit';
import SettingsScreen from './src/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Ana Sayfa') {
            iconName = focused ? 'home' : 'home-outline'; // Seçili ve seçili olmayan ikonlar
          } else if (route.name === 'Not Ekle') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Ayarlar') {
            iconName = focused ? 'settings' : 'settings-outline';
          } 

          // İkonu döndür
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f76c6c', // Seçili ikon rengi
        tabBarInactiveTintColor: '#aaa', // Seçili olmayan ikon rengi
        tabBarStyle: { backgroundColor: '#fff' }, // Tab bar stili
        headerShown: false, // Başlık gizleme
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
      <Tab.Screen name="Not Ekle" component={AddSubmit} />
      <Tab.Screen name="Ayarlar" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MyTabs" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MyTabs" component={MyTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
