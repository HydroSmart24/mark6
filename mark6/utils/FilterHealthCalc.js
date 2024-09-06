import { getFirestore, doc, getDoc, collection, query, orderBy, limit, getDocs, updateDoc } from "firebase/firestore";
import moment from "moment";

// Constants
const INITIAL_PERCENTAGE = 100;
const MONTHS = 1;
const DAYS = MONTHS * 30; // Approximation for 6 months
const PH_THRESHOLD = 7.5;
const TURBIDITY_THRESHOLD = 5.0;
const ALPHA = 0.1; // pH sensitivity
const BETA = 0.2;  // Turbidity sensitivity

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
  
    const totalDays = Math.min(DAYS, moment(expirationDate).diff(currentDate, 'days'));
    const baselineDecayRate = 1 / DAYS; // Decay rate based on the total period
  
    let percentage = INITIAL_PERCENTAGE;
  
    // Calculate daily impact
    let k = 0;
    if (ph > PH_THRESHOLD) {
      k += ALPHA * (ph - PH_THRESHOLD);
    }
    if (turbidity > TURBIDITY_THRESHOLD) {
      k += BETA * (turbidity - TURBIDITY_THRESHOLD);
    }
  
    // Apply daily decay over the number of days
    let decay = k * baselineDecayRate * totalDays;
    percentage -= decay;
  
    // Clamp the percentage to ensure it doesn't go below zero
    percentage = Math.max(0, percentage);
  
    console.log('Calculated Filter Health Percentage:', percentage);
  
    return percentage;
  }
  
  

// Reset the filter expiration date to 6 months from today
async function resetExpirationDate() {
  const db = getFirestore();
  const newExpirationDate = moment().add(MONTHS, 'months').toDate();

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
    console.log('New Expiration Date:', newExpirationDate);

    return newExpirationDate;
  } else {
    console.error("No expiration date document found");
    throw new Error("No expiration date document found");
  }
}

export { fetchSensorData, calculateFilterHealth, resetExpirationDate };
