// Global Variables
var apiKey = "8126bb2957be37f081cd3c30e29ee1f6";
var units = "imperial";
var geoData = [];
var forecastData = [];

// Location Search
var locationInput = "";
var locationSearchEl = $('#location-search');
var locationInputEl = $('#location-input');
var projectTypeInputEl = $('#project-type-input');
var projectFormEl = $('#project-form');


// Nostalgic Camping Spot, Kearney, Nebraska, US lat: 40.6995, lon: -99.0819

function getWeatherForecast(locationCoords = "lat=40.6995&lon=-99.0819" ) {

    // OpenWeather API 5-day/3-hour Weather Forecasting
    // var locactionCoords = "lat=43.6569157&lon=-90.8542977";
    var baseUrl = `https://api.openweathermap.org/data/2.5/forecast?${locationCoords}&units=${units}&appid=${apiKey}`;
    console.log(baseUrl);

    fetch(baseUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        forecastData = data;
    });
}




function renderLocationForm(geodata) {

    // Clear the testApiSection to get ready for the new rendering
    // for(var j = (projectTypeInputEl.children().length - 1); j >=0; j--) {
    //     projectTypeInputEl.children().eq(j).remove();
    // }
    projectTypeInputEl.empty();

    // var locactionCoords = "lat=43.6569157&lon=-90.8542977";
    for(var i = 0; i < geodata.length; i++) {
        var locationOptionEl = $('<option>');
        locationOptionEl.addClass('weather-location');
        locationOptionEl.val(`lat=${geodata[i].lat}&lon=${geodata[i].lon}`);
        if(geodata[i].country === "US"){
            locationOptionEl.text(`${geodata[i].name}, ${geodata[i].state}, ${geodata[i].country}`);
            locationOptionEl.addClass(`${geodata[i].name}-${geodata[i].state}-${geodata[i].country}`);
        } else {
            locationOptionEl.text(`${geodata[i].name}, ${geodata[i].country}`);
            locationOptionEl.addClass(`${geodata[i].name}-${geodata[i].country}`);
        }
        projectTypeInputEl.append(locationOptionEl);
    }
}



var locationSelected = "";
var citySelected = "";
var elementSelected = "";
// var selectedCoords = "";
// var selectedCity = "";

projectFormEl.on('submit', function(event){
    
    event.preventDefault();
    event.stopPropagation();
    var selectedCity = $("#project-type-input option:selected").text();
    var selectedCoords = $("#project-type-input option:selected").val();
    console.log(selectedCity);
    console.log(selectedCoords);
    getWeatherForecast(selectedCoords);

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
        renderLocationForm(geoData);
    });
});