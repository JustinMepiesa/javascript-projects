import { searchCity, getWeather} from "./api.js";

const cityInput = document.querySelector("#cityInput");
const searchButton = document.querySelector("#searchButton");
const unitbutton = document.querySelector("#unitButton");
const weatherContainer = document.querySelector("#weatherContainer");

let isCelsius = true;
let currentWeatherData = null;
let currentCity = null;

unitbutton.addEventListener("click", () => {
    if(currentWeatherData === null) {
        return;
    }

    isCelsius = !isCelsius;
    displayWeather();
});

function convertTemperature(celsius) {
    return (celsius * 9 / 5) + 32;
}

async function searchWeather() {
    const city = cityInput.value.trim();

    if(city === "") {
        weatherContainer.textContent = "Please enter City name.";
        return;
    }
    
    localStorage.setItem("lastCity", city);

    try {
        weatherContainer.textContent = "Loading weather...";

        const cityData = await searchCity(city);    
        currentCity = cityData;

        const weatherData = await getWeather(cityData.latitude, cityData.longitude);
        currentWeatherData = weatherData;
        
        displayWeather();
    }
    catch (error) {
        if(error.message === "City not found.") {
            weatherContainer.textContent = "City not found. Please check the spelling.";
        } else {
            weatherContainer.textContent = "Something went wrong. Please try again."
        }
    }
}

function displayWeather() {
    const weatherDescription = getWeatherDescription(currentWeatherData.weather_code);
    const weatherIcon = getWeatherIcon(currentWeatherData.weather_code);

    const displayTemperature = isCelsius
    ? currentWeatherData.temperature_2m
    : convertTemperature(currentWeatherData.temperature_2m);

    const displayApparentTemp = isCelsius
    ? currentWeatherData.apparent_temperature
    : convertTemperature(currentWeatherData.apparent_temperature);

    const temperatureUnit = isCelsius ? "°C" : "°F";
    unitButton.textContent = isCelsius ? "Switch to °F" : "Switch to °C";

    weatherContainer.innerHTML = `
        <div class="weather-card">
            <h2>${currentCity.name}, ${currentCity.country}</h2>

            <div class="main-weather">
                <div class="weather-icon">${weatherIcon}</div>
                <h3>${displayTemperature}${temperatureUnit}</h3>
                <p class="weather-description">${weatherDescription}</p>
                <p>Feels like ${displayApparentTemp}${temperatureUnit}</p>
            </div>

            <div class="weather-details">
                <div class="weather-detail">
                    <p>Humidity</p>
                    <h3>${currentWeatherData.relative_humidity_2m}%</h3>
                </div>

                <div class="weather-detail">
                    <p>Wind Speed</p>
                    <h3>${currentWeatherData.wind_speed_10m} km/h</h3>
                </div>
            </div>
        </div>
    `;
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

const lastCity = localStorage.getItem("lastCity");

if(lastCity !== null) {
    cityInput.value = lastCity;
    searchWeather();
}

searchButton.addEventListener("click", searchWeather);
cityInput.addEventListener("keydown", (event) => {
    if(event.key === "Enter") {
        searchWeather();
    }
});