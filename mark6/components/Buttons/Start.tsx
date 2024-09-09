import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getDoc, doc } from 'firebase/firestore'; // Assuming Firestore is set up and imported
import { db } from '../../firebase/firebaseConfig';
import { WaterRequest } from '../../utils/Notification/WaterRequest'; // Import the WaterRequest function

interface ButtonProps {
  title: string;
  style?: ViewStyle;
  uid?: string;
  eta?: string;
  onPress?: () => void; // Navigation onPress
}

const Button3D: React.FC<ButtonProps> = ({ title, style, onPress, uid, eta }) => {
  
  // Function to fetch push token from Firestore using the uid
  const fetchPushToken = async (uid: string): Promise<string | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid)); // Fetch user doc
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const pushToken = userData?.pushtoken;
        console.log('Fetched Push Token:', pushToken);
        return pushToken; // Return the push token for further use
      } else {
        console.warn('No such user found!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching push token:', error);
      return null;
    }
  };

  // Combined function to handle both starting navigation and fetching push token
  const handlePress = async () => {
    if (onPress) {
      onPress(); // This triggers the existing navigation function
    }

    if (uid) {
      const pushToken = await fetchPushToken(uid); // Fetch the push token based on the uid
      if (pushToken) {
        // Call the WaterRequest function to send notification and store it in Firestore
        await WaterRequest(pushToken, uid, eta);
      }
    }
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handlePress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#22C55E', // equivalent to bg-green-500
    paddingVertical: 8, // equivalent to py-2
    paddingHorizontal: 16, // equivalent to px-4
    borderRadius: 4, // equivalent to rounded
    borderBottomWidth: 4, // equivalent to border-b-4
    borderBottomColor: '#15803D', // equivalent to border-green-700
  },
  buttonText: {
    color: '#FFF', // equivalent to text-white
    fontWeight: 'bold', // equivalent to font-bold
    textAlign: 'center',
  },
});

export default Button3D;
