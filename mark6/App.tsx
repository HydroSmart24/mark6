import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './Screens/index';
import DebrisMainScreen from './Screens/Debris/DebrisMain';
import DetectScreen from './Screens/Debris/DetectScreen';
import RequestWater from './Screens/RequestWater/RequestWater';
import AuthScreen from './Screens/Auth/AuthScreen'; // Import AuthScreen
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig'; // Import your Firebase config

type RootStackParamList = {
  index: undefined;
  main: undefined;
  DebrisMain: undefined;
  DetectScreen: undefined;
  AuthScreen: undefined;
  RequestWater: undefined;
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
          headerShown: false,
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
          headerShown: false,
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
          headerShown: false,
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
        name="Home Screen"
        component={MainTabNavigator}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Debris Screen"
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
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup the subscription on unmount
  }, []);

  if (loading) {
    // You can add a loading indicator here if needed
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthScreen">
        {user ? (
          <>
            <Stack.Screen
              name="index"
              component={MainDrawerNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RequestWater"
              component={RequestWater}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <Stack.Screen
            name="AuthScreen"
            component={AuthScreen}
            options={{ headerShown: false }} // You can choose to show or hide the header
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
