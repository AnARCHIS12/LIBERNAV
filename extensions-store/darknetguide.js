// Extension Libernav : bouton générateur de mot de passe externe (Netlify)
(function(){
    if (typeof window === 'undefined' || typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;
    const EXT_ID = 'libernav-passwordgen-external';
    const BTN_ID = 'libernav-passwordgen-external-btn';
    const NETLIFY_URL = 'https://darkenetmodedemploi.netlify.app/';

    function addMenuButton() {
        if (document.getElementById(BTN_ID)) return;
        const nav = document.querySelector('.nav-settings');
        if (!nav) return;
        const configBtn = nav.querySelector('#config-btn');
        if (!configBtn) return;
        const btn = document.createElement('button');
        btn.id = BTN_ID;
        btn.title = 'Générateur de mot de passe (externe)';
        btn.className = 'nav-controls button libernav-ext-btn';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.background = 'none';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        btn.style.padding = '2px 6px';
        btn.style.margin = '0 2px';
        btn.innerHTML = '🧅';
        btn.onclick = () => {
            window.open(NETLIFY_URL, '_blank', 'noopener,noreferrer');
        };
        nav.insertBefore(btn, configBtn);
    }

    // Observer la barre nav pour ajouter le bouton dès qu’elle existe
    const navObs = new MutationObserver(() => {
        if (document.querySelector('.nav-settings')) {
            addMenuButton();
        }
    });
    navObs.observe(document.body, { childList: true, subtree: true });
    addMenuButton();

    // Nettoyage à chaud
    window.removeLibernavPasswordgenExternal = function() {
        const btn = document.getElementById(BTN_ID);
        if (btn) btn.remove();
        navObs.disconnect();
        delete window.removeLibernavPasswordgenExternal;
    };
})();