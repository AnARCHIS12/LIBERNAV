// Extension CNT-AIT pour Libernav (bouton dynamique barre nav)
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
      const oldDiv = document.getElementById('libernav-cntait');
      if (oldDiv) oldDiv.remove();
      const oldBtn = document.getElementById('cntait-btn');
      if (oldBtn) oldBtn.remove();
      window.removeLibernavCntait = function() {
        const t = document.getElementById('libernav-cntait');
        if (t) t.remove();
        const b = document.getElementById('cntait-btn');
        if (b) b.remove();
      };
      // Ajout du bouton dans la barre de navigation
      const nav = document.querySelector('.nav-settings');
      if (nav && !document.getElementById('cntait-btn')) {
        let btn = document.createElement('button');
        btn.id = 'cntait-btn';
        btn.title = 'CNT-AIT';
        btn.innerHTML = '<img src="../public/cnt.png" alt="CNT-AIT" style="height:1.2em;width:1.2em;vertical-align:middle;">';
        btn.style.marginRight = '6px';
        nav.insertBefore(btn, nav.firstChild); // avant ⚙️
        btn.addEventListener('click', () => {
          window.open('https://cnt-ait.info/', '_blank');
        });
      }
      // Suppression du panneau natif, tout passe par l'onglet externe
      console.log('Extension CNT-AIT activée !');
    });
  }
})();
