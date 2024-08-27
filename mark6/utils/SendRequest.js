import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

/**
 * Sends a water request to Firestore with the given details.
 *
 * @param {Date} date - The date of the request.
 * @param {Date} time - The time of the request.
 * @param {string} quantity - The quantity of water requested.
 * @param {string} urgency - The urgency level of the request.
 * @param {number} latitude - The latitude of the request location.
 * @param {number} longitude - The longitude of the request location.
 */
export const sendRequest = async (
  date,
  time,
  quantity,
  urgency,
  latitude,
  longitude
) => {
  try {
    // Combine date and time into a single Date object
    const combinedDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );

    const requestData = {
      date: combinedDateTime, // Store combined date and time
      quantity,
      urgency,
      status: "Pending",
      createdAt: new Date(),
      latitude,
      longitude,
    };

    const requestsCollection = collection(db, "waterRequests");
    await addDoc(requestsCollection, requestData);
  } catch (error) {
    console.error("Error adding request to Firestore:", error);
    throw error;
  }
};
