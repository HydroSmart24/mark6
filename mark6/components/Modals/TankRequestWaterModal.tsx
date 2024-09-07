import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPushNotificationToken } from '../../utils/GetTankOwnerPushNotificationToken';
import { sendPushNotification } from '../../utils/Notification/TankWaterRequestNotification';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  ownerName: string;
  availableLiters: number;
  ownerId: string;
  currentUserName: string;
}

const TankRequestWaterModal: React.FC<ModalProps> = ({ visible, onClose, ownerName, availableLiters, ownerId, currentUserName }) => {
  const [requestedAmount, setRequestedAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (text: string) => {
    const numericValue = parseFloat(text);

    if (!isNaN(numericValue) && numericValue > availableLiters) {
      setError(`Cannot request more than ${availableLiters} liters.`);
    } else {
      setError(null);
    }

    setRequestedAmount(text);
  };

  const handleConfirm = async () => {
    if (!requestedAmount) {
      setError('Please enter an amount.');
      return;
    }
  
    if (!error) {
      try {
        const pushToken = await getPushNotificationToken(ownerName); // Fetch the push token
        if (pushToken) {
          console.log('Push notification token:', pushToken);
          await sendPushNotification(pushToken, ownerName, requestedAmount, ownerId, currentUserName); // Call the sendPushNotification function
        }
        onClose();
      } catch (err) {
        console.error('Error confirming request:', err);
      }
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>

              {/* Modal Content */}
              <Text style={styles.modalText}>Request Water</Text>

              {/* Horizontal Line */}
              <View style={styles.separator} />

              {/* Display the tank owner's name */}
              <Text style={styles.contentText}>
                Tank Owner - <Text style={styles.boldText}>{ownerName}</Text>
              </Text>

              {/* Request Amount Input */}
              <View style={styles.inputBackground}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder={`Max amount: ${availableLiters}`}
                    placeholderTextColor="#A9A9A9"
                    keyboardType="numeric"
                    value={requestedAmount}
                    onChangeText={handleChange}
                  />
                  <Text style={styles.unitText}>Liters</Text>
                </View>
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}

              {/* Confirm Button */}
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  error ? styles.disabledButton : null,
                ]}
                onPress={handleConfirm}
                disabled={!!error}
              >
                <Text
                  style={[
                    styles.confirmButtonText,
                    error ? styles.disabledButtonText : null,
                  ]}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default TankRequestWaterModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    position: 'relative',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 10,
  },
  contentText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  inputBackground: {
    backgroundColor: '#D3D3D3',
    borderRadius: 4,
    padding: 5,
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  input: {
    width: '70%',
    borderWidth: 0,
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  unitText: {
    width: '30%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#696969',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4299E1',
    padding: 5,
    borderRadius: 15,
  },
  confirmButton: {
    backgroundColor: '#4299E1',
    borderRadius: 4,
    padding: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  disabledButtonText: {
    color: '#808080',
  },
});
