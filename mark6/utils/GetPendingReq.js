import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getRequestsByStatus = async (status) => {
  try {
    const requestsCollection = collection(db, "waterRequests");

    // Create a query based on the status
    const q = query(requestsCollection, where("status", "==", status));

    const querySnapshot = await getDocs(q);
    const requests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return requests;
  } catch (error) {
    console.error(`Error getting ${status} requests:`, error);
    throw error;
  }
};
