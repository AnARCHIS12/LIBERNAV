// Extension Affichage IP publique pour Libernav
(function(){
  if (typeof document !== 'undefined') {
    // Nettoyage si déjà présent
    const oldIp = document.getElementById('libernav-ip');
    if (oldIp) oldIp.remove();

    // Fonction de suppression à chaud
    window.removeLibernavIp = function() {
      const ip = document.getElementById('libernav-ip');
      if (ip) ip.remove();
    };

    // Création du composant
    let ipDiv = document.createElement('div');
    ipDiv.id = 'libernav-ip';
    ipDiv.style.position = 'fixed';
    ipDiv.style.bottom = '240px';
    ipDiv.style.right = '24px';
    ipDiv.style.background = '#222';
    ipDiv.style.color = '#fff';
    ipDiv.style.padding = '6px 14px';
    ipDiv.style.borderRadius = '8px';
    ipDiv.style.fontSize = '1em';
    ipDiv.style.zIndex = 9999;
    ipDiv.textContent = 'IP: ...';
    document.body.appendChild(ipDiv);
    fetch('https://api.ipify.org?format=json').then(r=>r.json()).then(data=>{
      ipDiv.textContent = 'IP: ' + data.ip;
    }).catch(()=>{
      ipDiv.textContent = 'IP: inconnue';
    });
    console.log('Extension IP activée !');
  }
})();
