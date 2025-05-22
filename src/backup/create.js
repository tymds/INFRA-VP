const fs = require('fs-extra');
const path = require('path');
const config = require('../../config/config.json');
const logger = require('../../utils/logger');

async function createBackup() {
  try {
    const date = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFolder = path.join(config.backupDestination, `backup-${date}`);

    await fs.ensureDir(backupFolder);

    for (const src of config.pathsToBackup) {
      const baseName = path.basename(src);
      const dest = path.join(backupFolder, baseName);
      await fs.copy(src, dest);
      logger.success(`Sauvegarde complétée: ${src} -> ${dest}`);
    }

    return backupFolder;
  } catch (error) {
    logger.error('Echec de la sauvegarde:', error);
    throw error;
  }
}

module.exports = createBackup;