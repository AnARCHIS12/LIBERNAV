// Gestion de l'interface utilisateur
document.addEventListener('DOMContentLoaded', () => {
    // Éléments de l'interface
    const webview = document.getElementById('webview');
    const urlInput = document.getElementById('url-input');
    const goBtn = document.getElementById('go-btn');
    const configBtn = document.getElementById('config-btn');
    const configMenu = document.getElementById('config-menu');
    const closeConfigBtn = document.getElementById('close-config');
    const searchEngineBtn = document.getElementById('search-engine-btn');
    const searchEnginesMenu = document.getElementById('search-engines-menu');
    const extensionsBtn = document.getElementById('extensions-btn');
    const extensionsMenu = document.getElementById('extensions-menu');
    const closeExtensionsBtn = document.getElementById('close-extensions');
    const translatorBtn = document.getElementById('translator-btn');

    // Configuration des moteurs de recherche
    const searchEngines = {
        duckduckgo: {
            name: 'DuckDuckGo',
            icon: '🦆',
            searchUrl: 'https://duckduckgo.com/?q=',
            baseUrl: 'https://duckduckgo.com'
        },
        searx: {
            name: 'SearX',
            icon: '🔍',
            searchUrl: 'https://searx.be/search?q=',
            baseUrl: 'https://searx.be'
        },
        qwant: {
            name: 'Qwant',
            icon: '🌍',
            searchUrl: 'https://www.qwant.com/?q=',
            baseUrl: 'https://www.qwant.com'
        },
        startpage: {
            name: 'Startpage',
            icon: '🔒',
            searchUrl: 'https://www.startpage.com/do/search?q=',
            baseUrl: 'https://www.startpage.com'
        },
        mojeek: {
            name: 'Mojeek',
            icon: '🌐',
            searchUrl: 'https://www.mojeek.com/search?q=',
            baseUrl: 'https://www.mojeek.com'
        }
    };

    // État actuel
    let currentSearchEngine = localStorage.getItem('searchEngine') || 'duckduckgo';
    
    // Mise à jour de l'icône du moteur de recherche
    function updateSearchEngineButton() {
        const engine = searchEngines[currentSearchEngine];
        searchEngineBtn.textContent = `${engine.icon}`;
        searchEngineBtn.title = `Moteur de recherche actuel : ${engine.name}`;
    }

    // Initialisation du menu des moteurs de recherche
    function initSearchEngineMenu() {
        const menu = document.createElement('div');
        menu.id = 'search-engines-menu';
        menu.className = 'hidden';
        
        Object.entries(searchEngines).forEach(([id, engine]) => {
            const item = document.createElement('div');
            item.className = 'search-engine-item';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'search-engine';
            radio.value = id;
            radio.checked = id === currentSearchEngine;
            
            const label = document.createElement('label');
            label.textContent = `${engine.icon} ${engine.name}`;
            
            item.appendChild(radio);
            item.appendChild(label);
            menu.appendChild(item);
            
            radio.addEventListener('change', () => {
                currentSearchEngine = id;
                localStorage.setItem('searchEngine', id);
                updateSearchEngineButton();
                menu.classList.add('hidden');
            });
        });
        
        document.body.appendChild(menu);
        return menu;
    }

    // Navigation et recherche
    function loadURL(url) {
        if (!url.trim()) return;
        
        try {
            // Vérifier si c'est une URL valide
            new URL(url);
            webview.loadURL(url);
        } catch {
            // Si ce n'est pas une URL valide, faire une recherche
            const engine = searchEngines[currentSearchEngine];
            const searchUrl = engine.searchUrl + encodeURIComponent(url);
            webview.loadURL(searchUrl);
        }
    }

    // Initialisation
    updateSearchEngineButton();
    const searchMenu = initSearchEngineMenu();

    // Gestionnaires d'événements
    searchEngineBtn.addEventListener('click', (e) => {
        const rect = searchEngineBtn.getBoundingClientRect();
        searchMenu.style.top = `${rect.bottom + 5}px`;
        searchMenu.style.left = `${rect.left}px`;
        searchMenu.classList.toggle('hidden');
        e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
        if (!searchMenu.contains(e.target) && e.target !== searchEngineBtn) {
            searchMenu.classList.add('hidden');
        }
    });

    // Navigation
    goBtn.addEventListener('click', () => {
        console.log('Bouton Go cliqué');
        loadURL(urlInput.value);
    });

    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            console.log('Touche Entrée pressée');
            loadURL(urlInput.value);
        }
    });

    // Gestion du menu de configuration
    configBtn.addEventListener('click', () => {
        console.log('Menu config ouvert');
        configMenu.classList.toggle('hidden');
    });

    if (closeConfigBtn) {
        closeConfigBtn.addEventListener('click', () => {
            console.log('Menu config fermé');
            configMenu.classList.add('hidden');
        });
    }

    // Gestion des réglages
    const torToggle = document.getElementById('tor-toggle');
    const trackerToggle = document.getElementById('tracker-toggle');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const clearDataBtn = document.getElementById('clear-data');

    if (torToggle) {
        torToggle.addEventListener('change', (e) => {
            console.log('Tor toggle:', e.target.checked);
            document.getElementById('tor-status').innerHTML = 
                `${e.target.checked ? '🟢' : '🔴'} Tor`;
            if (window.electronAPI && window.electronAPI.config && window.electronAPI.config.toggleTor) {
                window.electronAPI.config.toggleTor(e.target.checked);
            }
        });
    }

    if (trackerToggle) {
        trackerToggle.addEventListener('change', (e) => {
            console.log('Tracker toggle:', e.target.checked);
            document.getElementById('tracker-status').innerHTML = 
                `${e.target.checked ? '🟢' : '🔴'} Anti-trackers`;
            if (window.electronAPI && window.electronAPI.config && window.electronAPI.config.toggleTracker) {
                window.electronAPI.config.toggleTracker(e.target.checked);
            }
        });
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', (e) => {
            console.log('Dark mode toggle:', e.target.checked);
            if (e.target.checked) {
                webview.insertCSS(`
                    body {
                        background-color:rgb(255, 255, 255) !important;
                        color: #e8eaed !important;
                    }
                    a { color:rgb(243, 22, 22) !important; }
                `);
            } else {
                webview.reload();
            }
        });
    }

    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            console.log('Demande de nettoyage des données');
            if (window.electronAPI && window.electronAPI.clearBrowsingData) {
                window.electronAPI.clearBrowsingData().then(() => {
                    alert('Données de navigation effacées');
                }).catch((err) => {
                    alert('Erreur lors de l\'effacement des données : ' + err);
                });
            } else {
                alert('Fonctionnalité non disponible.');
            }
        });
    }

    // Synchronisation de l’état des toggles avec la réalité (Tor et anti-trackers)
    if (torToggle) {
        // Toujours coché et désactivé car Tor est obligatoire
        torToggle.checked = true;
        torToggle.disabled = true;
        torToggle.title = "Tor est toujours activé pour la sécurité";
    }
    if (trackerToggle) {
        trackerToggle.checked = true;
        trackerToggle.disabled = false;
        trackerToggle.title = "Active/désactive le blocage des trackers";
    }

    // Affichage visuel du statut anti-trackers dans la barre de statut
    function updateTrackerStatusUI(enabled) {
        const trackerStatus = document.getElementById('tracker-status');
        if (trackerStatus) {
            trackerStatus.innerHTML = enabled ? '🟢 Anti-trackers (ON)' : '🔴 Anti-trackers (OFF)';
            trackerStatus.style.opacity = enabled ? '1' : '0.5';
        }
    }
    // Initialisation de l’état visuel
    updateTrackerStatusUI(true);

    if (trackerToggle) {
        trackerToggle.addEventListener('change', (e) => {
            console.log('Tracker toggle:', e.target.checked);
            updateTrackerStatusUI(e.target.checked);
            if (window.electronAPI && window.electronAPI.config && window.electronAPI.config.toggleTracker) {
                window.electronAPI.config.toggleTracker(e.target.checked);
            }
        });
    }

    // Mise à jour de l'URL dans la barre d'adresse
    webview.addEventListener('did-navigate', (event) => {
        console.log('Navigation vers:', event.url);
        urlInput.value = event.url;
        if (event.url.startsWith('file://')) {
            urlInput.value = '';
            urlInput.placeholder = 'Rechercher ou entrer une adresse';
        }
    });

    webview.addEventListener('did-navigate-in-page', (event) => {
        urlInput.value = event.url;
    });

    // Gestion des erreurs
    webview.addEventListener('did-fail-load', (event) => {
        if (event.errorCode !== -3) { // Ignore les erreurs d'annulation
            console.error('Erreur de chargement:', event);
            webview.loadURL(`data:text/html,
                <html>
                    <body style="font-family: sans-serif; padding: 20px; color: white; background: #202124;">
                        <h2>Erreur de chargement</h2>
                        <p>Impossible de charger la page.</p>
                        <p>Code d'erreur: ${event.errorCode}</p>
                        <p>URL: ${event.validatedURL}</p>
                    </body>
                </html>`);
        }
    });

    // Contrôles de fenêtre
    document.getElementById('minimize-btn').addEventListener('click', async () => {
        await window.electronAPI.window.minimize();
    });

    document.getElementById('maximize-btn').addEventListener('click', async () => {
        await window.electronAPI.window.maximize();
    });

    document.getElementById('close-btn').addEventListener('click', async () => {
        await window.electronAPI.window.close();
    });

    // Contrôles de navigation (retour, suivant, actualiser)
    const backBtn = document.getElementById('back-btn');
    const forwardBtn = document.getElementById('forward-btn');
    const reloadBtn = document.getElementById('reload-btn');

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (webview.canGoBack()) webview.goBack();
        });
    }
    if (forwardBtn) {
        forwardBtn.addEventListener('click', () => {
            if (webview.canGoForward()) webview.goForward();
        });
    }
    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            webview.reload();
        });
    }

    // Gestion de l'installation d'extension
    const installForm = document.getElementById('install-extension-form');
    const extensionFileInput = document.getElementById('extension-file');
    const installMsg = document.getElementById('extension-install-msg');
    if (installForm && extensionFileInput) {
        installForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            installMsg.textContent = '';
            const file = extensionFileInput.files[0];
            if (!file) {
                installMsg.textContent = 'Aucun fichier sélectionné.';
                return;
            }
            // Récupère le chemin local du fichier sélectionné
            const filePath = file.path;
            if (!filePath) {
                installMsg.textContent = 'Impossible de lire le chemin du fichier.';
                return;
            }
            installMsg.textContent = 'Installation...';
            const result = await window.electronAPI.extensions.install(filePath);
            installMsg.textContent = result.success ? 'Extension installée !' : 'Erreur : ' + result.message;
        });
    }

    // Gestion de l'installation d'extension Chrome Store
    const chromeStoreForm = document.getElementById('install-chrome-store-form');
    const chromeStoreUrlInput = document.getElementById('chrome-store-url');
    const chromeStoreMsg = document.getElementById('chrome-store-install-msg');
    if (chromeStoreForm && chromeStoreUrlInput) {
        chromeStoreForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            chromeStoreMsg.textContent = '';
            const url = chromeStoreUrlInput.value.trim();
            if (!url) {
                chromeStoreMsg.textContent = 'Aucune URL fournie.';
                return;
            }
            chromeStoreMsg.textContent = 'Téléchargement...';
            const result = await window.electronAPI.chromeStore.install(url);
            chromeStoreMsg.textContent = result.success ? 'Extension installée !' : 'Erreur : ' + result.message;
        });
    }

    // Gestion de la liste des extensions JS installées
    const jsExtensionsList = document.getElementById('js-extensions-list');
    function refreshJsExtensionsList() {
        if (!jsExtensionsList) return;
        jsExtensionsList.innerHTML = '<span style="color:#aaa;font-size:0.97em;">Chargement…</span>';
        if (window.electronAPI && window.electronAPI.extensions && window.electronAPI.extensions.list) {
            window.electronAPI.extensions.list().then(list => {
                if (!list || !Array.isArray(list) || list.length === 0) {
                    jsExtensionsList.innerHTML = '<span style="color:#aaa;font-size:0.97em;">Aucune extension JS installée.</span>';
                    return;
                }
                jsExtensionsList.innerHTML = '';
                list.forEach(ext => {
                    const div = document.createElement('div');
                    div.style.display = 'flex';
                    div.style.alignItems = 'center';
                    div.style.justifyContent = 'space-between';
                    div.style.gap = '10px';
                    div.style.marginBottom = '4px';
                    div.innerHTML = `<span style='font-size:1.05em;'>${ext}</span>`;
                    const delBtn = document.createElement('button');
                    delBtn.textContent = '🗑️';
                    delBtn.title = 'Supprimer';
                    delBtn.style.background = '#a33';
                    delBtn.style.color = '#fff';
                    delBtn.style.border = 'none';
                    delBtn.style.borderRadius = '4px';
                    delBtn.style.padding = '2px 8px';
                    delBtn.style.cursor = 'pointer';
                    delBtn.onclick = async () => {
                        if (confirm(`Supprimer l’extension « ${ext} » ?`)) {
                            await window.electronAPI.extensions.remove(ext);
                            refreshJsExtensionsList();
                        }
                    };
                    div.appendChild(delBtn);
                    jsExtensionsList.appendChild(div);
                });
            });
        } else {
            jsExtensionsList.innerHTML = '<span style="color:#aaa;font-size:0.97em;">Non supporté.</span>';
        }
    }

    // Gestion de la liste des extensions du store local
    const storeExtensionsList = document.getElementById('store-extensions-list');
    function refreshStoreExtensionsList() {
        if (!storeExtensionsList) return;
        storeExtensionsList.innerHTML = '<span style="color:#aaa;font-size:0.97em;">Chargement…</span>';
        if (window.electronAPI && window.electronAPI.extensions && window.electronAPI.extensions.listStore) {
            window.electronAPI.extensions.listStore().then(list => {
                if (!list || !Array.isArray(list) || list.length === 0) {
                    storeExtensionsList.innerHTML = '<span style="color:#aaa;font-size:0.97em;">Aucune extension disponible.</span>';
                    return;
                }
                storeExtensionsList.innerHTML = '<b>Extensions disponibles :</b>';
                list.forEach(ext => {
                    const div = document.createElement('div');
                    div.style.display = 'flex';
                    div.style.alignItems = 'center';
                    div.style.justifyContent = 'space-between';
                    div.style.gap = '10px';
                    div.style.marginBottom = '4px';
                    div.innerHTML = `<span style='font-size:1.05em;'>${ext.replace('.js','')}</span>`;
                    const installBtn = document.createElement('button');
                    installBtn.textContent = 'Installer';
                    installBtn.title = 'Installer cette extension';
                    installBtn.style.background = 'var(--accent-color)';
                    installBtn.style.color = '#fff';
                    installBtn.style.border = 'none';
                    installBtn.style.borderRadius = '4px';
                    installBtn.style.padding = '2px 10px';
                    installBtn.style.cursor = 'pointer';
                    installBtn.onclick = async () => {
                        await window.electronAPI.extensions.installFromStore(ext);
                        refreshJsExtensionsList();
                    };
                    div.appendChild(installBtn);
                    storeExtensionsList.appendChild(div);
                });
            });
        } else {
            storeExtensionsList.innerHTML = '<span style="color:#aaa;font-size:0.97em;">Non supporté.</span>';
        }
    }
    // Rafraîchir la liste à l’ouverture du menu Extensions
    if (extensionsBtn) {
        extensionsBtn.addEventListener('click', () => {
            refreshJsExtensionsList();
            refreshStoreExtensionsList();
            extensionsMenu.classList.toggle('hidden');
        });
    }
    if (closeExtensionsBtn && extensionsMenu) {
        closeExtensionsBtn.addEventListener('click', () => {
            extensionsMenu.classList.add('hidden');
        });
    }

    if (translatorBtn) {
        // Si le panneau existe déjà (créé par l'extension), on le toggle
        translatorBtn.addEventListener('click', () => {
            const panel = document.getElementById('libernav-translator');
            if (panel) {
                panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
            }
        });
    }

    console.log('Initialisation du renderer terminée');
});
