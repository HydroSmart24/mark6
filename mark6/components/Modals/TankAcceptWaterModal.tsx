import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from '../../firebase/firebaseConfig'; // Adjust path if needed
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import axios from 'axios';
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
  onDecline,
}) => {
  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const calculateMotorTime = (liters: number): number => {
    const litersPerSecond = 100 / 5; // Example: 20 liters per second
    return liters / litersPerSecond;
  };

  const sendAPIRequest = async (endpoint: string, data: object = {}): Promise<void> => {
    try {
      console.log(`Sending request to ${endpoint} with data:`, data);
      const params = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => params.append(key, String(value)));
  
      const response = await axios.post(`http://${endpoint}`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
  
      console.log(`API call to ${endpoint} successful:`, response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error calling ${endpoint}:`, error.message);
        console.error(`Response data: ${error.response?.data}`);
      } else {
        console.error('Unexpected error:', error);
      }
      Alert.alert('Error', `Failed to perform action: ${endpoint}`);
    }
  };
  

  const fetchUserIp = async (userId: string): Promise<string | null> => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const ip = userDoc.data()?.ip;
        console.log(`Fetched user IP: ${ip}`);
        return ip || null;
      }
      console.error('User document not found');
      return null;
    } catch (error) {
      console.error('Error fetching user IP:', error);
      return null;
    }
  };

  const startMotor = async (ip: string, duration: number): Promise<void> => {
    try {
      await axios.post(`http://${ip}/send-water`, { duration });
      console.log(`Motor started for ${duration} seconds`);
    } catch (error) {
      console.error('Error starting motor:', error);
      Alert.alert('Error', 'Failed to start motor.');
    }
  };

  const receiveWater = async (ip: string): Promise<void> => {
    try {
      await axios.post(`http://${ip}/receive-water`);
      console.log('Receiving water...');
    } catch (error) {
      console.error('Error activating receive-water:', error);
      Alert.alert('Error', 'Failed to receive water.');
    }
  };

  const stopPump = async (ip: string): Promise<void> => {
    try {
      await axios.post(`http://${ip}/stop-water`);
      console.log('Pump stopped');
    } catch (error) {
      console.error('Error stopping pump:', error);
      Alert.alert('Error', 'Failed to stop the pump.');
    }
  };

  const deleteNotification = async (): Promise<void> => {
    try {
      const notificationDocRef = doc(
        db,
        `users/${receiverUserId}/notifications`,
        notificationId
      );
      await deleteDoc(notificationDocRef);
      console.log('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Error', 'Failed to delete the notification.');
    }
  };

  const addToQueue = async (userId: string): Promise<number> => {
    try {
      const queueRef = collection(db, 'waterQueue');
      const userDoc = await getDoc(doc(queueRef, userId));

      if (userDoc.exists()) {
        console.log(`User already in queue: ${userDoc.data()?.queueNumber}`);
        return userDoc.data()?.queueNumber;
      }

      const q = query(queueRef, orderBy('queueNumber', 'desc'), limit(1));
      const snapshot = await getDocs(q);

      let newQueueNumber = 1;
      if (!snapshot.empty) {
        newQueueNumber = snapshot.docs[0].data()?.queueNumber + 1;
      }

      await setDoc(doc(queueRef, userId), {
        queueNumber: newQueueNumber,
        userId,
        taskStatus: 'pending',
      });

      console.log(`User added with queue number: ${newQueueNumber}`);
      return newQueueNumber;
    } catch (error) {
      console.error('Error adding user to queue:', error);
      throw error;
    }
  };

  const updateQueueStatus = async (
    ip: string | null,
    position: number,
    status: string
  ): Promise<void> => {
    if (!ip) {
      console.error('IP address is null, cannot update queue status.');
      return;
    }
    try {
      const payload = { queuePosition: position, status };
      await sendAPIRequest(`${ip}/update-queue`, payload);
      console.log(`Queue status updated to ${status} for position ${position}`);
    } catch (error) {
      console.error('Failed to update queue status:', error);
    }
  };
  
  
  const stopReceivingWater = async (ip: string): Promise<void> => {
    try {
      await sendAPIRequest(`${ip}/stop-receive-water`);
      console.log('Stopped receiving water.');
    } catch (error) {
      console.error('Failed to stop receiving water:', error);
    }
  };
  
  

  const handleLoading = (loading: boolean): void => setProcessLoading(loading);

  const handleAccept = async (): Promise<void> => {
    handleLoading(true);
    try {
      const queueNumber = await addToQueue(receiverUserId);
      console.log(`User added to queue with queue number: ${queueNumber}`);
  
      if (queueNumber === 1) {
        await processWaterRequest();
        await updateQueueStatus(await fetchUserIp(receiverUserId), queueNumber, 'in-queue');
      } else {
        Alert.alert('Queue', `You're in position ${queueNumber}. Please wait.`);
        await waitForQueueTurn();
        await processWaterRequest();
      }
    } catch (error) {
      console.error('Error handling accept:', error);
      Alert.alert('Error', 'An error occurred while processing the request.');
    } finally {
      handleLoading(false);
    }
  };
  

  const handleDecline = async (): Promise<void> => {
    handleLoading(true);
    try {
      await deleteNotification();
      onDecline();
      console.log('Decline handled successfully');
    } catch (error) {
      console.error('Error handling decline:', error);
      Alert.alert('Error', 'An error occurred while processing the decline.');
    } finally {
      handleLoading(false);
    }
  };

  const processWaterRequest = async (): Promise<void> => {
    try {
      const requesterIp = await fetchUserIp(reqUserId);
      const receiverIp = await fetchUserIp(receiverUserId);
      const motorTime = calculateMotorTime(requestedAmount);
  
      if (requesterIp && receiverIp) {
        console.log('Starting motor and receiving water...');
  
        // Run motor and receive water in parallel
        await Promise.all([
          startMotor(receiverIp, motorTime),
          receiveWater(requesterIp),
        ]);
  
        console.log('Waiting for the motor to complete...');
        await new Promise((resolve) => setTimeout(resolve, motorTime * 1000));
  
        console.log('Stopping motor and receiving...');
        await stopPump(receiverIp);
        await stopReceivingWater(requesterIp);  // Turn green, then red
  
        console.log('Updating queue status to complete...');
        await updateQueueStatus(await fetchUserIp(receiverUserId), 1, 'complete');
  
        console.log('Deleting queue entry and notification...');
        await deleteQueueEntry(receiverUserId);
        await updateRemainingQueue();
        await deleteNotification();
  
        Alert.alert('Success', 'Water request completed.');
        onAccept();
      } else {
        throw new Error('Failed to fetch IP addresses.');
      }
    } catch (error) {
      console.error('Error processing water request:', error);
      Alert.alert('Error', 'Failed to process water request.');
    } finally {
      handleLoading(false);
      onClose();
    }
  };
  
  
  // Function to delete the completed queue entry
  const deleteQueueEntry = async (userId: string): Promise<void> => {
    try {
      const queueDocRef = doc(db, 'waterQueue', userId);
      await deleteDoc(queueDocRef);
      console.log('Queue entry deleted for user:', userId);
    } catch (error) {
      console.error('Error deleting queue entry:', error);
    }
  };
  
  // Function to update the queue numbers after deletion
  const updateRemainingQueue = async (): Promise<void> => {
    try {
      const queueRef = collection(db, 'waterQueue');
      const q = query(queueRef, orderBy('queueNumber', 'asc'));
      const snapshot = await getDocs(q);
  
      const batchUpdates = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        if (data.queueNumber > 1) {
          const newQueueNumber = data.queueNumber - 1;
          console.log(`Updating queue number for ${data.userId} to ${newQueueNumber}`);
          return updateDoc(doc(queueRef, docSnap.id), { queueNumber: newQueueNumber });
        }
        return Promise.resolve();
      });
  
      await Promise.all(batchUpdates);
      console.log('Queue numbers updated successfully');
    } catch (error) {
      console.error('Error updating queue:', error);
    }
  };
  
  // Polling function to wait for the user's turn
  const waitForQueueTurn = async (interval = 5000): Promise<void> => {
    return new Promise((resolve) => {
      const intervalId = setInterval(async () => {
        const queueNumber = await getUserQueueNumber(receiverUserId);
        if (queueNumber === 1) {
          clearInterval(intervalId);
          resolve();
        } else {
          console.log(`Still in queue, current position: ${queueNumber}`);
        }
      }, interval);
    });
  };
  
  // Function to get the queue number of a user
  const getUserQueueNumber = async (userId: string): Promise<number | null> => {
    try {
      const userDocRef = doc(db, 'waterQueue', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data()?.queueNumber ?? null;
      }
      console.log(`No queue entry found for user ${userId}`);
      return null;
    } catch (error) {
      console.error('Error fetching user queue number:', error);
      return null;
    }
  };
  
  

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Water Request</Text>
          <Text style={styles.modalBody}>{notificationDetails}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={handleDecline}
              disabled={processLoading}
            >
              <Text style={styles.declineButtonText}>
                {processLoading ? 'Processing...' : 'Decline'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAccept}
              disabled={processLoading}
            >
              <Text style={styles.acceptButtonText}>
                {processLoading ? 'Processing...' : 'Accept'}
              </Text>
            </TouchableOpacity>
          </View>

          {processLoading && <BasicLoading visible={processLoading} />}
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
