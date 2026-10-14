import { searchCity, getWeather, getCityFromCoordinates} from "./api.js";

const cityInput = document.querySelector("#cityInput");
const searchButton = document.querySelector("#searchButton");
const locationButton = document.querySelector("#locationButton");
const unitButton = document.querySelector("#unitButton");
const weatherContainer = document.querySelector("#weatherContainer");

let isCelsius = true;
let currentWeatherData = null;
let currentCityData = null;

locationButton.addEventListener("click", () => {
    locationButton.disabled = true;
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
                locationButton.disabled = false;
            }
        },
        (error) => {
            if (error.code === 1) {
                weatherContainer.textContent = "Location permission denied. Please allow location access.";
            } else {
                weatherContainer.textContent = "Unable to retrieve your location. Please try again.";
            }
            locationButton.disabled = false;
        },
    );
});

unitButton.addEventListener("click", () => {
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

    searchButton.disabled = true;
    try {
        weatherContainer.textContent = "Loading weather...";

        const cityData = await searchCity(city);    
        currentCityData = cityData;

        const weatherData = await getWeather(cityData.latitude, cityData.longitude);
        currentWeatherData = weatherData;

        displayWeather();
    }
    catch (error) {
        if(error instanceof TypeError) {
            weatherContainer.textContent = "Unable to connect. Please check your internet connection and try again.";
        }else if(error.message === "City not found.") {
            weatherContainer.textContent = "City not found. Please check the spelling.";
        } else {
            weatherContainer.textContent = "Something went wrong. Please try again.";
        }
    } finally {
        searchButton.disabled = false;
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

function getWeatherDescription(code) {
    if(code === 0) {
        return "Clear Sky"; 
    } else if(code === 1) {
        return "Mainly Clear";
    } else if(code === 2) {
        return "Partly Cloudy";
    } else if(code === 3) {
        return "Overcast";
    } else if(code === 45 || code === 48) {
        return "Fog";
    } else if(code === 61) {
        return "Slight rain";
    } else if(code === 63) {
        return "Moderate rain";
    } else if(code === 65) {
        return "Heavy rain";
    } else if(code === 95 || code === 96 || code === 99) {
        return "Thunderstorm";
    } else if(code === 51) {
        return "Light drizzle";
    } else if(code === 53) {
        return "Moderate drizzle";
    } else if(code === 55) {
        return "Dense drizzle";
    } else if(code === 56) {
        return "Light freezing drizzle";
    } else if(code === 57) {
        return "Dense freezing drizzle";
    } else if(code === 71) {
        return "Slight snow";
    } else if(code === 73) {
        return "Moderate snowfall";
    } else if(code === 75) {
        return "Heavy snowfall";
    } else if(code === 77) {
        return "Snow grains";
    } else if(code === 85) {
        return "Slight snow showers";
    } else if(code === 86) {
        return "Heavy snow showers";
    } else if(code === 80) {
        return "Slight rain showers";
    } else if(code === 81) {
        return "Moderate rain showers";
    } else if(code === 82) {
        return "Violent rain showers";
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
    } else if(code === 45 || code === 48) {
        return "🌫️";
    } else if(code === 61) {
        return "🌦️";
    } else if(code === 63 || code === 65) {
        return "🌧️";
    } else if(code === 95 || code === 96 || code === 99) {
        return "⛈️"
    } else if(code === 51 || code === 53 || code === 55 ||code === 56 || code === 57) {
        return "🌦️"
    } else if(code === 71 || code === 73 || code === 75 ||code === 77 || code === 85 || code === 86) {
        return "❄️"
    } else if(code === 80 || code === 81 || code === 82) {
        return "🌧️"
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