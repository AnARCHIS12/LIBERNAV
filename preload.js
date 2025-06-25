// Fichier de preload Electron (sécurité, isolation du contexte)
const { contextBridge, ipcRenderer } = require('electron');

// Expose les APIs protégées aux scripts du renderer
contextBridge.exposeInMainWorld('electronAPI', {
    // Contrôles de la fenêtre
    window: {
        minimize: () => ipcRenderer.invoke('minimize-window'),
        maximize: () => ipcRenderer.invoke('maximize-window'),
        close: () => ipcRenderer.invoke('close-window')
    },
    
    // Navigation
    navigation: {
        goBack: () => ipcRenderer.send('go-back'),
        goForward: () => ipcRenderer.send('go-forward'),
        reload: () => ipcRenderer.send('reload'),
        loadURL: (url) => ipcRenderer.send('load-url', url)
    },
    
    // Configuration
    config: {
        toggleTor: (enabled) => ipcRenderer.send('toggle-tor', enabled),
        toggleTracker: (enabled) => ipcRenderer.send('toggle-tracker', enabled),
        clearData: () => ipcRenderer.send('clear-data'),
        clearBrowsingData: () => ipcRenderer.invoke('clear-browsing-data')
    },
    
    // Extensions
    extensions: {
        install: async (filePath) => ipcRenderer.invoke('install-extension', filePath),
        list: async () => ipcRenderer.invoke('list-extensions'),
        remove: async (filename) => ipcRenderer.invoke('remove-extension', filename),
        listStore: async () => ipcRenderer.invoke('list-store-extensions'),
        installFromStore: async (filename) => ipcRenderer.invoke('install-store-extension', filename),
    },
    
    clearBrowsingData: () => ipcRenderer.invoke('clear-browsing-data')
});

// Expose certaines APIs du webview de manière sécurisée
contextBridge.exposeInMainWorld('webviewAPI', {
    loadURL: (url) => {
        const webview = document.getElementById('webview');
        if (webview) {
            webview.loadURL(url);
        }
    },
    
    reload: () => {
        const webview = document.getElementById('webview');
        if (webview) {
            webview.reload();
        }
    },
    
    goBack: () => {
        const webview = document.getElementById('webview');
        if (webview && webview.canGoBack()) {
            webview.goBack();
        }
    },
    
    goForward: () => {
        const webview = document.getElementById('webview');
        if (webview && webview.canGoForward()) {
            webview.goForward();
        }
    }
});
