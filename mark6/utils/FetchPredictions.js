export const fetchPredictions = async () => {
  try {
    // console.log('Fetching predictions...');
    const response = await fetch('http://54.211.80.185/predict'); 
    // console.log('Response received', response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    // console.log('JSON received', json);
    const labels = json.map((item) => {
      const date = new Date(item.ds);
      const options = { day: 'numeric', month: 'short' };
      return date.toLocaleDateString('en-US', options); // Adjust locale as needed
    });
    const values = json.map((item) => item.yhat);
    // console.log('Data set successfully', { labels, values });
    return { labels, values, days: labels.length };
  } catch (error) {
    // console.error('Error fetching predictions:', error);
    throw error;
  }
};
