import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, query, orderBy, deleteDoc, doc, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Adjust the import as needed
import { auth } from '../firebase/firebaseConfig'; // Assuming you have Firebase authentication

// Define the structure of a notification document
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid; // Get the current user's ID
    if (userId) {
      const unsubscribe = fetchUserNotifications(userId, setNotifications);

      return () => unsubscribe(); // Cleanup the listener
    }
  }, []);

  // Fetch user notifications from the Firestore collection
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
    });

    return unsubscribe;
  };

  // Function to delete a specific notification
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

  // Render notification cards
  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp.seconds * 1000).toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => handleClearNotification(auth.currentUser?.uid || '', item.id)}
      >
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        ListEmptyComponent={<Text>No notifications found.</Text>}
      />
    </View>
  );
}

// Styles for the Notifications Screen
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
  message: {
    fontSize: 14,
    marginVertical: 5,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
  clearButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
