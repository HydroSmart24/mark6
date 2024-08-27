import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Modal, ViewStyle, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface ButtonProps {
  title: string;
  style?: ViewStyle;
}

const ResetFilter: React.FC<ButtonProps> = ({ title, style }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);

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
      closeModal(); // Close modal after the second step
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

      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
          <MaterialIcons name="dangerous" size={50} color="red" />
            {step === 1 ? (
              <Text style={styles.modalText}>Did you renew the filter and do you want to reset the filter health?</Text>
            ) : (
              <Text style={styles.modalText}>Proceed if you really have renewed your filter for your own safety!</Text>
            )}
            <View style={step === 1 ? styles.buttonContainer : styles.singleButtonContainer}>
              {step === 1 ? (
                <>
                  <Pressable style={styles.modalButton} onPress={handleNoPress}>
                    <Text style={styles.modalButtonText}>No</Text>
                  </Pressable>
                  <Pressable style={styles.modalButton} onPress={handleYesPress}>
                    <Text style={styles.modalButtonText}>Yes</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable style={styles.modalButton} onPress={handleYesPress}>
                  <Text style={styles.modalButtonText}>Yes, I'm sure</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4299E1', // bg-blue-500
    paddingVertical: 8, // py-2
    paddingHorizontal: 16, // px-4
    borderRadius: 4, // rounded
    borderBottomWidth: 4, // border-b-4
    borderBottomColor: '#2B6CB0', // border-blue-700
    marginTop: 20, // mt-5
  },
  buttonText: {
    color: '#FFF', // text-white
    fontWeight: 'bold', // font-bold
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
