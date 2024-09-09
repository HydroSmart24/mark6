const axios = require("axios");

// Replace with your actual latitude, longitude, and API key
const latitude = "8.31223"; // Example: '37.7749'
const longitude = "80.41306"; // Example: '-122.4194'
const apiKey = "08d2be62bcf417422ac458c22838867d";

// Function to fetch rainfall data
const fetchRainfall = async () => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    );

    // Extract rainfall information from the response (rainfall in the past hour)
    const rainfallData = response.data.rain ? response.data.rain["1h"] : 0;
    console.log(
      `Today's rainfall: ${rainfallData ? rainfallData : "No rain"} mm`
    );
  } catch (error) {
    console.error("Error fetching rainfall data:", error);
  }
};

fetchRainfall();
