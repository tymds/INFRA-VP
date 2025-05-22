const initializeScheduler = require('./src/backup/scheduler');
const logger = require('./utils/logger');

try {
  initializeScheduler();
  logger.info('Service de sauvegarde démarré');
} catch (error) {
  logger.error('Erreur lors du démarrage du service', error);
  process.exit(1);
}