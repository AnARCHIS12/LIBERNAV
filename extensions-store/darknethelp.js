// Extension Libernav : Guide accès darknet/onion
(function(){
  if (typeof document === 'undefined') return;
  const BTN_ID = 'libernav-darknethelp-btn';
  function addHelpBtn() {
    if (document.getElementById(BTN_ID)) return;
    const nav = document.querySelector('.nav-settings');
    if (!nav) return;
    const configBtn = nav.querySelector('#config-btn');
    if (!configBtn) return;
    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.title = 'Guide accès darknet/onion';
    btn.className = 'nav-controls button libernav-ext-btn';
    btn.style.margin = '0 2px';
    btn.textContent = '🕸️';
    btn.onclick = () => {
      const html = `
      <h2>Accéder à des sites .onion (darknet)</h2>
      <ul style='font-size:1.1em;line-height:1.5;'>
        <li>1. Vérifie que Tor est bien activé dans Libernav (statut 🟢 Tor en bas).</li>
        <li>2. Va sur un site .onion (exemple : <b>http://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion</b>).</li>
        <li>3. Les sites .onion ne sont accessibles que via Tor. Si tu as une erreur, vérifie que Tor fonctionne.</li>
        <li>4. Pour trouver des sites, utilise des annuaires onion (ex : <a href='http://torwiki.onion' target='_blank'>torwiki.onion</a>).</li>
        <li>5. Ne donne jamais d’infos personnelles sur le darknet. Reste prudent·e.</li>
        <li>6. Certains sites onion sont lents ou instables, c’est normal.</li>
        <li>7. Pour plus de sécurité, utilise Tails ou Whonix.</li>
      </ul>
      <p style='font-size:0.95em;color:#aaa;'>Libernav force le proxy Tor sur toutes les fenêtres, tu peux donc naviguer sur le darknet sans config supplémentaire.</p>
      `;
      const win = window.open('', '_blank');
      win.document.write('<!DOCTYPE html><html><head><title>Guide darknet</title><meta charset="utf-8"></head><body style="background:#181818;color:#fff;padding:2em;"></body></html>');
      win.document.addEventListener('DOMContentLoaded', function() {
        win.document.body.innerHTML = html;
      });
      // Fallback immédiat si déjà prêt
      if (win.document.readyState === 'complete' || win.document.readyState === 'interactive') {
        win.document.body.innerHTML = html;
      }
    };
    nav.insertBefore(btn, configBtn);
  }
  const navObs = new MutationObserver(()=>{ if(document.querySelector('.nav-settings')) addHelpBtn(); });
  navObs.observe(document.body, {childList:true, subtree:true});
  addHelpBtn();
  window.removeLibernavDarknethelp = function() {
    const btn = document.getElementById(BTN_ID);
    if(btn) btn.remove();
    navObs.disconnect();
    delete window.removeLibernavDarknethelp;
  };
})();
