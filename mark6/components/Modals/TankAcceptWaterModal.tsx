import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc, deleteDoc } from 'firebase/firestore'; 
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

  const calculateMotorTime = (liters: number): number => {
    const litersPerSecond = 100 / 5;
    return liters / litersPerSecond;
  };

  const fetchUserIp = async (userId: string) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data().ip;
    } else {
      throw new Error('User IP not found.');
    }
  };

  const startMotor = async (ip: string, duration: number) => {
    try {
      await axios.post(`http://${ip}/send-water`, { duration });
      console.log('Motor started for', duration, 'seconds');
    } catch (error) {
      console.error('Error starting motor:', error);
      Alert.alert('Error', 'Failed to start motor.');
    }
  };

  const receiveWater = async (ip: string) => {
    try {
      await axios.post(`http://${ip}/receive-water`);
      console.log('Receiving water...');
    } catch (error) {
      console.error('Error activating receive-water:', error);
      Alert.alert('Error', 'Failed to receive water.');
    }
  };

  const stopPump = async (ip: string) => {
    try {
      await axios.post(`http://${ip}/stop-water`);
      console.log('Pump stopped');
    } catch (error) {
      console.error('Error stopping pump:', error);
      Alert.alert('Error', 'Failed to stop the pump.');
    }
  };

  const deleteNotification = async () => {
    const userId = receiverUserId;
    try {
      const notificationDocRef = doc(db, `users/${userId}/notifications`, notificationId);
      await deleteDoc(notificationDocRef);
      console.log('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Error', 'Failed to delete the notification.');
    }
  };

  // Handle Accept Request
  const handleAccept = async () => {
    setProcessLoading(true); // Start loading for Accept
    console.log("Loading set to true for Accept");
    try {
      const requesterIp = await fetchUserIp(reqUserId);
      const receiverIp = await fetchUserIp(receiverUserId);
      const motorTime = calculateMotorTime(requestedAmount);

      await startMotor(receiverIp, motorTime);
      await receiveWater(requesterIp);

      setTimeout(async () => {
        await stopPump(receiverIp);
        await axios.post(`http://${requesterIp}/stop-receive-water`);
        console.log('Stopped receiving water');

        await deleteNotification();
        Alert.alert('Success', 'Water request completed and pump stopped.');
        setProcessLoading(false); // Stop loading after success
        console.log("Loading set to false");
        onAccept(); // Call parent accept handler
      }, motorTime * 1000);
    } catch (error) {
      console.error('Error handling accept:', error);
      Alert.alert('Error', 'An error occurred while processing the request.');
      setProcessLoading(false); // Stop loading in case of error
    }
  };

  // Handle Decline Request
  const handleDecline = async () => {
    setProcessLoading(true); // Start loading for Decline
    console.log("Loading set to true for Decline");
    try {
      await deleteNotification(); // Call function to delete the notification
      setProcessLoading(false); // Stop loading after success
      onDecline(); // Call parent decline handler
      console.log("Loading set to false after decline");
    } catch (error) {
      console.error('Error handling decline:', error);
      Alert.alert('Error', 'An error occurred while processing the decline.');
      setProcessLoading(false); // Stop loading in case of error
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
