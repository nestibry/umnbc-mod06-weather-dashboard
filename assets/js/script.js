// Global Variables
var apiKey = "8126bb2957be37f081cd3c30e29ee1f6";
var locationSearchEl = $('#location-search');
var locationInputEl = $('#location-input');
var cityInputEl = $('#city-input');



function renderLocationForm(geodata) {

    // Clear the testApiSection to get ready for the new rendering
    cityInputEl.empty();
    console.log(`Rendering Location Form:`)

    // render locations to choose from
    for(var i = 0; i < geodata.length; i++) {
        console.log(`${geodata[i].displayTxt} => ${geodata[i].queryStr}`);
        var locationOptionEl = $('<option>');
        locationOptionEl.val(geodata[i].queryStr);
        locationOptionEl.text(geodata[i].displayTxt);
        cityInputEl.append(locationOptionEl);
    }
}


var tempData = {};
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
        alert("Error connecting to OpenWeather API. Please try your search again.");
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
        // var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;  // Only up to 5 results can be returned in API response
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
        // var geoUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${apiKey}`;
        console.log(`fetchUrl by zipcode: ${geolocation.url}`);
        fetchGeocode(geolocation);

    } else {
        console.log(`Location: ${locationInput} is not a city or zipcode`);
    }

});
