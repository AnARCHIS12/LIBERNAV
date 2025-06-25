// Extension Timer/Pomodoro pour Libernav
(function(){
  if (typeof document !== 'undefined') {
    // Nettoyage si déjà présent
    const oldPomodoro = document.getElementById('libernav-pomodoro');
    if (oldPomodoro) oldPomodoro.remove();

    // Fonction de suppression à chaud
    window.removeLibernavPomodoro = function() {
      const p = document.getElementById('libernav-pomodoro');
      if (p) p.remove();
      if (window._libernavPomodoroInterval) {
        clearInterval(window._libernavPomodoroInterval);
        window._libernavPomodoroInterval = null;
      }
    };

    // Création du composant
    let pomodoro = document.createElement('div');
    pomodoro.id = 'libernav-pomodoro';
    pomodoro.style.position = 'fixed';
    pomodoro.style.bottom = '330px';
    pomodoro.style.right = '24px';
    pomodoro.style.background = '#222';
    pomodoro.style.color = '#fff';
    pomodoro.style.padding = '10px 16px';
    pomodoro.style.borderRadius = '8px';
    pomodoro.style.fontSize = '1em';
    pomodoro.style.zIndex = 9999;
    pomodoro.innerHTML = `
      <b>Pomodoro</b> <span id="libernav-pomodoro-timer">25:00</span><br>
      <button id="libernav-pomodoro-start">Démarrer</button>
      <button id="libernav-pomodoro-stop">Stop</button>
    `;
    document.body.appendChild(pomodoro);
    let time = 25*60;
    let running = false;
    function update() {
      const m = Math.floor(time/60).toString().padStart(2,'0');
      const s = (time%60).toString().padStart(2,'0');
      pomodoro.querySelector('#libernav-pomodoro-timer').textContent = `${m}:${s}`;
    }
    function tick() {
      if (running && time > 0) {
        time--;
        update();
        if (time === 0) alert('Pomodoro terminé !');
      }
    }
    pomodoro.querySelector('#libernav-pomodoro-start').onclick = function() {
      if (!running) {
        running = true;
        window._libernavPomodoroInterval = setInterval(tick, 1000);
      }
    };
    pomodoro.querySelector('#libernav-pomodoro-stop').onclick = function() {
      running = false;
      clearInterval(window._libernavPomodoroInterval);
      window._libernavPomodoroInterval = null;
      time = 25*60;
      update();
    };
    update();
    console.log('Extension Pomodoro activée !');
  }
})();
