var geocodingAPICall = "http://api.openweathermap.org/geo/1.0/direct?q=";
var geocodingAPICall2 = "&limit=5&appid=";
var key = "d1978293ffe262f8e3bf58182e46f05c";

var searchBtn = document.getElementById("search");
var searchInput = document.getElementById("search-input");
var results = document.getElementById("results");
var previousSearches = document.getElementById("previous-searches");
var todaysWeather = document.getElementById("todays-weather");

var localStorageObject = JSON.parse(localStorage.getItem("previousSearches"));
if(localStorageObject == null){
    localStorageObject = [];
}

setupPreviousSearches();
chooseCity(localStorageObject[0]);

function setupPreviousSearches(){
    previousSearches.innerHTML = "";
    for(var i = 0; i < localStorageObject.length;i++){
        var resultEntry = document.createElement("li");
        resultEntry.classList.add("result-button");
        resultEntry.data = localStorageObject[i];
        resultEntry.innerText = localStorageObject[i].name + ", " + localStorageObject[i].state + ", " + localStorageObject[i].country;
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
                resultEntry.innerText = data[i].name + ", " + data[i].state + ", " + data[i].country;
                results.appendChild(resultEntry);
                resultEntry.addEventListener("click", chooseCityEvent);
            }
        });
}

function chooseCityEvent(event){
    chooseCity(event.target.data);
}

function chooseCity(inputData){
    localStorageObject.unshift(inputData);
    saveToLocalStorage();
    setupPreviousSearches();

    var cityName = todaysWeather.querySelector("h1");
    cityName.innerText = inputData.name + ", " + inputData.state;

    fetch("https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=" + inputData.lat + "&lon=" + inputData.lon + "&appid=" + key)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        todaysWeather.querySelector(".temp").innerText = "Temperature: " + data.main.temp + " " + String.fromCharCode(176) + "F";
        todaysWeather.querySelector(".wind").innerText = "Wind Speed: " + data.wind.speed + " MPH";
        todaysWeather.querySelector(".humid").innerText = "Humidity: " + data.main.humidity + "%";
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