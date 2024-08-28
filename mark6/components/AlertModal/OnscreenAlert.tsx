import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // You might need to install this package

interface AlertProps {
  message: string;
  onClose: () => void;
  isVisible: boolean;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
  return (
    <View style={styles.alertContainer}>
      <View style={styles.messageContainer}>
        <Text style={styles.strongText}>Danger!</Text>
        <Text style={styles.messageText}>{message}</Text>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <MaterialIcons name="close" size={24} color="#dc2626" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    backgroundColor: '#fef2f2', // bg-red-100
    borderColor: '#fca5a5', // border-red-400
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  messageContainer: {
    flex: 1,
  },
  strongText: {
    fontWeight: 'bold',
    color: '#b91c1c', // text-red-700
  },
  messageText: {
    color: '#b91c1c', // text-red-700
    marginRight: 13,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    bottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Alert;
