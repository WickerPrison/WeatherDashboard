var geocodingAPICall = "http://api.openweathermap.org/geo/1.0/direct?q=";
var geocodingAPICall2 = "&limit=5&appid=d1978293ffe262f8e3bf58182e46f05c";

var searchBtn = document.getElementById("search");
var searchInput = document.getElementById("search-input");
var results = document.getElementById("results");
var todaysWeather = document.getElementById("todays-weather");

function searchCity(){
    var fetchString = geocodingAPICall + searchInput.value + geocodingAPICall2;
    console.log(fetchString);
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
                resultEntry.addEventListener("click", chooseCity)
            }
        });
}

function chooseCity(event){
    var data = event.target.data;
    var cityName = todaysWeather.querySelector("h1");
    cityName.innerText = data.name + ", " + data.state;
}

searchBtn.addEventListener("click", searchCity);