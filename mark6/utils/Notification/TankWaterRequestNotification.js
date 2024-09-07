import * as Notifications from 'expo-notifications';
import { db } from '../../firebase/firebaseConfig'; // Ensure the correct path to your Firebase config file
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

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

    console.log('Notification successfully added to Firestore for user:', uid);
  } catch (error) {
    console.error('Error adding notification to Firestore:', error);
  }
}

// Function to send the push notification and save it to Firestore
export async function sendPushNotification(pushToken, ownerName, requestedAmount, ownerId, currentUserName) {
  const message = {
    to: pushToken,
    sound: 'default',
    title: 'Water Request Notification',
    body: `You have received a request from ${currentUserName} for ${requestedAmount} liters of water.`,
    data: { requesterName: ownerName, requestedAmount },
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

    // Save the notification to Firestore for the notification receiver using ownerId
    await addNotificationToFirestore(ownerId, {
      title: message.title,
      body: message.body,
      data: message.data,
    });

  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}
