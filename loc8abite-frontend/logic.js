let map;
let panorama;
let guessMarker;
let targetMarker;
let allowMarkerSet = true;
let dottedLine;
let sv;
let pointOfOrigin = { lat: 48.137154, lng: 11.576124 };

const winPhrases = [
    "You nailed it!",
    "Perfection!",
    "Spot on!",
    "You're a OpenStreetGuesser pro!",
    "Absolutely accurate!",
    "Expert guesswork!",
    "You're on fire!",
    "Flawless victory!"
];

const closePhrases = [
    "Not bad!",
    "Close call!",
    "Almost there!",
    "Impressively close!",
    "Nearly pinpointed it!",
    "You're getting warmer!"
];

const farAwayPhrases = [
    "Room for improvement",
    "Distant guess!",
    "Keep exploring!",
    "Next time, maybe!",
    "Exploring new horizons!",
    "Try a different approach next time "
];

const veryFarAwayPhrases = [
    "You're exploring a different dimension!",
    "Did you guess from outer space?",
    "Way off the mark!",
    "The world's a big place, keep searching!",
    "Let's call this one a wild exploration!",
    "Woah, what are you searching for?",
];

// Sistema di livelli personalizzato
const gameLevels = {
    beginner: {
        radius: 5000,
        timeLimit: 120,
        pointsMultiplier: 1
    },
    expert: {
        radius: 3000,
        timeLimit: 90,
        pointsMultiplier: 1.5
    },
    master: {
        radius: 1000,
        timeLimit: 60,
        pointsMultiplier: 2
    }
};

// Sistema di punteggio personalizzato
class ScoreSystem {
    constructor() {
        this.currentScore = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.combo = 0;
        this.multiplier = 1;
    }

    calculateScore(distance, timeLeft) {
        const baseScore = Math.max(0, 1000 - (distance * 10));
        const timeBonus = timeLeft * 2;
        const comboBonus = this.combo * 50;
        
        const totalScore = (baseScore + timeBonus + comboBonus) * this.multiplier;
        this.currentScore += totalScore;
        
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            localStorage.setItem('highScore', this.highScore);
        }
        
        return totalScore;
    }

    updateCombo(success) {
        if (success) {
            this.combo++;
            this.multiplier = 1 + (this.combo * 0.1);
        } else {
            this.combo = 0;
            this.multiplier = 1;
        }
    }
}

// Sistema di achievement personalizzato
const achievements = {
    firstGuess: {
        id: 'firstGuess',
        title: 'Primo Passo',
        description: 'Completa la tua prima indovinata',
        icon: '🎯'
    },
    perfectScore: {
        id: 'perfectScore',
        title: 'Perfezione',
        description: 'Indovina la posizione esatta',
        icon: '🌟'
    },
    speedster: {
        id: 'speedster',
        title: 'Velocista',
        description: 'Indovina in meno di 30 secondi',
        icon: '⚡'
    }
};

// Funzione per generare indizi personalizzati
function generateFoodClue(restaurant) {
    const clues = [
        `Cerca un ristorante con ${restaurant.cuisine} cucina`,
        `L'insegna ha un colore ${restaurant.color}`,
        `Il ristorante si trova vicino a ${restaurant.landmark}`,
        `Cerca un locale con ${restaurant.specialty} come specialità`
    ];
    return clues[Math.floor(Math.random() * clues.length)];
}

// Funzione per il sistema di livelli
function updateLevel() {
    const currentLevel = parseInt(document.getElementById('currentLevel').textContent);
    const newLevel = currentLevel + 1;
    document.getElementById('currentLevel').textContent = newLevel;
    
    // Sblocca nuove funzionalità basate sul livello
    if (newLevel === 5) {
        unlockFeature('timeMode');
    } else if (newLevel === 10) {
        unlockFeature('tourMode');
    }
}

// Funzione per sbloccare nuove funzionalità
function unlockFeature(feature) {
    const featureElement = document.querySelector(`[data-feature="${feature}"]`);
    if (featureElement) {
        featureElement.classList.remove('locked');
        showUnlockAnimation(feature);
    }
}

// Animazione di sblocco
function showUnlockAnimation(feature) {
    const animation = document.createElement('div');
    animation.className = 'unlock-animation';
    animation.innerHTML = `
        <div class="unlock-content">
            <i class="fas fa-lock-open"></i>
            <h3>Nuova funzionalità sbloccata!</h3>
            <p>Hai sbloccato: ${feature}</p>
        </div>
    `;
    document.body.appendChild(animation);
    setTimeout(() => animation.remove(), 3000);
}

