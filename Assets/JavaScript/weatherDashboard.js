var geocodingAPICall = "http://api.openweathermap.org/geo/1.0/direct?q=";
var geocodingAPICall2 = "&limit=5&appid=d1978293ffe262f8e3bf58182e46f05c";

var searchBtn = document.getElementById("search");
var searchInput = document.getElementById("search-input");

function searchCity(){
    var fetchString = geocodingAPICall + searchInput.value + geocodingAPICall2;
    fetch(fetchString){
        
    }

}

searchBtn.addEventListener("click", searchCity);