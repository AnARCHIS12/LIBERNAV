<h1 align="center">Libernav</h1>

<p align="center">
  <img src="public/libernav-rouge-noir.svg" alt="Libernav logo" width="90" height="90" />
  <br>
  <img src="https://img.shields.io/badge/exp%C3%A9rimental-en%20d%C3%A9veloppement-orange?style=for-the-badge" alt="Statut expérimental" />
  <img src="https://img.shields.io/badge/uniquement--Linux-blue?style=for-the-badge&logo=linux" alt="Linux uniquement" />
  <img src="https://img.shields.io/badge/licence-MIT-green?style=for-the-badge" alt="Licence MIT" />
</p>

---

<p align="center"><b>Statut : expérimental, en développement</b></p>

---

<p align="center">
  Navigateur web "anarchiste" basé sur Electron et Vite.<br>
  <i>Confidentialité, minimalisme, open source.</i>
</p>

---

## Prérequis

- <b>Uniquement Linux</b>
- Node.js >= 18
- npm
- <b>Tor (obligatoire pour l’intégration Tor et certaines fonctionnalités réseau)</b>

---

## Fonctionnalités principales

- Navigation privée par défaut
- Blocage des trackers
- Intégration Tor
- Interface minimaliste
- Open source

---

## Installation (Linux)

<details>
<summary><b>Voir les étapes</b></summary>

1. <b>Prérequis</b> :
   - Node.js >= 18
   - npm
   - Tor (optionnel, pour l’intégration Tor)

2. <b>Cloner le dépôt</b>

   ```bash
   git clone https://github.com/AnARCHIS12/LIBERNAV
   cd Libernav
   ```

3. <b>Installer les dépendances</b>

   ```bash
   npm install
   ```

4. <b>Démarrer en mode développement</b>

   ```bash
   npm run dev
   ```

</details>

---

## Statut

- Ce projet est expérimental et en cours de développement.
- Utilisation à vos risques et périls.

---

## Licence

MIT

---

## Extensions Libernav (JS)

Libernav permet d’ajouter, d’activer/désactiver et de créer facilement des extensions JavaScript locales, qui s’intègrent nativement à l’interface (boutons dynamiques, fonctionnalités, etc.).

### Installer une extension

1. Ouvrir le menu Extensions (🧩) dans la barre de navigation.
2. Parcourir le mini-store ou cliquer sur « Installer depuis un fichier » pour ajouter un script `.js` dans le dossier `extensions/`.
3. L’extension est immédiatement chargée et peut ajouter des boutons, des fonctionnalités, etc.
4. Pour désactiver ou supprimer une extension, utiliser le menu Extensions (🧩).

### Créer une extension personnalisée

1. Créer un fichier JavaScript dans `extensions-store/` (pour le store local) ou `extensions/` (pour usage direct).
2. Exemple minimal : ajouter un bouton ouvrant un site externe :

```js
(function(){
  function injectWhenNavReady(fn) {
    if (document.querySelector('.nav-settings')) fn();
    else {
      const obs = new MutationObserver(() => {
        if (document.querySelector('.nav-settings')) { obs.disconnect(); fn(); }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }
  if (typeof document !== 'undefined') {
    injectWhenNavReady(() => {
      if (document.getElementById('mon-bouton')) return;
      const nav = document.querySelector('.nav-settings');
      let btn = document.createElement('button');
      btn.id = 'mon-bouton';
      btn.title = 'Mon site';
      btn.innerHTML = '<img src="../public/monlogo.png" style="height:1.2em;width:1.2em;">';
      nav.appendChild(btn);
      btn.onclick = () => window.open('https://monsite.org', '_blank');
    });
    // Fonction de nettoyage à chaud (désactivation immédiate)
    window.removeLibernavMonbouton = function() {
      const b = document.getElementById('mon-bouton');
      if (b) b.remove();
      delete window.removeLibernavMonbouton;
    };
  }
})();
```

- Remplacer les IDs, le logo et l’URL selon vos besoins.
- Pour chaque extension, fournir une fonction `window.removeLibernavNom()` pour permettre la désactivation à chaud.

### Bonnes pratiques
- Utiliser un ID unique pour chaque bouton/élément injecté.
- Nettoyer tout effet lors de la désactivation (suppression du bouton, listeners, etc.).
- Les extensions sont isolées et n’affectent pas le cœur de Libernav.

### Exemples fournis
- Voir le dossier `extensions-store/` pour des exemples (darkmode, clock, notes, todo, weather, translator, chatbot, etc.).

---

## Types d’extensions possibles

Voici quelques exemples d’extensions que vous pouvez créer pour Libernav :

- **Bouton externe** : ajoute un bouton ouvrant un site dans un nouvel onglet (voir InfoLibertaire, DeepL, etc.).
- **Widget utilitaire** : ajoute une horloge, un compteur, une météo, un traducteur, etc. dans l’interface.
- **Barre d’outils** : ajoute des boutons ou menus contextuels dynamiques (ex : darkmode, zoom, wordcount).
- **Blocage ou modification de page** : bloque le clic droit, modifie le DOM, injecte des styles (ex : nocopy, darkmode).
- **Intégration d’API** : affiche des infos issues d’API externes (IP, météo, traducteur, chatbot, etc.).
- **Panneau natif** : ouvre une fenêtre ou un panneau intégré à l’UI (notes, todo, pomodoro, etc.).
- **Ajout de raccourcis** : ajoute des raccourcis clavier ou des actions rapides.

