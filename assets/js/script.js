/*
    Order of Operations
    1. Create a blank HTML and Play around with OpenWeatherAPI
        https://openweathermap.org/forecast5
        https://openweathermap.org/api/geocoding-api
    2. Bootstrap a html template
        include mostly the same with these additions if possible
        a. Map with radar
        b. 3-hour rows for each day
    3. Write jQuery code to dynamically update content
*/

// OpenWeather API
var apiKey = "8126bb2957be37f081cd3c30e29ee1f6";
var baseUrl = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";
var lat = 44.932754; 
var lon = -93.2225293;
var baseUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
console.log(baseUrl);

var apiData = [];
fetch(baseUrl)
.then(function (response) {
    return response.json();
})
.then(function (data) {
    console.log(data);
    apiData = data;
});

// Geocoding
var city = "minneapolis";
var limit = 100;
var geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${apiKey}`;
console.log(geoUrl);

var geoData = [];
fetch(geoUrl)
.then(function (response) {
    return response.json();
})
.then(function (data) {
    console.log(data);
    geoData = data;
});

