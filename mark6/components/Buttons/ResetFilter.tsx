import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Modal, ViewStyle, Pressable, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { resetExpirationDate } from '../../utils/FilterHealthCalc'; // Import the function
import i18n from '../../i18n';

interface ButtonProps {
  title: string;
  style?: ViewStyle;
  onReset: () => void;
}

const ResetFilter: React.FC<ButtonProps> = ({ title, style, onReset }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const backgroundAnimation = useRef(new Animated.Value(0)).current; // Initial opacity value: 0

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(backgroundAnimation, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start(() => setAnimationCompleted(true)); // Start animation when modal becomes visible
    } else {
      Animated.timing(backgroundAnimation, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => setAnimationCompleted(false)); // Animate out when modal is hidden
    }
  }, [modalVisible]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setStep(1); // Reset to the first step when the modal is closed
  };

  const handleYesPress = () => {
    if (step === 1) {
      setStep(2);
    } else {
      onReset(); // Call the passed onReset function
      closeModal(); // Close modal after reset
    }
  };

  const handleNoPress = () => {
    closeModal();
  };

  return (
    <>
      <TouchableOpacity style={[styles.button, style]} onPress={openModal}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>

      <Modal transparent={true} visible={modalVisible} animationType="none">
        <Animated.View style={[styles.modalBackground, { opacity: backgroundAnimation }]}>
          <View style={styles.modalContainer}>
            <MaterialIcons name="dangerous" size={50} color="red" />
            {step === 1 ? (
              <Text style={styles.modalText}>{i18n.t('reset_popup')}</Text>
            ) : (
              <Text style={styles.modalText}>{i18n.t('proceed_safety')}</Text>
            )}
            <View style={step === 1 ? styles.buttonContainer : styles.singleButtonContainer}>
              {step === 1 ? (
                <>
                  <Pressable style={styles.modalButton} onPress={handleNoPress}>
                    <Text style={styles.modalButtonText}>{i18n.t('no')}</Text>
                  </Pressable>
                  <Pressable style={styles.modalButton} onPress={handleYesPress}>
                    <Text style={styles.modalButtonText}>{i18n.t('yes')}</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable style={styles.modalButton} onPress={handleYesPress}>
                  <Text style={styles.modalButtonText}>{i18n.t("yes, I'm sure")}</Text>
                </Pressable>
              )}
            </View>
          </View>
        </Animated.View>
      </Modal>
    </>
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
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  singleButtonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#4299E1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
    minWidth: '40%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default ResetFilter;
