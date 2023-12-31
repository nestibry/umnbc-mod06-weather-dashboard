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

var initialWeatherLocation = {
    displayStr: "Minneapolis, Minnesota",
    queryStr: "lat=44.9772995&lon=-93.2654692",
}


// Local Storage Functions and Render Saved Locations
function readFromLocalStorage() {
    savedLocations = JSON.parse(localStorage.getItem('weather-dashboard-locations')) || [];
}
readFromLocalStorage();


function renderSavedLocations() {

    // Clear the Dropdown Menu
    dropdownMenuEl.empty();

    // Iterates over all the savedLocations to add to the dropdown menu
    for (var i = 0; i < savedLocations.length; i++) {
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

    // Compare to existing and only add new unique searches
    var isNewSearch = (savedLocations.filter(savedLocations => savedLocations.displayStr == newItem.displayStr).length === 0);
    if (isNewSearch) {
        savedLocations.push(newItem);
        var sortedLocations = savedLocations.sort((p1, p2) => (p1.displayStr > p2.displayStr) ? 1 : (p1.displayStr < p2.displayStr) ? -1 : 0);
        savedLocations = sortedLocations;
        localStorage.setItem('weather-dashboard-locations', JSON.stringify(savedLocations));
        renderSavedLocations();
    }

}
saveToLocalStorage(initialWeatherLocation);



function renderForecast(selectedLocation, forecast) {

    // Render Current Conditions Container
    var currDateHour = dayjs().format("dddd, MMMM D, YYYY -- HH:00");
    $(".current-city").text(selectedLocation.displayStr);
    $(".current-location").text(`(${selectedLocation.queryStr.replace('&', '  ')})`);
    $(".current-time").text(currDateHour);
    $(".current-temp").text(`${Math.floor(forecast.list[0].main.temp)}\xB0F`);
    $(".current-pop").text(`${Math.floor(forecast.list[0].pop * 100)}%`);
    $(".current-clouds").text(`${forecast.list[0].clouds.all}%`);
    $(".current-wind").text(`${Math.floor(forecast.list[0].wind.speed)} mph`);
    $(".current-humidity").text(`${forecast.list[0].main.humidity}%`);
    var weatherIcon = forecast.list[0].weather[0].icon;  // Weather Condition (all weather is an array of length 1) => https://openweathermap.org/weather-conditions 
    var iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
    $(".current-icon").attr('src', iconUrl);
    $(".current-icon").attr('alt', forecast.list[0].weather[0].main);

    ////////////////////original above ////////////////////////////////////////

    // Aggregate the Daily Forecasts
    var forecastDataByHour = forecastData.list;  //forecast.list
    var listDaysFromForecast = [];
    // List the days available (prevents error on end of month to start of month roll-over)
    forecastDataByHour.map(hourlyData => {
        var day = parseInt(dayjs.unix(hourlyData.dt).format("D"));
        if (!listDaysFromForecast.includes(day)) {
            listDaysFromForecast.push(day);
        }
    });
    
    var dailyForecasts = [];
    listDaysFromForecast.forEach((day) => {

        var aggDailyForecast = { date: ``, icon: ``, desc: ``, high: ``, low: ``, prec: ``, clds: ``, wnd: ``, hmd: `` };

        // Filter the hourly data by day
        var forecastDataByDay = forecastDataByHour.filter(hourlyData => parseInt(dayjs.unix(hourlyData.dt).format("D")) === day);
        var forecastDate = dayjs.unix(forecastDataByDay[0].dt).format("ddd, MMM D");
        aggDailyForecast.date = forecastDate;

        // Take the worst case Weather contition, these codes appear to be the worst at the lowest id value https://openweathermap.org/weather-conditions
        var minWeaID = forecastDataByDay.sort((a, b) => a.weather[0].id - b.weather[0].id);
        aggDailyForecast.icon = minWeaID[0].weather[0].icon;
        aggDailyForecast.desc = minWeaID[0].weather[0].description;

        // Sort descending by temp_max and get high temp from first element
        var maxTemps = forecastDataByDay.sort((a, b) => b.main.temp_max - a.main.temp_max);
        aggDailyForecast.high = Math.floor(maxTemps[0].main.temp_max);

        // Sort ascending by temp_min and get low temp from first element
        var minTemps = forecastDataByDay.sort((a, b) => a.main.temp_min - b.main.temp_min);
        aggDailyForecast.low = Math.floor(minTemps[0].main.temp_min);

        // Sort descending by precipitation% and get max percipitation% from first element
        var maxPrec = forecastDataByDay.sort((a, b) => b.pop - a.pop);
        aggDailyForecast.prec = Math.floor(maxPrec[0].pop * 100);

        // Sort descending by cloud% and get max cloudiness from first element
        var maxClds = forecastDataByDay.sort((a, b) => b.clouds.all - a.clouds.all);
        aggDailyForecast.clds = Math.floor(maxClds[0].clouds.all);

        // Sort descending by windspeed and get max wind from first element
        var maxWind = forecastDataByDay.sort((a, b) => b.wind.speed - a.wind.speed);
        aggDailyForecast.wnd = Math.floor(maxWind[0].wind.speed);

        // Sort descending by humidity and get max humidity from first element
        var maxHmd = forecastDataByDay.sort((a, b) => b.main.humidity - a.main.humidity);
        aggDailyForecast.hmd = Math.floor(maxHmd[0].main.humidity);

        console.log(aggDailyForecast);
        dailyForecasts.push(aggDailyForecast);

    });
    

    // Render 5-Day Forecast Container
    $(".forecast-container").empty();
    // for (var i = 0; i < dailyForecasts.length; i++) {
    for (var i = 0; i < 5; i++) {

        // Card Body
        var cardBodyEl = $('<div class="card-body">');
        cardBodyEl.append($('<img class="card-text">').attr('src', `https://openweathermap.org/img/wn/${dailyForecasts[i].icon}.png`).attr('alt', dailyForecasts[i].desc));
        cardBodyEl.append($('<h6 class="card-text">').text(`High_Temp: ${dailyForecasts[i].high}\xB0F`));
        cardBodyEl.append($('<h6 class="card-text">').text(`Low_Temp: ${dailyForecasts[i].low}\xB0F`));
        cardBodyEl.append($('<h6 class="card-text">').text(`Precipitation: ${dailyForecasts[i].prec}%`));
        // cardBodyEl.append( $('<h6 class="card-text">').text(`Max_Clds: ${dailyForecasts[i].clds}%`) );
        cardBodyEl.append($('<h6 class="card-text">').text(`Max_Wnd: ${dailyForecasts[i].wnd} mph`));
        cardBodyEl.append($('<h6 class="card-text">').text(`Max_Hmd: ${dailyForecasts[i].hmd}%`));

        // Card Info Div
        var cardInfoDivEl = $('<div class="card h-100 border-dark">');
        cardInfoDivEl.append($('<h4 class="card-header">').text(dailyForecasts[i].date));
        cardInfoDivEl.append(cardBodyEl);

        // Daily Forecast Card
        var dailyForecastCardEl = $('<div class="col-12 col-lg-2 mb-3 flex-grow-1 forecast-card">');
        dailyForecastCardEl.append(cardInfoDivEl);
        $(".forecast-container").append(dailyForecastCardEl);
    }

}



function renderLocationForm(geodata) {

    // Clear the testApiSection to get ready for the new rendering
    cityInputEl.empty();
    console.log(`Rendering Location Form:`)
    console.log(geodata);

    // render locations to choose from
    for (var i = 0; i < geodata.length; i++) {
        var locationOptionEl = $('<option>');
        locationOptionEl.val(geodata[i].queryStr);
        locationOptionEl.text(geodata[i].displayTxt);
        cityInputEl.append(locationOptionEl);
    }
}


function fetchGeocode(geolocation) {

    fetch(geolocation.url)
        .then(function (response) {
            return response.json();
        })
        .then(function (geodata) {

            // Prepare data for Rendering Location Form
            var geoData = [];
            if (geolocation.type === 'city') {
                for (var i = 0; i < geodata.length; i++) {
                    var newLoc = {
                        queryStr: `lat=${geodata[i].lat}&lon=${geodata[i].lon}`,
                        displayTxt: `${geodata[i].name}, ${geodata[i].state}`,
                    };
                    geoData.push(newLoc);
                }
            }
            else if (geolocation.type === 'zip') {
                var newLoc = {
                    queryStr: `lat=${geodata.lat}&lon=${geodata.lon}`,
                    displayTxt: `${geodata.name}, ${geodata.zip}`,
                };
                geoData.push(newLoc);
            }
            renderLocationForm(geoData);

        })
        .catch(error => {
            console.error(error);
            alert(error);
        });
}


function getWeatherForecast(selectedLocation) {

    // OpenWeather API 5-day/3-hour Weather Forecasting
    var baseUrl = `https://api.openweathermap.org/data/2.5/forecast?${selectedLocation.queryStr}&units=imperial&appid=${apiKey}`;
    console.log(`Get Weather Forecast: ${selectedLocation.displayStr}, ${selectedLocation.queryStr}`);
    console.log(baseUrl);

    fetch(baseUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            forecastData = data;
            renderForecast(selectedLocation, forecastData)
            saveToLocalStorage(selectedLocation);
        })
        .catch(error => {
            console.error(error);
            alert(error);
        });
}
getWeatherForecast(initialWeatherLocation);


