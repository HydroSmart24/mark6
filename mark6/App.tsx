import * as React from "react";
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
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";
import AvailableScreen from "./Screens/Consumption/Available";
import ContactUs from "./Screens/ContactUs";
import AboutUs from "./Screens/AboutUs";
import OrderHistory from "./Screens/Crowdsourcing/OrderHistory";
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
  RequestWater: undefined;
  DistributorHome: undefined; // Add DistributorHome to RootStackParamList
  Map: undefined;
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
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
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
        name="DebrisScreen"
        component={DebrisMain}
        options={{
          headerTitle: "",
          drawerLabel: "FilterHealth",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="health-and-safety" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="DetectScreen"
        component={DetectScreen}
        options={{
          drawerLabel: "Debris Detection",
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
          headerTitle: "",
          drawerLabel: "Contact Us",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="call" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AboutUs"
        component={AboutUs}
        options={{
          headerTitle: "",
          drawerLabel: "About Us",
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
    return null; // You can add a loading indicator here if needed
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
