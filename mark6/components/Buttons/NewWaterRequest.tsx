// NewWaterRequest.tsx
import React from "react";
import { TouchableOpacity, StyleSheet, View, ViewStyle } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface ButtonProps {
  style?: ViewStyle;
  onPress?: () => void; // Add the onPress prop
}

const NewWaterRequest: React.FC<ButtonProps> = ({ style, onPress }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <View style={styles.buttonContent}>
        <MaterialCommunityIcons
          name="water-plus"
          size={32} // Increased size
          color="#FFF" // White color for the icon
          style={styles.icon} // Center the icon
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4299E1", // Background color
    padding: 20, // Padding to make the button larger
    borderRadius: 50, // Make the button circular
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    elevation: 3, // Add some shadow for a 3D effect
  },
  buttonContent: {
    flexDirection: "row", // Align content horizontally
    alignItems: "center", // Center content vertically
  },
  icon: {
    alignSelf: "center", // Center the icon
  },
});

export default NewWaterRequest;
