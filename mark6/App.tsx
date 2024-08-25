import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './Screens/index';
import DebrisMainScreen from './Screens/Debris/DebrisMain';
import DetectScreen from './Screens/Debris/DetectScreen';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
  index: undefined;
  main: undefined;
  DebrisMain: undefined;
  DetectScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="DebrisMain"
        component={DebrisMainScreen}
        options={{
          tabBarLabel: 'Debris',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="water" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="DetectScreen"
        component={DetectScreen}
        options={{
          tabBarLabel: 'Detect',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainDrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="index">
      <Drawer.Screen
        name="HomeTabs"
        component={MainTabNavigator}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="DebrisMain"
        component={DebrisMainScreen}
        options={{
          drawerLabel: 'Debris Main',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="water" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="DetectScreen"
        component={DetectScreen}
        options={{
          drawerLabel: 'Detect Screen',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="index">
        <Stack.Screen
          name="index"
          component={MainDrawerNavigator}
          options={{ headerShown: false }} // Hide the header for the drawer navigator
        />
        <Stack.Screen name="DebrisMain" component={DebrisMainScreen} />
        <Stack.Screen name="DetectScreen" component={DetectScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
