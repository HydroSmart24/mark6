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
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig'; // Import your Firebase config
import AvailableScreen from './Screens/Consumption/Available';
import ContactUs from './Screens/ContactUs';
import AboutUs from './Screens/AboutUs';
import OrderHistory from "./Screens/Crowdsourcing/OrderHistory";
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig'; // Import your Firestore config

type RootStackParamList = {
  index: undefined;
  main: undefined;
  DebrisMain: undefined;
  DetectScreen: undefined;
  AuthScreen: undefined;
  AvailableScreen: undefined;
  OrderHistory: undefined;
  ContactUs: undefined;
  AboutUs: undefined;
  RequestWater: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function MainTabNavigator({ userName }: { userName: string }) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      >
        {(props) => <HomeScreen {...props} userName={userName} />}
      </Tab.Screen>
      
      <Tab.Screen
        name="AvailableScreen"
        component={AvailableScreen}
        options={{
          tabBarLabel: "Available",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="water" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainDrawerNavigator({ userName }: { userName: string }) {
  return (
    <Drawer.Navigator initialRouteName="index">
      <Drawer.Screen
        name="Home Screen"
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      >
        {(props) => <MainTabNavigator {...props} userName={userName} />}
      </Drawer.Screen>
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
        name="OrderHistory"
        component={OrderHistory}
        options={{
          headerTitle: 'Order History',
          drawerLabel: 'Order History',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="tanker-truck" size={size} color={color} />
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
  const [userName, setUserName] = React.useState<string | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data()?.name || null);
        }
      }
    });

    return unsubscribe; // Cleanup the subscription on unmount
  }, []);

  if (loading) {
    return null; // You can add a loading indicator here if needed
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthScreen">
        {user ? (
          <>
            <Stack.Screen name="index">
              {(props) => (
                <MainDrawerNavigator {...props} userName={userName || ''} />
              )}
            </Stack.Screen>
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
                title: 'filter health',
              }}
            />
            <Stack.Screen
              name="DetectScreen"
              component={DetectScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="OrderHistory"
              component={OrderHistory}
              options={{
                headerShown: true,
                title: 'Order History',
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="AuthScreen"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
