const apiKey = "c1014dc701bc1d5a45fc5bae3957f335";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const forecastContainer = document.querySelector(".forecast-container");
const forecastSection = document.querySelector(".forecast");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    
    if (!response.ok) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        forecastContainer.innerHTML = ""; // Clear previous forecast
        forecastSection.style.display = "none"; // Hide forecast section
        return;
    }

    const data = await response.json();

    document.querySelector(".error").style.display = "none";
    document.querySelector(".weather").style.display = "block";

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".Humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".Wind").innerHTML = data.wind.speed + "km/hr";

    if(data.weather[0].main=="Clouds"){
        weatherIcon.src="images/clouds.png";
    }else if(data.weather[0].main=="Rain"){
        weatherIcon.src="images/rain.png";
    }else if(data.weather[0].main=="Clear"){
        weatherIcon.src="images/clear.png";
    }else if(data.weather[0].main=="Wind"){
        weatherIcon.src="images/wind.png";
    }else if(data.weather[0].main=="Snow"){
        weatherIcon.src="images/snow.png";
    }else if(data.weather[0].main=="Mist"){
        weatherIcon.src="images/mist.png";
    }else if(data.weather[0].main=="Drizzle"){
        weatherIcon.src="images/drizzle.png";
    }

    // Fetch and display five-day forecast
    fetchForecast(city);
}

async function fetchForecast(city) {
    const response = await fetch(forecastApiUrl + city + `&appid=${apiKey}`);
    const data = await response.json();

    forecastContainer.innerHTML = ""; // Clear previous forecast

    // Display forecast for each day
    for (let i = 0; i < data.list.length; i += 8) { // Data is provided in 3-hour intervals, so every 8th entry is for a new day
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000); // Convert UNIX timestamp to JavaScript Date object
        const day = date.toLocaleDateString("en-US", { weekday: "short" }); // Get the day of the week (short format)
        const temp = Math.round(forecast.main.temp);
        const icon = forecast.weather[0].icon;

        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-item");
        forecastItem.innerHTML = `
            <div>${day}</div>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${forecast.weather[0].main}">
            <div>${temp}°C</div>
        `;
        forecastContainer.appendChild(forecastItem);
    }

    forecastSection.style.display = "block"; // Show forecast section after data is fetched
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});