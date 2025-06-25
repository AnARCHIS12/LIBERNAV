// Extension Dark Mode pour Libernav
(function(){
  if (typeof document !== 'undefined') {
    // Sauvegarde des styles d'origine si pas déjà fait
    if (!window._libernavDarkmodeOriginal) {
      window._libernavDarkmodeOriginal = {
        background: document.body.style.background,
        color: document.body.style.color,
        links: Array.from(document.querySelectorAll('a')).map(a => a.style.color)
      };
    }
    document.body.style.background = '#181818';
    document.body.style.color = '#e8eaed';
    document.querySelectorAll('a').forEach(a => a.style.color = '#ff5252');

    // Fonction de suppression à chaud
    window.removeLibernavDarkmode = function() {
      if (window._libernavDarkmodeOriginal) {
        document.body.style.background = window._libernavDarkmodeOriginal.background || '';
        document.body.style.color = window._libernavDarkmodeOriginal.color || '';
        const links = document.querySelectorAll('a');
        window._libernavDarkmodeOriginal.links.forEach((color, i) => {
          if (links[i]) links[i].style.color = color || '';
        });
        window._libernavDarkmodeOriginal = null;
      }
    };
    console.log('Extension Dark Mode activée !');
  }
})();
