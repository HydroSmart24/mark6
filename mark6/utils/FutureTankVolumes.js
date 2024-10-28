import { fetchLatestDistanceReading } from './DistancePVC';
import { fetchPredictions } from './FetchPredictions';
import { getSheetData } from './GoogleSheet'; // Import function to read sheet data

export const calculateFutureTankVolumes = async () => {
    try {
        // Fetch data from Google Sheet
        const sheetData = await getSheetData();
        const recordCount = sheetData.length;

        console.log(`Number of records in the Google Sheet: ${recordCount}`);

        let labels = [];
        let consumptionPredictions = [];

        // If the number of records exceeds 40, fetch predictions
        if (recordCount > 40) {
            console.log('More than 40 records. Getting predictions from the API.');
            const predictions = await fetchPredictions();
            labels = predictions.labels;
            consumptionPredictions = predictions.values;
        } else {
            console.log('Less than 40 records found. Calculating average consumption.');

            // Calculate the average consumption from the 'Consumption' column
            const validRecords = sheetData.filter(record => record.Consumption != null);
            const totalConsumption = validRecords.reduce(
                (sum, record) => sum + (record.Consumption || 0), 
                0
            );
            const averageConsumption = totalConsumption / validRecords.length;

            console.log(`Average consumption: ${averageConsumption}`);

            // Generate simple predictions using the average consumption for 10 days
            consumptionPredictions = Array(10).fill(averageConsumption);
            labels = Array.from({ length: 10 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i + 1);
                return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            });
        }

        // Fetch the current tank volume using the distance reading
        const currentVolume = await fetchLatestDistanceReading();
        if (currentVolume === null) {
            throw new Error('Failed to fetch the current tank volume.');
        }

        let remainingVolume = currentVolume;
        const futureVolumes = [];
        const totalDays = consumptionPredictions.length;

        // Decrement volume for each day in the predictions
        for (let i = 0; i < totalDays; i++) {
            remainingVolume -= consumptionPredictions[i];
            if (remainingVolume < 0) remainingVolume = 0; // Ensure volume doesn't go negative
            futureVolumes.push({
                date: labels[i],
                volume: remainingVolume,
            });
        }

        // If water remains after the predicted days, continue using mean consumption
        if (remainingVolume > 0) {
            const meanConsumption = consumptionPredictions.reduce((acc, val) => acc + val, 0) / totalDays;
            let lastDate = new Date(labels[labels.length - 1]);

            while (remainingVolume > 0) {
                remainingVolume -= meanConsumption;
                if (remainingVolume < 0) remainingVolume = 0;

                // Increment the date by one day
                lastDate.setDate(lastDate.getDate() + 1);
                const newDateLabel = lastDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

                futureVolumes.push({ date: newDateLabel, volume: remainingVolume });
            }
        }

        return futureVolumes;
    } catch (error) {
        console.error('Error calculating future tank volumes:', error);
        return null;
    }
};
