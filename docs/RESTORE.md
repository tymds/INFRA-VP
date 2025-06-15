# Guide de Restauration des Sauvegardes

## Table des matières
- [Prérequis](#prérequis)
- [Format des sauvegardes](#format-des-sauvegardes)
- [Procédure de restauration](#procédure-de-restauration)
- [Dépannage](#dépannage)

## Prérequis

- Accès au serveur de sauvegarde distant
- Node.js installé sur la machine locale
- Clés SSH configurées

## Format des sauvegardes

Les sauvegardes sont stockées dans le format suivant :
```
backup-YYYY-MM-DDTHH-mm-ss-ZZZZ/
├── Documents/
└── config.json
```

## Procédure de restauration

### 1. Lister les sauvegardes disponibles

```bash
# Sur le serveur distant
ssh user@192.168.1.10 "ls -l /home/user/sauvegardes"
```

### 2. Restaurer une sauvegarde

#### Via npm (Méthode recommandée)
```bash
# Syntaxe
npm run restore backup-[DATE]

# Exemple
npm run restore backup-2025-06-15T14-30-00-0000
```

#### Manuellement
```bash
# 1. Se placer dans le dossier du projet
cd INFRA-VP

# 2. Lancer la restauration via Node.js
node -e 'require("./src/restore").restore("backup-2025-06-15T14-30-00-0000")'
```

### 3. Vérifier la restauration

Les fichiers seront restaurés dans le dossier `/home/user/restored/`

```bash
# Lister les fichiers restaurés
ls -la /home/user/restored
```

## Validation de la restauration

1. Vérifier l'intégrité des fichiers :
```bash
# Comparer les tailles des fichiers
du -sh /home/user/restored/*

# Vérifier les permissions
ls -l /home/user/restored
```

2. Tester les fichiers restaurés avant de les utiliser en production

## Dépannage

### Erreurs courantes

1. **Erreur de connexion SSH**
```bash
# Vérifier la connexion SSH
ssh -T user@192.168.1.10

# Vérifier les clés SSH
ssh-add -l
```

2. **Permissions insuffisantes**
```bash
# Corriger les permissions du dossier de restauration
sudo chown -R $USER:$USER /home/user/restored
chmod 755 /home/user/restored
```

3. **Espace disque insuffisant**
```bash
# Vérifier l'espace disponible
df -h /home/user/restored
```

### Logs de restauration

Pour voir les logs pendant la restauration :
```bash
# Dans un nouveau terminal
tail -f /var/log/syslog | grep backup-system
```

## Notes importantes

- ⚠️ Ne pas interrompre le processus de restauration
- 📝 Toujours vérifier les logs en cas d'erreur
- 🔒 Vérifier les permissions après restauration
- 📦 S'assurer d'avoir assez d'espace disque

## Support

En cas de problème :
1. Consulter les logs (`journalctl -u backup-system`)
2. Vérifier la configuration dans `config.json`
3. S'assurer que le serveur distant est accessible
4. Contacter l'administrateur système si nécessaire