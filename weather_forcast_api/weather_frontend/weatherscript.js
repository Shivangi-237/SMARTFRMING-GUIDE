const weatherInfo = document.getElementById('weather-info');
const langSelect = document.getElementById('lang-select');
const autoLocateBtn = document.getElementById('auto-locate-btn');
const searchBtn = document.getElementById('search-btn');

// Set default state for the weather info
function setLoadingState() {
  weatherInfo.innerHTML = `<p>Weather data will be displayed here. Please use the search or auto-detect your location.</p>`;
  weatherInfo.style.display = 'none'; // Hide initially
}

// Fetch weather using coordinates (lat, lon)
async function fetchWeatherByCoords(lat, lon, lang = 'en') {
  try {
    const res = await fetch(`http://localhost:5000/weather?lat=${lat}&lon=${lon}&lang=${lang}`);
    const data = await res.json();
    displayWeather(data);
  } catch (error) {
    weatherInfo.innerHTML = `<p>Error fetching weather data.</p>`;
  }
}

// Fetch weather by city name
async function fetchWeatherByCity(city, lang = 'en') {
  try {
    const res = await fetch(`http://localhost:5000/geocode?city=${city}`);
    const geo = await res.json();
    if (!geo.length) {
      weatherInfo.innerHTML = `<p>City not found.</p>`;
      return;
    }
    const { lat, lon } = geo[0];
    fetchWeatherByCoords(lat, lon, lang);
  } catch (error) {
    weatherInfo.innerHTML = `<p>Error fetching city coordinates.</p>`;
  }
}

// Display weather data on the page
function displayWeather(data) {
  if (data && data.main) {
    weatherInfo.innerHTML = `
      <h2>${data.name}</h2>
      <p><strong>${data.weather[0].description}</strong></p>
      <p>${data.main.temp}°C</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind: ${data.wind.speed} m/s</p>
    `;
    weatherInfo.style.display = 'block'; // Show the weather info section

    // Add class for weather animations based on condition
    const weatherCondition = data.weather[0].main.toLowerCase();
    weatherInfo.classList.remove('sunny', 'rainy', 'windy');
    if (weatherCondition.includes('clear')) {
      weatherInfo.classList.add('sunny');
    } else if (weatherCondition.includes('rain')) {
      weatherInfo.classList.add('rainy');
    } else if (weatherCondition.includes('wind')) {
      weatherInfo.classList.add('windy');
    }
  } else {
    weatherInfo.innerHTML = `<p>Unable to fetch weather data.</p>`;
  }
}

// Handle city search
function searchCityWeather() {
  const city = document.getElementById('city-input').value.trim();
  const lang = langSelect.value;
  if (city) {
    fetchWeatherByCity(city, lang);
  }
}

// Load weather data based on auto-location
function loadAutoLocationWeather() {
  const lang = langSelect.value;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("Detected coordinates: ", latitude, longitude); // Debugging: Verify geolocation
        fetchWeatherByCoords(latitude, longitude, lang);
      },
      (error) => {
        console.log("Geolocation Error: ", error); // Debugging: Check geolocation error
        weatherInfo.innerHTML = `<p>Unable to retrieve location. Please make sure location permissions are enabled.</p>`;
        weatherInfo.style.display = 'block'; // Show the error message
      }
    );
  } else {
    weatherInfo.innerHTML = `<p>Geolocation is not supported by this browser.</p>`;
    weatherInfo.style.display = 'block'; // Show the error message
  }
}

// Event listeners
searchBtn.addEventListener('click', searchCityWeather);
autoLocateBtn.addEventListener('click', loadAutoLocationWeather);

// Initialize
setLoadingState();
