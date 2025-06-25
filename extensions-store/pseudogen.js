// Extension Libernav : Générateur de pseudo aléatoire
(function(){
  if (typeof document === 'undefined') return;
  const BTN_ID = 'libernav-pseudogen-btn';
  const prefixes = ['Noir', 'Rouge', 'Libre', 'Volt', 'Sauvage', 'Mutin', 'Zad', 'Rebelle', 'Radical', 'Soleil', 'Loup', 'Chat', 'Corbeau', 'Fleur', 'Feu', 'Vent', 'Oiseau', 'Chien', 'Anar', 'Camarade', 'Compagnon', 'Collectif', 'Pirate', 'Utopie', 'Étoile', 'Terre', 'Forêt', 'Rivière', 'Montagne', 'Brique', 'Papillon', 'Aube', 'Nuit', 'Espoir', 'Rage', 'Poing', 'Flamme', 'Bulle', 'Bison', 'Chardon', 'Bambou', 'Baleine', 'Cactus', 'Bison', 'Bison', 'Bison'];
  const suffixes = ['Solidaire', 'Libertaire', 'Sauvage', 'Indocile', 'Insoumis', 'Nomade', 'Errant', 'Radieux', 'Nocturne', 'Solaire', 'Furtif', 'Invisible', 'Vagabond', 'Mutin', 'Zadiste', 'Pirate', 'Anarchiste', 'Collectif', 'Autonome', 'Indépendant', 'Révolté', 'Poétique', 'Créatif', 'Utopiste', 'Résistant', 'Dissident', 'Fraternel', 'Populaire', 'Syndicaliste', 'Communard', 'Émancipé', 'Égalitaire', 'Fédéré', 'Déroutant', 'Dérangeant', 'Dérivant', 'Dérivant', 'Dérivant'];
  function addPseudoBtn() {
    if (document.getElementById(BTN_ID)) return;
    const nav = document.querySelector('.nav-settings');
    if (!nav) return;
    const configBtn = nav.querySelector('#config-btn');
    if (!configBtn) return;
    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.title = 'Générer un pseudo anarchiste';
    btn.className = 'nav-controls button libernav-ext-btn';
    btn.style.margin = '0 2px';
    btn.textContent = '🆔';
    btn.onclick = () => {
      const p = prefixes[Math.floor(Math.random()*prefixes.length)] + '-' + suffixes[Math.floor(Math.random()*suffixes.length)];
      alert('Ton pseudo : ' + p);
    };
    nav.insertBefore(btn, configBtn);
  }
  const navObs = new MutationObserver(()=>{ if(document.querySelector('.nav-settings')) addPseudoBtn(); });
  navObs.observe(document.body, {childList:true, subtree:true});
  addPseudoBtn();
  window.removeLibernavPseudogen = function() {
    const btn = document.getElementById(BTN_ID);
    if(btn) btn.remove();
    navObs.disconnect();
    delete window.removeLibernavPseudogen;
  };
})();
