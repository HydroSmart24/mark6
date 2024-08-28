import { fetchAverageDistance } from './FetchDistance';
import { fetchPredictions } from './FetchPredictions';
import { calcVolume } from './CalcVolume'; // Import the calcVolume function

export const calculateFutureTankVolumes = async () => {
    try {
        // Fetch the current average distance
        const { average: avgHeight } = await fetchAverageDistance(null);

        // Calculate the current tank volume using the avgHeight
        const currentVolume = calcVolume(avgHeight);

        // Fetch the consumption predictions
        const { labels, values: consumptionPredictions } = await fetchPredictions();

        let remainingVolume = currentVolume;
        const futureVolumes = [];

        for (let i = 0; i < consumptionPredictions.length; i++) {
            remainingVolume -= consumptionPredictions[i];
            if (remainingVolume < 0) remainingVolume = 0; // Ensure the volume doesn't go negative
            futureVolumes.push({
                date: labels[i],
                volume: remainingVolume
            });
        }

        return futureVolumes;
    } catch (error) {
        console.error('Error calculating future tank volumes:', error);
        return null;
    }
};
