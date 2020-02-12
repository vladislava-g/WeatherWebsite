class CurrentWeather {
    changeProperties(city, date, temperature, description, icon, feelslike, sunrise, sunset, country) {
        this.city = city;
        this.temperature = temperature;
        this.description = description;
        this.icon = icon;
        this.date = date;
        this.feelslike = feelslike;
        this.sunrise = sunrise;
        this.sunset = sunset;
        this.country = country;
    }
}

class ForecastWeather {
    changeProperties(date, time, icon, description, temperature, feelslike, wind) {
        this.date = date;
        this.time = time;
        this.icon = icon;
        this.description = description;
        this.temperature = temperature;
        this.feelslike = feelslike;
        this.wind = wind;
    }
}

class NetworkManager {
    static getCurrentWeather(cityname) {
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=metric&appid=921e83b9da8a40a760ad74d5cedd6bbd`;
        return $.getJSON(url, function (data) {
            current_weather.changeProperties(data.name, getDate(),
                parseInt(data.main.temp, 10), data.weather[0].main,
                data.weather[0].icon, parseInt(data.main.feels_like, 10), getTime(data.sys.sunrise),
                getTime(data.sys.sunset), data.sys.country);

            updateCurrentWeatherHTML();
        }).fail(function () {
            searchError();
        });
    }

    static getForecast(cityname) {
        let url = `http://api.openweathermap.org/data/2.5/forecast?q=${cityname}&units=metric&appid=921e83b9da8a40a760ad74d5cedd6bbd`;

        $.getJSON(url, function (data) {
            forecast = [];
            for (let i = 0; i < 6; i++) {
                let tmp_weather = new ForecastWeather();
                let wind_speed = parseInt(data.list[i].wind.speed * (60 * 60) / 1000, 10);
                let time = data.list[i].dt_txt.split(" ");
                tmp_weather.changeProperties(time[0], time[1].substring(0, 5), data.list[i].weather[0].icon,
                    data.list[i].weather[0].main, parseInt(data.list[i].main.temp, 10),
                    parseInt(data.list[i].main.feels_like, 10), `${wind_speed} ${degToCompass(data.list[i].wind.deg)}`);

                forecast.push(tmp_weather);
            }

            updateCurrentForecastHTML();
        });

    }
}

function getTime(unix_timestamp) {
    let date = new Date(unix_timestamp * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    return hours + ':' + minutes.substr(-2);
}

function getDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    return dd + '.' + mm + '.' + yyyy;
}

function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}

let current_weather = new CurrentWeather();
let forecast = [];
NetworkManager.getCurrentWeather("Kyiv");
NetworkManager.getForecast("Kyiv");

function updateCurrentWeatherHTML() {
    $("#date").html(current_weather.date);
    $("#current-weather-description").html(current_weather.description);
    $("#current-temperature").html(current_weather.temperature);
    $("#feels-like").html(current_weather.feelslike);
    $("#today-sunrise").html(current_weather.sunrise);
    $("#today-sunset").html(current_weather.sunset);
    $("#search-input").attr("placeholder", `${current_weather.city}, ${current_weather.country}`);
    $("#current-weather-icon").attr("src", `http://openweathermap.org/img/wn/${current_weather.icon}@2x.png`);
}

let time = document.getElementsByClassName('time');
let forecast_icons = document.getElementsByClassName('forecast-weather-icon');
let forecast_description = document.getElementsByClassName('forecast-description');
let forecast_temp = document.getElementsByClassName('forecast-temp');
let forecast_templike = document.getElementsByClassName('forecast-templike');
let forecast_wind = document.getElementsByClassName('forecast-wind');

function updateCurrentForecastHTML() {
    for (let i = 0; i < time.length; i++) {
        time[i].innerHTML = forecast[i].time;
        forecast_icons[i].src = `http://openweathermap.org/img/wn/${forecast[i].icon}@2x.png`;
        forecast_description[i].innerHTML = forecast[i].description;
        forecast_temp[i].innerHTML = forecast[i].temperature;
        forecast_templike[i].innerHTML = forecast[i].feelslike;
        forecast_wind[i].innerHTML = forecast[i].wind;
    }
}

$("#search-btn").click(function () {
    searchCity();
})

$("#search-input").keydown(function (e) {
    if (e.which == 13) {
        searchCity();
        $('#search-input').blur();
    }
})

function searchCity() {
    NetworkManager.getCurrentWeather($("#search-input").val());
    NetworkManager.getForecast($("#search-input").val());
    $("#search-input").val("");
}

function searchError() {
    alert("fail");
}