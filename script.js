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
        
        updateHTML();
    }
}

class NetworkManager {
    static getCurrentWeather(id) {
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${id}&units=metric&appid=921e83b9da8a40a760ad74d5cedd6bbd`;
        $.getJSON(url, function (data) {
            current_weather.changeProperties(data.name, getDate(),
                parseInt(data.main.temp, 10), data.weather[0].main,
                data.weather[0].icon, parseInt(data.main.feels_like, 10), getTime(data.sys.sunrise),
                getTime(data.sys.sunset), data.sys.country);
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

let current_weather = new CurrentWeather();
NetworkManager.getCurrentWeather("Kyiv");

function updateHTML(){
    $("#date").html(current_weather.date);
    $("#current-weather-description").html(current_weather.description);
    $("#current-temperature").html(current_weather.temperature);
    $("#feels-like").html(current_weather.feelslike);
    $("#today-sunrise").html(current_weather.sunrise);
    $("#today-sunset").html(current_weather.sunset);
    $("#search-input").attr("placeholder", `${current_weather.city}, ${current_weather.country}`);
    $("#current-weather-icon").attr("src", `http://openweathermap.org/img/wn/${current_weather.icon}@2x.png`);
}

