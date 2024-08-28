import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ visible, onCancel }) => {
  const [step, setStep] = useState(1);

  const handleYesPress = () => {
    if (step === 1) {
      setStep(2); // Go to the next step
    } else {
      setStep(1); // Reset the step when closing
      onCancel(); // Close modal
    }
  };

  const handleNoPress = () => {
    setStep(1); // Reset step when closing
    onCancel();
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <MaterialCommunityIcons name="alert-circle" size={60} color="#FF3B30" />
          {step === 1 ? (
            <Text style={styles.modalText}>Are you sure you want to proceed?</Text>
          ) : (
            <Text style={styles.modalText}>Are you really sure?</Text>
          )}
          <View style={styles.buttonContainer}>
            {step === 1 ? (
              <>
                <Button title="Yes" onPress={handleYesPress} />
                <Button title="No" onPress={handleNoPress} />
              </>
            ) : (
              <Button title="Yes, I'm sure" onPress={handleYesPress} />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginVertical: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default ConfirmModal;
