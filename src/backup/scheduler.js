const cron = require('node-cron');
const createBackup = require('./create');
const uploadBackup = require('./upload');
const logger = require('../../utils/logger');

async function performBackup() {
  try {
    const backupFolder = await createBackup();
    await uploadBackup(backupFolder);
  } catch (error) {
    logger.error('Echec de la sauvegarde complète:', error);
  }
}

function initializeScheduler() {
  cron.schedule('0 2 * * *', performBackup);
  logger.info('Planificateur de sauvegarde initialisé');
}

module.exports = initializeScheduler;