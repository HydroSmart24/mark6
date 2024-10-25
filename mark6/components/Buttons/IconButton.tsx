import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  OrderHistory: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ButtonProps {
  title: string;
  style?: ViewStyle;
}

const Button3D: React.FC<ButtonProps> = ({ title, style }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate("OrderHistory");
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handlePress}>
      <View style={styles.buttonContent}>
        <MaterialCommunityIcons name="tanker-truck" size={29} color="#FFF" />
        <View style={styles.textContent}>
          {/* Split the title into two lines */}
          <Text style={styles.buttonText}>{title.split(" ")[0]}</Text>
          <Text style={styles.buttonText}>{title.split(" ")[1]}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4299E1", // equivalent to bg-blue-500
    paddingVertical: 15, // equivalent to py-2
    // paddingHorizontal: 20, // equivalent to px-4
    width: '46%', // equivalent to w-40
    borderRadius: 4, // equivalent to rounded
    borderBottomWidth: 4, // equivalent to border-b-4
    borderBottomColor: "#2B6CB0", // equivalent to border-blue-700
    alignItems: "center", // Center content horizontally
    marginTop: 10, // Space between buttons
  },
  buttonContent: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center content vertically
  },
  textContent: {
    flexDirection: "column", // Stack text vertically
    alignItems: "flex-start", // Center text horizontally
    marginLeft: 10, // Space between icon and text
  },
  buttonText: {
    color: "#FFF", // equivalent to text-white
    fontWeight: "bold", // equivalent to font-bold
    textAlign: "center",
  },
});

export default Button3D;
