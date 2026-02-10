
// Select DOM elements (MATCHES your HTML exactly)
const getWeatherBtn = document.getElementById('getWeatherBtn');
const cityInput = document.getElementById('cityInput');
const weatherCard = document.getElementById('weatherCard');
const cityNameWeather = document.getElementById('cityNameWeather');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const errorMessage = document.getElementById('error-message');


  
    // Fetch data and store in variable 'response'
    async function getWeatherData(city) {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      // Handle invalid city. If the response is not ok, throw an error to be caught in the catch block.
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      return response.json();
    }

    // Update UI
    function updateWeatherUI(data) {
    cityNameWeather.textContent = `City: ${data.name}`;
    temperature.textContent = `Temperature: ${data.main.temp} °C`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;

    // Show the weather card
    weatherCard.classList.remove('hidden');
    }
  
    function showError(message) {
      errorMessage.textContent = message;
      errorMessage.classList.remove('hidden'); // 🔹 SHOW error
      weatherCard.classList.add('hidden');
  }

    function setLoading(isLoading) {
      if (isLoading) {
        getWeatherBtn.textContent = 'Loading...';
        getWeatherBtn.disabled = true;
      } else {
        getWeatherBtn.textContent = 'Get Weather';
        getWeatherBtn.disabled = false;
      }
    }
  

    // Add event listener to the button
    getWeatherBtn.addEventListener('click', async () => {
      const city = cityInput.value.trim();

      if (city === '') {
        showError('Please enter a city name');
        return;
    }

    errorMessage.textContent = '';
    errorMessage.classList.add('hidden'); // 🔹 HIDE error

    setLoading(true); // Show loading state

    try {
      const data = await getWeatherData(city);
      updateWeatherUI(data);
    } catch (error) {
      showError(error.message);
    } finally {
        setLoading(false); // Reset loading state
    }
  });
