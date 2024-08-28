import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './Screens/index';
import DebrisMain from './Screens/Debris/DebrisMain';
import DetectScreen from './Screens/Debris/DetectScreen';
import RequestWater from './Screens/RequestWater/RequestWater';
import AuthScreen from './Screens/Auth/AuthScreen'; // Import AuthScreen
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig'; // Import your Firebase config
import AvailableScreen from './Screens/Consumption/Available';
import ContactUs from './Screens/ContactUs';
import AboutUs from './Screens/AboutUs';

type RootStackParamList = {
  index: undefined;
  main: undefined;
  DebrisMain: undefined;
  DetectScreen: undefined;
  AuthScreen: undefined;
  AvailableScreen: undefined;
  ContactUs: undefined;
  AboutUs: undefined;
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
        name="AvailableScreen"
        component={AvailableScreen}
        options={{
          tabBarLabel: 'Available',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="water" color={color} size={size} />
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
        name="DebrisScreen"
        component={DebrisMain}
        options={{
          headerTitle: '',
          drawerLabel: 'FilterHealth',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="health-and-safety" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="DetectScreen"
        component={DetectScreen}
        options={{
          drawerLabel: 'Debris Detection',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="smoke-detector-alert" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="RequestWater"
        component={RequestWater}
        options={{
          headerTitle: 'Request Water',
          drawerLabel: 'Request Water',
          drawerIcon: ({ color, size }) => (
            <FontAwesome6 name="code-pull-request" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ContactUs"
        component={ContactUs}
        options={{
          headerTitle: '',
          drawerLabel: 'Contact Us',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="call" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AboutUs"
        component={AboutUs}
        options={{
          headerTitle: '',
          drawerLabel: 'About Us',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
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
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="DebrisMain"
              component={DebrisMain}
              options={{ 
                headerShown: true,
                title: 'filter health'
               }}
            />
            <Stack.Screen
              name="DetectScreen"
              component={DetectScreen}
              options={{ headerShown: true }}
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
