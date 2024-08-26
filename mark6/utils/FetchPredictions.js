export const fetchPredictions = async () => {
  try {
    const response = await fetch('http://54.211.80.185:5000/predict');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    const labels = json.map((item) => {
      const date = new Date(item.ds);
      const options = { day: 'numeric', month: 'short' };
      return date.toLocaleDateString('en-US', options); // Adjust locale as needed
    });
    const values = json.map((item) => item.yhat);
    return { labels, values, days: labels.length };
  } catch (error) {
    throw error;
  }
};
