// Global Variables
var apiKey = "8126bb2957be37f081cd3c30e29ee1f6";
var locationSearchEl = $('#location-search');
var locationInputEl = $('#location-input');



locationSearchEl.on('submit', function(event){
    
    event.preventDefault();
    event.stopPropagation();

    // User input location, City or Zipcode
    var locationInput = locationInputEl.val();
    console.log(`Searching for: ${locationInput}`);
    

    // Future To-dos
    //  : Need a modal to do City input, State input, Country input, ZIP Code input
    //  : Add capability to check valid input AND can't be empty
    //  : Add capability to choose from a list of city inputs otherwise throw an error (e.g., Minneapolis,Minnesota,US; Minneapolis,Kansas,US; Minneapolis,etc,US;)

    // Check if the input is a City or Zipcode
    if( isNaN( locationInput * 1 ) ){
        
        // Geocoding by City, (State), Country Code
        var city = locationInput; 
        var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;  // Only up to 5 results can be returned in API response
        console.log(`fetchUrl by city: ${geoUrl}`);

    } else {
       
        // Geocoding by Zip Code
        // Future To-do: Check that the zipcode is 5-digits otherwise throw an error
        var zipCode = locationInput;
        var countryCode = "US";
        var geoUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${apiKey}`;
        console.log(`fetchUrl by zipcode: ${geoUrl}`);

    }


    locationInputEl.val('');

});
