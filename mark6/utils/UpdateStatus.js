import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export const updateRequestStatus = async (requestId, newStatus) => {
  try {
    const requestDocRef = doc(db, "waterRequests", requestId);
    await updateDoc(requestDocRef, {
      status: newStatus,
    });
    console.log(`Request ${requestId} status updated to ${newStatus}`);
  } catch (error) {
    console.error("Error updating request status:", error);
    throw error;
  }
};
