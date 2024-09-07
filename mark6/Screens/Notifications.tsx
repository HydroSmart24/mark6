import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, query, orderBy, deleteDoc, doc, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { auth } from '../firebase/firebaseConfig';
import Loading from '../components/Loading/BasicLoading';
import NotificationModal from '../components/Modals/TankAcceptWaterModal';

interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [selectedNotificationDetails, setSelectedNotificationDetails] = useState<string>(''); // State to store selected notification details

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const unsubscribe = fetchUserNotifications(userId, setNotifications);
      return () => unsubscribe();
    }
  }, []);

  const fetchUserNotifications = (
    userId: string,
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
  ) => {
    const userNotificationsRef = collection(db, `users/${userId}/notifications`);
    const q = query(userNotificationsRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      const notificationsArray: Notification[] = [];
      querySnapshot.forEach((doc) => {
        notificationsArray.push({ id: doc.id, ...doc.data() } as Notification);
      });
      setNotifications(notificationsArray);
      setLoading(false);
    });

    return unsubscribe;
  };

  const handleViewRequest = (notificationDetails: string) => {
    setSelectedNotificationDetails(notificationDetails); // Set selected notification details
    setModalVisible(true); // Show the modal
  };

  const handleClearNotification = async (userId: string, notificationId: string) => {
    try {
      const notificationDocRef = doc(db, `users/${userId}/notifications`, notificationId);
      await deleteDoc(notificationDocRef);
      Alert.alert('Notification cleared', 'The notification has been removed.');
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Error', 'Failed to clear the notification.');
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp.seconds * 1000).toLocaleString()}
        </Text>
      </View>

      {item.title === 'Water Request Notification' ? (
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleViewRequest(item.body)} // Pass the notification body as details
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => handleClearNotification(auth.currentUser?.uid || '', item.id)}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return <Loading visible={true} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        ListEmptyComponent={<Text>No notifications found.</Text>}
      />

      {/* Render the modal */}
      <NotificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)} // Close the modal on decline
        notificationDetails={selectedNotificationDetails}
        onAccept={() => {
          // Define what happens on Accept here
          setModalVisible(false); // Close the modal after accepting
          // Add any other logic for accepting the request
        }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  body: {
    fontSize: 14,
    marginVertical: 5,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
  viewButton: {
    backgroundColor: '#4299E1',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  viewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#3283C7',
  },
  clearButtonText: {
    color: '#646464',
    fontWeight: 'bold',
  },
});
