// Extension Libernav : Compteur de mots sélectionnés
(function(){
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const BTN_ID = 'libernav-wordcount-btn';
    function addWordcountBtn() {
        if (document.getElementById(BTN_ID)) return;
        const nav = document.querySelector('.nav-settings');
        if (!nav) return;
        const configBtn = nav.querySelector('#config-btn');
        if (!configBtn) return;
        const btn = document.createElement('button');
        btn.id = BTN_ID;
        btn.title = 'Compter les mots sélectionnés';
        btn.className = 'nav-controls button libernav-ext-btn';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.background = 'none';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        btn.style.padding = '2px 6px';
        btn.style.margin = '0 2px';
        btn.textContent = '🔢';
        btn.onclick = () => {
            const sel = window.getSelection().toString().trim();
            const count = sel ? sel.split(/\s+/).length : 0;
            btn.textContent = count + ' mot' + (count>1?'s':'');
            setTimeout(()=>{btn.textContent='🔢';}, 3000);
        };
        nav.insertBefore(btn, configBtn);
    }
    const navObs = new MutationObserver(()=>{
        if(document.querySelector('.nav-settings')) addWordcountBtn();
    });
    navObs.observe(document.body, {childList:true, subtree:true});
    addWordcountBtn();
    window.removeLibernavWordcount = function() {
        const btn = document.getElementById(BTN_ID);
        if(btn) btn.remove();
        navObs.disconnect();
        delete window.removeLibernavWordcount;
    };
})();
