// Validate search bar input
function validateSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput.value.trim() === '') {
        alert('Please enter a search term!');
        return false;
    }
    return true;
}

// Voice search
function startVoiceSearch() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = function(event) {
        document.getElementById('searchInput').value = event.results[0][0].transcript;
    };
    recognition.start();
}

// Fetch user location & weather
function fetchLocationAndWeather() {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;

        // Fetch location name
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('location').textContent = data.address.city || "Location not found";
            });

        // Fetch weather
        fetch(`/weather?lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('weather').textContent = `${data.temp}°C, ${data.condition}`;
            });
    });
}

// Fetch latest news
function fetchNews() {
    document.getElementById('newsTicker').textContent = 'Loading latest news...';
    fetch('/news')
        .then(response => response.json())
        .then(data => {
            document.getElementById('newsTicker').textContent = data.news;
        });
}

// Initialize on page load
fetchLocationAndWeather();
fetchNews();
