import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, router } from 'expo-router';

interface ButtonProps {
  title: string;
  style?: ViewStyle;
}

const handlePress = () => {
  router.push('/Debris/DebrisMain'); // Navigate to the desired screen
};

const DetectDebris: React.FC<ButtonProps> = ({ title, style }) => {
  return (
    
    <TouchableOpacity style={[styles.button, style]} onPress={handlePress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
    
    
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4299E1', // equivalent to bg-blue-500
    paddingVertical: 8, // equivalent to py-2
    paddingHorizontal: 16, // equivalent to px-4
    borderRadius: 4, // equivalent to rounded
    borderBottomWidth: 4, // equivalent to border-b-4
    borderBottomColor: '#2B6CB0', // equivalent to border-blue-700
    marginTop: 20, // equivalent to mt-5
  },
  buttonText: {
    color: '#FFF', // equivalent to text-white
    fontWeight: 'bold', // equivalent to font-bold
    textAlign: 'center',
  },
});

export default DetectDebris;

