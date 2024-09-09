import axios from 'axios'; // Axios for API requests
import { format, differenceInDays } from 'date-fns'; // Optional for date formatting and calculating date difference
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Firebase Firestore
import { auth } from '../firebase/firebaseConfig'; // Firebase auth configuration
import { Rainfall } from './Notification/Rainfall'; // Import RainFall function

const firestore = getFirestore(); // Initialize Firestore

// Utility function to fetch rainfall data and log it
export const RainfallAPI = async () => {
  try {
    // Get current user
    const user = auth.currentUser;
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    const uid = user.uid;

    // Get user data (pushtoken) from Firestore
    const userDocRef = doc(firestore, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error('User document does not exist in Firestore');
      return;
    }

    const userData = userDoc.data();
    const pushToken = userData?.pushtoken || '';

    // Now you have uid and pushtoken
    console.log('User ID:', uid);
    console.log('Push Token:', pushToken);

    // API URL
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=8.3122&longitude=80.4131&daily=rain_sum&forecast_days=14';

    // Fetch the API data
    const response = await axios.get(url);

    if (response.status === 200) {
      const data = response.data;

      // Extract the dates and rainfall data
      const dates = data.daily.time || [];
      const dailyRainfall = data.daily.rain_sum || [];

      // Log the fetched data for inspection
      console.log('Fetched 14-day forecast data:', { dates, dailyRainfall });

      // Get today's date
      const today = new Date();

      // Loop through the rainfall data and log it
      for (let i = 0; i < dates.length; i++) {
        const dateStr = dates[i];
        const rainfall = dailyRainfall[i];

        // Format the date (Optional step, to convert the date to 'YYYY-MM-DD')
        const formattedDate = format(new Date(dateStr), 'yyyy-MM-dd');

        // Log each date and rainfall value
        console.log(`Date: ${formattedDate}, Rainfall: ${rainfall} mm`);

        // Check if rainfall is greater than 10mm
        if (rainfall > 10) {
          // Calculate the number of days from today
          const futureDate = new Date(dateStr);
          const daysFromToday = differenceInDays(futureDate, today);

          console.log(`Rainfall exceeds 10mm on ${formattedDate}. Days from today: ${daysFromToday}`);

          // Call the RainFall function and pass uid, pushtoken, and daysFromToday
          Rainfall(pushToken, uid, daysFromToday);

          // Exit the loop after the first notification
          break;
        }
      }

      console.log('No rainfall above 10mm in the next 14 days.');
    } else {
      console.error('Error fetching data from API');
    }
  } catch (error) {
    console.error('Error fetching rainfall data:', error);
  }
};

// Call the function once when the app is loaded
export const onAppLoad = async () => {
  try {
    await RainfallAPI();
  } catch (error) {
    console.error('Error during app load:', error);
  }
};
