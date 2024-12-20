import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./Screens/index";
import DebrisMain from "./Screens/Debris/DebrisMain";
import DetectScreen from "./Screens/Debris/DetectScreen";
import RequestWater from "./Screens/RequestWater/RequestWater";
import AuthScreen from "./Screens/Auth/AuthScreen";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";
import AvailableScreen from "./Screens/Consumption/Available";
import ContactUs from "./Screens/ContactUs";
import AboutUs from "./Screens/AboutUs";
import Information from "./Screens/Information";
import OrderHistory from "./Screens/Crowdsourcing/OrderHistory";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import UserProfile from "./Screens/Auth/UserProfile";
import {
  registerForPushNotificationsAsync,
  setupNotificationHandler,
} from "./utils/Notification/PushNotification";
import * as Notifications from "expo-notifications";
import DistributorHome from "./Screens/Crowdsourcing/DistributorHome";
import Map from "./Screens/Crowdsourcing/Map";
import { listenForLeakageAndNotify } from "./utils/Notification/LeakageDetectListen";
import LeakageAlert from "./components/AlertModal/LeakageAlert";
import NotificationsScreen from "./Screens/Notifications";
import { createNavigationContainerRef } from '@react-navigation/native';
import { RainfallAPI } from './utils/RainfallAPI'; // Import the RainfallAPI function from the utils folder
import CustomDrawerContent from "./components/Navigator/CustomDrawerContent";
import i18n, { loadAppLanguage } from './i18n';


export const navigationRef = createNavigationContainerRef<RootStackParamList>();


export type RootStackParamList = {
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
  NotificationsScreen: undefined;
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
          headerTitle: i18n.t('information'),
          tabBarLabel: "Info",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="information-circle-sharp"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainDrawerNavigator({ userName }: { userName: string }) {
  return (
    <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />} // Use custom drawer content
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
          headerTitle: "",
          drawerLabel: i18n.t('water_quality'),
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
          headerTitle: i18n.t('availability_and_consumption'),
          drawerLabel: i18n.t('availability'),
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
          headerTitle: i18n.t('debris_detection'),
          drawerLabel: i18n.t('debris_detection'),
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
          headerTitle: i18n.t('order_history'),
          drawerLabel: i18n.t('order_history'),
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
          headerShown: true,
          headerTitle: i18n.t('request_water'),
          drawerLabel: i18n.t('request_water'),
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
          headerTitle: "",
          drawerLabel: i18n.t('contact_us'),
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
          headerTitle: "",
          drawerLabel: i18n.t('about_us'),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="UserProfile"
        options={{
          headerShown: true,
          headerTitle: i18n.t('user_profile'),
          drawerLabel: i18n.t('user_profile'),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      >
        {(props) => (
          <UserProfile
            {...props}
            userName={userName}
            userEmail={auth.currentUser?.email || ""}
          />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [userName, setUserName] = React.useState<string | null>(null);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState<string>("");

  // Function to handle leakage detection alert
  const handleLeakageDetected = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };



React.useEffect(() => {
  let unsubscribeLeakageListener: (() => void) | undefined;

  // Initialize the app by loading the language first
  const initializeApp = async () => {
    try {
      await loadAppLanguage(); // Load saved language
      console.log(`Language initialized to: ${i18n.locale}`);
    } catch (error) {
      console.error('Error loading language:', error);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        const uid = user.uid;
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserName(docSnap.data()?.name || null);
        }

        try {
          const pushToken = await registerForPushNotificationsAsync();
          if (pushToken) {
            await setDoc(docRef, { pushtoken: pushToken }, { merge: true });

            // Listen for leakage detection notifications
            unsubscribeLeakageListener = listenForLeakageAndNotify(
              pushToken,
              uid,
              handleLeakageDetected
            );
          }
        } catch (error) {
          console.error('Error registering push notifications:', error);
        }

        try {
          await RainfallAPI(); // Call Rainfall API
        } catch (error) {
          console.error('Error calling Rainfall API:', error);
        }
      }
    });

    // Handle foreground notifications
    const foregroundSubscription = 
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('Notification received in foreground:', notification);
      });

    // Handle notification responses
    const responseListener = 
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification clicked:', response);

        if (navigationRef.isReady()) {
          navigationRef.navigate('NotificationsScreen' as keyof RootStackParamList);
        }
      });

    setupNotificationHandler(); // Set up the notification handler

    // Cleanup function to remove listeners
    return () => {
      unsubscribe(); // Remove auth listener
      foregroundSubscription.remove(); // Remove foreground listener
      responseListener.remove(); // Remove response listener

      if (unsubscribeLeakageListener) {
        unsubscribeLeakageListener(); // Stop leakage listener
      }
    };
  };

  // Call the initialize function
  initializeApp();
}, []);

  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007BA7" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="AuthScreen">
        {user ? (
          <>
            {user.email === "dis@gmail.com" ? (
              <>
                <Stack.Screen
                  name="DistributorHome"
                  component={DistributorHome}
                  options={{ headerShown: false, title: "Distributor Home" }}
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
                    <MainDrawerNavigator {...props} userName={userName || ""} />
                  )}
                </Stack.Screen>
                  <Stack.Screen
                    name="RequestWater"
                    component={RequestWater}
                    options={{
                      headerShown: true,
                      title: 'Request Water',
                    }}
                  />
                  <Stack.Screen
                    name="DebrisMain"
                    component={DebrisMain}
                    options={{
                      headerShown: true,
                      title: i18n.t('filter_health'),
                    }}
                  />
                  <Stack.Screen
                    name="DetectScreen"
                    component={DetectScreen}
                    options={{ 
                      headerShown: true,
                      title: i18n.t('debris_detection'),
                    }}
                  />
                  <Stack.Screen
                    name="OrderHistory"
                    component={OrderHistory}
                    options={{
                      headerShown: true,
                      title: 'Order History',
                    }}
                  />
                  <Stack.Screen
                    name="AvailableScreen"
                    component={AvailableScreen}
                    options={{
                      headerShown: true,
                      title: i18n.t('availability_and_consumption'),
                    }}
                  />
                  <Stack.Screen
                    name="NotificationsScreen"
                    component={NotificationsScreen}
                    options={{ 
                      headerShown: true, 
                      title: i18n.t('notifications') }}
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

      <LeakageAlert
        visible={alertVisible}
        title="Leakage Detected!"
        message={alertMessage}
        onClose={() => setAlertVisible(false)} // Close the alert when the user presses 'Close'
        iconSize={50}
      />
    </NavigationContainer>
  );
}
