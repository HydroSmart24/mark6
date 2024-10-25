import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import i18n from '../../i18n';

interface MoreInfoModalProps {
    onClose: () => void;
  }

const MoreInfoModal: React.FC<MoreInfoModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1); // State to track the current description step
  const scaleAnim = useRef(new Animated.Value(0)).current; // Animated value for the scale
  const backgroundOpacity = useRef(new Animated.Value(0)).current; // Animated value for background opacity

  useEffect(() => {
    // Run the background fade-in animation
    Animated.timing(backgroundOpacity, {
      toValue: 1, // Fade in to full opacity
      duration: 250, // Duration of the animation
      useNativeDriver: true, // Use native driver for better performance
    }).start();

    // Run the pop animation for the modal
    Animated.timing(scaleAnim, {
      toValue: 1, // Scale up to original size
      duration: 350, // Duration of the animation
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, [backgroundOpacity, scaleAnim]);

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1); // Move to next description
    } else {
      onClose(); // Close the modal on the last step
    }
  };

  return (
    <Animated.View style={[styles.modalContainer, { opacity: backgroundOpacity }]}>
      <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleAnim }] }]}>
        {step === 1 && (
          <>
            <Text style={styles.modalTitle}>{i18n.t('what_do')}</Text>
            <Text style={styles.modalText}>
            {i18n.t('stop_drinking')}
            </Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.buttonText}>{i18n.t('next')}</Text>
            </TouchableOpacity>
          </>
        )}
        {step === 2 && (
          <>
            <Text style={styles.modalTitle}>{i18n.t('what_do')}</Text>
            <Text style={styles.modalText}>
            {i18n.t('clear_out')}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    ...StyleSheet.absoluteFillObject, // Cover the whole screen
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF', // White background for the container
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    transform: [{ scale: 0 }], // Start with scale 0 for the pop effect
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#4299E1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: '#E53E3E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MoreInfoModal;
