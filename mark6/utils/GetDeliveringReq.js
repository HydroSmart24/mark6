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

// Function to get and optimize delivering requests
export const getOptimisedDeliveringRequests = async () => {
  try {
    // Fetch delivering requests
    const requests = await getDeliveringRequests();

    // Sort the requests using Timsort
    const sortedRequests = timsort(requests);

    // Log the latitude and longitude of the sorted requests
    console.log("Sorted Delivering Requests (Lat & Lon):");
    sortedRequests.forEach((request) => {
      console.log(
        `ID: ${request.id}, Latitude: ${request.latitude}, Longitude: ${request.longitude}`
      );
    });

    return sortedRequests;
  } catch (error) {
    console.error("Error getting optimised delivering requests:", error);
    throw error;
  }
};

// Function to fetch delivering requests from Firestore
export const getDeliveringRequests = async () => {
  try {
    // Create a reference to the "waterRequests" collection
    const requestsCollection = collection(db, "waterRequests");

    // Build the query to fetch documents where the status is "Delivering"
    const deliveringQuery = query(
      requestsCollection,
      where("status", "==", "Delivering")
    );

    // Execute the query
    const querySnapshot = await getDocs(deliveringQuery);

    // Check if there are any documents
    if (querySnapshot.empty) {
      console.log("No delivering requests found.");
      return [];
    }

    // Map over the query results to create an array of request objects
    const requests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return the requests
    return requests;
  } catch (error) {
    console.error("Error fetching delivering requests:", error);
    throw error;
  }
};
