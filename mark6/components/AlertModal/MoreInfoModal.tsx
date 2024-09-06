import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface MoreInfoModalProps {
  onClose: () => void;
}

const MoreInfoModal: React.FC<MoreInfoModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1); // State to track the current description step

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1); // Move to next description
    } else {
      onClose(); // Close the modal on the last step
    }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        {step === 1 && (
          <>
            <Text style={styles.modalTitle}>What should i do?</Text>
            <Text style={styles.modalText}>
              If the Severity levels are high, you should stop drinking water!
            </Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}
        {step === 2 && (
          <>
            <Text style={styles.modalTitle}>What should i do?</Text>
            <Text style={styles.modalText}>
              Clear out the debris and clean the water tank before drinking.
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent dark background
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
