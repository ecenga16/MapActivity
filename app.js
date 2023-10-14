'use strict';

const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];


class Workout {

    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coords,distance,duration){
        this.coords=coords;
        this.distance=distance;
        this.duration=duration;
    }


    
}


class Running extends Workout {
    constructor(coords,distance,duration,cadence){
        super(coords,distance,duration);
        this.cadence= cadence;
        this.calcPace();
    }

    calcPace(){
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

class Cycling extends Workout {
    constructor(coords,distance,duration,elevationGain){
        super(coords,distance,duration);
        this.elevationGain = elevationGain;
    }

    calcSpeed(){
        this.speed = this.distance / this.duration / 60 ;
        return this.speed;
    }
}


class App{

    form = document.querySelector('.form');
    containerWorkouts = document.querySelector('.workouts');
    inputType = document.querySelector('.form__input--type');
    inputDistance = document.querySelector('.form__input--distance');
    inputDuration = document.querySelector('.form__input--duration');
    inputCadence = document.querySelector('.form__input--cadence');
    inputElevation = document.querySelector('.form__input--elevation');
    
    

    #map;
    #mapEvent;
    #workouts = [];

    constructor(){

        this._getPosition();
        this.inputType.value = "cycling";
        this.inputType.addEventListener('change', this._toggleElevationField.bind(this));
        this.form.addEventListener('submit', this._newWorkout.bind(this));

    }

    _loadMap(position) {

        const {latitude} = position.coords;
        const {longitude} = position.coords;

        const coords = [latitude,longitude];
        

        this.#map = L.map('map').setView(coords, 13);

        L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        L.marker(coords)
            .addTo(this.#map)
            .bindPopup('Your current Location :)!')
            .openPopup();

        
        this.#map.on('click', this._showForm.bind(this));

    }

    _getPosition(){

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( this._loadMap.bind(this), function () {
                    alert('Could not get the right location');
            });
        }

    }

    _showForm(mapE){

        this.#mapEvent = mapE;
        this.form.classList.remove('hidden');
        this.inputDistance.focus();

        
    }

    _toggleElevationField() {
        this.inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        this.inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e) {
        const validInputs = (...inputs) => inputs.every(input => Number.isFinite(input));
        const allPositive = (...inputs) => inputs.every(input => input > 0);

        e.preventDefault();

        const type = this.inputType.value; 
        const distance = this.inputDistance.value;
        const duration = this.inputDuration.value;
        const { lat, lng } = this.#mapEvent.latlng;
        let workout;

        if (type === 'running') {
            const cadence = +this.inputCadence.value; 
            if (
                !validInputs(distance, duration, cadence) ||
                !allPositive(distance, duration, cadence)
            ) return alert('Inputs have to be positive numbers');

            workout = new Running(pin, distance, duration, cadence);
            this.#workouts.push(workout);
        }

        if (type === 'cycling') {
            const elevation = +this.inputElevation.value; 
            if (
                !validInputs(distance, duration, elevation) ||
                !allPositive(distance, duration, elevation)
            ) return alert('Inputs have to be positive numbers');

            workout = new Cycling(pin, distance, duration, elevation);
            this.#workouts.push(workout);
        }

        this.inputDistance.value = this.inputDuration.value = this.inputElevation.value = this.inputCadence.value = '';

        const pin = [lat,lng];

        L.marker(pin)
        .addTo(this.#map)
        .bindPopup(L.popup({
            maxWidth: 200,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
        }))
        .setPopupContent("Your pinned activity!")
        .openPopup();
    }

}

const app = new App();