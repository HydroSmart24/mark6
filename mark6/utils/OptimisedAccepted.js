import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

// Define urgency levels for comparison
const urgencyLevels = {
  High: 1,
  Medium: 2,
  Low: 3,
};

// Comparison function for sorting requests
const compareRequests = (a, b) => {
  const dateA = new Date(a.date.toDate());
  const dateB = new Date(b.date.toDate());

  if (dateA < dateB) return -1; // Earlier date gets higher priority
  if (dateA > dateB) return 1; // Later date gets lower priority

  // If dates are the same, compare the time
  const timeA = dateA.getTime();
  const timeB = dateB.getTime();

  if (timeA < timeB) return -1; // Earlier time gets higher priority
  if (timeA > timeB) return 1; // Later time gets lower priority

  // If date and time are the same, compare urgency
  if (urgencyLevels[a.urgency] < urgencyLevels[b.urgency]) return -1;
  if (urgencyLevels[a.urgency] > urgencyLevels[b.urgency]) return 1;

  return 0; // Dates, times, and urgency are equal
};

// Timsort algorithm implementation
const timsort = (arr) => {
  arr.sort(compareRequests);
  return arr;
};

// Function to get and optimize accepted requests
export const getOptimisedAcceptedRequests = async () => {
  try {
    const requestsCollection = collection(db, "waterRequests");

    // Create a query for accepted requests
    const q = query(requestsCollection, where("status", "==", "Accepted"));

    const querySnapshot = await getDocs(q);
    const requests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort the requests using Timsort
    const sortedRequests = timsort(requests);

    return sortedRequests;
  } catch (error) {
    console.error("Error getting accepted requests:", error);
    throw error;
  }
};
