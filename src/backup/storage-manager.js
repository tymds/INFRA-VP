const fs = require('fs-extra');
const path = require('path');
const logger = require('../../utils/logger');
const { execSync } = require('child_process');

class StorageManager {
  constructor(config) {
    this.maxBackups = config.maxBackups || 7;
    this.backupPath = config.backupDestination;
    this.minRequiredSpace = config.minRequiredSpace || 1024 * 1024 * 1024; // 1GB par défaut
  }

  async cleanOldBackups() {
    try {
      const backups = await fs.readdir(this.backupPath);
      const sortedBackups = backups
        .filter(b => b.startsWith('backup-'))
        .sort((a, b) => b.localeCompare(a));

      // Garde les fichiers les plus récents.
      const toDelete = sortedBackups.slice(this.maxBackups);
      
      for (const backup of toDelete) {
        const fullPath = path.join(this.backupPath, backup);
        await fs.remove(fullPath);
        logger.info(`Ancienne sauvegarde supprimée: ${backup}`);
      }
    } catch (error) {
      logger.error('Erreur lors du nettoyage des sauvegardes:', error);
    }
  }

  async checkDiskSpace() {
    try {
      // Information sur l'espace disque disponible
      const df = execSync(`df -m "${this.backupPath}"`).toString();
      const lines = df.trim().split('\n');
      const [, stats] = lines;
      const [, , , available] = stats.trim().split(/\s+/);
      
      // Conversion en octets
      const availableBytes = parseInt(available) * 1024 * 1024;

      if (availableBytes < this.minRequiredSpace) {
        const availableGb = (availableBytes / (1024 * 1024 * 1024)).toFixed(2);
        const requiredGb = (this.minRequiredSpace / (1024 * 1024 * 1024)).toFixed(2);
        throw new Error(
          `Espace disque insuffisant. Disponible: ${availableGb}GB, Requis: ${requiredGb}GB`
        );
      }

      logger.info(`Espace disque vérifié: ${(availableBytes / (1024 * 1024 * 1024)).toFixed(2)}GB disponible`);
      return true;
    } catch (error) {
      logger.error('Erreur lors de la vérification de l\'espace disque:', error);
      throw error;
    }
  }
}

module.exports = StorageManager;