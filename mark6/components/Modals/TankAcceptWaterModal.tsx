import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc, deleteDoc, runTransaction } from 'firebase/firestore'; 
import axios from 'axios';
import { db } from '../../firebase/firebaseConfig';
import BasicLoading from '../Loading/BasicLoading';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  notificationDetails: string;
  requestedAmount: number;
  reqUserId: string;
  receiverUserId: string;
  notificationId: string;
  onAccept: () => void;
  onDecline: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
  notificationDetails,
  requestedAmount,
  reqUserId,
  receiverUserId,
  notificationId,
  onAccept,
  onDecline
}) => {
  const [processLoading, setProcessLoading] = useState(false); // State for loading

  // Function to calculate motor time based on requested liters
  const calculateMotorTime = (liters: number): number => {
    const litersPerSecond = 100 / 5; // 100 liters per 5 seconds (example)
    return liters / litersPerSecond;
  };

  // Function to fetch user IP from Firestore
  const fetchUserIp = async (userId: string) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data()?.ip;  // Ensure we handle 'undefined'
    } else {
      throw new Error('User IP not found.');
    }
  };

  // Function to start the motor on the receiver's side
  const startMotor = async (ip: string, duration: number) => {
    try {
      await axios.post(`http://${ip}/send-water`, { duration });
      console.log('Motor started for', duration, 'seconds');
    } catch (error) {
      console.error('Error starting motor:', error);
      Alert.alert('Error', 'Failed to start motor.');
    }
  };

  // Function to receive water on the requester's side
  const receiveWater = async (ip: string) => {
    try {
      await axios.post(`http://${ip}/receive-water`);
      console.log('Receiving water...');
    } catch (error) {
      console.error('Error activating receive-water:', error);
      Alert.alert('Error', 'Failed to receive water.');
    }
  };

  // Function to stop the motor on the receiver's side
  const stopPump = async (ip: string) => {
    try {
      await axios.post(`http://${ip}/stop-water`);
      console.log('Pump stopped');
    } catch (error) {
      console.error('Error stopping pump:', error);
      Alert.alert('Error', 'Failed to stop the pump.');
    }
  };

  // Function to delete the notification from Firestore
  const deleteNotification = async () => {
    const notificationDocRef = doc(db, `users/${receiverUserId}/notifications`, notificationId);
    try {
      await deleteDoc(notificationDocRef);
      console.log('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Error', 'Failed to delete the notification.');
    }
  };

  // Lock the motor to prevent concurrent operations
  const lockMotor = async (): Promise<boolean> => {
    const motorStatusRef = doc(db, 'system', 'motorStatus');
    return runTransaction(db, async (transaction) => {
      const motorStatusDoc = await transaction.get(motorStatusRef);
      if (motorStatusDoc.exists()) {
        const isMotorActive = motorStatusDoc.data()?.isMotorActive;
        if (!isMotorActive) {
          transaction.update(motorStatusRef, { isMotorActive: true });
          return true; // Motor is successfully locked
        } else {
          return false; // Motor is already active
        }
      } else {
        throw new Error('Motor status document does not exist.');
      }
    });
  };

  // Unlock the motor after completion
  const unlockMotor = async () => {
    const motorStatusRef = doc(db, 'system', 'motorStatus');
    await runTransaction(db, async (transaction) => {
      transaction.update(motorStatusRef, { isMotorActive: false });
    });
  };

  // Handle Accept Request with the motor locking mechanism
  const handleAccept = async () => {
    setProcessLoading(true); // Start loading for Accept
    try {
      const motorLocked = await lockMotor(); // Lock the motor
      if (!motorLocked) {
        Alert.alert('Motor Busy', 'Another request is being processed. Please wait.');
        setProcessLoading(false);
        return;
      }

      // Proceed with water transfer if the motor is locked
      const requesterIp = await fetchUserIp(reqUserId);
      const receiverIp = await fetchUserIp(receiverUserId);
      const motorTime = calculateMotorTime(requestedAmount);

      await startMotor(receiverIp, motorTime);
      await receiveWater(requesterIp);

      setTimeout(async () => {
        await stopPump(receiverIp);
        await axios.post(`http://${requesterIp}/stop-receive-water`);

        await deleteNotification();
        Alert.alert('Success', 'Water request completed and pump stopped.');

        await unlockMotor(); // Unlock the motor after completion
        setProcessLoading(false);
        onAccept(); // Call parent accept handler
      }, motorTime * 1000);
    } catch (error) {
      console.error('Error handling accept:', error);
      Alert.alert('Error', 'An error occurred while processing the request.');
      setProcessLoading(false);
    }
  };

  // Handle Decline Request
  const handleDecline = async () => {
    setProcessLoading(true);
    try {
      await deleteNotification(); // Delete the notification
      setProcessLoading(false);
      onDecline(); // Call parent decline handler
    } catch (error) {
      console.error('Error handling decline:', error);
      Alert.alert('Error', 'An error occurred while processing the decline.');
      setProcessLoading(false);
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
            <TouchableOpacity style={styles.declineButton} onPress={handleDecline} disabled={processLoading}>
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.acceptButton} onPress={handleAccept} disabled={processLoading}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Show the loading indicator */}
        {processLoading && <BasicLoading visible={processLoading} />}
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
