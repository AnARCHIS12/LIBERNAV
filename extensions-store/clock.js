// Extension Horloge pour Libernav
(function(){
  if (typeof document !== 'undefined') {
    // Nettoyage si déjà présent
    if (window._libernavClockInterval) {
      clearInterval(window._libernavClockInterval);
      window._libernavClockInterval = null;
    }
    const oldClock = document.getElementById('libernav-clock');
    if (oldClock) oldClock.remove();

    // Fonction de suppression à chaud
    window.removeLibernavClock = function() {
      if (window._libernavClockInterval) {
        clearInterval(window._libernavClockInterval);
        window._libernavClockInterval = null;
      }
      const c = document.getElementById('libernav-clock');
      if (c) c.remove();
    };

    // Création de l'horloge
    let clock = document.createElement('div');
    clock.id = 'libernav-clock';
    clock.style.position = 'fixed';
    clock.style.bottom = '16px';
    clock.style.right = '24px';
    clock.style.background = '#222';
    clock.style.color = '#fff';
    clock.style.padding = '6px 14px';
    clock.style.borderRadius = '8px';
    clock.style.fontSize = '1.1em';
    clock.style.zIndex = 9999;
    document.body.appendChild(clock);
    window._libernavClockInterval = setInterval(() => {
      const d = new Date();
      clock.textContent = d.toLocaleTimeString();
    }, 1000);
    console.log('Extension Horloge activée !');
  }
})();