function adjustLayout() { // Adjust layout on resize
    var map = document.getElementById("map");
    var pano = document.getElementById("pano");

    if (window.innerWidth - (window.innerWidth * 22 / 100) < window.innerHeight) {
        map.style.width = "100%";
        map.style.float = "none";
        pano.style.width = "100%";
        pano.style.float = "none";
        map.style.height = "50%";
        pano.style.height = "50%";
    } else {
        map.style.width = "50%";
        map.style.float = "left";
        pano.style.width = "50%";
        pano.style.float = "left";
        map.style.height = "100%";
        pano.style.height = "100%";
    }
}

function haversineDistance(lat1, lon1, lat2, lon2) { // Calculate kilometer distance between two coordinates
    const R = 6371;
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers
    return distance;
}

function degToRad(deg) {
    return deg * (Math.PI / 180);
}

function generateRandomCoordMap() { // Generate random coordinates within map bounds
    const bounds = map.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    // Calculate the center of the map bounds
    const centerLat = (northEast.lat() + southWest.lat()) / 2;
    const centerLng = (northEast.lng() + southWest.lng()) / 2;

    // Generate random offsets using a normal distribution
    const latOffset = generateRandomOffset();
    const lngOffset = generateRandomOffset();

    // Apply the offsets to the center coordinates
    const lat = centerLat + latOffset * (northEast.lat() - southWest.lat());
    const lng = centerLng + lngOffset * (northEast.lng() - southWest.lng());

    return { lat: lat, lng: lng };
}

function generateRandomOffset() { // Generate random offset using a normal distribution
    const stdDev = 0.2;
    let offset = 0;

    for (let i = 0; i < 6; i++) {
        offset += Math.random();
    }

    offset -= 3;
    offset *= stdDev;
    return offset;
}

function getCityNameByLatLng(latitude, longitude, callback) { // Get city name by coordinates
    var latlng = new google.maps.LatLng(latitude, longitude);
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: latlng }, function (results, status) {
        if (status === "OK") {
            if (results[0]) {
                for (var i = 0; i < results[0].address_components.length; i++) {
                    var types = results[0].address_components[i].types;
                    if (types.includes("locality")) {
                        var city = results[0].address_components[i].long_name;
                        callback(city);
                        return;
                    }
                }
                callback(null); // City not found
            } else {
                callback(null); // No results found
            }
        } else {
            callback(null); // Geocoder failed
        }
    });
}

function getCityCornerCoordinates(centerPoint) { // Get city corner coordinates by city center coordinates
    const distanceToFarthestPoint = google.maps.geometry.spherical.computeDistanceBetween(centerPoint, map.getBounds().getNorthEast());
    const cityRadius = Math.round(distanceToFarthestPoint);

    const cityNorthEast = google.maps.geometry.spherical.computeOffset(centerPoint, cityRadius, 45);
    const citySouthWest = google.maps.geometry.spherical.computeOffset(centerPoint, cityRadius, 225);

    return { northEast: cityNorthEast, southWest: citySouthWest };
}

function getCurrentLocation() { // Get current device location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            getCityNameByLatLng(lat, lng, function (city) {
                if (city) {
                    document.getElementById('cityInput').value = city;
                    document.getElementById('validityMarkCheck').style.visibility = 'visible';
                    pointOfOrigin = { lat: lat, lng: lng };
                    resetGame();
                    console.log("Detected City: " + city);
                } else {
                    console.log("City not found");
                }
            });
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function initialize() {
    const scoreSystem = new ScoreSystem();
    let currentLevel = gameLevels.beginner;
    
    // Event listeners per i pulsanti di modalità
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            startGameMode(mode);
        });
    });
    
    // Event listener per il pulsante di inizio
    document.getElementById('startGameBtn').addEventListener('click', () => {
        const difficulty = document.getElementById('difficultyLevel').value;
        const category = document.getElementById('foodCategory').value;
        startGame(difficulty, category);
    });
    
    // Inizializza la mappa e il panorama
    initializeMap();
    initializePanorama();
}

function startGame(difficulty, category) {
    currentLevel = gameLevels[difficulty];
    const scoreSystem = new ScoreSystem();
    
    // Imposta il timer
    let timeLeft = currentLevel.timeLimit;
    const timer = setInterval(() => {
        timeLeft--;
        updateTimer(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timer);
            endRound(false);
        }
    }, 1000);
    
    // Genera una nuova posizione
    generateNewLocation(category, currentLevel.radius);
}

function processSVData({ data }) { // Process street view data
    const location = data.location;

    panorama.setPano(location.pano);
    panorama.setPov({
        heading: Math.floor(Math.random() * 360),
        pitch: 0,
    });
    panorama.setVisible(true);
}

