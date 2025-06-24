const { app, BrowserWindow, session, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const torConfig = require('./src/tor-config.js');

const TOR_SOCKS_PORT = 9050;
let torProcess = null;
let mainWindow = null;
let splashWindow = null;

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
        
        // Crée une session temporaire pour la navigation privée
        const privateSession = session.fromPartition('temporary:private');
        
        // Configure le proxy Tor pour la session
        await privateSession.setProxy({
            proxyRules: 'socks5://127.0.0.1:9050',
            proxyBypassRules: 'localhost'
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

        // Une fois l'interface chargée, on initialise le webview avec la page d'accueil
        mainWindow.webContents.on('did-finish-load', () => {
            const homepagePath = path.join(__dirname, 'src', 'home.html');
            const homeUrl = `file://${homepagePath}`;
            mainWindow.webContents.executeJavaScript(`
                document.getElementById('webview').src = "${homeUrl}";
            `);
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

        ipcMain.on('toggle-tor', async (event, enabled) => {
            torEnabled = enabled;
            const privateSession = session.fromPartition('temporary:private');
            if (enabled) {
                await privateSession.setProxy({
                    proxyRules: 'socks5://127.0.0.1:9050',
                    proxyBypassRules: 'localhost'
                });
                console.log('Proxy Tor activé');
            } else {
                await privateSession.setProxy({ proxyRules: '', proxyBypassRules: '' });
                console.log('Proxy Tor désactivé');
            }
        });

        // Blocage simple des trackers (filtrage par URL)
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

        ipcMain.on('toggle-tracker', (event, enabled) => {
            trackerBlockEnabled = enabled;
            const privateSession = session.fromPartition('temporary:private');
            privateSession.webRequest.onBeforeRequest(null); // retire tout filtre précédent
            if (enabled) {
                privateSession.webRequest.onBeforeRequest({ urls: trackerPatterns }, (details, callback) => {
                    callback({ cancel: true });
                });
                console.log('Blocage des trackers activé');
            } else {
                // Pas de blocage
                console.log('Blocage des trackers désactivé');
            }
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
