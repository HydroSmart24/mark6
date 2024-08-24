import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the type for the navigation prop
type RootStackParamList = {
  DebrisMain: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ButtonProps {
  title: string;
  style?: ViewStyle;
}

const WaterQuality: React.FC<ButtonProps> = ({ title, style }) => {
  
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('DebrisMain'); // Navigate to the DebrisMain screen
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handlePress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4299E1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderBottomWidth: 4,
    borderBottomColor: '#2B6CB0',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WaterQuality;
