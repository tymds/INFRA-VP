const fs = require('fs-extra');
const executeScpCommand = require('../../utils/scp');
const config = require('../../config/config.json');
const logger = require('../../utils/logger');

async function restore(backupName) {
  const { user, host, path } = config.remote;
  const remotePath = `${path}/${backupName}`;
  const localRestorePath = '/home/user/restored';

  try {
    await fs.ensureDir(localRestorePath);
    
    const source = `${user}@${host}:${remotePath}`;
    await executeScpCommand(source, localRestorePath);
    
    logger.success('Restauration terminée avec succès');
  } catch (error) {
    logger.error('Échec de la restauration:', error);
    throw error;
  }
}

module.exports = restore;