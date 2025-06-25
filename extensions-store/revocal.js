// Extension Libernav : Calendrier révolutionnaire
(function(){
  if (typeof document === 'undefined') return;
  const BTN_ID = 'libernav-revocal-btn';
  function republicanDate() {
    const months = ["Vendémiaire","Brumaire","Frimaire","Nivôse","Pluviôse","Ventôse","Germinal","Floréal","Prairial","Messidor","Thermidor","Fructidor"];
    const days = ["Primidi","Duodi","Tridi","Quartidi","Quintidi","Sextidi","Septidi","Octidi","Nonidi","Décadi"];
    const ref = new Date('1792-09-22T00:00:00Z');
    const now = new Date();
    const diff = Math.floor((now - ref) / 86400000);
    const year = Math.floor(diff / 365.2425) + 1;
    const dayOfYear = diff % 365;
    const month = Math.floor(dayOfYear / 30);
    const day = dayOfYear % 30;
    return days[day%10] + ' ' + (day+1) + ' ' + months[month] + ' An ' + year;
  }
  function addBtn() {
    if (document.getElementById(BTN_ID)) return;
    const nav = document.querySelector('.nav-settings');
    if (!nav) return;
    const configBtn = nav.querySelector('#config-btn');
    if (!configBtn) return;
    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.title = 'Calendrier révolutionnaire';
    btn.className = 'nav-controls button libernav-ext-btn';
    btn.style.margin = '0 2px';
    btn.textContent = '📅';
    btn.onclick = () => {
      alert('Aujourd’hui (calendrier révolutionnaire) :\n' + republicanDate());
    };
    nav.insertBefore(btn, configBtn);
  }
  const navObs = new MutationObserver(()=>{ if(document.querySelector('.nav-settings')) addBtn(); });
  navObs.observe(document.body, {childList:true, subtree:true});
  addBtn();
  window.removeLibernavRevocal = function() {
    const btn = document.getElementById(BTN_ID);
    if(btn) btn.remove();
    navObs.disconnect();
    delete window.removeLibernavRevocal;
  };
})();
