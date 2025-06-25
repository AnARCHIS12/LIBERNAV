// Extension Liberchat pour Libernav (bouton dynamique barre nav)
(function(){
  function injectWhenNavReady(fn) {
    if (document.querySelector('.nav-settings')) {
      fn();
    } else {
      const obs = new MutationObserver(() => {
        if (document.querySelector('.nav-settings')) {
          obs.disconnect();
          fn();
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }
  if (typeof document !== 'undefined') {
    injectWhenNavReady(() => {
      // Nettoyage si déjà présent
      const oldDiv = document.getElementById('libernav-liberchat');
      if (oldDiv) oldDiv.remove();
      const oldBtn = document.getElementById('liberchat-btn');
      if (oldBtn) oldBtn.remove();
      window.removeLibernavLiberchat = function() {
        const t = document.getElementById('libernav-liberchat');
        if (t) t.remove();
        const b = document.getElementById('liberchat-btn');
        if (b) b.remove();
      };
      // Ajout du bouton dans la barre de navigation
      const nav = document.querySelector('.nav-settings');
      if (nav && !document.getElementById('liberchat-btn')) {
        let btn = document.createElement('button');
        btn.id = 'liberchat-btn';
        btn.title = 'Liberchat';
        btn.innerHTML = '<img src="../public/icon.ico" alt="Liberchat" style="height:1.2em;width:1.2em;vertical-align:middle;">';
        btn.style.marginRight = '6px';
        nav.insertBefore(btn, nav.firstChild); // avant ⚙️
        btn.addEventListener('click', () => {
          window.open('https://liberchat-3-0-1.onrender.com/', '_blank');
        });
      }
      // Suppression du panneau natif, tout passe par l'onglet externe
      console.log('Extension Liberchat activée !');
    });
  }
})();
