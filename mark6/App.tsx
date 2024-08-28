import * as React from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./Screens/index";
import DebrisMainScreen from "./Screens/Debris/DebrisMain";
import DetectScreen from "./Screens/Debris/DetectScreen";
import AuthScreen from "./Screens/Auth/AuthScreen"; // Import AuthScreen
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig"; // Import your Firebase config
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AvailableScreen from "./Screens/Consumption/Available";
import OrderHistory from "./Screens/Crowdsourcing/OrderHistory";

// Define the types for your navigation stack
type RootStackParamList = {
  index: undefined;
  main: undefined;
  DebrisMain: undefined;
  DetectScreen: undefined;
  AuthScreen: undefined;
  AvailableScreen: undefined;
  OrderHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
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
          tabBarLabel: "Debris",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="water" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{
          headerShown: false,
          tabBarLabel: "OrderHistory",
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
          tabBarLabel: "Detect",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={size} />
          ),
        }}
      />
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

// Main Drawer Navigator
function MainDrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="index">
      <Drawer.Screen
        name="Home Screen"
        component={MainTabNavigator}
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Debris Screen"
        component={DebrisMainScreen}
        options={{
          drawerLabel: "Debris Main",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="water" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="DetectScreen"
        component={DetectScreen}
        options={{
          drawerLabel: "Detect Screen",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

// Register for push notifications
async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.log("Failed to get push token for push notification!");
    return undefined;
  }

  try {
    // Specify the projectId explicitly
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId:
          Constants.expoConfig?.extra?.eas?.projectId ||
          "2c1fed33-46da-43d6-83e4-5bd4f6646c10",
      })
    ).data;
    console.log("Expo Push Token:", token);
  } catch (error) {
    console.error("Error getting Expo push token:", error);
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

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        // Send the token to your backend if needed
        // Example: sendTokenToBackend(token);
      }
    });

    // Handle foreground notifications without showing an in-app alert
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received in foreground:", notification);
        // No in-app Alert, allow the notification to show as a system notification
      });

    return () => {
      unsubscribe(); // Cleanup the auth listener
      foregroundSubscription.remove(); // Cleanup the notification listener
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007BA7" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthScreen">
        {user ? (
          <Stack.Screen
            name="index"
            component={MainDrawerNavigator}
            options={{ headerShown: false }}
          />
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
