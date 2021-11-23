const  BASR_URL = 'api.openweathermap.org/data/2.5/';
const API_KEY = '7dc7314d6b64c037a862015970d5aafa';

function getCurrentWeather(cityId) {
    return fetch(`https://${BASR_URL}/weather?id=${cityId}&appid=${API_KEY}&units=metric&lang=fa`)
        .then(async response => await response.json())
        .catch(error => error);
}

function getFiveDaysWeather(cityId) {
    return fetch(`https://${BASR_URL}/forecast?id=${cityId}&appid=${API_KEY}&units=metric&lang=fa`)
        .then(async response => await response.json())
        .catch(error => error);
}