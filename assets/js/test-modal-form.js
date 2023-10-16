// Global Variables
var apiKey = "8126bb2957be37f081cd3c30e29ee1f6";
var limit = 5;

var geoData = [];
var forecastData = [];


// Geocoding by City, (State), Country Code
var city = "chaseburg,wisconsin,us";
var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${apiKey}`;
console.log(geoUrl);

fetch(geoUrl)
.then(function (response) {
    return response.json();
})
.then(function (data) {
    console.log(data);
    geoData = data[0];

    // OpenWeather API 5-day/3-hour Weather Forecasting
    var lat = geoData.lat; 
    var lon = geoData.lon;
    var units = "imperial"
    var baseUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    console.log(baseUrl);

    fetch(baseUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        forecastData = data;
    });

});