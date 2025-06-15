# Système de Sauvegarde Automatique

Un système pour automatiser vos sauvegardes locales et distantes.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation par Système d'Exploitation](#installation-par-système-dexploitation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du Projet](#structure-du-projet)

## 🔧 Prérequis

- Node.js (v14.14 ou supérieure)
- Git
- Accès SSH au serveur distant
- Un éditeur de code (VSCode recommandé)

## 💻 Installation par Système d'Exploitation

### Windows

1. **Installation des outils**
```powershell
# Installer Node.js
winget install OpenJS.NodeJS

# Installer Git
winget install Git.Git

# Installer Visual Studio Code
winget install Microsoft.VisualStudioCode
```

2. **Installation de OpenSSH**
```powershell
# Ouvrir PowerShell en administrateur
Add-WindowsCapability -Online -Name OpenSSH.Client
```

3. **Cloner le projet**
```powershell
git clone [URL_DU_PROJET]
cd INFRA-VP
npm install
```

### Linux

1. **Installation des outils**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm git

# Fedora
sudo dnf install nodejs npm git

# Arch Linux
sudo pacman -S nodejs npm git
```

2. **Cloner le projet**
```bash
git clone [URL_DU_PROJET]
cd INFRA-VP
npm install
```

## ⚙️ Configuration

### Configuration par Système

#### Windows
```powershell
# Créer le fichier de configuration
copy config.example.json config.json

# Éditer avec Notepad
notepad config.json
```

#### Linux
```bash
# Créer le fichier de configuration
cp config.example.json config.json

# Éditer avec nano
nano config.json
```

### Structure du fichier config.json

```json
{
  "pathsToBackup": [
    "C:/Users/MonUtilisateur/Documents",  // Windows
    "/home/user/Documents"                // Linux
  ],
  "backupDestination": "D:/backups",      // Windows
  // "backupDestination": "/mnt/backups", // Linux
  "remote": {
    "user": "votre_utilisateur",
    "host": "ip_serveur",
    "path": "/chemin/distant"
  },
  "maxBackups": 7,
  "minRequiredSpace": 1073741824
}
```

## 🚀 Utilisation

### Dans Visual Studio Code

1. Ouvrir le projet
```bash
code INFRA-VP
```

2. Utiliser le terminal intégré (Ctrl+`)
```bash
npm start
```

### Lancement du service

#### Windows
```powershell
# Créer un service Windows
sc.exe create "BackupSystem" binPath= "C:\Program Files\nodejs\node.exe C:\chemin\vers\INFRA-VP\index.js"
sc.exe start "BackupSystem"
```

#### Linux
```bash
# Utiliser systemd (voir section précédente)
sudo systemctl start backup-system
```

### Visual Studio Code
- **Problème de terminal** : `Ctrl+Shift+P` > "Terminal: Select Default Profile"
- **Problème de git** : `Ctrl+Shift+G` pour ouvrir le panneau Git
- **Debugger** : F5 pour lancer le débogage

## 📁 Structure du Projet

```
INFRA-VP/
├── src/
│   ├── backup/
│   │   ├── create.js       # Création des sauvegardes
│   │   ├── scheduler.js    # Planification des sauvegardes
│   │   └── storage-manager.js # Gestion du stockage
│   └── restore/
│       └── index.js        # Restauration des sauvegardes
├── utils/
│   ├── logger.js          # Logging
│   └── scp.js            # Transfert SSH
├── config.json           # Configuration
└── index.js             # Point d'entrée
```

### Logs

Pour suivre l'activité du système :
```bash
# Avec systemd
sudo journalctl -u backup-system -f

# Avec PM2
pm2 logs backup-system
```

## 📝 Notes importantes

- Testez régulièrement la restauration des sauvegardes
- Vérifiez périodiquement les logs
- Gardez une copie sécurisée de votre configuration
- Ne modifiez pas les fichiers pendant une sauvegarde