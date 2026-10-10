import { searchCity, getWeather} from "./api.js";

const cityInput = document.querySelector("#cityInput");
const searchButton = document.querySelector("#searchButton");
const weatherContainer = document.querySelector("#weatherContainer");

async function searchWeather() {
    const city = cityInput.value.trim();

    if(city === "") {
        weatherContainer.textContent = "Please enter City name.";
        return;
    }
    
    try {
        weatherContainer.textContent = "Loading weather...";

        const cityData = await searchCity(city);
        const weatherData = await getWeather(cityData.latitude, cityData.longitude);
        const weatherDescription = getWeatherDescription(weatherData.weather_code);
        const weatherIcon = getWeatherIcon(weatherData.weather_code);

        weatherContainer.innerHTML = `
            <div class="weather-card">
                <h2>${cityData.name}, ${cityData.country}</h2>

                <div class="main-weather">
                    <div class="weather-icon">${weatherIcon}</div>
                    <h3>${weatherData.temperature_2m}°C</h3>
                    <p class="weather-description">${weatherDescription}</p>
                    <p>Feels like ${weatherData.apparent_temperature}°C</p>
                </div>

                <div class="weather-details">
                    <div class="weather-detail">
                        <p>Humidity</p>
                        <h3>${weatherData.relative_humidity_2m}%</h3>
                    </div>

                    <div class="weather-detail">
                        <p>Wind Speed</p>
                        <h3>${weatherData.wind_speed_10m} km/h</h3>
                    </div>
                </div>
            </div>
        `;

    }
    catch (error) {
        if(error.message === "City not found.") {
            weatherContainer.textContent = "City not found. Please check the spelling.";
        } else {
            weatherContainer.textContent = "Something went wrong. Please try again."
        }
    }
}

function getWeatherDescription(code) {
    if(code === 0) {
        return "Clear Sky"; 
    } 
    else if(code === 1) {
        return "Mainly Clear";
    }
    else if(code === 2) {
        return "Partly Cloudy";
    }
    else if(code === 3) {
        return "Overcast";
    } else {
        return "Unknown weather";
    }
}

function getWeatherIcon(code) {
    if (code === 0) {
        return "☀️";
    } else if (code === 1) {
        return "🌤️";
    } else if (code === 2) {
        return "⛅";
    } else if (code === 3) {
        return "☁️";
    } else {
        return "🌡️";
    }
}

searchButton.addEventListener("click", searchWeather);