import * as React from "react";
import { View, ActivityIndicator } from 'react-native';
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
import Information from './Screens/Information';
import OrderHistory from "./Screens/Crowdsourcing/OrderHistory";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';
import UserProfile from './Screens/Auth/UserProfile';
import { registerForPushNotificationsAsync, setupNotificationHandler } from './utils/Notification/PushNotification';  // Import utility functions
import * as Notifications from 'expo-notifications';
import DistributorHome from "./Screens/Crowdsourcing/DistributorHome";
import Map from "./Screens/Crowdsourcing/Map";


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
  Information: undefined;
  RequestWater: undefined;
  DistributorHome: undefined; // Add DistributorHome to RootStackParamList
  Map: undefined;
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
        name="Information"
        component={Information}
        options={{
          headerShown: true,
          headerTitle: 'Information',
          tabBarLabel: "Info",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle-sharp" color={color} size={size} />
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
        headerShown: false,
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
        name="AvailabilityScreen"
        component={AvailableScreen}
        options={{
          headerShown: true,
          headerTitle: 'Availability & Consumption',
          drawerLabel: 'Availability',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="water" size={size} color={color} />
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
            <MaterialCommunityIcons
              name="smoke-detector-alert"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{
          headerShown: true,
          headerTitle: "Order History",
          drawerLabel: "Order History",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="tanker-truck"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="RequestWater"
        component={RequestWater}
        options={{
          headerTitle: "Request Water",
          drawerLabel: "Request Water",
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
        <Drawer.Screen
        name="UserProfile"
        options={{
          headerShown: true,
          headerTitle: 'Profile',
          drawerLabel: "User Profile",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      >
        {(props) => <UserProfile {...props} userName={userName} userEmail={auth.currentUser?.email || ''} />}
      </Drawer.Screen>
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

        const pushToken = await registerForPushNotificationsAsync();
        if (pushToken) {
          await setDoc(docRef, { pushtoken: pushToken }, { merge: true });
        }
      }
    });

    setupNotificationHandler(); // Setup the notification handler

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
            {user.email === "dis@gmail.com" ? (
              <>
                <Stack.Screen
                  name="DistributorHome"
                  component={DistributorHome}
                  options={{ headerShown: true, title: "Distributor Home" }}
                />
                <Stack.Screen
                  name="Map"
                  component={Map}
                  options={{ headerShown: true, title: "Map" }}
                />
              </>
            ) : (
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
                    title: "Filter Health",
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
                    title: "Order History",
                  }}
                />
              </>
            )}
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