### Exemples de code

#### 1. Bouton ouvrant un site externe
```js
(function(){
  function injectWhenNavReady(fn) {
    if (document.querySelector('.nav-settings')) fn();
    else {
      const obs = new MutationObserver(() => {
        if (document.querySelector('.nav-settings')) { obs.disconnect(); fn(); }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }
  if (typeof document !== 'undefined') {
    injectWhenNavReady(() => {
      if (document.getElementById('mon-bouton')) return;
      const nav = document.querySelector('.nav-settings');
      let btn = document.createElement('button');
      btn.id = 'mon-bouton';
      btn.title = 'Mon site';
      btn.innerHTML = '<img src="../public/monlogo.png" style="height:1.2em;width:1.2em;">';
      nav.appendChild(btn);
      btn.onclick = () => window.open('https://monsite.org', '_blank');
    });
    // Fonction de nettoyage à chaud (désactivation immédiate)
    window.removeLibernavMonbouton = function() {
      const b = document.getElementById('mon-bouton');
      if (b) b.remove();
      delete window.removeLibernavMonbouton;
    };
  }
})();
```

#### 2. Widget (ex : horloge)
```js
(function(){
  function injectWhenNavReady(fn) {
    if (document.querySelector('.nav-settings')) fn();
    else {
      const obs = new MutationObserver(() => {
        if (document.querySelector('.nav-settings')) { obs.disconnect(); fn(); }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }
  if (typeof document !== 'undefined') {
    injectWhenNavReady(() => {
      let clock = document.createElement('div');
      clock.id = 'libernav-clock';
      setInterval(() => {
        clock.textContent = new Date().toLocaleTimeString();
      }, 1000);
      document.body.appendChild(clock);
    });
    // Fonction de nettoyage à chaud (désactivation immédiate)
    window.removeLibernavHorloge = function() {
      const c = document.getElementById('libernav-clock');
      if (c) c.remove();
      delete window.removeLibernavHorloge;
    };
  }
})();
```

#### 3. Modification de page (ex : darkmode)
```js
(function(){
  function injectWhenNavReady(fn) {
    if (document.querySelector('.nav-settings')) fn();
    else {
      const obs = new MutationObserver(() => {
        if (document.querySelector('.nav-settings')) { obs.disconnect(); fn(); }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }
  if (typeof document !== 'undefined') {
    injectWhenNavReady(() => {
      document.body.style.background = '#222';
      document.body.style.color = '#eee';
    });
    // Fonction de nettoyage à chaud (désactivation immédiate)
    window.removeLibernavDarkmode = function() {
      document.body.removeAttribute('style');
      delete window.removeLibernavDarkmode;
    };
  }
})();
```

#### 4. Panneau natif (ex : notes)
```js
(function(){
  function injectWhenNavReady(fn) {
    if (document.querySelector('.nav-settings')) fn();
    else {
      const obs = new MutationObserver(() => {
        if (document.querySelector('.nav-settings')) { obs.disconnect(); fn(); }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }
  if (typeof document !== 'undefined') {
    injectWhenNavReady(() => {
      let notes = document.createElement('textarea');
      notes.id = 'libernav-notes';
      notes.placeholder = 'Vos notes ici...';
      document.body.appendChild(notes);
    });
    // Fonction de nettoyage à chaud (désactivation immédiate)
    window.removeLibernavNotes = function() {
      const n = document.getElementById('libernav-notes');
      if (n) n.remove();
      delete window.removeLibernavNotes;
    };
  }
})();
```

Pour plus d’exemples, voir le dossier `extensions-store/`.

---

## Idées d’extensions utiles pour Libernav

Voici quelques propositions d’extensions JavaScript à ajouter ou développer pour enrichir Libernav :

- **Bloc-notes rapide** : zone de texte persistante pour prendre des notes sur la page d’accueil.
- **Horloge/Calendrier** : affichage de l’heure et de la date, voire agenda minimal.
- **Météo locale** : widget météo avec géolocalisation ou choix manuel de la ville.
- **Traducteur** : bouton pour traduire la page courante ou du texte sélectionné (DeepL, LibreTranslate, etc.).
- **Chatbot IA** : accès direct à un chatbot (DuckDuckGo, LLM local, etc.).
- **Mode sombre/clair** : bouton pour basculer le thème de l’interface.
- **Compteur de mots** : outil pour compter les mots d’un texte sélectionné.
- **Zoom rapide** : boutons pour agrandir/réduire la taille du texte de la page.
- **Blocage du clic droit** : protection anti-copie ou anti-interaction.
- **Pomodoro** : minuteur de productivité avec notifications.
- **IP publique** : affichage de l’adresse IP publique et du pays.
- **Ajout de favoris/applications rapides** : menu pour ajouter jusqu’à 5 apps ou favoris rapides maximum affichés.
- **Lecteur RSS** : affichage des derniers articles de flux RSS choisis.
- **Panneau d’actualités** : agrégateur d’infos alternatives (InfoLibertaire, CNT-AIT, etc.).
- **Gestionnaire de tâches** : todo-list simple intégrée à la page d’accueil.
- **Barre de recherche multi-moteurs** : SearX, Whoogle, Mojeek, etc.
- **Intégration Mastodon/Peertube** : accès rapide à des réseaux sociaux libres.
- **Générateur de mot de passe** : outil pour créer des mots de passe forts.

Pour chaque idée, il est possible de créer une extension JS indépendante, activable/désactivable à chaud, et intégrée nativement à l’UI.

---
