const cron = require('node-cron');
const createBackup = require('./create');
const uploadBackup = require('./upload');
const StorageManager = require('./storage-manager');
const config = require('../../config/config.json');
const logger = require('../../utils/logger');

const storageManager = new StorageManager(config);

async function performBackup() {
  try {
    await storageManager.checkDiskSpace();
    const backupFolder = await createBackup();
    await uploadBackup(backupFolder);
    await storageManager.cleanOldBackups();
  } catch (error) {
    logger.error('Echec de la sauvegarde complète:', error);
  }
}

function initializeScheduler() {
  cron.schedule('0 2 * * *', performBackup);
  logger.info('Planificateur de sauvegarde initialisé');
}

module.exports = initializeScheduler;