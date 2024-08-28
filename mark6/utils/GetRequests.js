// utils/getRequests.ts
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const getRequests = async () => {
  try {
    const requestsCollection = collection(db, "waterRequests");
    const requestSnapshot = await getDocs(requestsCollection);
    const requestsList = requestSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return requestsList;
  } catch (error) {
    console.error("Error retrieving requests:", error);
    throw error;
  }
};
