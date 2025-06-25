const adblockEnabledSessions = new WeakSet();
const { app, BrowserWindow, session, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const torConfig = require('./src/tor-config.js');
const { ElectronBlocker } = require('@ghostery/adblocker-electron');
const fetch = require('cross-fetch');
const { addExtension } = require('electron-chrome-extensions');

const TOR_SOCKS_PORT = 9050;
let torProcess = null;
let mainWindow = null;
let splashWindow = null;

app.commandLine.appendSwitch('proxy-server', 'socks5://127.0.0.1:9050');

async function startTor() {
    return new Promise((resolve, reject) => {
        console.log('Démarrage du service Tor...');
        torProcess = spawn('tor', [], { stdio: 'ignore' });
        
        torProcess.on('error', (err) => {
            console.error('Erreur au démarrage de Tor:', err);
            dialog.showErrorBox('Erreur Tor', 
                'Le service Tor n\'a pas pu être lancé. Veuillez vérifier que Tor est installé sur votre système.');
            reject(err);
        });

        // Attendre que Tor démarre
        setTimeout(() => {
            console.log('Service Tor démarré');
            resolve();
        }, 5000);
    });
}

async function createWindow() {
    try {
        // Affiche le splashscreen
        splashWindow = new BrowserWindow({
            width: 400,
            height: 420,
            frame: false,
            transparent: false,
            alwaysOnTop: true,
            resizable: false,
            show: true,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
            }
        });
        splashWindow.loadFile('src/splash.html');

        await startTor();
        console.log('Test de la connexion Tor...');
        const isTorWorking = await torConfig.testConnection();
        if (!isTorWorking) {
            throw new Error('La connexion à Tor a échoué');
        }
        console.log('Connexion Tor établie avec succès');
        
        // Crée une session persistante pour Tor
        const torSession = session.fromPartition('persist:tor');
        await torSession.setProxy({
            proxyRules: 'socks5://127.0.0.1:9050',
            proxyBypassRules: 'localhost,127.0.0.1'
        });

        // Crée une session temporaire pour la navigation privée
        const privateSession = session.fromPartition('temporary:private');
        await privateSession.setProxy({
            proxyRules: 'socks5://127.0.0.1:9050',
            proxyBypassRules: 'localhost,127.0.0.1'
        });

        // Détermination du chemin absolu de l'icône (préférence 256x256 pour Linux)
        let iconPath = path.join(__dirname, 'icons', 'icon-256x256.png');
        const fs = require('fs');
        if (!fs.existsSync(iconPath)) {
            iconPath = path.join(__dirname, 'icons', 'icon-512x512.png');
            if (!fs.existsSync(iconPath)) {
                dialog.showErrorBox('Icône manquante', 'Aucune icône compatible trouvée dans le dossier icons.');
            }
        }
        mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            frame: false,
            title: "Libernav",
            icon: iconPath, // Utilisation du chemin absolu correct
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                webviewTag: true,
                preload: path.join(__dirname, 'preload.js')
            }
        });
        mainWindow.setMenu(null); // Suppression de la barre de menu native

        // Désactiver l'ouverture automatique des outils de développement
        mainWindow.webContents.on('devtools-opened', () => {
            mainWindow.webContents.closeDevTools();
        });

        // Chargement de l'interface
        mainWindow.loadFile('src/ui.html');
        mainWindow.once('ready-to-show', () => {
            if (splashWindow) {
                splashWindow.close();
                splashWindow = null;
            }
            mainWindow.show();
        });

        // Affichage de la page d'accueil et injection des extensions JS à chaque chargement effectif du renderer
        mainWindow.webContents.on('did-finish-load', () => {
            // 1. Affiche la page d'accueil dans le webview
            const homepagePath = path.join(__dirname, 'src', 'home.html');
            const homeUrl = `file://${homepagePath}`;
            mainWindow.webContents.executeJavaScript(`
                document.getElementById('webview').src = "${homeUrl}";
            `);
            // 2. Injecte les extensions JS
            injectExtensionsInRenderer();
        });

        // Gestionnaires IPC pour les contrôles de fenêtre
        ipcMain.handle('minimize-window', () => {
            mainWindow.minimize();
        });

        ipcMain.handle('maximize-window', () => {
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
        });

        ipcMain.handle('close-window', () => {
            mainWindow.close();
            if (torProcess) {
                torProcess.kill();
            }
        });

        ipcMain.handle('clear-browsing-data', async () => {
            try {
                const privateSession = session.fromPartition('temporary:private');
                await privateSession.clearCache();
                await privateSession.clearStorageData({
                    storages: [
                        'appcache', 'cookies', 'filesystem', 'indexdb', 'localstorage',
                        'shadercache', 'websql', 'serviceworkers'
                    ],
                    quotas: ['temporary', 'persistent', 'syncable']
                });
                return true;
            } catch (err) {
                console.error('Erreur lors de l\'effacement des données :', err);
                throw err;
            }
        });

        // Gestion dynamique du proxy Tor
        let torEnabled = true;
        let trackerBlockEnabled = true;
        let adBlocker = null;
        // Pour chaque session, on garde une référence au listener pour pouvoir le retirer proprement
        const trackerListeners = new Map();

        // Initialisation du bloqueur Adblock (EasyList)
        ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then(blocker => {
            adBlocker = blocker;
            // On active le blocage une seule fois par session (Ghostery ne supporte pas plusieurs activations)
            if (!torSession.__adblockInjected) {
                try {
                    adBlocker.enableBlockingInSession(torSession);
                    torSession.__adblockInjected = true;
                } catch (err) {
                    console.warn('Adblock déjà injecté sur torSession :', err.message);
                }
            }
            if (!privateSession.__adblockInjected) {
                try {
                    adBlocker.enableBlockingInSession(privateSession);
                    privateSession.__adblockInjected = true;
                } catch (err) {
                    console.warn('Adblock déjà injecté sur privateSession :', err.message);
                }
            }
            if (trackerBlockEnabled) {
                console.log('Adblock activé sur toutes les sessions');
            } else {
                adBlocker.disableBlockingInSession(torSession);
                adBlocker.disableBlockingInSession(privateSession);
                console.log('Adblock désactivé sur toutes les sessions');
            }
        }).catch(err => {
            console.error('Erreur lors de l\'initialisation d\'Adblocker :', err);
        });

        // Fonction pour activer/désactiver dynamiquement le blocage Adblock
        // ATTENTION : enableBlockingInSession NE DOIT ÊTRE APPELÉ QU'UNE FOIS PAR SESSION !
        // Pour réactiver après un disable, il faut recharger la page ou la session.
        function updateAdBlocker() {
            if (!adBlocker) return;
            if (trackerBlockEnabled) {
                // Impossible de réactiver dynamiquement, il faut recharger la page pour réappliquer le blocage
                console.log('Adblock activé (rechargez la page pour réappliquer le blocage)');
            } else {
                adBlocker.disableBlockingInSession(torSession);
                adBlocker.disableBlockingInSession(privateSession);
                console.log('Adblock désactivé');
            }
        }

        const trackerPatterns = [
            '*://*.doubleclick.net/*',
            '*://*.google-analytics.com/*',
            '*://*.googletagmanager.com/*',
            '*://*.facebook.com/*',
            '*://*.facebook.net/*',
            '*://*.twitter.com/*',
            '*://*.adservice.google.com/*',
            '*://*.scorecardresearch.com/*',
            '*://*.quantserve.com/*',
            '*://*.adsafeprotected.com/*',
            '*://*.adnxs.com/*',
            '*://*.criteo.com/*',
            '*://*.taboola.com/*',
            '*://*.outbrain.com/*',
            '*://*.mathtag.com/*',
            '*://*.moatads.com/*',
            '*://*.advertising.com/*',
            '*://*.adform.net/*',
            '*://*.pubmatic.com/*',
            '*://*.openx.net/*',
            '*://*.rubiconproject.com/*',
            '*://*.yieldmo.com/*',
            '*://*.casalemedia.com/*',
            '*://*.bluekai.com/*',
            '*://*.eyeota.net/*',
            '*://*.bidswitch.net/*',
            '*://*.bidr.io/*',
            '*://*.simpli.fi/*',
            '*://*.adroll.com/*',
            '*://*.serving-sys.com/*',
            '*://*.ml314.com/*',
            '*://*.trustarc.com/*',
            '*://*.truste.com/*',
            '*://*.privacy-mgmt.com/*',
            '*://*.onetrust.com/*',
            '*://*.cookielaw.org/*',
            '*://*.cookiebot.com/*',
            '*://*.quantcast.com/*',
            '*://*.consensu.org/*',
            '*://*.adzerk.net/*',
            '*://*.adition.com/*',
            '*://*.adscale.de/*',
            '*://*.adspirit.de/*',
            '*://*.adtech.de/*',
            '*://*.adtechus.com/*',
            '*://*.advertising.com/*',
            '*://*.advertserve.com/*',
            '*://*.adxpansion.com/*',
            '*://*.adzerk.net/*',
            '*://*.analytics.yahoo.com/*',
            '*://*.atdmt.com/*',
            '*://*.btrll.com/*',
            '*://*.casalemedia.com/*',
            '*://*.contextweb.com/*',
            '*://*.demdex.net/*',
            '*://*.dotomi.com/*',
            '*://*.doubleverify.com/*',
            '*://*.exelator.com/*',
            '*://*.fastclick.net/*',
            '*://*.gemius.pl/*',
            '*://*.googleadservices.com/*',
            '*://*.googleapis.com/ads/*',
            '*://*.googlesyndication.com/*',
            '*://*.googletagservices.com/*',
            '*://*.gstatic.com/ads/*',
            '*://*.imrworldwide.com/*',
            '*://*.invitemedia.com/*',
            '*://*.krxd.net/*',
            '*://*.lijit.com/*',
            '*://*.liveintent.com/*',
            '*://*.media6degrees.com/*',
            '*://*.mediaplex.com/*',
            '*://*.mediamath.com/*',
            '*://*.mfadsrvr.com/*',
            '*://*.ml314.com/*',
            '*://*.moat.com/*',
            '*://*.moatads.com/*',
            '*://*.openx.net/*',
            '*://*.outbrain.com/*',
            '*://*.pubmatic.com/*',
            '*://*.quantcast.com/*',
            '*://*.rfihub.com/*',
            '*://*.rubiconproject.com/*',
            '*://*.scorecardresearch.com/*',
            '*://*.serving-sys.com/*',
            '*://*.simpli.fi/*',
            '*://*.sitescout.com/*',
            '*://*.spotxchange.com/*',
            '*://*.taboola.com/*',
            '*://*.teads.tv/*',
            '*://*.trustarc.com/*',
            '*://*.turn.com/*',
            '*://*.weborama.fr/*',
            '*://*.yieldmo.com/*',
            '*://*.zeotap.com/*'
        ];

        // Fonction pour retirer le listener existant
        function removeTrackerListener(sessionObj) {
            const prevListener = trackerListeners.get(sessionObj);
            if (prevListener) {
                sessionObj.webRequest.onBeforeRequest(null, prevListener);
                trackerListeners.delete(sessionObj);
            }
        }

        // Fonction pour appliquer ou retirer dynamiquement le blocage
        function applyTrackerBlock(sessionObj, label) {
            removeTrackerListener(sessionObj);
            if (trackerBlockEnabled) {
                const listener = (details, callback) => {
                    callback({ cancel: true });
                };
                sessionObj.webRequest.onBeforeRequest({ urls: trackerPatterns }, listener);
                trackerListeners.set(sessionObj, listener);
                console.log('Blocage des trackers activé pour', label);
            } else {
                console.log('Blocage des trackers désactivé pour', label);
            }
        }

        // Initialisation au démarrage
        applyTrackerBlock(torSession, 'persist:tor');
        applyTrackerBlock(privateSession, 'temporary:private');

        ipcMain.on('toggle-tracker', (event, enabled) => {
            trackerBlockEnabled = enabled;
            updateAdBlocker();
        });

        // Autoriser la géolocalisation avec confirmation utilisateur
        session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
            if (permission === 'geolocation') {
                dialog.showMessageBox({
                    type: 'question',
                    buttons: ['Autoriser', 'Refuser'],
                    defaultId: 1,
                    title: 'Géolocalisation',
                    message: 'Une extension souhaite accéder à votre position pour afficher la météo locale. Autoriser ?'
                }).then(result => {
                    callback(result.response === 0); // 0 = Autoriser, 1 = Refuser
                });
            } else {
                callback(false);
            }
        });

        // Interception des ouvertures de fenêtres secondaires pour forcer l'icône Libernav
        mainWindow.webContents.setWindowOpenHandler(({ url }) => {
            const child = new BrowserWindow({
                width: 1000,
                height: 800,
                icon: path.join(__dirname, 'icons', 'icon-256x256.png'),
                frame: true, // Barre Electron native
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                    enableRemoteModule: false,
                    webviewTag: true,
                    preload: path.join(__dirname, 'preload.js'),
                    session: session.fromPartition('persist:tor') // Force l'utilisation de Tor pour les fenêtres secondaires
                }
            });
            child.setMenu(null); // Suppression de la barre de menu native
            child.loadURL(url);
            child.show();
            return { action: 'deny' };
        });

    } catch (error) {
        console.error('Erreur lors de la création de la fenêtre:', error);
        dialog.showErrorBox('Erreur', 
            'Une erreur est survenue lors du démarrage de l\'application: ' + error.message);
        app.quit();
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (torProcess) {
        torProcess.kill();
    }
    app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

const EXTENSIONS_DIR = path.join(__dirname, 'extensions');

function loadExtensions() {
    const fs = require('fs');
    if (!fs.existsSync(EXTENSIONS_DIR)) return;
    const files = fs.readdirSync(EXTENSIONS_DIR);
    files.filter(f => f.endsWith('.js')).forEach(f => {
        try {
            require(path.join(EXTENSIONS_DIR, f));
            console.log(`Extension chargée : ${f}`);
        } catch (e) {
            console.error(`Erreur lors du chargement de l'extension ${f} :`, e);
        }
    });
}

function loadChromeExtensions() {
    const fs = require('fs');
    const chromeExtDir = path.join(__dirname, 'chrome-extensions');
    if (!fs.existsSync(chromeExtDir)) return;
    const dirs = fs.readdirSync(chromeExtDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => path.join(chromeExtDir, d.name));
    dirs.forEach(dir => {
        try {
            addExtension(dir);
            console.log('Extension Chrome chargée :', dir);
        } catch (e) {
            console.error('Erreur chargement extension Chrome :', dir, e);
        }
    });
}

// Injecte toutes les extensions JS dans le renderer (webview principal)
function injectExtensionsInRenderer() {
    if (!mainWindow) return;
    const fs = require('fs');
    if (!fs.existsSync(EXTENSIONS_DIR)) return;
    const files = fs.readdirSync(EXTENSIONS_DIR).filter(f => f.endsWith('.js'));
    files.forEach(f => {
        const code = fs.readFileSync(path.join(EXTENSIONS_DIR, f), 'utf8');
        mainWindow.webContents.executeJavaScript(code).then(() => {
            console.log(`Extension injectée dans le renderer : ${f}`);
        }).catch(e => {
            console.error(`Erreur injection extension ${f} :`, e);
        });
    });
}

// Appeler le chargement des extensions au démarrage
loadExtensions();
app.whenReady().then(() => {
    loadChromeExtensions();
    // Injection des extensions JS dans le renderer après le chargement de la fenêtre
    if (mainWindow) {
        injectExtensionsInRenderer();
    } else {
        // Si la fenêtre n'est pas encore prête, attendre l'événement
        app.on('browser-window-created', () => {
            injectExtensionsInRenderer();
        });
    }
});

// Après installation d'une extension, injecter immédiatement dans le renderer
ipcMain.handle('install-extension', async (event, filePath) => {
    const fs = require('fs');
    const destPath = path.join(EXTENSIONS_DIR, path.basename(filePath));
    try {
        fs.copyFileSync(filePath, destPath);
        require(destPath); // Charger immédiatement côté main
        injectExtensionsInRenderer(); // Injection côté renderer
        return { success: true, message: 'Extension installée.' };
    } catch (e) {
        return { success: false, message: e.message };
    }
});

// Handler unique pour l'installation depuis le store local
ipcMain.handle('install-store-extension', async (event, filename) => {
    try {
        const storeDir = path.join(__dirname, 'extensions-store');
        const fs = require('fs');
        const src = path.join(storeDir, filename);
        const dest = path.join(__dirname, 'extensions', filename);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            require(dest);
            injectExtensionsInRenderer();
            return { success: true };
        }
        return { success: false, message: 'Fichier introuvable' };
    } catch (e) {
        return { success: false, message: e.message };
    }
});
ipcMain.handle('list-extensions', async () => {
    try {
        const fs = require('fs');
        if (!fs.existsSync(EXTENSIONS_DIR)) return [];
        return fs.readdirSync(EXTENSIONS_DIR).filter(f => f.endsWith('.js'));
    } catch (e) {
        return [];
    }
});
ipcMain.handle('remove-extension', async (event, filename) => {
    try {
        const fs = require('fs');
        const filePath = path.join(EXTENSIONS_DIR, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            // Injection du code de nettoyage dans le renderer
            if (mainWindow) {
                // Convention : nom du fichier clock.js => window.removeLibernavClock()
                const base = path.basename(filename, '.js');
                // CamelCase : clock => LibernavClock, darkmode => LibernavDarkmode, notes => LibernavNotes
                const fn = 'removeLibernav' + base.charAt(0).toUpperCase() + base.slice(1);
                mainWindow.webContents.executeJavaScript(`window.${fn} && window.${fn}();`).then(() => {
                    console.log(`Nettoyage de l'extension : ${fn}`);
                }).catch(e => {
                    console.warn(`Aucune fonction de nettoyage trouvée pour ${fn}`);
                });
            }
            return { success: true };
        }
        return { success: false, message: 'Fichier introuvable' };
    } catch (e) {
        return { success: false, message: e.message };
    }
});
ipcMain.handle('list-chrome-extensions', async () => {
    try {
        const chromeExtDir = path.join(__dirname, 'chrome-extensions');
        const fs = require('fs');
        if (!fs.existsSync(chromeExtDir)) return [];
        return fs.readdirSync(chromeExtDir, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => d.name);
    } catch (e) {
        return [];
    }
});
ipcMain.handle('remove-chrome-extension', async (event, dirname) => {
    try {
        const chromeExtDir = path.join(__dirname, 'chrome-extensions');
        const dirPath = path.join(chromeExtDir, dirname);
        const fs = require('fs');
        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
            return { success: true };
        }
        return { success: false, message: 'Dossier introuvable' };
    } catch (e) {
        return { success: false, message: e.message };
    }
});
ipcMain.handle('list-store-extensions', async () => {
    try {
        const storeDir = path.join(__dirname, 'extensions-store');
        const fs = require('fs');
        if (!fs.existsSync(storeDir)) return [];
        return fs.readdirSync(storeDir).filter(f => f.endsWith('.js'));
    } catch (e) {
        return [];
    }
});
