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

        // Fetch location name with better error handling
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => {
                if (!response.ok) throw new Error('Location service unavailable');
                return response.json();
            })
            .then(data => {
                const location = data.address;
                let locationText = 'Your location';
                
                if (location.city) locationText = location.city;
                else if (location.town) locationText = location.town;
                else if (location.village) locationText = location.village;
                else if (location.county) locationText = location.county;
                
                document.getElementById('location').textContent = locationText;
            })
            .catch(() => {
                document.getElementById('location').textContent = 'Location service unavailable';
            });

        // Enhanced weather fetching with OpenWeatherMap API
        function fetchWeather(retryCount = 0) {
            const maxRetries = 2;
            const weatherEl = document.getElementById('weather');
            const apiKey = 'd329db35dd62c7493cce4ad3e7d39375';
            
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
                .then(response => {
                    if (!response.ok) throw new Error(response.statusText);
                    return response.json();
                })
                .then(data => {
                    if (!data.main || !data.weather) {
                        throw new Error('Incomplete weather data');
                    }
                    const temp = Math.round(data.main.temp);
                    const condition = data.weather[0].description;
                    weatherEl.textContent = `${temp}°C, ${condition}`;
                    weatherEl.classList.remove('error');
                })
                .catch(error => {
                    if (retryCount < maxRetries) {
                        weatherEl.textContent = `Retrying weather... (${retryCount + 1}/${maxRetries})`;
                        setTimeout(() => fetchWeather(retryCount + 1), 2000);
                    } else {
                        weatherEl.textContent = `Weather unavailable: ${error.message}`;
                        weatherEl.classList.add('error');
                    }
                });
        }
        
        fetchWeather();
    });
}

// Fetch latest news

function fetchNews() {
    document.getElementById('newsTicker').textContent = 'Loading latest news...';
    fetch('news.json')
        .then(response => response.json())
        .then(data => {
            const newsText = data.map(item => item.formatted).join('\n');
            document.getElementById('newsTicker').textContent = newsText;
        });
}

// Initialize on page load
fetchLocationAndWeather();
fetchNews();
