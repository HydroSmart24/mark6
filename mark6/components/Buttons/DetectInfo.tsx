import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the type for the navigation prop
type RootStackParamList = {
  DetectScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ButtonProps {
  title: string;
  style?: ViewStyle;
  colorType?: 1 | 2; // New prop to determine button color
}

const DetectDebris: React.FC<ButtonProps> = ({ title, style, colorType = 1 }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate("DetectScreen"); // Navigate to the desired screen
  };

  // Determine button color based on colorType
  const buttonColor = colorType === 2 ? '#E53E3E' : '#4299E1'; // Red for colorType 2, blue for default
  const borderBottomColor = colorType === 2 ? '#C53030' : '#2B6CB0'; // Darker red for border if colorType 2

  return (
    <TouchableOpacity
      style={[styles.button, style, { backgroundColor: buttonColor, borderBottomColor }]}
      onPress={handlePress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderBottomWidth: 4,
    marginTop: 40,
    height: 50,
    width: 120,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default DetectDebris;
