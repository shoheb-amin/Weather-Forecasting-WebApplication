document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');
    const daysInput = document.getElementById('days-input');
    const resultSection = document.getElementById('weather-result');
    const loadingSection = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const city = cityInput.value.trim();
        const days = daysInput.value.trim();

        if (!city || !days) return;

        // Hide previous results and errors, show loading
        resultSection.classList.add('hidden');
        errorMessage.classList.add('hidden');
        loadingSection.classList.remove('hidden');

        try {
            // "mathura" acts as the generic path mapped parameter to call based on User's example curl
            const apiUrl = `http://localhost:8080/weather/forecast/mathura?city=${encodeURIComponent(city)}&days=${encodeURIComponent(days)}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Format and display the UI
            displayWeather(data);
            
            // Hide loading, show result
            loadingSection.classList.add('hidden');
            resultSection.classList.remove('hidden');

        } catch (error) {
            loadingSection.classList.add('hidden');
            console.error('Fetch error:', error);
            
            // In case the localhost:8080 API is down, show mock UI representation
            showMockData(city, days);
        }
    });

    function displayWeather(data) {
        // Update Current Weather summary
        const weatherResp = data.weatherResponse;
        
        document.getElementById('location-name').textContent = `${weatherResp.city}, ${weatherResp.country}`;
        document.getElementById('weather-condition').textContent = weatherResp.condition;
        document.getElementById('current-temp').textContent = weatherResp.temperature;

        // Update Forecast Cards array
        const forecastContainer = document.getElementById('forecast-container');
        forecastContainer.innerHTML = ''; // Clear previous fields

        data.dayTemp.forEach((day, index) => {
            // Parse date to readable format
            const dateObj = new Date(day.date);
            const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            
            // Assign some dynamic aesthetic icons based on condition/index
            const icons = ['fa-sun', 'fa-cloud-sun', 'fa-cloud', 'fa-cloud-rain'];
            const iconClass = icons[index % icons.length];

            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <div class="forecast-date">${dateStr}</div>
                <i class="fa-solid ${iconClass} forecast-icon"></i>
                <div class="temp-avg">${day.avgTemp}°C</div>
                <div class="forecast-temps">
                    <span class="temp-min" title="Min Temp"><i class="fa-solid fa-arrow-down" style="font-size: 0.8rem;"></i> ${day.minTemp}°</span>
                    <span class="temp-max" title="Max Temp"><i class="fa-solid fa-arrow-up" style="font-size: 0.8rem;"></i> ${day.maxTemp}°</span>
                </div>
            `;
            
            forecastContainer.appendChild(card);
        });
    }

    function showMockData(city, days) {
        // Mock data logic specifically to preview the UI when API is locally unavailable at local 8080 port.
        const mockData = {
            "dayTemp": [],
            "weatherResponse": {
                "city": city.charAt(0).toUpperCase() + city.slice(1),
                "region": "Simulated Region",
                "country": "India",
                "condition": "Clear",
                "temperature": 26.4
            }
        };

        const startDate = new Date();
        for(let i=0; i<parseInt(days); i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i + 1); // Future dates
            mockData.dayTemp.push({
                "avgTemp": (29 - i*0.5).toFixed(1),
                "date": d.toISOString().split('T')[0],
                "maxTemp": (39 - i*0.3).toFixed(1),
                "minTemp": (21 + i*0.2).toFixed(1)
            });
        }

        displayWeather(mockData);
        loadingSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        
        errorMessage.innerHTML = '<strong>Note:</strong> API unavailable. Displaying mock layout preview of UI.';
        errorMessage.style.color = '#f1c40f';
        errorMessage.style.background = 'rgba(241, 196, 15, 0.1)';
        errorMessage.style.border = '1px solid rgba(241, 196, 15, 0.2)';
        errorMessage.classList.remove('hidden');
    }
});
