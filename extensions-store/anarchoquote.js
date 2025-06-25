// Extension Libernav : Générateur de citations anarchistes
(function(){
  if (typeof document === 'undefined') return;
  const BTN_ID = 'libernav-anarchoquote-btn';
  const quotes = [
    "L’anarchie, c’est l’ordre sans le pouvoir. — Proudhon",
    "Ni Dieu ni maître. — Auguste Blanqui",
    "La liberté ne se donne pas, elle se prend. — Louise Michel",
    "L’autorité, c’est l’ennemi. — Sébastien Faure",
    "L’anarchie, c’est la plus haute expression de l’ordre. — Élisée Reclus",
    "La propriété, c’est le vol. — Proudhon",
    "L’obéissance engendre l’esclavage, la révolte la liberté. — Bakounine",
    "L’anarchie, c’est la vie sans chefs. — Albert Libertad",
    "L’éducation est l’arme la plus puissante contre l’autorité. — Francisco Ferrer",
    "L’anarchie, c’est la négation de l’autorité. — Errico Malatesta",
    "La liberté est le droit de faire tout ce que les lois permettent. — Montesquieu",
    "L’anarchie, c’est la société organisée sans autorité. — Malatesta",
    "L’État, c’est la guerre. — Bakounine",
    "L’anarchie, c’est la société sans gouvernement. — Kropotkine",
    "La révolution n’est pas un dîner de gala. — Mao Zedong",
    "La désobéissance est le véritable fondement de la liberté. — Thoreau",
    "La liberté ne se mendie pas, elle se prend. — Louise Michel",
    "L’anarchie, c’est la société des égaux. — Reclus",
    "L’anarchie, c’est la négation de l’autorité et de l’exploitation. — Malatesta",
    "L’anarchie, c’est la société sans domination. — Bakounine",
    "L’anarchie, c’est la société sans hiérarchie. — Kropotkine",
    "L’anarchie, c’est la société sans classes. — Goldman",
    "L’anarchie, c’est la société sans oppression. — Malatesta",
    "L’anarchie, c’est la société sans exploitation. — Reclus",
    "L’anarchie, c’est la société sans violence institutionnelle. — Libertad",
    "L’anarchie, c’est la société sans prisons. — Louise Michel",
    "L’anarchie, c’est la société sans police. — Bakounine",
    "L’anarchie, c’est la société sans armée. — Kropotkine",
    "L’anarchie, c’est la société sans frontières. — Goldman",
    "L’anarchie, c’est la société sans argent. — Reclus",
    "L’anarchie, c’est la société sans propriété privée. — Proudhon",
    "L’anarchie, c’est la société sans salariat. — Malatesta",
    "L’anarchie, c’est la société sans patrons. — Libertad",
    "L’anarchie, c’est la société sans chefs. — Bakounine",
    "L’anarchie, c’est la société sans maîtres. — Louise Michel",
    "L’anarchie, c’est la société sans dieux. — Reclus",
    "L’anarchie, c’est la société sans religions. — Malatesta",
    "L’anarchie, c’est la société sans dogmes. — Goldman",
    "L’anarchie, c’est la société sans préjugés. — Libertad",
    "L’anarchie, c’est la société sans racisme. — Louise Michel",
    "L’anarchie, c’est la société sans sexisme. — Goldman",
    "L’anarchie, c’est la société sans homophobie. — Malatesta",
    "L’anarchie, c’est la société sans transphobie. — Libertad",
    "L’anarchie, c’est la société sans domination de l’homme sur la femme. — Goldman",
    "L’anarchie, c’est la société sans domination de l’adulte sur l’enfant. — Reclus",
    "L’anarchie, c’est la société sans domination de l’humain sur la nature. — Kropotkine",
    "L’anarchie, c’est la société sans domination de l’humain sur l’humain. — Bakounine",
    "L’anarchie, c’est la société sans domination de l’État. — Malatesta",
    "L’anarchie, c’est la société sans domination du capital. — Proudhon",
    "L’anarchie, c’est la société sans domination de la majorité sur la minorité. — Goldman",
    "L’anarchie, c’est la société sans domination de la minorité sur la majorité. — Libertad",
  ];
  function addQuoteBtn() {
    if (document.getElementById(BTN_ID)) return;
    const nav = document.querySelector('.nav-settings');
    if (!nav) return;
    const configBtn = nav.querySelector('#config-btn');
    if (!configBtn) return;
    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.title = 'Citation anarchiste';
    btn.className = 'nav-controls button libernav-ext-btn';
    btn.style.margin = '0 2px';
    btn.textContent = 'Ⓐ';
    btn.onclick = () => {
      const q = quotes[Math.floor(Math.random()*quotes.length)];
      alert(q);
    };
    nav.insertBefore(btn, configBtn);
  }
  const navObs = new MutationObserver(()=>{ if(document.querySelector('.nav-settings')) addQuoteBtn(); });
  navObs.observe(document.body, {childList:true, subtree:true});
  addQuoteBtn();
  window.removeLibernavAnarchoquote = function() {
    const btn = document.getElementById(BTN_ID);
    if(btn) btn.remove();
    navObs.disconnect();
    delete window.removeLibernavAnarchoquote;
  };
})();
