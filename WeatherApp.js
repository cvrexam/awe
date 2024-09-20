import React, { useState, useEffect } from 'react';
import { getWeatherData, getHistoricalData } from './WeatherService';
import { Line } from 'react-chartjs-2';

const WeatherApp = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [historicalWeather, setHistoricalWeather] = useState([]);
  const [city, setCity] = useState('');  // Initialize city with empty string
  const [inputCity, setInputCity] = useState('New York'); // Default city input
  
  useEffect(() => {
    const fetchWeather = async () => {
      const current = await getWeatherData(inputCity);
      const historical = await getHistoricalData(inputCity);
      setCurrentWeather(current);
      setHistoricalWeather(historical);
    };
    
    fetchWeather();
  }, [inputCity]);

  // Handler for city input change
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  // Handler for form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setInputCity(city); // Update the inputCity state to trigger a new fetch
  };

  const historicalChartData = {
    labels: historicalWeather.map((data) => new Date(data.current.dt * 1000).toLocaleDateString()),
    datasets: [{
      label: 'Temperature (°C)',
      data: historicalWeather.map((data) => data.current.temp - 273.15), // Convert Kelvin to Celsius
      borderColor: 'rgba(75,192,192,1)',
      fill: false
    }]
  };

  return (
    <div>
      <h1>Weather App</h1>
      
      {/* Input form for city name */}
      <form onSubmit={handleFormSubmit}>
        <input 
          type="text" 
          value={city} 
          onChange={handleCityChange} 
          placeholder="Enter city" 
        />
        <button type="submit">Get Weather</button>
      </form>

      {currentWeather && (
        <div>
          <h2>Current Weather in {currentWeather.name}</h2>
          <p>Temperature: {(currentWeather.main.temp - 273.15).toFixed(2)} °C</p>
          <p>Weather: {currentWeather.weather[0].description}</p>
        </div>
      )}

      {historicalWeather.length > 0 && (
        <div>
          <h2>Historical Weather</h2>
          <Line data={historicalChartData} />
        </div>
      )}
    </div>
  );
};

export default WeatherApp;