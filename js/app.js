const RECENT_SEARCH = 'RECENT_SEARCH';
const debounced = _.debounce(searchCities, 500);
const DIRECTIONS = {
    1: 'N',
    2: 'NNE',
    3: 'NE',
    4: 'ENE',
    5: 'E',
    6: 'ESE',
    7: 'SE',
    8: 'SSE',
    9: 'S',
    10: 'SSW',
    11: 'SW',
    12: 'WSW',
    13: 'W',
    14: 'WNW',
    15: 'NW',
    16: 'NNW',
    17: 'N'
};

function handleInputChange() {
    debounced();
}

async function searchCities() {
    const searchInputElement = document.getElementsByClassName('search__input')[0];
    const foundedCities = await getCities(searchInputElement.value);
    const suggestionElement = document.getElementsByClassName('search__suggestion')[0];

    toggleSuggestion(searchInputElement.value.length);

    if (foundedCities.length) {
        loadSuggestions(foundedCities);
        setRecentSearch(foundedCities);
    } else {
        const emptyElement = `<div class="empty__message"><span>${searchInputElement.value} is not founded...</span><span>Please search another city</span></div>`;
        suggestionElement.innerHTML = emptyElement;
    }
}

function handleInputBlur() {
    setTimeout(() => toggleSuggestion(false), 100);
}

function handleInputFocus() {
    const recentCities = JSON.parse(localStorage.getItem(RECENT_SEARCH));
    if(recentCities && recentCities.length){
        loadSuggestions(recentCities);
        toggleSuggestion(recentCities);
    }
}

async function selectCity(city) {
    const inputElement = document.getElementsByClassName('search__input')[0];
    inputElement.value = city.name;
    const response = await getCurrentWeather(city.id);
    const fiveDays = await getFiveDaysWeather(city.id);
    changeCurrentweatherInfo(response);
    changeFiveDays(fiveDays);
}

function loadSuggestions(cities) {
    const suggestionElement = document.getElementsByClassName('search__suggestion')[0];
    const items = document.getElementsByClassName('search__items')[0];
    items && items.remove();
    const ul = document.createElement('UL');
    ul.classList.add('search__items');
    cities.forEach(city => {
        const element = document.createElement('Li');
        element.classList.add('search__item');
        element.onclick = () => selectCity(city);
        element.innerText = city.name;
        ul.appendChild(element);
    });
    suggestionElement.appendChild(ul);
}

function toggleSuggestion(isShow) {
    const suggestionElement = document.getElementsByClassName('search__suggestion')[0];
    isShow ?
        suggestionElement.classList.add('search__suggestion--active'):
        suggestionElement.classList.remove('search__suggestion--active');

    !isShow && (() => {
        suggestionElement.innerHTML = '';
    })();
}

function setRecentSearch(cities) {
    let data = cities.slice(0, 4);
    data = JSON.stringify(data);
    localStorage.setItem(RECENT_SEARCH, data);
}

function changeCurrentweatherInfo(weather) {
    const cityEl = document.querySelector('.city-temperature__title');
    const degreeEl = document.querySelector('.temperature__current-degree');
    const dayEl = document.querySelector('.city-temperature__current-day');
    const pressureEl = document.querySelector('.pressure');
    const windEl = document.querySelector('.wind');
    const humidityEl = document.querySelector('.humidity');
    const iconEl = document.querySelector('.weather__icon');

    cityEl.innerHTML = `${weather.name}, ${weather.sys.country}`;
    degreeEl.innerHTML = `${Math.round(weather.main.temp)}&#8451;`;
    iconEl.src = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
    dayEl.innerHTML = moment(weather.dt, 'X').format('dddd');
    humidityEl.innerHTML = `${weather.main.humidity}%`;
    pressureEl.innerHTML = `${weather.main.pressure} hPa`;
    const deg = Math.round((weather.wind.deg / 22.5) + 1);
    windEl.innerHTML = `${DIRECTIONS[deg]}, ${weather.wind.speed} m/s`;
}

function changeFiveDays(weathers) {
    const cardsEl = document.querySelector('.cards__wrapper').children;
    const fiveDaysforecast = weathers.list.filter((item, index) => index % 8 === 0);
    for (let i = 0; i < fiveDaysforecast.length; i++) {
        cardsEl[i].children[1].innerHTML = moment(fiveDaysforecast[i].dt, 'X').format('dddd');
        cardsEl[i].children[0].children[0].src = `http://openweathermap.org/img/wn/${fiveDaysforecast[i].weather[0].icon}@2x.png`;
        cardsEl[i].children[2].innerHTML = `${Math.round(fiveDaysforecast[i].main.temp)}&#8451;`;
    }
}