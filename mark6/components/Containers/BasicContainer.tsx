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
    borderRadius: 12, // Rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default BasicContainer;
