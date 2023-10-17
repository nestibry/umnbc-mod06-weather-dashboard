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




function renderLocationForm(geodata) {

    // Clear the testApiSection to get ready for the new rendering
    for(var j = (projectTypeInputEl.children().length - 1); j >=0; j--) {
        projectTypeInputEl.children().eq(j).remove();
    }


    for(var i = 0; i < geodata.length; i++) {
        var locationOptionEl = $('<option>');
        locationOptionEl.val(geodata[i].name + ", " + geodata[i].state + ", " + geodata[i].country);
        locationOptionEl.text(geodata[i].name + ", " + geodata[i].state + ", " + geodata[i].country);
        projectTypeInputEl.append(locationOptionEl);
    }


}



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

        
        renderLocationForm(geoData);

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