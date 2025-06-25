// Extension Chatbot IA DuckDuckGo pour Libernav (bouton dynamique barre nav)
(function(){
  if (typeof document !== 'undefined') {
    // Nettoyage si déjà présent
    const oldChat = document.getElementById('libernav-chatbot');
    if (oldChat) oldChat.remove();
    const oldBtn = document.getElementById('chatbot-btn');
    if (oldBtn) oldBtn.remove();
    window.removeLibernavChatbot = function() {
      const t = document.getElementById('libernav-chatbot');
      if (t) t.remove();
      const b = document.getElementById('chatbot-btn');
      if (b) b.remove();
    };
    // Ajout du bouton dans la barre de navigation
    const nav = document.querySelector('.nav-settings');
    if (nav && !document.getElementById('chatbot-btn')) {
      let btn = document.createElement('button');
      btn.id = 'chatbot-btn';
      btn.title = 'Chat IA DuckDuckGo';
      btn.textContent = '💬';
      btn.style.marginRight = '6px';
      nav.insertBefore(btn, nav.firstChild); // avant ⚙️
      btn.addEventListener('click', () => {
        window.open('https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat&duckai=1&atb=v451-1', '_blank');
      });
    }
    // Suppression du panneau natif, tout passe par l'onglet externe
    console.log('Extension Chatbot IA DuckDuckGo (iframe officiel) activée !');
  }
})();
