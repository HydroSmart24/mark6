import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase auth

export const getRequests = async () => {
  try {
    const auth = getAuth(); // Get current authenticated user
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Create a query to fetch requests where userId matches the logged-in user's uid
    const requestsCollection = collection(db, "waterRequests");
    const q = query(requestsCollection, where("uid", "==", user.uid));

    const requestSnapshot = await getDocs(q);
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
