import { getFirestore, doc, getDoc, collection, query, orderBy, limit, getDocs, updateDoc } from "firebase/firestore";
import moment from "moment";

// Constants
const INITIAL_PERCENTAGE = 100;
const MONTHS = 1;
const DAYS = MONTHS * 5; // More accurate 30-day month for expiration calculation
const PH_THRESHOLD = 7.5;
const TURBIDITY_THRESHOLD = 5.0;
const ALPHA = 30; // pH sensitivity
const BETA = 30;  // Turbidity sensitivity

async function fetchSensorData() {
  const db = getFirestore();
  const filterHealthCollection = collection(db, 'filterHealth');
  const expiryDateCollection = collection(db, 'expiryDate');

  // Fetch the latest document from the filterHealth collection
  const q = query(filterHealthCollection, orderBy('timestamp', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);

  let ph = null;
  let turbidity = null;
  let expirationDate = null;

  if (!querySnapshot.empty) {
    const latestDoc = querySnapshot.docs[0];
    const data = latestDoc.data();

    ph = data?.ph ?? null;
    turbidity = data?.turbidity ?? null;
  } else {
    console.error("No filter health data found");
  }

  // Fetch the expiration date from the expiryDate collection
  const expiryQuerySnapshot = await getDocs(expiryDateCollection);
  if (!expiryQuerySnapshot.empty) {
    const expiryDoc = expiryQuerySnapshot.docs[0];
    const expiryData = expiryDoc.data();
    expirationDate = expiryData?.expirationDate ? expiryData.expirationDate.toDate() : null;
  } else {
    console.error("No expiration date document found");
  }

  // Log the fetched values
  console.log('Fetched Values:');
  console.log('pH:', ph);
  console.log('Turbidity:', turbidity);
  console.log('Expiration Date:', expirationDate);

  return {
    ph,
    turbidity,
    expirationDate,
  };
}

// Calculate the filter health percentage
function calculateFilterHealth(ph, turbidity, currentDate, expirationDate) {
  if (ph === null || turbidity === null || !currentDate || !expirationDate) {
    console.error("Invalid data provided to calculateFilterHealth");
    return INITIAL_PERCENTAGE;
  }

  // Use startOf('day') to eliminate time zone issues and work only with dates
  const today = moment(currentDate).startOf('day');
  const expiryDate = moment(expirationDate).startOf('day');
  const totalDays = Math.min(DAYS, expiryDate.diff(today, 'days')); // Remaining days till expiration
  const passedDays = (DAYS - totalDays); // Days passed since reset

  // If the expiration date is today, passedDays would be 0
  const adjustedPassedDays = Math.max(0, passedDays);

  const baselineDecayRate = INITIAL_PERCENTAGE / DAYS; // Decay rate per day based on full period
  
  let percentage = INITIAL_PERCENTAGE;

  // Calculate daily impact based on pH and turbidity
  let k = 0;
  if (ph < PH_THRESHOLD) {
    k += ALPHA * (PH_THRESHOLD - ph);
  }
  if (turbidity > TURBIDITY_THRESHOLD) {
    k += BETA * (turbidity - TURBIDITY_THRESHOLD);
  }

  // Apply decay for passed days over total days
  let decay = (baselineDecayRate * adjustedPassedDays) + (k * adjustedPassedDays / DAYS);
  percentage -= decay;

  // Clamp the percentage to ensure it doesn't go below zero
  percentage = Math.max(0, percentage);

  // Log for debugging
  console.log('Calculated Filter Health Percentage:', percentage);
  console.log('Total remaining days:', totalDays);
  console.log('Passed days (excluding today):', adjustedPassedDays);
  console.log('Decay:', decay);
  console.log('k (impact factor):', k);

  return percentage;
}


// Reset the filter expiration date to a specific number of days from today
async function resetExpirationDate() {
  const db = getFirestore();
  const newExpirationDate = moment().add(DAYS, 'days').startOf('day').toDate(); // Reset date to start of the day

  // Fetch the first document from the 'expiryDate' collection
  const expiryDateCollection = collection(db, 'expiryDate');
  const expiryQuerySnapshot = await getDocs(expiryDateCollection);
  if (!expiryQuerySnapshot.empty) {
    const expiryDoc = expiryQuerySnapshot.docs[0]; // Assuming there's only one document
    const docId = expiryDoc.id;

    // Update the expiration date in the fetched document
    await updateDoc(doc(db, 'expiryDate', docId), {
      expirationDate: newExpirationDate
    });

    // Log the new expiration date
    console.log('New Expiration Date (Days):', newExpirationDate);

    return newExpirationDate;
  } else {
    console.error("No expiration date document found");
    throw new Error("No expiration date document found");
  }
}

export { fetchSensorData, calculateFilterHealth, resetExpirationDate };

