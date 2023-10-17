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

// Global Variables
var apiKey = "8126bb2957be37f081cd3c30e29ee1f6";
var limit = 100;
var countryCode = "US";
var geoData = [];
var zipData = [];
var apiData = [];
var forecastData = [];
var testApiSection = $(".test-api-section");
var dropdownMenuEl = $(".dropdown-menu");

// Add newLocation to the savedLocations
let newLocation = {
    id: "",
    name: "",
    lat: "",
    lon: ""
}


// Geocoding by City, (State), Country Code
var city = "chaseburg,wisconsin,us";
// var limit = 100;
var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${apiKey}`;
console.log(geoUrl);

// fetch(geoUrl)
// .then(function (response) {
//     return response.json();
// })
// .then(function (data) {
//     console.log(data);
//     geoData = data[0];

//     // OpenWeather API 5-day/3-hour Weather Forecasting
//     var lat = geoData.lat; 
//     var lon = geoData.lon;
//     var units = "imperial"
//     var baseUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
//     console.log(baseUrl);

//     fetch(baseUrl)
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         console.log(data);
//         apiData = data;

//         // Need to set all the parameters in here because this fetch has to successfully complete before moving on.
//         renderApiOutputs();
//     });

// });


// Geocoding by Zip Code
var zipCode = 55406;
// var countryCode = "US";
var zipUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${apiKey}`;
console.log(zipUrl);

fetch(zipUrl)
.then(function (response) {
    return response.json();
})
.then(function (data) {
    console.log(data);
    zipData = data;

    // OpenWeather API 5-day/3-hour Weather Forecasting
    var lat = zipData.lat; 
    var lon = zipData.lon;
    var units = "imperial"
    var baseUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    console.log(baseUrl);

    fetch(baseUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        apiData = data;

        // Need to set all the parameters in here because this fetch has to successfully complete before moving on.
        renderApiOutputs();
    });
});


// // OpenWeather API 5-day/3-hour Weather Forecasting
// var apiKey = "8126bb2957be37f081cd3c30e29ee1f6";
// var baseUrl = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";
// var lat = 44.932754; 
// var lon = -93.2225293;
// var units = "imperial"
// var baseUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
// console.log(baseUrl);

// var apiData = [];
// fetch(baseUrl)
// .then(function (response) {
//     return response.json();
// })
// .then(function (data) {
//     console.log(data);
//     apiData = data;

//     // Need to set all the parameters in here because this fetch has to successfully complete before moving on.
//     renderApiOutputs();
// });


