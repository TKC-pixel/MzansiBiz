import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 

import Login from '../MzansiBiz/screens/Login';
import UserRegistration from '../MzansiBiz/screens/UserRegistration';
import BusinessReg from './screens/BusinessReg';
import Listings from './screens/Listings';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name='Listings' 
        component={Listings} 
        options={{
          tabBarLabel: 'Listings',
          tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />
        }} 
      />
      <Tab.Screen 
        name='BusinessRegistration' 
        component={BusinessReg} 
        options={{
          tabBarLabel: 'Register',
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />
        }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Login' component={Login}/>
        <Stack.Screen name='Register' component={UserRegistration}/>
        <Stack.Screen name='Home' component={TabNavigator} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
