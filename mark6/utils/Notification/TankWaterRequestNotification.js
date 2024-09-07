import * as Notifications from 'expo-notifications';
import { db } from '../../firebase/firebaseConfig'; // Ensure the correct path to your Firebase config file
import { collection, getDocs, query, where, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Function to store the notification in Firestore
async function addNotificationToFirestore(uid, notificationContent) {
  try {
    const notificationRef = doc(collection(db, `users/${uid}/notifications`));

    // Store the notification document with the title, body, and timestamp
    await setDoc(notificationRef, {
      title: notificationContent.title,
      body: notificationContent.body,
      timestamp: serverTimestamp(),
      data: notificationContent.data,
    });

    console.log('Notification successfully added to Firestore');
  } catch (error) {
    console.error('Error adding notification to Firestore:', error);
  }
}

// Function to send the push notification and save it to Firestore
export async function sendPushNotification(pushToken, requesterName, requestedAmount) {
  const message = {
    to: pushToken,
    sound: 'default',
    title: 'Water Request Notification',
    body: `You have received a request from ${requesterName} for ${requestedAmount} liters of water.`,
    data: { requesterName, requestedAmount },
  };

  try {
    // Send the push notification
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error('Failed to send push notification:', await response.text());
      return;
    } else {
      console.log('Push notification sent successfully');
    }

    // Query Firestore to find the user document by the given pushToken
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('pushtoken', '==', pushToken));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const uid = userDoc.id; // Get the user's UID
      
      // Save the notification to Firestore under the user's notifications subcollection
      await addNotificationToFirestore(uid, message);
    } else {
      console.error('No user found with the given push token:', pushToken);
    }

  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}
