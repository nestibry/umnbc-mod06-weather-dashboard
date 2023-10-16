// Global Variables
var apiKey = "8126bb2957be37f081cd3c30e29ee1f6";
var geoData = [];
var forecastData = [];

// Location Search
var locationInput = "";
var locationSearchEl = $('#location-search');
var locationInputEl = $('#location-input');
var projectTypeInputEl = $('#project-type-input');
var projectFormEl = $('#project-form');


projectFormEl.on('submit', function(event){
    
    event.preventDefault();
    event.stopPropagation();
    console.log(projectTypeInputEl.val());
});


locationSearchEl.on('submit', function(event){
    
    event.preventDefault();
    event.stopPropagation();

    // User input location, City or Zipcode
    locationInput = locationInputEl.val();
    console.log(`Searching for: ${locationInput}`);

    // Geocoding by City, (State), Country Code  // Max return limit is 5
    var city = locationInput;
    var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
    console.log(geoUrl);
    
    fetch(geoUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        geoData = data;

        //     // // OpenWeather API 5-day/3-hour Weather Forecasting
        //     // var lat = geoData.lat; 
        //     // var lon = geoData.lon;
        //     // var units = "imperial"
        //     // var baseUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
        //     // console.log(baseUrl);

        //     // fetch(baseUrl)
        //     // .then(function (response) {
        //     //     return response.json();
        //     // })
        //     // .then(function (data) {
        //     //     console.log(data);
        //     //     forecastData = data;
        //     // });

    });


});