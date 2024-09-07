import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const getAllUsers = async () => {
  try {
    const usersCollection = collection(db, "users");

    const querySnapshot = await getDocs(usersCollection);
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};