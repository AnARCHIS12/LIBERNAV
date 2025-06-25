// Extension Zoom rapide pour Libernav
(function(){
  if (typeof document !== 'undefined') {
    // Nettoyage si déjà présent
    const oldZoom = document.getElementById('libernav-zoom');
    if (oldZoom) oldZoom.remove();
    window.removeLibernavZoom = function() {
      const z = document.getElementById('libernav-zoom');
      if (z) z.remove();
      document.body.style.zoom = '';
    };
    // Création du composant
    let zoomDiv = document.createElement('div');
    zoomDiv.id = 'libernav-zoom';
    zoomDiv.style.position = 'fixed';
    zoomDiv.style.bottom = '24px';
    zoomDiv.style.left = '24px'; // Affichage en bas à gauche
    zoomDiv.style.right = '';
    zoomDiv.style.background = '#222';
    zoomDiv.style.color = '#fff';
    zoomDiv.style.padding = '6px 14px';
    zoomDiv.style.borderRadius = '8px';
    zoomDiv.style.fontSize = '1em';
    zoomDiv.style.zIndex = 9999;
    zoomDiv.innerHTML = 'Zoom&nbsp; <button id="libernav-zoom-minus">-</button> <span id="libernav-zoom-value">100%</span> <button id="libernav-zoom-plus">+</button>';
    document.body.appendChild(zoomDiv);
    let zoom = 1;
    function update() {
      document.body.style.zoom = zoom;
      zoomDiv.querySelector('#libernav-zoom-value').textContent = Math.round(zoom*100) + '%';
    }
    zoomDiv.querySelector('#libernav-zoom-plus').onclick = function() {
      zoom = Math.min(2, zoom + 0.1);
      update();
    };
    zoomDiv.querySelector('#libernav-zoom-minus').onclick = function() {
      zoom = Math.max(0.5, zoom - 0.1);
      update();
    };
    update();
    console.log('Extension Zoom rapide activée !');
  }
})();
