import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import { db } from '../../firebase/firebaseConfig';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  notificationDetails: string;
  requestedAmount: number;
  reqUserId: string; // The ID of the user making the request
  receiverUserId: string; // The ID of the user receiving the water
  onAccept: () => void;
  onDecline: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ visible, onClose, notificationDetails, requestedAmount, reqUserId, receiverUserId, onAccept, onDecline }) => {
  // Function to calculate motor activation time
  const calculateMotorTime = (liters: number): number => {
    const litersPerSecond = 100 / 5; // 100 liters in 5 seconds
    return (liters / litersPerSecond); // Time in seconds
  };

  // Function to fetch the IP address of a user from Firebase
  const fetchUserIp = async (userId: string) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data().ip;
    } else {
      throw new Error('User IP not found.');
    }
  };

  // Function to send a request to ESP to start the motor
  const startMotor = async (ip: string, duration: number) => {
    try {
      await axios.post(`http://${ip}/send-water`, { duration });
      console.log('Motor started for', duration, 'seconds');
    } catch (error) {
      console.error('Error starting motor:', error);
      Alert.alert('Error', 'Failed to start motor.');
    }
  };

  // Function to send a request to ESP to receive water
  const receiveWater = async (ip: string) => {
    try {
      await axios.post(`http://${ip}/receive-water`);
      console.log('Receiving water...');
    } catch (error) {
      console.error('Error activating receive-water:', error);
      Alert.alert('Error', 'Failed to receive water.');
    }
  };

  // Function to stop the pump
  const stopPump = async (ip: string) => {
    try {
      await axios.post(`http://${ip}/stop-water`);
      console.log('Pump stopped');
    } catch (error) {
      console.error('Error stopping pump:', error);
      Alert.alert('Error', 'Failed to stop the pump.');
    }
  };

  const handleAccept = async () => {
    try {
      // Fetch the IP of the user who requested water (reqUserId)
      const requesterIp = await fetchUserIp(reqUserId);
  
      // Fetch the IP of the receiver (receiverUserId)
      const receiverIp = await fetchUserIp(receiverUserId);
  
      // Calculate the duration for motor activation
      const motorTime = calculateMotorTime(requestedAmount);
  
      // Start the motor on the receiver's ESP (receiverUserId)
      await startMotor(receiverIp, motorTime);
  
      // Activate the receive-water function on the requester's ESP (reqUserId)
      await receiveWater(requesterIp); // Use the requester's IP here
  
      // Stop the pump and stop receiving water after the motor has run for the calculated time
      setTimeout(async () => {
        // Stop the pump on the receiver ESP (receiverUserId)
        await stopPump(receiverIp);
  
        // Stop the water reception on the requester's ESP (reqUserId)
        await axios.post(`http://${requesterIp}/stop-receive-water`); // Use requester's IP here
        console.log('Stopped receiving water');
  
        Alert.alert('Success', 'Water request completed and pump stopped.');
      }, motorTime * 1000); // Convert motorTime to milliseconds
  
      // Call the parent onAccept handler
      onAccept();
    } catch (error) {
      console.error('Error handling accept:', error);
      Alert.alert('Error', 'An error occurred while processing the request.');
    }
  };
  

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Water Request</Text>
          <Text style={styles.modalBody}>{notificationDetails}</Text>
          
          {/* Accept and Decline Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.declineButton} onPress={onDecline}>
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
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
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#4299E1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 20,
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  declineButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  declineButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NotificationModal;
