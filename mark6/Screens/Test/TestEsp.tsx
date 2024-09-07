import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { db } from '../../firebase/firebaseConfig';

const TankControlScreen = () => {
  const [loading, setLoading] = useState(false);
  const [ip, setIp] = useState<string | null>(null);
  const [waterLevel, setWaterLevel] = useState<number | null>(null);

  // Function to fetch the IP from Firebase
  const fetchIpFromFirebase = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('Error', 'No user is logged in.');
        setLoading(false);
        return;
      }

      // Get the UID of the logged-in user
      const userUid = currentUser.uid;

      // Fetch the user's document from Firestore
      const userDoc = await getDoc(doc(db, 'users', userUid));

      if (!userDoc.exists()) {
        Alert.alert('Error', 'User document does not exist.');
        setLoading(false);
        return;
      }

      // Get the IP address from the user's document
      const userData = userDoc.data();
      const deviceIp = userData?.ip;

      if (!deviceIp) {
        Alert.alert('Error', 'No IP address found in user data.');
        setLoading(false);
        return;
      }

      setIp(deviceIp);
      return deviceIp;
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch IP from Firebase.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to send water request and stop after 5 seconds
  const initiateWaterFlow = async () => {
    try {
      const espIp = await fetchIpFromFirebase();

      if (!espIp) {
        return; // Exit if no IP is found
      }

      // Send "send-water" POST request
      await axios.post(`http://${espIp}/send-water`);
      Alert.alert('Success', 'Water is being sent for 5 seconds.');

      // Wait for 5 seconds
      setTimeout(async () => {
        // Send "stop-water" POST request
        await axios.post(`http://${espIp}/stop-water`);
        Alert.alert('Success', 'Water flow stopped.');
      }, 5000);
    } catch (error) {
      Alert.alert('Error', 'Failed to send water request.');
      console.error(error);
    }
  };

  // Function to get the current water level
  const getWaterLevel = async () => {
    try {
      const espIp = await fetchIpFromFirebase();

      if (!espIp) {
        return; // Exit if no IP is found
      }

      // Send GET request to fetch water level
      const response = await axios.get(`http://${espIp}/get-water-level`);
      const level = parseInt(response.data, 10);

      if (isNaN(level)) {
        Alert.alert('Error', 'Invalid water level reading.');
      } else {
        setWaterLevel(level);
        Alert.alert('Success', `Water Level: ${level} cm`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get water level.');
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Tank Control Screen</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Button title="Initiate" onPress={initiateWaterFlow} />
      )}

      {ip && <Text>ESP32 IP: {ip}</Text>}

      <Button title="Get Water Level" onPress={getWaterLevel} />
      {waterLevel !== null && <Text>Current Water Level: {waterLevel} cm</Text>}
    </View>
  );
};

export default TankControlScreen;