function renderApiOutputs() {
      
    // Adding Data to HTML, need to uncomment the Test Script Sections in HTML
    var testApiSection = $(".test-api-section");

    // Clear the testApiSection to get ready for the new rendering
    for(var j = (testApiSection.children().length - 1); j > 0; j--) {
        testApiSection.children().eq(j).remove();
    }

    var cityEl = $('<h2>');
    cityEl.text(apiData.city.name);
    testApiSection.append(cityEl);

    var dateEl = $('<h4>');
    var currDateTime = dayjs().format("dddd, MMMM D, YYYY => HH:mm");
    dateEl.text(`Current Time: ${currDateTime}`);
    testApiSection.append(dateEl);

    var coorinatesEl = $('<h5>');
    coorinatesEl.text("< latitude: " + apiData.city.coord.lat + ", longitude: " + apiData.city.coord.lon + " >");
    testApiSection.append(coorinatesEl);

    var sunRiseSetEl = $('<h5>');
    var sunrise = dayjs.unix(apiData.city.sunrise).format('HH:mm:ss');
    var sunset = dayjs.unix(apiData.city.sunset).format('HH:mm:ss');
    sunRiseSetEl.text("< sunrise: " + sunrise + " sunset: " + sunset + " >");
    testApiSection.append(sunRiseSetEl);

    var blankEl = $('<p>');
    blankEl.text("");
    testApiSection.append(blankEl);

    var forecastHeaderEl = $('<h2>');
    forecastHeaderEl.text("Forecasts");
    testApiSection.append(forecastHeaderEl);

    for(var i = 0; i < apiData.list.length; i++){

        // Forecast Time
        var forecastTimeEl = $('<h4>');
        var forecastTime = dayjs.unix(apiData.list[i].dt).format("dddd, YYYY-MM-DD, HH:mm");
        forecastTimeEl.text(forecastTime);
        testApiSection.append(forecastTimeEl);

        // main condition outputs
        var mainOutputsEl = $('<p>');
        mainOutputsEl.text(`list.main => .temp: ${apiData.list[i].main.temp} \xB0F 
                    --- .feels_like: ${apiData.list[i].main.feels_like} \xB0F
                    --- .temp_min: ${apiData.list[i].main.temp_min} \xB0F
                    --- .temp_max: ${apiData.list[i].main.temp_max} \xB0F
                    --- .pressure: ${apiData.list[i].main.pressure} hPa
                    --- .humidity: ${apiData.list[i].main.humidity} %`);
        testApiSection.append(mainOutputsEl);

        // Probability of Precipitation [0:1]
        var popOutputsEl = $('<p>');
        popOutputsEl.text(`list => .pop: ${apiData.list[i].pop * 100} % (probability of precipitation)`);
        testApiSection.append(popOutputsEl);

        // Visibility [0:10000m]
        var visOutputsEl = $('<p>');
        visOutputsEl.text(`list => .visibility: ${apiData.list[i].visibility / 1000} km`);
        testApiSection.append(visOutputsEl);

        // Weather Condition (all weather is an array of length 1)
        // https://stackoverflow.com/questions/44177417/how-to-display-openweathermap-weather-icon 
        var weatherIcon = apiData.list[i].weather[0].icon;
        var iconUrl = `https://openweathermap.org./img/w/${weatherIcon}.png`;
        // console.log(iconUrl);
        var weatherOutputsEl = $('<p>');
        weatherOutputsEl.text(`list.weather => .id: ${apiData.list[i].weather[0].id}  
                    --- .main: ${apiData.list[i].weather[0].main} 
                    --- .description: ${apiData.list[i].weather[0].description} 
                    --- .icon: ${apiData.list[i].weather[0].icon}
                    --- ICON:`);
        var iconEl = $('<img>');
        iconEl.attr('src', iconUrl);
        weatherOutputsEl.append(iconEl);
        testApiSection.append(weatherOutputsEl);

        // Percent cloudiness
        var cloudsEl = $('<p>');
        cloudsEl.text(`list.clouds => .all: ${apiData.list[i].clouds.all} % cloudiness`);
        testApiSection.append(cloudsEl);


        // Wind
        var windEl = $('<p>');
        windEl.text(`list.wind => .speed: ${apiData.list[i].wind.speed} mph  
                    --- .deg: ${apiData.list[i].wind.deg} \xB0 (direction)
                    --- .gust: ${apiData.list[i].wind.gust} mph`);
        testApiSection.append(windEl);


    }


    // // Forecast Time
    // var forecastTimeEl = $('<h4>');
    // var forecastTime = dayjs.unix(apiData.list[0].dt).format("dddd, YYYY-MM-DD, HH:mm");
    // forecastTimeEl.text(forecastTime);
    // testApiSection.append(forecastTimeEl);

    // // main condition outputs
    // var mainOutputsEl = $('<p>');
    // mainOutputsEl.text(`list.main => .temp: ${apiData.list[0].main.temp} \xB0F 
    //             --- .feels_like: ${apiData.list[0].main.feels_like} \xB0F
    //             --- .temp_min: ${apiData.list[0].main.temp_min} \xB0F
    //             --- .temp_max: ${apiData.list[0].main.temp_max} \xB0F
    //             --- .pressure: ${apiData.list[0].main.pressure} hPa
    //             --- .humidity: ${apiData.list[0].main.humidity} %`);
    // testApiSection.append(mainOutputsEl);

    // // Probability of Precipitation [0:1]
    // var popOutputsEl = $('<p>');
    // popOutputsEl.text(`list => .pop: ${apiData.list[0].pop * 100} % (probability of precipitation)`);
    // testApiSection.append(popOutputsEl);

    // // Visibility [0:10000m]
    // var visOutputsEl = $('<p>');
    // visOutputsEl.text(`list => .visibility: ${apiData.list[0].visibility / 1000} km`);
    // testApiSection.append(visOutputsEl);

    // // Weather Condition (all weather is an array of length 1)
    // var weatherOutputsEl = $('<p>');
    // weatherOutputsEl.text(`list.weather => .id: ${apiData.list[0].weather[0].id}  
    //             --- .main: ${apiData.list[0].weather[0].main} 
    //             --- .description: ${apiData.list[0].weather[0].description} 
    //             --- .icon: ${apiData.list[0].weather[0].icon}`);
    // testApiSection.append(weatherOutputsEl);

    // // Percent cloudiness
    // var cloudsEl = $('<p>');
    // cloudsEl.text(`list.clouds => .all: ${apiData.list[0].clouds.all} % cloudiness`);
    // testApiSection.append(cloudsEl);


    // // Wind
    // var windEl = $('<p>');
    // windEl.text(`list.wind => .speed: ${apiData.list[0].wind.speed} mph  
    //             --- .deg: ${apiData.list[0].wind.deg} \xB0 (direction)
    //             --- .gust: ${apiData.list[0].wind.gust} mph`);
    // testApiSection.append(windEl);



}



