import { db } from '../../firebase/firebaseConfig';
import { collection, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';

// Function to listen for leakage detection and notify the logged-in user
export function listenForLeakageAndNotify(pushToken, uid, onLeakageDetected) {
  const leakageDetectRef = collection(db, 'leakageDetect');

  // Capture the app load time
  const appLoadTime = new Date();

  // Listen for new documents in the 'leakageDetect' collection
  const unsubscribe = onSnapshot(leakageDetectRef, (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === 'added') {
        const leakageData = change.doc.data();

        // Get the document's timestamp, assuming it exists
        const docTimestamp = leakageData.timestamp?.toDate();  // Assuming 'timestamp' is a Firestore Timestamp

        // Check if the document was added after the app loaded
        if (docTimestamp && docTimestamp > appLoadTime) {
          const messageBody = `Possible Leakage in tank. Please take action.`;

          // Construct the notification content
          const notificationContent = {
            title: 'Leakage Detected!',
            body: messageBody,
            data: { leakageId: change.doc.id },
          };

          // Send the notification to the logged-in user's push token
          await sendPushNotification(pushToken, notificationContent);

          // Call the onLeakageDetected callback to trigger in-app alert
          onLeakageDetected(messageBody);

          // Store the notification in Firestore under the user's notifications collection
          await addNotificationToFirestore(uid, notificationContent);
        }
      }
    });
  });

  return unsubscribe; // Return the unsubscribe function to stop listening when necessary
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
      data: notificationContent.data,
    });

    console.log('Notification successfully added to Firestore');
  } catch (error) {
    console.error('Error adding notification to Firestore:', error);
  }
}
