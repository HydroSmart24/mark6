import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface CustomTextProps {
  text: string;
  color?: string;
  size?: number;
  opacity?: number;
  style?: TextStyle;
}

const CustomText: React.FC<CustomTextProps> = ({ text, color = '#000', size = 14, opacity = 1, style }) => {
  return (
    <Text style={[styles.text, { color, fontSize: size, opacity }, style]}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold', // Default font weight
    marginTop: 2, // Default margin top
  },
});

export default CustomText;
