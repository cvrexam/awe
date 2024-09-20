import axios from 'axios';

const API_KEY = 'ee8ed5935ba283e47d9c64e4a3a94f38';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Function to fetch current weather data
export const getWeatherData = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    if (error.response && error.response.status === 401) {
      alert('Unauthorized: Invalid API Key');
    }
    return null;
  }
};

// Function to fetch historical weather data using One Call API
export const getHistoricalData = async (city) => {
  try {
    // First, get the coordinates for the city
    const cityData = await getWeatherData(city);
    if (!cityData) return [];

    const { coord } = cityData;

    const timestamps = [
      Math.floor(Date.now() / 1000) - 86400, // 1 day ago
      Math.floor(Date.now() / 1000) - 86400 * 2, // 2 days ago
      Math.floor(Date.now() / 1000) - 86400 * 3, // 3 days ago
    ];

    const historicalData = await Promise.all(
      timestamps.map(async (timestamp) => {
        const response = await axios.get(`${BASE_URL}/onecall/timemachine`, {
          params: {
            lat: coord.lat,
            lon: coord.lon,
            dt: timestamp,
            appid: API_KEY,
          },
        });
        return response.data;
      })
    );

    return historicalData;
  } catch (error) {
    console.error('Error fetching historical weather data:', error);
    return [];
  }
};