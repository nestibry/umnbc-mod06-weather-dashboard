// Global Variables
var apiKey = "8126bb2957be37f081cd3c30e29ee1f6";
var locationSearchEl = $('#location-search');
var locationInputEl = $('#location-input');
var cityInputEl = $('#city-input');
var cityFormEl = $('#city-form');
var dropdownMenuEl = $(".dropdown-menu");
var closeForm = false;
var forecastData = {};
var savedLocations = [];


// Local Storage Functions and Render Saved Locations
function readFromLocalStorage() {  
    // savedLocations = JSON.parse(localStorage.getItem('WeatherDashboardLocations')) || [];
    savedLocations = JSON.parse(localStorage.getItem('weather-dashboard-locations')) || [];
}
readFromLocalStorage();

function saveToLocalStorage(locationSearched) {
    readFromLocalStorage();

    // new search string
    var newItem = {
        displayStr: locationSearched.displayStr,
        queryStr: locationSearched.queryString,
    }

    // Compare to existing and only add new unique searches
    var isNewSearch = (savedSearches.filter(savedSearches => savedSearches.queryStr == newItem.queryStr).length === 0);
    if(isNewSearch){
        savedSearches.push(newItem);
        localStorage.setItem('petspace-saved-searches', JSON.stringify(savedSearches)); 
    } else {
        console.log("Not a new search parameters...");
    }

}

function renderSavedLocations() {

    // Read the saved searches from localStorage => "savedSearches" global variable
    readFromLocalStorage();

    // Clear the Dropdown Menu
    dropdownMenuEl.empty();

    // Iterates over all the savedSearches to add to the dropdown menu
    for(var i = 0; i < savedSearches.length; i++){
        var listEl = $('<li>');
        var anchorEl = $('<a>');
        anchorEl.addClass('dropdown-item');
        anchorEl.attr('href', '#');
        anchorEl.attr('data-query-str', savedSearches[i].queryStr);
        anchorEl.text(savedSearches[i].displayStr);
        listEl.append(anchorEl);
        dropdownMenuEl.append(listEl);
    }
}
renderSavedLocations();


function renderLocationForm(geodata) {

    // Clear the testApiSection to get ready for the new rendering
    cityInputEl.empty();
    console.log(`Rendering Location Form:`)

    // render locations to choose from
    for(var i = 0; i < geodata.length; i++) {
        var locationOptionEl = $('<option>');
        locationOptionEl.val(geodata[i].queryStr);
        locationOptionEl.text(geodata[i].displayTxt);
        cityInputEl.append(locationOptionEl);
        console.log(`${geodata[i].displayTxt} => ${geodata[i].queryStr}`);
    }
}



function fetchGeocode(geolocation) {

    fetch(geolocation.url)
    .then(function (response) {
        return response.json();
    })
    .then(function (geodata) {
        console.log(geodata);

        var geoData = [];
        
        // Prepare data for Rendering Location Form
        // queryString, lat, lon, displayText (city, state or city, zip)
        if(geolocation.type === 'city'){
            for(var i = 0; i < geodata.length; i++){
                var newLoc = {
                    queryStr: `lat=${geodata[i].lat}&lon=${geodata[i].lon}`,
                    lat: geodata[i].lat,
                    lon: geodata[i].lon,
                    displayTxt: `${geodata[i].name}, ${geodata[i].state}`,
                };
                geoData.push(newLoc);
            }
        } 
        else if(geolocation.type === 'zip') {
                var newLoc = {
                    queryStr: `lat=${geodata.lat}&lon=${geodata.lon}`,
                    lat: geodata.lat,
                    lon: geodata.lon,
                    displayTxt: `${geodata.name}, ${geodata.zip}`,
                };
                geoData.push(newLoc);
        }
        console.log(geoData);
        renderLocationForm(geoData);

    })
    .catch(error => {
        console.error(error);
        alert(error);
    });
}

function getWeatherForecast(locationCoords) {

    // OpenWeather API 5-day/3-hour Weather Forecasting
    var baseUrl = `https://api.openweathermap.org/data/2.5/forecast?${locationCoords}&units=imperial&appid=${apiKey}`;
    console.log(baseUrl);

    fetch(baseUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        forecastData = data;
    })
    .catch(error => {
        console.error(error);
        alert(error);
    });
}



locationSearchEl.on('submit', function(event){
    
    event.preventDefault();
    event.stopPropagation();

    // User input location, City or Zipcode
    var locationInput = locationInputEl.val();
    console.log(`Searching for: ${locationInput}`);
    
    // Reset input
    locationInputEl.val('');

    // Future To-dos
    //  : Need a modal to do City input, State input, Country input, ZIP Code input
    //  : Add capability to check valid input AND can't be empty
    //  : Add capability to choose from a list of city inputs otherwise throw an error (e.g., Minneapolis,Minnesota,US; Minneapolis,Kansas,US; Minneapolis,etc,US;)


    // Check if the input is a City or Zipcode
    if( isNaN( parseInt(locationInput) ) ){
        
        // Geocoding by City, (State), Country Code
        var city = locationInput; 
        var geolocation = {
            type: 'city',
            url: `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`, 
        };
        console.log(`fetchUrl by city: ${geolocation.url}`);
        fetchGeocode(geolocation);

    } else if ( ( !isNaN(parseInt(locationInput)) ) && ( locationInput.length == 5 )) {
       
        // Geocoding by Zip Code
        var zipCode = locationInput;
        var countryCode = "US";
        var geolocation = {
            type: 'zip',
            url: `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${apiKey}`, 
        };
        console.log(`fetchUrl by zipcode: ${geolocation.url}`);
        fetchGeocode(geolocation);

    } else {
        
        
        // Manually need to minimize the modal 
        closeForm = true;
        console.log(`Location Error: ${locationInput} is not a city or zipcode.Please try your search again.`);
        alert(`Location Error: "${locationInput}" is not a city or zipcode. \nPlease try your search again.`);
        
    }

});

$( "#choose-city-modal" ).on('shown.bs.modal', function(event){
    event.preventDefault();
    event.stopPropagation();
    
    // If manually need to minimize the modal
    if(closeForm){
        $('#choose-city-modal').modal('toggle');
        closeForm = false;
    }
});



cityFormEl.on('submit', function(event){
    
    event.preventDefault();
    event.stopPropagation();
    var selectedCity = $("#city-input option:selected").text();
    var selectedCoords = $("#city-input option:selected").val();
    console.log(selectedCity);
    console.log(selectedCoords);
    getWeatherForecast(selectedCoords);

});

