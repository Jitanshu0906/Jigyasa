function validateSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput.value.trim() === '') {
        alert('Please enter a search term!');
        return false;
    }
    return true;
}

function startVoiceSearch() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = function(event) {
        document.getElementById('searchInput').value = event.results[0][0].transcript;
    };
    recognition.start();
}

function fetchLocationAndWeather() {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;

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

function fetchNews() {
    const newsTicker = document.getElementById('newsTicker');
    newsTicker.innerHTML = '';
    fetch('news.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const li = document.createElement('li');

                const cube = document.createElement('div');
                cube.className = 'news-cube';

                const cubeInner = document.createElement('div');
                cubeInner.className = 'news-cube-inner';

                const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
                faces.forEach(face => {
                    const faceDiv = document.createElement('div');
                    faceDiv.className = 'news-cube-face ' + face;
                    cubeInner.appendChild(faceDiv);
                });

                cube.appendChild(cubeInner);

                const a = document.createElement('a');
                a.href = item.link;
                a.textContent = item.title;
                a.target = '_blank';

                li.appendChild(cube);
                li.appendChild(a);

                newsTicker.appendChild(li);
            });
        })
        .catch(() => {
            newsTicker.innerHTML = '<li class="error">Failed to load news.</li>';
        });
}

function createRotatingCube() {
    // Removed as per user request
}

window.onload = () => {
  const theme = localStorage.getItem('theme') || 'dark';
  if (theme === 'light-theme') {
    document.body.className = 'light-theme';
  } else {
    document.body.className = '';
  }
};

function toggleTheme() {
  const isLight = document.body.classList.contains('light-theme');
  if (isLight) {
    document.body.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.add('light-theme');
    localStorage.setItem('theme', 'light-theme');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const settingsButton = document.getElementById('settingsButton');
  const settingsDropdown = document.getElementById('settingsDropdown');

  // Settings button toggle dropdown
  settingsButton.addEventListener('click', () => {
    settingsDropdown.classList.toggle('active');
  });

  // Close dropdown if clicked outside
  document.addEventListener('click', (event) => {
    if (!settingsButton.contains(event.target) && !settingsDropdown.contains(event.target)) {
      settingsDropdown.classList.remove('active');
    }
  });
});

// Initialize on page load
fetchLocationAndWeather();
fetchNews();
