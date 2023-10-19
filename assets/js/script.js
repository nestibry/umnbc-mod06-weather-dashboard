// Global Variables
var apiKey = "8126bb2957be37f081cd3c30e29ee1f6";
var locationSearchEl = $('#location-search');
var locationInputEl = $('#location-input');

var locationInput = "";



function fetchGeocode(geoUrl) {

    fetch(geoUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (geodata) {
        console.log(geodata);

        // Get latitude and longitude by zipcode || city (first city in array)
        // Future To-do : add conditional for current location
        var lat = geodata.lat || geodata[0].lat; 
        var lon = geodata.lon || geodata[0].lon; 

        // // OpenWeather API 5-day/3-hour Weather Forecasting
        // var units = "imperial";
        // var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
        // console.log(forecastUrl);

        // fetch(forecastUrl)
        // .then(function (response) {
        //     return response.json();
        // })
        // .then(function (data) {
        //     console.log('Forecast Data:');
        //     console.log(data);
        //     apiData = data;

        //     // Need to set all the parameters in here because this fetch has to successfully complete before moving on.
        //     renderApiOutputs();

        //     // Save to localStorage for "Saved Locations"
        //     newLocation = {
        //         id: data.city.id,
        //         name: data.city.name,
        //         lat: data.city.coord.lat,
        //         lon: data.city.coord.lon
        //     }
        //     console.log('New Location:');
        //     console.log(newLocation);
        //     renderSavedLocations();

        });
}






locationSearchEl.on('submit', function(event){
    
    event.preventDefault();
    event.stopPropagation();

    // User input location, City or Zipcode
    locationInput = locationInputEl.val();
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
        var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;  // Only up to 5 results can be returned in API response
        console.log(`fetchUrl by city: ${geoUrl}`);
        fetchGeocode(geoUrl);

    } else if ( ( !isNaN(parseInt(locationInput)) ) && ( locationInput.length == 5 )) {
       
        // Geocoding by Zip Code
        var zipCode = locationInput;
        var countryCode = "US";
        var geoUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${apiKey}`;
        console.log(`fetchUrl by zipcode: ${geoUrl}`);
        fetchGeocode(geoUrl);

    } else {
        console.log(`Location: ${locationInput} is not a city or zipcode`);
    }

});
