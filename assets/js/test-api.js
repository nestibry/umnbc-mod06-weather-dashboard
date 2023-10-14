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
        a. Need a form to confirm city,state,country (and a blank form error message)
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

// Geocoding by City, (State), Country Code
var city = "viroqua,Wisconsin,us";
var limit = 100;
var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${apiKey}`;
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


// Geocoding by Zip Code
var zipCode = 54621;
var countryCode = "US";
var zipUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${apiKey}`;
console.log(zipUrl);

var zipData = [];
fetch(zipUrl)
.then(function (response) {
    return response.json();
})
.then(function (data) {
    console.log(data);
    zipData = data;
});
