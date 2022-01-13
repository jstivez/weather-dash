let startDate = moment().format('M/DD/YYYY');

let days = [];

for (let i = 1; i < 6; i++) {
    days[i] = moment().add(i, 'days').format('M/DD/YYYY');
}

$(document).ready(function () {
    console.log("ready!");


    $("#basic-text1").on("click", function (event) {
        event.preventDefault();
        let cityInput = $("#input").val();
        let allCities = [];

        allCities = JSON.parse(localStorage.getItem("allCities")) || [];
        allCities.push(cityInput);
        localStorage.setItem("allCities", JSON.stringify(allCities));
        showWeather(cityInput);
    });

    function showWeather(cityInput) {

        $("#dailyWeather").empty();
        $("#fiveDay").empty();
        for(let i = 1; i <6; i++){
            $("#day" + i).empty();
        }

        let oneDay = "https://api.openweathermap.org/data/2.5/weather?q=" +
            cityInput + "&units=imperial" + "&appid=52b24df92b5363a1f4491523e3d01dd8";
        $.ajax({
            url: oneDay,
            method: "GET",
        }).then(function (response) {
            
            let iconUrl = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
            let lat = response.coord.lat;
            let lon = response.coord.lon;

            $("#dailyWeather").append(
                "<div class='col s12 m6'>" +
                "<h2 class='daily'>" + response.name + " (" + startDate + ")" + "&nbsp" + "<img src='" + iconUrl + "'>" + "</h2>" +
                "<ul class='daily'>" + "Temperature: " + response.main.temp + " °F" + "</ul>" +
                "<ul class='daily'>" + "Humidity: " + response.main.humidity + "%" + "</ul>" +
                "<ul class='daily'>" + "Wind Speed: " + response.wind.speed + " MPH" + "</ul>" +
                "</div>"
            );

            let fiveDay = "https://api.openweathermap.org/data/2.5/onecall?" +
                "lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=52b24df92b5363a1f4491523e3d01dd8";
            console.log("fiveDay", fiveDay);

            $.ajax({
                url: fiveDay,
                method: "GET",
            }).then(function (response) {


                let icon = [];

                for (let i = 1; i < 6; i++) {
                    icon[i] = "http://openweathermap.org/img/w/" + response.daily[i - 1].weather[0].icon + ".png";
                }
                $("#dailyWeather").append(
                    "<div class='col s12 m6'>" +
                    "<ul class='daily'>" + "UV Index: " + "<button class='w3-button' id='uvIndex' class='daily'>" + response.current.uvi + "</button>" + "</ul>" +
                    "</div>"
                );

                if (response.current.uvi <= 2) {
                    $("#uvIndex").addClass("green");
                } else if (response.current.uvi <= 5) {
                    $("#uvIndex").addClass("yellow");
                } else if (response.current.uvi <= 7) {
                    $("#uvIndex").addClass("orange");
                } else if (response.current.uvi <= 10) {
                    $("#uvIndex").addClass("red");
                } else if (response.current.uvi <= 40) {
                    $("#uvIndex").addClass("purple");
                };

                $("#fiveDay").append(
                    "<div class='col-md-12'>" +
                    "<h2 id='fiveDay'>" + "5-Day Forecast:" + "</h2>"
                );

                for (let i = 0; i < 6; i++) {
                    $(("#day" + (i))).append(
                        "<div class='fiveDayCard card col s12 m6'>" +
                        "<div class='card-body'>" +
                        "<div class='card-header'>" + days[i] + "</div>" +
                        "<div class='card-text'>" + "<img src='" + icon[i] + "'>" + "</div>" +
                        "<div class='card-text'>" + "Temp: " + response.daily[i].temp.day + " °F" + "</div>" +
                        "<div class='card-text'>" + "Humidity: " + response.daily[i].humidity + "%" + "</div>" +
                        "</div>"
                    );

                }

                showCities();
            })
        })
    }

    function showCities() {
        $("#cityButtons").empty();
        let arrayFromStorage = JSON.parse(localStorage.getItem("allCities")) || [];
        let arrayLength = arrayFromStorage.length;

        for (let i = 0; i < arrayLength; i++) {
            let cityNameFromArray = arrayFromStorage[i];
            $("#cityButtons").append(
                "<div class='list-group'>"
                +
                "<button class='list-group-item'>" + cityNameFromArray +
                "</button>")
        }
    }
    showCities();
    $("#cityButtons").on("click", ".list-group-item", function (event) {
        event.preventDefault();
        var cityInput = ($(this).text());
        showWeather(cityInput);
    })
});
