import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Make sure this path is correct

export function currentConsumption(callback) {
    const q = query(collection(db, 'dailyConsumption'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let total = 0;
        querySnapshot.forEach((doc) => {
            total += doc.data().consumed_liters;
        });
        callback(total);
    });

    return unsubscribe; // Return the unsubscribe function for cleanup
}
