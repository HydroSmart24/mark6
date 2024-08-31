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
        const totalDays = consumptionPredictions.length;

        // Decrement volume for each day in the predictions
        for (let i = 0; i < totalDays; i++) {
            remainingVolume -= consumptionPredictions[i];
            if (remainingVolume < 0) remainingVolume = 0; // Ensure the volume doesn't go negative
            futureVolumes.push({
                date: labels[i],
                volume: remainingVolume,
            });
        }

        // If water remains after the predicted days, continue using the mean consumption
        if (remainingVolume > 0) {
            // Calculate the mean consumption for the predicted days
            const meanConsumption = consumptionPredictions.reduce((acc, val) => acc + val, 0) / totalDays;

            // Get the last date from the predictions
            let lastDateLabel = labels[labels.length - 1];
            let month = lastDateLabel.slice(0, 4).trim();  // Extract the month (e.g., "Sep")
            let day = parseInt(lastDateLabel.slice(4).trim(), 10);  // Extract the day as an integer

            while (remainingVolume > 0) {
                remainingVolume -= meanConsumption;
                if (remainingVolume < 0) remainingVolume = 0; // Ensure the volume doesn't go negative

                // Increment the day
                day += 1;

                // Format the new date as "MMM DD" (e.g., "Sep 15")
                const newDateLabel = `${month} ${day}`;

                // Log for debugging
                console.log('Date Label:', newDateLabel);

                futureVolumes.push({
                    date: newDateLabel,
                    volume: remainingVolume,
                });
            }
        }

        return futureVolumes;
    } catch (error) {
        console.error('Error calculating future tank volumes:', error);
        return null;
    }
};
