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
    savedLocations = JSON.parse(localStorage.getItem('weather-dashboard-locations')) || [];
}
readFromLocalStorage();

function renderSavedLocations() {

    // Clear the Dropdown Menu
    dropdownMenuEl.empty();

    // Iterates over all the savedLocations to add to the dropdown menu
    for(var i = 0; i < savedLocations.length; i++){
        var listEl = $('<li>');
        var anchorEl = $('<a>');
        anchorEl.addClass('dropdown-item');
        anchorEl.attr('href', '#');
        anchorEl.attr('data-query-str', savedLocations[i].queryStr);
        anchorEl.text(savedLocations[i].displayStr);
        listEl.append(anchorEl);
        dropdownMenuEl.append(listEl);
    }
}
renderSavedLocations();

function saveToLocalStorage(selectedLocation) {
    
    // Refresh the savedLocations to compare against
    readFromLocalStorage();
    
    // new search string
    var newItem = {
        displayStr: selectedLocation.displayStr,
        queryStr: selectedLocation.queryStr,
    }
    console.log(`call within saveToLocalStorage():`)
    console.log(newItem);

    // Compare to existing and only add new unique searches
    var isNewSearch = (savedLocations.filter(savedLocations => savedLocations.displayStr == newItem.displayStr).length === 0);
    if(isNewSearch){
        savedLocations.push(newItem);
        var sortedLocations = savedLocations.sort((p1, p2) => (p1.displayStr > p2.displayStr) ? 1 : (p1.displayStr < p2.displayStr) ? -1 : 0);
        savedLocations = sortedLocations;
        localStorage.setItem('weather-dashboard-locations', JSON.stringify(savedLocations)); 
        renderSavedLocations();
    } else {
        console.log("Not a new unique search...");
    }

}




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

function getWeatherForecast(selectedLocation) {

    var locationCoords = selectedLocation.queryStr;
    console.log(`getWetherForecast():`)
    console.log(selectedLocation);
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
        console.log(`call to saveToLocalStorage():`)
        console.log(selectedLocation);
        saveToLocalStorage(selectedLocation);
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

    // var selectedDisplayStr = $("#city-input option:selected").text();
    // var selectedQueryStr= $("#city-input option:selected").val();
    var selectedLocation = {
        displayStr: $("#city-input option:selected").text(),
        queryStr: $("#city-input option:selected").val(),
    }
    
    // console.log(selectedDisplayStr);
    // console.log(selectedQueryStr);
    console.log(selectedLocation);

    getWeatherForecast(selectedLocation);

});


dropdownMenuEl.on('click', '.dropdown-item', function(event){
    
    event.preventDefault();
    event.stopPropagation();

    // Location Search from dropdown
    
    var selectedLocation = {
        displayStr: $(this).text(),
        queryStr: $(this).attr('data-query-str'),
    }
    
    getWeatherForecast(selectedLocation);
    
});

