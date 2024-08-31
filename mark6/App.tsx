import * as React from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './Screens/index';
import DebrisMain from './Screens/Debris/DebrisMain';
import DetectScreen from './Screens/Debris/DetectScreen';
import RequestWater from './Screens/RequestWater/RequestWater';
import AuthScreen from './Screens/Auth/AuthScreen';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';
import AvailableScreen from './Screens/Consumption/Available';
import ContactUs from './Screens/ContactUs';
import AboutUs from './Screens/AboutUs';
import OrderHistory from "./Screens/Crowdsourcing/OrderHistory";
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

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
        name="home"
        options={{
          headerShown: false, // Hide the default header
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
          headerShown: true, // Hide the default header
          headerTitle: 'Available Water',
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
    <Drawer.Navigator
      screenOptions={{
        headerShown: false, // Hide default headers for all screens
      }}
    >
      <Drawer.Screen
        name="homeScreen"
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
          headerShown: true,
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
          headerShown: true,
          headerTitle: 'Debris Detection',
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
          headerShown: true,
          headerTitle: '',
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
          headerShown: true,
          headerTitle: '',
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
          headerShown: true,
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
          headerShown: true,
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

// Register for push notifications
async function registerForPushNotificationsAsync(): Promise<string | undefined> { 
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return undefined;
  }

  try {
    // Specify the projectId explicitly
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId || '2c1fed33-46da-43d6-83e4-5bd4f6646c10',
    })).data;
    console.log('Expo Push Token:', token);
  } catch (error) {
    console.error('Error getting Expo push token:', error);
    return undefined;
  }

  return token;
}

// Set up notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


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

    registerForPushNotificationsAsync().then(token => {
      if (token) {
      }
    });

    // Handle foreground notifications without showing an in-app alert
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      // No in-app Alert, allow the notification to show as a system notification
    });

    return () => {
      unsubscribe(); // Cleanup the auth listener
      foregroundSubscription.remove(); // Cleanup the notification listener
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BA7" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthScreen">
        {user ? (
          <>
            <Stack.Screen 
              name="index"
              options={{ headerShown: false }} // Set headerShown to false
              >
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
