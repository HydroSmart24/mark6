import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from '@expo/vector-icons/AntDesign';
import MoreInfoModal from './MoreInfoModal';
import i18n from '../../i18n';

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
  const [step, setStep] = useState(1); 

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

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1); // Move to next description
    } else {
      onClose(); // Close the modal on the last step
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} onSwipeComplete={onClose} swipeDirection="down">
      <View style={styles.modalContent}>
        {step === 1 && (
            <>
                <Animated.View style={{ opacity: blinkAnim }}>
                <AntDesign name="warning" size={iconSize} color="red" style={styles.icon} />
                </Animated.View>
                <Text style={styles.message}>{message}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={handleNext}>
                <Text style={styles.closeButtonText}>{i18n.t('what_do')}</Text>
                </TouchableOpacity>
            </>
        )}
        {step === 2 && (
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
        {step === 3 && (
          <>
            <Text style={styles.modalTitle}>{i18n.t('what_do')}</Text>
            <Text style={styles.modalText}>
            {i18n.t('clear_out')}
            </Text>
            <TouchableOpacity style={styles.closeButton2} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </>
        )}
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
  closeButton2: {
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

export default IconTextModal;
