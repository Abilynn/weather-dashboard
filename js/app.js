// Select DOM elements (MATCHES your HTML exactly)
const getWeatherBtn = document.getElementById('getWeatherBtn');
const cityInput = document.getElementById('cityInput');
const weatherCard = document.getElementById('weatherCard');
const cityNameWeather = document.getElementById('cityNameWeather');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const errorMessage = document.getElementById('error-message');


  
    // 2. Fetch data and store in variable 'response'
    async function getWeatherData(city) {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      // 3. Handle invalid city. If the response is not ok, throw an error to be caught in the catch block.
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      return response.json();
    }

    // 5. Update UI
    function updateWeatherUI(data) {
    cityNameWeather.textContent = `City: ${data.name}`;
    temperature.textContent = `Temperature: ${data.main.temp} °C`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;

    // 6. Show the weather card
    weatherCard.classList.remove('hidden');
    }
  
    function showError(message) {
      errorMessage.textContent = message;
      weatherCard.classList.add('hidden');
  }

  // 1. Add event listener to the button
  getWeatherBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();

    if (city === '') {
      showError('Please enter a city name');
      return;
    }

    errorMessage.textContent = '';

    try {
      const data = await getWeatherData(city);
      updateWeatherUI(data);
    } catch (error) {
      showError(error.message);
    }
  });
