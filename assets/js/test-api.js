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
var geoData = [];
var zipData = [];
var apiData = [];

// Geocoding by City, (State), Country Code
var city = "chaseburg,wisconsin,us";
var limit = 100;
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
var zipCode = 54621;
var countryCode = "US";
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





