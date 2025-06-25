// Extension Traducteur DeepL pour Libernav (bouton dynamique barre nav)
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
      const oldDiv = document.getElementById('libernav-deepl');
      if (oldDiv) oldDiv.remove();
      const oldBtn = document.getElementById('deepl-btn');
      if (oldBtn) oldBtn.remove();
      window.removeLibernavDeepl = function() {
        const t = document.getElementById('libernav-deepl');
        if (t) t.remove();
        const b = document.getElementById('deepl-btn');
        if (b) b.remove();
      };
      // Ajout du bouton dans la barre de navigation
      const nav = document.querySelector('.nav-settings');
      if (nav && !document.getElementById('deepl-btn')) {
        let btn = document.createElement('button');
        btn.id = 'deepl-btn';
        btn.title = 'Traduire avec DeepL';
        btn.textContent = '🌐';
        btn.style.marginRight = '6px';
        nav.insertBefore(btn, nav.firstChild); // avant ⚙️
        btn.addEventListener('click', () => {
          window.open('https://www.deepl.com/translator', '_blank');
        });
      }
      // Suppression du panneau natif, tout passe par l'onglet externe
      console.log('Extension Traducteur DeepL activée !');
    });
  }
})();
