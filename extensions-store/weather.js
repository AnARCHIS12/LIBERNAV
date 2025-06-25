// Extension Météo pour Libernav (Open-Meteo, géolocalisation navigateur)
(function(){
  if (typeof document !== 'undefined') {
    // Nettoyage si déjà présent
    const oldWeather = document.getElementById('libernav-weather');
    if (oldWeather) oldWeather.remove();
    window.removeLibernavWeather = function() {
      const w = document.getElementById('libernav-weather');
      if (w) w.remove();
    };
    // Création du composant
    let weatherDiv = document.createElement('div');
    weatherDiv.id = 'libernav-weather';
    weatherDiv.style.position = 'fixed';
    weatherDiv.style.bottom = '690px';
    weatherDiv.style.right = '24px';
    weatherDiv.style.background = '#222';
    weatherDiv.style.color = '#fff';
    weatherDiv.style.padding = '10px 16px';
    weatherDiv.style.borderRadius = '8px';
    weatherDiv.style.fontSize = '1em';
    weatherDiv.style.zIndex = 9999;
    weatherDiv.textContent = 'Météo : ...';
    document.body.appendChild(weatherDiv);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`)
          .then(r=>r.json())
          .then(data => {
            if (data.current_weather) {
              const t = data.current_weather.temperature;
              const w = data.current_weather.weathercode;
              const desc = {
                0:'☀️', 1:'🌤️', 2:'⛅', 3:'☁️', 45:'🌫️', 48:'🌫️', 51:'🌦️', 53:'🌦️', 55:'🌦️', 56:'🌧️', 57:'🌧️', 61:'🌦️', 63:'🌦️', 65:'🌧️', 66:'🌧️', 67:'🌧️', 71:'❄️', 73:'❄️', 75:'❄️', 77:'❄️', 80:'🌧️', 81:'🌧️', 82:'🌧️', 85:'❄️', 86:'❄️', 95:'⛈️', 96:'⛈️', 99:'⛈️'
              };
              weatherDiv.textContent = `Météo : ${t}°C ${desc[w]||''}`;
            } else {
              weatherDiv.textContent = 'Météo : inconnue';
            }
          })
          .catch(()=>{ weatherDiv.textContent = 'Météo : erreur'; });
      }, function(){
        // Fallback Paris si refusé
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=48.85&longitude=2.35&current_weather=true&timezone=auto`)
          .then(r=>r.json())
          .then(data => {
            if (data.current_weather) {
              const t = data.current_weather.temperature;
              const w = data.current_weather.weathercode;
              const desc = {
                0:'☀️', 1:'🌤️', 2:'⛅', 3:'☁️', 45:'🌫️', 48:'🌫️', 51:'🌦️', 53:'🌦️', 55:'🌦️', 56:'🌧️', 57:'🌧️', 61:'🌦️', 63:'🌦️', 65:'🌧️', 66:'🌧️', 67:'🌧️', 71:'❄️', 73:'❄️', 75:'❄️', 77:'❄️', 80:'🌧️', 81:'🌧️', 82:'🌧️', 85:'❄️', 86:'❄️', 95:'⛈️', 96:'⛈️', 99:'⛈️'
              };
              weatherDiv.textContent = `Météo Paris : ${t}°C ${desc[w]||''}`;
            } else {
              weatherDiv.textContent = 'Météo Paris : inconnue';
            }
          })
          .catch(()=>{ weatherDiv.textContent = 'Météo : géoloc refusée'; });
      });
    } else {
      weatherDiv.textContent = 'Météo : géoloc non supportée';
    }
    console.log('Extension Météo activée !');
  }
})();
