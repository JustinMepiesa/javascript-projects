import { searchCity, getWeather, getCityFromCoordinates } from "./api.js";

const searchForm = document.querySelector("#searchForm");
const cityInput = document.querySelector("#cityInput");
const searchButton = document.querySelector("#searchButton");
const locationButton = document.querySelector("#locationButton");
const unitButton = document.querySelector("#unitButton");
const weatherContainer = document.querySelector("#weatherContainer");

const WEATHER_CODES = {
    0:  { text: "Clear Sky",              icon: "☀️" },
    1:  { text: "Mainly Clear",           icon: "🌤️" },
    2:  { text: "Partly Cloudy",          icon: "⛅" },
    3:  { text: "Overcast",               icon: "☁️" },
    45: { text: "Fog",                    icon: "🌫️" },
    48: { text: "Fog",                    icon: "🌫️" },
    51: { text: "Light drizzle",          icon: "🌦️" },
    53: { text: "Moderate drizzle",       icon: "🌦️" },
    55: { text: "Dense drizzle",          icon: "🌦️" },
    56: { text: "Light freezing drizzle", icon: "🌦️" },
    57: { text: "Dense freezing drizzle", icon: "🌦️" },
    61: { text: "Slight rain",            icon: "🌦️" },
    63: { text: "Moderate rain",          icon: "🌧️" },
    65: { text: "Heavy rain",             icon: "🌧️" },
    66: { text: "Light freezing rain",    icon: "🌧️" },
    67: { text: "Heavy freezing rain",    icon: "🌧️" },
    71: { text: "Slight snow",            icon: "❄️" },
    73: { text: "Moderate snowfall",      icon: "❄️" },
    75: { text: "Heavy snowfall",         icon: "❄️" },
    77: { text: "Snow grains",            icon: "❄️" },
    80: { text: "Slight rain showers",    icon: "🌧️" },
    81: { text: "Moderate rain showers",  icon: "🌧️" },
    82: { text: "Violent rain showers",   icon: "🌧️" },
    85: { text: "Slight snow showers",    icon: "❄️" },
    86: { text: "Heavy snow showers",     icon: "❄️" },
    95: { text: "Thunderstorm",           icon: "⛈️" },
    96: { text: "Thunderstorm",           icon: "⛈️" },
    99: { text: "Thunderstorm",           icon: "⛈️" },
};

let isCelsius = true;
let currentWeatherData = null;
let currentCityData = null;
let isLoading = false;

function setLoading(state) {
    isLoading = state;

    searchButton.disabled = state;
    locationButton.disabled = state;
}

function convertTemperature(celsius) {
    return (celsius * 9 / 5) + 32;
}

function getWeatherInfo(code) {
    return WEATHER_CODES[code] ?? { text: "Unknown weather", icon: "🌡️" };
}

function displayWeather() {
    const { text: weatherDescription, icon: weatherIcon } = getWeatherInfo(currentWeatherData.weather_code);

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
            <h2>${currentCityData.name}, ${currentCityData.country}</h2>

            <div class="main-weather">
                <div class="weather-icon">${weatherIcon}</div>
                <h3>${displayTemperature.toFixed(1)}${temperatureUnit}</h3>
                <p class="weather-description">${weatherDescription}</p>
                <p>Feels like ${displayApparentTemp.toFixed(1)}${temperatureUnit}</p>
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

async function searchWeather() {
    if (isLoading) {
        return;
    }

    currentCityData = null;
    currentWeatherData = null;

    const city = cityInput.value.trim();

    if (city === "") {
        weatherContainer.textContent = "Please enter City name.";
        return;
    }

    setLoading(true);
    try {
        weatherContainer.textContent = "Loading weather...";

        const cityData = await searchCity(city);
        currentCityData = cityData;

        const weatherData = await getWeather(cityData.latitude, cityData.longitude);
        currentWeatherData = weatherData;

        try {
            localStorage.setItem("lastCity", city);
        } catch (error) {
            console.log("Couldn't save city:", error);
        }

        displayWeather();
    } catch (error) {
        if (error instanceof TypeError) {
            weatherContainer.textContent = "Unable to connect. Please check your internet connection and try again.";
        } else if (error.message === "City not found.") {
            weatherContainer.textContent = "City not found. Please check the spelling.";
        } else {
            weatherContainer.textContent = "Something went wrong. Please try again.";
        }
    } finally {
        setLoading(false);
    }
}

function useMyLocation() {
    if (isLoading) {
        return;
    }

    setLoading(true);
    currentCityData = null;
    currentWeatherData = null;
    weatherContainer.textContent = "Getting your location...";

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                weatherContainer.textContent = "Loading weather...";
                const { latitude, longitude } = position.coords;

                currentCityData = await getCityFromCoordinates(latitude, longitude);
                currentWeatherData = await getWeather(latitude, longitude);

                displayWeather();
            } catch (error) {
                weatherContainer.textContent = error.message || "Unable to load your local weather";
            } finally {
                setLoading(false);
            }
        },
        (error) => {
            if (error.code === 1) {
                weatherContainer.textContent = "Location permission denied. Please allow location access.";
            } else {
                weatherContainer.textContent = "Unable to retrieve your location. Please try again.";
            }
            setLoading(false);
        },
    );
}

function toggleUnit() {
    if (isLoading) {
        return;
    }

    if (currentWeatherData === null) {
        return;
    }

    isCelsius = !isCelsius;
    displayWeather();
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchWeather();
});

locationButton.addEventListener("click", useMyLocation);
unitButton.addEventListener("click", toggleUnit);

const lastCity = localStorage.getItem("lastCity");

if (lastCity !== null) {
    cityInput.value = lastCity;
    searchWeather();
}