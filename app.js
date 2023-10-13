'use strict';

const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let mapEvent;
let map;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        
        const {latitude} = position.coords;
        const {longitude} = position.coords;

        const coords = [latitude,longitude];
        
        map = L.map('map').setView(coords, 13);

        L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker(coords)
            .addTo(map)
            .bindPopup('Your current Location :)!')
            .openPopup();

        
        map.on('click', function(mapE){
            mapEvent = mapE;
            form.classList.remove('hidden');
            inputDistance.focus();
            
        });

    }, 
        function () {
            alert('Could not get the right location');
    });
}


form.addEventListener('submit', function(e){

        e.preventDefault();
        const {lat} = mapEvent.latlng;
        const {lng} = mapEvent.latlng;

        const pin = [lat,lng];

        L.marker(pin)
        .addTo(map)
        .bindPopup(L.popup({
            maxWidth: 200,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
        }))
        .setPopupContent("Your pinned activity!")
        .openPopup();

})