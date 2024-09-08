import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, query, orderBy, deleteDoc, doc, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { auth } from '../firebase/firebaseConfig';
import Loading from '../components/Loading/BasicLoading';
import NotificationModal from '../components/Modals/TankAcceptWaterModal';
import BasicLoading from '../components/Loading/BasicLoading';

interface Notification {
  id: string;
  title: string;
  body: string;
  data: {
    requestedAmount: number;
    requesterName: string;
  };
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  reqUserId: string;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true); 
  const [processLoading, setProcessLoading] = useState(false); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [requestedAmount, setRequestedAmount] = useState(0); 
  const [reqUserId, setReqUserId] = useState<string>(''); 
  const [notificationId, setNotificationId] = useState<string | null>(null); 
  const [receiverUserId, setUserId] = useState<string>(''); 
  const [selectedNotificationDetails, setSelectedNotificationDetails] = useState<string>(''); 

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const unsubscribe = fetchUserNotifications(userId, setNotifications);
      setUserId(userId);
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

  const handleClearNotification = async (userId: string, notificationId: string) => {
    setProcessLoading(true);
    try {
      const notificationDocRef = doc(db, `users/${userId}/notifications`, notificationId);
      await deleteDoc(notificationDocRef);
      setProcessLoading(false); 
    } catch (error) {
      console.error('Error deleting notification:', error);
      setProcessLoading(false); 
    }
  };

  const handleViewRequest = (notificationDetails: string, notificationId: string, requestedAmount: number, reqUserId: string) => {
    setSelectedNotificationDetails(notificationDetails); 
    setNotificationId(notificationId); 
    setRequestedAmount(requestedAmount); 
    setReqUserId(reqUserId); 
    setModalVisible(true); 
  };

  const handleDeclineRequest = async () => {
    const userId = auth.currentUser?.uid;
    setProcessLoading(true); 
    if (userId && notificationId) {
      try {
        const notificationDocRef = doc(db, `users/${userId}/notifications`, notificationId);
        await deleteDoc(notificationDocRef);
        setModalVisible(false); 
        setProcessLoading(false); 
      } catch (error) {
        console.error('Error deleting notification:', error);
        setProcessLoading(false); 
      }
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
          onPress={() => handleViewRequest(item.body, item.id, item.data.requestedAmount, item.reqUserId)} 
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
        ListEmptyComponent={
          <View style={styles.emptyNotificationContainer}>
            <Text style={styles.emptyNotificationText}>No notifications found.</Text>
          </View>
        }
      />

      {/* Render the modal */}
      <NotificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)} 
        notificationDetails={selectedNotificationDetails}
        onAccept={() => {
          setModalVisible(false); 
        }}
        onDecline={handleDeclineRequest} 
        requestedAmount={requestedAmount}
        reqUserId={reqUserId}
        receiverUserId={receiverUserId}
        notificationId={notificationId || 'Unknown'}
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
  emptyNotificationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200, 
  },
  emptyNotificationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#696969',
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
