async function searchCity(city) {
    const response = await fetch (
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    )

    if(!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if(!data.results || data.results.length === 0) {
        throw new Error("City not found.");
    }  

    return data.results[0];
}

async function getWeather(latitude, longitude) {
    const response = await fetch (
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m`
    )

    if(!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    return data.current;
}

async function getCityFromCoordinates(latitude, longitude) {
    const response = await fetch(
         `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
    );

    if(!response.ok) {
        throw new Error("Unable to find your location.");
    }

    const data = await response.json();
    const address = data.address;

    const city =
    address.city ||
    address.town ||
    address.village ||
    address.municipality;

    if(!city || !address.country) {
        throw new Error("Unable to find your City.");
    }

    return {
        name: city,
        country: address.country
    }
}
export { searchCity, getWeather, getCityFromCoordinates};