var geocodingAPICall = "http://api.openweathermap.org/geo/1.0/direct?q=";
var geocodingAPICall2 = "&limit=5&appid=";
var key = "d1978293ffe262f8e3bf58182e46f05c";

var searchBtn = document.getElementById("search");
var searchInput = document.getElementById("search-input");
var results = document.getElementById("results");
var previousSearches = document.getElementById("previous-searches");
var todaysWeather = document.getElementById("todays-weather");
var forecast = document.getElementById("forecast");
var forecastTemplate = document.getElementById("forecast-day-template");

var localStorageObject = JSON.parse(localStorage.getItem("previousSearches"));
if(localStorageObject == null){
    localStorageObject = [];
}

setupPreviousSearches();
if(localStorageObject.length == 0){
    chooseCity(null);
}
else{
    chooseCity(localStorageObject[0]);
}

function setupPreviousSearches(){
    previousSearches.innerHTML = "";
    if(localStorageObject.length == 0) return;
    for(var i = 0; i < localStorageObject.length;i++){
        var resultEntry = document.createElement("li");
        resultEntry.classList.add("result-button");
        resultEntry.data = localStorageObject[i];
        var nameString = localStorageObject[i].name;
        if(localStorageObject[i].state != null){
            nameString += ", " + localStorageObject[i].state;
        }
        nameString += ", " + localStorageObject[i].country;
        resultEntry.innerText = nameString;
        previousSearches.appendChild(resultEntry);
        resultEntry.addEventListener("click", chooseCityEvent);
    }
}

function searchCity(){
    var fetchString = geocodingAPICall + searchInput.value + geocodingAPICall2 + key;
    fetch(fetchString)
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            results.innerHTML = "";
            for(var i = 0; i < data.length;i++){
                var resultEntry = document.createElement("li");
                resultEntry.classList.add("result-button");
                resultEntry.data = data[i];
                var nameString = data[i].name;
                if(data[i].state != null){
                    nameString += ", " + data[i].state;
                }
                nameString += ", " + data[i].country;
                resultEntry.innerText = nameString;
                results.appendChild(resultEntry);
                resultEntry.addEventListener("click", chooseCityEvent);
            }
        });
}

function chooseCityEvent(event){
    chooseCity(event.target.data);
}

function chooseCity(inputData){
    if(inputData == null){
        todaysWeather.style.display = "none";
        return;
    }
    else{
        todaysWeather.style.display = "block";
    }
    localStorageObject.unshift(inputData);
    saveToLocalStorage();
    setupPreviousSearches();

    var cityName = todaysWeather.querySelector("h1");
    var nameString = inputData.name;
    if(inputData.state != null){
        nameString += ", " + inputData.state;
    }
    cityName.innerText = nameString + " - " + dayjs().format("MM/DD/YYYY");

    fetch("https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=" + inputData.lat + "&lon=" + inputData.lon + "&appid=" + key)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        todaysWeather.querySelector("img").setAttribute("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
        todaysWeather.querySelector(".temp").innerText = "Temperature: " + data.main.temp + " " + String.fromCharCode(176) + "F";
        todaysWeather.querySelector(".wind").innerText = "Wind Speed: " + data.wind.speed + " MPH";
        todaysWeather.querySelector(".humid").innerText = "Humidity: " + data.main.humidity + "%";
    });

    fiveDayForecast(inputData);
}

function fiveDayForecast(inputData){

    fetch("https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=" + inputData.lat + "&lon=" + inputData.lon + "&appid=" + key)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        forecast.innerHTML = "";
        for(var i = 4; i < 44; i+=8){
            var j = i / 8 - 0.5;
            var forecastDay = forecastTemplate.cloneNode(true);
            forecastDay.id = "Day" + j;
            var date = dayjs().add(j + 1, "day").format("MM/DD");
            forecastDay.querySelector(".date").innerText = date;
            forecastDay.querySelector("img").src = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png";
            forecastDay.querySelector(".temp").innerText = "Temp: " + data.list[i].main.temp + " " + String.fromCharCode(176) + "F";
            forecastDay.querySelector(".wind").innerText = "Wind: " + data.list[i].wind.speed + " MPH";
            forecastDay.querySelector(".humid").innerText = "Humidity: " + data.list[i].main.humidity + "%";
            forecast.appendChild(forecastDay);
        }
    });
}

function saveToLocalStorage(){
    var latArray = [];
    localStorageObject.reverse();
    for(var i = localStorageObject.length - 1; i >= 0; i--){
        if(latArray.includes(localStorageObject[i].lat)){
            localStorageObject.splice(i, 1);
        }
        else{
            latArray.push(localStorageObject[i].lat);
        }
    }
    localStorageObject.reverse();
    localStorage.setItem("previousSearches", JSON.stringify(localStorageObject));
}

searchBtn.addEventListener("click", searchCity);