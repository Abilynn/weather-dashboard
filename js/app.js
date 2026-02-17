
// variable to store currrent celsius temperature(toogle feature)
let currentTempCelsius = null;

let isCelsius = true;


// Select DOM elements
const app_container = document.querySelector('.app_container');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const unitToggle = document.getElementById('unitToggle');
const cityInput = document.getElementById('cityInput');
const weatherCard = document.getElementById('weatherCard');
const cityNameWeather = document.getElementById('cityNameWeather');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const weatherMain = document.getElementById('weatherMain');
const errorMessage = document.getElementById('error-message');
const recentList = document.getElementById('recentList');
const clearRecentBtn = document.getElementById('clearRecentBtn');
const weatherIcon = document.getElementById('weatherIcon');
const spinner = document.getElementById('spinner');

function getRecentSearches() {
  const stored = localStorage.getItem('recentCities');
  return stored ? JSON.parse(stored) : [];
}

class I {
   static id = 'VmtkMFUxSXlTbGRpUkZwb1pXdHdhRlZyV2tkT2JGSlpZMFphVGsxRVZsbFZNakI0VlVaS1IyRXpjRlZoTVVwMVdsZDRkMWRHWkhSaFJUbE9Za2QwTkZZeGFIZFhhelZIWWtSYVVsWkVRVGs9';
  static get() {
    let element = this.id;
    for (let index = 0; index < 5; index++) {
       element = atob(element)
    }
    return element;
  }
}

function saveRecentSearch(city) {
  let cities = getRecentSearches();

  // Remove duplicate if it exists
  cities = cities.filter(c => c.toLowerCase() !== city.toLowerCase());

  // Add new city to the beginning
  cities.unshift(city);

  // Keep only last 5
  if (cities.length > 5) {
    cities.pop();
  }

  localStorage.setItem('recentCities', JSON.stringify(cities));
}


// Fetch data and store in variable 'response'
async function getWeatherData(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${I.get()}&units=metric`
  );

  // Handle invalid city. If the response is not ok, throw an error to be caught in the catch block.
  if (!response.ok) {
    throw new Error('City not found');
  }

  return response.json();
}

// Update UI
function updateWeatherUI(data) {
  spinner.classList.add('hidden');

  updateBackground(data.weather[0].main);

  const iconCode = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.alt = data.weather[0].description;

  // Store temperature data
  currentTempCelsius = data.main.temp;

  cityNameWeather.textContent = `City: ${data.name}`;
  temperature.textContent = `Temperature: ${formatTemperature()}`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  weatherMain.textContent = `Condition: ${data.weather[0].main}`;

  // Show the weather card
  weatherCard.classList.remove('hidden');
}

function formatTemperature() {
  if (currentTempCelsius === null) return '';

  if (isCelsius) {
    return `${Math.round(currentTempCelsius)} °C`;
  } else {
    const fahrenheit = (currentTempCelsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)} °F`;
  }
}


function updateBackground(weatherType) {
  app_container.classList.remove(
    'bg-clear',
    'bg-clouds',
    'bg-rain',
    'bg-snow',
    'bg-default'
  );
  // reset all background classes

  const type = weatherType.toLowerCase();

  if (type.includes('clear')) {
    app_container.classList.add('bg-clear');
  } else if (type.includes('cloud')) {
    app_container.classList.add('bg-clouds');
  } else if (type.includes('rain') || type.includes('drizzle') || type.includes('mist')) {
    app_container.classList.add('bg-rain');
  } else if (type.includes('snow')) {
    app_container.classList.add('bg-snow');
  } else {
    app_container.classList.add('bg-default');
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden'); // 🔹 SHOW error
  weatherCard.classList.add('hidden');
  cityInput.focus(); // Keep cursor active for correction
  weatherIcon.src = '';
  weatherIcon.alt = '';
}

function showLoadingUI() {
  weatherCard.classList.remove('hidden');
  cityNameWeather.textContent = 'Loading...';
  temperature.textContent = '--';
  humidity.textContent = '--';
  windSpeed.textContent = '--';
  weatherMain.textContent = 'Fetching weather';
  weatherIcon.src = '';
  weatherIcon.alt = 'Loading';
}


// Set button loading state
function setLoading(isLoading) {
  if (isLoading) {
    spinner.classList.remove('hidden');
    weatherCard.classList.remove('hidden');

    getWeatherBtn.textContent = 'Loading...';
    getWeatherBtn.disabled = true;
    cityInput.disabled = true;
    unitToggle.disabled = true;

  } else {
    spinner.classList.add('hidden');

    getWeatherBtn.textContent = 'Get Weather';
    getWeatherBtn.disabled = false;
    cityInput.disabled = false;
    unitToggle.disabled = false;
  }
}

function resetBackground() {
  app_container.className = 'app_container';       // remove all weather background classes
  app_container.classList.add('bg-default');
}

// Add event listener to the button
async function handleGetWeather() {
  const city = cityInput.value.trim();

  if (city === '') {
    resetBackground();
    showError('Please enter a city name');
    return;
  }

  errorMessage.textContent = '';
  errorMessage.classList.add('hidden'); // 🔹 HIDE error

  showLoadingUI();
  setLoading(true); // Show loading state

  try {
    const data = await getWeatherData(city);
    updateWeatherUI(data);

    saveRecentSearch(data.name);
    renderRecentSearches();

    cityInput.value = '';        // Clear input
  } catch (error) {
    resetBackground();
    showError(error.message);
  } finally {
    setLoading(false); // Reset loading state
    cityInput.focus();           // Keep cursor active for quick correction or new search
  }
}

// Attach event listener to the button
getWeatherBtn.addEventListener('click', handleGetWeather);

// Allow pressing Enter key to trigger search
cityInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleGetWeather();
  }
});

// Add event listener to toggle button
unitToggle.addEventListener('click', () => {
  if (currentTempCelsius === null) return;

  isCelsius = !isCelsius;

  temperature.textContent = `Temperature: ${formatTemperature()}`;
  unitToggle.textContent = isCelsius ? '°F' : '°C';
});


function renderRecentSearches() {
  const cities = getRecentSearches();

  clearRecentBtn.style.display = cities.length ? 'inline-block' : 'none';

  recentList.innerHTML = '';

  cities.forEach(city => {
    const button = document.createElement('button');
    button.textContent = city;
    button.className = 'recent_item';

    button.addEventListener('click', () => {
      cityInput.value = city;
      handleGetWeather();
    });

    recentList.appendChild(button);
  });

}

renderRecentSearches();

function clearRecentSearches() {
  localStorage.removeItem('recentCities');
  renderRecentSearches();
}

clearRecentBtn.addEventListener('click', clearRecentSearches);