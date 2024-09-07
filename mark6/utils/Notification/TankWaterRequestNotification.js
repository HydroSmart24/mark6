import * as Notifications from 'expo-notifications';

export async function sendPushNotification(pushToken, requesterName, requestedAmount) {
  const message = {
    to: pushToken,
    sound: 'default',
    title: 'Water Request Notification',
    body: `You have received a request from ${requesterName} for ${requestedAmount} liters of water.`,
    data: { requesterName, requestedAmount },
  };

  try {
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
    } else {
      console.log('Push notification sent successfully');
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}
