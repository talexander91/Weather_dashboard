var APIkey = '040006c2e72be03f834e594e92aaaf07';
var getGeo = 'https://api.openweathermap.org/geo/1.0/direct?q=CITY&limit=5&appid=' + APIkey;
var getWeather = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=imperial&cnt=48&appid=' + APIkey;
var iconURL = "https://openweathermap.org/img/w/ICON.png"


var inputButton = document.querySelector('#inputButton');
var inputText = document.querySelector('input');
var searchHistory = document.querySelector('#searchHistory');
var mainContainer = document.querySelector('#main');
var cardContainer = document.querySelector('#cards');

var cities = JSON.parse(localStorage.getItem('cities')) || [];

for (var i = 0; i < cities.length; i++)
{
    AddToHistory(cities[i]);
}

inputButton.addEventListener('click', function(event){
    event.target.blur();

    fetch(getGeo.replace('CITY', inputText.value)).then(function(response){  // Generate weather based on text input
        return response.json();
    }).then(function(data){
        if (!data[0])
        {
            alert('Please enter a valid city name');
            return;
        }

        cities.push(data[0].name);
        AddToHistory(data[0].name);
        localStorage.setItem('cities',JSON.stringify(cities));

        var loc = getWeather.replace('{lat}', data[0].lat);
        GetWeather(loc.replace('{lon}', data[0].lon), data[0].name);
    });
})

function GetWeather(url, cityName)  
{
    fetch(url).then(function(response){
        return response.json();
    }).then(function(data){

        GenerateToday(cityName, data.list);
        GenerateFiveDay(cityName, data.list);
    });
}

function AddToHistory(cityName){
    inputText.value = '';
    var hist = document.createElement('button');
    hist.setAttribute('class', 'btn btn-secondary col-12 m-2');
    hist.textContent = cityName;

    hist.addEventListener('click', function(event){  // Generate weather forecast when history button is selected
        event.target.blur();
        fetch(getGeo.replace('CITY', cityName)).then(function(response){
            return response.json();
        }).then(function(data){

            var loc = getWeather.replace('{lat}', data[0].lat);
            GetWeather(loc.replace('{lon}', data[0].lon), event.target.textContent);
        });
    });

    searchHistory.appendChild(hist);
}

function GenerateToday(cityName, weather)  // parameters: string of city name and weather array data
{
    mainContainer.innerHTML = '';

    var icon = document.createElement('img');
    icon.setAttribute('src', iconURL.replace('ICON',weather[0].weather[0].icon));

    var nameText = document.createElement('h2');
    nameText.innerHTML += cityName + " (" + dayjs().format('DD/MM/YYYY') + ")"  //Generate City name plus date plus weather icon
        + "<img src =" + iconURL.replace('ICON',weather[0].weather[0].icon) + ">";
    nameText.setAttribute('class', 'm-2');
    mainContainer.appendChild(nameText);


    var tempText = document.createElement('p');  // Temperature
    tempText.textContent = 'Temperature: ' + weather[0].main.temp + ' °F';
    tempText.setAttribute('class', 'm-2');
    mainContainer.appendChild(tempText);

    var windText = document.createElement('p');  // wind Speed
    windText.textContent = 'Wind: ' + weather[0].wind.speed + ' mph';
    windText.setAttribute('class', 'm-2');
    mainContainer.appendChild(windText);

    var humText = document.createElement('p');  // humididty
    humText.textContent = 'Humidity: ' + weather[0].main.humidity + '%';
    humText.setAttribute('class', 'm-2');
    mainContainer.appendChild(humText);

}

function GenerateFiveDay(cityName, weatherArray) {
    cardContainer.innerHTML = '';

    var title = document.createElement('h2');
    title.setAttribute('class', 'col-12');
    title.textContent = "5 Day Forecast: "
    cardContainer.appendChild(title);

    for (var i = 0; i < weatherArray.length ; i++){  
        if (weatherArray[i].dt_txt.substring(11,13) == "12")  // only write a card for times of 12 o clock
        {
            WriteDateCard(weatherArray[i]);
        }
    }
}


function WriteDateCard(weatherObj){ // Function to write each card in the 5 day forecast
    
    var card = document.createElement('div');
    card.setAttribute('class', 'card col m-2');

    var dateText = document.createElement('h4');  // date
    dateText.textContent = weatherObj.dt_txt.substring(0,10);
    dateText.setAttribute('class', 'm-2');
    card.appendChild(dateText);

    var imgHolder = document.createElement('p');  // icon
    imgHolder.innerHTML = "<img src=" + iconURL.replace('ICON',weatherObj.weather[0].icon) + ">";
    card.appendChild(imgHolder);

    var tempText = document.createElement('p'); // temperature
    tempText.textContent = 'Temp: ' + weatherObj.main.temp + ' °F';
    tempText.setAttribute('class', 'm-2');
    card.appendChild(tempText);

    var windText = document.createElement('p'); // wind speed
    windText.textContent = 'Wind: ' + weatherObj.wind.speed + ' mph';
    windText.setAttribute('class', 'm-2');
    card.appendChild(windText);

    var humText = document.createElement('p');  // humidity
    humText.textContent = 'Humidity: ' + weatherObj.main.humidity + '%';
    humText.setAttribute('class', 'm-2');
    card.appendChild(humText);

    
    cardContainer.appendChild(card);
}