
const AQI_KEY = "c1bca8df0bfb5b4328954e44ebbf02d9";
let currentCity = "";

window.onload = () => {
    loadTheme();
    loadFavorites();

    navigator.geolocation.getCurrentPosition(pos => {
        getWeather(pos.coords.latitude, pos.coords.longitude);
        getAQI(pos.coords.latitude, pos.coords.longitude);
    });
};

async function getWeather(lat, lon) {
    const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&daily=sunrise,sunset&timezone=auto`
    );
    const data = await res.json();

    currentCity = "Current Location";

    document.getElementById("location").innerText = currentCity;

    document.getElementById("temp").innerText =
        `${Math.round(data.current.temperature_2m)}°C 
        (Feels ${Math.round(data.current.apparent_temperature)}°C)`;

    document.getElementById("humidity").innerText =
        data.current.relative_humidity_2m;

    document.getElementById("condition").innerText =
        `Wind: ${data.current.wind_speed_10m} km/h`;

    document.getElementById("sunrise").innerText =
        new Date(data.daily.sunrise[0]).toLocaleTimeString();

    document.getElementById("sunset").innerText =
        new Date(data.daily.sunset[0]).toLocaleTimeString();
}

async function getAQI(lat, lon) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${AQI_KEY}`
    );
    const data = await res.json();
    const aqiText = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    document.getElementById("aqi").innerText =
        aqiText[data.list[0].main.aqi - 1];
}

async function searchCity() {
    const city = document.getElementById("cityInput").value;
    if (!city) return;
    const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    const loc = await geo.json();

    if (!loc.results) return alert("City not found");

    currentCity = loc.results[0].name;
    document.getElementById("location").innerText = currentCity;

    getWeather(loc.results[0].latitude, loc.results[0].longitude);
    getAQI(loc.results[0].latitude, loc.results[0].longitude);
}

function addFavorite() {
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favs.includes(currentCity)) {
        favs.push(currentCity);
        localStorage.setItem("favorites", JSON.stringify(favs));
        loadFavorites();
    }
}

function loadFavorites() {
    const list = document.getElementById("favList");
    list.innerHTML = "";

    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    favs.forEach(city => {
        const li = document.createElement("li");
        li.innerText = city;
        li.onclick = () => {
            document.getElementById("cityInput").value = city;
            searchCity();
        };
        list.appendChild(li);
    });
}
document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("light");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("light") ? "light" : "dark"
    );
};

function loadTheme() {
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
    }
}
const toggle = document.getElementById("themeToggle");


if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    toggle.innerText = "☀️";
}
toggle.onclick = () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    toggle.innerText = isLight ? "☀️" : "🌙";
    localStorage.setItem("theme", isLight ? "light" : "dark");
};

