// OpenWeatherMap API Configuration
const API_KEY = 'b6fd43b53d4af8d66e6a28e5a1f2a8f3'; // Free API key for demonstration
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const weatherContainer = document.getElementById('weatherContainer');
const errorContainer = document.getElementById('errorContainer');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Handle search button click
function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
        cityInput.value = '';
    }
}

// Fetch weather data from OpenWeatherMap API
function fetchWeatherData(city) {
    // Show loading state
    weatherContainer.innerHTML = '<div class="weather-card loading"><p>Loading weather data for ' + city + '...</p></div>';
    errorContainer.innerHTML = '';

    // Make API request using Axios
    axios.get(API_BASE_URL, {
        params: {
            q: city,
            appid: API_KEY,
            units: 'metric' // Use Celsius
        }
    })
    .then(response => {
        // Handle successful response
        displayWeatherData(response.data);
    })
    .catch(error => {
        // Handle error
        handleError(error, city);
    });
}

// Display weather data on the DOM
function displayWeatherData(data) {
    const { name, main, weather, wind } = data;
    
    // Get weather icon URL
    const iconCode = weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    // Map icon code to emoji for better display
    const weatherEmoji = getWeatherEmoji(weather[0].main);
    
    // Format temperature
    const temperature = Math.round(main.temp);
    const feelsLike = Math.round(main.feels_like);
    const humidity = main.humidity;
    const pressure = main.pressure;
    const windSpeed = wind.speed;

    // Build HTML for weather card
    const weatherHTML = `
        <div class="weather-card">
            <div class="city-name">${name}</div>
            <div class="weather-icon">${weatherEmoji}</div>
            <div class="temperature">${temperature}<span class="temperature-unit">°C</span></div>
            <div class="weather-description">${weather[0].description}</div>
            <div class="weather-details">
                <div class="detail-item">
                    <div class="detail-label">Feels Like</div>
                    <div class="detail-value">${feelsLike}°C</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Humidity</div>
                    <div class="detail-value">${humidity}%</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Pressure</div>
                    <div class="detail-value">${pressure} mb</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Wind Speed</div>
                    <div class="detail-value">${windSpeed} m/s</div>
                </div>
            </div>
        </div>
    `;

    // Update DOM with weather data
    weatherContainer.innerHTML = weatherHTML;
    errorContainer.innerHTML = '';
}

// Handle API errors
function handleError(error, city) {
    let errorMessage = 'Unable to fetch weather data. Please try again.';

    if (error.response) {
        // HTTP error response
        if (error.response.status === 404) {
            errorMessage = `City "${city}" not found. Please check the spelling and try again.`;
        } else if (error.response.status === 401) {
            errorMessage = 'API key is invalid. Please contact the developer.';
        } else if (error.response.status === 429) {
            errorMessage = 'Too many requests. Please wait a moment and try again.';
        }
    } else if (error.request) {
        // Request made but no response received
        errorMessage = 'Network error. Please check your internet connection.';
    } else {
        // Error in setup
        errorMessage = 'An error occurred: ' + error.message;
    }

    // Display error message
    errorContainer.innerHTML = `<div class="error-message">${errorMessage}</div>`;
    weatherContainer.innerHTML = '';
}

// Map weather conditions to emoji
function getWeatherEmoji(condition) {
    const emojiMap = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Smoke': '💨',
        'Haze': '🌫️',
        'Dust': '🌪️',
        'Fog': '🌫️',
        'Sand': '🌪️',
        'Ash': '🌫️',
        'Squall': '💨',
        'Tornado': '🌪️'
    };

    return emojiMap[condition] || '🌤️';
}

// Load weather for a hardcoded city on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData('London');
});