function renderSavedLocations() {

    // Read the saved locations from localStorage
    var savedLocations = JSON.parse(localStorage.getItem('WeatherDashboardLocations')) || [];
    
    // Save newLocation to localStorage if it is a new search location
    var isNotPresent =  (savedLocations.filter(savedLocations => savedLocations.id == newLocation.id).length === 0);
    console.log(isNotPresent);
    if(isNotPresent){
        console.log("Is not in local storage");
        savedLocations.push(newLocation);
        localStorage.setItem('WeatherDashboardLocations', JSON.stringify(savedLocations))
    }
    
    // Re-render the Saved Locations dropdown menu
    // Clear the dropdownMenuEl to get ready for the new rendering
    // var dropdownMenuEl = $(".dropdown-menu");
    for(var j = (dropdownMenuEl.children().length - 1); j >= 0; j--) {
        dropdownMenuEl.children().eq(j).remove();
    }

    // Iterates over all the savedLocations to add to the dropdown menu
    for(var i = 0; i < savedLocations.length; i++){
        var listEl = $('<li>');
        var anchorEl = $('<a>');
        anchorEl.addClass('dropdown-item');
        anchorEl.attr('href', '#');
        anchorEl.attr('data-location-lat', savedLocations[i].lat);
        anchorEl.attr('data-location-lon', savedLocations[i].lon);
        anchorEl.text(savedLocations[i].name);
        listEl.append(anchorEl);
        dropdownMenuEl.append(listEl);
    }
}
renderSavedLocations();


// Location Search
var locationInput = "";
var locationSearchEl = $('#location-search');
var locationInputEl = $('#location-input');



locationSearchEl.on('submit', function(event){
    
    event.preventDefault();
    event.stopPropagation();

    // User input location, City or Zipcode
    locationInput = locationInputEl.val();
    console.log(`Searching for: ${locationInput}`);

    // Future To-dos
    //  : Add capability to check valid input AND can't be empty
    //  : Add capability to choose from a list of city inputs otherwise throw an error (e.g., Minneapolis,Minnesota,US; Minneapolis,Kansas,US; Minneapolis,etc,US;)

    // Check if the input is a City or Zipcode
    if( isNaN( locationInput * 1 ) ){
        
        // Geocoding by City, (State), Country Code
        var city = locationInput; 
        var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${apiKey}`;
        console.log(`fetchUrl by city: ${geoUrl}`);

    } else {
       
        // Geocoding by Zip Code
        // Future To-do: Check that the zipcode is 5-digits otherwise throw an error
        var zipCode = locationInput;
        var countryCode = "US";
        var geoUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${apiKey}`;
        console.log(`fetchUrl by zipcode: ${geoUrl}`);

    }

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

        // OpenWeather API 5-day/3-hour Weather Forecasting
        var units = "imperial";
        var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
        console.log(forecastUrl);

        fetch(forecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('Forecast Data:');
            console.log(data);
            apiData = data;

            // Need to set all the parameters in here because this fetch has to successfully complete before moving on.
            renderApiOutputs();

            // Save to localStorage for "Saved Locations"
            newLocation = {
                id: data.city.id,
                name: data.city.name,
                lat: data.city.coord.lat,
                lon: data.city.coord.lon
            }
            console.log('New Location:');
            console.log(newLocation);
            renderSavedLocations();

        });
    });


});



// Location Search from dropdown
var eventInput = "";
var parentEl = "";

dropdownMenuEl.on('click', '.dropdown-item', function(event){
    
    event.preventDefault();
    event.stopPropagation();

    // User input location, City or Zipcode
    eventInput = $(this);
    var lat = eventInput.attr('data-location-lat');
    console.log(lat);
    var lon = eventInput.attr('data-location-lon');
    console.log(lon);

    // OpenWeather API 5-day/3-hour Weather Forecasting
    var units = "imperial";
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    console.log(forecastUrl);

    fetch(forecastUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log('Forecast Data:');
        console.log(data);
        apiData = data;

        // Need to set all the parameters in here because this fetch has to successfully complete before moving on.
        renderApiOutputs();

    });

    
});