locationSearchEl.on('submit', function (event) {

    event.preventDefault();
    event.stopPropagation();

    // User input location, City or Zipcode
    var locationInput = locationInputEl.val();

    // Future To-dos
    //  : Need a modal to do City input, State input, Country input, ZIP Code input
    //  : Add capability to check valid input AND can't be empty

    // Check if the input is a City or Zipcode
    if (isNaN(parseInt(locationInput))) {

        // Geocoding by City, (State), Country Code for US Cities only
        var city = locationInput + ",US";
        var geolocation = {
            type: 'city',
            url: `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`,
        };
        console.log(`fetchUrl by city: ${geolocation.url}`);
        fetchGeocode(geolocation);

    } else if ((!isNaN(parseInt(locationInput))) && (locationInput.length == 5)) {

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

        // Did not return a US city => Manually minimize the modal form 
        closeForm = true;
        alert(`Location Error: "${locationInput}" is not a city or zipcode. \nPlease try your search again.`);

    }

    // Reset input
    locationInputEl.val('');

});


$("#choose-city-modal").on('shown.bs.modal', function (event) {
    event.preventDefault();
    event.stopPropagation();

    // Manually close modal if needed
    if (closeForm) {
        $('#choose-city-modal').modal('toggle');
        closeForm = false;
    }
});


cityFormEl.on('submit', function (event) {

    event.preventDefault();
    event.stopPropagation();

    var selectedLocation = {
        displayStr: $("#city-input option:selected").text(),
        queryStr: $("#city-input option:selected").val(),
    }
    getWeatherForecast(selectedLocation);
});


dropdownMenuEl.on('click', '.dropdown-item', function (event) {

    event.preventDefault();
    event.stopPropagation();

    var selectedLocation = {
        displayStr: $(this).text(),
        queryStr: $(this).attr('data-query-str'),
    }
    getWeatherForecast(selectedLocation);
});

