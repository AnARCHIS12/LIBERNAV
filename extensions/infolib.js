// Extension InfoLibertaire pour Libernav (bouton dynamique barre nav)
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
      const oldDiv = document.getElementById('libernav-infolib');
      if (oldDiv) oldDiv.remove();
      const oldBtn = document.getElementById('infolib-btn');
      if (oldBtn) oldBtn.remove();
      window.removeLibernavInfolib = function() {
        const t = document.getElementById('libernav-infolib');
        if (t) t.remove();
        const b = document.getElementById('infolib-btn');
        if (b) b.remove();
      };
      // Ajout du bouton dans la barre de navigation
      const nav = document.querySelector('.nav-settings');
      if (nav && !document.getElementById('infolib-btn')) {
        let btn = document.createElement('button');
        btn.id = 'infolib-btn';
        btn.title = 'InfoLibertaire';
        btn.innerHTML = '<img src="../public/l.png" alt="InfoLibertaire" style="height:1.2em;width:1.2em;vertical-align:middle;">';
        btn.style.marginRight = '6px';
        nav.insertBefore(btn, nav.firstChild); // avant ⚙️
        btn.addEventListener('click', () => {
          window.open('https://www.infolibertaire.net/', '_blank');
        });
      }
      // Suppression du panneau natif, tout passe par l'onglet externe
      console.log('Extension InfoLibertaire activée !');
    });
  }
})();
