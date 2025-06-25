// Extension Traducteur rapide pour Libernav (bouton dynamique barre nav, gestion erreurs)
(function(){
  if (typeof document !== 'undefined') {
    // Nettoyage si déjà présent
    const oldTrans = document.getElementById('libernav-translator');
    if (oldTrans) oldTrans.remove();
    const oldBtn = document.getElementById('translator-btn');
    if (oldBtn) oldBtn.remove();
    window.removeLibernavTranslator = function() {
      const t = document.getElementById('libernav-translator');
      if (t) t.remove();
      const b = document.getElementById('translator-btn');
      if (b) b.remove();
    };
    // Ajout du bouton dans la barre de navigation
    const nav = document.querySelector('.nav-settings');
    if (nav && !document.getElementById('translator-btn')) {
      let btn = document.createElement('button');
      btn.id = 'translator-btn';
      btn.title = 'Traduire';
      btn.textContent = '🌐';
      btn.style.marginRight = '6px';
      nav.insertBefore(btn, nav.firstChild); // avant ⚙️
      btn.addEventListener('click', () => {
        const panel = document.getElementById('libernav-translator');
        if (panel) {
          panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
        }
      });
    }
    // Création du panneau traducteur (caché par défaut)
    let transDiv = document.createElement('div');
    transDiv.id = 'libernav-translator';
    transDiv.style.position = 'fixed';
    transDiv.style.left = '24px';
    transDiv.style.top = '60px';
    transDiv.style.background = '#222';
    transDiv.style.color = '#fff';
    transDiv.style.padding = '10px 16px';
    transDiv.style.borderRadius = '8px';
    transDiv.style.fontSize = '1em';
    transDiv.style.zIndex = 9999;
    transDiv.style.display = 'none';
    transDiv.innerHTML = `
      <b>Traduire</b><br>
      <textarea id="libernav-translator-src" placeholder="Texte à traduire..." style="width:180px;height:40px;margin:4px 0;border-radius:6px;"></textarea><br>
      <select id="libernav-translator-lang" style="margin-bottom:4px;">
        <option value="en">Anglais</option>
        <option value="fr">Français</option>
        <option value="es">Espagnol</option>
        <option value="de">Allemand</option>
        <option value="it">Italien</option>
        <option value="ru">Russe</option>
        <option value="ar">Arabe</option>
        <option value="zh">Chinois</option>
      </select>
      <button id="libernav-translator-btn">Traduire</button>
      <div id="libernav-translator-result" style="margin-top:6px;min-height:24px;"></div>
    `;
    document.body.appendChild(transDiv);
    const src = transDiv.querySelector('#libernav-translator-src');
    const lang = transDiv.querySelector('#libernav-translator-lang');
    const tradBtn = transDiv.querySelector('#libernav-translator-btn');
    const result = transDiv.querySelector('#libernav-translator-result');
    tradBtn.onclick = function() {
      if (!src.value.trim()) return;
      tradBtn.disabled = true;
      result.textContent = '...';
      fetch('https://translate.astian.org/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: src.value, source: 'auto', target: lang.value, format: 'text' })
      })
      .then(r => r.json())
      .then(data => {
        result.textContent = data.translatedText || 'Erreur';
        tradBtn.disabled = false;
      })
      .catch(() => {
        result.textContent = 'Erreur de traduction (service indisponible ou quota atteint)';
        tradBtn.disabled = false;
      });
    };
    console.log('Extension Traducteur activée !');
  }
})();
