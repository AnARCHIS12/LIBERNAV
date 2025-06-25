// Extension Notes rapides pour Libernav
(function(){
  if (typeof document !== 'undefined') {
    // Nettoyage si déjà présent
    const oldNotes = document.getElementById('libernav-notes');
    if (oldNotes) oldNotes.remove();

    // Fonction de suppression à chaud
    window.removeLibernavNotes = function() {
      const n = document.getElementById('libernav-notes');
      if (n) n.remove();
      // Optionnel : nettoyer le localStorage
      // localStorage.removeItem('libernav-notes');
    };

    // Création du textarea notes
    let notes = document.createElement('textarea');
    notes.id = 'libernav-notes';
    notes.placeholder = 'Notes Libernav...';
    notes.style.position = 'fixed';
    notes.style.bottom = '60px';
    notes.style.right = '24px';
    notes.style.width = '220px';
    notes.style.height = '80px';
    notes.style.background = '#222';
    notes.style.color = '#fff';
    notes.style.border = '1px solid #ff5252';
    notes.style.borderRadius = '8px';
    notes.style.padding = '8px';
    notes.style.zIndex = 9999;
    notes.value = localStorage.getItem('libernav-notes') || '';
    notes.oninput = () => localStorage.setItem('libernav-notes', notes.value);
    document.body.appendChild(notes);
    console.log('Extension Notes activée !');
  }
})();
