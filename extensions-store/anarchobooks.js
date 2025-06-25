// Extension Libernav : Liste de livres anarchistes
(function(){
  if (typeof document === 'undefined') return;
  const BTN_ID = 'libernav-anarchobooks-btn';
  const books = [
    "Qu’est-ce que la propriété ? — Pierre-Joseph Proudhon",
    "Dieu et l’État — Mikhaïl Bakounine",
    "L’Entraide, un facteur de l’évolution — Pierre Kropotkine",
    "La Conquête du pain — Pierre Kropotkine",
    "Paroles d’un révolté — Pierre Kropotkine",
    "L’Anarchie — Élisée Reclus",
    "L’Homme et la Terre — Élisée Reclus",
    "Ni Dieu ni maître — Auguste Blanqui",
    "Souvenirs de la Commune — Louise Michel",
    "La Commune — Louise Michel",
    "La Morale anarchiste — Pierre Kropotkine",
    "L’Organisation de la vengeance — Ravachol",
    "Le Droit à la paresse — Paul Lafargue",
    "L’Unique et sa propriété — Max Stirner",
    "L’Anarchisme — Errico Malatesta",
    "Pensée et action — Emma Goldman",
    "Vivre ma vie — Emma Goldman",
    "La Société mourante et l’anarchie — Jean Grave",
    "La Révolution inconnue — Voline",
    "L’Insurrection qui vient — Comité invisible",
    "À bas le travail — Bob Black",
    "La Vieillesse de la Révolution — Sébastien Faure",
    "L’Anarchie expliquée à mon père — Francis Dupuis-Déri",
    "L’Anarchisme aujourd’hui — Daniel Colson",
    "L’Anarchie, c’est la vie sans chefs — Albert Libertad",
    "La Désobéissance civile — Henry David Thoreau",
    "La Propriété, c’est le vol — Proudhon",
    "La Révolte des masses — José Ortega y Gasset",
    "La Révolution sociale — Fernand Pelloutier",
    "L’Anarchie et la morale — Jean Grave",
    "L’Anarchie, sa philosophie, son idéal — Jean Grave",
    "La Société contre l’État — Pierre Clastres",
    "L’Anarchisme — Daniel Guérin",
    "L’Anarchisme, de la doctrine à l’action — Daniel Guérin",
    "L’Anarchisme, une introduction — George Woodcock",
    "L’Anarchisme, une histoire — Robert Graham",
    "L’Anarchisme, une utopie nécessaire — Noam Chomsky",
    "La Désobéissance — Erich Fromm",
    "L’Anarchie, c’est l’ordre sans le pouvoir — Proudhon",
    "L’Anarchie, c’est la société organisée sans autorité — Malatesta",
    "L’Anarchie, c’est la société sans gouvernement — Kropotkine",
    "L’Anarchie, c’est la société des égaux — Reclus"
  ];
  function addBooksBtn() {
    if (document.getElementById(BTN_ID)) return;
    const nav = document.querySelector('.nav-settings');
    if (!nav) return;
    const configBtn = nav.querySelector('#config-btn');
    if (!configBtn) return;
    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.title = 'Livres anarchistes';
    btn.className = 'nav-controls button libernav-ext-btn';
    btn.style.margin = '0 2px';
    btn.textContent = '📚';
    btn.onclick = () => {
      let html = '<h2>Livres anarchistes</h2><ul style="font-size:1.1em;line-height:1.5;">';
      books.forEach(b=>{ html += '<li>'+b+'</li>'; });
      html += '</ul>';
      const win = window.open('', '_blank');
      win.document.write('<body style="background:#181818;color:#fff;padding:2em;">'+html+'</body>');
    };
    nav.insertBefore(btn, configBtn);
  }
  const navObs = new MutationObserver(()=>{ if(document.querySelector('.nav-settings')) addBooksBtn(); });
  navObs.observe(document.body, {childList:true, subtree:true});
  addBooksBtn();
  window.removeLibernavAnarchobooks = function() {
    const btn = document.getElementById(BTN_ID);
    if(btn) btn.remove();
    navObs.disconnect();
    delete window.removeLibernavAnarchobooks;
  };
})();
