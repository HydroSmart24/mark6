import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Map: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ButtonProps {
  style?: ViewStyle;
}

const StartJourney: React.FC<ButtonProps> = ({ style }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate("Map"); // Navigate to the Map screen
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handlePress}>
      <View style={styles.buttonContent}>
        <MaterialCommunityIcons name="truck-delivery" size={28} color="white" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4299E1", // equivalent to bg-blue-500
    width: 80, // Set the width and height to make it round
    height: 80,
    borderRadius: 40, // Half of the width/height to make it a circle
    justifyContent: "center", // Center the icon inside the button
    alignItems: "center",
    position: "absolute", // Make the button float
    bottom: 60, // Position from the bottom
    right: 20, // Position from the right
    elevation: 5, // Add some shadow for a floating effect
    shadowColor: "#000", // Shadow for Android
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.3, // Shadow opacity for iOS
    shadowRadius: 3, // Shadow blur radius for iOS
  },
  buttonContent: {
    alignItems: "center", // Center icon horizontally and vertically
  },
});

export default StartJourney;
