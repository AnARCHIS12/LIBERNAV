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
        const getIpDirect = () => new Promise((resolve) => {
            // Requête directe sans Tor pour obtenir l'IP réelle
            require('https').get('https://api.ipify.org', (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data.trim()));
            }).on('error', () => resolve('Erreur'));
        });

        return new Promise(async (resolve, reject) => {
            // 1. IP réelle (hors Tor)
            const realIp = await getIpDirect();
            console.log('IP réelle (hors Tor) :', realIp);

            // 2. IP via Tor (proxy forcé)
            torRequest.setTorAddress('127.0.0.1', 9050); // force le proxy
            torRequest.request({
                url: 'https://check.torproject.org',
                agentClass: require('socks-proxy-agent'),
                agentOptions: { hostname: '127.0.0.1', port: 9050, protocol: 'socks5:' }
            }, (err, res, body) => {
                if (err) {
                    console.error('Erreur de connexion Tor:', err);
                    reject(err);
                    return;
                }
                const isConnected = body?.includes('Congratulations') || false;
                console.log('Connexion Tor:', isConnected ? 'OK' : 'Échec');
                if (isConnected) {
                    let ipMatch = body.match(/Your IP address appears to be: ([0-9a-fA-F:.]+)/);
                    if (!ipMatch) ipMatch = body.match(/<strong>([0-9a-fA-F:.]+)<\/strong>/);
                    if (!ipMatch) ipMatch = body.match(/([0-9]{1,3}(?:\.[0-9]{1,3}){3})/);
                    if (ipMatch && ipMatch[1]) {
                        console.log('IP publique via Tor :', ipMatch[1]);
                        if (ipMatch[1] === realIp) {
                            console.warn('ATTENTION : L’IP via Tor est identique à l’IP réelle. Le trafic ne passe PAS par Tor !');
                        } else {
                            console.log('Le trafic passe bien par Tor.');
                        }
                    } else {
                        console.log("Impossible d'extraire l'IP publique depuis la réponse Tor. Début du body :", body?.slice(0, 200));
                    }
                }
                resolve(isConnected);
            });
        });
    }
}

const torConfig = new TorConfig();
torConfig.startTor(); // Lance Tor automatiquement au démarrage
module.exports = torConfig;
