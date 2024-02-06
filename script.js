// require('dotenv').config();

function getWeather() {
    
    // console.log(process.env.APIKEY);

    const apiKey = "8b558b9d24c0009800635bfcb8b411b9"; //change before running this program
    const city = document.getElementById('city').value;

    if(!city) { //if city is empty, show alert
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error("Error fetching current weather data: ", error);
            alert("Error fetching current weather data. Plase try again.");
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });  
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherDescDiv = document.getElementById('weather-desc');
    const weatherIcon = document.getElementById('weather-icon');
    const weatherDetails = document.querySelector('.weather-details');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind = document.querySelector('.weather-details .wind span');
    const hourlyForecastDiv = document.querySelector('.hourly-forecast');

    // clear previous content
    weatherDescDiv.innerHTML = '';
    humidity.innerHTML = '';
    wind.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if(data.cod === '404') {
        weatherDescDiv.innerHTML = `<p>${data.message}</p>`
        weatherDetails.classList.remove('active');
    } else {
        weatherDetails.classList.add('active');

        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); //convert to celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const humidPercent = data.main.humidity;
        const windSpeed = data.wind.speed;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // alert("humid: " + humidPercent + ", wind: " + windSpeed);

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHTML = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        const humidityHTML = `
            ${humidPercent}%
        `;

        const windHTML = `
            ${windSpeed} km/h
        `;

        // weatherDetails.classList.add('active');

        tempDivInfo.innerHTML = temperatureHTML;
        weatherDescDiv.innerHTML = weatherHTML;
        humidity.innerHTML = humidityHTML;
        wind.innerHTML = windHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        
        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.querySelector('.hourly-forecast');
    const next24hours = hourlyData.slice(0, 8); //slice it into 3-hour intervals for the next 24 hours

    next24hours.forEach(item => { //forEach not foreach (foreach will cause error)
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); //convert to celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; //control visibility of the icon
}