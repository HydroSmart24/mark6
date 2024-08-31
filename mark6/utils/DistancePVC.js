import { db } from '../firebase/firebaseConfig'; 
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const MIN_DISTANCE = 86; 
const MAX_DISTANCE = 29;
const MAX_VOLUME = 500;  

// Function to calculate the water volume based on the distance
export const calculateWaterVolume = (distance) => {
  if (distance >= MIN_DISTANCE) {
    return 0; 
  } else if (distance <= MAX_DISTANCE) {
    return MAX_VOLUME; 
  } else {
    // Calculate the volume using linear interpolation
    const volume = ((MIN_DISTANCE - distance) / (MIN_DISTANCE - MAX_DISTANCE)) * MAX_VOLUME;
    return volume;
  }
};

// Function to fetch the latest distance reading from Firestore
const fetchLatestDistanceReading = async () => {
  try {
    const avgDistanceRef = collection(db, 'avgDistance');
    const q = query(avgDistanceRef, orderBy('time', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

    // If the document exists, calculate and return the water volume
    if (!querySnapshot.empty) {
      const latestDoc = querySnapshot.docs[0];
      const distanceData = latestDoc.data();
      const distance = distanceData.distance;

      // Calculate the volume based on the distance
      const volume = calculateWaterVolume(distance);
      return volume; // Return the calculated volume in liters
    } else {
      console.log('No distance readings found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching latest distance reading:', error);
    return null;
  }
};

// Function to fetch the latest reading every 5 minutes
export const startFetchingDistanceReadings = (callback) => {
  fetchLatestDistanceReading().then(callback);

  const intervalId = setInterval(() => {
    fetchLatestDistanceReading().then(callback);
  }, 300000); // 5 minutes in milliseconds

  // Return a function to stop the interval when needed
  return () => clearInterval(intervalId);
};
