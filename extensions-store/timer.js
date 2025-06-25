// Extension Libernav : Minuteur simple
(function(){
  if (typeof document === 'undefined') return;
  const BTN_ID = 'libernav-timer-btn';
  function addTimerBtn() {
    if (document.getElementById(BTN_ID)) return;
    const nav = document.querySelector('.nav-settings');
    if (!nav) return;
    const configBtn = nav.querySelector('#config-btn');
    if (!configBtn) return;
    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.title = 'Minuteur';
    btn.className = 'nav-controls button libernav-ext-btn';
    btn.style.margin = '0 2px';
    btn.textContent = '⏲️';
    btn.onclick = () => {
      const min = prompt('Durée en minutes ?', '5');
      if (!min || isNaN(min)) return;
      btn.textContent = '⏳';
      setTimeout(()=>{
        alert('⏲️ Temps écoulé !');
        btn.textContent = '⏲️';
      }, parseInt(min)*60000);
    };
    nav.insertBefore(btn, configBtn);
  }
  const navObs = new MutationObserver(()=>{ if(document.querySelector('.nav-settings')) addTimerBtn(); });
  navObs.observe(document.body, {childList:true, subtree:true});
  addTimerBtn();
  window.removeLibernavTimer = function() {
    const btn = document.getElementById(BTN_ID);
    if(btn) btn.remove();
    navObs.disconnect();
    delete window.removeLibernavTimer;
  };
})();
