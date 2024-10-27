import { fetchLatestDistanceReading } from './DistancePVC'; 

// Hardcoded predictions function
export const fetchPredictions = async () => {
  try {
    const today = new Date(); // Get current date
    const labels = [];
    const values = [28.88, 29.08, 10.28, 4.96, 4.96, 15.01, 38.19, 38.41, 4.96, 4.96]; // Hardcoded values

    // Generate labels starting from the next day
    for (let i = 1; i <= values.length; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i); // Increment by i days

      const options = { day: 'numeric', month: 'short' }; 
      const label = nextDate.toLocaleDateString('en-US', options); // Format date as "MMM DD"
      labels.push(label);
    }

    return { labels, values, days: labels.length };
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return { labels: [], values: [], days: 0 };
  }
};

export const calculateFutureTankVolumes = async () => {
  try {
    const today = new Date(); // Declare today inside this function

    // Fetch the current tank volume using the distance reading
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
      const meanConsumption = consumptionPredictions.reduce((acc, val) => acc + val, 0) / totalDays;

      // Get the last date from the predictions
      let lastDate = new Date(today);
      lastDate.setDate(today.getDate() + totalDays); // Start from the day after the last predicted date

      while (remainingVolume > 0) {
        remainingVolume -= meanConsumption;
        if (remainingVolume < 0) remainingVolume = 0; // Ensure the volume doesn't go negative

        // Increment the day
        lastDate.setDate(lastDate.getDate() + 1);

        // Format the new date as "MMM DD"
        const newDateLabel = lastDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

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
