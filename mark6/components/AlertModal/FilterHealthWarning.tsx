import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from '@expo/vector-icons/AntDesign';

interface IconTextModalProps {
  isVisible: boolean;
  onClose: () => void;
  iconSize?: number;
  message: string;
}

const IconTextModal: React.FC<IconTextModalProps> = ({
  isVisible,
  onClose,
  iconSize = 50,
  message,
}) => {
  const blinkAnim = useRef(new Animated.Value(1)).current; // Initial opacity value: 1

  useEffect(() => {
    const blink = () => {
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => blink());
    };

    blink();

    return () => blinkAnim.stopAnimation(); // Stop the animation when the component is unmounted
  }, [blinkAnim]);

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} onSwipeComplete={onClose} swipeDirection="down">
      <View style={styles.modalContent}>
        <Animated.View style={{ opacity: blinkAnim }}>
          <AntDesign name="warning" size={iconSize} color="red" style={styles.icon} />
        </Animated.View>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default IconTextModal;
