import { db } from '../../firebase/firebaseConfig'; // Adjust the path based on your project structure
import { collection, onSnapshot } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';

// Function to listen for leakage detection and notify the logged-in user
export function listenForLeakageAndNotify(pushToken) {
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
          // Construct the notification content
          const notificationContent = {
            title: 'Leakage Detected!',
            body: `Possible Leakage in tank. Please take action.`,
            data: { leakageId: change.doc.id },
          };

          // Send the notification to the logged-in user's push token
          await sendPushNotification(pushToken, notificationContent);
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
