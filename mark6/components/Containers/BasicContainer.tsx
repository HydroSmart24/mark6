// Container.tsx
import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  height?: number; // Optional height prop
}

const BasicContainer: React.FC<ContainerProps> = ({ children, style, height }) => {
  return (
    <View style={[styles.container, { height }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff', // Default background color
    borderWidth: 2, // Width of the border
    borderColor: '#ddd', // Color of the border
    borderRadius: 12, // Rounded corners
  },
});

export default BasicContainer;
