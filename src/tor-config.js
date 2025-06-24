const { SocksProxyAgent } = require('socks-proxy-agent');
const torRequest = require('tor-request');
const { spawn } = require('child_process');

const TOR_PROXY = 'socks5h://127.0.0.1:9050';

class TorConfig {
    constructor() {
        this.agent = new SocksProxyAgent(TOR_PROXY);
        // Utilisation du stockage local au lieu d'electron-store
        this.isEnabled = true; // Par défaut activé
        this.torProcess = null;
        this._installAttempted = false; // Nouveau : suit les tentatives d'installation
    }

    startTor() {
        if (this.torProcess) return; // Déjà lancé
        try {
            this.torProcess = spawn('tor', [], { stdio: 'ignore', detached: true });
            this.torProcess.unref();
            console.log('Processus Tor lancé.');
        } catch (err) {
            // Optimisation : ne tente l'installation automatique qu'une seule fois
            if (!this._installAttempted) {
                this._installAttempted = true;
                console.error('Impossible de lancer Tor. Tentative d’installation automatique...');
                const install = spawn('x-terminal-emulator', ['-e', 'bash', '-c', 'echo "Installation de Tor..."; sudo apt install tor -y; read -p "Appuyez sur Entrée pour fermer..."'], { detached: true, stdio: 'ignore' });
                install.unref();
            } else {
                console.error('Tor n’a pas pu être lancé après tentative d’installation.');
            }
            this.torProcess = null;
        }
    }

    stopTor() {
        if (this.torProcess) {
            process.kill(-this.torProcess.pid);
            this.torProcess = null;
            console.log('Processus Tor arrêté.');
        }
    }

    enable() {
        this.isEnabled = true;
        this.startTor();
    }

    disable() {
        this.isEnabled = false;
        this.stopTor();
    }

    getAgent() {
        return this.isEnabled ? this.agent : null;
    }

    async testConnection() {
        return new Promise((resolve, reject) => {
            torRequest.request('https://check.torproject.org', (err, res, body) => {
                if (err) {
                    console.error('Erreur de connexion Tor:', err);
                    reject(err);
                    return;
                }
                const isConnected = body?.includes('Congratulations') || false;
                console.log('Connexion Tor:', isConnected ? 'OK' : 'Échec');
                resolve(isConnected);
            });
        });
    }
}

const torConfig = new TorConfig();
torConfig.startTor(); // Lance Tor automatiquement au démarrage
module.exports = torConfig;
