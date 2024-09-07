import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const getPushNotificationToken = async (ownerName) => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('name', '==', ownerName));

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData.pushtoken;
    } else {
      console.error('No user found with the name:', ownerName);
      return null;
    }
  } catch (error) {
    console.error('Error fetching push notification token:', error);
    throw error;
  }
};
