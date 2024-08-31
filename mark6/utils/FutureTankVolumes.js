import { fetchLatestDistanceReading } from './DistancePVC'; 
import { fetchPredictions } from './FetchPredictions';

export const calculateFutureTankVolumes = async () => {
    try {
        // Fetch the current tank volume directly using the distance reading
        const currentVolume = await fetchLatestDistanceReading();

        if (currentVolume === null) {
            throw new Error('Failed to fetch the current tank volume.');
        }

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
