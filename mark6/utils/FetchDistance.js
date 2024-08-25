import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";
import { calcVolume } from './CalcVolume.js';

export const fetchAverageDistance = async (printedAverage) => {
    try {
        const avgDistanceRef = collection(db, 'avgDistance');
        const q = query(avgDistanceRef, orderBy('time', 'desc'), limit(3));
        const querySnapshot = await getDocs(q);

        let totalDistance = 0;
        let count = 0;

        console.log('Latest 3 distance values:');
        querySnapshot.forEach((doc) => {
            const { time, distance } = doc.data();
            console.log('Time:', time, 'Distance:', distance);
            totalDistance += distance;
            count++;
        });

        if (count > 0) {
            const avg = totalDistance / count;
            console.log('Average distance:', Math.floor(avg));
            if (printedAverage === null || Math.abs(avg - printedAverage) > 10) {
                const newAverage = Math.floor(avg);
                console.log('Significant change in average distance. New printed average:', newAverage);
                const volume = calcVolume(newAverage);
                return { average: newAverage, volume };
            } else {
                console.log('No significant change in average distance');
                const volume = calcVolume(printedAverage);
                return { average: printedAverage, volume };
            }
        }
    } catch (error) {
        console.error('Error fetching average distances:', error);
        return null;
    }
};
