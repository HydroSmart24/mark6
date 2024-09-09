import { db } from '../../firebase/firebaseConfig';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';

// Function to send notification and add it to Firestore
export async function FilterHealth(pushToken, uid) {
  try {
    const messageBody = `Filter Health is low! Replace the filter immediately`;

    // Construct the notification content
    const notificationContent = {
      title: 'Low Filter Health!',
      body: messageBody,
    };

    // Send the notification to the logged-in user's push token
    await sendPushNotification(pushToken, notificationContent);

    // Store the notification in Firestore under the user's notifications collection
    await addNotificationToFirestore(uid, notificationContent);

    console.log('Notification sent and added to Firestore successfully');
  } catch (error) {
    console.error('Error in FilterHealth function:', error);
  }
}

// Function to send a push notification via Expo
async function sendPushNotification(pushToken, message) {
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: pushToken,
        sound: 'default',
        title: message.title,
        body: message.body,
        data: message.data,
      }),
    });

    const result = await response.json();
    console.log('Push notification result:', result);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

// Function to store the notification in Firestore
async function addNotificationToFirestore(uid, notificationContent) {
  try {
    const notificationRef = doc(collection(db, `users/${uid}/notifications`));

    // Store the notification document with the title, body, and timestamp
    await setDoc(notificationRef, {
      title: notificationContent.title,
      body: notificationContent.body,
      timestamp: serverTimestamp(),
    });

    console.log('Notification successfully added to Firestore');
  } catch (error) {
    console.error('Error adding notification to Firestore:', error);
  }
}