function resetGame() { // Reset game
    allowMarkerSet = true;
    if (guessMarker !== null && guessMarker !== undefined) {
        guessMarker.setMap(null);
        guessMarker = null;
    }
    if (dottedLine !== null && dottedLine !== undefined) {
        dottedLine.setMap(null);
        dottedLine = null;
    }
    if (targetMarker !== null && targetMarker !== undefined) {
        targetMarker.setMap(null);
        targetMarker = null;
    }

    map.panTo(pointOfOrigin);
    map.setZoom(14);

    const cornerCoordinates = getCityCornerCoordinates(pointOfOrigin);
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(cornerCoordinates.northEast);
    bounds.extend(cornerCoordinates.southWest);
    map.fitBounds(bounds);
    
    const coordinates = generateRandomCoordMap();
    sv.getPanorama({ location: coordinates, radius: 10000 })
        .then(processSVData)
        .catch((e) =>
            resetGame()
        );;

    document.getElementById("guessBtn").innerHTML = "Guess!";
}

async function guessBtnClick() { // Guess button click
    let resultModalCenterTitle = document.getElementById("resultModalCenterTitle");
    let resultModalCenterText = document.getElementById("resultModalCenterText");

    if (!guessMarker) { // No marker set
        resultModalCenterTitle.innerHTML = "Oops!😮";
        resultModalCenterText.innerHTML = "Set a marker first!";
        $('#resultModalCenter').modal('show');
        return;
    }

    if (!allowMarkerSet) { // Reset game
        resetGame();
        return;
    }

    allowMarkerSet = false;
    guessMarker.setAnimation(null);
    guessMarker.setDraggable(false);
    document.getElementById("guessBtn").innerHTML = "New round";

    // Draw target marker
    if (targetMarker) {
        targetMarker.setMap(null);
    }
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const pinBackground = new PinElement({
        background: "#06d102",
        borderColor: "#199140",
        glyphColor: "#199140",
    });
    targetMarker = new AdvancedMarkerElement({
        position: panorama.getPosition(),
        map,
        title: 'Target',
        content: pinBackground.element,
    });

    // Draw dotted line between markers
    const lineSymbol = {
        path: "M 0,-1 0,1",
        strokeOpacity: 1,
        scale: 4,
    };
    dottedLine = new google.maps.Polyline({
        path: [
            { lat: panorama.getPosition().lat(), lng: panorama.getPosition().lng() },
            { lat: guessMarker.getPosition().lat(), lng: guessMarker.getPosition().lng() },
        ],
        strokeColor: "#c0e2fc",
        strokeOpacity: 0,
        icons: [
            {
                icon: lineSymbol,
                offset: "0",
                repeat: "20px",
            },
        ],
        map: map,
    });

    // Zoom out to have both markers in view
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(panorama.getPosition());
    bounds.extend(guessMarker.getPosition());
    map.fitBounds(bounds);


    const distance = haversineDistance(
        panorama.getPosition().lat(),
        panorama.getPosition().lng(),
        guessMarker.getPosition().lat(),
        guessMarker.getPosition().lng()
    ).toFixed(2);

    resultModalCenterText.innerHTML = "Your guess is " + distance + " km away!";
    if (distance < 0.05) {
        resultModalCenterTitle.innerHTML = winPhrases[Math.floor(Math.random() * winPhrases.length)] + "🤯";
        resultModalCenterText.innerHTML = "Absolutely on point!";
        startConfetti();
        setTimeout(function () { stopConfetti(); }, 4000);
    } else if (distance < 0.12) {
        resultModalCenterTitle.innerHTML = winPhrases[Math.floor(Math.random() * winPhrases.length)] + "🥳";
        startConfetti();
        setTimeout(function () { stopConfetti(); }, 3000);
    } else if (distance < 0.75) {
        resultModalCenterTitle.innerHTML = closePhrases[Math.floor(Math.random() * closePhrases.length)] + "😎";
    } else if (distance > 3.0) {
        resultModalCenterTitle.innerHTML = veryFarAwayPhrases[Math.floor(Math.random() * veryFarAwayPhrases.length)] + "😞";
    } else {
        resultModalCenterTitle.innerHTML = farAwayPhrases[Math.floor(Math.random() * farAwayPhrases.length)] + "😱";
    }

    $('#resultModalCenter').modal('show');
}

function loadGoogleScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${getGoogleMapsApiKey()}&libraries=places&callback=initialize&v=weekly`;
    script.defer = true;
    document.head.appendChild(script);
}

loadGoogleScript();

window.addEventListener("resize", adjustLayout);
window.addEventListener("load", adjustLayout);
window.initialize = initialize;